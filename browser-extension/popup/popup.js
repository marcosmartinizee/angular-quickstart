// Popup Script - Interfaz de usuario
(function() {
  'use strict';

  let isRunning = false;
  let processedEmails = [];
  let currentHeaders = {};

  // Elementos del DOM
  const elements = {
    status: document.getElementById('status'),
    provider: document.getElementById('provider'),
    emailCount: document.getElementById('emailCount'),
    processedCount: document.getElementById('processedCount'),
    delayInput: document.getElementById('delayInput'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    clearBtn: document.getElementById('clearBtn'),
    exportBtn: document.getElementById('exportBtn'),
    extractHeadersBtn: document.getElementById('extractHeadersBtn'),
    copyHeadersBtn: document.getElementById('copyHeadersBtn'),
    results: document.getElementById('results'),
    headers: document.getElementById('headers')
  };

  // Obtener la pestaña activa
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  // Enviar mensaje al content script
  async function sendMessageToContent(message) {
    const tab = await getActiveTab();
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          resolve({ error: chrome.runtime.lastError.message });
        } else {
          resolve(response);
        }
      });
    });
  }

  // Actualizar estado de la UI
  function updateStatus(status, isActive = false) {
    elements.status.textContent = status;
    elements.status.className = 'status-value ' + (isActive ? 'active' : 'inactive');
  }

  // Actualizar información del proveedor
  async function updateProviderInfo() {
    const response = await sendMessageToContent({ type: 'GET_EMAIL_COUNT' });
    if (response && !response.error) {
      elements.provider.textContent = response.provider.toUpperCase();
      elements.emailCount.textContent = response.count;
    } else {
      elements.provider.textContent = 'No detectado';
      elements.emailCount.textContent = '0';
    }
  }

  // Renderizar resultados
  function renderResults() {
    if (processedEmails.length === 0) {
      elements.results.innerHTML = '<p class="empty-state">No hay resultados aún. Inicia el auto-click para comenzar.</p>';
      return;
    }

    const html = processedEmails.map((email, index) => `
      <div class="email-item">
        <div class="email-subject">${escapeHtml(email.subject)}</div>
        <div class="email-sender">De: ${escapeHtml(email.sender)}</div>
        <div class="email-meta">
          <span>📅 ${formatDate(email.clickedAt)}</span>
          <span>🌐 ${email.provider.toUpperCase()}</span>
        </div>
      </div>
    `).join('');

    elements.results.innerHTML = html;
    elements.processedCount.textContent = processedEmails.length;
  }

  // Renderizar headers
  function renderHeaders(headers) {
    if (!headers || Object.keys(headers).length === 0) {
      elements.headers.innerHTML = '<p class="empty-state">Abre un correo y haz clic en "Extraer Headers"</p>';
      return;
    }

    currentHeaders = headers;
    const html = Object.entries(headers).map(([key, value]) => `
      <div class="header-item">
        <div class="header-key">${escapeHtml(key)}:</div>
        <div class="header-value">${escapeHtml(String(value))}</div>
      </div>
    `).join('');

    elements.headers.innerHTML = html;
  }

  // Formatear fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Escapar HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Iniciar auto-click
  async function startAutoClick() {
    const delay = parseInt(elements.delayInput.value) || 2000;
    
    isRunning = true;
    updateStatus('Ejecutando...', true);
    elements.startBtn.disabled = true;
    elements.stopBtn.disabled = false;
    elements.delayInput.disabled = true;

    await sendMessageToContent({
      type: 'START_AUTO_CLICK',
      delay: delay
    });
  }

  // Detener auto-click
  async function stopAutoClick() {
    isRunning = false;
    updateStatus('Detenido', false);
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    elements.delayInput.disabled = false;

    await sendMessageToContent({ type: 'STOP_AUTO_CLICK' });
  }

  // Actualizar información
  async function refresh() {
    await updateProviderInfo();
    const response = await sendMessageToContent({ type: 'GET_PROCESSED_EMAILS' });
    if (response && response.emails) {
      processedEmails = response.emails;
      renderResults();
    }
  }

  // Limpiar resultados
  function clearResults() {
    processedEmails = [];
    renderResults();
    chrome.storage.local.set({ processedEmails: [] });
  }

  // Exportar a JSON
  function exportToJson() {
    const data = {
      exportDate: new Date().toISOString(),
      totalEmails: processedEmails.length,
      emails: processedEmails,
      headers: currentHeaders
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Extraer headers
  async function extractHeaders() {
    const response = await sendMessageToContent({ type: 'EXTRACT_HEADERS' });
    if (response && response.headers) {
      renderHeaders(response.headers);
    }
  }

  // Copiar headers al portapapeles
  async function copyHeaders() {
    if (Object.keys(currentHeaders).length === 0) {
      alert('No hay headers para copiar. Extrae los headers primero.');
      return;
    }

    const text = Object.entries(currentHeaders)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      elements.copyHeadersBtn.textContent = '✓ Copiado';
      setTimeout(() => {
        elements.copyHeadersBtn.textContent = 'Copiar';
      }, 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('Error al copiar al portapapeles');
    }
  }

  // Event listeners
  elements.startBtn.addEventListener('click', startAutoClick);
  elements.stopBtn.addEventListener('click', stopAutoClick);
  elements.refreshBtn.addEventListener('click', refresh);
  elements.clearBtn.addEventListener('click', clearResults);
  elements.exportBtn.addEventListener('click', exportToJson);
  elements.extractHeadersBtn.addEventListener('click', extractHeaders);
  elements.copyHeadersBtn.addEventListener('click', copyHeaders);

  // Escuchar mensajes del background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'EMAIL_CLICKED':
        processedEmails.push(message.data);
        renderResults();
        chrome.storage.local.set({ processedEmails });
        break;

      case 'AUTO_CLICK_COMPLETED':
        updateStatus('Completado', false);
        elements.startBtn.disabled = false;
        elements.stopBtn.disabled = true;
        elements.delayInput.disabled = false;
        isRunning = false;
        break;
    }
  });

  // Inicializar
  async function init() {
    // Cargar datos guardados
    const stored = await chrome.storage.local.get(['processedEmails']);
    if (stored.processedEmails) {
      processedEmails = stored.processedEmails;
      renderResults();
    }

    // Actualizar información inicial
    await updateProviderInfo();
    updateStatus('Listo', false);
  }

  // Ejecutar al cargar
  init();
})();
