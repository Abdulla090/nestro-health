"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BoneMassCalculator from '@/components/BoneMassCalculator';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function BoneMassPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bone Mass Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your estimated bone mass based on your height, weight, and gender using scientific formulas.
          </p>
        </motion.div>
        
        <BoneMassCalculator />
      </div>
    </div>
  );
} 