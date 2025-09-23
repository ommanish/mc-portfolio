#!/bin/bash

# Safe deployment script with automatic backup
echo "🔄 Creating backup of current gh-pages..."

# Create timestamped backup
BACKUP_NAME="gh-pages-backup-$(date +%Y%m%d-%H%M)"
git fetch origin gh-pages
git branch $BACKUP_NAME origin/gh-pages
git push origin $BACKUP_NAME

echo "✅ Backup created: $BACKUP_NAME"
echo "🚀 Deploying new version..."

# Deploy
npm run deploy

echo "🎉 Deployment complete!"
echo "💡 To rollback: git push origin $BACKUP_NAME:gh-pages --force"
