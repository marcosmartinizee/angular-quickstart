// Sidebar Controller for Macro Library
class SidebarController {
  constructor() {
    this.macros = [];
    this.currentMacro = null;
    this.isEditing = false;
    this.init();
  }

  init() {
    this.bindElements();
    this.attachEventListeners();
    this.loadMacros();
  }

  bindElements() {
    this.newMacroBtn = document.getElementById('newMacroBtn');
    this.importBtn = document.getElementById('importBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.samplesBtn = document.getElementById('samplesBtn');
    this.searchInput = document.getElementById('searchInput');
    this.macroList = document.getElementById('macroList');
    this.editorView = document.getElementById('editorView');
    this.emptyView = document.getElementById('emptyView');
    this.editorTitle = document.getElementById('editorTitle');
    this.macroName = document.getElementById('macroName');
    this.macroCode = document.getElementById('macroCode');
    this.saveBtn = document.getElementById('saveBtn');
    this.playBtn = document.getElementById('playBtn');
    this.deleteBtn = document.getElementById('deleteBtn');
    this.statusText = document.getElementById('statusText');
    this.macroCount = document.getElementById('macroCount');
    this.fileInput = document.getElementById('fileInput');
  }

  attachEventListeners() {
    this.newMacroBtn.addEventListener('click', () => this.createNewMacro());
    this.importBtn.addEventListener('click', () => this.importMacro());
    this.exportBtn.addEventListener('click', () => this.exportMacro());
    this.samplesBtn.addEventListener('click', () => this.showSamples());
    this.searchInput.addEventListener('input', (e) => this.searchMacros(e.target.value));
    this.saveBtn.addEventListener('click', () => this.saveMacro());
    this.playBtn.addEventListener('click', () => this.playMacro());
    this.deleteBtn.addEventListener('click', () => this.deleteMacro());
    this.fileInput.addEventListener('change', (e) => this.handleFileImport(e));

    // Listen for messages
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'editMacro') {
        this.editMacro(message.macro);
      }
    });
  }

  async loadMacros() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getMacros' });
      this.macros = response.macros || [];
      this.renderMacroList();
      this.updateStatus();
    } catch (error) {
      console.error('Failed to load macros:', error);
    }
  }

  renderMacroList(filter = '') {
    const filtered = filter 
      ? this.macros.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
      : this.macros;

    if (filtered.length === 0) {
      this.macroList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-text">${filter ? 'No matches found' : 'No macros yet'}</div>
          <div class="empty-state-subtext">${filter ? 'Try a different search' : 'Create or import a macro to get started'}</div>
        </div>
      `;
      return;
    }

    this.macroList.innerHTML = filtered.map((macro, index) => `
      <div class="macro-item ${this.currentMacro && this.currentMacro.name === macro.name ? 'active' : ''}" 
           data-name="${this.escapeHtml(macro.name)}">
        <div class="macro-item-name">${this.escapeHtml(macro.name)}</div>
        <div class="macro-item-info">
          ${this.formatDate(macro.created)} • ${this.countLines(macro.code)} lines
        </div>
      </div>
    `).join('');

    // Attach click listeners
    this.macroList.querySelectorAll('.macro-item').forEach(item => {
      item.addEventListener('click', () => {
        const macro = this.macros.find(m => m.name === item.dataset.name);
        if (macro) {
          this.editMacro(macro);
        }
      });
    });
  }

  createNewMacro() {
    this.currentMacro = {
      name: `Macro_${Date.now()}`,
      code: `VERSION BUILD=1.0.0 RECORDER=CR\nTAB T=1\nURL GOTO=https://example.com\n`,
      created: new Date().toISOString()
    };
    this.isEditing = false;
    this.showEditor();
  }

  editMacro(macro) {
    this.currentMacro = macro;
    this.isEditing = true;
    this.showEditor();
    this.renderMacroList();
  }

  showEditor() {
    this.emptyView.style.display = 'none';
    this.editorView.style.display = 'block';
    
    this.editorTitle.textContent = this.isEditing ? 'Edit Macro' : 'New Macro';
    this.macroName.value = this.currentMacro.name;
    this.macroCode.value = this.currentMacro.code;
    this.deleteBtn.style.display = this.isEditing ? 'block' : 'none';
  }

  async saveMacro() {
    if (!this.macroName.value.trim()) {
      alert('Please enter a macro name');
      return;
    }

    const macro = {
      name: this.macroName.value.trim(),
      code: this.macroCode.value,
      created: this.currentMacro.created || new Date().toISOString(),
      modified: new Date().toISOString()
    };

    try {
      if (this.isEditing) {
        // Update existing macro
        await chrome.runtime.sendMessage({
          action: 'deleteMacro',
          macroName: this.currentMacro.name
        });
      }

      await chrome.runtime.sendMessage({
        action: 'saveMacro',
        macro: macro
      });

      this.statusText.textContent = 'Macro saved successfully';
      setTimeout(() => this.statusText.textContent = 'Ready', 2000);

      await this.loadMacros();
      this.currentMacro = macro;
      this.isEditing = true;
    } catch (error) {
      console.error('Failed to save macro:', error);
      alert('Failed to save macro');
    }
  }

  async playMacro() {
    if (!this.currentMacro) return;

    try {
      this.statusText.textContent = 'Playing macro...';
      
      const response = await chrome.runtime.sendMessage({
        action: 'playMacro',
        macro: {
          name: this.macroName.value,
          code: this.macroCode.value
        },
        options: { speed: 1 }
      });

      if (response.success) {
        this.statusText.textContent = 'Macro completed successfully';
        if (response.extractedData && response.extractedData.length > 0) {
          alert(`Extracted data:\n${response.extractedData.join('\n')}`);
        }
      } else {
        this.statusText.textContent = 'Macro failed';
      }

      setTimeout(() => this.statusText.textContent = 'Ready', 3000);
    } catch (error) {
      console.error('Failed to play macro:', error);
      this.statusText.textContent = 'Error: ' + error.message;
      setTimeout(() => this.statusText.textContent = 'Ready', 3000);
    }
  }

  async deleteMacro() {
    if (!this.currentMacro || !this.isEditing) return;

    if (!confirm(`Delete macro "${this.currentMacro.name}"?`)) {
      return;
    }

    try {
      await chrome.runtime.sendMessage({
        action: 'deleteMacro',
        macroName: this.currentMacro.name
      });

      this.statusText.textContent = 'Macro deleted';
      setTimeout(() => this.statusText.textContent = 'Ready', 2000);

      this.currentMacro = null;
      this.isEditing = false;
      this.editorView.style.display = 'none';
      this.emptyView.style.display = 'flex';

      await this.loadMacros();
    } catch (error) {
      console.error('Failed to delete macro:', error);
      alert('Failed to delete macro');
    }
  }

  importMacro() {
    this.fileInput.click();
  }

  async handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const macro = {
        name: file.name.replace(/\.(iim|txt)$/, ''),
        code: text,
        created: new Date().toISOString()
      };

      await chrome.runtime.sendMessage({
        action: 'saveMacro',
        macro: macro
      });

      this.statusText.textContent = 'Macro imported successfully';
      setTimeout(() => this.statusText.textContent = 'Ready', 2000);

      await this.loadMacros();
      this.editMacro(macro);
    } catch (error) {
      console.error('Failed to import macro:', error);
      alert('Failed to import macro');
    }

    // Reset file input
    event.target.value = '';
  }

  exportMacro() {
    if (!this.currentMacro) {
      alert('Please select a macro to export');
      return;
    }

    const blob = new Blob([this.macroCode.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.macroName.value}.iim`;
    a.click();
    URL.revokeObjectURL(url);

    this.statusText.textContent = 'Macro exported';
    setTimeout(() => this.statusText.textContent = 'Ready', 2000);
  }

  showSamples() {
    const samples = [
      {
        name: 'Fill Form Example',
        code: `VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/form
TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:name CONTENT="John Doe"
TAG POS=1 TYPE=INPUT:EMAIL ATTR=ID:email CONTENT=john@example.com
TAG POS=1 TYPE=SELECT ATTR=ID:country CONTENT=%USA
TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Submit CONTENT=EVENT:CLICK`
      },
      {
        name: 'Extract Data Example',
        code: `VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/data
TAG POS=1 TYPE=H1 ATTR=CLASS:title EXTRACT=TXT
TAG POS=1 TYPE=DIV ATTR=CLASS:price EXTRACT=TXT
SAVEAS TYPE=EXTRACT FOLDER=extracted_data.txt`
      },
      {
        name: 'Loop Example',
        code: `VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
SET !LOOP 5
URL GOTO=https://example.com/page{{LOOP}}
TAG POS=1 TYPE=A ATTR=TXT:Next CONTENT=EVENT:CLICK
WAIT SECONDS=2`
      },
      {
        name: 'Login Example',
        code: `VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/login
TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:username CONTENT=myusername
TAG POS=1 TYPE=INPUT:PASSWORD ATTR=ID:password CONTENT=mypassword
TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Login CONTENT=EVENT:CLICK
WAIT SECONDS=3`
      }
    ];

    const sampleList = samples.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
    const choice = prompt(`Choose a sample:\n${sampleList}\n\nEnter number (1-${samples.length}):`);
    
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < samples.length) {
      this.currentMacro = {
        ...samples[index],
        created: new Date().toISOString()
      };
      this.isEditing = false;
      this.showEditor();
    }
  }

  searchMacros(query) {
    this.renderMacroList(query);
  }

  updateStatus() {
    this.macroCount.textContent = `${this.macros.length} macro${this.macros.length !== 1 ? 's' : ''}`;
  }

  countLines(code) {
    return code.split('\n').filter(line => line.trim()).length;
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize sidebar
const sidebar = new SidebarController();
