#!/bin/bash

# Strategic Procurement Dashboard - AWS Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-prod}
BUCKET_NAME="strategic-procurement-dashboard-${ENVIRONMENT}"
AWS_REGION="us-east-1"

echo "🚀 Deploying Strategic Procurement Dashboard to AWS..."
echo "Environment: $ENVIRONMENT"
echo "Bucket: $BUCKET_NAME"
echo "Region: $AWS_REGION"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "📦 Building application..."
    npm run build
fi

# Check if bucket exists, create if not
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "🪣 Creating S3 bucket: $BUCKET_NAME"
    aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION
    
    # Configure bucket for static web hosting
    aws s3 website s3://$BUCKET_NAME \
        --index-document index.html \
        --error-document index.html
    
    # Set bucket policy for public read access
    cat > ../configs/bucket-policy-temp.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $BUCKET_NAME \
        --policy file://../configs/bucket-policy-temp.json
    
    rm ../configs/bucket-policy-temp.json
fi

# Sync to S3 with proper cache headers
echo "☁️  Uploading to S3..."

# Upload static assets with long cache
aws s3 sync build/ s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Upload HTML and service worker with short cache
aws s3 sync build/ s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

# Check if CloudFront distribution exists
if [ -f "../configs/cloudfront-${ENVIRONMENT}.json" ]; then
    DISTRIBUTION_ID=$(cat ../configs/cloudfront-${ENVIRONMENT}.json | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    
    CLOUDFRONT_DOMAIN=$(cat ../configs/cloudfront-${ENVIRONMENT}.json | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo "✅ Deployment completed successfully!"
    echo "🌐 Dashboard URL: https://$CLOUDFRONT_DOMAIN"
else
    echo "⚠️  CloudFront distribution not found. Create one using the setup script."
    echo "🌐 S3 Website URL: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
fi

echo "✅ Deployment to S3 completed successfully!"
