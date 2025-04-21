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

const BmiCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBmi = () => {
    if ((!height && unit === "metric") || (!heightFeet && !heightInches && unit === "imperial") || !weight) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      let bmiValue: number;
      if (unit === "metric") {
        const heightInMeters = parseFloat(height) / 100;
        bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      } else {
        const totalInches = (parseFloat(heightFeet) * 12) + parseFloat(heightInches);
        bmiValue = (parseFloat(weight) * 703) / (totalInches * totalInches);
      }

      setBmi(parseFloat(bmiValue.toFixed(1)));
      setBmiCategory(getBmiCategory(bmiValue));
      setIsCalculating(false);
    }, 800);
  };

  const getBmiCategory = (bmiValue: number): string => {
    // For children and adolescents, BMI interpretation varies by age and sex
    const ageValue = parseFloat(age);
    
    // For adults (standard BMI categories)
    if (!age || ageValue >= 20) {
      if (bmiValue < 18.5) return "Underweight";
      if (bmiValue < 25) return "Normal weight";
      if (bmiValue < 30) return "Overweight";
      if (bmiValue < 35) return "Obesity Class I";
      if (bmiValue < 40) return "Obesity Class II";
      return "Obesity Class III";
    } 
    
    // For elderly (65+), slightly higher BMI may be acceptable
    if (ageValue >= 65) {
      if (bmiValue < 22) return "Underweight";
      if (bmiValue < 27) return "Normal weight";
      if (bmiValue < 32) return "Overweight";
      if (bmiValue < 37) return "Obesity Class I";
      if (bmiValue < 42) return "Obesity Class II";
      return "Obesity Class III";
    }
    
    // For children and teens (note: this is simplified - actual pediatric BMI uses percentiles)
    // Return standard categories but with a note that interpretation is different
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Underweight": return "#3B82F6"; // blue
      case "Normal weight": return "#10B981"; // green
      case "Overweight": return "#F59E0B"; // yellow
      case "Obesity Class I": return "#F97316"; // orange
      case "Obesity Class II": return "#EF4444"; // red
      case "Obesity Class III": return "#991B1B"; // dark red
      case "Obese": return "#EF4444"; // red for simplified child category
      default: return "#1F2937"; // gray
    }
  };

  const getBmiRangeText = (category: string): string => {
    // If elderly, show adjusted ranges
    const ageValue = parseFloat(age);
    if (ageValue >= 65) {
      switch (category) {
        case "Underweight": return "< 22";
        case "Normal weight": return "22 - 26.9";
        case "Overweight": return "27 - 31.9";
        case "Obesity Class I": return "32 - 36.9";
        case "Obesity Class II": return "37 - 41.9";
        case "Obesity Class III": return "≥ 42";
        default: return "";
      }
    } else {
      // Standard adult ranges
      switch (category) {
        case "Underweight": return "< 18.5";
        case "Normal weight": return "18.5 - 24.9";
        case "Overweight": return "25 - 29.9";
        case "Obesity Class I": return "30 - 34.9";
        case "Obesity Class II": return "35 - 39.9";
        case "Obesity Class III": return "≥ 40";
        case "Obese": return "≥ 30";
        default: return "";
      }
    }
  };

  const getBmiDistributionData = () => {
    // Adjust ranges for elderly
    const ageValue = parseFloat(age);
    const labels = ['Underweight', 'Normal', 'Overweight', 'Obesity I', 'Obesity II', 'Obesity III'];
    
    // Define data ranges based on age
    let dataRanges;
    if (ageValue >= 65) {
      dataRanges = [22, 27, 32, 37, 42, 45]; // Adjusted for elderly
    } else {
      dataRanges = [18.5, 25, 30, 35, 40, 42.5]; // Standard
    }
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'BMI Range',
          data: dataRanges,
          backgroundColor: [
            'rgba(59, 130, 246, 0.2)',
            'rgba(16, 185, 129, 0.2)',
            'rgba(245, 158, 11, 0.2)',
            'rgba(249, 115, 22, 0.2)',
            'rgba(239, 68, 68, 0.2)',
            'rgba(153, 27, 27, 0.2)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(153, 27, 27, 1)',
          ],
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Your BMI',
          data: Array(6).fill(null).map((_, i) => {
            let ranges;
            if (ageValue >= 65) {
              ranges = [0, 22, 27, 32, 37, 42, 100]; // Elderly ranges
            } else {
              ranges = [0, 18.5, 25, 30, 35, 40, 100]; // Standard ranges
            }
            return (bmi && bmi >= ranges[i] && bmi < ranges[i + 1]) ? bmi : null;
          }),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
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
        max: 45,
        title: {
          display: true,
          text: 'BMI Value',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'BMI Categories',
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
        enabled: true,
        callbacks: {
          label: (context: any) => {
            return `BMI: ${context.raw}`;
          }
        }
      }
    }
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
    setAge("");
    setSex("male");
    setBmi(null);
    setBmiCategory("");
  };

  // Determine if the BMI interpretation needs special considerations
  const needsSpecialInterpretation = () => {
    const ageValue = parseFloat(age);
    return (ageValue > 0 && ageValue < 20) || ageValue >= 65;
  };

  // Get additional interpretation message based on age and sex
  const getInterpretationMessage = () => {
    const ageValue = parseFloat(age);
    
    if (ageValue > 0 && ageValue < 20) {
      return "For children and teenagers, BMI is interpreted according to age and sex-specific percentiles. Please consult with a healthcare provider for an accurate interpretation.";
    } else if (ageValue >= 65) {
      return "For older adults, slightly higher BMI values may be acceptable. BMI ranges have been adjusted accordingly in the assessment.";
    } else if (sex === "male" && bmi && bmi >= 25 && bmi < 30) {
      return "Men with higher muscle mass may have a higher BMI without excess fat. Consider also measuring waist circumference for a more complete assessment.";
    } else if (sex === "female" && bmi && bmi < 18.5) {
      return "Women may naturally have lower BMI. However, being underweight can still pose health risks including nutrient deficiencies and hormonal imbalances.";
    }
    
    return "";
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          BMI Calculator
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Height ({unit === 'metric' ? 'cm' : 'ft/in'})
              </label>
              {unit === 'metric' ? (
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 175"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Feet"
                  />
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Inches"
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
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
          </div>

          {/* Age and Sex Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Sex
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    sex === 'male'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    sex === 'female'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Female
                </button>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateBmi}
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
              ) : 'Calculate BMI'}
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
          {bmi !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border border-blue-100 rounded-xl overflow-hidden">
                <div className="p-6 md:p-8 lg:p-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Your BMI Results</h3>
                  
                  {/* Main Results Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* BMI Score Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <div className="text-center">
                        <div className="mb-4">
                          <div className="text-7xl sm:text-8xl font-bold mb-2" style={{ color: getCategoryColor(bmiCategory) }}>
                            {bmi.toFixed(1)}
                          </div>
                          <div className="text-2xl font-semibold" style={{ color: getCategoryColor(bmiCategory) }}>
                            {bmiCategory}
                          </div>
                        </div>
                        
                        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
                          <div
                            className="absolute top-0 left-0 h-full w-full"
                            style={{
                              background: 'linear-gradient(to right, #3B82F6, #10B981, #F59E0B, #F97316, #EF4444, #991B1B)',
                            }}
                          />
                          <div
                            className="absolute top-0 h-full bg-white w-2 transform transition-all duration-500"
                            style={{
                              left: `${Math.min(100, Math.max(0, ((bmi - 15) / 30) * 100))}%`,
                            }}
                          />
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-sm text-gray-600 space-y-2">
                            {[
                              "Underweight",
                              "Normal weight",
                              "Overweight",
                              "Obesity Class I",
                              "Obesity Class II",
                              "Obesity Class III"
                            ].map((category) => (
                              <div 
                                key={category}
                                className={`flex justify-between items-center p-2 rounded ${
                                  category === bmiCategory ? 'bg-gray-100' : ''
                                }`}
                              >
                                <span className="font-medium" style={{ color: getCategoryColor(category) }}>
                                  {category}
                                </span>
                                <span className="text-gray-500">
                                  {getBmiRangeText(category)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BMI Chart Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">BMI Distribution</h4>
                      <div className="h-[400px] w-full">
                        <Bar options={chartOptions} data={getBmiDistributionData()} />
                      </div>
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className="mt-8 text-sm text-gray-600">
                    <p className="mb-4">
                      BMI (Body Mass Index) is a measure of body fat based on height and weight. While BMI is a useful screening tool,
                      it's not a diagnostic of body fatness or health. Factors such as age, sex, ethnicity, and muscle mass can influence the relationship
                      between BMI and body fat.
                    </p>
                    
                    {/* Special interpretation note based on age/sex */}
                    {getInterpretationMessage() && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-blue-800">
                          <strong>Note:</strong> {getInterpretationMessage()}
                        </p>
                      </div>
                    )}
                    
                    {/* Show warning for children if age < 20 */}
                    {parseFloat(age) > 0 && parseFloat(age) < 20 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                          <strong>Important:</strong> This calculator provides a simplified BMI assessment for individuals under 20 years old. 
                          For children and teens, BMI is normally interpreted using age and sex-specific percentile charts. 
                          Please consult with a healthcare provider for proper interpretation of your child's BMI.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Save Results Button */}
                  <div className="mt-8 text-center">
                    <SaveResultButton
                      recordType="bmi"
                      value={bmi}
                      disabled={!bmi}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BmiCalculator;