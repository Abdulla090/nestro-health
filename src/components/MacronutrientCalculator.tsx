"use client";

import React, { useState, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import SaveResultButton from './SaveResultButton';

type MacroGoal = 'weightLoss' | 'maintenance' | 'muscleGain';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Gender = 'male' | 'female';

interface MacronutrientData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

const MacronutrientCalculator: React.FC = () => {
  // User inputs
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<MacroGoal>('maintenance');
  const [isMetric, setIsMetric] = useState<boolean>(true);
  
  // Results
  const [macros, setMacros] = useState<MacronutrientData | null>(null);
  
  // Refs for viewing results
  const resultsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    veryActive: 1.9 // Very hard exercise & physical job
  };

  // Goal-based calorie adjustments
  const goalMultipliers = {
    weightLoss: 0.8, // 20% deficit
    maintenance: 1.0, // No adjustment
    muscleGain: 1.1 // 10% surplus
  };

  // Goal-based macronutrient ratios (protein/carbs/fat)
  const macroRatios = {
    weightLoss: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    maintenance: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    muscleGain: { protein: 0.3, carbs: 0.5, fat: 0.2 }
  };

  const calculateMacros = () => {
    // Check if all required fields are filled
    if (!weight || !height || !age) {
      return;
    }
    
    // Convert to metric if needed
    const weightKg = isMetric ? Number(weight) : Number(weight) * 0.453592;
    const heightCm = isMetric ? Number(height) : Number(height) * 2.54;
    const ageValue = Number(age);
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue - 161;
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust calories based on goal
    const adjustedCalories = Math.round(tdee * goalMultipliers[goal]);
    
    // Calculate macros in grams
    const proteinGrams = Math.round((adjustedCalories * macroRatios[goal].protein) / 4);
    const carbGrams = Math.round((adjustedCalories * macroRatios[goal].carbs) / 4);
    const fatGrams = Math.round((adjustedCalories * macroRatios[goal].fat) / 9);
    
    setMacros({
      calories: adjustedCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams
    });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) > 0)) {
      setWeight(value);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) > 0)) {
      setHeight(value);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) > 0 && Number(value) < 120)) {
      setAge(value);
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setActivityLevel('moderate');
    setGoal('maintenance');
    setIsMetric(true);
    setMacros(null);
  };

  // Create pie chart data
  const getPieData = () => [
    { name: 'Fat', value: macros?.fat || 0, calories: (macros?.fat || 0) * 9 },
    { name: 'Protein', value: macros?.protein || 0, calories: (macros?.protein || 0) * 4 },
    { name: 'Carbs', value: macros?.carbs || 0, calories: (macros?.carbs || 0) * 4 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Macronutrient Calculator</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          Calculate your daily macronutrient needs based on your body metrics, activity level, and fitness goals.
          This calculator provides recommendations for protein, carbohydrates, and fats to help you reach your goals.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
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
              onChange={handleWeightChange}
              min="1"
              placeholder={isMetric ? "e.g., 70" : "e.g., 154"}
              className="w-full px-3 py-2 border rounded-md"
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
              onChange={handleHeightChange}
              min="1"
              placeholder={isMetric ? "e.g., 175" : "e.g., 69"}
              className="w-full px-3 py-2 border rounded-md"
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
              placeholder="e.g., 30"
              className="w-full px-3 py-2 border rounded-md"
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
          
          <div>
            <label htmlFor="activity" className="block text-sm font-medium mb-1">
              Activity Level
            </label>
            <select
              id="activity"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="veryActive">Very Active (hard exercise & physical job)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium mb-1">
              Fitness Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as MacroGoal)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="weightLoss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscleGain">Muscle Gain</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={calculateMacros}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {macros ? (
            <div ref={resultsRef} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-4">Your Macronutrient Plan</h3>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="text-center bg-white p-3 rounded-lg shadow-sm flex-1">
                  <p className="text-sm font-semibold mb-1">Daily Calories</p>
                  <p className="text-2xl font-bold text-blue-600">{macros.calories}</p>
                  <p className="text-xs text-gray-500">calories</p>
                </div>
                
                <div className="text-center bg-white p-3 rounded-lg shadow-sm flex-1">
                  <p className="text-sm font-semibold mb-1">Protein</p>
                  <p className="text-2xl font-bold text-blue-600">{macros.protein}g</p>
                  <p className="text-xs text-gray-500">{Math.round(macros.protein * 4)} calories</p>
                </div>
                
                <div className="text-center bg-white p-3 rounded-lg shadow-sm flex-1">
                  <p className="text-sm font-semibold mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-blue-600">{macros.carbs}g</p>
                  <p className="text-xs text-gray-500">{Math.round(macros.carbs * 4)} calories</p>
                </div>
                
                <div className="text-center bg-white p-3 rounded-lg shadow-sm flex-1">
                  <p className="text-sm font-semibold mb-1">Fat</p>
                  <p className="text-2xl font-bold text-blue-600">{macros.fat}g</p>
                  <p className="text-xs text-gray-500">{Math.round(macros.fat * 9)} calories</p>
                </div>
              </div>
              
              <div className="mb-6" ref={chartRef}>
                <h4 className="font-semibold mb-3">Macronutrient Breakdown</h4>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}g`}
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value}g (${props.payload.calories} cal)`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Tips for {goal === 'weightLoss' ? 'Weight Loss' : goal === 'maintenance' ? 'Maintenance' : 'Muscle Gain'}</h4>
                <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                  {goal === 'weightLoss' ? (
                    <>
                      <li>Prioritize protein to preserve muscle mass while in a calorie deficit.</li>
                      <li>Focus on fiber-rich carbs (vegetables, whole grains) to stay fuller longer.</li>
                      <li>Include healthy fats to support hormone production during weight loss.</li>
                    </>
                  ) : goal === 'maintenance' ? (
                    <>
                      <li>Maintain this balanced approach to support your current weight and activity level.</li>
                      <li>Consider adjusting macros on training vs non-training days for optimal performance.</li>
                      <li>Focus on food quality while maintaining these macronutrient ratios.</li>
                    </>
                  ) : (
                    <>
                      <li>Higher carb intake will fuel intense workouts and support muscle growth.</li>
                      <li>Split protein intake evenly throughout the day for optimal muscle protein synthesis.</li>
                      <li>Time carbohydrate intake around workouts for better performance and recovery.</li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Save to Profile Button */}
              <div className="mt-6 text-center">
                <SaveResultButton
                  recordType="calories"
                  value={macros.calories}
                  disabled={!macros}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No calculation yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in your details and click "Calculate" to see your personalized macronutrient plan.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MacronutrientCalculator; 