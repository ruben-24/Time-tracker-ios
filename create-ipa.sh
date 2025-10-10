#!/bin/bash

echo "🚀 Creating iOS IPA for Modern Data Manager..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This script requires macOS to build iOS apps${NC}"
    echo -e "${YELLOW}💡 You can still use the generated Xcode project on a Mac${NC}"
    echo -e "${BLUE}📁 Xcode project location: ios/App/App.xcworkspace${NC}"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Xcode not found. Please install Xcode from the App Store${NC}"
    exit 1
fi

# Build web assets
echo -e "${BLUE}📦 Building web assets...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build web assets${NC}"
    exit 1
fi

# Sync with Capacitor
echo -e "${BLUE}🔄 Syncing with Capacitor...${NC}"
npx cap sync ios

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to sync with Capacitor${NC}"
    exit 1
fi

# Create build directory
mkdir -p ios/build

# Build for device
echo -e "${BLUE}📱 Building iOS app...${NC}"
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath ios/build/App.xcarchive \
           archive

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build iOS app${NC}"
    echo -e "${YELLOW}💡 Make sure you have:${NC}"
    echo -e "   • Xcode installed and updated"
    echo -e "   • iOS SDK installed"
    echo -e "   • Valid Apple Developer account"
    echo -e "   • Proper signing configuration"
    exit 1
fi

# Export IPA
echo -e "${BLUE}📦 Creating IPA file...${NC}"
xcodebuild -exportArchive \
           -archivePath ios/build/App.xcarchive \
           -exportPath ios/build/ \
           -exportOptionsPlist ios/App/App/ExportOptions.plist

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to export IPA${NC}"
    echo -e "${YELLOW}💡 Check your ExportOptions.plist and signing settings${NC}"
    exit 1
fi

# Check if IPA was created
if [ -f "ios/build/App.ipa" ]; then
    echo -e "${GREEN}✅ IPA file created successfully!${NC}"
    echo -e "${GREEN}📱 Location: ios/build/App.ipa${NC}"
    echo -e "${GREEN}📏 Size: $(du -h ios/build/App.ipa | cut -f1)${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready for sideloading!${NC}"
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "   1. Install AltStore or Sideloadly on your Mac"
    echo -e "   2. Connect your iPhone/iPad"
    echo -e "   3. Drag & drop the IPA file to install"
    echo -e "   4. Trust the developer certificate on your device"
    echo ""
    echo -e "${GREEN}🎉 Modern Data Manager is ready for iOS!${NC}"
else
    echo -e "${RED}❌ IPA file not found${NC}"
    exit 1
fi