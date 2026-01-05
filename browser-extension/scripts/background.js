// Background script for handling extension events and email processing

let emailResults = [];
let isProcessing = false;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'emailClicked') {
    handleEmailClick(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'emailOpened') {
    handleEmailOpened(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'getResults') {
    sendResponse({ results: emailResults });
  } else if (request.action === 'clearResults') {
    emailResults = [];
    sendResponse({ success: true });
  } else if (request.action === 'startProcessing') {
    startEmailProcessing(sender.tab.id);
    sendResponse({ success: true });
  } else if (request.action === 'stopProcessing') {
    isProcessing = false;
    sendResponse({ success: true });
  }
  return true;
});

// Handle email click event
function handleEmailClick(data) {
  console.log('Email clicked:', data);
  emailResults.push({
    type: 'click',
    timestamp: new Date().toISOString(),
    ...data
  });
  saveResults();
}

// Handle email opened event
function handleEmailOpened(data) {
  console.log('Email opened:', data);

  // Extract headers and add to results
  const result = {
    type: 'opened',
    timestamp: new Date().toISOString(),
    subject: data.subject,
    from: data.from,
    to: data.to,
    date: data.date,
    headers: data.headers || {},
    body: data.body ? data.body.substring(0, 500) : '',
    url: data.url
  };

  emailResults.push(result);
  saveResults();

  // Notify popup to update
  chrome.runtime.sendMessage({ action: 'resultsUpdated' }).catch(() => {});
}

// Save results to storage
function saveResults() {
  chrome.storage.local.set({ emailResults: emailResults }, () => {
    console.log('Results saved:', emailResults.length);
  });
}

// Load results from storage on startup
chrome.storage.local.get(['emailResults'], (result) => {
  if (result.emailResults) {
    emailResults = result.emailResults;
  }
});

// Start automated email processing
async function startEmailProcessing(tabId) {
  isProcessing = true;

  try {
    // Send message to content script to start processing
    await chrome.tabs.sendMessage(tabId, { action: 'startAutoProcessing' });
  } catch (error) {
    console.error('Error starting processing:', error);
    isProcessing = false;
  }
}

// Export results as JSON
function exportResults() {
  return {
    exportDate: new Date().toISOString(),
    totalEmails: emailResults.length,
    emails: emailResults
  };
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Popup will open automatically due to default_popup in manifest
});

console.log('Email Clicker & Header Extractor background script loaded');
