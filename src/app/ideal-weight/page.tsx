import Navbar from "@/components/Navbar";
import IdealWeightCalculator from "@/components/IdealWeightCalculator";

export const metadata = {
  title: "Ideal Weight Calculator - HealthCalc",
  description: "Calculate your ideal body weight based on your height and gender using multiple formulas.",
};

export default function IdealWeightPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Ideal Weight Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Find your ideal weight range based on your height and gender 
            using several different medical formulas.
          </p>
        </div>

        <IdealWeightCalculator />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About the Ideal Weight Formulas
          </h2>
          <p className="text-gray-600 mb-4">
            This calculator uses several established formulas to estimate ideal
            body weight. Each formula has a slightly different approach:
          </p>
          <div className="text-gray-600 space-y-3">
            <div>
              <h3 className="font-medium">Devine Formula (1974)</h3>
              <p>Originally developed for calculating drug dosages, this formula is commonly used in medicine.</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Male: 50 kg + 2.3 kg per inch over 5 feet</li>
                <li>Female: 45.5 kg + 2.3 kg per inch over 5 feet</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Robinson Formula (1983)</h3>
              <p>A slight variation on the Devine formula with different base weights.</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Male: 52 kg + 1.9 kg per inch over 5 feet</li>
                <li>Female: 49 kg + 1.7 kg per inch over 5 feet</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Miller Formula (1983)</h3>
              <p>Another variation that generally results in higher ideal weights.</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Male: 56.2 kg + 1.41 kg per inch over 5 feet</li>
                <li>Female: 53.1 kg + 1.36 kg per inch over 5 feet</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Hamwi Formula (1964)</h3>
              <p>One of the oldest and most widely known formulas.</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Male: 48 kg + 2.7 kg per inch over 5 feet</li>
                <li>Female: 45.5 kg + 2.2 kg per inch over 5 feet</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> These formulas provide estimates only and don't account 
              for variations in body composition, frame size, muscle mass, or other individual 
              factors. The "ideal" weight for health can vary significantly from person to person. 
              Always consult healthcare professionals for personalized advice.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 