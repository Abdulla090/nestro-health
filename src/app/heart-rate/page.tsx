import React from 'react';
import HeartRateCalculator from '@/components/HeartRateCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Heart Rate Zone Calculator | Nestro Health',
  description: 'Calculate your optimal heart rate training zones using the Tanaka formula for maximum accuracy and improved workout efficiency.',
};

export default function HeartRatePage() {
  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Heart Rate Zone Calculator</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Optimize your workouts by training in the right heart rate zones for your specific fitness goals.
          </p>
        </div>
        
        <HeartRateCalculator />
      </div>
    </main>
  );
} 