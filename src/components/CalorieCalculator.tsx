"use client";

import { useState } from "react";
import CalculatorCard from "./CalculatorCard";
import { motion } from "framer-motion";
import { Doughnut, Bar } from "react-chartjs-2";
import SaveResultButton from "./SaveResultButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [unit, setUnit] = useState("metric");
  const [calories, setCalories] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [barData, setBarData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[]
  } | null>(null);

  const activityLevels = {
    sedentary: { label: "Sedentary (little or no exercise)", factor: 1.2 },
    light: { label: "Lightly active (light exercise 1-3 days/week)", factor: 1.375 },
    moderate: { label: "Moderately active (moderate exercise 3-5 days/week)", factor: 1.55 },
    active: { label: "Very active (hard exercise 6-7 days/week)", factor: 1.725 },
    extraActive: { label: "Extra active (very hard exercise & physical job)", factor: 1.9 },
  };

  const calculateCalories = () => {
    if (!age || !height || !weight) return;

    setIsCalculating(true);

    setTimeout(() => {
      let heightInCm = parseFloat(height);
      let weightInKg = parseFloat(weight);

      // Convert imperial to metric if needed
      if (unit === "imperial") {
        heightInCm = parseFloat(height) * 2.54; // inches to cm
        weightInKg = parseFloat(weight) * 0.453592; // lbs to kg
      }

      // Mifflin-St Jeor Equation
      let bmr;
      if (gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseFloat(age) + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseFloat(age) - 161;
      }

      // Apply activity factor
      const activityFactor = activityLevels[activityLevel as keyof typeof activityLevels].factor;
      const dailyCalories = Math.round(bmr * activityFactor);

      setCalories(dailyCalories);
      
      // Set up bar data for macro breakdown
      const { protein, carbs, fats } = getMacrosFromCalories(dailyCalories);
      
      setBarData({
        labels: ['Protein', 'Carbohydrates', 'Fats'],
        datasets: [
          {
            label: 'Macronutrients (calories)',
            data: [protein * 4, carbs * 4, fats * 9],
            backgroundColor: [
              'rgba(246, 173, 85, 0.8)', // Protein: orange
              'rgba(75, 192, 192, 0.8)', // Carbs: teal
              'rgba(153, 102, 255, 0.8)', // Fats: purple
            ],
            borderColor: [
              'rgb(246, 173, 85)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
            ],
            borderWidth: 1,
          },
        ],
      });
      
      setIsCalculating(false);
      setShowResults(true);
    }, 800);
  };

  const handleReset = () => {
    setAge("");
    setHeight("");
    setWeight("");
    setGender("male");
    setActivityLevel("moderate");
    setCalories(null);
    setShowResults(false);
    setBarData(null);
  };

  // Macronutrient calculation based on calorie needs
  const getMacros = () => {
    if (!calories) return { protein: 0, carbs: 0, fats: 0 };
    return getMacrosFromCalories(calories);
  };
  
  // Helper function to calculate macros from calories
  const getMacrosFromCalories = (cals: number) => {
    // Standard macronutrient distribution: 30% protein, 40% carbs, 30% fat
    const protein = Math.round((cals * 0.3) / 4); // 4 calories per gram of protein
    const carbs = Math.round((cals * 0.4) / 4);   // 4 calories per gram of carbs
    const fats = Math.round((cals * 0.3) / 9);    // 9 calories per gram of fat
    
    return { protein, carbs, fats };
  };

  // Chart data for macronutrient breakdown
  const getMacroChartData = () => {
    const macros = getMacros();
    
    return {
      labels: ['Protein', 'Carbohydrates', 'Fats'],
      datasets: [
        {
          data: [macros.protein * 4, macros.carbs * 4, macros.fats * 9],
          backgroundColor: [
            'rgba(246, 173, 85, 0.8)', // Protein: orange
            'rgba(75, 192, 192, 0.8)',  // Carbs: teal
            'rgba(153, 102, 255, 0.8)', // Fats: purple
          ],
          borderColor: [
            'rgb(246, 173, 85)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart data for calorie goals (maintain, lose, gain)
  const getCalorieGoalsData = () => {
    if (!calories) return { labels: [], datasets: [] };
    
    return {
      labels: ['Lose Weight', 'Maintain', 'Gain Weight'],
      datasets: [
        {
          label: 'Daily Calories',
          data: [calories - 500, calories, calories + 500],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)', // Lose: blue
            'rgba(75, 192, 192, 0.7)', // Maintain: teal
            'rgba(255, 99, 132, 0.7)', // Gain: pink
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value} cal)`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} calories`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
  };

  return (
    <CalculatorCard 
      title="Daily Calorie Calculator" 
      description="Estimate your daily calorie needs"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center bg-gray-100 rounded-full p-1"
          >
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-5 py-2 rounded-full cursor-pointer transition-all ${
                unit === "metric" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={unit === "metric"}
                onChange={() => setUnit("metric")}
              />
              <span>Metric (cm, kg)</span>
            </motion.label>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-5 py-2 rounded-full cursor-pointer transition-all ${
                unit === "imperial" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={unit === "imperial"}
                onChange={() => setUnit("imperial")}
              />
              <span>Imperial (in, lbs)</span>
            </motion.label>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">Age</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 30"
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">Gender</label>
            <motion.select
              whileFocus={{ scale: 1.01 }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </motion.select>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              {unit === "metric" ? "Height (cm)" : "Height (inches)"}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 70" : "e.g., 150"}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <label className="block text-gray-700 mb-2 font-medium">Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(activityLevels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </motion.div>

        {!showResults ? (
          <div className="flex gap-4 mt-8 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateCalories}
              className="btn-primary px-8 py-3 font-medium text-center text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              disabled={isCalculating || !age || !height || !weight}
            >
              {isCalculating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                "Calculate Calories"
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="btn-secondary px-8 py-3 font-medium text-center rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Reset
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-4 mt-8 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="btn-primary px-8 py-3 font-medium text-center text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Recalculate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary px-8 py-3 font-medium text-center rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Save Results
            </motion.button>
          </div>
        )}
      </motion.div>

      {calories !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border border-blue-100 w-full max-w-full"
        >
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Your Daily Calorie Results
          </motion.h3>
          
          <div className="flex items-center justify-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-flex items-center justify-center w-44 h-44 rounded-full bg-white shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Daily Intake</span>
                  <span className="text-6xl font-bold text-indigo-600">{Math.round(calories)}</span>
                  <span className="text-lg font-medium text-indigo-400">calories</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doughnut Chart */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Macronutrient Ratio</h4>
              <div className="relative mx-auto w-full" style={{ height: '300px' }}>
                <Doughnut data={getMacroChartData()} options={doughnutOptions} />
              </div>
              
              <div className="grid grid-cols-3 gap-6 w-full mt-8">
                <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50 border border-amber-100 shadow-sm">
                  <span className="text-sm font-medium text-amber-800">Protein</span>
                  <span className="text-xl font-bold text-amber-700 mt-1">{getMacros().protein}g</span>
                  <span className="text-xs text-amber-600 mt-1">{Math.round((getMacros().protein * 4 / calories) * 100)}%</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-teal-50 border border-teal-100 shadow-sm">
                  <span className="text-sm font-medium text-teal-800">Carbs</span>
                  <span className="text-xl font-bold text-teal-700 mt-1">{getMacros().carbs}g</span>
                  <span className="text-xs text-teal-600 mt-1">{Math.round((getMacros().carbs * 4 / calories) * 100)}%</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-purple-50 border border-purple-100 shadow-sm">
                  <span className="text-sm font-medium text-purple-800">Fats</span>
                  <span className="text-xl font-bold text-purple-700 mt-1">{getMacros().fats}g</span>
                  <span className="text-xs text-purple-600 mt-1">{Math.round((getMacros().fats * 9 / calories) * 100)}%</span>
                </div>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="flex flex-col p-6 bg-white rounded-xl shadow-md">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Calorie Goals</h4>
              <div className="h-72">
                {barData && <Bar options={barOptions} data={getCalorieGoalsData()} />}
              </div>
              
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-blue-800">Weight Loss</span>
                    <p className="text-xs text-blue-700 mt-1">0.5kg per week</p>
                  </div>
                  <span className="text-xl font-bold text-blue-700">{calories - 500} cal</span>
                </div>
                <div className="p-4 rounded-lg bg-teal-50 border border-teal-100 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-teal-800">Maintenance</span>
                    <p className="text-xs text-teal-700 mt-1">Current weight</p>
                  </div>
                  <span className="text-xl font-bold text-teal-700">{calories} cal</span>
                </div>
                <div className="p-4 rounded-lg bg-pink-50 border border-pink-100 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-pink-800">Weight Gain</span>
                    <p className="text-xs text-pink-700 mt-1">0.5kg per week</p>
                  </div>
                  <span className="text-xl font-bold text-pink-700">{calories + 500} cal</span>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-xl mb-4 text-gray-800">Macronutrient Breakdown</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-24 text-sm font-medium text-gray-700">Protein:</div>
                    <div className="ml-4 text-sm font-medium">{getMacros().protein}g ({Math.round((getMacros().protein * 4 / calories) * 100)}%)</div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((getMacros().protein * 4 / calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-24 text-sm font-medium text-gray-700">Carbs:</div>
                    <div className="ml-4 text-sm font-medium">{getMacros().carbs}g ({Math.round((getMacros().carbs * 4 / calories) * 100)}%)</div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((getMacros().carbs * 4 / calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-24 text-sm font-medium text-gray-700">Fats:</div>
                    <div className="ml-4 text-sm font-medium">{getMacros().fats}g ({Math.round((getMacros().fats * 9 / calories) * 100)}%)</div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((getMacros().fats * 9 / calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-lg mb-2 text-gray-800">Your Formula Details</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Based on the Mifflin-St Jeor Equation, which is considered one of the most accurate formulas for calculating basal metabolic rate (BMR).
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="font-medium">{gender === 'male' ? 'Male' : 'Female'}</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500">Age</div>
                    <div className="font-medium">{age} years</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500">Height</div>
                    <div className="font-medium">{height} {unit === 'metric' ? 'cm' : 'in'}</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500">Weight</div>
                    <div className="font-medium">{weight} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center mt-8">
            <SaveResultButton
              recordType="calories"
              value={calories || 0}
              disabled={!calories}
            />
          </div>
        </motion.div>
      )}
    </CalculatorCard>
  );
};

export default CalorieCalculator; 