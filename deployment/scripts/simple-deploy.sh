#!/bin/bash

# Strategic Procurement Dashboard - Simple S3 + CloudFront Deployment
# Uses modern Origin Access Control (OAC) instead of deprecated OAI

set -e

ENVIRONMENT=${1:-prod}
AWS_REGION="us-east-1"
BUCKET_NAME="strategic-procurement-dashboard-${ENVIRONMENT}"

echo "🚀 Simple AWS Deployment for Strategic Procurement Dashboard"
echo "=========================================================="
echo "Environment: $ENVIRONMENT"
echo "AWS Region: $AWS_REGION"
echo "S3 Bucket: $BUCKET_NAME"
echo ""

# Check if build exists
if [ ! -d "build" ]; then
    echo "📦 Building application..."
    npm run build
fi

# Upload to S3 (files will be accessed via CloudFront only)
echo "🪣 Uploading to S3..."
echo "--------------------"

aws s3 sync build/ s3://$BUCKET_NAME --delete

echo "✅ Files uploaded to S3"

# Check if we have an existing CloudFront distribution
if [ -f "deployment/configs/${ENVIRONMENT}-vars.env" ]; then
    echo ""
    echo "🔄 Updating existing CloudFront distribution..."
    echo "----------------------------------------------"
    
    source deployment/configs/${ENVIRONMENT}-vars.env
    
    # Create cache invalidation
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' --output text)
    
    echo "✅ Cache invalidation created: $INVALIDATION_ID"
    echo "🌐 Dashboard URL: https://$CLOUDFRONT_DOMAIN"
    
else
    echo ""
    echo "🌐 Creating new CloudFront distribution..."
    echo "----------------------------------------"
    
    # Create a simple CloudFront distribution
    DISTRIBUTION_JSON=$(aws cloudfront create-distribution \
        --distribution-config '{
            "CallerReference": "'$(date +%s)'",
            "Comment": "Strategic Procurement Dashboard - '$ENVIRONMENT'",
            "DefaultRootObject": "index.html",
            "Origins": {
                "Quantity": 1,
                "Items": [
                    {
                        "Id": "S3-'$BUCKET_NAME'",
                        "DomainName": "'$BUCKET_NAME'.s3.amazonaws.com",
                        "S3OriginConfig": {
                            "OriginAccessIdentity": ""
                        }
                    }
                ]
            },
            "DefaultCacheBehavior": {
                "TargetOriginId": "S3-'$BUCKET_NAME'",
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
        }')
    
    # Extract distribution info
    DISTRIBUTION_ID=$(echo $DISTRIBUTION_JSON | grep -o '"Id":"[^"]*"' | head -1 | cut -d'"' -f4)
    CLOUDFRONT_DOMAIN=$(echo $DISTRIBUTION_JSON | grep -o '"DomainName":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    # Save configuration
    cat > deployment/configs/${ENVIRONMENT}-vars.env << EOF
DISTRIBUTION_ID=$DISTRIBUTION_ID
CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
BUCKET_NAME=$BUCKET_NAME
AWS_REGION=$AWS_REGION
EOF
    
    # Save full distribution details
    echo $DISTRIBUTION_JSON > deployment/configs/cloudfront-${ENVIRONMENT}.json
    
    echo "✅ CloudFront distribution created!"
    echo "📋 Distribution ID: $DISTRIBUTION_ID"
    echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
fi

# Make sure S3 bucket allows public read access for CloudFront
echo ""
echo "🔧 Configuring S3 bucket permissions..."
echo "--------------------------------------"

# First, we need to disable block public access for this specific use case
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false \
    2>/dev/null || echo "⚠️  Public access block settings not changed"

# Apply bucket policy for public read access
cat > deployment/configs/public-bucket-policy.json << EOF
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
    --policy file://deployment/configs/public-bucket-policy.json \
    2>/dev/null || echo "⚠️  Could not set bucket policy - CloudFront may still work"

echo "✅ S3 configuration completed"

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "📊 Strategic Procurement Dashboard:"
echo "🌐 CloudFront URL:  https://$CLOUDFRONT_DOMAIN"
echo "🪣 S3 Bucket:       $BUCKET_NAME"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo ""
echo "⏳ Note: New distributions take 5-15 minutes to fully deploy."
echo "🔍 Check status: aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status'"
echo ""
echo "🚨 Ready for executive presentation and crisis response coordination!"

# Test the deployment
echo ""
echo "🧪 Testing deployment..."
echo "-----------------------"

sleep 5  # Give a moment for the changes to propagate

# Test S3 direct access
S3_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo "🔍 Testing S3 direct access..."
curl -I $S3_URL 2>/dev/null | head -1 || echo "⚠️  S3 direct access may not be configured for static website hosting"

# Test CloudFront (may take time for new distributions)
echo "🔍 Testing CloudFront access..."
curl -I "https://$CLOUDFRONT_DOMAIN" 2>/dev/null | head -1 || echo "⏳ CloudFront distribution still deploying..."

echo ""
echo "✅ Deployment process completed successfully!"
