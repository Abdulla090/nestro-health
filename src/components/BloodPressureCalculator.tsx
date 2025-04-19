"use client";

import { useState } from "react";
import CalculatorCard from "./CalculatorCard";
import SaveResultButton from "./SaveResultButton";
import { motion } from "framer-motion";

const BloodPressureCalculator = () => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [category, setCategory] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateCategory = () => {
    if (!systolic || !diastolic) return;

    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (sys < 90 || dia < 60) {
      setCategory("Low Blood Pressure");
    } else if (sys < 120 && dia < 80) {
      setCategory("Normal");
    } else if ((sys >= 120 && sys <= 129) && dia < 80) {
      setCategory("Elevated");
    } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      setCategory("Hypertension Stage 1");
    } else if ((sys >= 140 && sys <= 180) || (dia >= 90 && dia <= 120)) {
      setCategory("Hypertension Stage 2");
    } else if (sys > 180 || dia > 120) {
      setCategory("Hypertensive Crisis");
    } else {
      setCategory("Invalid Values");
    }

    setShowResults(true);
  };

  const handleReset = () => {
    setSystolic("");
    setDiastolic("");
    setCategory("");
    setShowResults(false);
  };

  // Determine text color based on blood pressure category
  const getCategoryColor = () => {
    switch (category) {
      case "Low Blood Pressure":
        return "text-blue-600";
      case "Normal":
        return "text-green-600";
      case "Elevated":
        return "text-yellow-600";
      case "Hypertension Stage 1":
        return "text-orange-600";
      case "Hypertension Stage 2":
        return "text-red-600";
      case "Hypertensive Crisis":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  // Get information about the current blood pressure category
  const getCategoryInfo = () => {
    switch (category) {
      case "Low Blood Pressure":
        return "Blood pressure lower than 90/60 mmHg. May cause dizziness, fainting, and in severe cases, shock.";
      case "Normal":
        return "Your blood pressure is considered normal. Continue with a healthy lifestyle to maintain it.";
      case "Elevated":
        return "Higher than normal blood pressure but not yet hypertension. Risk of developing hypertension without lifestyle changes.";
      case "Hypertension Stage 1":
        return "Blood pressure consistently ranging from 130-139 systolic or 80-89 diastolic. Doctors are likely to prescribe lifestyle changes and may consider medication.";
      case "Hypertension Stage 2":
        return "Blood pressure consistently ranging from 140/90 mmHg or higher. Doctors are likely to prescribe a combination of medications and lifestyle changes.";
      case "Hypertensive Crisis":
        return "Blood pressure severely elevated (above 180/120 mmHg). Contact your doctor immediately or go to the emergency room if you are also experiencing symptoms like chest pain, shortness of breath, numbness/weakness, or difficulty speaking.";
      default:
        return "";
    }
  };

  return (
    <CalculatorCard 
      title="Blood Pressure Calculator" 
      description="Check your blood pressure category"
    >
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset="70"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600">Blood Pressure</span>
              <span className="text-3xl font-bold text-gray-800">
                {systolic ? systolic : "---"}/{diastolic ? diastolic : "---"}
              </span>
              <span className="text-sm text-gray-600">mmHg</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Systolic (top number)
            </label>
            <input
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 120"
            />
            <p className="text-xs text-gray-500 mt-1">
              The pressure when your heart beats
            </p>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Diastolic (bottom number)
            </label>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 80"
            />
            <p className="text-xs text-gray-500 mt-1">
              The pressure when your heart rests
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={calculateCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Check Category
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      {showResults && (
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
            Your Blood Pressure Results
          </motion.h3>
          
          <div className="flex flex-col items-center mb-12">
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
                style={{ borderColor: getCategoryColor(), borderWidth: '4px' }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg text-gray-500 mb-2">Blood Pressure</span>
                  <span className={`font-bold ${
                    systolic.length + diastolic.length > 7 
                      ? 'text-4xl' 
                      : systolic.length + diastolic.length > 6 
                        ? 'text-5xl'
                        : systolic.length + diastolic.length > 5 
                          ? 'text-6xl' 
                          : 'text-8xl'
                  }`} style={{ color: getCategoryColor() }}>{systolic}/{diastolic}</span>
                  <span className="text-2xl font-medium" style={{ color: getCategoryColor() }}>{category}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Blood Pressure Categories</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Systolic</th>
                    <th className="px-3 py-2 text-left">Diastolic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 text-blue-600">Low</td>
                    <td className="px-3 py-2">&lt; 90</td>
                    <td className="px-3 py-2">and &lt; 60</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-green-600">Normal</td>
                    <td className="px-3 py-2">&lt; 120</td>
                    <td className="px-3 py-2">and &lt; 80</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-yellow-600">Elevated</td>
                    <td className="px-3 py-2">120-129</td>
                    <td className="px-3 py-2">and &lt; 80</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-orange-600">Hypertension Stage 1</td>
                    <td className="px-3 py-2">130-139</td>
                    <td className="px-3 py-2">or 80-89</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-red-600">Hypertension Stage 2</td>
                    <td className="px-3 py-2">≥ 140</td>
                    <td className="px-3 py-2">or ≥ 90</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-red-800">Hypertensive Crisis</td>
                    <td className="px-3 py-2">&gt; 180</td>
                    <td className="px-3 py-2">and/or &gt; 120</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Reference: American Heart Association (AHA) guidelines
            </p>
          </div>

          <div className="mt-5 text-xs text-gray-500">
            <p>
              <strong>Note:</strong> This calculator provides an estimate based on a single reading. 
              Blood pressure diagnosis should be made by a healthcare provider based on multiple readings 
              over time. Always consult with a healthcare professional for proper diagnosis and treatment.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <SaveResultButton
              recordType="blood_pressure"
              value={parseInt(systolic)}
              value2={parseInt(diastolic)}
              disabled={!systolic || !diastolic}
            />
          </div>
        </motion.div>
      )}
    </CalculatorCard>
  );
};

export default BloodPressureCalculator; 