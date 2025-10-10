#!/bin/bash

echo "🚀 Building Modern Data Manager for iOS..."

# Build the web app
echo "📦 Building web assets..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync ios

# Check if Xcode is available
if command -v xcodebuild &> /dev/null; then
    echo "📱 Building iOS app with Xcode..."
    
    # Build for device (for sideloading)
    xcodebuild -workspace ios/App/App.xcworkspace \
               -scheme App \
               -configuration Release \
               -destination generic/platform=iOS \
               -archivePath ios/build/App.xcarchive \
               archive
    
    # Export IPA
    echo "📦 Creating IPA file..."
    xcodebuild -exportArchive \
               -archivePath ios/build/App.xcarchive \
               -exportPath ios/build/ \
               -exportOptionsPlist ios/App/App/ExportOptions.plist
    
    echo "✅ IPA file created at: ios/build/App.ipa"
    echo "📱 Ready for sideloading!"
    
else
    echo "⚠️  Xcode not found. Please install Xcode from the App Store."
    echo "📋 Manual steps:"
    echo "1. Open ios/App/App.xcworkspace in Xcode"
    echo "2. Select your development team"
    echo "3. Build and run on device or create archive"
    echo "4. Export as IPA for sideloading"
fi

echo "🎉 Build process complete!"