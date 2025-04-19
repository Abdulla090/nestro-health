"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export default function BloodVolumeCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [unit, setUnit] = useState('metric');
  const [results, setResults] = useState<{
    bloodVolume: number;
    plasmaVolume: number;
    redCellVolume: number;
    totalBodyWater: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  const calculateBloodVolume = () => {
    if (!weight || !height || !age) return;
    
    setIsCalculating(true);

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const weightKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
      const heightCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;

      // Blood volume calculation based on Nadler's formula
      let bloodVolume = 0;
      if (gender === 'male') {
        bloodVolume = 0.3669 * Math.pow(heightCm/100, 3) + 0.03219 * weightKg + 0.6041;
      } else {
        bloodVolume = 0.3561 * Math.pow(heightCm/100, 3) + 0.03308 * weightKg + 0.1833;
      }
      bloodVolume = bloodVolume * 1000; // Convert to mL

      // Plasma volume (55% of blood volume)
      const plasmaVolume = bloodVolume * 0.55;
      
      // Red cell volume (45% of blood volume)
      const redCellVolume = bloodVolume * 0.45;

      // Total body water calculation based on Watson's formula
      let totalBodyWater = 0;
      if (gender === 'male') {
        totalBodyWater = 2.447 - (0.09156 * parseFloat(age)) + (0.1074 * heightCm) + (0.3362 * weightKg);
      } else {
        totalBodyWater = -2.097 + (0.1069 * heightCm) + (0.2466 * weightKg);
      }
      totalBodyWater = totalBodyWater * 1000; // Convert to mL

      setResults({
        bloodVolume,
        plasmaVolume,
        redCellVolume,
        totalBodyWater
      });
      setIsCalculating(false);
    }, 800);
  };

  const getBloodCompositionData = () => [
    { name: 'Plasma', value: results?.plasmaVolume || 0 },
    { name: 'Red Blood Cells', value: results?.redCellVolume || 0 }
  ];

  const getWaterDistributionData = () => {
    if (!results) return [];
    const intracellular = results.totalBodyWater * 0.67; // 67% of total body water
    const interstitial = results.totalBodyWater * 0.25; // 25% of total body water
    const plasma = results.totalBodyWater * 0.08; // 8% of total body water

    return [
      { name: 'Intracellular', value: intracellular },
      { name: 'Interstitial', value: interstitial },
      { name: 'Plasma', value: plasma }
    ];
  };

  const getComparisonData = () => {
    if (!results) return [];
    const weightKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    
    return [
      { name: 'Blood Volume', value: results.bloodVolume / 1000, expected: weightKg * (gender === 'male' ? 0.075 : 0.065) },
      { name: 'Total Body Water', value: results.totalBodyWater / 1000, expected: weightKg * (gender === 'male' ? 0.6 : 0.5) }
    ];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Blood Volume & Body Water Calculator
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          {/* Unit Toggle */}
          <div className="flex justify-center mb-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center bg-gray-100 rounded-full p-1"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setUnit('metric')}
                className={`py-2 px-8 rounded-full transition-all ${
                  unit === 'metric' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Metric
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setUnit('imperial')}
                className={`py-2 px-8 rounded-full transition-all ${
                  unit === 'imperial' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Imperial
              </motion.button>
            </motion.div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight Input */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 150'}
              />
            </motion.div>

            {/* Height Input */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
              />
            </motion.div>

            {/* Age Input */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Age (years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 30"
              />
            </motion.div>

            {/* Gender Select */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </motion.div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateBloodVolume}
              disabled={isCalculating}
              className={`btn-primary py-3 px-10 rounded-xl text-base font-medium relative ${
                isCalculating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isCalculating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : 'Calculate'}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Results</h3>
                
                {/* Main Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Blood Volume Card */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Blood Volume</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getBloodCompositionData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {getBloodCompositionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-3xl font-bold text-blue-600">
                        {(results.bloodVolume / 1000).toFixed(2)} L
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Plasma</p>
                          <p className="font-semibold text-blue-500">
                            {(results.plasmaVolume / 1000).toFixed(2)} L
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Red Blood Cells</p>
                          <p className="font-semibold text-red-500">
                            {(results.redCellVolume / 1000).toFixed(2)} L
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Water Card */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Total Body Water</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getWaterDistributionData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {getWaterDistributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-3xl font-bold text-blue-600">
                        {(results.totalBodyWater / 1000).toFixed(2)} L
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {((results.totalBodyWater / (parseFloat(weight) * 1000)) * 100).toFixed(1)}% of body weight
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Comparison with Expected Values</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getComparisonData()} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Your Value" fill="#3B82F6" />
                        <Bar dataKey="expected" name="Expected Value" fill="#9CA3AF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Information Section */}
                <div className="mt-8 text-sm text-gray-600">
                  <p className="mb-2">These calculations are based on:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Nadler's formula (1962) for blood volume</li>
                    <li>Watson's formula (1980) for total body water</li>
                  </ul>
                  <p className="mt-4 text-xs text-gray-500">
                    Note: These are estimates and may vary based on individual factors such as fitness level and medical conditions.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 