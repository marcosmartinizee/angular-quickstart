// Content Script - Runs in web pages for recording and playback

class MacroRecorder {
  constructor() {
    this.isRecording = false;
    this.lastEvent = null;
    this.eventBuffer = [];
    this.highlightedElement = null;
  }

  start() {
    this.isRecording = true;
    this.attachEventListeners();
    console.log('MacroRecorder: Recording started');
  }

  stop() {
    this.isRecording = false;
    this.removeEventListeners();
    this.removeHighlight();
    console.log('MacroRecorder: Recording stopped');
  }

  attachEventListeners() {
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('input', this.handleInput, true);
    document.addEventListener('change', this.handleChange, true);
    document.addEventListener('submit', this.handleSubmit, true);
    document.addEventListener('mouseover', this.handleMouseOver, true);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('input', this.handleInput, true);
    document.removeEventListener('change', this.handleChange, true);
    document.removeEventListener('submit', this.handleSubmit, true);
    document.removeEventListener('mouseover', this.handleMouseOver, true);
  }

  handleClick = (e) => {
    if (!this.isRecording) return;

    const element = e.target;
    const selector = this.getSelector(element);

    this.recordEvent({
      type: 'click',
      selector,
      tagName: element.tagName,
      text: element.textContent?.substring(0, 50),
      href: element.href
    });

    this.highlightElement(element, 'click');
  }

  handleInput = (e) => {
    if (!this.isRecording) return;

    const element = e.target;
    const selector = this.getSelector(element);

    this.recordEvent({
      type: 'input',
      selector,
      value: element.value,
      tagName: element.tagName
    });
  }

  handleChange = (e) => {
    if (!this.isRecording) return;

    const element = e.target;
    const selector = this.getSelector(element);

    this.recordEvent({
      type: 'change',
      selector,
      value: element.value,
      tagName: element.tagName
    });
  }

  handleSubmit = (e) => {
    if (!this.isRecording) return;

    const element = e.target;
    const selector = this.getSelector(element);

    this.recordEvent({
      type: 'submit',
      selector,
      tagName: element.tagName
    });
  }

  handleMouseOver = (e) => {
    if (!this.isRecording) return;
    this.highlightElement(e.target, 'hover');
  }

  getSelector(element) {
    // Try ID first
    if (element.id) {
      return `#${element.id}`;
    }

    // Try name attribute
    if (element.name) {
      return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
    }

    // Try data attributes
    for (const attr of element.attributes) {
      if (attr.name.startsWith('data-')) {
        return `${element.tagName.toLowerCase()}[${attr.name}="${attr.value}"]`;
      }
    }

    // Try class with position
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      const siblings = Array.from(element.parentElement?.children || [])
        .filter(el => el.className === element.className);
      const index = siblings.indexOf(element);
      if (siblings.length > 1) {
        return `.${classes}:nth-of-type(${index + 1})`;
      }
      return `.${classes}`;
    }

    // Fallback to tag with position
    const siblings = Array.from(element.parentElement?.children || [])
      .filter(el => el.tagName === element.tagName);
    const index = siblings.indexOf(element);
    return `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`;
  }

  recordEvent(event) {
    chrome.runtime.sendMessage({
      action: 'recordEvent',
      event
    });
    this.lastEvent = event;
  }

  highlightElement(element, type = 'hover') {
    this.removeHighlight();

    const color = type === 'click' ? '#ff6b6b' : '#4ecdc4';

    this.highlightedElement = document.createElement('div');
    this.highlightedElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 2px solid ${color};
      background: ${color}22;
      z-index: 999999;
      transition: opacity 0.3s;
    `;

    const rect = element.getBoundingClientRect();
    this.highlightedElement.style.left = `${rect.left + window.scrollX}px`;
    this.highlightedElement.style.top = `${rect.top + window.scrollY}px`;
    this.highlightedElement.style.width = `${rect.width}px`;
    this.highlightedElement.style.height = `${rect.height}px`;

    document.body.appendChild(this.highlightedElement);

    if (type === 'click') {
      setTimeout(() => this.removeHighlight(), 1000);
    }
  }

  removeHighlight() {
    if (this.highlightedElement) {
      this.highlightedElement.remove();
      this.highlightedElement = null;
    }
  }
}

class MacroPlayer {
  constructor() {
    this.isPlaying = false;
    this.currentLine = 0;
    this.variables = new Map();
    this.stopRequested = false;
    this.settings = {};
  }

  async play(macroContent, settings = {}) {
    this.isPlaying = true;
    this.stopRequested = false;
    this.settings = settings;
    this.currentLine = 0;
    this.variables = new Map();

    const lines = macroContent.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("'");
    });

    try {
      for (let i = 0; i < lines.length; i++) {
        if (this.stopRequested) {
          console.log('Playback stopped by user');
          break;
        }

        this.currentLine = i + 1;
        const line = lines[i].trim();

        await this.executeLine(line);

        if (this.settings.replaySpeed && this.settings.replaySpeed < 1) {
          await this.wait((1 - this.settings.replaySpeed) * 1000);
        }
      }

      this.showNotification('Macro completed successfully', 'success');
    } catch (error) {
      console.error('Macro execution error:', error);
      this.showNotification(`Error at line ${this.currentLine}: ${error.message}`, 'error');
      throw error;
    } finally {
      this.isPlaying = false;
    }
  }

  async executeLine(line) {
    const command = this.parseCommand(line);

    switch (command.name) {
      case 'VERSION':
        break;

      case 'URL':
        await this.executeUrl(command);
        break;

      case 'TAG':
        await this.executeTag(command);
        break;

      case 'WAIT':
        await this.executeWait(command);
        break;

      case 'SET':
        await this.executeSet(command);
        break;

      case 'EXTRACT':
        await this.executeExtract(command);
        break;

      case 'SAVEAS':
        await this.executeSaveAs(command);
        break;

      case 'CLICK':
        await this.executeClick(command);
        break;

      case 'PROMPT':
        await this.executePrompt(command);
        break;

      default:
        console.warn(`Unknown command: ${command.name}`);
    }
  }

  parseCommand(line) {
    const parts = line.split(/\s+/);
    const name = parts[0];
    const params = {};

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('=')) {
        const [key, ...valueParts] = part.split('=');
        params[key] = valueParts.join('=');
      } else {
        params._default = part;
      }
    }

    return { name, params, line };
  }

  async executeUrl(command) {
    if (command.params.GOTO) {
      const url = this.replaceVariables(command.params.GOTO);
      window.location.href = url;
      await this.wait(2000);
    }
  }

  async executeTag(command) {
    const selector = this.replaceVariables(command.params._default || '');
    const element = await this.findElement(selector);

    if (command.params.CONTENT !== undefined) {
      const content = this.replaceVariables(command.params.CONTENT);
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = content;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        element.textContent = content;
      }
    } else if (command.params.EXTRACT) {
      const extractType = command.params.EXTRACT;
      let value;

      switch (extractType) {
        case 'TXT':
          value = element.textContent.trim();
          break;
        case 'HTM':
          value = element.innerHTML;
          break;
        case 'HREF':
          value = element.href;
          break;
        case 'SRC':
          value = element.src;
          break;
        default:
          value = element.getAttribute(extractType);
      }

      if (command.params.VARIABLE) {
        this.variables.set(command.params.VARIABLE, value);
      }

      chrome.runtime.sendMessage({
        action: 'setVariable',
        name: 'EXTRACT',
        value
      });
    } else {
      // Click element
      this.highlightElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.wait(200);
      element.click();
    }
  }

  async executeWait(command) {
    if (command.params.SECONDS) {
      const seconds = parseFloat(command.params.SECONDS);
      await this.wait(seconds * 1000);
    }
  }

  async executeSet(command) {
    const varName = command.params._default;
    const value = this.replaceVariables(command.params.VALUE || '');
    this.variables.set(varName, value);
  }

  async executeExtract(command) {
    // Extract is handled by TAG command
  }

  async executeSaveAs(command) {
    // Browser security prevents direct file saving
    console.log('SAVEAS command - data will be available via extraction');
  }

  async executeClick(command) {
    const selector = this.replaceVariables(command.params._default || '');
    const element = await this.findElement(selector);
    this.highlightElement(element);
    element.click();
  }

  async executePrompt(command) {
    const message = this.replaceVariables(command.params._default || 'Enter value:');
    const value = prompt(message);
    if (command.params.VARIABLE) {
      this.variables.set(command.params.VARIABLE, value || '');
    }
  }

  async findElement(selector, timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      let element;

      // Try different selector strategies
      if (selector.startsWith('#')) {
        element = document.querySelector(selector);
      } else if (selector.startsWith('POS=')) {
        const pos = parseInt(selector.replace('POS=', '')) - 1;
        element = document.querySelectorAll('*')[pos];
      } else if (selector.includes('CONTENT:')) {
        const [tag, content] = selector.split('CONTENT:');
        const elements = document.querySelectorAll(tag || '*');
        element = Array.from(elements).find(el =>
          el.textContent.includes(content)
        );
      } else {
        element = document.querySelector(selector);
      }

      if (element) {
        return element;
      }

      await this.wait(100);
    }

    throw new Error(`Element not found: ${selector}`);
  }

  replaceVariables(text) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return this.variables.get(varName) || match;
    });
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  highlightElement(element) {
    if (!this.settings.highlightElements) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 3px solid #4ecdc4;
      background: #4ecdc422;
      z-index: 999999;
      animation: pulse 0.5s;
    `;

    const rect = element.getBoundingClientRect();
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'error' ? '#ff6b6b' : '#4ecdc4'};
      color: white;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  stop() {
    this.stopRequested = true;
    this.isPlaying = false;
  }
}

// Initialize
const recorder = new MacroRecorder();
const player = new MacroPlayer();

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startRecording':
      recorder.start();
      sendResponse({ success: true });
      break;

    case 'stopRecording':
      recorder.stop();
      sendResponse({ success: true });
      break;

    case 'playMacro':
      player.play(message.content, message.settings)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'stopPlayback':
      player.stop();
      sendResponse({ success: true });
      break;

    case 'getStatus':
      sendResponse({
        success: true,
        isRecording: recorder.isRecording,
        isPlaying: player.isPlaying
      });
      break;
  }
});

// Inject CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
`;
document.head.appendChild(style);

console.log('MacroMaster content script loaded');
