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
  const [map, setMap] = useState<number | null>(null);
  const [pulse, setPulse] = useState("");

  const calculateCategory = () => {
    if (!systolic || !diastolic) return;

    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    // Calculate Mean Arterial Pressure (MAP)
    // MAP = (SBP + 2 × DBP) ÷ 3
    const calculatedMap = Math.round((sys + (2 * dia)) / 3);
    setMap(calculatedMap);

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
    setPulse("");
    setCategory("");
    setMap(null);
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

  // Get information about MAP
  const getMapInfo = () => {
    if (!map) return "";
    
    if (map < 70) {
      return "MAP below 70 mmHg may indicate low blood pressure, which can lead to inadequate blood flow to vital organs.";
    } else if (map >= 70 && map <= 100) {
      return "MAP between 70-100 mmHg is generally considered normal for adults.";
    } else {
      return "MAP above 100 mmHg suggests elevated blood pressure, which may require monitoring or treatment.";
    }
  };

  // Get color for MAP value
  const getMapColor = () => {
    if (!map) return "text-gray-800";
    
    if (map < 70) {
      return "text-blue-600";
    } else if (map >= 70 && map <= 100) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <CalculatorCard 
      title="Blood Pressure Calculator" 
      description="Check your blood pressure category and calculate Mean Arterial Pressure"
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">
            Pulse Rate (optional)
          </label>
          <input
            type="number"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 72"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your heart rate in beats per minute
          </p>
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
              >
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold mb-1 tracking-tight">
                    {systolic}/{diastolic}
                  </div>
                  <div className="text-sm text-gray-600">mmHg</div>
                  
                  {pulse && (
                    <div className="mt-3">
                      <div className="text-2xl font-semibold text-blue-600">{pulse}</div>
                      <div className="text-xs text-gray-500">Pulse (BPM)</div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
              
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <span className="text-lg font-medium">Your blood pressure is </span>
              <span className={`text-xl font-bold ${getCategoryColor()}`}>
                {category}
              </span>
            </motion.div>
              
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-gray-600 max-w-3xl text-center"
            >
              {getCategoryInfo()}
            </motion.div>
            
            {map && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-4 bg-white rounded-lg shadow-md max-w-md w-full"
              >
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Mean Arterial Pressure (MAP)</h4>
                  <div className={`text-3xl font-bold ${getMapColor()} mb-2`}>
                    {map} mmHg
                  </div>
                  <p className="text-sm text-gray-600">
                    {getMapInfo()}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    MAP = (Systolic BP + 2 × Diastolic BP) ÷ 3
                  </div>
                </div>
              </motion.div>
            )}
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-gray-800 mb-4">What These Results Mean</h4>
              <p className="text-gray-600 text-sm mb-3">
                Blood pressure is a measure of the force of blood pushing against the walls of your arteries as your heart pumps blood.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><span className="font-medium">Systolic (top number):</span> Pressure when the heart beats</li>
                <li><span className="font-medium">Diastolic (bottom number):</span> Pressure when the heart rests</li>
                <li><span className="font-medium">Mean Arterial Pressure (MAP):</span> Average pressure in your arteries during one cardiac cycle</li>
              </ul>
            </div>
              
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {category === "Low Blood Pressure" && (
                  <>
                    <li>Stay hydrated and avoid standing up too quickly</li>
                    <li>Increase your salt intake slightly (consult your doctor first)</li>
                    <li>Wear compression stockings if recommended by your doctor</li>
                  </>
                )}
                {(category === "Normal" || category === "Elevated") && (
                  <>
                    <li>Maintain a healthy diet low in sodium</li>
                    <li>Exercise regularly (aim for 150 minutes per week)</li>
                    <li>Limit alcohol consumption and avoid tobacco</li>
                  </>
                )}
                {(category === "Hypertension Stage 1" || category === "Hypertension Stage 2") && (
                  <>
                    <li>Reduce sodium intake (less than 1,500mg per day)</li>
                    <li>Exercise regularly and maintain a healthy weight</li>
                    <li>Consult with a healthcare provider about medication</li>
                  </>
                )}
                {category === "Hypertensive Crisis" && (
                  <>
                    <li className="text-red-600 font-medium">Seek immediate medical attention</li>
                    <li>Call emergency services (911) if experiencing symptoms</li>
                    <li>Do not drive yourself to the hospital</li>
                  </>
                )}
              </ul>
            </div>
          </div>
            
          <div className="mt-12 flex justify-center">
            <SaveResultButton
              recordType="blood_pressure"
              recordValue={`${systolic}/${diastolic}`}
              recordNote={`Category: ${category}${pulse ? `, Pulse: ${pulse}` : ''}${map ? `, MAP: ${map}` : ''}`}
            />
          </div>
        </motion.div>
      )}

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
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">About Mean Arterial Pressure (MAP)</h4>
        <p className="text-sm text-gray-600 mb-2">
          Mean Arterial Pressure (MAP) is a key indicator of overall perfusion (blood flow) to your organs. 
          It represents the average pressure in your arteries during one cardiac cycle and is weighted more toward 
          diastolic pressure because your heart spends more time in diastole than systole.
        </p>
        <div className="text-sm text-gray-600">
          <strong>Normal MAP Range:</strong> 70-100 mmHg for adults
        </div>
        <p className="text-sm text-gray-600 mt-2">
          MAP is particularly important in critical care settings as it provides insight into the 
          adequacy of blood supply to vital organs. A MAP below 60 mmHg can lead to inadequate organ perfusion, 
          while a consistently elevated MAP may indicate hypertension requiring treatment.
        </p>
      </div>
    </CalculatorCard>
  );
};

export default BloodPressureCalculator; 