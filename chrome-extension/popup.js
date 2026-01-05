// Popup UI Logic

let isRecording = false;
let isPlaying = false;

// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const sidebarBtn = document.getElementById('sidebarBtn');
const viewMacrosBtn = document.getElementById('viewMacrosBtn');
const settingsBtn = document.getElementById('settingsBtn');
const helpBtn = document.getElementById('helpBtn');
const recordIndicator = document.getElementById('recordIndicator');
const playIndicator = document.getElementById('playIndicator');
const recordStatus = document.getElementById('recordStatus');
const playStatus = document.getElementById('playStatus');

// Initialize
updateStatus();

// Event Listeners
recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
sidebarBtn.addEventListener('click', openSidebar);
viewMacrosBtn.addEventListener('click', openSidebar);
settingsBtn.addEventListener('click', openSettings);
helpBtn.addEventListener('click', openHelp);

async function updateStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    if (response.success) {
      isRecording = response.isRecording;
      isPlaying = response.isPlaying;

      // Update UI
      if (isRecording) {
        recordIndicator.classList.add('active');
        recordStatus.textContent = 'Recording in progress...';
        recordBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        recordIndicator.classList.remove('active');
        recordStatus.textContent = 'Ready to record';
        recordBtn.disabled = false;
        stopBtn.disabled = !isPlaying;
      }

      if (isPlaying) {
        playIndicator.classList.add('active');
        playStatus.textContent = 'Macro playing...';
        stopBtn.disabled = false;
      } else {
        playIndicator.classList.remove('active');
        playStatus.textContent = 'No macro playing';
      }
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

async function startRecording() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'startRecording' });
    if (response.success) {
      isRecording = true;
      showNotification('Recording started!', 'success');
      updateStatus();

      // Auto-open sidebar
      setTimeout(() => openSidebar(), 500);
    }
  } catch (error) {
    console.error('Error starting recording:', error);
    showNotification('Failed to start recording', 'error');
  }
}

async function stopRecording() {
  try {
    if (isRecording) {
      const response = await chrome.runtime.sendMessage({ action: 'stopRecording' });
      if (response.success) {
        isRecording = false;
        showNotification('Recording stopped!', 'success');

        // Prompt to save macro
        const name = prompt('Enter a name for this macro:');
        if (name) {
          await chrome.runtime.sendMessage({
            action: 'saveMacro',
            name,
            content: response.macro,
            description: 'Recorded macro'
          });
          showNotification(`Macro "${name}" saved!`, 'success');
        }
      }
    } else if (isPlaying) {
      await chrome.runtime.sendMessage({ action: 'stopPlayback' });
      isPlaying = false;
      showNotification('Playback stopped!', 'success');
    }
    updateStatus();
  } catch (error) {
    console.error('Error stopping:', error);
    showNotification('Failed to stop', 'error');
  }
}

async function openSidebar() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await chrome.sidePanel.open({ tabId: tabs[0].id });
    }
  } catch (error) {
    console.error('Error opening sidebar:', error);
    // Fallback: open in new tab
    chrome.tabs.create({ url: 'sidebar.html' });
  }
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}

function openHelp() {
  chrome.tabs.create({ url: 'https://github.com/yourusername/macromaster' });
}

function showNotification(message, type = 'info') {
  // Chrome notifications
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'MacroMaster',
    message: message
  });
}

// Listen for status updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'statusUpdate') {
    updateStatus();
  }
});

// Update status periodically
setInterval(updateStatus, 1000);
