// Content script for interacting with email web pages

(function() {
  'use strict';

  let isAutoProcessing = false;
  let processedEmails = new Set();
  let currentEmailIndex = 0;

  // Detect email provider
  const emailProvider = detectEmailProvider();

  console.log('Email Clicker & Header Extractor content script loaded for:', emailProvider);

  // Detect which email provider we're on
  function detectEmailProvider() {
    const hostname = window.location.hostname;
    if (hostname.includes('mail.google.com')) return 'gmail';
    if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com')) return 'outlook';
    if (hostname.includes('mail.yahoo.com')) return 'yahoo';
    return 'unknown';
  }

  // Get email list based on provider
  function getEmailElements() {
    switch (emailProvider) {
      case 'gmail':
        return document.querySelectorAll('tr.zA, div[role="row"][data-message-id]');
      case 'outlook':
        return document.querySelectorAll('div[role="listitem"][aria-label*="message"]');
      case 'yahoo':
        return document.querySelectorAll('a[data-test-id="message-list-item"]');
      default:
        return document.querySelectorAll('[data-email], [role="row"]');
    }
  }

  // Extract email data from element
  function extractEmailData(element) {
    const data = {
      provider: emailProvider,
      elementType: element.tagName,
      timestamp: new Date().toISOString()
    };

    try {
      switch (emailProvider) {
        case 'gmail':
          data.subject = element.querySelector('[data-thread-id]')?.textContent?.trim() ||
                         element.querySelector('span.bog')?.textContent?.trim() || 'No subject';
          data.from = element.querySelector('span[email]')?.getAttribute('email') ||
                      element.querySelector('.yW span')?.textContent?.trim() || 'Unknown';
          break;
        case 'outlook':
          data.subject = element.querySelector('[aria-label*="Subject"]')?.textContent?.trim() || 'No subject';
          data.from = element.querySelector('[aria-label*="From"]')?.textContent?.trim() || 'Unknown';
          break;
        case 'yahoo':
          data.subject = element.querySelector('[data-test-id="message-subject"]')?.textContent?.trim() || 'No subject';
          data.from = element.querySelector('[data-test-id="message-from"]')?.textContent?.trim() || 'Unknown';
          break;
      }
    } catch (error) {
      console.error('Error extracting email data:', error);
    }

    return data;
  }

  // Extract detailed email information when opened
  function extractOpenedEmailData() {
    const data = {
      provider: emailProvider,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      headers: {}
    };

    try {
      switch (emailProvider) {
        case 'gmail':
          data.subject = document.querySelector('h2.hP')?.textContent?.trim() || 'No subject';
          data.from = document.querySelector('span.gD')?.getAttribute('email') ||
                      document.querySelector('span.go')?.textContent?.trim() || 'Unknown';
          data.to = document.querySelector('span[email].g2')?.getAttribute('email') || 'Unknown';
          data.date = document.querySelector('span.g3')?.textContent?.trim() || 'Unknown';
          data.body = document.querySelector('div.a3s.aiL')?.textContent?.trim() || '';

          // Extract additional headers
          const showDetailsBtn = document.querySelector('[aria-label="Show details"]');
          if (showDetailsBtn && !showDetailsBtn.getAttribute('aria-expanded')) {
            showDetailsBtn.click();
            setTimeout(() => extractGmailHeaders(data), 500);
          }
          break;

        case 'outlook':
          data.subject = document.querySelector('[role="heading"][aria-level="2"]')?.textContent?.trim() || 'No subject';
          data.from = document.querySelector('[aria-label*="From:"]')?.textContent?.trim() || 'Unknown';
          data.to = document.querySelector('[aria-label*="To:"]')?.textContent?.trim() || 'Unknown';
          data.date = document.querySelector('[aria-label*="Received:"]')?.textContent?.trim() || 'Unknown';
          data.body = document.querySelector('div[role="document"]')?.textContent?.trim() || '';
          break;

        case 'yahoo':
          data.subject = document.querySelector('[data-test-id="message-subject"]')?.textContent?.trim() || 'No subject';
          data.from = document.querySelector('[data-test-id="message-from-email"]')?.textContent?.trim() || 'Unknown';
          data.to = document.querySelector('[data-test-id="message-to"]')?.textContent?.trim() || 'Unknown';
          data.date = document.querySelector('[data-test-id="message-date"]')?.textContent?.trim() || 'Unknown';
          data.body = document.querySelector('[data-test-id="message-view-body"]')?.textContent?.trim() || '';
          break;
      }

      // Common headers extraction
      data.headers['User-Agent'] = navigator.userAgent;
      data.headers['Content-Type'] = 'text/html';
      data.headers['X-Provider'] = emailProvider;

    } catch (error) {
      console.error('Error extracting opened email data:', error);
    }

    return data;
  }

  // Extract Gmail specific headers
  function extractGmailHeaders(data) {
    try {
      const detailsTable = document.querySelector('table.cf.gJ');
      if (detailsTable) {
        const rows = detailsTable.querySelectorAll('tr');
        rows.forEach(row => {
          const label = row.querySelector('td')?.textContent?.trim();
          const value = row.querySelector('td:last-child')?.textContent?.trim();
          if (label && value) {
            data.headers[label] = value;
          }
        });
      }
    } catch (error) {
      console.error('Error extracting Gmail headers:', error);
    }
  }

  // Click on email
  function clickEmail(element) {
    try {
      const emailData = extractEmailData(element);

      // Send click event to background
      chrome.runtime.sendMessage({
        action: 'emailClicked',
        data: emailData
      });

      // Click the element
      element.click();

      // Wait for email to open and extract data
      setTimeout(() => {
        const openedData = extractOpenedEmailData();
        chrome.runtime.sendMessage({
          action: 'emailOpened',
          data: openedData
        });
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error clicking email:', error);
      return false;
    }
  }

  // Auto-process emails one by one
  async function autoProcessEmails() {
    if (!isAutoProcessing) return;

    const emails = getEmailElements();
    console.log(`Found ${emails.length} emails`);

    if (currentEmailIndex >= emails.length) {
      console.log('All emails processed');
      isAutoProcessing = false;
      alert('Email processing completed! Check the extension popup for results.');
      return;
    }

    const email = emails[currentEmailIndex];
    const emailId = email.getAttribute('data-message-id') || email.getAttribute('id') || currentEmailIndex;

    if (!processedEmails.has(emailId)) {
      console.log(`Processing email ${currentEmailIndex + 1}/${emails.length}`);
      clickEmail(email);
      processedEmails.add(emailId);

      // Wait before processing next email
      currentEmailIndex++;
      setTimeout(() => {
        // Go back to email list
        if (emailProvider === 'gmail') {
          const backBtn = document.querySelector('[aria-label="Back to Inbox"]') ||
                          document.querySelector('[aria-label*="Back"]');
          if (backBtn) backBtn.click();
        }
        setTimeout(() => autoProcessEmails(), 2000);
      }, 3000);
    } else {
      currentEmailIndex++;
      autoProcessEmails();
    }
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startAutoProcessing') {
      isAutoProcessing = true;
      currentEmailIndex = 0;
      processedEmails.clear();
      autoProcessEmails();
      sendResponse({ success: true });
    } else if (request.action === 'stopAutoProcessing') {
      isAutoProcessing = false;
      sendResponse({ success: true });
    } else if (request.action === 'clickSingleEmail') {
      const emails = getEmailElements();
      if (emails.length > 0) {
        clickEmail(emails[0]);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'No emails found' });
      }
    } else if (request.action === 'extractCurrentEmail') {
      const data = extractOpenedEmailData();
      sendResponse({ success: true, data: data });
    }
    return true;
  });

  // Add visual indicator when extension is active
  const indicator = document.createElement('div');
  indicator.id = 'email-extension-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  indicator.textContent = 'Email Extension Active';
  document.body.appendChild(indicator);

  // Remove indicator after 3 seconds
  setTimeout(() => {
    indicator.style.transition = 'opacity 0.5s';
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 500);
  }, 3000);

})();
