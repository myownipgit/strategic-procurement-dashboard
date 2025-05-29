#!/bin/bash

# Strategic Procurement Dashboard - Build Test Script
# Quick validation script to test the build process

set -e

echo "🧪 Testing Build Process for Strategic Procurement Dashboard"
echo "========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory"
    exit 1
fi

echo "✅ Found package.json"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Test build command
echo "📦 Testing build process..."
npm run build

# Check if build directory was created
if [ ! -d "build" ]; then
    echo "❌ Build directory not created"
    exit 1
fi

echo "✅ Build directory created"

# Check essential files
ESSENTIAL_FILES=("build/index.html" "build/static/js" "build/static/css")

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ Found: $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Check build size
BUILD_SIZE=$(du -sh build/ | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

echo ""
echo "🎉 Build test completed successfully!"
echo "✅ Ready for AWS deployment"
