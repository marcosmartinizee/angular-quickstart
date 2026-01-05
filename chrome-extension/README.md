# MacroMaster - Advanced Web Automation Extension

A powerful Chrome extension for web automation, macro recording, and task automation. Built as a modern replacement for iMacros with full Manifest V3 support.

## Features

### Core Functionality
- **Macro Recording** - Record your browser interactions automatically
- **Macro Playback** - Replay recorded macros with precision
- **Visual Editor** - Edit macros with syntax highlighting
- **Smart Selectors** - Intelligent element detection and selection
- **Variable System** - Use variables for dynamic macros
- **Data Extraction** - Extract data from web pages
- **File Operations** - Import/export macros easily

### Advanced Features
- **Command System** - Full iMacros-compatible command set
  - `URL GOTO=<url>` - Navigate to URLs
  - `TAG <selector>` - Interact with elements
  - `WAIT SECONDS=<n>` - Add delays
  - `SET <var> VALUE=<value>` - Set variables
  - `EXTRACT` - Extract page data
  - And many more...

- **Error Handling** - Configurable error behavior
- **Retry Logic** - Automatic retries for failed operations
- **Timeout Control** - Customizable timeout settings
- **Speed Control** - Adjust playback speed (0.1x - 5x)
- **Highlight Mode** - Visual feedback during execution

### User Interface
- **Modern Popup** - Quick access to controls
- **Sidebar Panel** - Full-featured control panel
- **Options Page** - Comprehensive settings
- **Context Menu** - Right-click to start recording
- **Notifications** - Real-time status updates

## Installation

### From Source
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `chrome-extension` folder
6. The extension icon will appear in your toolbar

### From Chrome Web Store
*Coming soon*

## Quick Start

### Recording a Macro
1. Click the MacroMaster icon in your toolbar
2. Click "Record" button
3. Perform actions on any web page
4. Click "Stop" when finished
5. Save your macro with a name

### Playing a Macro
1. Open the sidebar (click "Open Sidebar" in popup)
2. Select a macro from your list
3. Click the play button
4. Watch as your actions are replayed

### Creating Manual Macros
1. Open the sidebar
2. Click "Create New"
3. Enter macro commands (see command reference below)
4. Save and test your macro

## Command Reference

### Navigation
```
URL GOTO=https://example.com
URL BACK
URL REFRESH
```

### Element Interaction
```
TAG ID:myButton
TAG CLASS:submit-btn
TAG XPATH://button[@id='submit']
TAG CONTENT=Click Me
TAG POS=1
```

### Input and Forms
```
TAG ID:username
CONTENT=myusername
TAG ID:password
CONTENT=mypassword
TAG ID:submit-button
```

### Data Extraction
```
TAG ID:price EXTRACT=TXT
TAG ID:title EXTRACT=HTM
TAG A:nth-of-type(1) EXTRACT=HREF
```

### Control Flow
```
WAIT SECONDS=5
SET myVar VALUE=Hello
PROMPT Enter your name VARIABLE=userName
```

### Variables
```
{{myVar}}          - Use variable value
{{EXTRACT}}        - Last extracted value
```

## Examples

### Login Automation
```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/login
TAG ID:email
CONTENT=user@example.com
TAG ID:password
CONTENT=mypassword
TAG ID:login-button
WAIT SECONDS=2
```

### Data Scraping
```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/products
TAG CLASS:product-title EXTRACT=TXT
TAG CLASS:product-price EXTRACT=TXT
TAG CLASS:product-link EXTRACT=HREF
```

### Form Filling
```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/form
TAG ID:firstName
CONTENT=John
TAG ID:lastName
CONTENT=Doe
TAG ID:email
CONTENT=john@example.com
TAG ID:submit
```

## Settings

### Playback Settings
- **Default Timeout** - Maximum wait time for elements (1-300 seconds)
- **Replay Speed** - Control playback speed (0.1x - 5x)
- **Error Handling** - Stop, continue, or prompt on errors
- **Highlight Elements** - Visual feedback during execution
- **Show Tooltips** - Display helpful hints

### Recording Settings
- **Auto-save Recordings** - Automatically save when stopped
- **Record Mouse Hover** - Include hover events
- **Smart Selectors** - Use intelligent selector generation

### Advanced Settings
- **Log Level** - Console logging verbosity
- **Max Retries** - Number of retry attempts
- **Debug Mode** - Detailed debugging information

## Tips & Best Practices

1. **Use Stable Selectors** - Prefer IDs over classes when possible
2. **Add Waits** - Use `WAIT` commands for dynamic content
3. **Test Macros** - Always test in a safe environment first
4. **Use Variables** - Make macros reusable with variables
5. **Error Handling** - Configure appropriate error behavior
6. **Backup Macros** - Export important macros regularly

## Keyboard Shortcuts

*Coming soon - configurable via chrome://extensions/shortcuts*

## Browser Compatibility

- Chrome 88+ (Manifest V3 support required)
- Edge 88+ (Chromium-based)
- Opera 74+ (Chromium-based)
- Brave (Latest version)

## Privacy & Security

- **Local Storage Only** - All data stored locally
- **No Telemetry** - No data collection or tracking
- **Open Source** - Fully auditable code
- **Secure by Default** - Follows browser security policies

## Troubleshooting

### Macro Won't Record
- Ensure you're on a valid web page (not chrome:// or extension pages)
- Check that the extension has necessary permissions
- Try refreshing the page

### Macro Won't Play
- Verify the target page structure hasn't changed
- Check selector syntax
- Increase timeout settings
- Enable debug mode for detailed logs

### Elements Not Found
- Use more specific selectors
- Add `WAIT` commands before element interactions
- Check if elements are in iframes
- Verify element is visible and not hidden

## Technical Details

### Architecture
- **Manifest V3** - Latest Chrome extension standard
- **Service Worker** - Background processing
- **Content Scripts** - Page interaction
- **Storage API** - Data persistence
- **Messaging API** - Component communication

### File Structure
```
chrome-extension/
├── manifest.json       - Extension configuration
├── background.js       - Service worker
├── content.js         - Content script
├── injected.js        - Page context script
├── popup.html/js      - Extension popup
├── sidebar.html/js    - Side panel
├── options.html/js    - Settings page
└── icons/            - Extension icons
```

## Development

### Building from Source
No build process required - it's vanilla JavaScript!

### Contributing
Contributions welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Write clean, documented code
4. Test thoroughly
5. Submit a pull request

## Support

- **Issues** - Report bugs on GitHub
- **Discussions** - Ask questions in Discussions
- **Documentation** - Full docs at [link]

## License

MIT License - See LICENSE file for details

## Credits

Inspired by iMacros, rebuilt for modern browsers with Manifest V3 support.

## Version History

### v1.0.0 (2026-01-05)
- Initial release
- Full macro recording and playback
- iMacros command compatibility
- Modern UI with sidebar support
- Comprehensive settings
- Import/export functionality
- Variable system
- Error handling and retry logic

## Roadmap

- [ ] Keyboard shortcuts
- [ ] Scheduled macros
- [ ] Macro marketplace
- [ ] Mobile support
- [ ] Cloud sync (optional)
- [ ] Advanced scripting (JavaScript integration)
- [ ] Performance profiling
- [ ] Macro debugger
- [ ] Team collaboration features

---

**MacroMaster** - Automate your web, master your time.
