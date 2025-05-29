import React, { useState } from 'react';
import {
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Activity, Target } from 'lucide-react';

// Enhanced Crisis Data
const priceVarianceData = [
  { month: 'Jan', planned: 2850000, actual: 3120000, variance: 9.5, crisis_level: 'Monitor' },
  { month: 'Feb', planned: 2950000, actual: 3380000, variance: 14.6, crisis_level: 'Monitor' },
  { month: 'Mar', planned: 3100000, actual: 3720000, variance: 20.0, crisis_level: 'Crisis' },
  { month: 'Apr', planned: 2900000, actual: 3625000, variance: 25.0, crisis_level: 'Crisis' },
  { month: 'May', planned: 3200000, actual: 4160000, variance: 30.0, crisis_level: 'Emergency' },
  { month: 'Jun', planned: 3350000, actual: 4187500, variance: 25.0, crisis_level: 'Crisis' }
];

// Top 5 Crisis Offenders Heatmap Data
const crisisHeatmapData = [
  {
    category: 'Semiconductors',
    supplier: 'TechCorp',
    q1: 5, q2: 12, q3: 18, q4: 25,
    trend: 'up',
    impact: 2300000,
    risk_level: 'Critical',
    contracts_affected: 15
  },
  {
    category: 'Logistics',
    supplier: 'DHL/FedEx',
    q1: 11, q2: 16, q3: 22, q4: 19,
    trend: 'up',
    impact: 890000,
    risk_level: 'High',
    contracts_affected: 8
  },
  {
    category: 'Rare Earth Metals',
    supplier: 'ChinaMining',
    q1: 8, q2: 13, q3: 17, q4: 21,
    trend: 'up',
    impact: 1200000,
    risk_level: 'Critical',
    contracts_affected: 12
  },
  {
    category: 'Display Panels',
    supplier: 'Samsung',
    q1: 6, q2: 14, q3: 16, q4: 16,
    trend: 'stable',
    impact: 750000,
    risk_level: 'High',
    contracts_affected: 6
  },
  {
    category: 'Battery Components',
    supplier: 'Panasonic',
    q1: 10, q2: 12, q3: 15, q4: 20,
    trend: 'up',
    impact: 580000,
    risk_level: 'High',
    contracts_affected: 9
  }
];

// Category Variance Data
const categoryVarianceData = [
  { category: 'Electronics', variance: 28.5, spend: 15200000, savings_at_risk: 4300000 },
  { category: 'Raw Materials', variance: 22.3, spend: 8900000, savings_at_risk: 1980000 },
  { category: 'Logistics', variance: 19.8, spend: 4500000, savings_at_risk: 890000 },
  { category: 'Packaging', variance: 8.2, spend: 2100000, savings_at_risk: 172000 },
  { category: 'Services', variance: 12.4, spend: 3200000, savings_at_risk: 397000 },
  { category: 'Manufacturing', variance: 15.7, spend: 6800000, savings_at_risk: 1068000 }
];

// Risk Impact Matrix Data
const riskImpactData = [
  { x: 25, y: 2300000, category: 'Semiconductors', r: 15 },
  { x: 22, y: 890000, category: 'Logistics', r: 8 },
  { x: 21, y: 1200000, category: 'Rare Earth', r: 12 },
  { x: 16, y: 750000, category: 'Display Panels', r: 6 },
  { x: 20, y: 580000, category: 'Battery', r: 9 },
  { x: 28, y: 4300000, category: 'Electronics Total', r: 20 }
];

// Utility functions for risk colors
const getRiskColor = (variance) => {
  if (variance >= 25) return '#dc2626'; // Emergency - Red
  if (variance >= 15) return '#ea580c'; // Crisis - Orange
  if (variance >= 5) return '#ca8a04';  // Monitor - Yellow
  return '#16a34a'; // Good - Green
};

// Custom Heatmap Cell Component
const HeatmapCell = ({ value, maxValue = 30 }) => {
  const intensity = Math.min(value / maxValue, 1);
  const color = getRiskColor(value);
  
  return (
    <div 
      className="w-16 h-10 flex items-center justify-center border border-gray-300 rounded text-xs font-bold"
      style={{ 
        backgroundColor: color,
        opacity: 0.3 + (intensity * 0.7),
        color: intensity > 0.5 ? 'white' : 'black'
      }}
    >
      {value}%
    </div>
  );
};

const PriceVarianceCrisisAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  const totalCrisisImpact = 5720000;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 0, label: '🚨 Crisis Heatmap', icon: AlertTriangle },
    { id: 1, label: '📈 Variance Trends', icon: TrendingUp },
    { id: 2, label: '🎯 Risk Matrix', icon: Target },
    { id: 3, label: '📊 Category Impact', icon: Activity }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Crisis Alert Header */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">PRICE VARIANCE CRISIS DETECTED</h3>
            <p className="text-red-700 mt-1">
              <span className="font-bold">${(totalCrisisImpact / 1000000).toFixed(1)}M</span> over budget across 5 critical categories | 
              <span className="font-bold"> 50 contracts</span> require immediate renegotiation
            </p>
          </div>
        </div>
      </div>

      {/* Crisis KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-semibold text-red-800">Crisis Categories</h4>
          </div>
          <div className="text-3xl font-bold text-red-600">5/12</div>
          <p className="text-sm text-gray-600">Categories >15% variance</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
            <h4 className="font-semibold text-orange-800">Avg Variance</h4>
          </div>
          <div className="text-3xl font-bold text-orange-600">20.7%</div>
          <p className="text-sm text-gray-600">Up from 8.2% last quarter</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-green-800">Budget Impact</h4>
          </div>
          <div className="text-3xl font-bold text-green-600">${(totalCrisisImpact / 1000000).toFixed(1)}M</div>
          <p className="text-sm text-gray-600">Emergency budget required</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-800">Risk Velocity</h4>
          </div>
          <div className="text-3xl font-bold text-blue-600">+12%</div>
          <p className="text-sm text-gray-600">Month-over-month increase</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Crisis Heatmap Tab */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Top 5 Crisis Offenders - Quarterly Variance Heatmap
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category / Supplier
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Q1</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Q2</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Q3</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Q4</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {crisisHeatmapData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{row.category}</div>
                              <div className="text-sm text-gray-500">{row.supplier}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <HeatmapCell value={row.q1} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <HeatmapCell value={row.q2} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <HeatmapCell value={row.q3} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <HeatmapCell value={row.q4} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              <TrendingUp className={`h-4 w-4 ${row.trend === 'up' ? 'text-red-500' : 'text-yellow-500'} mr-1`} />
                              <span className="text-xs">{row.trend === 'up' ? '+8%' : 'Stable'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-bold text-red-600">
                              {formatCurrency(row.impact)}
                            </div>
                            <div className="text-xs text-gray-500">{row.contracts_affected} contracts</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              row.risk_level === 'Critical' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {row.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-red-50 border-t border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      <span className="font-bold">TOTAL CRISIS IMPACT:</span> {formatCurrency(totalCrisisImpact)} over budget | 
                      <span className="font-bold"> EXECUTIVE ACTION REQUIRED</span> - Immediate supplier renegotiation needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variance Trends Tab */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-4">Price Variance Crisis Escalation Timeline</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={priceVarianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'variance') return [`${value}%`, 'Variance'];
                        return [`$${(value / 1000000).toFixed(1)}M`, name];
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="planned" fill="#4ade80" name="Planned Spend" />
                      <Bar yAxisId="left" dataKey="actual" fill="#ef4444" name="Actual Spend" />
                      <Line yAxisId="right" type="monotone" dataKey="variance" stroke="#f97316" strokeWidth={3} name="Variance %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Crisis Level Progression</h3>
                <div className="space-y-4">
                  {priceVarianceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.crisis_level === 'Emergency' ? 'bg-red-100 text-red-800' :
                          item.crisis_level === 'Crisis' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.crisis_level}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.variance >= 25 ? 'bg-red-500' :
                            item.variance >= 15 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(item.variance * 3, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{item.variance}% variance</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Risk Matrix Tab */}
          {activeTab === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">Risk Impact Matrix - Variance % vs Budget Impact</h3>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart data={riskImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Variance %" 
                    domain={[0, 35]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Budget Impact" 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Variance %') return [`${value}%`, name];
                      return [`$${(value / 1000000).toFixed(1)}M`, 'Budget Impact'];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.category;
                      }
                      return label;
                    }}
                  />
                  <Scatter dataKey="y" fill="#ef4444">
                    {riskImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskColor(entry.x)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              
              <div className="mt-4 text-sm text-gray-600">
                <strong>Bubble size:</strong> Number of affected contracts | 
                <strong> Color coding:</strong> 🟢 Good (&lt;5%) | 🟡 Monitor (5-15%) | 🟠 Crisis (15-25%) | 🔴 Emergency (&gt;25%)
              </div>
            </div>
          )}

          {/* Category Impact Tab */}
          {activeTab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-4">Category Variance Impact Analysis</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryVarianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'variance') return [`${value}%`, 'Variance'];
                        return [`$${(value / 1000000).toFixed(1)}M`, name];
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="spend" fill="#3b82f6" name="Total Spend" />
                      <Bar yAxisId="left" dataKey="savings_at_risk" fill="#ef4444" name="Savings at Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Savings at Risk Summary</h3>
                <div className="space-y-3">
                  {categoryVarianceData
                    .sort((a, b) => b.savings_at_risk - a.savings_at_risk)
                    .map((category, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${index < 3 ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}
                      >
                        <div className="font-medium text-sm">{category.category}</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatCurrency(category.savings_at_risk)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: `${(category.savings_at_risk / 4300000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {category.variance}% variance on {formatCurrency(category.spend)} spend
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceVarianceCrisisAnalysis;