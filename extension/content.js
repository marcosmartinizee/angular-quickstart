// Content Script for iMacros Extension
// Runs in the context of web pages to record and execute actions

(function() {
  'use strict';

  class PageInteractor {
    constructor() {
      this.isRecording = false;
      this.recordedElements = new WeakMap();
      this.elementCounter = new Map();
      this.highlightedElement = null;
      this.setupEventListeners();
    }

    setupEventListeners() {
      // Listen for messages from background script
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message, sendResponse);
        return true; // Keep channel open for async response
      });
    }

    async handleMessage(message, sendResponse) {
      try {
        switch (message.action) {
          case 'startRecording':
            this.startRecording();
            sendResponse({ success: true });
            break;

          case 'stopRecording':
            this.stopRecording();
            sendResponse({ success: true });
            break;

          case 'executeTag':
            const result = await this.executeTag(message.params);
            sendResponse(result);
            break;

          case 'extract':
            const extractResult = await this.extractData(message.params);
            sendResponse(extractResult);
            break;

          case 'highlight':
            this.highlightElement(message.selector);
            sendResponse({ success: true });
            break;

          default:
            sendResponse({ error: 'Unknown action' });
        }
      } catch (error) {
        sendResponse({ error: error.message });
      }
    }

    startRecording() {
      this.isRecording = true;
      this.elementCounter.clear();
      
      // Add event listeners for recording
      document.addEventListener('click', this.handleClick, true);
      document.addEventListener('input', this.handleInput, true);
      document.addEventListener('change', this.handleChange, true);
      document.addEventListener('submit', this.handleSubmit, true);
      
      // Show recording indicator
      this.showRecordingIndicator();
    }

    stopRecording() {
      this.isRecording = false;
      
      // Remove event listeners
      document.removeEventListener('click', this.handleClick, true);
      document.removeEventListener('input', this.handleInput, true);
      document.removeEventListener('change', this.handleChange, true);
      document.removeEventListener('submit', this.handleSubmit, true);
      
      // Hide recording indicator
      this.hideRecordingIndicator();
    }

    handleClick = (event) => {
      if (!this.isRecording) return;
      
      const element = event.target;
      
      // Skip if clicking on our own UI
      if (element.closest('.imacros-indicator')) {
        return;
      }

      // Prevent default for links during recording
      if (element.tagName === 'A') {
        event.preventDefault();
      }

      const action = this.createClickAction(element);
      this.sendActionToBackground(action);
      
      // Visual feedback
      this.flashElement(element);
    }

    handleInput = (event) => {
      if (!this.isRecording) return;
      
      const element = event.target;
      const action = this.createInputAction(element);
      
      // Debounce input events
      clearTimeout(element._inputTimeout);
      element._inputTimeout = setTimeout(() => {
        this.sendActionToBackground(action);
      }, 500);
    }

    handleChange = (event) => {
      if (!this.isRecording) return;
      
      const element = event.target;
      
      if (element.tagName === 'SELECT') {
        const action = this.createSelectAction(element);
        this.sendActionToBackground(action);
      } else if (element.type === 'checkbox' || element.type === 'radio') {
        const action = this.createClickAction(element);
        this.sendActionToBackground(action);
      }
    }

    handleSubmit = (event) => {
      if (!this.isRecording) return;
      
      event.preventDefault();
      const form = event.target;
      const action = this.createSubmitAction(form);
      this.sendActionToBackground(action);
    }

    createClickAction(element) {
      const tagInfo = this.getElementInfo(element);
      
      return {
        type: 'click',
        tagType: this.getTagType(element),
        attr: tagInfo.attr,
        pos: tagInfo.pos,
        xpath: this.getXPath(element),
        selector: this.getSelector(element),
        timestamp: Date.now()
      };
    }

    createInputAction(element) {
      const tagInfo = this.getElementInfo(element);
      
      return {
        type: 'input',
        tagType: this.getTagType(element),
        attr: tagInfo.attr,
        pos: tagInfo.pos,
        value: element.value,
        xpath: this.getXPath(element),
        selector: this.getSelector(element),
        timestamp: Date.now()
      };
    }

    createSelectAction(element) {
      const tagInfo = this.getElementInfo(element);
      const selectedOption = element.options[element.selectedIndex];
      
      return {
        type: 'select',
        tagType: 'SELECT',
        attr: tagInfo.attr,
        pos: tagInfo.pos,
        value: selectedOption.text,
        xpath: this.getXPath(element),
        selector: this.getSelector(element),
        timestamp: Date.now()
      };
    }

    createSubmitAction(form) {
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      const tagInfo = submitButton ? this.getElementInfo(submitButton) : { attr: 'TYPE:SUBMIT', pos: 1 };
      
      return {
        type: 'click',
        tagType: 'BUTTON:SUBMIT',
        attr: tagInfo.attr,
        pos: tagInfo.pos,
        xpath: submitButton ? this.getXPath(submitButton) : null,
        timestamp: Date.now()
      };
    }

    getElementInfo(element) {
      const tagType = this.getTagType(element);
      const key = `${tagType}:${this.getSelector(element)}`;
      
      // Track position of similar elements
      if (!this.elementCounter.has(key)) {
        const similarElements = document.querySelectorAll(element.tagName);
        let pos = 1;
        for (let i = 0; i < similarElements.length; i++) {
          if (similarElements[i] === element) {
            pos = i + 1;
            break;
          }
        }
        this.elementCounter.set(key, pos);
      }

      return {
        attr: this.getAttr(element),
        pos: this.elementCounter.get(key)
      };
    }

    getTagType(element) {
      const tag = element.tagName.toUpperCase();
      const type = element.type ? element.type.toUpperCase() : '';
      
      if (tag === 'INPUT' && type) {
        return `INPUT:${type}`;
      }
      if (tag === 'BUTTON') {
        return `BUTTON:${type || 'BUTTON'}`;
      }
      return tag;
    }

    getAttr(element) {
      const attrs = [];
      
      if (element.id) {
        attrs.push(`ID:${element.id}`);
      }
      if (element.name) {
        attrs.push(`NAME:${element.name}`);
      }
      if (element.className) {
        const classes = element.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) {
          attrs.push(`CLASS:${classes[0]}`);
        }
      }
      if (element.getAttribute('data-testid')) {
        attrs.push(`DATA-TESTID:${element.getAttribute('data-testid')}`);
      }
      
      // For links and buttons, include text
      if (element.tagName === 'A' || element.tagName === 'BUTTON') {
        const text = element.textContent.trim().substring(0, 30);
        if (text) {
          attrs.push(`TXT:${text}`);
        }
      }

      return attrs.join('&&') || 'TAG:' + element.tagName;
    }

    getXPath(element) {
      if (element.id) {
        return `//*[@id="${element.id}"]`;
      }

      const parts = [];
      let current = element;

      while (current && current.nodeType === Node.ELEMENT_NODE) {
        let index = 0;
        let sibling = current.previousSibling;

        while (sibling) {
          if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
            index++;
          }
          sibling = sibling.previousSibling;
        }

        const tagName = current.nodeName.toLowerCase();
        const pathIndex = index > 0 ? `[${index + 1}]` : '';
        parts.unshift(tagName + pathIndex);

        current = current.parentNode;
      }

      return parts.length ? '/' + parts.join('/') : '';
    }

    getSelector(element) {
      if (element.id) {
        return `#${element.id}`;
      }

      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        
        if (current.className) {
          const classes = current.className.split(' ').filter(c => c.trim());
          if (classes.length > 0) {
            selector += '.' + classes.join('.');
          }
        }

        path.unshift(selector);
        current = current.parentElement;
      }

      return path.join(' > ');
    }

    async executeTag(params) {
      let element;

      // Find element by XPATH or other attributes
      if (params.xpath) {
        element = this.findElementByXPath(params.xpath);
      } else {
        element = this.findElementByParams(params);
      }

      if (!element) {
        throw new Error('Element not found: ' + JSON.stringify(params));
      }

      // Highlight element briefly
      this.flashElement(element);

      // Execute action based on CONTENT
      const content = params.content || '';

      if (content === 'EVENT:CLICK' || content.startsWith('EVENT:')) {
        element.click();
        await this.wait(100);
      } else if (params.extract) {
        return {
          success: true,
          extractedValue: this.extractFromElement(element, params.extract)
        };
      } else if (element.tagName === 'SELECT') {
        // Select option
        const value = content.replace(/^%/, '');
        this.selectOption(element, value);
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        // Set value
        const value = content.replace(/^["']|["']$/g, '');
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }

      return { success: true };
    }

    findElementByXPath(xpath) {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue;
    }

    findElementByParams(params) {
      const pos = parseInt(params.pos) || 1;
      const type = params.type || '';
      const attr = params.attr || '';

      // Parse attributes
      const attrPairs = attr.split('&&').map(pair => {
        const [key, value] = pair.split(':');
        return { key: key.toUpperCase(), value };
      });

      // Build selector
      let selector = '';
      
      if (type.includes('INPUT:')) {
        const inputType = type.split(':')[1].toLowerCase();
        selector = `input[type="${inputType}"]`;
      } else if (type === 'SELECT') {
        selector = 'select';
      } else if (type.includes('BUTTON')) {
        selector = 'button';
      } else {
        selector = type.toLowerCase();
      }

      // Add attribute filters
      for (const attr of attrPairs) {
        if (attr.key === 'ID') {
          selector += `[id="${attr.value}"]`;
        } else if (attr.key === 'NAME') {
          selector += `[name="${attr.value}"]`;
        } else if (attr.key === 'CLASS') {
          selector += `.${attr.value}`;
        }
      }

      const elements = document.querySelectorAll(selector);
      return elements[pos - 1] || null;
    }

    selectOption(selectElement, value) {
      for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        if (option.text === value || option.value === value) {
          selectElement.selectedIndex = i;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
      }
    }

    extractFromElement(element, extractType) {
      switch (extractType.toUpperCase()) {
        case 'TXT':
          return element.textContent.trim();
        case 'HTM':
          return element.innerHTML;
        case 'HREF':
          return element.href || '';
        case 'SRC':
          return element.src || '';
        case 'ALT':
          return element.alt || '';
        case 'TITLE':
          return element.title || '';
        default:
          return element.getAttribute(extractType) || element.textContent.trim();
      }
    }

    async extractData(params) {
      const element = params.xpath 
        ? this.findElementByXPath(params.xpath)
        : this.findElementByParams(params);

      if (!element) {
        throw new Error('Element not found for extraction');
      }

      const value = this.extractFromElement(element, params.type || 'TXT');
      return { success: true, value };
    }

    flashElement(element) {
      const originalOutline = element.style.outline;
      element.style.outline = '3px solid #ff6b6b';
      
      setTimeout(() => {
        element.style.outline = originalOutline;
      }, 500);
    }

    highlightElement(selector) {
      if (this.highlightedElement) {
        this.highlightedElement.style.outline = '';
      }

      const element = document.querySelector(selector);
      if (element) {
        element.style.outline = '2px solid #4CAF50';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.highlightedElement = element;
      }
    }

    showRecordingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'imacros-indicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: bold;
          z-index: 999999;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          ⏺ Recording...
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      `;
      document.body.appendChild(indicator);
    }

    hideRecordingIndicator() {
      const indicator = document.querySelector('.imacros-indicator');
      if (indicator) {
        indicator.remove();
      }
    }

    sendActionToBackground(action) {
      chrome.runtime.sendMessage({
        action: 'recordAction',
        actionData: action
      }).catch(err => console.error('Failed to send action:', err));
    }

    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Initialize page interactor
  const interactor = new PageInteractor();

  // Notify that content script is loaded
  console.log('iMacros Content Script Loaded');
})();
