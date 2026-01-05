#!/bin/bash
# Package script for iMacros Extension

echo "📦 Packaging iMacros Web Automation Extension..."

# Create dist directory
mkdir -p ../dist

# Extension name and version
EXT_NAME="imacros-web-automation"
VERSION="1.0.0"
PACKAGE_NAME="${EXT_NAME}-${VERSION}"

# Create a clean copy for packaging
echo "Creating clean package..."
rm -rf ../dist/${PACKAGE_NAME}
mkdir -p ../dist/${PACKAGE_NAME}

# Copy extension files
echo "Copying extension files..."
cp manifest.json ../dist/${PACKAGE_NAME}/
cp background.js ../dist/${PACKAGE_NAME}/
cp content.js ../dist/${PACKAGE_NAME}/
cp popup.html ../dist/${PACKAGE_NAME}/
cp popup.js ../dist/${PACKAGE_NAME}/
cp sidebar.html ../dist/${PACKAGE_NAME}/
cp sidebar.js ../dist/${PACKAGE_NAME}/
cp options.html ../dist/${PACKAGE_NAME}/
cp options.js ../dist/${PACKAGE_NAME}/
cp README.md ../dist/${PACKAGE_NAME}/
cp INSTALL.md ../dist/${PACKAGE_NAME}/

# Copy icons
echo "Copying icons..."
cp -r icons ../dist/${PACKAGE_NAME}/

# Create ZIP archive
echo "Creating ZIP archive..."
cd ../dist
zip -r ${PACKAGE_NAME}.zip ${PACKAGE_NAME}/ -q

# Calculate size
SIZE=$(du -h ${PACKAGE_NAME}.zip | cut -f1)

echo ""
echo "✅ Package created successfully!"
echo "📍 Location: dist/${PACKAGE_NAME}.zip"
echo "📊 Size: ${SIZE}"
echo ""
echo "To install:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer Mode"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' folder"
echo ""
echo "Or extract the ZIP and load the extracted folder."
