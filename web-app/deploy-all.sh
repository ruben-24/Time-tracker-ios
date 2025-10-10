#!/bin/bash

echo "🚀 Work Time Tracker Web - Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Build the application
echo -e "${BLUE}📦 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Check deployment options
echo -e "${YELLOW}🌐 Choose deployment option:${NC}"
echo "1. Local preview (http://localhost:4173)"
echo "2. Vercel"
echo "3. Netlify"
echo "4. GitHub Pages"
echo "5. All platforms"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🌐 Starting local preview...${NC}"
        npm run preview
        ;;
    2)
        if command_exists vercel; then
            echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
            vercel --prod
        else
            echo -e "${RED}❌ Vercel CLI not installed. Install with: npm i -g vercel${NC}"
        fi
        ;;
    3)
        if command_exists netlify; then
            echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
            netlify deploy --prod --dir=dist
        else
            echo -e "${RED}❌ Netlify CLI not installed. Install with: npm i -g netlify-cli${NC}"
        fi
        ;;
    4)
        echo -e "${BLUE}🚀 Deploying to GitHub Pages...${NC}"
        echo -e "${YELLOW}💡 Make sure you have GitHub Actions enabled and push to main branch${NC}"
        git add .
        git commit -m "Deploy to GitHub Pages"
        git push origin main
        ;;
    5)
        echo -e "${BLUE}🚀 Deploying to all platforms...${NC}"
        
        # Local preview
        echo -e "${YELLOW}Starting local preview...${NC}"
        npm run preview &
        
        # Vercel
        if command_exists vercel; then
            echo -e "${YELLOW}Deploying to Vercel...${NC}"
            vercel --prod
        fi
        
        # Netlify
        if command_exists netlify; then
            echo -e "${YELLOW}Deploying to Netlify...${NC}"
            netlify deploy --prod --dir=dist
        fi
        
        # GitHub Pages
        echo -e "${YELLOW}Deploying to GitHub Pages...${NC}"
        git add .
        git commit -m "Deploy to GitHub Pages"
        git push origin main
        ;;
    *)
        echo -e "${RED}❌ Invalid choice!${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}📱 Your Work Time Tracker is now available online!${NC}"