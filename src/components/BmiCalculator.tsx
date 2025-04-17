"use client";

import { useState, useEffect } from "react";
import CalculatorCard from "./CalculatorCard";
import { motion } from "framer-motion";
import SaveResultButton from "./SaveResultButton";

const BmiCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric"); // metric or imperial
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBmi = () => {
    if (!height || !weight) return;

    setIsCalculating(true);
    
    // Add a small delay to show the animation
    setTimeout(() => {
      let bmiValue: number;
      if (unit === "metric") {
        // Height in cm, weight in kg
        const heightInMeters = parseFloat(height) / 100;
        bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      } else {
        // Height in inches, weight in pounds
        bmiValue = (parseFloat(weight) * 703) / (parseFloat(height) * parseFloat(height));
      }

      setBmi(parseFloat(bmiValue.toFixed(1)));
      setBmiCategory(getBmiCategory(bmiValue));
      setIsCalculating(false);
    }, 800);
  };

  const getBmiCategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    if (bmiValue < 35) return "Obesity (Class I)";
    if (bmiValue < 40) return "Obesity (Class II)";
    return "Obesity (Class III)";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Underweight": return "text-blue-600";
      case "Normal weight": return "text-green-600";
      case "Overweight": return "text-yellow-600";
      case "Obesity (Class I)": return "text-orange-600";
      case "Obesity (Class II)": return "text-red-600";
      case "Obesity (Class III)": return "text-red-800";
      default: return "text-gray-800";
    }
  };

  const getChartBgColor = (category: string): string => {
    switch (category) {
      case "Underweight": return "rgba(59, 130, 246, 0.2)";
      case "Normal weight": return "rgba(16, 185, 129, 0.2)";
      case "Overweight": return "rgba(234, 179, 8, 0.2)";
      case "Obesity (Class I)": return "rgba(249, 115, 22, 0.2)";
      case "Obesity (Class II)": return "rgba(239, 68, 68, 0.2)";
      case "Obesity (Class III)": return "rgba(185, 28, 28, 0.2)";
      default: return "rgba(107, 114, 128, 0.2)";
    }
  };

  const getChartBorderColor = (category: string): string => {
    switch (category) {
      case "Underweight": return "rgba(59, 130, 246, 1)";
      case "Normal weight": return "rgba(16, 185, 129, 1)";
      case "Overweight": return "rgba(234, 179, 8, 1)";
      case "Obesity (Class I)": return "rgba(249, 115, 22, 1)";
      case "Obesity (Class II)": return "rgba(239, 68, 68, 1)";
      case "Obesity (Class III)": return "rgba(185, 28, 28, 1)";
      default: return "rgba(107, 114, 128, 1)";
    }
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 w-full max-w-full">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Calculate Your BMI
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center bg-gray-100 rounded-full p-1"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setUnit("metric")}
                className={`py-2 px-8 rounded-full transition-all ${
                  unit === "metric" 
                    ? "bg-white shadow-sm text-gray-900" 
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                Metric
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setUnit("imperial")}
                className={`py-2 px-8 rounded-full transition-all ${
                  unit === "imperial" 
                    ? "bg-white shadow-sm text-gray-900" 
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                Imperial
              </motion.button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {unit === "metric" ? "Height (cm)" : "Height (inches)"}
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={unit === "metric" ? "e.g., 70" : "e.g., 150"}
                />
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateBmi}
              disabled={isCalculating}
              className="btn-primary py-3 px-10 rounded-xl text-base font-medium relative overflow-hidden"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : "Calculate BMI"}
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

        {bmi !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-8 md:p-10 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border border-blue-100"
          >
            {/* BMI Visualization - Like the image */}
            <div className="bg-white rounded-xl p-8 mb-10 text-gray-900 shadow-xl border border-gray-200">
              <div className="text-center mb-2">
                <h3 className="text-6xl font-bold">{bmi}</h3>
                <p className="text-gray-600 mt-1">Your BMI</p>
              </div>
              
              <div className="text-center mb-6">
                <h4 className="text-2xl font-semibold">{bmiCategory}</h4>
              </div>
              
              {/* BMI Gradient Bar */}
              <div className="relative w-full h-2 mt-6 mb-2 rounded-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
                {/* BMI Indicator Dot */}
                <div 
                  className="absolute top-1/2 w-4 h-4 -mt-2 bg-white rounded-full shadow-lg border-2 border-gray-800" 
                  style={{ 
                    left: `${Math.min(Math.max((bmi - 10) / 35 * 100, 0), 100)}%`,
                    transform: 'translateX(-50%)'
                  }}
                ></div>
              </div>
              
              {/* Category Labels */}
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-8"
            >
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <SaveResultButton
                  recordType="bmi"
                  value={bmi}
                  disabled={bmi === null}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BmiCalculator;