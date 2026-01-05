// Background Service Worker - Manages extension lifecycle and communication

class MacroManager {
  constructor() {
    this.macros = new Map();
    this.currentPlayback = null;
    this.currentRecording = null;
    this.variables = new Map();
    this.init();
  }

  async init() {
    // Load saved macros from storage
    const data = await chrome.storage.local.get(['macros', 'variables', 'settings']);
    if (data.macros) {
      this.macros = new Map(Object.entries(data.macros));
    }
    if (data.variables) {
      this.variables = new Map(Object.entries(data.variables));
    }
    this.settings = data.settings || this.getDefaultSettings();
  }

  getDefaultSettings() {
    return {
      timeout: 60,
      replaySpeed: 1,
      errorHandling: 'stop',
      highlightElements: true,
      showTooltips: true,
      logLevel: 'info'
    };
  }

  async saveMacros() {
    await chrome.storage.local.set({
      macros: Object.fromEntries(this.macros)
    });
  }

  async saveVariables() {
    await chrome.storage.local.set({
      variables: Object.fromEntries(this.variables)
    });
  }

  async saveMacro(name, content, description = '') {
    this.macros.set(name, {
      name,
      content,
      description,
      created: Date.now(),
      modified: Date.now()
    });
    await this.saveMacros();
    return true;
  }

  getMacro(name) {
    return this.macros.get(name);
  }

  getAllMacros() {
    return Array.from(this.macros.values());
  }

  async deleteMacro(name) {
    this.macros.delete(name);
    await this.saveMacros();
    return true;
  }

  setVariable(name, value) {
    this.variables.set(name, value);
    this.saveVariables();
  }

  getVariable(name) {
    return this.variables.get(name);
  }
}

const macroManager = new MacroManager();
let recordingState = {
  isRecording: false,
  events: [],
  startTime: null,
  tabId: null
};

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async response
});

async function handleMessage(message, sender, sendResponse) {
  try {
    switch (message.action) {
      case 'startRecording':
        await startRecording(sender.tab);
        sendResponse({ success: true });
        break;

      case 'stopRecording':
        const macro = await stopRecording();
        sendResponse({ success: true, macro });
        break;

      case 'recordEvent':
        recordEvent(message.event);
        sendResponse({ success: true });
        break;

      case 'playMacro':
        await playMacro(message.macroName, message.content, sender.tab);
        sendResponse({ success: true });
        break;

      case 'stopPlayback':
        stopPlayback();
        sendResponse({ success: true });
        break;

      case 'saveMacro':
        await macroManager.saveMacro(message.name, message.content, message.description);
        sendResponse({ success: true });
        break;

      case 'getMacro':
        const macro = macroManager.getMacro(message.name);
        sendResponse({ success: true, macro });
        break;

      case 'getAllMacros':
        const macros = macroManager.getAllMacros();
        sendResponse({ success: true, macros });
        break;

      case 'deleteMacro':
        await macroManager.deleteMacro(message.name);
        sendResponse({ success: true });
        break;

      case 'setVariable':
        macroManager.setVariable(message.name, message.value);
        sendResponse({ success: true });
        break;

      case 'getVariable':
        const value = macroManager.getVariable(message.name);
        sendResponse({ success: true, value });
        break;

      case 'getStatus':
        sendResponse({
          success: true,
          isRecording: recordingState.isRecording,
          isPlaying: macroManager.currentPlayback !== null
        });
        break;

      case 'exportMacro':
        await exportMacro(message.name);
        sendResponse({ success: true });
        break;

      case 'importMacro':
        await importMacro(message.content);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function startRecording(tab) {
  recordingState = {
    isRecording: true,
    events: [],
    startTime: Date.now(),
    tabId: tab?.id || null
  };

  // Notify content script to start recording
  if (tab?.id) {
    await chrome.tabs.sendMessage(tab.id, {
      action: 'startRecording'
    });
  }

  // Broadcast status
  broadcastStatus();
}

async function stopRecording() {
  recordingState.isRecording = false;
  const events = [...recordingState.events];

  // Notify content script
  if (recordingState.tabId) {
    await chrome.tabs.sendMessage(recordingState.tabId, {
      action: 'stopRecording'
    });
  }

  // Convert events to macro format
  const macro = eventsToMacro(events);

  recordingState.events = [];
  broadcastStatus();

  return macro;
}

function recordEvent(event) {
  if (!recordingState.isRecording) return;

  recordingState.events.push({
    ...event,
    timestamp: Date.now() - recordingState.startTime
  });
}

function eventsToMacro(events) {
  let macroLines = [];

  macroLines.push('VERSION BUILD=1.0.0');
  macroLines.push('');

  for (const event of events) {
    switch (event.type) {
      case 'click':
        if (event.selector) {
          macroLines.push(`TAG ${event.selector}`);
        }
        break;

      case 'input':
        if (event.selector && event.value) {
          macroLines.push(`TAG ${event.selector}`);
          macroLines.push(`CONTENT=${event.value}`);
        }
        break;

      case 'navigate':
        macroLines.push(`URL GOTO=${event.url}`);
        break;

      case 'wait':
        macroLines.push(`WAIT SECONDS=${Math.round(event.duration / 1000)}`);
        break;

      case 'extract':
        macroLines.push(`TAG ${event.selector} EXTRACT=TXT`);
        break;
    }
  }

  return macroLines.join('\n');
}

async function playMacro(macroName, content, tab) {
  if (macroManager.currentPlayback) {
    throw new Error('Another macro is already playing');
  }

  const tabId = tab?.id || (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
  if (!tabId) {
    throw new Error('No active tab found');
  }

  macroManager.currentPlayback = {
    macroName,
    tabId,
    startTime: Date.now()
  };

  try {
    // Send macro to content script for execution
    await chrome.tabs.sendMessage(tabId, {
      action: 'playMacro',
      content,
      settings: macroManager.settings
    });
  } catch (error) {
    macroManager.currentPlayback = null;
    throw error;
  }

  broadcastStatus();
}

function stopPlayback() {
  if (!macroManager.currentPlayback) return;

  const { tabId } = macroManager.currentPlayback;

  chrome.tabs.sendMessage(tabId, {
    action: 'stopPlayback'
  }).catch(() => {});

  macroManager.currentPlayback = null;
  broadcastStatus();
}

async function exportMacro(name) {
  const macro = macroManager.getMacro(name);
  if (!macro) {
    throw new Error('Macro not found');
  }

  const exportData = JSON.stringify(macro, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  await chrome.downloads.download({
    url,
    filename: `${name}.iim`,
    saveAs: true
  });
}

async function importMacro(content) {
  try {
    const macro = JSON.parse(content);
    await macroManager.saveMacro(macro.name, macro.content, macro.description);
  } catch (error) {
    throw new Error('Invalid macro file format');
  }
}

function broadcastStatus() {
  const status = {
    isRecording: recordingState.isRecording,
    isPlaying: macroManager.currentPlayback !== null,
    eventCount: recordingState.events.length
  };

  // Broadcast to all extension pages
  chrome.runtime.sendMessage({
    action: 'statusUpdate',
    status
  }).catch(() => {});
}

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'record-from-here',
    title: 'Start Recording Macro',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'record-from-here') {
    await startRecording(tab);
  }
});

// Tab events for navigation recording
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (recordingState.isRecording && details.frameId === 0) {
    recordEvent({
      type: 'navigate',
      url: details.url
    });
  }
});

console.log('MacroMaster background service worker initialized');
