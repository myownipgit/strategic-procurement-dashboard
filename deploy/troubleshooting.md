# Troubleshooting Guide

## Common Issues and Solutions

### 1. Deployment Issues

#### Build Failures

**Problem**: `npm run build` fails with errors

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check Node.js version (requires 18+)
node --version

# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

**Common Error Messages**:
```bash
# Error: "Module not found"
Solution: Check import paths and file names

# Error: "Cannot resolve dependency"
Solution: npm install missing-package

# Error: "Out of memory"
Solution: export NODE_OPTIONS="--max-old-space-size=4096"
```

#### S3 Upload Issues

**Problem**: Files not uploading to S3

**Diagnostics**:
```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 access
aws s3 ls s3://strategic-procurement-dashboard-prod

# Check bucket policy
aws s3api get-bucket-policy --bucket strategic-procurement-dashboard-prod
```

**Solutions**:
```bash
# Reconfigure AWS CLI
aws configure

# Check IAM permissions
aws iam get-user
aws iam list-attached-user-policies --user-name YOUR_USERNAME

# Manual upload test
echo "test" > test.txt
aws s3 cp test.txt s3://strategic-procurement-dashboard-prod/test.txt
```

### 2. CloudFront Issues

#### Cache Not Updating

**Problem**: Changes not visible after deployment

**Solutions**:
```bash
# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Check invalidation status
aws cloudfront list-invalidations \
  --distribution-id YOUR_DISTRIBUTION_ID

# Wait for completion (can take 5-15 minutes)
```

#### 403 Forbidden Errors

**Problem**: Users getting 403 errors

**Diagnostics**:
```bash
# Test S3 direct access
curl -I http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com

# Test CloudFront access
curl -I https://d3fxj92ydzfq5s.cloudfront.net
```

**Solutions**:
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket strategic-procurement-dashboard-prod

# Verify public read access
aws s3api get-bucket-acl --bucket strategic-procurement-dashboard-prod

# Check CloudFront origin settings
aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION_ID
```

### 3. Application Issues

#### Charts Not Rendering

**Problem**: Dashboard shows but charts are blank

**Browser Console Checks**:
```javascript
// Check for JavaScript errors
// Open DevTools > Console

// Common errors:
// "Chart.js not registered"
// "Canvas element not found"
// "Data format incorrect"
```

**Solutions**:
```javascript
// Verify Chart.js registration in ChartTabs.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
```

#### Styling Issues

**Problem**: Layout broken or styles not applying

**Diagnostics**:
```bash
# Check Tailwind CSS loading
# In browser DevTools > Network tab
# Look for: https://cdn.tailwindcss.com/

# Check for CSS conflicts
# In DevTools > Elements > Computed styles
```

**Solutions**:
```html
<!-- Verify Tailwind CDN in public/index.html -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Check for conflicting CSS -->
<!-- Remove any conflicting stylesheets -->
```

#### Data Not Loading

**Problem**: KPI cards showing undefined or NaN

**Debug Steps**:
```javascript
// Add console.log in Dashboard.js
console.log('Procurement Data:', procurementData);

// Check data import
import { procurementData } from '../data/procurementData';
console.log('KPI Summary:', procurementData.kpiSummary);

// Verify data format
console.log('Total Spend:', procurementData.kpiSummary.totalSpend);
```

### 4. Performance Issues

#### Slow Page Load

**Problem**: Dashboard takes too long to load

**Diagnostics**:
```bash
# Run Lighthouse audit
npx lighthouse https://d3fxj92ydzfq5s.cloudfront.net --view

# Check bundle size
npm run build:analyze

# Monitor network requests
# Browser DevTools > Network tab
```

**Solutions**:
```bash
# Optimize build
GENERATE_SOURCEMAP=false npm run build

# Enable compression
# Already configured in CloudFront

# Check CloudFront cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=YOUR_DISTRIBUTION_ID \
  --start-time 2025-01-29T00:00:00Z \
  --end-time 2025-01-29T23:59:59Z \
  --period 3600 \
  --statistics Average
```

#### High Memory Usage

**Problem**: Browser tab using excessive memory

**Diagnostics**:
```javascript
// Check for memory leaks
// Browser DevTools > Memory tab
// Take heap snapshots before/after navigation

// Monitor React renders
// Install React DevTools extension
```

**Solutions**:
```javascript
// Add cleanup in useEffect
useEffect(() => {
  // Component logic
  
  return () => {
    // Cleanup function
  };
}, []);

// Optimize chart rendering
// Destroy chart instances when not needed
```

### 5. SSL/HTTPS Issues

#### Mixed Content Warnings

**Problem**: HTTPS page loading HTTP resources

**Solution**:
```html
<!-- Ensure all resources use HTTPS -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Not: http://cdn.tailwindcss.com -->
```

#### Certificate Issues

**Problem**: SSL certificate warnings

**Diagnostics**:
```bash
# Check certificate status
aws acm list-certificates --region us-east-1

# Test SSL connection
openssl s_client -connect d3fxj92ydzfq5s.cloudfront.net:443

# Check certificate expiration
echo | openssl s_client -servername d3fxj92ydzfq5s.cloudfront.net -connect d3fxj92ydzfq5s.cloudfront.net:443 2>/dev/null | openssl x509 -noout -dates
```

### 6. Mobile/Responsive Issues

#### Layout Broken on Mobile

**Problem**: Dashboard not responsive on mobile devices

**Diagnostics**:
```html
<!-- Check viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Solutions**:
```css
/* Check responsive classes */
.grid-cols-1 /* Mobile */
.md:grid-cols-2 /* Tablet */
.lg:grid-cols-3 /* Desktop */
.xl:grid-cols-6 /* Large desktop */
```

**Testing**:
```bash
# Test on different devices
# Browser DevTools > Device Toolbar
# Test: iPhone, iPad, Android, Desktop
```

### 7. GitHub Actions Issues

#### Workflow Failures

**Problem**: Automated deployment failing

**Diagnostics**:
```yaml
# Check workflow logs in GitHub
# Go to: Repository > Actions > Latest workflow run

# Common issues:
# - AWS credentials not set
# - Build failures
# - Test failures
# - Permission issues
```

**Solutions**:
```yaml
# Set GitHub Secrets:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# CLOUDFRONT_DISTRIBUTION_ID

# Check workflow file syntax
# .github/workflows/deploy.yml
```

### 8. Database Issues (SQLite)

#### Connection Issues

**Problem**: Cannot connect to local SQLite database

**Solutions**:
```bash
# Check SQLite installation
sqlite3 --version

# Test database file
sqlite3 suppliers.db ".tables"

# Check file permissions
ls -la suppliers.db

# Recreate database if corrupted
rm suppliers.db
# Re-run database setup scripts
```

## Debug Commands Reference

### System Information
```bash
# Node.js and npm versions
node --version
npm --version

# Git status
git --version
git status

# System info
uname -a
df -h
free -h
```

### AWS CLI Debug
```bash
# AWS configuration
aws configure list
aws sts get-caller-identity

# S3 debugging
aws s3 ls
aws s3 ls s3://strategic-procurement-dashboard-prod --recursive

# CloudFront debugging
aws cloudfront list-distributions
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### Network Debugging
```bash
# DNS resolution
nslookup d3fxj92ydzfq5s.cloudfront.net
dig d3fxj92ydzfq5s.cloudfront.net

# HTTP response testing
curl -I https://d3fxj92ydzfq5s.cloudfront.net
wget --spider https://d3fxj92ydzfq5s.cloudfront.net

# SSL certificate check
openssl s_client -connect d3fxj92ydzfq5s.cloudfront.net:443 -servername d3fxj92ydzfq5s.cloudfront.net
```

### Browser Debugging
```javascript
// Console commands
console.log('Debug info:', {
  userAgent: navigator.userAgent,
  screenSize: `${screen.width}x${screen.height}`,
  windowSize: `${window.innerWidth}x${window.innerHeight}`,
  location: window.location.href
});

// Check React version
console.log('React version:', React.version);

// Performance timing
console.log('Performance:', performance.timing);
```

## Getting Help

### 1. Log Analysis
```bash
# Browser console logs
# DevTools > Console > Save console output

# Network requests
# DevTools > Network > Export HAR file

# AWS CloudTrail logs
aws logs describe-log-groups
aws logs describe-log-streams --log-group-name /aws/cloudfront/
```

### 2. Issue Reporting
When reporting issues, include:
- **Environment**: OS, browser, versions
- **Steps to reproduce**: Detailed steps
- **Expected vs actual behavior**
- **Console logs**: Browser and build logs
- **Screenshots**: Visual issues
- **Network information**: HAR file if needed

### 3. Support Channels
- **GitHub Issues**: [Repository Issues](https://github.com/myownipgit/strategic-procurement-dashboard/issues)
- **Documentation**: [README.md](../README.md)
- **Live Demo**: [https://d3fxj92ydzfq5s.cloudfront.net](https://d3fxj92ydzfq5s.cloudfront.net)

### 4. Emergency Rollback
```bash
# Quick rollback procedure
# 1. Identify last working version
aws s3api list-object-versions --bucket strategic-procurement-dashboard-prod

# 2. Restore previous version
aws s3 sync s3://strategic-procurement-dashboard-prod-backup/ s3://strategic-procurement-dashboard-prod/

# 3. Invalidate cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# 4. Verify restoration
curl -I https://d3fxj92ydzfq5s.cloudfront.net
```

---

**Quick Reference:**
- **Primary URL**: https://d3fxj92ydzfq5s.cloudfront.net
- **S3 URL**: http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com
- **Repository**: https://github.com/myownipgit/strategic-procurement-dashboard
- **Issues**: [GitHub Issues](https://github.com/myownipgit/strategic-procurement-dashboard/issues)