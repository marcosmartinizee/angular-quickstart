// Background Service Worker - Gestión de datos y comunicación
(function() {
  'use strict';

  let emailDatabase = [];
  let sessionStats = {
    startTime: null,
    totalClicks: 0,
    totalEmails: 0,
    providers: {}
  };

  // Inicializar al instalar la extensión
  chrome.runtime.onInstalled.addListener((details) => {
    console.log('[Background] Extensión instalada:', details.reason);
    
    // Inicializar storage
    chrome.storage.local.set({
      processedEmails: [],
      sessionStats: sessionStats,
      settings: {
        autoClickDelay: 2000,
        maxEmailsPerSession: 100,
        enableNotifications: true
      }
    });

    // Mostrar página de bienvenida
    if (details.reason === 'install') {
      chrome.tabs.create({
        url: chrome.runtime.getURL('welcome.html')
      });
    }
  });

  // Escuchar mensajes de content scripts y popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Background] Mensaje recibido:', message.type);

    switch (message.type) {
      case 'CONTENT_SCRIPT_READY':
        handleContentScriptReady(message.data, sender);
        sendResponse({ success: true });
        break;

      case 'EMAIL_CLICKED':
        handleEmailClicked(message.data);
        sendResponse({ success: true });
        break;

      case 'AUTO_CLICK_COMPLETED':
        handleAutoClickCompleted(message.data);
        sendResponse({ success: true });
        break;

      case 'GET_SESSION_STATS':
        sendResponse({ stats: sessionStats });
        break;

      case 'RESET_SESSION':
        resetSession();
        sendResponse({ success: true });
        break;

      case 'GET_DATABASE':
        sendResponse({ database: emailDatabase });
        break;

      case 'EXPORT_DATABASE':
        exportDatabase();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: 'Comando desconocido' });
    }

    return true;
  });

  // Manejar cuando el content script está listo
  function handleContentScriptReady(data, sender) {
    console.log('[Background] Content script listo en:', data.provider);
    
    // Actualizar estadísticas de proveedor
    if (!sessionStats.providers[data.provider]) {
      sessionStats.providers[data.provider] = {
        visits: 0,
        emailsProcessed: 0
      };
    }
    sessionStats.providers[data.provider].visits++;

    // Guardar en storage
    chrome.storage.local.set({ sessionStats });
  }

  // Manejar cuando se hace clic en un email
  function handleEmailClicked(data) {
    console.log('[Background] Email procesado:', data.subject);

    // Agregar a la base de datos
    const emailEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...data
    };

    emailDatabase.push(emailEntry);
    sessionStats.totalClicks++;
    sessionStats.totalEmails++;

    // Actualizar estadísticas del proveedor
    if (sessionStats.providers[data.provider]) {
      sessionStats.providers[data.provider].emailsProcessed++;
    }

    // Guardar en storage
    chrome.storage.local.set({
      emailDatabase,
      sessionStats
    });

    // Enviar notificación si está habilitado
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings?.enableNotifications) {
        showNotification(
          'Email Procesado',
          `${data.subject}\nDe: ${data.sender}`
        );
      }
    });

    // Reenviar a todas las pestañas del popup abiertas
    chrome.runtime.sendMessage({
      type: 'EMAIL_CLICKED',
      data: emailEntry
    }).catch(() => {
      // Ignorar si no hay popup abierto
    });
  }

  // Manejar cuando se completa el auto-click
  function handleAutoClickCompleted(data) {
    console.log('[Background] Auto-click completado:', data);

    // Mostrar notificación
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings?.enableNotifications) {
        showNotification(
          'Auto-Click Completado',
          `Procesados: ${data.processed} de ${data.total} correos`
        );
      }
    });

    // Reenviar al popup
    chrome.runtime.sendMessage({
      type: 'AUTO_CLICK_COMPLETED',
      data
    }).catch(() => {
      // Ignorar si no hay popup abierto
    });
  }

  // Mostrar notificación
  function showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: title,
      message: message,
      priority: 1
    });
  }

  // Generar ID único
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Resetear sesión
  function resetSession() {
    emailDatabase = [];
    sessionStats = {
      startTime: new Date().toISOString(),
      totalClicks: 0,
      totalEmails: 0,
      providers: {}
    };

    chrome.storage.local.set({
      emailDatabase,
      sessionStats,
      processedEmails: []
    });

    console.log('[Background] Sesión reseteada');
  }

  // Exportar base de datos
  function exportDatabase() {
    const exportData = {
      exportDate: new Date().toISOString(),
      sessionStats,
      totalEmails: emailDatabase.length,
      emails: emailDatabase
    };

    // Crear blob y descargar
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: `email-database-${Date.now()}.json`,
      saveAs: true
    });
  }

  // Limpiar datos antiguos periódicamente (cada 24 horas)
  function cleanupOldData() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    emailDatabase = emailDatabase.filter(email => {
      const emailTime = new Date(email.timestamp).getTime();
      return emailTime > oneDayAgo;
    });

    chrome.storage.local.set({ emailDatabase });
    console.log('[Background] Limpieza de datos antiguos completada');
  }

  // Ejecutar limpieza cada 6 horas
  setInterval(cleanupOldData, 6 * 60 * 60 * 1000);

  // Manejar actualizaciones de la extensión
  chrome.runtime.onUpdateAvailable.addListener((details) => {
    console.log('[Background] Actualización disponible:', details.version);
  });

  // Inicializar sesión al cargar
  sessionStats.startTime = new Date().toISOString();
  chrome.storage.local.set({ sessionStats });

  console.log('[Background] Service Worker iniciado');
})();
