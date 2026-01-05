# 🚀 Quick Start Guide - iMacros Web Automation

## Get Started in 3 Minutes!

### Step 1: Install the Extension (1 minute)

1. Open **Google Chrome** (or Edge/Brave)
2. Type `chrome://extensions/` in the address bar
3. Enable **"Developer mode"** (toggle in top-right)
4. Click **"Load unpacked"**
5. Navigate to and select the `extension` folder
6. Done! The extension icon appears in your toolbar

### Step 2: Record Your First Macro (1 minute)

1. **Click** the extension icon (⚡) in your toolbar
2. **Click** the red "Record" button
3. **Navigate** to any website (e.g., https://example.com)
4. **Click** on something on the page
5. **Click** "Stop Recording" in the extension popup
6. **Enter** a name for your macro (e.g., "My First Macro")
7. **Click** Save

Congratulations! You just recorded your first macro! 🎉

### Step 3: Play Your Macro (30 seconds)

1. **Click** the extension icon
2. **Select** your macro from the list
3. **Click** the green "Play" button
4. **Watch** as your actions are replayed automatically!

## What Can You Do?

### 🎯 Common Use Cases

#### 1. Fill Forms Automatically
Record yourself filling a form once, then replay it instantly:
```
- Navigate to form
- Fill in name, email, etc.
- Click submit
- Done!
```

#### 2. Extract Data from Websites
Automatically collect information:
```
- Navigate to product page
- Extract product name
- Extract price
- Save to file
```

#### 3. Automate Login
Never type your credentials again:
```
- Go to login page
- Enter username
- Enter password
- Click login
```

#### 4. Repetitive Tasks
Automate anything you do repeatedly:
```
- Click through multiple pages
- Download files
- Submit forms
- Navigate menus
```

## 📚 Learn More

### Open the Macro Library
1. Click extension icon
2. Click "Library" button
3. See all your macros
4. Edit, import, export, or create new ones

### Try Sample Macros
1. Open the sidebar (Library)
2. Click "Samples" button
3. Choose a sample to learn from
4. Modify it for your needs

### Customize Settings
1. Click extension icon
2. Click "Settings"
3. Adjust playback speed, recording options, etc.

## 💡 Pro Tips

### Tip 1: Use the Sidebar for Editing
The sidebar gives you a full code editor where you can:
- Edit macro code directly
- Add comments
- Use variables
- Create complex automation

### Tip 2: Add Wait Times
If a macro runs too fast, add wait commands:
```
WAIT SECONDS=2
```

### Tip 3: Use Variables
Make macros reusable with variables:
```
SET !USERNAME myuser
TAG ... CONTENT={{USERNAME}}
```

### Tip 4: Keyboard Shortcuts
- `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`) - Toggle recording
- `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Play last macro

### Tip 5: Export Your Macros
Save your macros as files:
1. Open sidebar
2. Select a macro
3. Click "Export"
4. Share with others or backup

## 🎓 Example: Automate a Search

Let's create a macro that searches Google:

### Method 1: Record It
1. Click "Record"
2. Go to https://google.com
3. Type "iMacros" in search box
4. Click "Google Search"
5. Stop recording
6. Save as "Google Search"

### Method 2: Write It Manually
1. Open sidebar
2. Click "New Macro"
3. Paste this code:
```
VERSION BUILD=1.0.0 RECORDER=CR
TAB T=1
URL GOTO=https://google.com
TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:q CONTENT=iMacros
TAG POS=1 TYPE=INPUT:SUBMIT ATTR=NAME:btnK CONTENT=EVENT:CLICK
```
4. Save and play!

## 🔧 Troubleshooting

### Macro Doesn't Work?
- **Add wait times**: `WAIT SECONDS=2` between actions
- **Check the website**: Did it change?
- **Try XPath**: Enable in settings for better element finding

### Recording Not Starting?
- **Refresh the page** you want to record on
- **Check permissions**: Extension needs access to the site
- **Not on chrome:// pages**: Can't record on browser internal pages

### Element Not Found?
- **Use the sidebar** to edit the macro
- **Add more specific selectors**: ID, class, or XPath
- **Add wait before action**: Page might not be loaded

## 📖 Next Steps

1. **Read the README**: Full documentation in `extension/README.md`
2. **Check Installation Guide**: Detailed setup in `extension/INSTALL.md`
3. **Review Project Overview**: Complete feature list in `PROJECT_OVERVIEW.md`
4. **Experiment**: Try recording different actions
5. **Learn iMacros Syntax**: Check the command reference in README

## 🎯 Your First Real Automation

Try this challenge:
1. Record a macro that:
   - Opens a website
   - Fills a form
   - Clicks submit
2. Edit the macro to use variables
3. Export it as a file
4. Import it back
5. Share it with a friend!

## 🆘 Need Help?

- **Console Logs**: Press F12 and check Console tab
- **Debug Mode**: Enable in Settings for detailed logs
- **Check Documentation**: README has extensive examples
- **Test on Simple Sites**: Start with example.com

## 🎉 You're Ready!

You now know how to:
- ✅ Install the extension
- ✅ Record macros
- ✅ Play macros
- ✅ Edit macros
- ✅ Use the library
- ✅ Troubleshoot issues

**Start automating and save hours of repetitive work!** 🚀

---

**Remember**: The extension works on any website. The possibilities are endless!

Happy Automating! ⚡
