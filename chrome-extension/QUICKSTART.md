# MacroMaster - Quick Start Guide

Get started with MacroMaster in 5 minutes!

## Installation (2 minutes)

1. **Open Chrome Extensions**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle in top-right corner

3. **Load Extension**
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
   - Done! 🎉

## Your First Macro (3 minutes)

### Record a Simple Macro

1. **Click the MacroMaster icon** in your toolbar

2. **Click "Record"**

3. **Open any website** (e.g., https://example.com)

4. **Perform actions:**
   - Click a link
   - Fill a form
   - Click a button

5. **Click "Stop"**

6. **Name your macro** (e.g., "My First Macro")

7. **Click Save**

### Play Your Macro

1. **Click MacroMaster icon**

2. **Click "Open Sidebar"**

3. **Find your macro** in the list

4. **Click the ▶️ Play button**

5. **Watch it replay!** 🚀

## Common Use Cases

### Fill a Form Automatically
```
1. Navigate to form page
2. Click Record
3. Fill out all fields
4. Submit form
5. Stop recording
6. Replay anytime!
```

### Extract Data from Pages
```
1. Navigate to target page
2. Open Sidebar → Create New
3. Write macro:
   TAG CLASS:price EXTRACT=TXT
   TAG CLASS:title EXTRACT=TXT
4. Save and Play
5. Check console for extracted data
```

### Automate Login
```
VERSION BUILD=1.0.0
URL GOTO=https://yoursite.com/login
TAG ID:username
CONTENT=yourusername
TAG ID:password
CONTENT=yourpassword
TAG ID:login-button
WAIT SECONDS=2
```

⚠️ **Security Note**: Don't save real passwords in macros!

## Essential Commands

| Command | What It Does | Example |
|---------|--------------|---------|
| `URL GOTO=<url>` | Navigate to URL | `URL GOTO=https://google.com` |
| `TAG <selector>` | Click element | `TAG ID:submit-button` |
| `CONTENT=<text>` | Type text | `CONTENT=Hello World` |
| `WAIT SECONDS=<n>` | Wait N seconds | `WAIT SECONDS=3` |
| `EXTRACT=TXT` | Extract text | `TAG CLASS:price EXTRACT=TXT` |

## Tips for Success

### ✅ DO:
- Start with simple macros
- Use ID selectors when possible
- Add WAIT commands for slow pages
- Test macros before saving
- Export important macros

### ❌ DON'T:
- Record on login pages with real credentials
- Skip WAIT commands on dynamic sites
- Use macros on CAPTCHA-protected pages
- Forget to test on target website

## Keyboard Shortcuts

*Coming soon - configure in chrome://extensions/shortcuts*

## Troubleshooting

### Macro doesn't play?
- Check if page structure changed
- Add more WAIT commands
- Verify selectors in DevTools

### Elements not found?
- Use more specific selectors
- Increase timeout in Settings
- Check if element is in iframe

### Recording not working?
- Refresh the page
- Check extension permissions
- Try another website

## Next Steps

1. **Read the examples** → `EXAMPLES.md`
2. **Explore settings** → Click gear icon
3. **Create advanced macros** → Sidebar → Create New
4. **Share your macros** → Export feature

## Get Help

- 📖 Full documentation in `README.md`
- 💡 Examples in `EXAMPLES.md`
- 🔧 Installation help in `INSTALLATION.md`
- 🐛 Report issues on GitHub

## Pro Tips

### Speed Up Development
1. Keep sidebar open while working
2. Test macros line-by-line
3. Use variables for reusability
4. Export macros regularly

### Make Macros Reliable
1. Use stable selectors (IDs > classes)
2. Add waits for dynamic content
3. Test on fresh browser session
4. Handle errors gracefully (configure in settings)

### Boost Productivity
1. Create macro templates
2. Use keyboard shortcuts (once available)
3. Organize macros with prefixes
4. Share macros with team

## Example: Complete Workflow

### Scenario: Daily Website Check

```
VERSION BUILD=1.0.0

' Step 1: Login
URL GOTO=https://example.com/login
TAG ID:email
CONTENT=user@example.com
TAG ID:password
CONTENT=mypassword
TAG BUTTON:type=submit
WAIT SECONDS=3

' Step 2: Navigate to dashboard
URL GOTO=https://example.com/dashboard
WAIT SECONDS=2

' Step 3: Extract data
TAG CLASS:total-sales EXTRACT=TXT
TAG CLASS:new-orders EXTRACT=TXT
TAG CLASS:revenue EXTRACT=TXT

' Step 4: Logout
URL GOTO=https://example.com/logout
```

Save this as "Daily Dashboard Check" and run it every morning!

## Advanced: JavaScript Console

Open DevTools (F12) to see:
- Execution logs
- Extracted data
- Error messages
- Performance info

Enable "Debug Mode" in settings for detailed logs.

## Resources

### Inside the Extension
- README.md - Full feature list
- EXAMPLES.md - 15+ macro examples
- INSTALLATION.md - Detailed setup

### Online
- GitHub Repository
- Issue Tracker
- Discussions Forum
- Video Tutorials (coming soon)

## Common Questions

**Q: Is this free?**
A: Yes! 100% free and open source.

**Q: Does it work on all websites?**
A: Most websites, but some (banks, sites with CAPTCHA) may block automation.

**Q: Can I share macros?**
A: Yes! Use Export/Import feature.

**Q: Is my data safe?**
A: All data stored locally. No cloud sync, no tracking.

**Q: Can I use this for work?**
A: Yes! MIT License allows commercial use.

## You're Ready! 🎉

Start automating and save hours every week!

### Quick Commands Cheat Sheet

```
' Comment
VERSION BUILD=1.0.0
URL GOTO=https://example.com
TAG ID:element
TAG CLASS:button
TAG [data-testid="submit"]
CONTENT=Text to type
WAIT SECONDS=5
EXTRACT=TXT
EXTRACT=HTM
EXTRACT=HREF
SET myVar VALUE=Hello
{{myVar}}
```

Happy automating! 🚀

---

**MacroMaster** - Your web automation companion
