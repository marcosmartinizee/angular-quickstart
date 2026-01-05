# MacroMaster Installation Guide

## Installation Methods

### Method 1: Load Unpacked Extension (Recommended for Testing)

This is the easiest method for installing the extension during development or testing.

#### Steps:

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for the "Developer mode" toggle in the top-right corner
   - Click to enable it (it should turn blue/green)

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to the `chrome-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "MacroMaster" in your extensions list
   - The extension icon should appear in your Chrome toolbar
   - If not visible, click the puzzle icon and pin MacroMaster

5. **Grant Permissions**
   - Click on the extension icon
   - If prompted, grant necessary permissions
   - The extension needs these permissions to function properly

### Method 2: Pack and Install as CRX

For more permanent installation or distribution:

#### Steps to Pack:

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable Developer mode

2. **Pack Extension**
   - Click "Pack extension"
   - Browse to the `chrome-extension` folder
   - Leave "Private key file" empty (for first-time packing)
   - Click "Pack Extension"

3. **Result**
   - Two files will be created:
     - `chrome-extension.crx` - The packed extension
     - `chrome-extension.pem` - Private key (keep this safe!)

4. **Install CRX**
   - Drag and drop the `.crx` file onto the extensions page
   - Click "Add extension" when prompted

**Note:** Chrome may warn about "apps, extensions, and user scripts" from outside the Chrome Web Store. This is normal for development extensions.

### Method 3: Chrome Web Store (Future)

*Coming soon - The extension will be published to the Chrome Web Store*

## Troubleshooting Installation

### "Apps, extensions, and user scripts cannot be added from this website"

**Solution 1:**
- Don't try to open the .crx file directly
- Instead, drag it to the chrome://extensions/ page

**Solution 2:**
- Use Method 1 (Load unpacked) instead

### Extension doesn't appear in toolbar

**Solution:**
- Click the puzzle piece icon in Chrome toolbar
- Find MacroMaster in the list
- Click the pin icon to keep it visible

### "Manifest file is missing or unreadable"

**Solution:**
- Verify you selected the correct folder (should contain manifest.json)
- Check that manifest.json is valid JSON
- Ensure no files are corrupted

### "Could not load icon"

**Solution:**
- Verify the `icons` folder exists
- Check that icon files are present (icon16.png, icon32.png, icon48.png, icon128.png)
- If icons are missing, you can use placeholder images

### Permissions Issues

**Solution:**
- Remove and reinstall the extension
- When prompted, grant all requested permissions
- Some features require broad permissions (this is normal for automation tools)

## Updating the Extension

### For Unpacked Extensions:

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Find MacroMaster
4. Click the refresh/reload icon (circular arrow)

### For Packed Extensions:

1. Make changes to the code
2. Re-pack the extension (use the same .pem file)
3. Remove the old version from Chrome
4. Install the new .crx file

## Uninstalling

1. Go to `chrome://extensions/`
2. Find MacroMaster
3. Click "Remove"
4. Confirm removal
5. (Optional) Delete the extension files from your computer

## Permissions Explained

MacroMaster requires these permissions:

- **activeTab** - Access the current tab for recording/playback
- **scripting** - Execute scripts for macro commands
- **storage** - Save your macros and settings
- **tabs** - Manage browser tabs
- **webNavigation** - Detect page navigation
- **webRequest** - Monitor network requests
- **downloads** - Export macros to files
- **clipboardWrite/Read** - Copy/paste operations
- **contextMenus** - Right-click menu integration
- **host_permissions: <all_urls>** - Access any website for automation

**Why so many permissions?**
Automation tools need broad access to function properly. MacroMaster:
- ✅ Stores all data locally
- ✅ Never sends data to external servers
- ✅ No telemetry or tracking
- ✅ Open source code for transparency

## First Run Setup

After installation:

1. **Click the Extension Icon**
   - The popup will open
   - Familiarize yourself with the controls

2. **Open Settings**
   - Click the gear/settings icon
   - Configure your preferences
   - Recommended settings are pre-selected

3. **Try Recording**
   - Navigate to any website
   - Click "Record" in the popup
   - Perform some actions
   - Click "Stop"
   - Save your first macro!

4. **Explore the Sidebar**
   - Click "Open Sidebar"
   - View your saved macros
   - Edit and test macros
   - Import example macros

## Compatible Browsers

### Fully Supported:
- ✅ Google Chrome 88+
- ✅ Microsoft Edge 88+ (Chromium-based)
- ✅ Brave Browser (latest)
- ✅ Opera 74+ (Chromium-based)

### Not Supported:
- ❌ Firefox (different extension API)
- ❌ Safari (different extension API)
- ❌ Internet Explorer (deprecated)

### Note for Edge Users:
The installation process is identical to Chrome. Just replace "chrome://" with "edge://" in URLs.

## System Requirements

- **Operating System:** Windows 7+, macOS 10.11+, Linux
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 10MB for extension + storage for macros
- **Internet:** Required for web page access (not for the extension itself)

## Privacy & Security

### Data Storage
- All macros stored locally in Chrome's storage
- No cloud sync (by design)
- Export/import for backup and sharing

### Security Best Practices
- Don't record sensitive information (passwords, credit cards)
- Be cautious with macros from unknown sources
- Review imported macros before running
- Use Chrome's password manager instead of storing credentials in macros

### Sensitive Sites
Some websites may block automation:
- Banking sites
- Payment processors
- Sites with CAPTCHA
- Single Sign-On (SSO) pages

This is expected behavior for security reasons.

## Getting Help

### Documentation
- README.md - Feature overview and command reference
- This file - Installation help

### Issues
- Check existing GitHub issues
- Create a new issue with:
  - Chrome version
  - Operating system
  - Steps to reproduce
  - Error messages (if any)

### Community
- GitHub Discussions
- Stack Overflow (tag: macromaster)

## Advanced Installation

### Enterprise Deployment

For organizations deploying to multiple machines:

1. **Create Managed Installation**
   - Pack the extension
   - Host the .crx file internally
   - Use Chrome Enterprise policies
   - Force-install via Group Policy

2. **Policy Configuration**
   ```json
   {
     "ExtensionInstallForcelist": [
       "extensionid;https://your-server.com/macromaster.crx"
     ]
   }
   ```

### Custom Build

To modify the extension:

1. Clone the repository
2. Edit source files
3. Test with "Load unpacked"
4. Pack for distribution
5. Keep your .pem file secure!

## Next Steps

Once installed:
- 📖 Read the README.md for features
- 🎯 Try the example macros
- ⚙️ Configure settings
- 🚀 Create your first automation!

---

**Need help?** Open an issue on GitHub or check the documentation.
