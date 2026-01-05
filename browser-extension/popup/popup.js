// Popup script for Email Clicker & Header Extractor

let allResults = [];
let currentFilter = 'all';

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadResults();
  setupEventListeners();
  updateLastUpdateTime();

  // Listen for results updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'resultsUpdated') {
      loadResults();
    }
  });
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById('startBtn').addEventListener('click', startAutoProcessing);
  document.getElementById('stopBtn').addEventListener('click', stopAutoProcessing);
  document.getElementById('clickOneBtn').addEventListener('click', clickSingleEmail);
  document.getElementById('extractBtn').addEventListener('click', extractCurrentEmail);
  document.getElementById('refreshBtn').addEventListener('click', loadResults);
  document.getElementById('exportBtn').addEventListener('click', exportResults);
  document.getElementById('clearBtn').addEventListener('click', clearResults);
  document.getElementById('filterProvider').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    displayResults();
  });
}

// Start auto-processing emails
async function startAutoProcessing() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || (!tab.url.includes('mail.google.com') &&
                      !tab.url.includes('outlook') &&
                      !tab.url.includes('mail.yahoo.com'))) {
      alert('Please navigate to Gmail, Outlook, or Yahoo Mail first!');
      return;
    }

    // Send message to content script
    await chrome.tabs.sendMessage(tab.id, { action: 'startAutoProcessing' });

    // Update UI
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    showNotification('Auto-processing started!', 'success');
  } catch (error) {
    console.error('Error starting auto-processing:', error);
    showNotification('Error: ' + error.message, 'error');
  }
}

// Stop auto-processing
async function stopAutoProcessing() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tab.id, { action: 'stopAutoProcessing' });

    // Update UI
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    showNotification('Auto-processing stopped!', 'info');
  } catch (error) {
    console.error('Error stopping auto-processing:', error);
  }
}

// Click single email
async function clickSingleEmail() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || (!tab.url.includes('mail.google.com') &&
                      !tab.url.includes('outlook') &&
                      !tab.url.includes('mail.yahoo.com'))) {
      alert('Please navigate to Gmail, Outlook, or Yahoo Mail first!');
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'clickSingleEmail' });

    if (response.success) {
      showNotification('Email clicked successfully!', 'success');
      setTimeout(loadResults, 2000);
    } else {
      showNotification('No emails found!', 'error');
    }
  } catch (error) {
    console.error('Error clicking email:', error);
    showNotification('Error: ' + error.message, 'error');
  }
}

// Extract current email
async function extractCurrentEmail() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || (!tab.url.includes('mail.google.com') &&
                      !tab.url.includes('outlook') &&
                      !tab.url.includes('mail.yahoo.com'))) {
      alert('Please open an email first!');
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractCurrentEmail' });

    if (response.success) {
      // Send to background for storage
      await chrome.runtime.sendMessage({
        action: 'emailOpened',
        data: response.data
      });

      showNotification('Email extracted successfully!', 'success');
      setTimeout(loadResults, 500);
    }
  } catch (error) {
    console.error('Error extracting email:', error);
    showNotification('Error: ' + error.message, 'error');
  }
}

// Load results from background
async function loadResults() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getResults' });
    allResults = response.results || [];
    displayResults();
    updateLastUpdateTime();
  } catch (error) {
    console.error('Error loading results:', error);
  }
}

// Display results in UI
function displayResults() {
  const container = document.getElementById('resultsContainer');
  const emailCount = document.getElementById('emailCount');

  // Filter results
  const filteredResults = currentFilter === 'all'
    ? allResults
    : allResults.filter(r => r.provider === currentFilter);

  // Update count
  emailCount.textContent = filteredResults.length;

  if (filteredResults.length === 0) {
    container.innerHTML = '<p class="empty-message">No emails found. Try clicking some emails or start auto-processing.</p>';
    return;
  }

  // Display only "opened" type results
  const openedEmails = filteredResults.filter(r => r.type === 'opened');

  if (openedEmails.length === 0) {
    container.innerHTML = '<p class="empty-message">No opened emails yet. Click on some emails to see results.</p>';
    return;
  }

  container.innerHTML = openedEmails.map((email, index) => `
    <div class="email-item" data-index="${index}">
      <div class="email-header">
        <div class="email-subject">${escapeHtml(email.subject || 'No Subject')}</div>
        <span class="email-badge">${email.provider || 'unknown'}</span>
      </div>
      <div class="email-from">From: ${escapeHtml(email.from || 'Unknown')}</div>
      <div class="email-date">Date: ${email.date || 'Unknown'} | Extracted: ${formatDate(email.timestamp)}</div>
      <div class="email-actions">
        <button class="btn-small toggle-headers" data-index="${index}">Show Headers</button>
        <button class="btn-small copy-headers" data-index="${index}">Copy Headers</button>
      </div>
      <div class="email-headers collapsed" id="headers-${index}">
        ${formatHeaders(email)}
      </div>
    </div>
  `).join('');

  // Add event listeners for toggle buttons
  document.querySelectorAll('.toggle-headers').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const headersDiv = document.getElementById(`headers-${index}`);
      const isCollapsed = headersDiv.classList.contains('collapsed');

      if (isCollapsed) {
        headersDiv.classList.remove('collapsed');
        e.target.textContent = 'Hide Headers';
      } else {
        headersDiv.classList.add('collapsed');
        e.target.textContent = 'Show Headers';
      }
    });
  });

  // Add event listeners for copy buttons
  document.querySelectorAll('.copy-headers').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const email = openedEmails[index];
      const headersText = formatHeadersAsText(email);

      navigator.clipboard.writeText(headersText).then(() => {
        showNotification('Headers copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Error copying headers:', err);
        showNotification('Error copying headers', 'error');
      });
    });
  });
}

// Format headers for display
function formatHeaders(email) {
  const headers = [];

  headers.push(`<strong>Subject:</strong> ${escapeHtml(email.subject || 'N/A')}`);
  headers.push(`<strong>From:</strong> ${escapeHtml(email.from || 'N/A')}`);
  headers.push(`<strong>To:</strong> ${escapeHtml(email.to || 'N/A')}`);
  headers.push(`<strong>Date:</strong> ${escapeHtml(email.date || 'N/A')}`);
  headers.push(`<strong>URL:</strong> ${escapeHtml(email.url || 'N/A')}`);

  if (email.headers && Object.keys(email.headers).length > 0) {
    headers.push('<br><strong>Additional Headers:</strong>');
    Object.entries(email.headers).forEach(([key, value]) => {
      headers.push(`<strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}`);
    });
  }

  return headers.join('<br>');
}

// Format headers as plain text
function formatHeadersAsText(email) {
  const lines = [];

  lines.push(`Subject: ${email.subject || 'N/A'}`);
  lines.push(`From: ${email.from || 'N/A'}`);
  lines.push(`To: ${email.to || 'N/A'}`);
  lines.push(`Date: ${email.date || 'N/A'}`);
  lines.push(`URL: ${email.url || 'N/A'}`);
  lines.push(`Timestamp: ${email.timestamp || 'N/A'}`);

  if (email.headers && Object.keys(email.headers).length > 0) {
    lines.push('\nAdditional Headers:');
    Object.entries(email.headers).forEach(([key, value]) => {
      lines.push(`${key}: ${value}`);
    });
  }

  return lines.join('\n');
}

// Export results as JSON
async function exportResults() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getResults' });
    const results = response.results || [];

    const exportData = {
      exportDate: new Date().toISOString(),
      totalEmails: results.length,
      emails: results
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-headers-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Results exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting results:', error);
    showNotification('Error exporting results', 'error');
  }
}

// Clear all results
async function clearResults() {
  if (confirm('Are you sure you want to clear all results?')) {
    try {
      await chrome.runtime.sendMessage({ action: 'clearResults' });
      allResults = [];
      displayResults();
      showNotification('Results cleared!', 'info');
    } catch (error) {
      console.error('Error clearing results:', error);
      showNotification('Error clearing results', 'error');
    }
  }
}

// Update last update time
function updateLastUpdateTime() {
  const lastUpdate = document.getElementById('lastUpdate');
  lastUpdate.textContent = new Date().toLocaleTimeString();
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 6px;
    z-index: 10000;
    font-size: 13px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Auto-refresh every 5 seconds if processing
setInterval(() => {
  if (!document.getElementById('startBtn').disabled) return;
  loadResults();
}, 5000);
