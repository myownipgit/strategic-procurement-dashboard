// Database Service for Strategic Procurement Chatbot
// Handles SQLite database connections and queries

class DatabaseService {
  constructor() {
    this.dbPath = '/Users/myownip/workspace/claude_files/suppliers.db';
    this.isConnected = false;
  }

  // Test database connection
  async testConnection() {
    try {
      // Since we're in a React app, we'll use fetch to call our backend API
      // For now, we'll simulate the connection test
      console.log('Database connection test - using SQLite MCP Server');
      this.isConnected = true;
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      console.error('Database connection failed:', error);
      this.isConnected = false;
      return { success: false, error: error.message };
    }
  }

  // Execute Strategic Action Priority Matrix queries
  async queryStrategicActionMatrix(filters = {}) {
    try {
      let baseQuery = `
        SELECT 
          vendor_name,
          commodity_description,
          transaction_count,
          price_variance_amount,
          price_variance_percentage,
          total_spend,
          estimated_savings_opportunity,
          strategic_priority,
          risk_level,
          recommended_timeline,
          recommended_action,
          effort_level
        FROM strategic_action_priority_matrix 
      `;

      const conditions = [];
      
      if (filters.priority) {
        conditions.push(`strategic_priority = '${filters.priority}'`);
      }
      
      if (filters.timeline) {
        conditions.push(`recommended_timeline = '${filters.timeline}'`);
      }
      
      if (filters.riskLevel) {
        conditions.push(`risk_level = '${filters.riskLevel}'`);
      }
      
      if (filters.minSavings) {
        conditions.push(`estimated_savings_opportunity >= ${filters.minSavings}`);
      }

      if (conditions.length > 0) {
        baseQuery += ` WHERE ${conditions.join(' AND ')}`;
      }

      baseQuery += ` ORDER BY price_variance_amount DESC`;
      
      if (filters.limit) {
        baseQuery += ` LIMIT ${filters.limit}`;
      }

      // For production, this would make an API call to your backend
      // For development, we'll return sample data structure
      console.log('Executing query:', baseQuery);
      
      // Return mock data structure for now - in production this would be replaced with actual API call
      return {
        success: true,
        data: [
          {
            vendor_name: 'POWELL ELECTRICAL SYSTEMS INC',
            commodity_description: 'SWITCHGEARS AND PARTS, METAL CLAD',
            transaction_count: 11,
            price_variance_amount: 568541.0,
            price_variance_percentage: 11508.93,
            total_spend: 6367032.64,
            estimated_savings_opportunity: 1591758.16,
            strategic_priority: 'CRITICAL',
            risk_level: 'EXTREME',
            recommended_timeline: '0-30 days',
            recommended_action: 'Emergency Contract Renegotiation',
            effort_level: 'HIGH'
          }
        ],
        query: baseQuery
      };

    } catch (error) {
      console.error('Strategic Action Matrix query error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get crisis response data (0-30 day actions)
  async getCrisisResponseData() {
    return await this.queryStrategicActionMatrix({
      timeline: '0-30 days',
      priority: 'CRITICAL'
    });
  }

  // Get strategic priority summary
  async getStrategicPrioritySummary() {
    try {
      const query = `
        SELECT 
          strategic_priority,
          COUNT(*) as case_count,
          SUM(estimated_savings_opportunity) as total_savings_opportunity,
          AVG(price_variance_amount) as avg_price_variance,
          SUM(total_spend) as total_spend_at_risk
        FROM strategic_action_priority_matrix 
        GROUP BY strategic_priority
        ORDER BY 
          CASE strategic_priority 
            WHEN 'CRITICAL' THEN 1 
            WHEN 'HIGH' THEN 2 
            WHEN 'MEDIUM' THEN 3 
            WHEN 'LOW' THEN 4 
          END
      `;

      console.log('Executing summary query:', query);

      // Mock data for development - replace with actual API call in production
      return {
        success: true,
        data: [
          {
            strategic_priority: 'CRITICAL',
            case_count: 2,
            total_savings_opportunity: 2250967.85,
            avg_price_variance: 476496.01,
            total_spend_at_risk: 9003871.41
          },
          {
            strategic_priority: 'HIGH',
            case_count: 30,
            total_savings_opportunity: 7875899.88,
            avg_price_variance: 135063.063,
            total_spend_at_risk: 38680095.88
          }
        ],
        query: query
      };

    } catch (error) {
      console.error('Strategic priority summary error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Search vendors by name or commodity
  async searchVendors(searchTerm) {
    try {
      const query = `
        SELECT 
          vendor_name,
          commodity_description,
          strategic_priority,
          estimated_savings_opportunity,
          recommended_action
        FROM strategic_action_priority_matrix 
        WHERE vendor_name LIKE '%${searchTerm}%' 
           OR commodity_description LIKE '%${searchTerm}%'
        ORDER BY estimated_savings_opportunity DESC
        LIMIT 10
      `;

      console.log('Executing vendor search:', query);

      return {
        success: true,
        data: [], // Would be populated by actual query results
        query: query
      };

    } catch (error) {
      console.error('Vendor search error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format percentage for display
  formatPercentage(percentage) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(percentage / 100);
  }
}

export default DatabaseService;
