#!/bin/bash

# Strategic Procurement Dashboard - Monitoring Script
# Usage: ./monitor.sh [environment]

set -e

ENVIRONMENT=${1:-prod}

echo "📊 Monitoring Strategic Procurement Dashboard"
echo "============================================="

# Load environment variables
if [ -f "deployment/configs/${ENVIRONMENT}-vars.env" ]; then
    source deployment/configs/${ENVIRONMENT}-vars.env
    echo "Environment: $ENVIRONMENT"
    echo "Distribution ID: $DISTRIBUTION_ID"
    echo "Domain: $CLOUDFRONT_DOMAIN"
    echo "Bucket: $BUCKET_NAME"
    echo ""
else
    echo "❌ Environment configuration not found. Run setup first."
    exit 1
fi

# CloudFront Status
echo "🌐 CloudFront Status"
echo "-------------------"
STATUS=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status' --output text)
echo "Status: $STATUS"

if [ "$STATUS" = "Deployed" ]; then
    echo "✅ CloudFront is fully deployed"
else
    echo "⏳ CloudFront is still deploying..."
fi

# Recent invalidations
echo ""
echo "🔄 Recent Invalidations"
echo "----------------------"
aws cloudfront list-invalidations --distribution-id $DISTRIBUTION_ID \
    --query 'InvalidationList.Items[0:3].[Id,Status,CreateTime]' \
    --output table

# Performance Test
echo ""
echo "⚡ Performance Test"
echo "------------------"
if command -v curl &> /dev/null; then
    echo "Testing CloudFront performance..."
    RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s "https://$CLOUDFRONT_DOMAIN")
    echo "Response time: ${RESPONSE_TIME}s"
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        echo "✅ Performance: Excellent (< 2s)"
    elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
        echo "⚠️  Performance: Good (2-5s)"
    else
        echo "❌ Performance: Needs attention (> 5s)"
    fi
else
    echo "curl not available - skipping performance test"
fi

# S3 Storage Stats
echo ""
echo "🪣 S3 Storage Statistics"
echo "-----------------------"
OBJECT_COUNT=$(aws s3api list-objects-v2 --bucket $BUCKET_NAME --query 'length(Contents)' --output text)
TOTAL_SIZE=$(aws s3api list-objects-v2 --bucket $BUCKET_NAME --query 'sum(Contents[].Size)' --output text)

if [ "$TOTAL_SIZE" != "null" ] && [ "$TOTAL_SIZE" != "" ]; then
    SIZE_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)
    echo "Objects: $OBJECT_COUNT"
    echo "Total size: ${SIZE_MB} MB"
else
    echo "No objects found in bucket"
fi

# Security Check
echo ""
echo "🔒 Security Check"
echo "----------------"
echo "Testing HTTPS redirect..."
HTTP_STATUS=$(curl -I -s "http://$CLOUDFRONT_DOMAIN" | head -n 1 | cut -d$' ' -f2)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTPS redirect working"
else
    echo "⚠️  HTTPS redirect may not be working (Status: $HTTP_STATUS)"
fi

# Cost Estimation (simplified)
echo ""
echo "💰 Estimated Monthly Costs"
echo "--------------------------"
echo "S3 Storage (~$0.023/GB): \$$(echo "scale=2; $SIZE_MB * 0.023 / 1024" | bc) (if $SIZE_MB MB)"
echo "CloudFront (depends on traffic): ~$5-50/month"
echo "Data Transfer: ~$0.09/GB"
echo ""
echo "📈 For detailed billing, check AWS Cost Explorer"

# Health Summary
echo ""
echo "🏥 Health Summary"
echo "----------------"
if [ "$STATUS" = "Deployed" ] && [ "$HTTP_STATUS" = "301" -o "$HTTP_STATUS" = "302" ]; then
    echo "✅ System Status: HEALTHY"
    echo "🚀 Dashboard ready for executive use"
else
    echo "⚠️  System Status: NEEDS ATTENTION"
    echo "🔧 Check CloudFront deployment and SSL configuration"
fi

echo ""
echo "🔍 For detailed metrics, visit AWS CloudWatch console"
echo "📊 Dashboard URL: https://$CLOUDFRONT_DOMAIN"
