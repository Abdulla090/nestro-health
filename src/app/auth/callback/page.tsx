"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function AuthCallback() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { t } = useLanguage();
  
  useEffect(() => {
    // Process the magic link
    const handleMagicLinkRedirect = async () => {
      try {
        setMessage(t('auth.processingLink'));
        
        // Get the URL hash for the auth session
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Success, redirect to profile
        setMessage(t('auth.loginSuccess'));
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } catch (err: any) {
        console.error('Magic link error:', err);
        setMessage(t('auth.linkError'));
        
        // Redirect back to login after a timeout
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    };
    
    handleMagicLinkRedirect();
  }, [router, t]);
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t('auth.authenticating')}</h2>
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
} 