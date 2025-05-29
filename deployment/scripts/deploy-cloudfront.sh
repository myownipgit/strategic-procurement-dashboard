#!/bin/bash

# Strategic Procurement Dashboard - AWS Deployment with CloudFront Origin Access Identity
# Usage: ./deploy-cloudfront.sh [environment]

set -e

ENVIRONMENT=${1:-prod}
AWS_REGION="us-east-1"
BUCKET_NAME="strategic-procurement-dashboard-${ENVIRONMENT}"

echo "🚀 AWS CloudFront Deployment for Strategic Procurement Dashboard"
echo "==============================================================="
echo "Environment: $ENVIRONMENT"
echo "AWS Region: $AWS_REGION" 
echo "S3 Bucket: $BUCKET_NAME"
echo ""

# Check if build exists
if [ ! -d "build" ]; then
    echo "📦 Building application..."
    npm run build
fi

# Step 1: Deploy to S3 (private bucket)
echo "🪣 Step 1: Uploading to S3..."
echo "-----------------------------"

# Upload files without public permissions
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

echo "✅ Files uploaded to S3"

# Step 2: Create CloudFront Distribution with OAI
echo ""
echo "🌐 Step 2: Setting up CloudFront..."
echo "-----------------------------------"

# Create Origin Access Identity if not exists
OAI_ID=$(aws cloudfront list-origin-access-identities --query 'OriginAccessIdentityList.Items[?Comment==`Procurement Dashboard OAI`].Id' --output text)

if [ -z "$OAI_ID" ]; then
    echo "Creating new Origin Access Identity..."
    OAI_RESPONSE=$(aws cloudfront create-origin-access-identity \
        --origin-access-identity-config CallerReference=$(date +%s),Comment="Procurement Dashboard OAI")
    OAI_ID=$(echo $OAI_RESPONSE | grep -o '"Id": "[^"]*"' | cut -d'"' -f4)
    echo "✅ Created OAI: $OAI_ID"
else
    echo "✅ Using existing OAI: $OAI_ID"
fi

# Create bucket policy for CloudFront OAI access
cat > deployment/configs/cloudfront-bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity $OAI_ID"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

# Apply bucket policy for CloudFront access
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file://deployment/configs/cloudfront-bucket-policy.json

echo "✅ S3 bucket policy configured for CloudFront"

# Check if CloudFront distribution already exists
if [ ! -f "deployment/configs/cloudfront-${ENVIRONMENT}.json" ]; then
    echo "Creating new CloudFront distribution..."
    
    # Create CloudFront distribution configuration
    cat > deployment/configs/cloudfront-distribution-config.json << EOF
{
    "CallerReference": "strategic-procurement-$(date +%s)",
    "Comment": "Strategic Procurement Dashboard - ${ENVIRONMENT}",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-${BUCKET_NAME}",
                "DomainName": "${BUCKET_NAME}.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/${OAI_ID}"
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
        "Quantity": 3,
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
            },
            {
                "ErrorCode": 500,
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

    # Create the distribution
    aws cloudfront create-distribution \
        --distribution-config file://deployment/configs/cloudfront-distribution-config.json \
        > deployment/configs/cloudfront-${ENVIRONMENT}.json

    # Extract distribution info
    DISTRIBUTION_ID=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
    CLOUDFRONT_DOMAIN=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)

    echo "✅ CloudFront distribution created!"
    echo "📋 Distribution ID: $DISTRIBUTION_ID"
    echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
    
else
    echo "✅ Using existing CloudFront distribution"
    source deployment/configs/${ENVIRONMENT}-vars.env 2>/dev/null || true
    DISTRIBUTION_ID=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
    CLOUDFRONT_DOMAIN=$(cat deployment/configs/cloudfront-${ENVIRONMENT}.json | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
fi

# Save environment variables
cat > deployment/configs/${ENVIRONMENT}-vars.env << EOF
DISTRIBUTION_ID=$DISTRIBUTION_ID
CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
BUCKET_NAME=$BUCKET_NAME
AWS_REGION=$AWS_REGION
OAI_ID=$OAI_ID
EOF

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "📊 Strategic Procurement Dashboard is now live:"
echo "🌐 CloudFront URL:  https://$CLOUDFRONT_DOMAIN"
echo "🪣 S3 Bucket:       $BUCKET_NAME"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo ""
echo "⏳ Note: If this is a new distribution, it takes 10-20 minutes to fully deploy."
echo "🔍 Check status: aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status'"
echo ""
echo "✅ Ready for executive presentation and crisis response coordination!"
