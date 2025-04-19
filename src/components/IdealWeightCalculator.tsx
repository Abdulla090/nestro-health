"use client";

import { useState } from "react";
import CalculatorCard from "./CalculatorCard";
import { motion } from "framer-motion";
import { Bar, Radar } from "react-chartjs-2";
import SaveResultButton from "./SaveResultButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const IdealWeightCalculator = () => {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [idealWeight, setIdealWeight] = useState<{
    devine: number;
    robinson: number;
    miller: number;
    hamwi: number;
    average: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateIdealWeight = () => {
    if (!height) return;

    setIsCalculating(true);

    setTimeout(() => {
      let heightInCm = parseFloat(height);
      let heightInInches: number;

      // Convert to appropriate units
      if (unit === "metric") {
        heightInInches = heightInCm / 2.54;
      } else {
        heightInInches = parseFloat(height);
        heightInCm = heightInInches * 2.54;
      }

      // Height in inches minus 60 inches (5 feet)
      const inchesOver5Feet = heightInInches - 60;

      let devine: number;
      let robinson: number;
      let miller: number;
      let hamwi: number;

      // Apply formulas based on gender
      if (gender === "male") {
        devine = 50 + 2.3 * inchesOver5Feet;
        robinson = 52 + 1.9 * inchesOver5Feet;
        miller = 56.2 + 1.41 * inchesOver5Feet;
        hamwi = 48 + 2.7 * inchesOver5Feet;
      } else {
        devine = 45.5 + 2.3 * inchesOver5Feet;
        robinson = 49 + 1.7 * inchesOver5Feet;
        miller = 53.1 + 1.36 * inchesOver5Feet;
        hamwi = 45.5 + 2.2 * inchesOver5Feet;
      }

      // Convert from kg to lbs if using imperial
      if (unit === "imperial") {
        devine = Math.round(devine * 2.20462);
        robinson = Math.round(robinson * 2.20462);
        miller = Math.round(miller * 2.20462);
        hamwi = Math.round(hamwi * 2.20462);
      } else {
        devine = Math.round(devine);
        robinson = Math.round(robinson);
        miller = Math.round(miller);
        hamwi = Math.round(hamwi);
      }

      const average = Math.round((devine + robinson + miller + hamwi) / 4);

      setIdealWeight({
        devine,
        robinson,
        miller,
        hamwi,
        average,
      });

      setIsCalculating(false);
    }, 800);
  };

  // Chart data for formula comparison
  const getComparisonChartData = () => {
    if (!idealWeight) return { labels: [], datasets: [{ data: [] }] };
    
    const weightUnit = unit === "metric" ? "kg" : "lbs";
    
    return {
      labels: ['Devine', 'Robinson', 'Miller', 'Hamwi', 'Average'],
      datasets: [
        {
          label: `Ideal Weight (${weightUnit})`,
          data: [
            idealWeight.devine,
            idealWeight.robinson,
            idealWeight.miller,
            idealWeight.hamwi,
            idealWeight.average
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',  // Devine: blue
            'rgba(75, 192, 192, 0.7)',  // Robinson: teal
            'rgba(153, 102, 255, 0.7)', // Miller: purple
            'rgba(255, 159, 64, 0.7)',  // Hamwi: orange
            'rgba(255, 99, 132, 0.7)',  // Average: pink
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 99, 132)',
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  // Radar chart data
  const getRadarChartData = () => {
    if (!idealWeight) return { labels: [], datasets: [{ data: [] }] };
    
    return {
      labels: ['Devine', 'Robinson', 'Miller', 'Hamwi'],
      datasets: [
        {
          label: 'Formula Comparison',
          data: [
            idealWeight.devine,
            idealWeight.robinson,
            idealWeight.miller,
            idealWeight.hamwi
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
        },
        {
          label: 'Average',
          data: [
            idealWeight.average,
            idealWeight.average,
            idealWeight.average,
            idealWeight.average
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ]
    };
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} ${unit === "metric" ? "kg" : "lbs"}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: unit === "metric" ? "Weight (kg)" : "Weight (lbs)"
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} ${unit === "metric" ? "kg" : "lbs"}`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: idealWeight ? Math.min(idealWeight.devine, idealWeight.robinson, idealWeight.miller, idealWeight.hamwi) - 5 : 0,
        suggestedMax: idealWeight ? Math.max(idealWeight.devine, idealWeight.robinson, idealWeight.miller, idealWeight.hamwi) + 5 : 100,
      }
    }
  };

  const handleReset = () => {
    setHeight("");
    setIdealWeight(null);
  };

  return (
    <CalculatorCard 
      title="Ideal Weight Calculator" 
      description="Estimate your ideal weight based on height and gender"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex justify-center mb-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center bg-gray-100 rounded-full p-1"
          >
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
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
              className={`inline-flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-gray-700 mb-1">Gender</label>
            <motion.select
              whileFocus={{ scale: 1.01 }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </motion.select>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 mb-1">
              {unit === "metric" ? "Height (cm)" : "Height (inches)"}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
            />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4 mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={calculateIdealWeight}
            disabled={isCalculating}
            className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </span>
            ) : "Calculate Ideal Weight"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="btn-secondary px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </motion.button>
        </motion.div>
      </motion.div>

      {idealWeight && (
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
            Your Ideal Weight Results
          </motion.h3>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex flex-col items-center justify-center mb-12"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                repeat: 3, 
                repeatType: "reverse", 
                duration: 0.3 
              }}
              className="text-8xl font-bold text-blue-600 mb-4"
            >
              {idealWeight.average} {unit === "metric" ? "kg" : "lbs"}
            </motion.div>
            <div className="text-2xl text-gray-600 text-center">
              Average ideal weight
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="h-64"
            >
              <h4 className="text-center font-medium text-gray-700 mb-2">Formula Comparison</h4>
              <Bar data={getComparisonChartData()} options={barOptions} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="h-64"
            >
              <h4 className="text-center font-medium text-gray-700 mb-2">Variation Analysis</h4>
              <Radar data={getRadarChartData()} options={radarOptions} />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            {[
              {formula: "Devine", value: idealWeight.devine, color: "bg-blue-100 border-blue-300"},
              {formula: "Robinson", value: idealWeight.robinson, color: "bg-teal-100 border-teal-300"},
              {formula: "Miller", value: idealWeight.miller, color: "bg-purple-100 border-purple-300"},
              {formula: "Hamwi", value: idealWeight.hamwi, color: "bg-orange-100 border-orange-300"}
            ].map((item, index) => (
              <motion.div 
                key={item.formula}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`${item.color} p-3 rounded-lg shadow-sm border`}
              >
                <div className="font-medium text-gray-600 text-sm">{item.formula}</div>
                <div className="text-xl font-semibold text-gray-800">
                  {item.value} {unit === "metric" ? "kg" : "lbs"}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-4 border-t border-gray-200"
          >
            <div className="text-sm text-gray-600">
              <h4 className="font-semibold mb-2">About these formulas:</h4>
              <ul className="space-y-1 list-disc pl-5">
                <li><span className="font-medium">Devine:</span> Developed in 1974 for calculating medication dosages</li>
                <li><span className="font-medium">Robinson:</span> Created in 1983 as a modification of the Devine formula</li>
                <li><span className="font-medium">Miller:</span> Developed in 1983 with generally higher weight estimates</li>
                <li><span className="font-medium">Hamwi:</span> Created in 1964, widely used for quick weight estimates</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Note: These formulas provide estimates only. Ideal weight varies based on factors like body composition, fitness level, and overall health.
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8">
            <SaveResultButton
              recordType="weight"
              value={idealWeight.average}
              disabled={!idealWeight}
            />
          </div>
        </motion.div>
      )}
    </CalculatorCard>
  );
};

export default IdealWeightCalculator; 