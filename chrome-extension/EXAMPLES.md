# MacroMaster - Example Macros

This document contains practical examples of macros you can create with MacroMaster.

## Basic Examples

### 1. Simple Page Navigation

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com
WAIT SECONDS=2
URL GOTO=https://example.com/about
WAIT SECONDS=2
URL GOTO=https://example.com/contact
```

### 2. Form Filling

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/contact
TAG ID:name
CONTENT=John Doe
TAG ID:email
CONTENT=john@example.com
TAG ID:message
CONTENT=This is an automated message
TAG ID:submit
```

### 3. Search Automation

```
VERSION BUILD=1.0.0
URL GOTO=https://www.google.com
TAG NAME:q
CONTENT=MacroMaster Chrome Extension
TAG NAME:btnK
WAIT SECONDS=3
```

## Intermediate Examples

### 4. Login Automation

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/login
WAIT SECONDS=1
TAG ID:username
CONTENT=myusername
TAG ID:password
CONTENT=mypassword
TAG ID:remember-me
TAG BUTTON:submit
WAIT SECONDS=3
```

**Security Note:** Never save real passwords in macros. Use variables or prompts instead.

### 5. Data Extraction

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/products
WAIT SECONDS=2
TAG CLASS:product-title EXTRACT=TXT
TAG CLASS:product-price EXTRACT=TXT
TAG CLASS:product-rating EXTRACT=TXT
TAG A:first-of-type EXTRACT=HREF
```

### 6. Multi-Page Navigation

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/page1
TAG CLASS:next-button
WAIT SECONDS=2
TAG CLASS:next-button
WAIT SECONDS=2
TAG CLASS:next-button
WAIT SECONDS=2
```

## Advanced Examples

### 7. E-commerce Automation

```
VERSION BUILD=1.0.0
' Navigate to product page
URL GOTO=https://shop.example.com/products/item123

' Select size
TAG ID:size-select
TAG OPTION:value=L

' Select color
TAG ID:color-select
TAG OPTION:value=blue

' Set quantity
TAG ID:quantity
CONTENT=2

' Add to cart
TAG ID:add-to-cart-button
WAIT SECONDS=2

' Verify cart
TAG ID:cart-icon
WAIT SECONDS=1
TAG CLASS:cart-total EXTRACT=TXT
```

### 8. Content Scraping with Loop Concept

```
VERSION BUILD=1.0.0
' Page 1
URL GOTO=https://news.example.com/page/1
WAIT SECONDS=2
TAG CSS:.article:nth-of-type(1) .title EXTRACT=TXT
TAG CSS:.article:nth-of-type(2) .title EXTRACT=TXT
TAG CSS:.article:nth-of-type(3) .title EXTRACT=TXT

' Page 2
URL GOTO=https://news.example.com/page/2
WAIT SECONDS=2
TAG CSS:.article:nth-of-type(1) .title EXTRACT=TXT
TAG CSS:.article:nth-of-type(2) .title EXTRACT=TXT
TAG CSS:.article:nth-of-type(3) .title EXTRACT=TXT
```

### 9. Form with Dynamic Content

```
VERSION BUILD=1.0.0
URL GOTO=https://example.com/dynamic-form

' Fill basic info
TAG ID:firstName
CONTENT=Jane
TAG ID:lastName
CONTENT=Smith

' Select from dropdown (wait for it to load)
WAIT SECONDS=1
TAG ID:country-select
TAG OPTION:text=United States

' Dynamic fields based on country
WAIT SECONDS=1
TAG ID:state-select
TAG OPTION:text=California

' Submit
TAG BUTTON:text=Submit
WAIT SECONDS=3
```

### 10. Social Media Post Automation

```
VERSION BUILD=1.0.0
' Navigate to social media
URL GOTO=https://socialmedia.example.com

' Wait for page load
WAIT SECONDS=3

' Click new post button
TAG BUTTON:aria-label=Create post

' Wait for dialog
WAIT SECONDS=1

' Enter post content
TAG ROLE:textbox
CONTENT=Check out this amazing automation tool! #automation #productivity

' Upload image (if needed)
' TAG INPUT:type=file
' CONTENT=C:\path\to\image.jpg

' Post
TAG BUTTON:text=Post
WAIT SECONDS=2
```

## Real-World Use Cases

### 11. Daily Report Generation

```
VERSION BUILD=1.0.0
' Login to dashboard
URL GOTO=https://dashboard.example.com/login
TAG ID:email
CONTENT={{userEmail}}
TAG ID:password
CONTENT={{userPassword}}
TAG BUTTON:type=submit
WAIT SECONDS=3

' Navigate to reports
URL GOTO=https://dashboard.example.com/reports

' Set date range to today
TAG ID:date-from
CONTENT={{today}}
TAG ID:date-to
CONTENT={{today}}

' Generate report
TAG BUTTON:text=Generate Report
WAIT SECONDS=5

' Extract results
TAG CLASS:total-sales EXTRACT=TXT
TAG CLASS:total-orders EXTRACT=TXT
TAG CLASS:total-revenue EXTRACT=TXT
```

### 12. Competitor Price Monitoring

```
VERSION BUILD=1.0.0
' Site 1
URL GOTO=https://competitor1.com/product-xyz
WAIT SECONDS=2
TAG CLASS:price EXTRACT=TXT

' Site 2
URL GOTO=https://competitor2.com/product-xyz
WAIT SECONDS=2
TAG CLASS:price-value EXTRACT=TXT

' Site 3
URL GOTO=https://competitor3.com/item/xyz
WAIT SECONDS=2
TAG SPAN:data-price EXTRACT=TXT
```

### 13. Bulk Account Setup

```
VERSION BUILD=1.0.0
' Registration form
URL GOTO=https://service.example.com/signup

' User 1
TAG ID:username
CONTENT=user001
TAG ID:email
CONTENT=user001@example.com
TAG ID:password
CONTENT=SecurePass123!
TAG ID:confirm-password
CONTENT=SecurePass123!
TAG ID:agree-terms
TAG BUTTON:type=submit
WAIT SECONDS=3

' Logout
URL GOTO=https://service.example.com/logout
WAIT SECONDS=2
```

### 14. Calendar Event Creation

```
VERSION BUILD=1.0.0
URL GOTO=https://calendar.example.com

' Create new event
TAG BUTTON:aria-label=Create event
WAIT SECONDS=1

' Fill event details
TAG ID:event-title
CONTENT=Team Meeting
TAG ID:event-date
CONTENT=2026-01-15
TAG ID:event-time
CONTENT=14:00
TAG ID:event-duration
CONTENT=60

' Add attendees
TAG ID:attendees
CONTENT=john@example.com, jane@example.com

' Set reminder
TAG ID:reminder-select
TAG OPTION:text=15 minutes before

' Save event
TAG BUTTON:text=Save
WAIT SECONDS=2
```

### 15. Testing Form Validation

```
VERSION BUILD=1.0.0
' Test empty form
URL GOTO=https://example.com/form
TAG BUTTON:type=submit
WAIT SECONDS=1
TAG CLASS:error-message EXTRACT=TXT

' Test invalid email
URL GOTO=https://example.com/form
TAG ID:email
CONTENT=notanemail
TAG BUTTON:type=submit
WAIT SECONDS=1
TAG CLASS:email-error EXTRACT=TXT

' Test valid submission
URL GOTO=https://example.com/form
TAG ID:name
CONTENT=Test User
TAG ID:email
CONTENT=test@example.com
TAG ID:message
CONTENT=Valid test message
TAG BUTTON:type=submit
WAIT SECONDS=2
TAG CLASS:success-message EXTRACT=TXT
```

## Pro Tips

### Using Variables

```
VERSION BUILD=1.0.0
SET username VALUE=testuser
SET email VALUE=test@example.com

URL GOTO=https://example.com/profile
TAG ID:username
CONTENT={{username}}
TAG ID:email
CONTENT={{email}}
TAG BUTTON:type=submit
```

### Smart Waiting

Instead of fixed waits:
```
VERSION BUILD=1.0.0
URL GOTO=https://example.com
' Wait for element to appear (automatic in playback)
TAG ID:dynamic-content
```

### Error Handling

Use settings to configure error behavior:
- Stop immediately
- Continue on error
- Prompt for action

### Selector Strategies

**Priority order:**
1. ID selectors (fastest, most reliable)
   ```
   TAG ID:myElement
   ```

2. Data attributes
   ```
   TAG [data-testid="submit-button"]
   ```

3. Class + position
   ```
   TAG CLASS:button:nth-of-type(2)
   ```

4. Text content
   ```
   TAG BUTTON:text=Submit
   ```

## Debugging Tips

1. **Run macro line by line** - Create small test macros
2. **Use WAIT commands** - Give dynamic content time to load
3. **Check selectors** - Use browser DevTools to verify
4. **Enable debug mode** - See detailed logs in settings
5. **Test on stable pages** - Avoid heavily dynamic content initially

## Limitations

Some scenarios are challenging:
- CAPTCHA (intentionally blocks automation)
- Complex JavaScript SPAs (may need longer waits)
- Shadow DOM (use special selectors)
- iFrames (specify frame context)
- File uploads (security restrictions)

## Best Practices

1. ✅ Add comments with `'` at line start
2. ✅ Use meaningful macro names
3. ✅ Include WAIT commands for dynamic content
4. ✅ Test macros before saving
5. ✅ Export important macros regularly
6. ✅ Use variables for reusable values
7. ✅ Prefer ID selectors when available
8. ✅ Document complex macros

## Need More Examples?

- Check the GitHub repository for community macros
- Share your macros with others
- Request examples via GitHub issues

---

**Happy Automating!** 🚀
