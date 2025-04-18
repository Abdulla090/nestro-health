"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { t } = useLanguage();
  const { profile, loading, createProfile, loadProfileByName } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);

  // Departments
  const departments = [
    { value: "", label: "Select Department" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Law", label: "Law" },
    { value: "Medicine", label: "Medicine" },
    { value: "Engineering", label: "Engineering" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "Nature", label: "Nature" },
    { value: "Geology", label: "Geology" }
  ];

  // Stages
  const stages = [
    { value: "", label: "Select Stage" },
    { value: "First", label: "First" },
    { value: "Second", label: "Second" },
    { value: "Third", label: "Third" },
    { value: "Fourth", label: "Fourth" },
    { value: "Fifth", label: "Fifth" },
    { value: "Sixth", label: "Sixth" }
  ];

  // Load saved profile names from localStorage
  React.useEffect(() => {
    if (isOpen) {
      const profilesJson = localStorage.getItem('savedProfileNames');
      if (profilesJson) {
        try {
          const profiles = JSON.parse(profilesJson);
          if (Array.isArray(profiles)) {
            setSavedProfiles(profiles);
          }
        } catch (e) {
          console.error('Error parsing saved profiles:', e);
        }
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Creating profile with name:', name);
    
    if (!name.trim()) {
      setError(t('auth.nameRequired') || 'Name is required');
      return;
    }

    if (!department) {
      setError('Department is required');
      return;
    }

    if (!stage) {
      setError('Stage is required');
      return;
    }
    
    try {
      setIsCreating(true);
      console.log('Calling createProfile function...');
      const { success, error } = await createProfile(name, department, stage);
      console.log('Profile creation result:', { success, error });
      
      if (!success) {
        setError(error?.message || 'Failed to create profile');
        return;
      }
      
      // Save name to localStorage for future use
      const updatedProfiles = [...savedProfiles];
      if (!updatedProfiles.includes(name)) {
        updatedProfiles.push(name);
        localStorage.setItem('savedProfileNames', JSON.stringify(updatedProfiles));
      }
      
      // Close modal and redirect to profile page
      console.log('Redirecting to profile page...');
      onClose();
      // Using direct window navigation instead of router for more reliable redirect
      setTimeout(() => {
        console.log('Navigating to /profile via window.location');
        window.location.href = '/profile';
      }, 100);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadProfile = async (profileName: string) => {
    try {
      setError('');
      setIsCreating(true);
      const { success, error } = await loadProfileByName(profileName);
      
      if (!success) {
        setError(error?.message || 'Failed to load profile');
        return;
      }
      
      // Close modal and redirect to profile page
      onClose();
      // Using direct window navigation instead of router for more reliable redirect
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.createProfile') || 'Create Profile'}
          </h2>
          <p className="text-sm text-gray-600">
            {t('auth.enterName') || 'Please enter your information to create a profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.name') || 'Name'}
            </label>
            <input
              id="modal-name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('auth.name') || 'Your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              name="department"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
              Stage
            </label>
            <select
              id="stage"
              name="stage"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              {stages.map((stg) => (
                <option key={stg.value} value={stg.value}>
                  {stg.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.creatingProfile') || 'Creating...'}
                </span>
              ) : (
                t('auth.createButton') || 'Create Profile'
              )}
            </button>
          </div>
        </form>
        
        {savedProfiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-center text-lg font-medium text-gray-900 mb-4">
              {t('auth.loadProfile') || 'Load Existing Profile'}
            </h3>
            <div className="space-y-2">
              {savedProfiles.map((profileName) => (
                <button
                  key={profileName}
                  onClick={() => handleLoadProfile(profileName)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {profileName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal; 