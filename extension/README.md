# iMacros Web Automation Extension

A powerful Chrome extension for browser automation that supports iMacros syntax. Record, edit, and replay web automation macros with ease.

## Features

### 🎯 Core Functionality
- **Macro Recording**: Record your browser interactions automatically
- **Macro Playback**: Replay recorded macros with adjustable speed
- **iMacros Syntax**: Full support for standard iMacros command syntax
- **Visual Editor**: Built-in code editor for macro customization
- **Macro Library**: Organize and manage all your macros in one place

### 📝 Supported Commands
- `URL GOTO=url` - Navigate to a URL
- `TAG` - Interact with page elements (click, fill, select)
- `WAIT SECONDS=n` - Wait for specified time
- `SET !VAR value` - Set variables
- `EXTRACT` - Extract data from pages
- `SAVEAS` - Save extracted data to files
- `TAB` - Manage browser tabs

### 🎨 User Interface
- **Popup**: Quick access to recording and playback controls
- **Sidebar**: Full macro library and editor
- **Options**: Customizable settings and preferences

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`) - Toggle recording
- `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Play last macro

## Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `extension` folder

### From Chrome Web Store
*(Coming soon)*

## Usage

### Recording a Macro
1. Click the extension icon in your toolbar
2. Click the "Record" button
3. Perform actions on any webpage
4. Click "Stop Recording" when done
5. Give your macro a name and save it

### Playing a Macro
1. Open the extension popup or sidebar
2. Select a macro from the list
3. Click the "Play" button
4. Watch as your actions are replayed automatically

### Editing a Macro
1. Open the sidebar (click "Library" in popup)
2. Select a macro from the list
3. Edit the macro code directly
4. Click "Save" to update

### Importing/Exporting Macros
- **Import**: Click "Import" in the sidebar and select a `.iim` file
- **Export**: Select a macro and click "Export" to download

## iMacros Syntax Examples

### Fill a Form
```
VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/form
TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:name CONTENT="John Doe"
TAG POS=1 TYPE=INPUT:EMAIL ATTR=ID:email CONTENT=john@example.com
TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Submit CONTENT=EVENT:CLICK
```

### Extract Data
```
VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/data
TAG POS=1 TYPE=H1 ATTR=CLASS:title EXTRACT=TXT
TAG POS=1 TYPE=DIV ATTR=CLASS:price EXTRACT=TXT
SAVEAS TYPE=EXTRACT FOLDER=data.txt
```

### Login Automation
```
VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://example.com/login
TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:username CONTENT=myuser
TAG POS=1 TYPE=INPUT:PASSWORD ATTR=ID:password CONTENT=mypass
TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Login CONTENT=EVENT:CLICK
WAIT SECONDS=3
```

### Using Variables
```
VERSION BUILD=1.0.0 RECORDER=CR
SET !USERNAME myuser
SET !PASSWORD mypass
TAB T=1
URL GOTO=https://example.com/login
TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:username CONTENT={{USERNAME}}
TAG POS=1 TYPE=INPUT:PASSWORD ATTR=ID:password CONTENT={{PASSWORD}}
```

## Settings

Access settings by clicking "Settings" in the popup or navigating to the options page.

### Available Settings
- **Playback Speed**: Control macro execution speed (0.1x - 10x)
- **Default Wait Time**: Set default wait between actions
- **Highlight Elements**: Visual feedback during playback
- **Use XPath**: Prefer XPath for element identification
- **Auto-save**: Automatically save recordings
- **Max Retries**: Number of retry attempts for failed actions
- **Page Timeout**: Maximum wait time for page loads
- **Debug Mode**: Enable detailed console logging

## Compatibility

### Browser Support
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires adaptation to Manifest V2)

### iMacros Compatibility
This extension aims to be compatible with standard iMacros syntax. Most common commands are supported, including:
- TAG commands with various selectors
- URL navigation
- Variable system
- Data extraction
- File operations

## Troubleshooting

### Macro Not Playing
- Ensure the target webpage is fully loaded
- Check that element selectors are correct
- Try increasing wait times between actions
- Enable debug mode in settings for detailed logs

### Recording Not Working
- Refresh the page and try again
- Check that the extension has permissions for the site
- Ensure you're not on a restricted page (chrome://, etc.)

### Element Not Found
- Use XPath for more reliable element selection
- Add WAIT commands before interacting with elements
- Check if the page structure has changed

## Development

### Project Structure
```
extension/
├── manifest.json          # Extension manifest
├── background.js          # Service worker (macro engine)
├── content.js            # Content script (page interaction)
├── popup.html/js         # Extension popup UI
├── sidebar.html/js       # Macro library sidebar
├── options.html/js       # Settings page
├── icons/                # Extension icons
└── README.md            # This file
```

### Building from Source
No build process required - this is a pure JavaScript extension.

### Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.

## Credits

Inspired by the original iMacros extension for Firefox. This is an independent implementation for Chrome with Manifest V3 support.

## Support

For issues, questions, or feature requests, please open an issue on the project repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Manifest Version**: 3
