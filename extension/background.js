// Background Service Worker for iMacros Extension
// Handles macro execution, storage, and communication between components

class MacroEngine {
  constructor() {
    this.isRecording = false;
    this.isPlaying = false;
    this.currentMacro = null;
    this.recordedActions = [];
    this.variables = new Map();
    this.extractedData = [];
    this.playbackSpeed = 1;
    this.currentTabId = null;
  }

  async startRecording(tabId) {
    this.isRecording = true;
    this.recordedActions = [];
    this.currentTabId = tabId;
    
    // Inject content script if needed
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });

    // Notify content script to start recording
    await chrome.tabs.sendMessage(tabId, { 
      action: 'startRecording' 
    });

    return { success: true };
  }

  stopRecording() {
    this.isRecording = false;
    const macro = {
      name: `Macro_${Date.now()}`,
      code: this.generateMacroCode(),
      created: new Date().toISOString(),
      actions: [...this.recordedActions]
    };
    this.recordedActions = [];
    return macro;
  }

  recordAction(action) {
    if (this.isRecording) {
      this.recordedActions.push(action);
    }
  }

  generateMacroCode() {
    let code = `VERSION BUILD=1.0.0 RECORDER=CR\n`;
    code += `TAB T=1\n`;
    
    for (const action of this.recordedActions) {
      code += this.actionToCommand(action) + '\n';
    }
    
    return code;
  }

  actionToCommand(action) {
    switch (action.type) {
      case 'url':
        return `URL GOTO=${action.url}`;
      
      case 'click':
        if (action.xpath) {
          return `TAG XPATH="${action.xpath}" CONTENT=EVENT:CLICK`;
        }
        return `TAG POS=${action.pos || 1} TYPE=${action.tagType} ATTR=${action.attr} CONTENT=EVENT:CLICK`;
      
      case 'input':
        const content = action.value.includes(' ') ? `"${action.value}"` : action.value;
        if (action.xpath) {
          return `TAG XPATH="${action.xpath}" CONTENT=${content}`;
        }
        return `TAG POS=${action.pos || 1} TYPE=${action.tagType} ATTR=${action.attr} CONTENT=${content}`;
      
      case 'select':
        if (action.xpath) {
          return `TAG XPATH="${action.xpath}" CONTENT=%${action.value}`;
        }
        return `TAG POS=${action.pos || 1} TYPE=SELECT ATTR=${action.attr} CONTENT=%${action.value}`;
      
      case 'wait':
        return `WAIT SECONDS=${action.seconds || 1}`;
      
      case 'extract':
        return `TAG POS=${action.pos || 1} TYPE=${action.tagType} ATTR=${action.attr} EXTRACT=TXT`;
      
      default:
        return `'Unknown action: ${action.type}`;
    }
  }

  async playMacro(macro, tabId, options = {}) {
    this.isPlaying = true;
    this.currentMacro = macro;
    this.currentTabId = tabId;
    this.variables.clear();
    this.extractedData = [];
    this.playbackSpeed = options.speed || 1;

    try {
      const commands = this.parseMacroCode(macro.code);
      
      for (let i = 0; i < commands.length; i++) {
        if (!this.isPlaying) break;
        
        const command = commands[i];
        await this.executeCommand(command, tabId);
        
        // Notify progress
        chrome.runtime.sendMessage({
          action: 'playbackProgress',
          current: i + 1,
          total: commands.length
        }).catch(() => {});
      }

      this.isPlaying = false;
      return { 
        success: true, 
        extractedData: this.extractedData 
      };
    } catch (error) {
      this.isPlaying = false;
      throw error;
    }
  }

  stopPlayback() {
    this.isPlaying = false;
    this.currentMacro = null;
  }

  parseMacroCode(code) {
    const lines = code.split('\n');
    const commands = [];

    for (let line of lines) {
      line = line.trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith("'") || line.startsWith('//')) {
        continue;
      }

      const command = this.parseCommandLine(line);
      if (command) {
        commands.push(command);
      }
    }

    return commands;
  }

  parseCommandLine(line) {
    // Parse command and parameters
    const spaceIndex = line.indexOf(' ');
    if (spaceIndex === -1) {
      return { type: line.toLowerCase(), params: {} };
    }

    const type = line.substring(0, spaceIndex).toLowerCase();
    const paramsStr = line.substring(spaceIndex + 1);
    const params = this.parseParams(paramsStr);

    return { type, params, raw: line };
  }

  parseParams(paramsStr) {
    const params = {};
    const regex = /(\w+)=(?:"([^"]*)"|([^\s]+))/g;
    let match;

    while ((match = regex.exec(paramsStr)) !== null) {
      const key = match[1].toLowerCase();
      const value = match[2] !== undefined ? match[2] : match[3];
      params[key] = this.replaceVariables(value);
    }

    return params;
  }

  replaceVariables(value) {
    if (typeof value !== 'string') return value;
    
    // Replace {{variable}} syntax
    return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return this.variables.get(varName) || match;
    });
  }

  async executeCommand(command, tabId) {
    switch (command.type) {
      case 'version':
        // Metadata, skip
        break;

      case 'tab':
        await this.executeTab(command.params, tabId);
        break;

      case 'url':
        await this.executeUrl(command.params, tabId);
        break;

      case 'tag':
        await this.executeTag(command.params, tabId);
        break;

      case 'wait':
        await this.executeWait(command.params);
        break;

      case 'set':
        this.executeSet(command.params);
        break;

      case 'extract':
        await this.executeExtract(command.params, tabId);
        break;

      case 'saveas':
        await this.executeSaveAs(command.params);
        break;

      default:
        console.warn('Unknown command:', command.type);
    }
  }

  async executeTab(params, tabId) {
    if (params.t) {
      // Switch to tab or create new one
      const tabNumber = parseInt(params.t);
      if (tabNumber > 1) {
        const newTab = await chrome.tabs.create({});
        this.currentTabId = newTab.id;
      }
    }
    if (params.close) {
      await chrome.tabs.remove(tabId);
    }
  }

  async executeUrl(params, tabId) {
    if (params.goto) {
      await chrome.tabs.update(tabId, { url: params.goto });
      // Wait for page to load
      await this.waitForPageLoad(tabId);
    }
  }

  async executeTag(params, tabId) {
    // Send command to content script for execution
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'executeTag',
      params: params
    });

    if (params.extract) {
      this.extractedData.push(response.extractedValue);
    }

    return response;
  }

  async executeWait(params) {
    const seconds = parseFloat(params.seconds || 1);
    const ms = (seconds * 1000) / this.playbackSpeed;
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  executeSet(params) {
    // SET !VAR1 value or SET !DATASOURCE filename.csv
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith('!')) {
        const varName = key.substring(1);
        this.variables.set(varName, value);
      }
    }
  }

  async executeExtract(params, tabId) {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'extract',
      params: params
    });
    
    this.extractedData.push(response.value);
  }

  async executeSaveAs(params) {
    if (params.type === 'extract' && params.folder) {
      const data = this.extractedData.join('\n');
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      await chrome.downloads.download({
        url: url,
        filename: params.folder
      });
    }
  }

  waitForPageLoad(tabId) {
    return new Promise((resolve) => {
      const listener = (details) => {
        if (details.tabId === tabId && details.frameId === 0) {
          chrome.webNavigation.onCompleted.removeListener(listener);
          setTimeout(resolve, 500); // Additional buffer
        }
      };
      chrome.webNavigation.onCompleted.addListener(listener);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        chrome.webNavigation.onCompleted.removeListener(listener);
        resolve();
      }, 30000);
    });
  }
}

// Initialize engine
const engine = new MacroEngine();

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.action) {
        case 'startRecording':
          const tab = await chrome.tabs.query({ active: true, currentWindow: true });
          const result = await engine.startRecording(tab[0].id);
          sendResponse(result);
          break;

        case 'stopRecording':
          const macro = engine.stopRecording();
          sendResponse({ success: true, macro });
          break;

        case 'recordAction':
          engine.recordAction(message.actionData);
          sendResponse({ success: true });
          break;

        case 'playMacro':
          const playTab = await chrome.tabs.query({ active: true, currentWindow: true });
          const playResult = await engine.playMacro(
            message.macro, 
            playTab[0].id,
            message.options
          );
          sendResponse(playResult);
          break;

        case 'stopPlayback':
          engine.stopPlayback();
          sendResponse({ success: true });
          break;

        case 'getStatus':
          sendResponse({
            isRecording: engine.isRecording,
            isPlaying: engine.isPlaying
          });
          break;

        case 'saveMacro':
          await chrome.storage.local.get(['macros'], (data) => {
            const macros = data.macros || [];
            macros.push(message.macro);
            chrome.storage.local.set({ macros }, () => {
              sendResponse({ success: true });
            });
          });
          return true; // Keep channel open for async response

        case 'getMacros':
          chrome.storage.local.get(['macros'], (data) => {
            sendResponse({ macros: data.macros || [] });
          });
          return true;

        case 'deleteMacro':
          chrome.storage.local.get(['macros'], (data) => {
            const macros = data.macros || [];
            const filtered = macros.filter(m => m.name !== message.macroName);
            chrome.storage.local.set({ macros: filtered }, () => {
              sendResponse({ success: true });
            });
          });
          return true;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ error: error.message });
    }
  })();
  
  return true; // Keep message channel open for async response
});

// Keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-recording') {
    if (engine.isRecording) {
      const macro = engine.stopRecording();
      chrome.runtime.sendMessage({ 
        action: 'recordingStopped', 
        macro 
      }).catch(() => {});
    } else {
      const tab = await chrome.tabs.query({ active: true, currentWindow: true });
      await engine.startRecording(tab[0].id);
      chrome.runtime.sendMessage({ 
        action: 'recordingStarted' 
      }).catch(() => {});
    }
  } else if (command === 'play-macro') {
    // Get last played macro from storage and play it
    chrome.storage.local.get(['lastPlayedMacro'], async (data) => {
      if (data.lastPlayedMacro) {
        const tab = await chrome.tabs.query({ active: true, currentWindow: true });
        await engine.playMacro(data.lastPlayedMacro, tab[0].id);
      }
    });
  }
});

console.log('iMacros Extension Background Service Worker Loaded');
