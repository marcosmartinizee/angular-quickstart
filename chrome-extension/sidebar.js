// Sidebar Control Panel Logic

let macros = [];
let currentEditingMacro = null;

// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const createBtn = document.getElementById('createBtn');
const importBtn = document.getElementById('importBtn');
const stopBtn = document.getElementById('stopBtn');
const searchBox = document.getElementById('searchBox');
const macroList = document.getElementById('macroList');
const editorSection = document.getElementById('editorSection');
const macroName = document.getElementById('macroName');
const macroContent = document.getElementById('macroContent');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const testBtn = document.getElementById('testBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const macroModal = document.getElementById('macroModal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const modalMacroName = document.getElementById('modalMacroName');
const modalDescription = document.getElementById('modalDescription');
const modalContent = document.getElementById('modalContent');
const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

// Initialize
loadMacros();
updateStatus();

// Event Listeners
recordBtn.addEventListener('click', startRecording);
createBtn.addEventListener('click', showCreateModal);
importBtn.addEventListener('click', importMacro);
stopBtn.addEventListener('click', stopRecording);
searchBox.addEventListener('input', filterMacros);
saveBtn.addEventListener('click', saveMacro);
cancelBtn.addEventListener('click', hideEditor);
testBtn.addEventListener('click', testMacro);
closeModal.addEventListener('click', hideModal);
modalSaveBtn.addEventListener('click', saveFromModal);
modalCancelBtn.addEventListener('click', hideModal);

async function loadMacros() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAllMacros' });
    if (response.success) {
      macros = response.macros || [];
      renderMacros();
    }
  } catch (error) {
    console.error('Error loading macros:', error);
  }
}

function renderMacros(filter = '') {
  const filteredMacros = macros.filter(macro =>
    macro.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredMacros.length === 0) {
    macroList.innerHTML = `
      <div class="empty-state">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
          <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
        <p>${filter ? 'No macros found' : 'No macros yet. Start by recording or creating one!'}</p>
      </div>
    `;
    return;
  }

  macroList.innerHTML = filteredMacros.map(macro => `
    <div class="macro-item" data-name="${macro.name}">
      <div class="macro-info">
        <h3>${macro.name}</h3>
        <p>${macro.description || 'No description'} • ${formatDate(macro.created)}</p>
      </div>
      <div class="macro-actions">
        <button class="icon-btn play" onclick="playMacro('${macro.name}')" title="Play">
          <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
          </svg>
        </button>
        <button class="icon-btn edit" onclick="editMacro('${macro.name}')" title="Edit">
          <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </button>
        <button class="icon-btn" onclick="exportMacro('${macro.name}')" title="Export">
          <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
          </svg>
        </button>
        <button class="icon-btn delete" onclick="deleteMacro('${macro.name}')" title="Delete">
          <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function filterMacros() {
  renderMacros(searchBox.value);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

async function startRecording() {
  try {
    await chrome.runtime.sendMessage({ action: 'startRecording' });
    recordingIndicator.classList.add('active');
    stopBtn.disabled = false;
    recordBtn.disabled = true;
    showNotification('Recording started!');
  } catch (error) {
    console.error('Error starting recording:', error);
    showNotification('Failed to start recording', 'error');
  }
}

async function stopRecording() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'stopRecording' });
    if (response.success) {
      recordingIndicator.classList.remove('active');
      stopBtn.disabled = true;
      recordBtn.disabled = false;

      // Show modal to save
      modalTitle.textContent = 'Save Recorded Macro';
      modalContent.value = response.macro;
      modalMacroName.value = `Macro_${Date.now()}`;
      modalDescription.value = 'Recorded macro';
      macroModal.classList.add('active');
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
}

function showCreateModal() {
  modalTitle.textContent = 'Create New Macro';
  modalMacroName.value = '';
  modalDescription.value = '';
  modalContent.value = 'VERSION BUILD=1.0.0\n\n';
  currentEditingMacro = null;
  macroModal.classList.add('active');
}

function hideModal() {
  macroModal.classList.remove('active');
  currentEditingMacro = null;
}

async function saveFromModal() {
  const name = modalMacroName.value.trim();
  const description = modalDescription.value.trim();
  const content = modalContent.value.trim();

  if (!name) {
    alert('Please enter a macro name');
    return;
  }

  if (!content) {
    alert('Please enter macro content');
    return;
  }

  try {
    await chrome.runtime.sendMessage({
      action: 'saveMacro',
      name,
      content,
      description
    });

    showNotification(`Macro "${name}" saved!`);
    hideModal();
    loadMacros();
  } catch (error) {
    console.error('Error saving macro:', error);
    showNotification('Failed to save macro', 'error');
  }
}

window.playMacro = async function(name) {
  try {
    await chrome.runtime.sendMessage({
      action: 'playMacro',
      macroName: name
    });
    showNotification(`Playing macro: ${name}`);
  } catch (error) {
    console.error('Error playing macro:', error);
    showNotification('Failed to play macro', 'error');
  }
};

window.editMacro = async function(name) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'getMacro',
      name
    });

    if (response.success && response.macro) {
      modalTitle.textContent = 'Edit Macro';
      modalMacroName.value = response.macro.name;
      modalDescription.value = response.macro.description || '';
      modalContent.value = response.macro.content;
      currentEditingMacro = name;
      macroModal.classList.add('active');
    }
  } catch (error) {
    console.error('Error loading macro:', error);
  }
};

window.deleteMacro = async function(name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    await chrome.runtime.sendMessage({
      action: 'deleteMacro',
      name
    });
    showNotification(`Macro "${name}" deleted`);
    loadMacros();
  } catch (error) {
    console.error('Error deleting macro:', error);
    showNotification('Failed to delete macro', 'error');
  }
};

window.exportMacro = async function(name) {
  try {
    await chrome.runtime.sendMessage({
      action: 'exportMacro',
      name
    });
    showNotification(`Exporting macro: ${name}`);
  } catch (error) {
    console.error('Error exporting macro:', error);
    showNotification('Failed to export macro', 'error');
  }
};

async function importMacro() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.iim,.json,.txt';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      await chrome.runtime.sendMessage({
        action: 'importMacro',
        content
      });
      showNotification('Macro imported successfully!');
      loadMacros();
    } catch (error) {
      console.error('Error importing macro:', error);
      showNotification('Failed to import macro', 'error');
    }
  };

  input.click();
}

async function saveMacro() {
  const name = macroName.value.trim();
  const content = macroContent.value.trim();

  if (!name || !content) {
    alert('Please enter both name and content');
    return;
  }

  try {
    await chrome.runtime.sendMessage({
      action: 'saveMacro',
      name,
      content,
      description: 'Manual macro'
    });

    showNotification(`Macro "${name}" saved!`);
    hideEditor();
    loadMacros();
  } catch (error) {
    console.error('Error saving macro:', error);
    showNotification('Failed to save macro', 'error');
  }
}

async function testMacro() {
  const content = modalContent.value.trim() || macroContent.value.trim();
  if (!content) {
    alert('No macro content to test');
    return;
  }

  try {
    await chrome.runtime.sendMessage({
      action: 'playMacro',
      content
    });
    showNotification('Testing macro...');
  } catch (error) {
    console.error('Error testing macro:', error);
    showNotification('Failed to test macro', 'error');
  }
}

function hideEditor() {
  editorSection.classList.remove('active');
  macroName.value = '';
  macroContent.value = '';
}

async function updateStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    if (response.success) {
      if (response.isRecording) {
        recordingIndicator.classList.add('active');
        stopBtn.disabled = false;
        recordBtn.disabled = true;
      } else {
        recordingIndicator.classList.remove('active');
        stopBtn.disabled = !response.isPlaying;
        recordBtn.disabled = false;
      }
    }
  } catch (error) {
    // Extension might not be loaded yet
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#ff6b6b' : '#4ecdc4'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Listen for status updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'statusUpdate') {
    updateStatus();
  }
});

// Update status periodically
setInterval(updateStatus, 1000);
