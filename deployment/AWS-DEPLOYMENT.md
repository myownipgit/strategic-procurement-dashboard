# AWS Deployment Guide
## Strategic Procurement Dashboard

### 🎯 Quick Start (3 Commands)

```bash
# 1. Navigate to project directory
cd /Users/myownip/workspace/strategic-procurement-dashboard

# 2. Run complete setup (one-time)
./deployment/scripts/full-setup.sh prod

# 3. Monitor deployment
./deployment/scripts/monitor.sh prod
```

### 📋 Prerequisites

- ✅ AWS CLI installed and configured
- ✅ Node.js 16+ and npm
- ✅ Proper AWS IAM permissions (S3, CloudFront, IAM)

### 🚀 Deployment Stages

#### Stage 1: Initial Setup (First Time Only)
```bash
# Complete AWS infrastructure setup
./deployment/scripts/full-setup.sh [environment]

# Options:
./deployment/scripts/full-setup.sh prod     # Production
./deployment/scripts/full-setup.sh staging  # Staging
./deployment/scripts/full-setup.sh dev      # Development
```

**What this does:**
- ✅ Creates S3 bucket with proper configuration
- ✅ Builds and uploads React application
- ✅ Creates CloudFront distribution
- ✅ Configures SSL/HTTPS redirection
- ✅ Sets up caching and error handling

#### Stage 2: Regular Deployments (Updates)
```bash
# Deploy application updates
./deployment/scripts/deploy.sh [environment]
```

**What this does:**
- ✅ Builds latest application
- ✅ Syncs files to S3 with proper cache headers
- ✅ Invalidates CloudFront cache
- ✅ Provides deployment confirmation

#### Stage 3: Monitoring & Health Checks
```bash
# Check system health and performance
./deployment/scripts/monitor.sh [environment]
```

**What this monitors:**
- ✅ CloudFront deployment status
- ✅ Performance testing
- ✅ Security configuration
- ✅ Storage statistics
- ✅ Cost estimation

### 🌐 Access Your Dashboard

After deployment:

**Production:** `https://[cloudfront-domain].cloudfront.net`
**Staging:** `https://[staging-cloudfront-domain].cloudfront.net`

### 🔧 Manual Commands (Advanced)

#### AWS Resource Management
```bash
# Check S3 bucket contents
aws s3 ls s3://strategic-procurement-dashboard-prod/

# Check CloudFront status
aws cloudfront get-distribution --id [DISTRIBUTION_ID] --query 'Distribution.Status'

# Create cache invalidation
aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/*"

# List all distributions
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName,Comment]' --output table
```

#### Cost Monitoring
```bash
# Check S3 storage usage
aws s3api list-objects-v2 --bucket strategic-procurement-dashboard-prod --query 'sum(Contents[].Size)'

# Check CloudFront usage (last 30 days)
aws cloudwatch get-metric-statistics \
    --namespace AWS/CloudFront \
    --metric-name Requests \
    --dimensions Name=DistributionId,Value=[DISTRIBUTION_ID] \
    --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 86400 \
    --statistics Sum
```

### 🚨 Emergency Procedures

#### Quick Rollback
```bash
# Option 1: Redeploy previous version
git checkout [previous-commit]
./deployment/scripts/deploy.sh prod

# Option 2: Maintenance mode
echo "<h1>Maintenance in Progress</h1>" > maintenance.html
aws s3 cp maintenance.html s3://strategic-procurement-dashboard-prod/index.html
aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/index.html"
```

#### Disaster Recovery
```bash
# Complete redeployment
./deployment/scripts/full-setup.sh prod

# Verify health
./deployment/scripts/monitor.sh prod
```

### 📊 Performance Optimization

#### Cache Configuration
- **Static Assets (JS/CSS)**: 1 year cache
- **HTML Files**: No cache (immediate updates)
- **Images**: 1 year cache with versioning

#### Cost Optimization
- **S3 Storage Class**: Standard (for active access)
- **CloudFront Price Class**: 100 (US, Canada, Europe)
- **Lifecycle Policies**: Auto-cleanup after 30 days

### 🔒 Security Features

- ✅ HTTPS-only access
- ✅ S3 bucket policies (read-only public)
- ✅ CloudFront security headers
- ✅ Versioning enabled for rollbacks
- ✅ Access logging available

### 💰 Cost Structure

**Estimated Monthly Costs:**
- **S3 Storage**: ~$0.50 (for typical dashboard)
- **CloudFront**: ~$5-20 (depends on traffic)
- **Data Transfer**: ~$0.09/GB
- **Total**: ~$10-50/month for enterprise use

### 🔍 Troubleshooting

#### Common Issues

**"Distribution not found"**
```bash
# Check if CloudFront was created
aws cloudfront list-distributions
```

**"403 Forbidden" errors**
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket strategic-procurement-dashboard-prod
```

**Changes not reflecting**
```bash
# Clear CloudFront cache
source deployment/configs/prod-vars.env
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

**Build errors**
```bash
# Clear and rebuild
rm -rf node_modules build
npm install
npm run build
```

### 📈 Scaling Considerations

**High Traffic (> 1M requests/month):**
- Upgrade CloudFront price class
- Consider multiple regions
- Implement monitoring alerts

**Global Deployment:**
- Use Route 53 for DNS management
- Multiple CloudFront distributions
- Regional S3 buckets

### 🎯 Success Metrics

**Deployment Success Indicators:**
- ✅ CloudFront status: "Deployed"
- ✅ HTTPS redirect working
- ✅ Response time < 2 seconds
- ✅ All static assets loading
- ✅ React routing working correctly

**Ready for Executive Presentation! 🚨**

---

### 📞 Support

For issues with this deployment:
1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Test with `./deployment/scripts/monitor.sh`
4. Review AWS billing for unexpected costs

### 🔄 Regular Maintenance

**Weekly:**
- Run monitoring script
- Check CloudWatch metrics
- Verify SSL certificate status

**Monthly:**
- Review AWS costs
- Update dependencies
- Test disaster recovery procedures
