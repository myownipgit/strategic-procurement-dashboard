#!/bin/bash

# Strategic Procurement Dashboard - Complete AWS Setup
# This script performs the full AWS deployment in stages

set -e

ENVIRONMENT=${1:-prod}
AWS_REGION=${2:-us-east-1}
BUCKET_NAME="strategic-procurement-dashboard-${ENVIRONMENT}"

echo "🎯 Complete AWS Setup for Strategic Procurement Dashboard"
echo "=================================================="
echo "Environment: $ENVIRONMENT"
echo "AWS Region: $AWS_REGION"
echo "S3 Bucket: $BUCKET_NAME"
echo ""

# Stage 1: Pre-flight checks
echo "🔍 Stage 1: Pre-flight Checks"
echo "------------------------------"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check AWS configuration
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

# Check Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm not found. Please install Node.js first."
    exit 1
fi

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in the project root directory. Please run from strategic-procurement-dashboard/"
    exit 1
fi

echo "✅ Pre-flight checks passed!"
echo ""

# Stage 2: Build Application
echo "📦 Stage 2: Building Application"
echo "--------------------------------"
npm install
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Application built successfully!"
echo ""

# Stage 3: S3 Setup
echo "🪣 Stage 3: S3 Bucket Setup"
echo "---------------------------"

# Set AWS region
aws configure set region $AWS_REGION

# Create bucket if it doesn't exist
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Creating S3 bucket: $BUCKET_NAME"
    aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket $BUCKET_NAME \
        --versioning-configuration Status=Enabled
    
    # Configure static website hosting
    aws s3 website s3://$BUCKET_NAME \
        --index-document index.html \
        --error-document index.html
    
    # Create and apply bucket policy
    cat > deployment/configs/bucket-policy.json << EOF
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
        --policy file://deployment/configs/bucket-policy.json
    
    echo "✅ S3 bucket configured successfully!"
else
    echo "✅ S3 bucket already exists!"
fi

echo ""

# Stage 4: Deploy to S3
echo "☁️  Stage 4: Deploying to S3"
echo "----------------------------"

# Deploy with proper cache headers
aws s3 sync build/ s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

aws s3 sync build/ s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

echo "✅ Files uploaded to S3 successfully!"
echo "🌐 S3 Website URL: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo ""

# Stage 5: CloudFront Setup
echo "🌐 Stage 5: CloudFront CDN Setup"
echo "--------------------------------"

if [ ! -f "deployment/configs/cloudfront-${ENVIRONMENT}.json" ]; then
    echo "Creating CloudFront distribution..."
    
    # Create CloudFront configuration
    cat > deployment/configs/cloudfront-config-${ENVIRONMENT}.json << EOF
{
    "CallerReference": "strategic-procurement-$(date +%s)",
    "Comment": "Strategic Procurement Dashboard - ${ENVIRONMENT}",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-${BUCKET_NAME}",
                "DomainName": "${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-${BUCKET_NAME}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF
    
    # Create CloudFront distribution
    aws cloudfront create-distribution \
        --distribution-config file://deployment/configs/cloudfront-config-${ENVIRONMENT}.json \
        > deployment/configs/cloudfront-${ENVIRONMENT}.json
    
    # Extract information
    DISTRIBUTION_ID=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
    CLOUDFRONT_DOMAIN=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)
    
    # Save environment variables
    cat > deployment/configs/${ENVIRONMENT}-vars.env << EOF
DISTRIBUTION_ID=$DISTRIBUTION_ID
CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
BUCKET_NAME=$BUCKET_NAME
AWS_REGION=$AWS_REGION
EOF
    
    echo "✅ CloudFront distribution created!"
    echo "📋 Distribution ID: $DISTRIBUTION_ID"
    echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
    echo ""
    echo "⏳ CloudFront is deploying... This takes 10-20 minutes."
    echo "🔍 Check status: aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status'"
    
else
    echo "✅ CloudFront distribution already exists!"
    source deployment/configs/${ENVIRONMENT}-vars.env
    echo "📋 Distribution ID: $DISTRIBUTION_ID"
    echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
    
    # Invalidate cache for updates
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
fi

echo ""

# Stage 6: Final Summary
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "📊 Strategic Procurement Dashboard is now live:"
echo "🌐 CloudFront URL: https://$CLOUDFRONT_DOMAIN"
echo "🪣 S3 Website URL: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo ""
echo "📋 Deployment Details:"
echo "- Environment: $ENVIRONMENT"
echo "- AWS Region: $AWS_REGION"
echo "- S3 Bucket: $BUCKET_NAME"
echo "- CloudFront Distribution ID: ${DISTRIBUTION_ID:-Creating...}"
echo ""
echo "🔧 Management Commands:"
echo "- Deploy updates: ./deployment/scripts/deploy.sh $ENVIRONMENT"
echo "- Check status: aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status'"
echo "- View metrics: aws cloudfront get-distribution-config --id $DISTRIBUTION_ID"
echo ""
echo "✅ Ready for executive presentation and crisis response coordination!"
