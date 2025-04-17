import Navbar from "@/components/Navbar";
import BloodPressureCalculator from "@/components/BloodPressureCalculator";

export const metadata = {
  title: "Blood Pressure Calculator - HealthCalc",
  description: "Check your blood pressure category and understand what your numbers mean.",
};

export default function BloodPressurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Blood Pressure Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Enter your blood pressure readings to determine your category according to 
            the American Heart Association guidelines and understand what your numbers mean.
          </p>
        </div>

        <BloodPressureCalculator />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Understanding Blood Pressure
          </h2>
          <p className="text-gray-600 mb-4">
            Blood pressure is the force of blood pushing against the walls of your arteries. 
            It's measured using two numbers: systolic (the pressure when your heart beats) and 
            diastolic (the pressure when your heart rests between beats).
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            What Do Blood Pressure Numbers Mean?
          </h3>
          <div className="space-y-3 text-gray-600 mb-6">
            <p>
              <strong className="text-gray-800">Systolic (top number):</strong> This indicates how much 
              pressure your blood is exerting against your artery walls when your heart beats.
            </p>
            <p>
              <strong className="text-gray-800">Diastolic (bottom number):</strong> This indicates how much 
              pressure your blood is exerting against your artery walls while your heart is resting between beats.
            </p>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tips for Managing Blood Pressure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Lifestyle Changes</h4>
              <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                <li>Maintain a healthy weight</li>
                <li>Exercise regularly (aim for 150 minutes/week)</li>
                <li>Eat a heart-healthy diet (DASH diet)</li>
                <li>Reduce sodium intake (aim for less than 1,500mg/day)</li>
                <li>Limit alcohol consumption</li>
                <li>Quit smoking</li>
                <li>Manage stress through meditation, yoga, etc.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">When to Seek Medical Attention</h4>
              <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                <li>If your readings are consistently above 140/90 mmHg</li>
                <li>If you get a reading above 180/120 mmHg (wait 5 minutes and test again)</li>
                <li>If high reading is accompanied by symptoms like chest pain, difficulty breathing, or visual changes</li>
                <li>If you're taking blood pressure medication and readings remain high</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              How to Take Accurate Blood Pressure Readings
            </h3>
            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
              <li>Sit quietly for 5 minutes before measuring</li>
              <li>Use the bathroom beforehand if needed</li>
              <li>Don't smoke, exercise, or consume caffeine within 30 minutes of measurement</li>
              <li>Sit with back straight and supported, feet flat on the floor</li>
              <li>Support your arm on a flat surface at heart level</li>
              <li>Place the cuff directly on bare skin, not over clothing</li>
              <li>Don't talk during the measurement</li>
              <li>Take 2-3 readings, 1 minute apart, and record the average</li>
              <li>Measure at the same time of day when possible</li>
            </ol>
            <p className="mt-3 text-xs text-gray-500">
              Remember that a single elevated reading doesn't necessarily mean you have high blood pressure. 
              Blood pressure fluctuates throughout the day and can be affected by many factors. 
              For diagnosis, healthcare providers typically take multiple readings over time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 