# AWS S3 + CloudFront Deployment Guide

## Overview
This guide provides complete instructions for deploying the Strategic Procurement Dashboard to AWS S3 with CloudFront CDN distribution.

## Prerequisites

### Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### AWS Account Setup
1. **AWS Account**: Active AWS account with billing enabled
2. **IAM User**: User with S3 and CloudFront permissions
3. **Access Keys**: AWS Access Key ID and Secret Access Key

## Step 1: Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

## Step 2: Create S3 Bucket

### Create Bucket
```bash
# Create S3 bucket
aws s3 mb s3://strategic-procurement-dashboard-prod --region us-east-1
```

### Configure Static Website Hosting
```bash
# Enable static website hosting
aws s3 website s3://strategic-procurement-dashboard-prod \
  --index-document index.html \
  --error-document error.html
```

### Set Bucket Policy
```bash
# Create bucket policy file
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::strategic-procurement-dashboard-prod/*"
    }
  ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket strategic-procurement-dashboard-prod \
  --policy file://bucket-policy.json
```

### Configure CORS (if needed)
```bash
# Create CORS configuration
cat > cors-config.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": [],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

# Apply CORS configuration
aws s3api put-bucket-cors \
  --bucket strategic-procurement-dashboard-prod \
  --cors-configuration file://cors-config.json
```

## Step 3: Create CloudFront Distribution

### Create Distribution Configuration
```bash
# Create CloudFront distribution config
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "procurement-dashboard-$(date +%s)",
  "Comment": "Strategic Procurement Dashboard CDN",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-strategic-procurement-dashboard-prod",
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
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-strategic-procurement-dashboard-prod",
        "DomainName": "strategic-procurement-dashboard-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "PriceClass": "PriceClass_All"
}
EOF

# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Get Distribution Information
```bash
# List distributions
aws cloudfront list-distributions

# Get specific distribution details
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## Step 4: Build and Deploy Application

### Build Production Version
```bash
# Navigate to project directory
cd strategic-procurement-dashboard

# Install dependencies
npm install

# Create production build
npm run build:prod
```

### Deploy to S3
```bash
# Sync build folder to S3
aws s3 sync build/ s3://strategic-procurement-dashboard-prod --delete

# Set proper content types
aws s3 cp build/ s3://strategic-procurement-dashboard-prod \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "service-worker.js"

# Set cache control for HTML files (shorter cache)
aws s3 cp build/ s3://strategic-procurement-dashboard-prod \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "service-worker.js"
```

### Invalidate CloudFront Cache
```bash
# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Step 5: Custom Domain (Optional)

### Request SSL Certificate
```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name your-domain.com \
  --domain-name www.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

### Update CloudFront Distribution
```bash
# Update distribution with custom domain
aws cloudfront update-distribution \
  --id YOUR_DISTRIBUTION_ID \
  --distribution-config file://updated-cloudfront-config.json
```

### Update DNS Records
```bash
# Add CNAME record pointing to CloudFront domain
# your-domain.com -> d3fxj92ydzfq5s.cloudfront.net
```

## Automated Deployment Scripts

### Create deployment script
```bash
#!/bin/bash
# deploy.sh - Automated deployment script

set -e

echo "🚀 Starting deployment..."

# Build application
echo "📦 Building application..."
npm run build:prod

# Deploy to S3
echo "☁️ Uploading to S3..."
aws s3 sync build/ s3://strategic-procurement-dashboard-prod --delete

# Set cache headers
echo "⚡ Setting cache headers..."
aws s3 cp build/ s3://strategic-procurement-dashboard-prod \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "service-worker.js"

aws s3 cp build/ s3://strategic-procurement-dashboard-prod \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "service-worker.js"

# Invalidate CloudFront
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Live at: https://d3fxj92ydzfq5s.cloudfront.net"
```

### Make script executable
```bash
chmod +x deploy.sh
./deploy.sh
```

## Monitoring and Maintenance

### CloudWatch Monitoring
```bash
# Enable CloudFront monitoring
aws cloudfront put-monitoring-subscription \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --monitoring-subscription RealtimeMetricsSubscriptionConfig='{RealtimeMetricsSubscriptionStatus=Enabled}'
```

### Cost Monitoring
```bash
# Check S3 usage
aws s3api list-objects-v2 \
  --bucket strategic-procurement-dashboard-prod \
  --query 'sum(Contents[].Size)'

# Check CloudFront usage
aws cloudfront get-distribution-config \
  --id YOUR_DISTRIBUTION_ID
```

### Backup Strategy
```bash
# Enable S3 versioning
aws s3api put-bucket-versioning \
  --bucket strategic-procurement-dashboard-prod \
  --versioning-configuration Status=Enabled

# Configure lifecycle policy for old versions
cat > lifecycle-policy.json << 'EOF'
{
  "Rules": [
    {
      "ID": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
  --bucket strategic-procurement-dashboard-prod \
  --lifecycle-configuration file://lifecycle-policy.json
```

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   ```bash
   # Check bucket policy
   aws s3api get-bucket-policy --bucket strategic-procurement-dashboard-prod
   ```

2. **CloudFront Not Updating**
   ```bash
   # Check invalidation status
   aws cloudfront list-invalidations --distribution-id YOUR_DISTRIBUTION_ID
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   aws acm list-certificates --region us-east-1
   ```

### Debug Commands
```bash
# Test S3 website endpoint
curl -I http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com

# Test CloudFront endpoint
curl -I https://d3fxj92ydzfq5s.cloudfront.net

# Check DNS resolution
nslookup d3fxj92ydzfq5s.cloudfront.net
```

## Security Best Practices

1. **Use IAM Roles**: Don't use root account for deployment
2. **Enable MFA**: Multi-factor authentication for AWS account
3. **Least Privilege**: Minimal required permissions
4. **Enable Logging**: CloudTrail and CloudFront logging
5. **Regular Updates**: Keep dependencies updated

## Cost Optimization

1. **S3 Storage Class**: Use appropriate storage classes
2. **CloudFront Caching**: Optimize cache policies
3. **Compression**: Enable gzip/brotli compression
4. **Monitor Usage**: Regular cost monitoring

---

**Deployment URLs:**
- **Primary**: https://d3fxj92ydzfq5s.cloudfront.net
- **S3 Direct**: http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com
- **GitHub**: https://github.com/myownipgit/strategic-procurement-dashboard