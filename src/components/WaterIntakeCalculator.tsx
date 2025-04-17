"use client";

import { useState } from "react";
import CalculatorCard from "./CalculatorCard";
import SaveResultButton from "./SaveResultButton";

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [climate, setClimate] = useState("moderate");
  const [unit, setUnit] = useState("metric");
  const [waterIntake, setWaterIntake] = useState<{
    ml: number;
    oz: number;
    cups: number;
  } | null>(null);

  const activityLevels = {
    sedentary: { label: "Sedentary (little or no exercise)", factor: 0.3 },
    light: { label: "Lightly active (light exercise 1-3 days/week)", factor: 0.35 },
    moderate: { label: "Moderately active (moderate exercise 3-5 days/week)", factor: 0.4 },
    active: { label: "Very active (hard exercise 6-7 days/week)", factor: 0.45 },
    extraActive: { label: "Extra active (very hard exercise & physical job)", factor: 0.5 },
  };

  const climateFactors = {
    cold: { label: "Cold", factor: 0.8 },
    moderate: { label: "Moderate", factor: 1.0 },
    hot: { label: "Hot/Humid", factor: 1.2 },
  };

  const calculateWaterIntake = () => {
    if (!weight) return;

    let weightInKg = parseFloat(weight);
    
    // Convert from lbs to kg if imperial
    if (unit === "imperial") {
      weightInKg = parseFloat(weight) * 0.453592;
    }

    // Base calculation: weight in kg * activity factor
    const activityFactor = activityLevels[activityLevel as keyof typeof activityLevels].factor;
    const climateFactor = climateFactors[climate as keyof typeof climateFactors].factor;
    
    // Calculate water in milliliters
    const waterInMl = Math.round(weightInKg * 33 * activityFactor * climateFactor);
    
    // Convert to other units
    const waterInOz = Math.round(waterInMl / 29.574);
    const waterInCups = Math.round(waterInOz / 8);

    setWaterIntake({
      ml: waterInMl,
      oz: waterInOz,
      cups: waterInCups,
    });
  };

  const handleReset = () => {
    setWeight("");
    setWaterIntake(null);
  };

  return (
    <CalculatorCard 
      title="Water Intake Calculator" 
      description="Estimate your daily water needs"
    >
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={unit === "metric"}
                onChange={() => setUnit("metric")}
              />
              <span className="ml-2">Metric (kg)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={unit === "imperial"}
                onChange={() => setUnit("imperial")}
              />
              <span className="ml-2">Imperial (lbs)</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(activityLevels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Climate</label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(climateFactors).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={calculateWaterIntake}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Water Intake
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      {waterIntake && (
        <div className="mt-6 p-4 border rounded-md bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
            Your Daily Water Recommendation
          </h3>
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"></path>
              </svg>
              <div className="absolute text-2xl font-bold text-white">{waterIntake.cups}</div>
            </div>
            <div className="mt-2 text-lg font-medium text-gray-700">cups per day</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">Milliliters</div>
              <div className="text-xl font-bold text-blue-600">{waterIntake.ml} ml</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">Fluid Ounces</div>
              <div className="text-xl font-bold text-blue-600">{waterIntake.oz} oz</div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Keep in mind:</strong> This is a general recommendation. Your water needs may vary based on:
            </p>
            <ul className="list-disc pl-5">
              <li>Your overall health</li>
              <li>Pregnancy or breastfeeding (which increases needs)</li>
              <li>Any medications you're taking</li>
              <li>Specific health conditions</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Remember that you also get water from many foods, especially fruits and vegetables.
              Monitor your hydration by checking that your urine is pale yellow to clear in color.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <SaveResultButton
              recordType="water"
              value={waterIntake.ml}
              disabled={!waterIntake}
            />
          </div>
        </div>
      )}
    </CalculatorCard>
  );
};

export default WaterIntakeCalculator; 