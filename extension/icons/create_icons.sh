#!/bin/bash
# Create simple SVG icons and convert to PNG

# Create SVG icon
cat > icon.svg << 'SVGEOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#grad)"/>
  <text x="64" y="85" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="white" text-anchor="middle">⚡</text>
</svg>
SVGEOF

# Install ImageMagick if available, otherwise use a simple approach
if command -v convert &> /dev/null; then
    convert icon.svg -resize 16x16 icon16.png
    convert icon.svg -resize 32x32 icon32.png
    convert icon.svg -resize 48x48 icon48.png
    convert icon.svg -resize 128x128 icon128.png
else
    # Create simple colored PNG files as fallback
    echo "ImageMagick not available, creating placeholder PNGs"
    for size in 16 32 48 128; do
        cat > icon${size}.png.base64 << 'B64EOF'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
B64EOF
        base64 -d icon${size}.png.base64 > icon${size}.png
        rm icon${size}.png.base64
    done
fi

echo "Icons created successfully"
