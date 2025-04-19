"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SaveResultButton from "./SaveResultButton";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [climate, setClimate] = useState("moderate");
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const activityLevels = {
    sedentary: { label: "Sedentary", factor: 30, description: "Little or no exercise" },
    light: { label: "Lightly Active", factor: 35, description: "Light exercise 1-3 times/week" },
    moderate: { label: "Moderately Active", factor: 40, description: "Moderate exercise 3-5 times/week" },
    active: { label: "Very Active", factor: 45, description: "Hard exercise 6-7 times/week" },
    athlete: { label: "Athlete", factor: 50, description: "Professional athlete or very intense training" }
  };

  const climateFactors = {
    cold: { label: "Cold", factor: 0.9, description: "Below 10°C/50°F" },
    moderate: { label: "Moderate", factor: 1.0, description: "10-25°C/50-77°F" },
    warm: { label: "Warm", factor: 1.1, description: "26-35°C/79-95°F" },
    hot: { label: "Hot", factor: 1.2, description: "Above 35°C/95°F" }
  };

  const calculateWaterIntake = () => {
    if (!weight) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      let weightInKg = parseFloat(weight);
      if (unit === "imperial") {
        weightInKg = parseFloat(weight) * 0.453592;
      }

      const baseIntake = weightInKg * activityLevels[activityLevel as keyof typeof activityLevels].factor;
      const adjustedIntake = baseIntake * climateFactors[climate as keyof typeof climateFactors].factor;
      
      setWaterIntake(Math.round(adjustedIntake));
      setIsCalculating(false);
    }, 800);
  };

  const getWaterDistributionData = () => {
    if (!waterIntake) return null;

    const hourlyIntake = Math.round(waterIntake / 8);
    return {
      labels: ['Morning', 'Mid-Morning', 'Lunch', 'Afternoon', 'Evening', 'Night'],
      datasets: [
        {
          label: 'Recommended Water Intake (ml)',
          data: [
            Math.round(waterIntake * 0.2),  // Morning (20%)
            Math.round(waterIntake * 0.15), // Mid-Morning (15%)
            Math.round(waterIntake * 0.25), // Lunch (25%)
            Math.round(waterIntake * 0.15), // Afternoon (15%)
            Math.round(waterIntake * 0.15), // Evening (15%)
            Math.round(waterIntake * 0.1),  // Night (10%)
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.2)',
            'rgba(16, 185, 129, 0.2)',
            'rgba(245, 158, 11, 0.2)',
            'rgba(249, 115, 22, 0.2)',
            'rgba(99, 102, 241, 0.2)',
            'rgba(139, 92, 246, 0.2)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(99, 102, 241, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Water Intake (ml)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time of Day',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${value} ml (${Math.round(value / 250)} glasses)`;
          }
        }
      }
    }
  };

  const handleReset = () => {
    setWeight("");
    setWaterIntake(null);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Water Intake Calculator
        </motion.h2>
        
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-4xl mx-auto"
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
                Metric (kg)
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
                Imperial (lbs)
              </motion.button>
            </motion.div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {Object.entries(activityLevels).map(([key, { label, description }]) => (
                  <option key={key} value={key}>
                    {label} - {description}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Climate
              </label>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {Object.entries(climateFactors).map(([key, { label, description }]) => (
                  <option key={key} value={key}>
                    {label} - {description}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateWaterIntake}
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
              ) : 'Calculate Water Intake'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="btn-secondary py-3 px-10 rounded-xl text-base font-medium"
            >
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {waterIntake !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="w-screen -mx-8 md:-mx-12 lg:-mx-16 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border-y border-blue-100"
            >
              <div className="max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Daily Water Intake</h3>
                
                {/* Main Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Water Intake Card */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-7xl sm:text-8xl font-bold mb-2 text-blue-600">
                          {waterIntake}
                          <span className="text-3xl text-blue-400 ml-2">ml</span>
                        </div>
                        <div className="text-2xl font-semibold text-blue-600">
                          {Math.round(waterIntake / 250)} glasses
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Activity Level</div>
                            <div className="text-lg text-blue-700">
                              {activityLevels[activityLevel as keyof typeof activityLevels].label}
                            </div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Climate</div>
                            <div className="text-lg text-blue-700">
                              {climateFactors[climate as keyof typeof climateFactors].label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distribution Chart Card */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Daily Distribution</h4>
                    <div className="h-[400px] w-full">
                      <Bar options={chartOptions} data={getWaterDistributionData()} />
                    </div>
                  </div>
                </div>

                {/* Information Section */}
                <div className="mt-8 text-sm text-gray-600">
                  <p className="mb-4">
                    This calculation is based on your weight, activity level, and climate. The recommended intake is distributed throughout the day
                    to maintain optimal hydration. Remember to drink water regularly, even before feeling thirsty.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Tip:</strong> Keep a water bottle with you and set reminders to drink water regularly. Your needs may vary based on
                      various factors including diet, health conditions, and medication. Consult with a healthcare provider for personalized advice.
                    </p>
                  </div>
                </div>

                {/* Save Results Button */}
                <div className="mt-8 text-center">
                  <SaveResultButton
                    recordType="water"
                    value={waterIntake}
                    disabled={!waterIntake}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WaterIntakeCalculator; 