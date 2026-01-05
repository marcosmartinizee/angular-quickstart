// Email Header Extraction Module
// This module provides utilities for extracting and parsing email headers

class EmailHeaderExtractor {
  constructor() {
    this.supportedProviders = ['gmail', 'outlook', 'yahoo'];
  }

  /**
   * Extract comprehensive email headers from different providers
   */
  extractHeaders(provider, document) {
    const headers = {
      basic: {},
      extended: {},
      technical: {},
      metadata: {}
    };

    try {
      switch (provider) {
        case 'gmail':
          this.extractGmailHeaders(document, headers);
          break;
        case 'outlook':
          this.extractOutlookHeaders(document, headers);
          break;
        case 'yahoo':
          this.extractYahooHeaders(document, headers);
          break;
        default:
          this.extractGenericHeaders(document, headers);
      }

      // Add common technical headers
      this.addTechnicalHeaders(headers);

      return headers;
    } catch (error) {
      console.error('Error extracting headers:', error);
      return headers;
    }
  }

  /**
   * Extract Gmail-specific headers
   */
  extractGmailHeaders(doc, headers) {
    // Basic headers
    headers.basic = {
      'Subject': doc.querySelector('h2.hP')?.textContent?.trim() || '',
      'From': doc.querySelector('span.gD')?.getAttribute('email') ||
              doc.querySelector('span.go')?.textContent?.trim() || '',
      'From-Name': doc.querySelector('span.gD')?.getAttribute('name') || '',
      'To': doc.querySelector('span[email].g2')?.getAttribute('email') || '',
      'Date': doc.querySelector('span.g3')?.textContent?.trim() || '',
      'Reply-To': doc.querySelector('span[email].gH')?.getAttribute('email') || ''
    };

    // Try to get detailed headers
    const detailsButton = doc.querySelector('[data-tooltip="Show details"]');
    if (detailsButton) {
      detailsButton.click();

      setTimeout(() => {
        const detailsTable = doc.querySelector('table.cf.gJ');
        if (detailsTable) {
          const rows = detailsTable.querySelectorAll('tr');
          rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
              const key = cells[0].textContent.trim();
              const value = cells[1].textContent.trim();
              headers.extended[key] = value;
            }
          });
        }
      }, 500);
    }

    // Message ID
    const messageId = doc.querySelector('[data-message-id]')?.getAttribute('data-message-id');
    if (messageId) {
      headers.metadata['Message-ID'] = messageId;
    }

    // Thread ID
    const threadId = doc.querySelector('[data-thread-id]')?.getAttribute('data-thread-id');
    if (threadId) {
      headers.metadata['Thread-ID'] = threadId;
    }

    // Labels/Categories
    const labels = Array.from(doc.querySelectorAll('.ar.as')).map(el => el.textContent.trim());
    if (labels.length > 0) {
      headers.metadata['Labels'] = labels.join(', ');
    }
  }

  /**
   * Extract Outlook-specific headers
   */
  extractOutlookHeaders(doc, headers) {
    // Basic headers
    headers.basic = {
      'Subject': doc.querySelector('[role="heading"][aria-level="2"]')?.textContent?.trim() || '',
      'From': this.extractOutlookEmail(doc, 'From:'),
      'To': this.extractOutlookEmail(doc, 'To:'),
      'Cc': this.extractOutlookEmail(doc, 'Cc:'),
      'Date': doc.querySelector('[aria-label*="Received:"]')?.textContent?.replace('Received:', '').trim() || ''
    };

    // Message headers button
    const moreBtn = doc.querySelector('[aria-label*="More options"]');
    if (moreBtn) {
      moreBtn.click();

      setTimeout(() => {
        const viewSourceBtn = doc.querySelector('[aria-label*="View message source"]');
        if (viewSourceBtn) {
          // This would open the raw message source
          headers.metadata['Source-Available'] = 'true';
        }
      }, 300);
    }

    // Internet headers
    const internetHeadersBtn = doc.querySelector('[title*="Internet headers"]');
    if (internetHeadersBtn) {
      headers.metadata['Internet-Headers-Available'] = 'true';
    }
  }

  /**
   * Extract Yahoo-specific headers
   */
  extractYahooHeaders(doc, headers) {
    headers.basic = {
      'Subject': doc.querySelector('[data-test-id="message-subject"]')?.textContent?.trim() || '',
      'From': doc.querySelector('[data-test-id="message-from-email"]')?.textContent?.trim() || '',
      'From-Name': doc.querySelector('[data-test-id="message-from-name"]')?.textContent?.trim() || '',
      'To': doc.querySelector('[data-test-id="message-to"]')?.textContent?.trim() || '',
      'Date': doc.querySelector('[data-test-id="message-date"]')?.textContent?.trim() || ''
    };

    // Additional details
    const moreButton = doc.querySelector('[data-test-id="more-options"]');
    if (moreButton) {
      headers.metadata['More-Options-Available'] = 'true';
    }
  }

  /**
   * Extract generic headers for unknown providers
   */
  extractGenericHeaders(doc, headers) {
    // Try common selectors
    const possibleSubjects = doc.querySelectorAll('h1, h2, [class*="subject"], [id*="subject"]');
    for (const el of possibleSubjects) {
      if (el.textContent.length > 0 && el.textContent.length < 200) {
        headers.basic['Subject'] = el.textContent.trim();
        break;
      }
    }

    // Try to find email addresses
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const bodyText = doc.body.textContent;
    const emails = bodyText.match(emailRegex);
    if (emails && emails.length > 0) {
      headers.basic['Emails-Found'] = emails.slice(0, 5).join(', ');
    }
  }

  /**
   * Helper to extract Outlook email
   */
  extractOutlookEmail(doc, label) {
    const elements = doc.querySelectorAll(`[aria-label*="${label}"]`);
    for (const el of elements) {
      const text = el.textContent.trim();
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        return emailMatch[0];
      }
    }
    return '';
  }

  /**
   * Add technical headers
   */
  addTechnicalHeaders(headers) {
    headers.technical = {
      'User-Agent': navigator.userAgent,
      'Platform': navigator.platform,
      'Language': navigator.language,
      'Screen-Resolution': `${screen.width}x${screen.height}`,
      'Viewport': `${window.innerWidth}x${window.innerHeight}`,
      'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Timestamp': new Date().toISOString(),
      'URL': window.location.href,
      'Referrer': document.referrer || 'direct'
    };

    // Add browser-specific info
    if (navigator.brave) {
      headers.technical['Browser'] = 'Brave';
    } else if (navigator.userAgent.includes('Edg')) {
      headers.technical['Browser'] = 'Edge';
    } else if (navigator.userAgent.includes('Chrome')) {
      headers.technical['Browser'] = 'Chrome';
    } else if (navigator.userAgent.includes('Firefox')) {
      headers.technical['Browser'] = 'Firefox';
    } else if (navigator.userAgent.includes('Safari')) {
      headers.technical['Browser'] = 'Safari';
    }
  }

  /**
   * Parse raw email headers from text
   */
  parseRawHeaders(rawHeaderText) {
    const headers = {};
    const lines = rawHeaderText.split('\n');

    let currentKey = null;
    let currentValue = '';

    for (const line of lines) {
      // Check if line starts with whitespace (continuation)
      if (line.match(/^\s/) && currentKey) {
        currentValue += ' ' + line.trim();
      } else {
        // Save previous header
        if (currentKey) {
          headers[currentKey] = currentValue.trim();
        }

        // Parse new header
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentKey = line.substring(0, colonIndex).trim();
          currentValue = line.substring(colonIndex + 1).trim();
        }
      }
    }

    // Save last header
    if (currentKey) {
      headers[currentKey] = currentValue.trim();
    }

    return headers;
  }

  /**
   * Format headers as string
   */
  formatHeaders(headers) {
    const lines = [];

    if (headers.basic && Object.keys(headers.basic).length > 0) {
      lines.push('=== BASIC HEADERS ===');
      for (const [key, value] of Object.entries(headers.basic)) {
        if (value) {
          lines.push(`${key}: ${value}`);
        }
      }
      lines.push('');
    }

    if (headers.extended && Object.keys(headers.extended).length > 0) {
      lines.push('=== EXTENDED HEADERS ===');
      for (const [key, value] of Object.entries(headers.extended)) {
        if (value) {
          lines.push(`${key}: ${value}`);
        }
      }
      lines.push('');
    }

    if (headers.technical && Object.keys(headers.technical).length > 0) {
      lines.push('=== TECHNICAL HEADERS ===');
      for (const [key, value] of Object.entries(headers.technical)) {
        if (value) {
          lines.push(`${key}: ${value}`);
        }
      }
      lines.push('');
    }

    if (headers.metadata && Object.keys(headers.metadata).length > 0) {
      lines.push('=== METADATA ===');
      for (const [key, value] of Object.entries(headers.metadata)) {
        if (value) {
          lines.push(`${key}: ${value}`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Export headers to various formats
   */
  exportHeaders(headers, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(headers, null, 2);
      case 'text':
        return this.formatHeaders(headers);
      case 'csv':
        return this.headersToCSV(headers);
      default:
        return JSON.stringify(headers);
    }
  }

  /**
   * Convert headers to CSV format
   */
  headersToCSV(headers) {
    const rows = [];
    rows.push(['Category', 'Header', 'Value']);

    for (const [category, headerObj] of Object.entries(headers)) {
      if (typeof headerObj === 'object') {
        for (const [key, value] of Object.entries(headerObj)) {
          rows.push([category, key, value]);
        }
      }
    }

    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailHeaderExtractor;
}
