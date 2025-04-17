import Navbar from "@/components/Navbar";
import BodyFatCalculator from "@/components/BodyFatCalculator";

export const metadata = {
  title: "Body Fat Calculator - HealthCalc",
  description: "Calculate your body fat percentage using the U.S. Navy method.",
};

export default function BodyFatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Body Fat Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Estimate your body fat percentage using the U.S. Navy circumference method. 
            This method uses measurements of your neck, waist, and height (and hips for women).
          </p>
        </div>

        <BodyFatCalculator />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About Body Fat Percentage
          </h2>
          <p className="text-gray-600 mb-4">
            Body fat percentage is the total mass of fat divided by total body mass. 
            It includes essential fat (necessary for basic health) and storage fat.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            The U.S. Navy Method
          </h3>
          <p className="text-gray-600 mb-4">
            This calculator uses the U.S. Navy circumference method, which measures 
            specific body parts to estimate body fat. While not as accurate as methods 
            like DEXA scans or hydrostatic weighing, it provides a reasonable estimate 
            when performed correctly.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            How to Take Measurements
          </h3>
          <div className="text-gray-600 space-y-2">
            <p><strong>Neck:</strong> Measure just below the larynx (Adam's apple) with the tape sloping downward.</p>
            <p><strong>Waist:</strong> Measure at the narrowest point, usually just above the belly button.</p>
            <p><strong>Hips (women only):</strong> Measure at the widest point around the buttocks.</p>
            <p className="italic mt-1 text-sm">For best results, use a flexible tape measure and take measurements in the morning.</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Understanding Your Results
            </h3>
            <p className="text-gray-600 mb-2">
              Body fat percentage varies by age, gender, and fitness level. While there's 
              no perfect percentage, here are some general categories:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800">Men</h4>
                <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                  <li><strong>Essential fat:</strong> 2-5%</li>
                  <li><strong>Athletes:</strong> 6-13%</li>
                  <li><strong>Fitness:</strong> 14-17%</li>
                  <li><strong>Average:</strong> 18-24%</li>
                  <li><strong>Obese:</strong> 25% and higher</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Women</h4>
                <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                  <li><strong>Essential fat:</strong> 10-13%</li>
                  <li><strong>Athletes:</strong> 14-20%</li>
                  <li><strong>Fitness:</strong> 21-24%</li>
                  <li><strong>Average:</strong> 25-31%</li>
                  <li><strong>Obese:</strong> 32% and higher</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 