# Contributing to Strategic Procurement Dashboard

## 🎯 Welcome Contributors

Thank you for your interest in improving the Strategic Procurement Dashboard. This document provides guidelines for contributing to this executive-level procurement analytics tool.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Git knowledge and GitHub account
- Understanding of React, Chart.js, and modern CSS
- Basic procurement/finance domain knowledge helpful

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/strategic-procurement-dashboard.git
cd strategic-procurement-dashboard

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test
```

## 📋 Contribution Guidelines

### Code Style
- Use **ES6+ JavaScript** with modern React patterns
- Follow **functional components** with hooks
- Maintain **responsive design** principles
- Use **semantic HTML** and proper accessibility

### Component Structure
```javascript
// Preferred component structure
import React from 'react';
import { Chart } from 'chart.js';

const ComponentName = () => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Helper functions
  const formatCurrency = (amount) => {
    // Implementation
  };

  // Return JSX
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Data Handling
- Use **sample data** only (no real procurement data)
- Follow existing data structure patterns
- Maintain **realistic but fictional** values
- Document data sources and assumptions

## 🎨 Design Guidelines

### Color Palette
```css
/* Maintain corporate color scheme */
--primary-blue: #1565c0;
--secondary-blue: #1976d2;
--success-green: #388e3c;
--warning-orange: #f57c00;
--danger-red: #d32f2f;
--info-blue: #1976d2;
```

## 🔄 Pull Request Process

### Before Submitting
1. **Test thoroughly** on multiple devices
2. **Update documentation** if needed
3. **Check accessibility** compliance
4. **Verify responsive design**
5. **Ensure no console errors**

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Documentation update
- [ ] Performance improvement
- [ ] UI/UX enhancement

## Testing
- [ ] Unit tests pass
- [ ] Visual testing completed
- [ ] Mobile responsive verified
- [ ] Accessibility checked

## Business Impact
Describe how this improves the executive dashboard
```

## 🏆 Recognition

### Contributor Hall of Fame
Contributors will be recognized in:
- **README.md** acknowledgments
- **Release notes** for significant contributions
- **Annual contributor report**

---

**Thank you for contributing to the Strategic Procurement Dashboard!**

Your contributions help create better procurement analytics for organizations worldwide.