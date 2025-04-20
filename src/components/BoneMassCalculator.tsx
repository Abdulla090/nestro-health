"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SaveResultButton from './SaveResultButton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const BoneMassCalculator = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('30');
  const [boneMass, setBoneMass] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isMetric, setIsMetric] = useState<boolean>(true);

  // Reference bone mass ranges by age and gender
  const boneReferenceData = {
    male: {
      '20-29': { low: 2.5, avg: 3.0, high: 3.5 },
      '30-39': { low: 2.4, avg: 2.9, high: 3.4 },
      '40-49': { low: 2.3, avg: 2.8, high: 3.3 },
      '50-59': { low: 2.2, avg: 2.7, high: 3.2 },
      '60+': { low: 2.1, avg: 2.6, high: 3.1 }
    },
    female: {
      '20-29': { low: 2.0, avg: 2.5, high: 3.0 },
      '30-39': { low: 1.9, avg: 2.4, high: 2.9 },
      '40-49': { low: 1.8, avg: 2.3, high: 2.8 },
      '50-59': { low: 1.7, avg: 2.2, high: 2.7 },
      '60+': { low: 1.6, avg: 2.1, high: 2.6 }
    }
  };

  const getAgeRange = (age: number): string => {
    if (age < 30) return '20-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    if (age < 60) return '50-59';
    return '60+';
  };

  const calculateBoneMass = () => {
    if (!weight || !height) return;

    // Convert to metric if needed
    const weightKg = isMetric ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    const heightCm = isMetric ? parseFloat(height) : parseFloat(height) * 2.54;
    
    // Calculate bone mass using the formula: Bone Mass (kg) = 0.022 × Weight (kg) + 0.04 × Height (cm) - 3.8
    // Apply a slight gender modification (5% more for males, as they typically have higher bone density)
    let calculatedBoneMass = 0.022 * weightKg + 0.04 * heightCm - 3.8;
    
    // Apply gender adjustment
    if (gender === 'male') {
      calculatedBoneMass *= 1.05;
    }
    
    // Ensure bone mass is not negative
    calculatedBoneMass = Math.max(calculatedBoneMass, 0);
    
    setBoneMass(calculatedBoneMass);
    setShowResults(true);
  };

  const getBoneCategory = (mass: number, weightKg: number) => {
    // Bone mass as percentage of total body weight
    const percentage = (mass / weightKg) * 100;
    
    if (gender === 'male') {
      if (percentage < 2.5) return "Below Average";
      if (percentage <= 3.2) return "Average";
      return "Above Average";
    } else {
      if (percentage < 2.1) return "Below Average";
      if (percentage <= 2.8) return "Average";
      return "Above Average";
    }
  };

  const getBoneMassPercentage = (mass: number, weightKg: number) => {
    return (mass / weightKg) * 100;
  };

  const getGaugeData = (percentage: number) => {
    const ageRange = getAgeRange(parseInt(age));
    const referenceData = boneReferenceData[gender as 'male' | 'female'][ageRange as keyof typeof boneReferenceData['male']];
    
    // Create gauge segments
    return [
      { name: 'Below', value: referenceData.low, color: '#FFBB28' },
      { name: 'Average', value: referenceData.avg - referenceData.low, color: '#00C49F' },
      { name: 'Above', value: referenceData.high - referenceData.avg, color: '#0088FE' },
      // Add marker for current user's value
      { name: 'User', value: percentage, color: '#FF0000', isMarker: true }
    ];
  };

  const getComparisonChartData = () => {
    if (!boneMass || !weight) return [];
    
    const userPercentage = getBoneMassPercentage(boneMass, isMetric ? parseFloat(weight) : parseFloat(weight) * 0.453592);
    const ageRange = getAgeRange(parseInt(age));
    const referenceData = boneReferenceData[gender as 'male' | 'female'][ageRange as keyof typeof boneReferenceData['male']];
    
    return [
      { name: 'Your Bone Mass', value: userPercentage.toFixed(1), fill: '#8884d8' },
      { name: 'Low Range', value: referenceData.low.toFixed(1), fill: '#FFBB28' },
      { name: 'Average', value: referenceData.avg.toFixed(1), fill: '#00C49F' },
      { name: 'High Range', value: referenceData.high.toFixed(1), fill: '#0088FE' }
    ];
  };

  const getReferenceTableData = () => {
    const tableData = [];
    
    for (const ageRange in boneReferenceData.male) {
      tableData.push({
        ageRange,
        maleLow: boneReferenceData.male[ageRange as keyof typeof boneReferenceData.male].low,
        maleAvg: boneReferenceData.male[ageRange as keyof typeof boneReferenceData.male].avg,
        maleHigh: boneReferenceData.male[ageRange as keyof typeof boneReferenceData.male].high,
        femaleLow: boneReferenceData.female[ageRange as keyof typeof boneReferenceData.female].low,
        femaleAvg: boneReferenceData.female[ageRange as keyof typeof boneReferenceData.female].avg,
        femaleHigh: boneReferenceData.female[ageRange as keyof typeof boneReferenceData.female].high,
      });
    }
    
    return tableData;
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setGender('male');
    setAge('30');
    setBoneMass(null);
    setShowResults(false);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value < 120) {
      setAge(e.target.value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Bone Mass Calculator</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            Calculate your estimated bone mass based on your weight, height, and gender. 
            Bone mass is an important indicator of skeletal health and strength.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Units:</span>
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${isMetric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg`}
                  onClick={() => setIsMetric(true)}
                >
                  Metric
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${!isMetric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg`}
                  onClick={() => setIsMetric(false)}
                >
                  Imperial
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">
                Weight ({isMetric ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={isMetric ? '70' : '154'}
                className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">
                Height ({isMetric ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={isMetric ? '170' : '67'}
                className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleAgeChange}
                min="18"
                max="120"
                className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 text-sm font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg`}
                  onClick={() => setGender('male')}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 text-sm font-medium ${gender === 'female' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg`}
                  onClick={() => setGender('female')}
                >
                  Female
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={calculateBoneMass}
                disabled={!weight || !height}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calculate
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
          
          {/* Results section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {showResults && boneMass !== null ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <h3 className="text-xl font-bold mb-4 text-center">Your Results</h3>
                  
                  <div className="flex justify-center mb-6">
                    <div className="text-center bg-blue-50 px-8 py-6 rounded-full">
                      <div className="text-4xl font-bold text-blue-600">{boneMass.toFixed(1)}</div>
                      <div className="text-sm text-gray-500 mt-1">kg</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Bone Mass Category</h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            getBoneCategory(boneMass, isMetric ? parseFloat(weight) : parseFloat(weight) * 0.453592) === "Below Average" 
                              ? "bg-yellow-500" 
                              : getBoneCategory(boneMass, isMetric ? parseFloat(weight) : parseFloat(weight) * 0.453592) === "Average" 
                              ? "bg-green-500" 
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <span className="font-medium">
                          {getBoneCategory(boneMass, isMetric ? parseFloat(weight) : parseFloat(weight) * 0.453592)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Visualization */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">How You Compare</h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-3">
                        Your bone mass as a percentage of your body weight compared to the reference ranges for your age and gender:
                      </p>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getComparisonChartData()}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Bone Mass']} />
                            <Bar dataKey="value" name="Percentage of Body Weight">
                              {getComparisonChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reference Table */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Bone Mass Reference Table</h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                      <p className="text-sm text-gray-600 mb-3">
                        Standard bone mass percentages by age group and gender:
                      </p>
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Age Range</th>
                            <th className="px-4 py-2 text-center" colSpan={3}>Male (% of body weight)</th>
                            <th className="px-4 py-2 text-center" colSpan={3}>Female (% of body weight)</th>
                          </tr>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-1"></th>
                            <th className="px-4 py-1 text-center text-xs">Low</th>
                            <th className="px-4 py-1 text-center text-xs">Average</th>
                            <th className="px-4 py-1 text-center text-xs">High</th>
                            <th className="px-4 py-1 text-center text-xs">Low</th>
                            <th className="px-4 py-1 text-center text-xs">Average</th>
                            <th className="px-4 py-1 text-center text-xs">High</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getReferenceTableData().map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2 font-medium">{row.ageRange}</td>
                              <td className="px-4 py-2 text-center">{row.maleLow}%</td>
                              <td className="px-4 py-2 text-center">{row.maleAvg}%</td>
                              <td className="px-4 py-2 text-center">{row.maleHigh}%</td>
                              <td className="px-4 py-2 text-center">{row.femaleLow}%</td>
                              <td className="px-4 py-2 text-center">{row.femaleAvg}%</td>
                              <td className="px-4 py-2 text-center">{row.femaleHigh}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-2">
                        Note: Highlighted row shows your age group. Values are approximate and may vary based on individual factors.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">What This Means</h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-sm">
                      <p className="mb-2">
                        Bone mass refers to the estimated weight of bone mineral in your body. Healthy bones are important for:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Supporting your body structure</li>
                        <li>Protecting vital organs</li>
                        <li>Storing essential minerals</li>
                        <li>Enabling movement and mobility</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Factors Affecting Bone Mass</h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Genetics and family history</li>
                        <li>Age (bone density typically peaks by age 30)</li>
                        <li>Gender (males typically have higher bone mass)</li>
                        <li>Physical activity level</li>
                        <li>Nutrition (especially calcium and vitamin D intake)</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Save to Profile Button */}
                  <div className="mt-6 text-center">
                    <SaveResultButton
                      recordType="bone_mass"
                      value={boneMass}
                      disabled={!boneMass}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8"
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No calculation yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in your details and click "Calculate" to see your estimated bone mass.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BoneMassCalculator; 