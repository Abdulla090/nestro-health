"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { t } = useLanguage();

  // Only show Kurdish
  return (
    <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-blue-100">
      <span>{t('language.kurdish')}</span>
    </div>
  );
};

export default LanguageSwitcher; 