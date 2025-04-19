"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllProfiles, getAllHealthRecords, getHealthRecordStats } from '@/lib/supabase';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';

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
  
  // Add filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allRecords, setAllRecords] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      
      try {
        // Fetch data from Supabase
        const users = await getAllProfiles();
        const records = await getAllHealthRecords();
        
        // Ensure we're working with arrays
        const usersArray = Array.isArray(users) ? users : [];
        const recordsArray = Array.isArray(records) ? records : [];
        
        // Store the original data for filtering
        setAllUsers(usersArray);
        setAllRecords(recordsArray);
        
        // Process data and set initial stats as before
        // Calculate active users (users with records in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Calculate active users
        const activeUserIds = new Set();
        recordsArray.forEach(record => {
          const createdDate = new Date(record.created_at);
          if (createdDate >= thirtyDaysAgo) {
            activeUserIds.add(record.user_id || record.profile_id); // handle different column names
          }
        });
        const activeUsers = Array.from(activeUserIds);
        
        // Calculate average BMI from BMI records
        const bmiRecords = recordsArray.filter(record => record.record_type === 'bmi');
        const bmiValues = bmiRecords.map(record => parseFloat(record.record_value));
        const avgBmi = bmiValues.length > 0 
          ? parseFloat((bmiValues.reduce((a, b) => a + b, 0) / bmiValues.length).toFixed(1))
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
        
        recordsArray.forEach(record => {
          const createdDate = new Date(record.created_at);
          if (createdDate >= sevenDaysAgo) {
            const dayOfWeek = createdDate.getDay(); // 0 is Sunday
            const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
            weeklyActivity[dayIndex].count++;
          }
        });
        
        // Get recent users and records
        const recentUsers = [...usersArray]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
          
        const recentRecords = [...recordsArray]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        
        // Update stats
        setStats({
          totalUsers: usersArray.length,
          totalRecords: recordsArray.length,
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

  // Update stats when filters change
  useEffect(() => {
    if (!allUsers || allUsers.length === 0) return; // Skip if data not loaded yet
    
    try {
      // Ensure we're working with arrays
      const usersArray = Array.isArray(allUsers) ? allUsers : [];
      const recordsArray = Array.isArray(allRecords) ? allRecords : [];
      
      // Filter users based on search and filters
      const filteredUsers = usersArray.filter(user => {
        const matchesSearch = searchTerm 
          ? ((user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
             (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        
        const matchesDepartment = departmentFilter === 'all' || 
          user.department === departmentFilter;
        
        const matchesStage = stageFilter === 'all' || 
          user.stage === stageFilter;
        
        return matchesSearch && matchesDepartment && matchesStage;
      });
      
      // Filter records to only include those from filtered users
      const filteredUserIds = new Set(filteredUsers.map(user => user.id));
      const filteredRecords = recordsArray.filter(record => 
        filteredUserIds.has(record.user_id || record.profile_id)
      );
      
      // Calculate active users 
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUserIds = new Set();
      filteredRecords.forEach(record => {
        const createdDate = new Date(record.created_at);
        if (createdDate >= thirtyDaysAgo) {
          activeUserIds.add(record.user_id || record.profile_id);
        }
      });
      const activeUsers = Array.from(activeUserIds);
      
      // Calculate BMI stats
      const bmiRecords = filteredRecords.filter(record => record.record_type === 'bmi');
      const bmiValues = bmiRecords.map(record => parseFloat(record.record_value));
      const avgBmi = bmiValues.length > 0 
        ? parseFloat((bmiValues.reduce((a, b) => a + b, 0) / bmiValues.length).toFixed(1))
        : 0;
      
      // Update BMI distribution
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
      
      filteredRecords.forEach(record => {
        const createdDate = new Date(record.created_at);
        if (createdDate >= sevenDaysAgo) {
          const dayOfWeek = createdDate.getDay(); // 0 is Sunday
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
          weeklyActivity[dayIndex].count++;
        }
      });
      
      // Get recent users from filtered set
      const recentUsers = [...filteredUsers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
        
      const recentRecords = [...filteredRecords]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      // Update stats
      setStats({
        totalUsers: filteredUsers.length,
        totalRecords: filteredRecords.length,
        activeUsers: activeUsers.length,
        avgBmi,
        bmiDistribution,
        weeklyActivity,
        recentUsers,
        recentRecords,
      });
    } catch (error) {
      console.error("Error updating filtered stats:", error);
    }
  }, [searchTerm, departmentFilter, stageFilter, allUsers, allRecords]);

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
      <div className="space-y-6 pr-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of health tracking activity</p>
        </div>

        {/* Add FilterBar */}
        <FilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
          totalCount={allUsers.length}
          filteredCount={stats.totalUsers}
          title="Filter Dashboard"
        />

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <span>
                      {searchTerm || departmentFilter !== 'all' || stageFilter !== 'all' 
                        ? `${Math.round((stats.totalUsers / allUsers.length) * 100)}% of all users` 
                        : 'Growing steadily'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Records */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Health Records</p>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalRecords}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <span>Up {Math.ceil(stats.totalRecords * 0.12)} this month</span>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <span>{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users</span>
                  </div>
                </div>
              </div>

              {/* Average BMI */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average BMI</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgBmi}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <span>{stats.avgBmi < 25 ? 'Healthy average' : 'Slightly elevated'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* BMI Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">BMI Distribution</h3>
                <div className="space-y-4">
                  {stats.bmiDistribution.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm font-medium text-gray-700">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
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

              {/* Weekly Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity This Week</h3>
                <div className="h-[200px] sm:h-[250px] flex items-end justify-between">
                  {stats.weeklyActivity.map((day) => {
                    const maxCount = Math.max(...stats.weeklyActivity.map(d => d.count));
                    const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={day.day} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full max-w-[30px] bg-blue-500 rounded-t-md transition-all duration-500"
                          style={{ height: `${percentage ? Math.max(percentage, 5) : 5}%` }}
                        ></div>
                        <div className="mt-2 text-xs font-medium text-gray-600">{day.day}</div>
                        <div className="text-xs font-medium text-gray-800">{day.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                  <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {stats.recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        {user.avatar_url ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                        ) : (
                          <span className="text-indigo-600 font-semibold">
                            {user.username?.[0] || user.full_name?.[0] || '?'}
                          </span>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.full_name || user.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          Joined {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Health Records */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Health Records</h3>
                  <Link href="/admin/health-records" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {stats.recentRecords.map((record: any) => (
                    <div key={record.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {record.profiles?.username?.[0] || record.profiles?.full_name?.[0] || '?'}
                        </span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {record.profiles?.full_name || record.profiles?.username}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(record.record_type)}`}>
                            {getRecordTypeLabel(record.record_type)}
                          </span>
                          <span className="ml-2">{formatRecordValue(record)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(record.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 