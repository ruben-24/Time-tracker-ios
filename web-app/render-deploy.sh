#!/bin/bash

echo "🚀 Deploying Work Time Tracker to Render.com"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Render CLI...${NC}"
    npm install -g @render/cli
fi

# Build the application
echo -e "${BLUE}📦 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Deploy to Render
echo -e "${BLUE}🚀 Deploying to Render...${NC}"

# Check if user is logged in
if ! render auth whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Render first:${NC}"
    render auth login
fi

# Deploy static site
echo -e "${BLUE}📤 Uploading to Render...${NC}"
render deploy --service work-time-tracker

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${BLUE}📱 Your app is now live on Render!${NC}"
    echo -e "${YELLOW}💡 Check your Render dashboard for the URL${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${YELLOW}💡 Make sure you have a Render account and the service is configured${NC}"
fi