"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BloodVolumeCalculator from '@/components/BloodVolumeCalculator';

export default function BloodVolumePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blood Volume Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your blood volume and total body water based on your height, weight, age, and gender using standard medical formulas.
            </p>
          </motion.div>

          <BloodVolumeCalculator />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Blood Volume</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  Blood volume is the total amount of blood present in your circulatory system. It consists of two main components:
                </p>
                <ul>
                  <li>Plasma (about 55% of blood volume)</li>
                  <li>Red blood cells (about 45% of blood volume)</li>
                </ul>
                <p>
                  Total body water, on the other hand, makes up about:
                </p>
                <ul>
                  <li>60% of total body weight in adult males</li>
                  <li>50% of total body weight in adult females</li>
                </ul>
                <p>
                  This calculator uses two well-established formulas:
                </p>
                <ul>
                  <li>Nadler's formula (1962) for blood volume calculation</li>
                  <li>Watson's formula (1980) for total body water estimation</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Note: These calculations provide estimates based on standard formulas. Individual values may vary based on factors such as fitness level, medical conditions, and other physiological variables.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 