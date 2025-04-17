"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createHealthRecord } from '@/lib/supabase';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SaveResultButtonProps {
  recordType: 'bmi' | 'calories' | 'weight' | 'water' | 'blood_pressure' | 'body_fat';
  value: number;
  value2?: number; // For blood pressure (systolic/diastolic)
  disabled?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export default function SaveResultButton({
  recordType,
  value,
  value2,
  disabled = false,
  onSuccess,
  className = ''
}: SaveResultButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleSave = async () => {
    if (!profile) {
      toast.error("You need to be signed in to save results");
      router.push('/auth/signin');
      return;
    }

    setIsSaving(true);

    try {
      const record = {
        user_id: profile.id,
        record_type: recordType,
        record_date: new Date().toISOString(),
        record_value: value,
        record_value_2: value2,
      };

      const { error } = await createHealthRecord(record);

      if (error) {
        console.error('Error saving result:', error);
        toast.error("Failed to save your result");
      } else {
        toast.success("Your result has been saved to your profile");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Error in save operation:', err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={disabled || isSaving || !profile}
      className={`inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save to Profile
        </>
      )}
    </button>
  );
} 