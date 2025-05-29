# 🏢 Strategic Procurement Dashboard

> **Executive Strategic Procurement Dashboard - Comprehensive procurement optimization & cost reduction analysis with AWS S3 + CloudFront deployment**

[![Deployment Status](https://img.shields.io/badge/AWS-Deployed-orange)](https://d3fxj92ydzfq5s.cloudfront.net)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](#)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🚀 Live Demo

- **Primary Dashboard**: [https://d3fxj92ydzfq5s.cloudfront.net](https://d3fxj92ydzfq5s.cloudfront.net)
- **S3 Direct Access**: [http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com](http://strategic-procurement-dashboard-prod.s3-website-us-east-1.amazonaws.com)
- **Local Development**: [http://localhost:3000](http://localhost:3000)

## 📋 Executive Summary

A comprehensive React-based executive dashboard designed for C-suite procurement decision-making, featuring:

- **💰 Cost Savings Analytics**: Track $1.875M in annual savings (15% savings rate)
- **📊 Real-time KPI Monitoring**: Monitor 342 active vendors and 28 contract renewals
- **🎯 Strategic Initiatives**: Manage $1.23M in potential additional savings
- **⚠️ Risk Management**: Comprehensive risk scoring (23 vs industry average 35.8)
- **📈 Performance Benchmarking**: Industry comparisons and trend analysis

## 🏗️ Architecture

### AWS Infrastructure
- **S3 Bucket**: `strategic-procurement-dashboard-prod`
- **CloudFront Distribution**: Global CDN for optimal performance
- **Region**: `us-east-1` (N. Virginia)
- **Domain**: Custom CloudFront domain with SSL/TLS

### Technology Stack
- **Frontend**: React 19.1.0 with modern hooks
- **Charts**: Chart.js 4.4.9 + React-ChartJS-2
- **Styling**: Tailwind CSS (CDN)
- **Build Tool**: Create React App 5.0.1
- **Deployment**: AWS S3 + CloudFront

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Required software
- Node.js 18+ 
- npm 9+
- AWS CLI (for deployment)
- Git
```

### Step-by-Step Setup

#### STEP 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/myownipgit/strategic-procurement-dashboard.git
cd strategic-procurement-dashboard

# Install dependencies
npm install
```

#### STEP 2: Development Server
```bash
# Start development server
npm start

# Opens http://localhost:3000
```

#### STEP 3: Production Build
```bash
# Create optimized production build
npm run build:prod

# Test production build locally
npx serve -s build
```

#### STEP 4: AWS Deployment (Optional)
```bash
# Configure AWS CLI (if not already done)
aws configure

# Deploy to S3
npm run deploy:aws

# Invalidate CloudFront cache
npm run invalidate:cloudfront

# Or deploy everything at once
npm run deploy:full
```

## 📊 Dashboard Features

### Executive Overview
- **KPI Cards**: Total spend, savings, vendors, compliance
- **Monthly Trends**: Spending vs budget analysis
- **Category Breakdown**: Spend distribution across categories
- **Performance Metrics**: Industry benchmarking

### Spending Analysis
- **Monthly Spend Table**: Detailed budget variance analysis
- **Category Performance**: Savings by procurement category
- **Trend Analysis**: Year-over-year comparisons

### Vendor Management
- **Top Vendors**: Performance scoring and risk assessment
- **Contract Timeline**: Renewal pipeline management
- **Risk Scoring**: Vendor risk categorization

### Strategic Initiatives
- **Cost Reduction Projects**: $1.23M potential savings
- **Implementation Timeline**: Project status tracking
- **ROI Analysis**: Initiative impact assessment

### Risk Management
- **Risk Dashboard**: Comprehensive risk scoring
- **Contract Renewals**: Critical renewal pipeline
- **Compliance Tracking**: Regulatory compliance monitoring

## 📁 Project Structure

```
strategic-procurement-dashboard/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA configuration
│   └── robots.txt              # SEO configuration
├── src/
│   ├── components/
│   │   ├── Dashboard.js        # Main dashboard component
│   │   ├── Navigation.js       # Tab navigation
│   │   ├── KPICard.js         # KPI display cards
│   │   ├── ChartTabs.js       # Chart visualization tabs
│   │   └── ExecutiveInsights.js # Strategic insights
│   ├── data/
│   │   └── procurementData.js  # Procurement data model
│   ├── App.js                  # Root component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies & scripts
└── README.md                  # Documentation
```

## 🎯 Key Performance Indicators

| Metric | Value | Industry Benchmark | Performance |
|--------|-------|-------------------|-------------|
| **Total Annual Spend** | $12.5M | - | - |
| **Cost Savings Rate** | 15.0% | 12.5% | ✅ +20% above industry |
| **Active Vendors** | 342 | 450 | ✅ 24% more efficient |
| **Risk Score** | 23 | 35.8 | ✅ 36% lower risk |
| **Compliance Rate** | 94.2% | 89.2% | ✅ +5.6% above industry |

## 🔧 Configuration

### Environment Variables
```bash
# .env.production
REACT_APP_VERSION=2.0.0
REACT_APP_BUILD_DATE=$(date)
GENERATE_SOURCEMAP=false
```

### AWS Configuration
```bash
# AWS CLI configuration
aws configure set default.region us-east-1
aws configure set default.output json
```

## 📈 Data Model

### KPI Summary
```javascript
{
  totalSpend: 12_500_000,      // $12.5M annual spend
  totalSavings: 1_875_000,     // $1.875M savings (15%)
  activeVendors: 342,          // Strategic vendor count
  contractsRenewal: 28,        // Contracts due for renewal
  riskScore: 23,               // Risk assessment score
  complianceRate: 94.2         // Regulatory compliance %
}
```

### Strategic Initiatives
- **Vendor Consolidation**: $450K potential savings
- **Contract Renegotiation**: $320K potential savings  
- **Digital Procurement**: $280K potential savings
- **Sustainable Sourcing**: $180K potential savings

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Coverage report
npm test -- --coverage

# E2E tests (if configured)
npm run test:e2e
```

### Test Scenarios
- ✅ KPI card rendering
- ✅ Chart data visualization  
- ✅ Navigation functionality
- ✅ Responsive design
- ✅ Data formatting

## 🚀 Deployment Options

### 1. AWS S3 + CloudFront (Recommended)
```bash
# Full deployment pipeline
npm run deploy:full
```

### 2. GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy
```

### 3. Netlify/Vercel
```bash
# Build for static hosting
npm run build:prod
```

## 🔍 Performance Optimization

### Build Optimization
- **Code Splitting**: Automatic via Create React App
- **Tree Shaking**: Remove unused code
- **Minification**: CSS/JS compression
- **Source Maps**: Disabled in production

### CloudFront Optimization
- **Global CDN**: Edge locations worldwide
- **Compression**: Gzip/Brotli compression
- **Caching**: Optimized cache policies
- **SSL/TLS**: Full encryption

## 📱 Responsive Design

- **Desktop**: Optimized for 1920x1080+
- **Tablet**: iPad and Android tablet support
- **Mobile**: iPhone and Android phone support
- **Print**: Print-optimized layouts

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### Development Guidelines
- Follow React functional component patterns
- Use descriptive commit messages
- Add tests for new features
- Update documentation
- Maintain responsive design

## 🐛 Known Issues & Troubleshooting

### Common Issues
1. **Chart not rendering**: Check Chart.js registration
2. **Tailwind not loading**: Verify CDN connection
3. **Build failures**: Clear node_modules and reinstall
4. **AWS deployment issues**: Check AWS CLI configuration

### Debug Commands
```bash
# Clear cache and reinstall
npm run clean
npm install

# Check build bundle
npm run build:analyze

# Verify AWS configuration
aws s3 ls
aws cloudfront list-distributions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** - Beautiful chart visualizations
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI library
- **AWS** - Cloud infrastructure services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/myownipgit/strategic-procurement-dashboard/issues)
- **Documentation**: This README
- **Live Demo**: [https://d3fxj92ydzfq5s.cloudfront.net](https://d3fxj92ydzfq5s.cloudfront.net)

---

**Strategic Procurement Dashboard** - Transforming procurement through data-driven insights and executive analytics.

*Built with ❤️ by the Strategic Procurement Analytics Team*