const fs = require('fs');
const path = require('path');

// Function to generate a bounce email .eml file
function generateBounceEmail(filename, bounceType, recipient, sender) {
  const date = new Date().toUTCString();

  let subject;
  let htmlBody;

  switch (bounceType) {
    case 'mailbox_full':
      subject = 'Delivery Status Notification (Failure) - Mailbox Full';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong> because the recipient's mailbox is full.</p>
          <p>Please try resending your message later or contact the recipient by other means.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
      break;

    case 'user_unknown':
      subject = 'Delivery Status Notification (Failure) - User Unknown';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong> because the address is not recognized.</p>
          <p>Please check the recipient's email address and try again.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
      break;

    case 'message_too_large':
      subject = 'Delivery Status Notification (Failure) - Message Too Large';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong> because it exceeds the maximum allowed size.</p>
          <p>Please reduce the size of your message and try again.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
      break;

    case 'spam_rejection':
      subject = 'Delivery Status Notification (Failure) - Message Rejected as Spam';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong> because it was identified as spam.</p>
          <p>Please review your message content and try again.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
      break;

    case 'temporary_failure':
      subject = 'Delivery Status Notification (Failure) - Temporary Server Error';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong> due to a temporary server error.</p>
          <p>The message will be retried automatically. No action is required at this time.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
      break;

    default:
      subject = 'Delivery Status Notification (Failure)';
      htmlBody = `
        <html>
        <body>
          <h2>Delivery Status Notification</h2>
          <p>Your message could not be delivered to <strong>${recipient}</strong>.</p>
          <hr>
          <p><strong>Original Message Details:</strong></p>
          <p>From: ${sender}</p>
          <p>To: ${recipient}</p>
          <p>Subject: Test Message</p>
        </body>
        </html>
      `;
  }

  const emlContent = `Return-Path: <mailer-daemon@example.com>
Received: by mail.example.com id abc123; ${date}
Date: ${date}
From: Mail Delivery System <mailer-daemon@example.com>
To: ${sender}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary123"

--boundary123
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

${htmlBody}

--boundary123--
`;

  fs.writeFileSync(path.join(__dirname, filename), emlContent, 'utf8');
  console.log(`Generated: ${filename}`);
}

// Generate 5 different bounce email .eml files
const bounceTypes = ['mailbox_full', 'user_unknown', 'message_too_large', 'spam_rejection', 'temporary_failure'];

bounceTypes.forEach((type, index) => {
  const filename = `bounce_email_${index + 1}.eml`;
  const recipient = `user${index + 1}@example.com`;
  const sender = 'sender@example.com';

  generateBounceEmail(filename, type, recipient, sender);
});

console.log('All bounce email .eml files generated successfully!');