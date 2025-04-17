import Navbar from "@/components/Navbar";
import WaterIntakeCalculator from "@/components/WaterIntakeCalculator";

export const metadata = {
  title: "Water Intake Calculator - HealthCalc",
  description: "Calculate your daily water intake needs based on your weight and activity level.",
};

export default function WaterIntakePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Water Intake Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Estimate how much water you should drink each day based on your weight,
            activity level, and climate.
          </p>
        </div>

        <WaterIntakeCalculator />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Why Water is Important
          </h2>
          <p className="text-gray-600 mb-4">
            Water is essential for nearly every bodily function. It helps regulate body 
            temperature, lubricates joints, delivers nutrients to cells, and keeps organs 
            functioning properly. Staying well-hydrated also helps with cognitive function, 
            physical performance, and overall well-being.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Signs of Dehydration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Mild to Moderate</h4>
              <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                <li>Thirst</li>
                <li>Dry or sticky mouth</li>
                <li>Darker yellow urine</li>
                <li>Headache</li>
                <li>Muscle cramps</li>
                <li>Fatigue</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Severe</h4>
              <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                <li>Extreme thirst</li>
                <li>Very dry mouth</li>
                <li>Little or no urination</li>
                <li>Rapid heartbeat</li>
                <li>Rapid breathing</li>
                <li>Dizziness or lightheadedness</li>
                <li>Confusion</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tips for Staying Hydrated
          </h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
            <li>Carry a reusable water bottle with you throughout the day</li>
            <li>Set reminders to drink water regularly</li>
            <li>Drink a glass of water before each meal</li>
            <li>Add natural flavors like lemon, cucumber, or berries to your water</li>
            <li>Eat foods with high water content (e.g., fruits, vegetables, soups)</li>
            <li>Drink water before, during, and after exercise</li>
            <li>Replace electrolytes after intense sweating with sports drinks or electrolyte tablets</li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              About This Calculator
            </h3>
            <p className="text-gray-600 text-sm">
              This calculator uses your weight as the primary factor for estimating water needs, 
              then adjusts based on activity level and climate. The general guideline is approximately 
              30-35ml of water per kg of body weight, adjusted for individual factors. 
              <br /><br />
              Remember that these are estimates, and your actual needs may vary. Always listen to 
              your body and consult with healthcare professionals, especially if you have medical 
              conditions that affect water balance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 