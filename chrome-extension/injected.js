// Injected script - Runs in page context for deeper access

(function() {
  'use strict';

  // Enhanced element interaction capabilities
  window.macroMasterAPI = {
    version: '1.0.0',

    // Click with various event types
    click(selector, eventType = 'click') {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Element not found: ${selector}`);

      const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      });
      element.dispatchEvent(event);
      return true;
    },

    // Set value with proper events
    setValue(selector, value) {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Element not found: ${selector}`);

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;

      nativeInputValueSetter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    },

    // Extract data from elements
    extract(selector, type = 'text') {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Element not found: ${selector}`);

      switch (type) {
        case 'text':
          return element.textContent.trim();
        case 'html':
          return element.innerHTML;
        case 'value':
          return element.value;
        case 'href':
          return element.href;
        case 'src':
          return element.src;
        default:
          return element.getAttribute(type);
      }
    },

    // Wait for element
    async waitForElement(selector, timeout = 10000) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error(`Element not found after ${timeout}ms: ${selector}`);
    },

    // Execute JavaScript in page context
    eval(code) {
      return eval(code);
    },

    // Get all form data
    getFormData(formSelector) {
      const form = document.querySelector(formSelector);
      if (!form) throw new Error(`Form not found: ${formSelector}`);

      const formData = new FormData(form);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    },

    // Scroll to element
    scrollTo(selector) {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Element not found: ${selector}`);

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return true;
    },

    // Get page info
    getPageInfo() {
      return {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        cookies: document.cookie
      };
    }
  };

  // Listen for custom events from content script
  window.addEventListener('macroMasterExecute', async (event) => {
    const { command, params, id } = event.detail;

    try {
      let result;
      switch (command) {
        case 'click':
          result = window.macroMasterAPI.click(params.selector, params.type);
          break;
        case 'setValue':
          result = window.macroMasterAPI.setValue(params.selector, params.value);
          break;
        case 'extract':
          result = window.macroMasterAPI.extract(params.selector, params.type);
          break;
        case 'waitForElement':
          result = await window.macroMasterAPI.waitForElement(params.selector, params.timeout);
          break;
        case 'eval':
          result = window.macroMasterAPI.eval(params.code);
          break;
        case 'getFormData':
          result = window.macroMasterAPI.getFormData(params.selector);
          break;
        case 'scrollTo':
          result = window.macroMasterAPI.scrollTo(params.selector);
          break;
        case 'getPageInfo':
          result = window.macroMasterAPI.getPageInfo();
          break;
        default:
          throw new Error(`Unknown command: ${command}`);
      }

      window.dispatchEvent(new CustomEvent('macroMasterResult', {
        detail: { id, success: true, result }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('macroMasterResult', {
        detail: { id, success: false, error: error.message }
      }));
    }
  });

  console.log('MacroMaster injected script loaded');
})();
