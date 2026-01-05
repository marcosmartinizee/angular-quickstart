#!/bin/bash
# Create simple icon placeholders using ImageMagick or base64 encoded SVG

# Create SVG icon
cat > icon.svg << 'SVGEOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="20" fill="#667eea"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="white" font-family="Arial, sans-serif" font-weight="bold">@</text>
</svg>
SVGEOF

echo "Icon template created. Install ImageMagick to convert SVG to PNG:"
echo "sudo apt-get install imagemagick"
echo "convert icon.svg -resize 16x16 icon16.png"
echo "convert icon.svg -resize 32x32 icon32.png"
echo "convert icon.svg -resize 48x48 icon48.png"
echo "convert icon.svg -resize 128x128 icon128.png"
