// Popup UI Controller
class PopupController {
  constructor() {
    this.selectedMacro = null;
    this.isRecording = false;
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.bindElements();
    this.attachEventListeners();
    this.loadMacros();
    this.updateStatus();
  }

  bindElements() {
    this.recordBtn = document.getElementById('recordBtn');
    this.playBtn = document.getElementById('playBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.sidebarBtn = document.getElementById('sidebarBtn');
    this.macroList = document.getElementById('macroList');
    this.statusDot = document.getElementById('statusDot');
    this.statusText = document.getElementById('statusText');
    this.progressBar = document.getElementById('progressBar');
    this.progressFill = document.getElementById('progressFill');
    this.openSidebar = document.getElementById('openSidebar');
    this.openOptions = document.getElementById('openOptions');
  }

  attachEventListeners() {
    this.recordBtn.addEventListener('click', () => this.toggleRecording());
    this.playBtn.addEventListener('click', () => this.playMacro());
    this.stopBtn.addEventListener('click', () => this.stopPlayback());
    this.sidebarBtn.addEventListener('click', () => this.openSidePanel());
    this.openSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSidePanel();
    });
    this.openOptions.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });

    // Listen for status updates
    chrome.runtime.onMessage.addListener((message) => {
      this.handleMessage(message);
    });
  }

  handleMessage(message) {
    switch (message.action) {
      case 'recordingStarted':
        this.isRecording = true;
        this.updateUI();
        break;
      case 'recordingStopped':
        this.isRecording = false;
        if (message.macro) {
          this.saveMacro(message.macro);
        }
        this.updateUI();
        break;
      case 'playbackProgress':
        this.updateProgress(message.current, message.total);
        break;
    }
  }

  async toggleRecording() {
    if (this.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'startRecording' 
      });
      
      if (response.success) {
        this.isRecording = true;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please try again.');
    }
  }

  async stopRecording() {
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'stopRecording' 
      });
      
      if (response.success && response.macro) {
        this.isRecording = false;
        await this.saveMacro(response.macro);
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  async playMacro() {
    if (!this.selectedMacro) {
      alert('Please select a macro to play');
      return;
    }

    try {
      this.isPlaying = true;
      this.updateUI();
      this.progressBar.classList.add('active');

      const response = await chrome.runtime.sendMessage({
        action: 'playMacro',
        macro: this.selectedMacro,
        options: { speed: 1 }
      });

      this.isPlaying = false;
      this.progressBar.classList.remove('active');
      this.updateUI();

      if (response.success) {
        // Save as last played
        await chrome.storage.local.set({ 
          lastPlayedMacro: this.selectedMacro 
        });

        if (response.extractedData && response.extractedData.length > 0) {
          alert(`Macro completed!\nExtracted data:\n${response.extractedData.join('\n')}`);
        }
      }
    } catch (error) {
      this.isPlaying = false;
      this.progressBar.classList.remove('active');
      this.updateUI();
      console.error('Failed to play macro:', error);
      alert('Failed to play macro: ' + error.message);
    }
  }

  async stopPlayback() {
    try {
      await chrome.runtime.sendMessage({ action: 'stopPlayback' });
      this.isPlaying = false;
      this.progressBar.classList.remove('active');
      this.updateUI();
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }

  async saveMacro(macro) {
    const name = prompt('Enter macro name:', macro.name);
    if (!name) return;

    macro.name = name;

    try {
      await chrome.runtime.sendMessage({
        action: 'saveMacro',
        macro: macro
      });
      await this.loadMacros();
    } catch (error) {
      console.error('Failed to save macro:', error);
      alert('Failed to save macro');
    }
  }

  async loadMacros() {
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'getMacros' 
      });
      
      this.renderMacros(response.macros || []);
    } catch (error) {
      console.error('Failed to load macros:', error);
    }
  }

  renderMacros(macros) {
    if (macros.length === 0) {
      this.macroList.innerHTML = `
        <div class="empty-state">
          No macros yet. Click Record to create your first macro!
        </div>
      `;
      return;
    }

    this.macroList.innerHTML = macros.map((macro, index) => `
      <div class="macro-item" data-index="${index}">
        <div>
          <div class="macro-name">${this.escapeHtml(macro.name)}</div>
          <div class="macro-date">${this.formatDate(macro.created)}</div>
        </div>
        <div class="macro-actions">
          <button class="icon-btn play-macro" data-index="${index}" title="Play">▶</button>
          <button class="icon-btn edit-macro" data-index="${index}" title="Edit">✏️</button>
          <button class="icon-btn delete-macro" data-index="${index}" title="Delete">🗑️</button>
        </div>
      </div>
    `).join('');

    // Attach event listeners
    this.macroList.querySelectorAll('.macro-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('icon-btn')) {
          this.selectMacro(macros[item.dataset.index]);
          this.highlightSelected(item);
        }
      });
    });

    this.macroList.querySelectorAll('.play-macro').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedMacro = macros[btn.dataset.index];
        this.playMacro();
      });
    });

    this.macroList.querySelectorAll('.edit-macro').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editMacro(macros[btn.dataset.index]);
      });
    });

    this.macroList.querySelectorAll('.delete-macro').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Delete this macro?')) {
          await this.deleteMacro(macros[btn.dataset.index]);
        }
      });
    });
  }

  selectMacro(macro) {
    this.selectedMacro = macro;
    this.updateUI();
  }

  highlightSelected(item) {
    this.macroList.querySelectorAll('.macro-item').forEach(el => {
      el.classList.remove('selected');
    });
    item.classList.add('selected');
  }

  async deleteMacro(macro) {
    try {
      await chrome.runtime.sendMessage({
        action: 'deleteMacro',
        macroName: macro.name
      });
      await this.loadMacros();
      if (this.selectedMacro && this.selectedMacro.name === macro.name) {
        this.selectedMacro = null;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to delete macro:', error);
    }
  }

  editMacro(macro) {
    // Open sidebar with macro for editing
    this.openSidePanel();
    // Send message to sidebar to load macro
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: 'editMacro',
        macro: macro
      }).catch(() => {});
    }, 500);
  }

  async openSidePanel() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.sidePanel.open({ tabId: tab.id });
    } catch (error) {
      console.error('Failed to open side panel:', error);
      // Fallback: open in new tab
      chrome.tabs.create({ url: 'sidebar.html' });
    }
  }

  updateUI() {
    // Update record button
    if (this.isRecording) {
      this.recordBtn.classList.add('recording');
      this.recordBtn.innerHTML = '<span>⏹</span><span>Stop Recording</span>';
      this.playBtn.disabled = true;
      this.stopBtn.disabled = true;
    } else {
      this.recordBtn.classList.remove('recording');
      this.recordBtn.innerHTML = '<span>⏺</span><span>Record</span>';
      this.playBtn.disabled = !this.selectedMacro || this.isPlaying;
      this.stopBtn.disabled = !this.isPlaying;
    }

    // Update status
    this.updateStatus();
  }

  async updateStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'getStatus' 
      });
      
      if (response.isRecording) {
        this.statusDot.className = 'status-dot recording';
        this.statusText.textContent = 'Recording...';
      } else if (response.isPlaying) {
        this.statusDot.className = 'status-dot playing';
        this.statusText.textContent = 'Playing...';
      } else {
        this.statusDot.className = 'status-dot';
        this.statusText.textContent = 'Ready';
      }
    } catch (error) {
      // Ignore errors
    }
  }

  updateProgress(current, total) {
    const percent = (current / total) * 100;
    this.progressFill.style.width = percent + '%';
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize popup
const popup = new PopupController();
