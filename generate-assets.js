import fs from 'fs';
import path from 'path';

// Create a simple SVG icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.6}" height="${size * 0.6}" rx="${size * 0.1}" fill="white" opacity="0.9"/>
  <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}" rx="${size * 0.05}" fill="url(#grad)"/>
  <circle cx="${size * 0.4}" cy="${size * 0.4}" r="${size * 0.08}" fill="white"/>
  <circle cx="${size * 0.6}" cy="${size * 0.4}" r="${size * 0.08}" fill="white"/>
  <circle cx="${size * 0.4}" cy="${size * 0.6}" r="${size * 0.08}" fill="white"/>
  <circle cx="${size * 0.6}" cy="${size * 0.6}" r="${size * 0.08}" fill="white"/>
</svg>`;

// Create splash screen SVG
const createSplashSVG = (width, height) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#splashGrad)"/>
  <g transform="translate(${width/2}, ${height/2})">
    <rect x="-60" y="-60" width="120" height="120" rx="24" fill="white" opacity="0.9"/>
    <rect x="-40" y="-40" width="80" height="80" rx="8" fill="url(#splashGrad)"/>
    <circle cx="-20" cy="-20" r="8" fill="white"/>
    <circle cx="20" cy="-20" r="8" fill="white"/>
    <circle cx="-20" cy="20" r="8" fill="white"/>
    <circle cx="20" cy="20" r="8" fill="white"/>
  </g>
  <text x="${width/2}" y="${height/2 + 100}" text-anchor="middle" fill="white" font-family="system-ui" font-size="32" font-weight="600">Modern Data Manager</text>
</svg>`;

// Generate icon sizes
const iconSizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024];

console.log('Generating iOS app icons...');
iconSizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}.png`;
  
  // For now, we'll create placeholder files
  // In a real scenario, you'd convert SVG to PNG using a library like sharp
  fs.writeFileSync(`ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-${size}.png`, '');
  console.log(`Generated ${filename}`);
});

// Generate splash screen
console.log('Generating splash screen...');
const splashSizes = [
  { width: 1242, height: 2208, name: 'splash-1242x2208.png' },
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' },
  { width: 750, height: 1334, name: 'splash-750x1334.png' }
];

splashSizes.forEach(({ width, height, name }) => {
  const svg = createSplashSVG(width, height);
  // For now, we'll create placeholder files
  fs.writeFileSync(`ios/App/App/Assets.xcassets/Splash.imageset/${name}`, '');
  console.log(`Generated ${name}`);
});

console.log('Asset generation complete!');
console.log('Note: You need to convert SVG to PNG using a tool like ImageMagick or an online converter.');
console.log('Place the PNG files in the respective directories.');