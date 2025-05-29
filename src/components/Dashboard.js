import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Top Tail Spend Categories Data
  const tailSpendData = {
    labels: [
      'Office Supplies',
      'MRO/Maintenance', 
      'IT Consumables',
      'Safety Equipment',
      'Janitorial',
      'Small Tools',
      'Lab Supplies',
      'Vehicle Parts'
    ],
    datasets: [
      {
        data: [456, 298, 245, 189, 156, 134, 98, 87],
        backgroundColor: [
          '#8B4513', '#D2691E', '#FF8C00', '#4169E1', 
          '#32CD32', '#FF6347', '#20B2AA', '#4682B4'
        ],
        borderColor: [
          '#654321', '#B8860B', '#FF7F00', '#0000CD',
          '#228B22', '#FF4500', '#008B8B', '#2F4F4F'
        ],
        borderWidth: 1
      }
    ]
  };

  // P-Card Implementation Strategy Data
  const pCardData = {
    labels: ['P-Card Target', 'Catalog/Contracts', 'Blanket Orders', 'Manual Process'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#20B2AA', '#4169E1', '#32CD32', '#FF6347'],
        borderColor: ['#008B8B', '#0000CD', '#228B22', '#FF4500'],
        borderWidth: 2
      }
    ]
  };

  // Volume Discount Opportunities Data
  const volumeDiscountData = {
    labels: ['Current', 'Tier 1 (15%)', 'Tier 2 (20%)', 'Tier 3 (25%)', 'Strategic (30%)'],
    datasets: [
      {
        label: 'Effective Annual Spend ($M)',
        data: [25.2, 21.4, 20.2, 19.0, 17.6],
        backgroundColor: ['#DC143C', '#FF8C00', '#4169E1', '#32CD32', '#20B2AA'],
        borderColor: ['#B22222', '#FF7F00', '#0000CD', '#228B22', '#008B8B'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#e5e7eb'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Strategic Savings Opportunities
          </h1>
          <p className="text-green-100 text-lg text-center mb-6">
            Comprehensive procurement optimization & cost reduction analysis
          </p>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-4 text-center">
            <p className="text-sm">
              🎯 <strong>REALISTIC SAVINGS POTENTIAL:</strong> $25-50M identified across overlapping procurement optimization opportunities (5-10% of total spend)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border-t-4 border-orange-500">
            <div className="text-green-500 mb-2">●</div>
            <div className="text-2xl font-bold text-orange-600 mb-1">$103.6M</div>
            <div className="text-gray-600 text-sm font-medium">TAIL SPEND TOTAL</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border-t-4 border-blue-500">
            <div className="text-green-500 mb-2">●</div>
            <div className="text-2xl font-bold text-blue-600 mb-1">2,547</div>
            <div className="text-gray-600 text-sm font-medium">TAIL SPEND VENDORS</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border-t-4 border-green-500">
            <div className="text-green-500 mb-2">●</div>
            <div className="text-2xl font-bold text-green-600 mb-1">$5-10M</div>
            <div className="text-gray-600 text-sm font-medium">OPTIMIZATION POTENTIAL</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border-t-4 border-teal-500">
            <div className="text-green-500 mb-2">●</div>
            <div className="text-2xl font-bold text-teal-600 mb-1">85%</div>
            <div className="text-gray-600 text-sm font-medium">P-CARD OPPORTUNITY</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Tail Spend Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Top Tail Spend Categories</h3>
            </div>
            <div className="h-64">
              <Bar data={tailSpendData} options={chartOptions} />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Most Fragmented</span>
                <span className="text-orange-600 font-semibold">Office Supplies (456 vendors)</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Consolidation Target</span>
                <span className="font-semibold">5-10 preferred vendors</span>
              </div>
            </div>
          </div>

          {/* P-Card Implementation Strategy */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-teal-600 font-bold">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">P-Card Implementation Strategy</h3>
            </div>
            <div className="h-64">
              <Doughnut data={pCardData} options={doughnutOptions} />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phase 1 Target</span>
                <span className="text-teal-600 font-semibold">$15.8M (Under $2,500)</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Processing Savings</span>
                <span className="font-semibold">$3.5M annually</span>
              </div>
            </div>
          </div>

          {/* Volume Discount Opportunities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Volume Discount Opportunities</h3>
            </div>
            <div className="h-64">
              <Bar data={volumeDiscountData} options={chartOptions} />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tier 1 Discount</span>
                <span className="text-green-600 font-semibold">15-20% (>$100K)</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Strategic Partnership</span>
                <span className="font-semibold">25-30% (>$500K)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              💡 Strategic Procurement Optimization Summary
            </h3>
            <p className="text-gray-600 mb-6 max-w-4xl mx-auto">
              This analysis identifies $25-50M in realistic savings potential through strategic consolidation, 
              P-Card implementation, and volume discount negotiations across your tail spend portfolio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">$15-25M</div>
                <div className="text-sm text-gray-600">Vendor Consolidation</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-teal-600">$3-8M</div>
                <div className="text-sm text-gray-600">P-Card Processing</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">$7-17M</div>
                <div className="text-sm text-gray-600">Volume Discounts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;