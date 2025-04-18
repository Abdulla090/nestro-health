"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

// Mock statistics data
const mockStats = {
  bmiDistribution: [
    { category: 'Underweight', count: 15, percentage: 12, color: '#60A5FA' },
    { category: 'Normal', count: 78, percentage: 60, color: '#34D399' },
    { category: 'Overweight', count: 25, percentage: 19, color: '#FBBF24' },
    { category: 'Obese', count: 11, percentage: 9, color: '#F87171' },
  ],
  bloodPressureDistribution: [
    { category: 'Normal', count: 82, percentage: 64, color: '#34D399' },
    { category: 'Elevated', count: 19, percentage: 15, color: '#FBBF24' },
    { category: 'Hypertension Stage 1', count: 16, percentage: 12, color: '#F87171' },
    { category: 'Hypertension Stage 2', count: 10, percentage: 8, color: '#EF4444' },
    { category: 'Hypertensive Crisis', count: 2, percentage: 1, color: '#B91C1C' },
  ],
  bodyFatDistribution: [
    { category: 'Essential Fat', count: 5, percentage: 4, color: '#60A5FA' },
    { category: 'Athletes', count: 18, percentage: 14, color: '#34D399' },
    { category: 'Fitness', count: 42, percentage: 33, color: '#A3E635' },
    { category: 'Average', count: 45, percentage: 35, color: '#FBBF24' },
    { category: 'Obese', count: 18, percentage: 14, color: '#F87171' },
  ],
  recordsByMonth: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 145 },
    { month: 'Mar', count: 165 },
    { month: 'Apr', count: 140 },
    { month: 'May', count: 185 },
    { month: 'Jun', count: 210 },
  ],
  recordsByType: [
    { type: 'BMI', count: 245, color: '#60A5FA' },
    { type: 'Blood Pressure', count: 183, color: '#F87171' },
    { type: 'Body Fat', count: 132, color: '#A78BFA' },
    { type: 'Water Intake', count: 167, color: '#22D3EE' },
    { type: 'Calories', count: 119, color: '#FB923C' },
    { type: 'Weight', count: 153, color: '#818CF8' },
  ],
  ageDistribution: [
    { range: '18-24', count: 32, percentage: 25 },
    { range: '25-34', count: 48, percentage: 38 },
    { range: '35-44', count: 26, percentage: 20 },
    { range: '45-54', count: 15, percentage: 12 },
    { range: '55+', count: 7, percentage: 5 },
  ],
  topHealthStats: [
    { label: 'Average BMI', value: 24.3, trend: 'stable', unit: '' },
    { label: 'Average Blood Pressure', value: '123/79', trend: 'improving', unit: 'mmHg' },
    { label: 'Average Body Fat', value: 21.8, trend: 'worsening', unit: '%' },
    { label: 'Average Daily Water', value: 2250, trend: 'improving', unit: 'ml' },
    { label: 'Average Daily Calories', value: 2150, trend: 'stable', unit: 'kcal' },
  ],
};

export default function StatisticsPage() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bmi' | 'bloodPressure' | 'bodyFat'>('overview');

  useEffect(() => {
    // Simulate API call to fetch statistics
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Helper function to render a trend indicator
  const renderTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'improving':
        return (
          <span className="inline-flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Improving
          </span>
        );
      case 'worsening':
        return (
          <span className="inline-flex items-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Decreasing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
            Stable
          </span>
        );
    }
  };

  // Calculate total for record types
  const totalRecords = stats.recordsByType.reduce((acc, record) => acc + record.count, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Health Statistics</h1>
        <p className="text-gray-600">View aggregated health metrics and trends</p>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bmi')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'bmi'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            BMI Distribution
          </button>
          <button
            onClick={() => setActiveTab('bloodPressure')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'bloodPressure'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setActiveTab('bodyFat')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'bodyFat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Body Fat
          </button>
        </div>
      </div>

      {/* Main content based on the active tab */}
      {activeTab === 'overview' && (
        <>
          {/* Top stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {stats.topHealthStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.label}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {stat.value}
                    <span className="text-gray-500 text-sm ml-1">{stat.unit}</span>
                  </span>
                </div>
                <div className="mt-3 text-xs">
                  {renderTrendIndicator(stat.trend)}
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Records Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-gray-800 font-semibold text-lg mb-6">Health Records by Month</h3>
            <div className="h-60 flex items-end justify-between">
              {stats.recordsByMonth.map((month) => {
                const maxHeight = Math.max(...stats.recordsByMonth.map(d => d.count));
                const height = (month.count / maxHeight) * 100;
                
                return (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-3/4 rounded-t bg-blue-500"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Records by Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">Records by Type</h3>
              <div className="relative">
                {/* Donut chart - simplified representation */}
                <div className="flex flex-wrap">
                  {stats.recordsByType.map((record, index) => (
                    <div key={index} className="w-1/2 mb-4 pr-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: record.color }}
                        ></div>
                        <div className="text-sm text-gray-700">{record.type}</div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(record.count / totalRecords) * 100}%`,
                              backgroundColor: record.color 
                            }} 
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {record.count} records ({Math.round((record.count / totalRecords) * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">Age Distribution</h3>
              <div className="space-y-4">
                {stats.ageDistribution.map((age) => (
                  <div key={age.range} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{age.range}</span>
                      <span className="text-sm text-gray-700">{age.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-indigo-500" 
                        style={{ width: `${age.percentage}%` }} 
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bmi' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-6">BMI Distribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <h4 className="text-gray-600 font-medium mb-4">Distribution</h4>
                {stats.bmiDistribution.map((item) => (
                  <div key={item.category} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-700">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }} 
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-600 font-medium mb-4">BMI Categories</h4>
              <div className="overflow-hidden bg-gray-50 rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BMI Range
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Underweight</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Below 18.5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.bmiDistribution[0].count}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Normal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.5 - 24.9</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.bmiDistribution[1].count}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Overweight</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25.0 - 29.9</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.bmiDistribution[2].count}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Obese</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30.0 and Above</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.bmiDistribution[3].count}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bloodPressure' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-6">Blood Pressure Distribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <h4 className="text-gray-600 font-medium mb-4">Distribution</h4>
                {stats.bloodPressureDistribution.map((item) => (
                  <div key={item.category} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-700">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }} 
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-600 font-medium mb-4">Blood Pressure Categories</h4>
              <div className="overflow-hidden bg-gray-50 rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Systolic
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diastolic
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Normal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Less than 120</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Less than 80</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Elevated</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120-129</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Less than 80</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stage 1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">130-139</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">80-89</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stage 2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">140 or higher</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90 or higher</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Crisis</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Higher than 180</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Higher than 120</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bodyFat' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-6">Body Fat Percentage Distribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <h4 className="text-gray-600 font-medium mb-4">Distribution</h4>
                {stats.bodyFatDistribution.map((item) => (
                  <div key={item.category} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-700">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }} 
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-600 font-medium mb-4">Body Fat Categories</h4>
              <div className="overflow-hidden bg-gray-50 rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Men
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Women
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Essential Fat</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2-5%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10-13%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Athletes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6-13%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14-20%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fitness</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14-17%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21-24%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18-24%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25-31%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Obese</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25%+</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32%+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 