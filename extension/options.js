// Options Page Controller
class OptionsController {
  constructor() {
    this.defaultSettings = {
      playbackSpeed: 1,
      defaultWait: 1,
      highlightElements: true,
      useXPath: true,
      recordMouseMovements: false,
      autoSave: false,
      maxRetries: 3,
      pageTimeout: 30,
      debugMode: false
    };
    this.init();
  }

  init() {
    this.bindElements();
    this.attachEventListeners();
    this.loadSettings();
  }

  bindElements() {
    this.playbackSpeed = document.getElementById('playbackSpeed');
    this.defaultWait = document.getElementById('defaultWait');
    this.highlightElements = document.getElementById('highlightElements');
    this.useXPath = document.getElementById('useXPath');
    this.recordMouseMovements = document.getElementById('recordMouseMovements');
    this.autoSave = document.getElementById('autoSave');
    this.maxRetries = document.getElementById('maxRetries');
    this.pageTimeout = document.getElementById('pageTimeout');
    this.debugMode = document.getElementById('debugMode');
    this.saveBtn = document.getElementById('saveBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.successMessage = document.getElementById('successMessage');
  }

  attachEventListeners() {
    this.saveBtn.addEventListener('click', () => this.saveSettings());
    this.resetBtn.addEventListener('click', () => this.resetSettings());
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['settings']);
      const settings = result.settings || this.defaultSettings;
      this.applySettings(settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.applySettings(this.defaultSettings);
    }
  }

  applySettings(settings) {
    this.playbackSpeed.value = settings.playbackSpeed || 1;
    this.defaultWait.value = settings.defaultWait || 1;
    this.highlightElements.checked = settings.highlightElements !== false;
    this.useXPath.checked = settings.useXPath !== false;
    this.recordMouseMovements.checked = settings.recordMouseMovements || false;
    this.autoSave.checked = settings.autoSave || false;
    this.maxRetries.value = settings.maxRetries || 3;
    this.pageTimeout.value = settings.pageTimeout || 30;
    this.debugMode.checked = settings.debugMode || false;
  }

  async saveSettings() {
    const settings = {
      playbackSpeed: parseFloat(this.playbackSpeed.value),
      defaultWait: parseFloat(this.defaultWait.value),
      highlightElements: this.highlightElements.checked,
      useXPath: this.useXPath.checked,
      recordMouseMovements: this.recordMouseMovements.checked,
      autoSave: this.autoSave.checked,
      maxRetries: parseInt(this.maxRetries.value),
      pageTimeout: parseInt(this.pageTimeout.value),
      debugMode: this.debugMode.checked
    };

    try {
      await chrome.storage.local.set({ settings });
      this.showSuccessMessage();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  }

  resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
      this.applySettings(this.defaultSettings);
      this.saveSettings();
    }
  }

  showSuccessMessage() {
    this.successMessage.style.display = 'block';
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 3000);
  }
}

// Initialize options page
const options = new OptionsController();
