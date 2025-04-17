import Navbar from "@/components/Navbar";
import CalorieCalculator from "@/components/CalorieCalculator";

export const metadata = {
  title: "Calorie Calculator - HealthCalc",
  description: "Calculate your daily calorie needs with our accurate calorie calculator.",
};

export default function CaloriePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Daily Calorie Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Estimate how many calories you burn daily based on your age, gender, 
            height, weight, and activity level to help manage your weight.
          </p>
        </div>

        <CalorieCalculator />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Understanding Your Caloric Needs
          </h2>
          <p className="text-gray-600 mb-4">
            Your body needs calories to sustain basic functions like breathing, 
            pumping blood, and cell production (Basal Metabolic Rate or BMR), 
            as well as to fuel daily activities and exercise. The calculator 
            above estimates your total daily energy expenditure based on the 
            Mifflin-St Jeor equation, which is considered one of the most 
            accurate formulas.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            How to Use This Information
          </h2>
          <div className="text-gray-600">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Weight Maintenance:</strong> Consuming approximately the 
                estimated calories should maintain your current weight.
              </li>
              <li>
                <strong>Weight Loss:</strong> Consuming fewer calories than your 
                daily needs (typically 500 fewer per day) can lead to weight loss 
                of about 0.5 kg (1 lb) per week.
              </li>
              <li>
                <strong>Weight Gain:</strong> Consuming more calories than your 
                daily needs (typically 500 more per day) can lead to weight gain 
                of about 0.5 kg (1 lb) per week.
              </li>
            </ul>
            <p className="mt-4">
              Remember that these are estimates and individual needs may vary. 
              For personalized advice, consult with a healthcare professional or 
              registered dietitian.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 