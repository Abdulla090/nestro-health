"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllHealthRecords } from '@/lib/supabase';
import FilterBar from '@/components/FilterBar';

type EnhancedHealthRecord = {
  id: string;
  record_type: string;
  record_value: number | string;
  record_value_2?: number;
  record_date: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name?: string;
    department?: string;
    stage?: string;
  };
  status: 'normal' | 'warning' | 'critical';
};

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<EnhancedHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState('desc');
  // Add department and stage filters
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  
  const recordTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "bmi", label: "BMI" },
    { value: "blood_pressure", label: "Blood Pressure" },
    { value: "weight", label: "Weight" },
    { value: "body_fat", label: "Body Fat" },
    { value: "calories", label: "Calories" },
    { value: "water", label: "Water Intake" },
  ];
  
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "normal", label: "Normal" },
    { value: "warning", label: "Warning" },
    { value: "critical", label: "Critical" },
  ];

  useEffect(() => {
    const fetchHealthRecords = async () => {
      setLoading(true);
      try {
        const fetchedRecords = await getAllHealthRecords();
        
        // Ensure we're working with an array
        const recordsArray = Array.isArray(fetchedRecords) ? fetchedRecords : [];
        
        // Process records to add status based on record type and value
        const processedRecords = recordsArray.map(record => {
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          
          // Determine status based on record type and value
          switch(record.record_type) {
            case 'bmi':
              const bmiValue = parseFloat(record.record_value.toString());
              if (bmiValue >= 30) status = 'critical';
              else if (bmiValue >= 25) status = 'warning';
              break;
            case 'blood_pressure':
              if (record.record_value.toString().includes('/')) {
                const [systolic, diastolic] = record.record_value.toString().split('/').map(Number);
                if (systolic >= 140 || diastolic >= 90) status = 'critical';
                else if (systolic >= 130 || diastolic >= 85) status = 'warning';
              }
              break;
            // Add more status determinations for other record types as needed
          }
          
          return {
            ...record,
            status
          } as EnhancedHealthRecord;
        });
        
        setRecords(processedRecords);
      } catch (error) {
        console.error("Failed to fetch health records:", error);
        // Initialize with empty array to prevent errors
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthRecords();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Toggle date sorting
  const toggleDateSort = () => {
    setDateSort(prevSort => prevSort === 'desc' ? 'asc' : 'desc');
  };

  // Format record value based on type
  const formatRecordValue = (record: EnhancedHealthRecord): string => {
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

  // Filter and sort records
  const filteredAndSortedRecords = records
    .filter(record => {
      // Apply search filter (by username or name)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (record.profiles?.username?.toLowerCase().includes(searchLower) ?? false) ||
        (record.profiles?.full_name?.toLowerCase().includes(searchLower) ?? false);
      
      // Apply type filter
      const matchesType = typeFilter === "all" || record.record_type === typeFilter;
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      
      // Apply department filter
      const matchesDepartment = departmentFilter === "all" || record.profiles?.department === departmentFilter;
      
      // Apply stage filter
      const matchesStage = stageFilter === "all" || record.profiles?.stage === stageFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesStage;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.record_date).getTime();
      const dateB = new Date(b.record_date).getTime();
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get record type color
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

  // Get formatted record type label
  const getRecordTypeLabel = (type: string) => {
    const option = recordTypeOptions.find(option => option.value === type);
    return option ? option.label : type;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Health Records</h1>
              <p className="text-gray-600">View and manage health data from users</p>
            </div>
            <div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Export Records
              </button>
            </div>
          </div>

          {/* Use the FilterBar component */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            totalCount={records.length}
            filteredCount={filteredAndSortedRecords.length}
            title="Filter Health Records"
          />

          {/* Additional filters specific to health records */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
                  Record Type
                </label>
                <select
                  id="recordType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {recordTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dateSort" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Order
                </label>
                <button
                  id="dateSort"
                  onClick={toggleDateSort}
                  className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                >
                  <span>{dateSort === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                  <span className="text-lg">
                    {dateSort === 'desc' ? '↓' : '↑'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading health records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedRecords.length > 0 ? (
                    filteredAndSortedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">
                                {record.profiles?.username?.[0] || record.profiles?.full_name?.[0] || '?'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {record.profiles?.full_name || record.profiles?.username}
                              </div>
                              <div className="text-xs text-gray-500">
                                {record.profiles?.department} {record.profiles?.stage && `- ${record.profiles?.stage}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(record.record_type)}`}>
                            {getRecordTypeLabel(record.record_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatRecordValue(record)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.record_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-indigo-600 hover:text-indigo-900 px-2">
                            View
                          </button>
                          <button className="text-red-600 hover:text-red-900 px-2">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                        No health records found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 