"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AuthNav() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Link 
            href="/profile" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {profile?.username || t.nav.profile}
          </Link>
          <button
            onClick={signOut}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {t.nav.signOut}
          </button>
        </>
      ) : (
        <>
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t.nav.signIn}
          </Link>
          <Link 
            href="/auth/signup" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t.nav.signUp}
          </Link>
        </>
      )}
    </div>
  );
} 