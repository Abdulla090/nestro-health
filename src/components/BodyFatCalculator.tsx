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
  PointElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const BodyFatCalculator = () => {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBodyFat = () => {
    if (!height || !weight || !waist || !neck || (gender === "female" && !hip)) return;

    setIsCalculating(true);
    
    // Add a small delay to show animation
    setTimeout(() => {
      let heightCm = parseFloat(height);
      let waistCm = parseFloat(waist);
      let neckCm = parseFloat(neck);
      let hipCm = gender === "female" ? parseFloat(hip) : 0;

      // Convert to cm if using imperial
      if (unit === "imperial") {
        heightCm = parseFloat(height) * 2.54;
        waistCm = parseFloat(waist) * 2.54;
        neckCm = parseFloat(neck) * 2.54;
        if (gender === "female") {
          hipCm = parseFloat(hip) * 2.54;
        }
      }

      let bodyFatPercentage;
      if (gender === "male") {
        // U.S. Navy method for men
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      } else {
        // U.S. Navy method for women
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
      }

      // Ensure result is within reasonable range
      bodyFatPercentage = Math.max(3, Math.min(bodyFatPercentage, 60));

      setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)));
      setCategory(getBodyFatCategory(bodyFatPercentage, gender, parseFloat(age)));
      setIsCalculating(false);
    }, 800);
  };

  const getBodyFatCategory = (bf: number, gender: string, age: number): string => {
    if (isNaN(age)) return "Please enter your age for accurate category";
    
    if (gender === "male") {
      if (age < 40) {
        if (bf < 8) return "Essential Fat";
        if (bf < 13) return "Athletic";
        if (bf < 20) return "Fitness";
        if (bf < 24) return "Average";
        return "Obese";
      } else {
        if (bf < 11) return "Essential Fat";
        if (bf < 16) return "Athletic";
        if (bf < 22) return "Fitness";
        if (bf < 26) return "Average";
        return "Obese";
      }
    } else {
      if (age < 40) {
        if (bf < 14) return "Essential Fat";
        if (bf < 20) return "Athletic";
        if (bf < 28) return "Fitness";
        if (bf < 32) return "Average";
        return "Obese";
      } else {
        if (bf < 16) return "Essential Fat";
        if (bf < 22) return "Athletic";
        if (bf < 30) return "Fitness";
        if (bf < 34) return "Average";
        return "Obese";
      }
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Essential Fat": return "#3b82f6"; // blue
      case "Athletic": return "#10b981"; // green
      case "Fitness": return "#22c55e"; // green-500
      case "Average": return "#eab308"; // yellow
      case "Obese": return "#ef4444"; // red
      default: return "#6b7280"; // gray
    }
  };

  const getCategoryBgColor = (category: string): string => {
    switch (category) {
      case "Essential Fat": return "rgba(59, 130, 246, 0.2)";
      case "Athletic": return "rgba(16, 185, 129, 0.2)";
      case "Fitness": return "rgba(34, 197, 94, 0.2)";
      case "Average": return "rgba(234, 179, 8, 0.2)";
      case "Obese": return "rgba(239, 68, 68, 0.2)";
      default: return "rgba(107, 114, 128, 0.2)";
    }
  };

  // Get range data for the comparison chart
  const getBodyFatRangeData = () => {
    let ranges;
    if (gender === "male") {
      if (parseFloat(age) < 40) {
        ranges = [
          { category: "Essential Fat", range: [3, 8] },
          { category: "Athletic", range: [8, 14] },
          { category: "Fitness", range: [14, 21] },
          { category: "Average", range: [21, 25] },
          { category: "Obese", range: [25, 40] }
        ];
      } else {
        ranges = [
          { category: "Essential Fat", range: [3, 11] },
          { category: "Athletic", range: [11, 17] },
          { category: "Fitness", range: [17, 23] },
          { category: "Average", range: [23, 29] },
          { category: "Obese", range: [29, 40] }
        ];
      }
    } else {
      if (parseFloat(age) < 40) {
        ranges = [
          { category: "Essential Fat", range: [8, 13] },
          { category: "Athletic", range: [13, 21] },
          { category: "Fitness", range: [21, 28] },
          { category: "Average", range: [28, 33] },
          { category: "Obese", range: [33, 40] }
        ];
      } else {
        ranges = [
          { category: "Essential Fat", range: [8, 14] },
          { category: "Athletic", range: [14, 23] },
          { category: "Fitness", range: [23, 30] },
          { category: "Average", range: [30, 36] },
          { category: "Obese", range: [36, 40] }
        ];
      }
    }

    const data = {
      labels: ranges.map(r => r.category),
      datasets: [
        {
          label: "Body Fat Range (%)",
          data: ranges.map(r => r.range[1] - r.range[0]),
          backgroundColor: ranges.map(r => getCategoryBgColor(r.category)),
          borderColor: ranges.map(r => getCategoryColor(r.category)),
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          base: 0,
          barThickness: 30,
        },
        {
          label: "Your Body Fat",
          data: bodyFat ? ranges.map(r => r.category === category ? bodyFat : null) : [],
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 2,
          barPercentage: 0.4,
          type: 'bar' as const,
          categoryPercentage: 0.4,
          barThickness: 10,
        }
      ]
    };
    
    return data;
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 45,
        title: {
          display: true,
          text: 'Body Fat Percentage',
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
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: 14
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
            if (context.dataset.label === "Your Body Fat") {
              return `Your Body Fat: ${bodyFat}%`;
            }
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
  };

  // Doughnut chart data for visual representation
  const getDoughnutData = () => {
    return {
      labels: ['Body Fat', 'Lean Mass'],
      datasets: [
        {
          data: [bodyFat, 100 - (bodyFat || 0)],
          backgroundColor: [
            getCategoryColor(category),
            'rgba(229, 231, 235, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            return `${label}: ${value}%`;
          }
        }
      }
    },
  };

  const handleReset = () => {
    setAge("");
    setHeight("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHip("");
    setBodyFat(null);
    setCategory("");
  };

  const getCategoryInfo = () => {
    switch (category) {
      case "Essential Fat":
        return "The minimum amount of body fat necessary for basic physical and physiological health. Essential fat is crucial for normal bodily functions.";
      case "Athletic":
        return "Body fat percentage typical of athletes and very fit individuals. This range is associated with optimal performance and health.";
      case "Fitness":
        return "A healthy body fat percentage that indicates good fitness and health. This range is ideal for most active individuals.";
      case "Average":
        return "A moderate body fat percentage that is common in the general population. While not optimal, it's not necessarily unhealthy.";
      case "Obese":
        return "A high body fat percentage that may increase the risk of health problems. Consider consulting a healthcare professional.";
      default:
        return "";
    }
  };

  return (
    <CalculatorCard 
      title="Body Fat Calculator" 
      description="Estimate your body fat percentage using the U.S. Navy method"
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
              <span>Metric (cm)</span>
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
              <span>Imperial (inches)</span>
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
            <label className="block text-gray-700 mb-2 font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              Height ({unit === "metric" ? "cm" : "inches"})
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
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              Waist ({unit === "metric" ? "cm" : "inches"})
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 80" : "e.g., 32"}
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              Neck ({unit === "metric" ? "cm" : "inches"})
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 35" : "e.g., 14"}
            />
          </motion.div>
        </div>

        {gender === "female" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <label className="block text-gray-700 mb-2 font-medium">
              Hip ({unit === "metric" ? "cm" : "inches"})
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 90" : "e.g., 36"}
            />
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={calculateBodyFat}
            disabled={isCalculating}
            className="btn-primary px-8 py-3 font-medium text-center text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </span>
            ) : "Calculate Body Fat"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="btn-secondary px-8 py-3 font-medium text-center rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Reset
          </motion.button>
        </motion.div>
      </motion.div>

      {bodyFat !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-8 md:p-12 lg:p-16 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border border-blue-100 w-full max-w-full"
        >
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Your Body Composition Results
          </motion.h3>
          
          <div className="flex items-center justify-center mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-flex items-center justify-center w-56 h-56 rounded-full bg-white shadow-xl"
                style={{ borderColor: getCategoryColor(category), borderWidth: '4px' }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg text-gray-500 mb-2">Body Fat</span>
                  <span className="text-8xl font-bold" style={{ color: getCategoryColor(category) }}>{bodyFat}%</span>
                  <span className="text-2xl font-medium" style={{ color: getCategoryColor(category) }}>{category}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md"
            >
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Body Fat Distribution</h4>
              <div className="relative" style={{ height: '300px', width: '100%' }}>
                <Doughnut data={getDoughnutData()} options={doughnutOptions} />
              </div>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm w-full">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-700 font-medium">Body Fat:</div>
                    <div 
                      className="text-xl font-bold"
                      style={{ color: getCategoryColor(category) }}
                    >
                      {bodyFat}%
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-700 font-medium">Lean Mass:</div>
                    <div className="text-xl font-bold text-indigo-600">{(100 - bodyFat).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-md"
            >
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Body Fat Categories</h4>
              <div className="h-72">
                <Bar data={getBodyFatRangeData()} options={chartOptions} />
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {label: "Essential Fat", description: "Minimum for health", color: "#3b82f6"},
                  {label: "Athletic", description: "Elite athletes", color: "#10b981"},
                  {label: "Fitness", description: "Fit & healthy", color: "#22c55e"},
                  {label: "Average", description: "Typical levels", color: "#eab308"},
                  {label: "Obese", description: "Health risk", color: "#ef4444"}
                ].map((item, index) => (
                  <div 
                    key={item.label} 
                    className={`p-4 rounded-lg bg-white shadow-sm border-l-4 ${category === item.label ? 'border-opacity-100 shadow-md' : 'border-opacity-30'}`}
                    style={{ borderLeftColor: item.color }}
                  >
                    <div className="text-md font-medium" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-xl mb-4 text-gray-800">What Your Results Mean</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-700">Body fat percentage is the proportion of fat mass to total body mass. It's an important indicator of fitness and health.</p>
                  <p className="text-gray-700">Your result of <span className="font-semibold" style={{ color: getCategoryColor(category) }}>{bodyFat}%</span> places you in the <span className="font-semibold" style={{ color: getCategoryColor(category) }}>{category}</span> category for your gender and age.</p>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-semibold text-lg mb-2 text-gray-800">Your Measurements</h5>
                    <div className="grid grid-cols-2 gap-4 mt-4">
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
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="mb-3 font-medium text-gray-800">Category Definitions:</div>
                  <ul className="space-y-3">
                    {[
                      {label: "Essential Fat", desc: "Minimum amount necessary for basic health functions and survival.", color: "#3b82f6"},
                      {label: "Athletic", desc: "Lower body fat typically seen in competitive athletes with excellent fitness.", color: "#10b981"},
                      {label: "Fitness", desc: "Healthy range showing dedication to regular exercise and good nutrition.", color: "#22c55e"},
                      {label: "Average", desc: "Typical body fat levels found in the general population.", color: "#eab308"},
                      {label: "Obese", desc: "Higher body fat levels that may increase health risks over time.", color: "#ef4444"}
                    ].map(item => (
                      <li key={item.label} className="flex items-start">
                        <div className="h-5 w-5 mt-0.5 mr-2 rounded-full" style={{backgroundColor: item.color}}></div>
                        <div>
                          <span className="font-medium" style={{color: item.color}}>{item.label}:</span> {item.desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    * Based on the U.S. Navy circumference method. This calculation provides an estimate and individual results may vary.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8">
            <SaveResultButton
              recordType="body_fat"
              value={bodyFat || 0}
              disabled={!bodyFat}
            />
          </div>
        </motion.div>
      )}
    </CalculatorCard>
  );
};

export default BodyFatCalculator; 