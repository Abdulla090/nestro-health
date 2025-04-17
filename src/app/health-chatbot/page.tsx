import React from 'react';
import HealthChatbot from '@/components/HealthChatbot';

export default function HealthChatbotPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Health Assistant</h1>
      <div className="max-w-4xl mx-auto">
        <HealthChatbot />
      </div>
    </div>
  );
} 