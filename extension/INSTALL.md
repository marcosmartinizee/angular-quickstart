# Installation Guide - iMacros Web Automation Extension

## Quick Start (5 minutes)

### Step 1: Prepare the Extension
The extension is ready to use in the `extension` folder. No build process required!

### Step 2: Load in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Select the `extension` folder from this project
6. The extension icon should appear in your toolbar

### Step 3: Pin the Extension (Optional)
1. Click the puzzle piece icon in Chrome toolbar
2. Find "iMacros Web Automation"
3. Click the pin icon to keep it visible

### Step 4: Start Using
1. Click the extension icon
2. Click "Record" to start recording
3. Perform actions on any webpage
4. Click "Stop Recording" when done
5. Save your macro and replay it anytime!

## Detailed Installation

### For Chrome/Edge/Brave

#### Method 1: Developer Mode (Recommended for Testing)
```bash
1. Open browser
2. Go to: chrome://extensions/ (or edge://extensions/)
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Navigate to and select the 'extension' folder
6. Extension is now installed!
```

#### Method 2: Packed Extension (.crx)
```bash
1. In chrome://extensions/, click "Pack extension"
2. Select the 'extension' folder as root directory
3. Click "Pack Extension"
4. A .crx file will be created
5. Drag and drop the .crx file into chrome://extensions/
```

### For Firefox (Requires Adaptation)
This extension uses Manifest V3 which is Chrome-specific. For Firefox:
1. Convert manifest.json to Manifest V2 format
2. Replace service worker with background scripts
3. Adjust browser-specific APIs

### Permissions Explained

The extension requires these permissions:

- **storage**: Save macros and settings locally
- **tabs**: Access and control browser tabs
- **activeTab**: Interact with the current tab
- **scripting**: Inject content scripts for recording/playback
- **downloads**: Export macros and extracted data
- **clipboardWrite/Read**: Copy/paste functionality
- **webNavigation**: Detect page loads
- **host_permissions (<all_urls>)**: Work on any website

All permissions are used solely for macro automation functionality.

## Verification

After installation, verify everything works:

### 1. Check Extension Icon
- Extension icon should appear in toolbar
- Click it to open popup

### 2. Test Recording
```
1. Navigate to any website (e.g., https://example.com)
2. Click extension icon
3. Click "Record"
4. Click something on the page
5. Click "Stop Recording"
6. You should see recorded actions
```

### 3. Test Playback
```
1. Select a recorded macro
2. Click "Play"
3. Watch it replay your actions
```

### 4. Open Sidebar
```
1. Click "Library" in popup
2. Sidebar should open with macro list
3. Try creating a new macro manually
```

## Troubleshooting

### Extension Not Loading
**Problem**: "Manifest file is missing or unreadable"
**Solution**: Ensure you selected the `extension` folder, not the parent folder

### Icons Not Showing
**Problem**: Extension loads but icons are broken
**Solution**: Icons are placeholder PNGs. They work but are minimal. This is normal.

### Recording Not Working
**Problem**: Nothing happens when clicking "Record"
**Solution**: 
- Refresh the webpage you want to record on
- Check that you're not on a restricted page (chrome://, etc.)
- Open DevTools console (F12) and check for errors

### Playback Fails
**Problem**: Macro doesn't replay correctly
**Solution**:
- Ensure you're on the same or similar page
- Add WAIT commands between actions
- Check element selectors in the macro code

### Permission Errors
**Problem**: "Cannot access chrome:// URLs"
**Solution**: Extensions cannot run on browser internal pages. Use regular websites.

## Updating the Extension

### Manual Update
1. Make changes to extension files
2. Go to chrome://extensions/
3. Click the refresh icon on the extension card
4. Changes are now live

### Auto-reload During Development
For faster development, use an extension like "Extension Reloader" or manually refresh after each change.

## Uninstallation

### Remove Extension
1. Go to chrome://extensions/
2. Find "iMacros Web Automation"
3. Click "Remove"
4. Confirm removal

### Clean Up Data
Extension data is stored in Chrome's local storage. To completely remove:
1. Uninstall the extension (above)
2. Data is automatically cleared on uninstall

## Next Steps

After installation:

1. **Read the README**: Check README.md for usage examples
2. **Try Samples**: Use the "Samples" button in sidebar for examples
3. **Customize Settings**: Open options page to configure behavior
4. **Learn Syntax**: Review iMacros command syntax in README

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Enable Debug Mode in settings
3. Check browser console for errors (F12)
4. Review the README.md for usage help

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 88+     | ✅ Fully Supported |
| Edge    | 88+     | ✅ Fully Supported |
| Brave   | Latest  | ✅ Fully Supported |
| Opera   | Latest  | ✅ Fully Supported |
| Firefox | Any     | ⚠️ Requires Adaptation |

---

**Ready to automate?** Start recording your first macro! 🚀
