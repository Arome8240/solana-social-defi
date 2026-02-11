#!/bin/bash

# Script to verify node_modules are not tracked by git

echo "🔍 Checking if node_modules are ignored by git..."

# Check if any node_modules are tracked
if git ls-files | grep -q "node_modules"; then
    echo "❌ ERROR: node_modules found in git tracking!"
    echo "Files found:"
    git ls-files | grep "node_modules"
    exit 1
else
    echo "✅ SUCCESS: No node_modules are tracked by git"
fi

# Verify .gitignore has node_modules
if grep -q "^node_modules$" .gitignore; then
    echo "✅ SUCCESS: node_modules is in .gitignore"
else
    echo "❌ ERROR: node_modules not found in .gitignore"
    exit 1
fi

# Check all node_modules directories are ignored
echo ""
echo "📁 Checking node_modules directories..."
find . -name "node_modules" -type d | while read dir; do
    if git check-ignore -q "$dir"; then
        echo "✅ $dir is ignored"
    else
        echo "❌ $dir is NOT ignored!"
        exit 1
    fi
done

echo ""
echo "✨ All checks passed! node_modules are properly ignored."
