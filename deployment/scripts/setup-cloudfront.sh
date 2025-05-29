#!/bin/bash

# Strategic Procurement Dashboard - CloudFront Setup Script
# Usage: ./setup-cloudfront.sh [environment] [bucket-name]

set -e

ENVIRONMENT=${1:-prod}
BUCKET_NAME=${2:-"strategic-procurement-dashboard-${ENVIRONMENT}"}
AWS_REGION="us-east-1"

echo "🌐 Setting up CloudFront for Strategic Procurement Dashboard..."
echo "Environment: $ENVIRONMENT"
echo "Bucket: $BUCKET_NAME"

# Create CloudFront distribution configuration
cat > ../configs/cloudfront-config-${ENVIRONMENT}.json << EOF
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

echo "📝 Creating CloudFront distribution..."
aws cloudfront create-distribution \
    --distribution-config file://../configs/cloudfront-config-${ENVIRONMENT}.json \
    > ../configs/cloudfront-${ENVIRONMENT}.json

# Extract distribution ID and domain
DISTRIBUTION_ID=$(cat ../configs/cloudfront-${ENVIRONMENT}.json | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
CLOUDFRONT_DOMAIN=$(cat ../configs/cloudfront-${ENVIRONMENT}.json | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ CloudFront Distribution Created!"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo ""
echo "⏳ Distribution is deploying... This takes 10-20 minutes."
echo "🔍 Check status with: aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status'"
echo "🚀 Your dashboard will be live at: https://$CLOUDFRONT_DOMAIN"

# Save key info for easy access
echo "DISTRIBUTION_ID=$DISTRIBUTION_ID" > ../configs/${ENVIRONMENT}-vars.env
echo "CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN" >> ../configs/${ENVIRONMENT}-vars.env
echo "BUCKET_NAME=$BUCKET_NAME" >> ../configs/${ENVIRONMENT}-vars.env

echo "💾 Configuration saved to: ../configs/${ENVIRONMENT}-vars.env"
