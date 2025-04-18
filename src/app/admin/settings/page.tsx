"use client";

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function SettingsPage() {
  // General settings
  const [siteName, setSiteName] = useState('Nestro Health');
  const [siteDescription, setSiteDescription] = useState('Complete health tracking platform');
  const [adminEmail, setAdminEmail] = useState('admin@nestrohealth.com');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [userRegistrationNotification, setUserRegistrationNotification] = useState(true);
  const [dataExportNotification, setDataExportNotification] = useState(true);
  
  // Data retention settings
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('365');
  const [automaticBackup, setAutomaticBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  
  // Handle form submission
  const saveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to save the settings
    alert('General settings saved!');
  };
  
  const saveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to save the settings
    alert('Notification settings saved!');
  };
  
  const saveDataSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to save the settings
    alert('Data settings saved!');
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-600">Configure your application settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={saveGeneralSettings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <input
                  type="text"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save General Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notification Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={saveNotificationSettings}>
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable Email Notifications
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Send email notifications for important system events
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="userRegistrationNotification"
                  type="checkbox"
                  checked={userRegistrationNotification}
                  onChange={(e) => setUserRegistrationNotification(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="userRegistrationNotification" className="ml-2 block text-sm text-gray-700">
                  New User Registration Notifications
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Receive notifications when new users register
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="dataExportNotification"
                  type="checkbox"
                  checked={dataExportNotification}
                  onChange={(e) => setDataExportNotification(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="dataExportNotification" className="ml-2 block text-sm text-gray-700">
                  Data Export Notifications
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Receive notifications when users export their data
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Notification Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Data Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={saveDataSettings}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period (Days)
              </label>
              <input
                type="number"
                value={dataRetentionPeriod}
                onChange={(e) => setDataRetentionPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Number of days to keep user health records (0 = indefinitely)
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="automaticBackup"
                  type="checkbox"
                  checked={automaticBackup}
                  onChange={(e) => setAutomaticBackup(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="automaticBackup" className="ml-2 block text-sm text-gray-700">
                  Enable Automatic Backups
                </label>
              </div>
            </div>
            
            {automaticBackup && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Download Database Backup
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Data Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 