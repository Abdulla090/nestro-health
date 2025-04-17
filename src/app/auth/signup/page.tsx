"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function SignUp() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Automatically redirect to the create-profile page
    router.push('/create-profile');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Redirecting to name-only profile creation...
          </p>
          <div className="mt-4 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/create-profile" className="text-blue-500 hover:underline">
              Click here if you are not redirected automatically
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 