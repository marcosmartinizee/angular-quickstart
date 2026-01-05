// Options Page Logic

const defaultSettings = {
  timeout: 60,
  replaySpeed: 1.0,
  errorHandling: 'stop',
  highlightElements: true,
  showTooltips: true,
  autoSaveRecordings: false,
  recordMouseHover: false,
  smartSelectors: true,
  logLevel: 'info',
  maxRetries: 3,
  debugMode: false
};

// Load settings on page load
loadSettings();

// Event listeners
document.getElementById('saveBtn').addEventListener('click', saveSettings);
document.getElementById('resetBtn').addEventListener('click', resetSettings);
document.getElementById('exportAllBtn').addEventListener('click', exportAllMacros);
document.getElementById('importAllBtn').addEventListener('click', importAllMacros);
document.getElementById('clearAllBtn').addEventListener('click', clearAllData);

async function loadSettings() {
  try {
    const data = await chrome.storage.local.get(['settings']);
    const settings = data.settings || defaultSettings;

    // Populate form fields
    document.getElementById('timeout').value = settings.timeout;
    document.getElementById('replaySpeed').value = settings.replaySpeed;
    document.getElementById('errorHandling').value = settings.errorHandling;
    document.getElementById('highlightElements').checked = settings.highlightElements;
    document.getElementById('showTooltips').checked = settings.showTooltips;
    document.getElementById('autoSaveRecordings').checked = settings.autoSaveRecordings;
    document.getElementById('recordMouseHover').checked = settings.recordMouseHover;
    document.getElementById('smartSelectors').checked = settings.smartSelectors;
    document.getElementById('logLevel').value = settings.logLevel;
    document.getElementById('maxRetries').value = settings.maxRetries;
    document.getElementById('debugMode').checked = settings.debugMode;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function saveSettings() {
  try {
    const settings = {
      timeout: parseInt(document.getElementById('timeout').value),
      replaySpeed: parseFloat(document.getElementById('replaySpeed').value),
      errorHandling: document.getElementById('errorHandling').value,
      highlightElements: document.getElementById('highlightElements').checked,
      showTooltips: document.getElementById('showTooltips').checked,
      autoSaveRecordings: document.getElementById('autoSaveRecordings').checked,
      recordMouseHover: document.getElementById('recordMouseHover').checked,
      smartSelectors: document.getElementById('smartSelectors').checked,
      logLevel: document.getElementById('logLevel').value,
      maxRetries: parseInt(document.getElementById('maxRetries').value),
      debugMode: document.getElementById('debugMode').checked
    };

    await chrome.storage.local.set({ settings });
    showSuccessMessage('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings');
  }
}

async function resetSettings() {
  if (!confirm('Reset all settings to defaults?')) {
    return;
  }

  try {
    await chrome.storage.local.set({ settings: defaultSettings });
    loadSettings();
    showSuccessMessage('Settings reset to defaults!');
  } catch (error) {
    console.error('Error resetting settings:', error);
  }
}

async function exportAllMacros() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAllMacros' });
    if (response.success) {
      const data = {
        version: '1.0.0',
        exported: new Date().toISOString(),
        macros: response.macros
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `macromaster-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showSuccessMessage('Macros exported successfully!');
    }
  } catch (error) {
    console.error('Error exporting macros:', error);
    alert('Failed to export macros');
  }
}

async function importAllMacros() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      if (!data.macros || !Array.isArray(data.macros)) {
        throw new Error('Invalid export file format');
      }

      // Import each macro
      for (const macro of data.macros) {
        await chrome.runtime.sendMessage({
          action: 'saveMacro',
          name: macro.name,
          content: macro.content,
          description: macro.description
        });
      }

      showSuccessMessage(`Imported ${data.macros.length} macros successfully!`);
    } catch (error) {
      console.error('Error importing macros:', error);
      alert('Failed to import macros: ' + error.message);
    }
  };

  input.click();
}

async function clearAllData() {
  const confirmation = prompt(
    'This will delete ALL your macros and settings. Type "DELETE" to confirm:'
  );

  if (confirmation !== 'DELETE') {
    return;
  }

  try {
    await chrome.storage.local.clear();
    await chrome.storage.local.set({ settings: defaultSettings });
    loadSettings();
    showSuccessMessage('All data cleared!');
  } catch (error) {
    console.error('Error clearing data:', error);
    alert('Failed to clear data');
  }
}

function showSuccessMessage(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.textContent = message;
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}
