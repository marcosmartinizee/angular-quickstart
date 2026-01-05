// Content Script - Detecta y hace clic en correos electrónicos
(function() {
  'use strict';

  let emailsProcessed = [];
  let isAutoClickEnabled = false;
  let clickDelay = 2000; // 2 segundos entre clics

  // Detectar el proveedor de correo
  function detectEmailProvider() {
    const hostname = window.location.hostname;
    if (hostname.includes('mail.google.com')) return 'gmail';
    if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com')) return 'outlook';
    if (hostname.includes('mail.yahoo.com')) return 'yahoo';
    return 'unknown';
  }

  // Selectores para diferentes proveedores
  const selectors = {
    gmail: {
      emailRow: 'tr.zA, div[role="main"] tr[jsaction]',
      emailSubject: 'span.bog',
      emailSender: 'span.yW span[email]',
      openEmail: 'div[role="main"]',
      headerButton: 'div[data-tooltip="Mostrar original"]'
    },
    outlook: {
      emailRow: 'div[role="listitem"], div[data-convid]',
      emailSubject: 'span[title]',
      emailSender: 'span.XG5Jd',
      openEmail: 'div[role="region"]',
      headerButton: 'button[aria-label*="More"]'
    },
    yahoo: {
      emailRow: 'div[data-test-id="message-list-item"]',
      emailSubject: 'span[data-test-id="message-list-item-subject"]',
      emailSender: 'span[data-test-id="message-list-item-from"]',
      openEmail: 'div[data-test-id="message-view"]',
      headerButton: 'button[data-test-id="more-actions"]'
    }
  };

  // Extraer información del correo
  function extractEmailInfo(element, provider) {
    const sel = selectors[provider];
    if (!sel) return null;

    try {
      const subject = element.querySelector(sel.emailSubject)?.textContent?.trim() || 'Sin asunto';
      const sender = element.querySelector(sel.emailSender)?.textContent?.trim() || 'Desconocido';
      const timestamp = new Date().toISOString();
      
      return {
        subject,
        sender,
        timestamp,
        provider,
        url: window.location.href
      };
    } catch (error) {
      console.error('Error extrayendo información del correo:', error);
      return null;
    }
  }

  // Extraer headers del correo abierto
  function extractEmailHeaders() {
    const provider = detectEmailProvider();
    const headers = {
      'X-Provider': provider,
      'X-URL': window.location.href,
      'X-Timestamp': new Date().toISOString(),
      'User-Agent': navigator.userAgent,
      'Referrer': document.referrer || 'none'
    };

    // Intentar extraer headers específicos del DOM
    if (provider === 'gmail') {
      const headerElements = document.querySelectorAll('table.cf.gJ tr');
      headerElements.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const key = cells[0].textContent.trim();
          const value = cells[1].textContent.trim();
          if (key && value) {
            headers[key] = value;
          }
        }
      });
    }

    // Headers adicionales del documento
    headers['Content-Type'] = document.contentType || 'text/html';
    headers['Document-Title'] = document.title;
    headers['Document-Charset'] = document.characterSet;
    headers['Document-ReadyState'] = document.readyState;

    return headers;
  }

  // Hacer clic en un correo
  function clickEmail(element, provider) {
    return new Promise((resolve) => {
      const info = extractEmailInfo(element, provider);
      if (!info) {
        resolve(null);
        return;
      }

      // Marcar como procesado
      emailsProcessed.push(info);

      // Simular clic
      element.click();
      
      // Esperar a que se abra el correo
      setTimeout(() => {
        const headers = extractEmailHeaders();
        const result = {
          ...info,
          headers,
          clickedAt: new Date().toISOString()
        };

        // Enviar resultado al background script
        chrome.runtime.sendMessage({
          type: 'EMAIL_CLICKED',
          data: result
        });

        resolve(result);
      }, 1500);
    });
  }

  // Obtener todos los correos en la página
  function getAllEmails() {
    const provider = detectEmailProvider();
    if (provider === 'unknown') return [];

    const selector = selectors[provider]?.emailRow;
    if (!selector) return [];

    return Array.from(document.querySelectorAll(selector));
  }

  // Proceso automático de clic en correos
  async function autoClickEmails() {
    if (!isAutoClickEnabled) return;

    const provider = detectEmailProvider();
    const emails = getAllEmails();
    
    console.log(`[Email Auto Clicker] Encontrados ${emails.length} correos en ${provider}`);

    for (let i = 0; i < emails.length && isAutoClickEnabled; i++) {
      const email = emails[i];
      
      // Verificar si ya fue procesado
      const info = extractEmailInfo(email, provider);
      const alreadyProcessed = emailsProcessed.some(
        e => e.subject === info?.subject && e.sender === info?.sender
      );

      if (!alreadyProcessed) {
        console.log(`[Email Auto Clicker] Haciendo clic en correo ${i + 1}/${emails.length}`);
        await clickEmail(email, provider);
        
        // Esperar antes del siguiente clic
        if (i < emails.length - 1) {
          await new Promise(resolve => setTimeout(resolve, clickDelay));
        }
      }
    }

    // Notificar que terminó el proceso
    chrome.runtime.sendMessage({
      type: 'AUTO_CLICK_COMPLETED',
      data: {
        total: emails.length,
        processed: emailsProcessed.length
      }
    });
  }

  // Escuchar mensajes del popup/background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'START_AUTO_CLICK':
        isAutoClickEnabled = true;
        clickDelay = message.delay || 2000;
        emailsProcessed = [];
        autoClickEmails();
        sendResponse({ success: true });
        break;

      case 'STOP_AUTO_CLICK':
        isAutoClickEnabled = false;
        sendResponse({ success: true });
        break;

      case 'GET_EMAIL_COUNT':
        const emails = getAllEmails();
        sendResponse({ count: emails.length, provider: detectEmailProvider() });
        break;

      case 'GET_PROCESSED_EMAILS':
        sendResponse({ emails: emailsProcessed });
        break;

      case 'EXTRACT_HEADERS':
        const headers = extractEmailHeaders();
        sendResponse({ headers });
        break;

      case 'CLICK_SINGLE_EMAIL':
        const provider = detectEmailProvider();
        const emailElements = getAllEmails();
        if (emailElements[message.index]) {
          clickEmail(emailElements[message.index], provider).then(result => {
            sendResponse({ success: true, result });
          });
          return true; // Mantener el canal abierto para respuesta asíncrona
        } else {
          sendResponse({ success: false, error: 'Email no encontrado' });
        }
        break;

      default:
        sendResponse({ error: 'Comando desconocido' });
    }
    return true;
  });

  // Notificar que el content script está listo
  chrome.runtime.sendMessage({
    type: 'CONTENT_SCRIPT_READY',
    data: {
      provider: detectEmailProvider(),
      url: window.location.href
    }
  });

  console.log('[Email Auto Clicker] Content script cargado en:', detectEmailProvider());
})();
