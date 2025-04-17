import Navbar from "@/components/Navbar";
import BmiCalculator from "@/components/BmiCalculator";

export const metadata = {
  title: "BMI Calculator - HealthCalc",
  description: "Calculate your Body Mass Index using our simple BMI calculator.",
};

export default function BmiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Page Header */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                BMI Calculator
              </h1>
              <p className="text-xl text-gray-600">
                Body Mass Index (BMI) is a value derived from your height and weight.
                It's a widely used measure to identify weight categories that may lead
                to health problems.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 40">
              <path fill="#f8fafc" fillOpacity="1" d="M0,0L48,5.3C96,11,192,21,288,21.3C384,21,480,11,576,10.7C672,11,768,21,864,26.7C960,32,1056,32,1152,29.3C1248,27,1344,21,1392,18.7L1440,16L1440,40L1392,40C1344,40,1248,40,1152,40C1056,40,960,40,864,40C768,40,672,40,576,40C480,40,384,40,288,40C192,40,96,40,48,40L0,40Z"></path>
            </svg>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <BmiCalculator />
        </div>
        
        {/* Information Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding BMI
            </h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                About BMI
              </h3>
              <p className="text-gray-600 mb-4">
                BMI is a simple calculation based on a person's weight and height. The formula is:
                BMI = weight(kg) / height²(m²). While BMI doesn't measure body fat directly, it provides
                a reasonable indication of whether someone is underweight, normal weight, overweight, or obese.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                BMI Categories
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI range</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">Underweight</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Below 18.5</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">Normal weight</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">18.5 – 24.9</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">Overweight</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">25.0 – 29.9</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">Obesity (Class I)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">30.0 – 34.9</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">Obesity (Class II)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">35.0 – 39.9</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">Obesity (Class III)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">40.0 or higher</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                BMI Limitations
              </h3>
              <p className="text-gray-600">
                BMI is a useful general guideline, but it has some limitations. It may overestimate body fat
                in athletes with high muscle mass, and it may underestimate body fat in older persons or those
                who have lost muscle mass. BMI doesn't account for factors like age, sex, ethnicity, or muscle
                mass. It also doesn't indicate the distribution of fat, which is important when assessing
                health risks.
              </p>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    <strong>Note:</strong> BMI is just one measure of health and should be used alongside other assessments. 
                    Always consult with a healthcare professional for proper interpretation of your BMI results.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 