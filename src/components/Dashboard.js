import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import PriceVarianceCrisisAnalysis from './PriceVarianceCrisisAnalysis';
import { 
  executiveKPIs, 
  strategicActions, 
  implementationRoadmap,
  riskAssessment,
  executiveMetrics
} from '../data/strategicActionData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('strategic');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Executive KPI Panel Component
  const ExecutiveKPIs = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{formatCurrency(executiveKPIs.totalSpend)}</div>
        <div className="text-red-100 text-sm mt-1">Total Annual Spend</div>
        <div className="text-xs mt-2 bg-red-600 bg-opacity-50 px-2 py-1 rounded">
          {formatNumber(executiveKPIs.totalTransactions)} transactions
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{formatNumber(executiveKPIs.totalVendors)}</div>
        <div className="text-orange-100 text-sm mt-1">Active Vendors</div>
        <div className="text-xs mt-2 bg-orange-600 bg-opacity-50 px-2 py-1 rounded">
          Target: 1,500 (-45%)
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{formatCurrency(executiveKPIs.potentialSavings)}</div>
        <div className="text-green-100 text-sm mt-1">Immediate Savings</div>
        <div className="text-xs mt-2 bg-green-600 bg-opacity-50 px-2 py-1 rounded">
          420% ROI Year 1
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{executiveKPIs.criticalCases}</div>
        <div className="text-purple-100 text-sm mt-1">Critical Cases</div>
        <div className="text-xs mt-2 bg-purple-600 bg-opacity-50 px-2 py-1 rounded">
          Max Variance: 18.4M%
        </div>
      </div>
    </div>
  );

  // Strategic Actions Component
  const StrategicActionsPanel = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Strategic Action Plan</h2>
      <div className="space-y-4">
        {strategicActions.map((action, index) => (
          <div key={index} className={`border-l-4 pl-6 py-4 rounded-r-lg ${
            action.priority === 'Critical' ? 'border-red-500 bg-red-50' :
            action.priority === 'High' ? 'border-orange-500 bg-orange-50' :
            'border-yellow-500 bg-yellow-50'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{action.action}</h3>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  action.priority === 'Critical' ? 'bg-red-500 text-white' :
                  action.priority === 'High' ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  {action.priority}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {action.timeline}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{action.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-semibold">Savings: {formatCurrency(action.savings)}</span>
              <span className="text-gray-500">Effort: {action.effort}</span>
              <span className="text-purple-600 font-semibold">Risk Reduction: {action.riskReduction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Implementation Roadmap Component
  const ImplementationRoadmap = () => {
    const roiData = {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: [
        {
          label: 'ROI %',
          data: [executiveMetrics.roiProjection.year1 * 100, 
                 executiveMetrics.roiProjection.year2 * 100, 
                 executiveMetrics.roiProjection.year3 * 100],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    const roiOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'ROI Projection Over 3 Years'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'ROI Percentage'
          }
        }
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">🛣️ Implementation Roadmap</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {implementationRoadmap.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{phase.phase}</h3>
                    <p className="text-sm text-gray-500">{phase.duration}</p>
                  </div>
                </div>
                <div className="ml-12 mt-2">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {phase.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-green-600 font-semibold">
                        Savings: {formatCurrency(phase.savings)}
                      </span>
                      <span className="text-red-600">
                        Investment: {formatCurrency(phase.investment)}
                      </span>
                    </div>
                  </div>
                </div>
                {index < implementationRoadmap.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-blue-300"></div>
                )}
              </div>
            ))}
          </div>
          <div>
            <Line data={roiData} options={roiOptions} />
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Investment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Investment:</span>
                  <span className="font-bold">{formatCurrency(5000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Savings (3 years):</span>
                  <span className="font-bold text-green-600">{formatCurrency(285000000)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Net Benefit:</span>
                  <span className="font-bold text-green-600">{formatCurrency(280000000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Risk Assessment Component
  const RiskAssessment = () => {
    const riskData = {
      labels: riskAssessment.map(risk => risk.category),
      datasets: [
        {
          data: riskAssessment.map(risk => risk.financialImpact),
          backgroundColor: [
            '#ef4444', '#f97316', '#eab308', '#22c55e'
          ],
          borderColor: [
            '#dc2626', '#ea580c', '#ca8a04', '#16a34a'
          ],
          borderWidth: 2
        }
      ]
    };

    const riskOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Financial Risk Distribution'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
            }
          }
        }
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6">⚠️ Risk Assessment</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Doughnut data={riskData} options={riskOptions} />
          </div>
          <div className="space-y-4">
            {riskAssessment.map((risk, index) => (
              <div key={index} className={`rounded-lg p-4 border-l-4 ${
                risk.currentLevel === 'Critical' ? 'bg-red-50 border-red-500' :
                risk.currentLevel === 'High' ? 'bg-orange-50 border-orange-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{risk.category}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    risk.currentLevel === 'Critical' ? 'bg-red-500 text-white' :
                    risk.currentLevel === 'High' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {risk.currentLevel}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">Financial Impact:</span>
                    <span className="font-bold text-red-600 ml-1">
                      {formatCurrency(risk.financialImpact)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Probability:</span>
                    <span className="font-bold ml-1">{risk.probabilityOfLoss}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mitigation:</span>
                    <span className="ml-1">{risk.mitigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Navigation Tabs
  const NavigationTabs = () => (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      <div className="flex flex-wrap border-b">
        {[
          { id: 'strategic', label: '🎯 Strategic Action Plan', color: 'blue' },
          { id: 'crisis', label: '🚨 Price Variance Crisis', color: 'red' },
          { id: 'roadmap', label: '🛣️ Implementation Roadmap', color: 'green' },
          { id: 'risk', label: '⚠️ Risk Assessment', color: 'orange' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? `text-${tab.color}-600 border-b-2 border-${tab.color}-500 bg-${tab.color}-50`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Strategic Procurement Dashboard</h1>
          <p className="text-blue-100 text-lg">
            Executive Crisis Response Framework - $85M+ Immediate Savings Identified
          </p>
          <div className="mt-4 flex space-x-6 text-sm">
            <span className="bg-red-500 bg-opacity-20 px-3 py-1 rounded-full">
              🚨 URGENT: Board-level intervention required
            </span>
            <span className="bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
              💰 420% ROI Year 1 Projection
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Executive KPIs */}
        <ExecutiveKPIs />

        {/* Navigation */}
        <NavigationTabs />

        {/* Tab Content */}
        {activeTab === 'strategic' && <StrategicActionsPanel />}
        {activeTab === 'crisis' && <PriceVarianceCrisisAnalysis />}
        {activeTab === 'roadmap' && <ImplementationRoadmap />}
        {activeTab === 'risk' && <RiskAssessment />}

        {/* Footer */}
        <div className="mt-12 bg-gray-800 text-white rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">🚨 Executive Action Required</h3>
            <p className="text-gray-300 mb-4">
              This dashboard identifies $85M+ immediate savings opportunity requiring board-level intervention within 30 days.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="bg-red-600 px-4 py-2 rounded">Crisis Response Ready</span>
              <span className="bg-green-600 px-4 py-2 rounded">Executive Presentation Ready</span>
              <span className="bg-blue-600 px-4 py-2 rounded">Implementation Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;