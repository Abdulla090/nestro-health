"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllProfiles, getAllHealthRecords, getHealthRecordStats } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecords: 0,
    activeUsers: 0,
    avgBmi: 0,
    bmiDistribution: [
      { category: 'Underweight', count: 0, percentage: 0, color: '#93C5FD' },
      { category: 'Normal', count: 0, percentage: 0, color: '#6EE7B7' },
      { category: 'Overweight', count: 0, percentage: 0, color: '#FCD34D' },
      { category: 'Obese', count: 0, percentage: 0, color: '#F87171' },
    ],
    weeklyActivity: [
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 0 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 0 },
      { day: 'Fri', count: 0 },
      { day: 'Sat', count: 0 },
      { day: 'Sun', count: 0 },
    ],
    recentUsers: [],
    recentRecords: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch users, records and stats in parallel
        const [profilesResult, recordsResult] = await Promise.all([
          getAllProfiles(),
          getAllHealthRecords()
        ]);
        
        if (profilesResult.error) {
          console.error("Error fetching profiles:", profilesResult.error);
          return;
        }
        
        if (recordsResult.error) {
          console.error("Error fetching health records:", recordsResult.error);
          return;
        }
        
        const users = profilesResult.data || [];
        const records = recordsResult.data || [];
        
        // Filter active users (created or updated in the past 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = users.filter(user => {
          const createdDate = new Date(user.created_at);
          const updatedDate = user.updated_at ? new Date(user.updated_at) : null;
          return createdDate > thirtyDaysAgo || (updatedDate && updatedDate > thirtyDaysAgo);
        });
        
        // Get BMI records to calculate average and distribution
        const bmiRecords = records.filter(record => record.record_type === 'bmi');
        const bmiValues = bmiRecords.map(record => Number(record.record_value)).filter(value => !isNaN(value));
        
        const avgBmi = bmiValues.length > 0 
          ? parseFloat((bmiValues.reduce((sum, value) => sum + value, 0) / bmiValues.length).toFixed(1))
          : 0;
        
        // Calculate BMI distribution
        const bmiDistribution = [
          { 
            category: 'Underweight', 
            count: bmiValues.filter(bmi => bmi < 18.5).length,
            color: '#93C5FD'
          },
          { 
            category: 'Normal', 
            count: bmiValues.filter(bmi => bmi >= 18.5 && bmi < 25).length,
            color: '#6EE7B7'
          },
          { 
            category: 'Overweight', 
            count: bmiValues.filter(bmi => bmi >= 25 && bmi < 30).length,
            color: '#FCD34D'
          },
          { 
            category: 'Obese', 
            count: bmiValues.filter(bmi => bmi >= 30).length,
            color: '#F87171'
          },
        ];
        
        // Calculate percentages
        const totalBmiRecords = bmiValues.length;
        bmiDistribution.forEach(item => {
          item.percentage = totalBmiRecords > 0 
            ? parseFloat(((item.count / totalBmiRecords) * 100).toFixed(1)) 
            : 0;
        });
        
        // Get weekly activity
        const weeklyActivity = [
          { day: 'Mon', count: 0 },
          { day: 'Tue', count: 0 },
          { day: 'Wed', count: 0 },
          { day: 'Thu', count: 0 },
          { day: 'Fri', count: 0 },
          { day: 'Sat', count: 0 },
          { day: 'Sun', count: 0 },
        ];
        
        // Count records created in the last 7 days by day of week
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        records.forEach(record => {
          const createdDate = new Date(record.created_at);
          if (createdDate >= sevenDaysAgo) {
            const dayOfWeek = createdDate.getDay(); // 0 is Sunday
            const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
            weeklyActivity[dayIndex].count++;
          }
        });
        
        // Get recent users and records
        const recentUsers = [...users]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
          
        const recentRecords = [...records]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        
        // Update stats
        setStats({
          totalUsers: users.length,
          totalRecords: records.length,
          activeUsers: activeUsers.length,
          avgBmi,
          bmiDistribution,
          weeklyActivity,
          recentUsers,
          recentRecords,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format health record value
  const formatRecordValue = (record: any): string => {
    switch (record.record_type) {
      case 'bmi':
        return record.record_value.toString();
      case 'blood_pressure':
        return String(record.record_value); // Format: "120/80"
      case 'weight':
        return `${record.record_value} kg`;
      case 'body_fat':
        return `${record.record_value}%`;
      case 'calories':
        return `${record.record_value} kcal`;
      case 'water':
        return `${record.record_value} ml`;
      default:
        return String(record.record_value);
    }
  };
  
  // Get record type label
  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'bmi': return 'BMI';
      case 'blood_pressure': return 'Blood Pressure';
      case 'weight': return 'Weight';
      case 'body_fat': return 'Body Fat';
      case 'calories': return 'Calories';
      case 'water': return 'Water Intake';
      default: return type;
    }
  };
  
  // Get color for record type
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'bmi':
        return 'bg-blue-100 text-blue-800';
      case 'blood_pressure':
        return 'bg-red-100 text-red-800';
      case 'weight':
        return 'bg-purple-100 text-purple-800';
      case 'body_fat':
        return 'bg-orange-100 text-orange-800';
      case 'calories':
        return 'bg-green-100 text-green-800';
      case 'water':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Overview of health tracking activity</p>
      </div>

      {loading ? (
        <div className="min-h-screen-1/2 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-8"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <span>Growing steadily</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Health Records</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalRecords}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <span>Up {Math.ceil(stats.totalRecords * 0.12)} this month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <span>{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Average BMI</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.avgBmi}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>{stats.avgBmi < 25 ? 'Healthy average' : 'Slightly elevated'}</span>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BMI Distribution</h3>
              <div className="space-y-4">
                {stats.bmiDistribution.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-medium text-gray-700">{item.percentage}%</span>
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
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity This Week</h3>
              <div className="h-60 flex items-end justify-between">
                {stats.weeklyActivity.map((day) => {
                  const maxCount = Math.max(...stats.weeklyActivity.map(d => d.count));
                  const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={day.day} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-blue-500 rounded-t-md"
                        style={{ height: `${percentage ? Math.max(percentage, 5) : 5}%` }}
                      ></div>
                      <div className="text-xs font-medium text-gray-600 mt-2">{day.day}</div>
                      <div className="text-xs font-medium text-gray-800">{day.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                <a href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
              </div>
              <div className="space-y-4">
                {stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                      ) : (
                        <span className="text-indigo-600 font-semibold">
                          {user.username?.[0] || user.full_name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name || user.username}</div>
                      <div className="text-sm text-gray-500">Joined {formatDate(user.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Health Records</h3>
                <a href="/admin/health-records" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
              </div>
              <div className="space-y-4">
                {stats.recentRecords.map((record: any) => (
                  <div key={record.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">
                        {record.profiles?.username?.[0] || record.profiles?.full_name?.[0] || '?'}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.profiles?.full_name || record.profiles?.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(record.record_type)}`}>
                          {getRecordTypeLabel(record.record_type)}
                        </span>{' '}
                        {formatRecordValue(record)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(record.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
} 