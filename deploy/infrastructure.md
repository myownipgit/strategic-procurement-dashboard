# Infrastructure Architecture

## Overview
This document outlines the complete infrastructure architecture for the Strategic Procurement Dashboard deployment on AWS.

## Architecture Diagram

```
Internet
    |
    v
CloudFront CDN
(Global Distribution)
    |
    v
S3 Static Website
(strategic-procurement-dashboard-prod)
    |
    v
React Application
(Single Page Application)
```

## AWS Infrastructure Components

### 1. Amazon S3 (Simple Storage Service)

#### Bucket Configuration
- **Bucket Name**: `strategic-procurement-dashboard-prod`
- **Region**: `us-east-1` (N. Virginia)
- **Website Hosting**: Enabled
- **Public Access**: Configured for static website hosting
- **Versioning**: Enabled for backup and rollback

#### Bucket Policy
```json
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
```

#### File Structure in S3
```
strategic-procurement-dashboard-prod/
├── index.html                    # Main entry point
├── static/
│   ├── css/
│   │   └── main.[hash].css      # Minified CSS bundle
│   ├── js/
│   │   ├── main.[hash].js       # Main React bundle
│   │   └── vendor.[hash].js     # Third-party libraries
│   └── media/
│       └── [assets]             # Images, fonts, etc.
├── manifest.json                # PWA manifest
├── robots.txt                   # SEO robots file
└── service-worker.js            # PWA service worker
```

### 2. Amazon CloudFront (Content Delivery Network)

#### Distribution Configuration
- **Distribution ID**: `E1EXAMPLE123456` (example)
- **Domain Name**: `d3fxj92ydzfq5s.cloudfront.net`
- **Origin**: S3 bucket website endpoint
- **Price Class**: PriceClass_All (global distribution)
- **SSL Certificate**: AWS Certificate Manager

#### Cache Behaviors
```yaml
Default Behavior:
  Target Origin: S3-strategic-procurement-dashboard-prod
  Viewer Protocol Policy: Redirect to HTTPS
  Allowed HTTP Methods: GET, HEAD
  Cache Policy: Managed-CachingOptimized
  Compress: Yes
  TTL:
    Default: 86400 seconds (24 hours)
    Maximum: 31536000 seconds (1 year)
    Minimum: 0 seconds
```

#### Custom Error Pages
```yaml
Error Responses:
  - Error Code: 404
    Response Page Path: /index.html
    Response Code: 200
    Error Caching Min TTL: 300 seconds
  - Error Code: 403
    Response Page Path: /index.html
    Response Code: 200
    Error Caching Min TTL: 300 seconds
```

### 3. Route 53 (DNS - Optional)

#### DNS Configuration (if using custom domain)
```yaml
Hosted Zone: example.com
Records:
  - Name: procurement.example.com
    Type: CNAME
    Value: d3fxj92ydzfq5s.cloudfront.net
    TTL: 300
```

### 4. AWS Certificate Manager (SSL/TLS)

#### Certificate Configuration
```yaml
Certificate:
  Domain Names:
    - procurement.example.com
    - www.procurement.example.com
  Validation Method: DNS
  Key Algorithm: RSA-2048
  Region: us-east-1 (required for CloudFront)
```

## Network Architecture

### Data Flow
1. **User Request**: User visits dashboard URL
2. **DNS Resolution**: Domain resolves to CloudFront edge location
3. **Edge Cache Check**: CloudFront checks for cached content
4. **Origin Request**: If not cached, requests from S3 origin
5. **Content Delivery**: Content served from nearest edge location
6. **Browser Rendering**: React application loads and renders

### Performance Optimization

#### CloudFront Edge Locations
- **Global**: 400+ edge locations worldwide
- **Regional**: Edge caches in major regions
- **Local**: Last-mile delivery optimization

#### Caching Strategy
```yaml
Static Assets (CSS, JS, Images):
  Cache-Control: public, max-age=31536000
  CloudFront TTL: 1 year
  Browser Cache: 1 year

HTML Files:
  Cache-Control: public, max-age=0, must-revalidate
  CloudFront TTL: 0 (always check origin)
  Browser Cache: No cache

Service Worker:
  Cache-Control: public, max-age=0, must-revalidate
  CloudFront TTL: 0
  Browser Cache: No cache
```

## Security Architecture

### Transport Security
- **HTTPS Only**: All traffic encrypted in transit
- **TLS 1.2+**: Modern encryption protocols
- **HSTS**: HTTP Strict Transport Security headers

### Access Control
```yaml
S3 Bucket Policy:
  Effect: Allow
  Principal: "*"
  Action: s3:GetObject
  Resource: arn:aws:s3:::strategic-procurement-dashboard-prod/*
  
CloudFront Access:
  Viewer Protocol Policy: redirect-to-https
  Origin Protocol Policy: match-viewer
```

### Content Security Policy (Recommended)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self';
">
```

## Monitoring and Logging

### CloudWatch Metrics
```yaml
S3 Metrics:
  - BucketSizeBytes
  - NumberOfObjects
  - AllRequests
  - GetRequests
  - Errors

CloudFront Metrics:
  - Requests
  - BytesDownloaded
  - ErrorRate
  - CacheHitRate
  - OriginLatency
```

### Logging Configuration
```yaml
S3 Access Logs:
  Target Bucket: strategic-procurement-dashboard-logs
  Target Prefix: s3-access-logs/
  
CloudFront Access Logs:
  Bucket: strategic-procurement-dashboard-logs
  Prefix: cloudfront-access-logs/
  Include Cookies: No
```

### Alarms and Notifications
```yaml
CloudWatch Alarms:
  - High Error Rate (> 5%)
  - Low Cache Hit Rate (< 80%)
  - High Origin Latency (> 1000ms)
  - Unusual Traffic Patterns

SNS Notifications:
  - Email alerts for critical issues
  - Slack integration for team notifications
```

## Backup and Disaster Recovery

### S3 Backup Strategy
```yaml
Versioning:
  Status: Enabled
  MFA Delete: Disabled
  
Lifecycle Policy:
  - Transition to IA: 30 days
  - Delete old versions: 90 days
  - Delete incomplete multipart uploads: 7 days

Cross-Region Replication:
  Source: us-east-1
  Destination: us-west-2
  Status: Optional (for high availability)
```

### Recovery Procedures
```yaml
Rollback Process:
  1. Identify last known good version
  2. Restore from S3 version history
  3. Invalidate CloudFront cache
  4. Verify functionality
  5. Update monitoring

Disaster Recovery:
  RTO (Recovery Time Objective): 15 minutes
  RPO (Recovery Point Objective): 1 hour
  Backup Frequency: Every deployment
```

## Cost Optimization

### S3 Storage Costs
```yaml
Storage Classes:
  - Standard: Active content
  - Standard-IA: Backup versions (30+ days)
  - Glacier: Long-term archives (90+ days)

Data Transfer:
  - To CloudFront: Free
  - To Internet: Charged (minimal for static sites)
```

### CloudFront Costs
```yaml
Pricing Factors:
  - Data Transfer Out: $0.085-0.25/GB (varies by region)
  - HTTP/HTTPS Requests: $0.0075-0.01/10,000 requests
  - Price Class: All (most expensive but best performance)

Optimization:
  - Compression: Reduces transfer costs
  - Caching: Reduces origin requests
  - Regional distribution: Optimizes edge costs
```

### Monthly Cost Estimate
```yaml
S3 Storage (1GB): $0.023
S3 Requests (10K): $0.004
CloudFront Data Transfer (10GB): $0.85
CloudFront Requests (100K): $0.075
SSL Certificate: Free (ACM)

Total Monthly Cost: ~$1.00
Annual Cost: ~$12.00
```

## Scalability

### Automatic Scaling
- **S3**: Virtually unlimited storage
- **CloudFront**: Auto-scales to handle traffic spikes
- **Global**: Edge locations handle regional load

### Performance Characteristics
```yaml
Throughput:
  S3: 3,500 PUT/COPY/POST/DELETE, 5,500 GET/HEAD per prefix
  CloudFront: Unlimited (auto-scaling)

Latency:
  S3 Direct: 100-200ms (depending on region)
  CloudFront: 10-50ms (edge location)
  
Availability:
  S3: 99.999999999% (11 9's) durability
  CloudFront: 99.9% SLA
```

## Environment Management

### Multi-Environment Setup
```yaml
Development:
  S3 Bucket: strategic-procurement-dashboard-dev
  CloudFront: dev-d1a2b3c4d5e6f7.cloudfront.net
  
Staging:
  S3 Bucket: strategic-procurement-dashboard-staging
  CloudFront: staging-d1a2b3c4d5e6f7.cloudfront.net
  
Production:
  S3 Bucket: strategic-procurement-dashboard-prod
  CloudFront: d3fxj92ydzfq5s.cloudfront.net
```

### Infrastructure as Code (Optional)
```yaml
AWS CloudFormation:
  Template: infrastructure.yaml
  Parameters: environment-specific
  
AWS CDK:
  Language: TypeScript/Python
  Stack: ProcurementDashboardStack
  
Terraform:
  Provider: AWS
  State: S3 backend with DynamoDB locking
```

## Compliance and Governance

### Security Standards
- **AWS Well-Architected Framework**: Security pillar compliance
- **HTTPS Everywhere**: All traffic encrypted
- **Access Logging**: Full audit trail
- **Least Privilege**: Minimal required permissions

### Governance Policies
```yaml
Tagging Strategy:
  Environment: prod/staging/dev
  Project: strategic-procurement-dashboard
  Owner: procurement-team
  CostCenter: finance-analytics
  
Resource Naming:
  Pattern: {project}-{environment}-{resource-type}
  Example: strategic-procurement-dashboard-prod-bucket
```

---

## Quick Reference

### Key URLs
- **Primary**: https://d3fxj92ydzfq5s.cloudfront.net
- **S3 Direct**: http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com
- **Repository**: https://github.com/myownipgit/strategic-procurement-dashboard

### AWS Resources
- **S3 Bucket**: strategic-procurement-dashboard-prod
- **CloudFront Distribution**: d3fxj92ydzfq5s.cloudfront.net
- **Region**: us-east-1
- **SSL Certificate**: ACM managed

### Performance Targets
- **Page Load**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Lighthouse Score**: > 90
- **Uptime**: 99.9%