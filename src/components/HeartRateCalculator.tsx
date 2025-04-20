"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HeartRateCalculator = () => {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [maxHeartRate, setMaxHeartRate] = useState<number | null>(null);
  const [zones, setZones] = useState<{name: string; range: string; bpm: string; purpose: string; color: string}[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formula, setFormula] = useState<'tanaka' | 'gulati' | 'traditional'>('tanaka');
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  // Heart rate zones as percentages of MHR with more detailed explanations and colors
  const zoneDefinitions = [
    { 
      name: "Zone 1 - Very Light", 
      min: 50, 
      max: 60, 
      purpose: "Perfect for warm-ups, recovery days, and building basic endurance. Feels like easy breathing, you can easily hold a conversation.",
      color: "rgba(75, 192, 192, 0.8)" // Teal
    },
    { 
      name: "Zone 2 - Light", 
      min: 60, 
      max: 70, 
      purpose: "Great for improving fat burning and aerobic fitness. You're breathing harder but can still talk in complete sentences.",
      color: "rgba(54, 162, 235, 0.8)" // Blue
    },
    { 
      name: "Zone 3 - Moderate", 
      min: 70, 
      max: 80, 
      purpose: "Improves aerobic capacity and efficiency. You're breathing heavily and conversation becomes more difficult.",
      color: "rgba(255, 206, 86, 0.8)" // Yellow
    },
    { 
      name: "Zone 4 - Hard", 
      min: 80, 
      max: 90, 
      purpose: "Builds anaerobic threshold and speed endurance. You're breathing very hard and can only speak in short phrases.",
      color: "rgba(255, 99, 132, 0.8)" // Red
    },
    { 
      name: "Zone 5 - Maximum", 
      min: 90, 
      max: 100, 
      purpose: "For developing maximum performance and speed. You're at your limit and can barely speak. Use sparingly.",
      color: "rgba(153, 102, 255, 0.8)" // Purple
    }
  ];

  const calculateHeartRateZones = () => {
    setIsCalculating(true);
    
    // Short timeout to show loading state
    setTimeout(() => {
      if (typeof age === 'number' && !isNaN(age) && age > 0) {
        // Calculate MHR based on selected formula and gender
        let mhr = 0;
        
        if (formula === 'tanaka') {
          // Tanaka formula: MHR = 208 - 0.7 × Age (same for both genders)
          mhr = Math.round(208 - (0.7 * age));
        } else if (formula === 'gulati') {
          if (gender === 'female') {
            // Gulati formula for females: MHR = 206 - 0.88 × Age
            mhr = Math.round(206 - (0.88 * age));
          } else {
            // Use Tanaka formula for men as Gulati is female-specific
            mhr = Math.round(208 - (0.7 * age));
          }
        } else if (formula === 'traditional') {
          // Traditional formula: MHR = 220 - Age
          mhr = Math.round(220 - age);
        }
        
        setMaxHeartRate(mhr);
        
        const calculatedZones = zoneDefinitions.map(zone => {
          const minBPM = Math.round(mhr * (zone.min / 100));
          const maxBPM = Math.round(mhr * (zone.max / 100));
          return {
            name: zone.name,
            range: `${zone.min}%-${zone.max}%`,
            bpm: `${minBPM}-${maxBPM}`,
            purpose: zone.purpose,
            color: zone.color
          };
        });
        
        setZones(calculatedZones);
      } else {
        setMaxHeartRate(null);
        setZones([]);
      }
      setIsCalculating(false);
    }, 500);
  };

  const chartData = {
    labels: zones.map(zone => zone.name.split('-')[1].trim()),
    datasets: [
      {
        label: 'Heart Rate Zones (BPM)',
        data: zones.map(zone => {
          const [min, max] = zone.bpm.split('-').map(Number);
          return max - min;
        }),
        backgroundColor: zones.map(zone => zone.color),
        borderColor: zones.map(zone => zone.color.replace('0.8', '1')),
        borderWidth: 1,
        base: zones.map(zone => Number(zone.bpm.split('-')[0])),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Heart Rate (BPM)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Training Zones',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            return `${zones[index]?.bpm || ''} BPM`;
          },
          title: function(context: any) {
            const index = context[0].dataIndex;
            return zones[index]?.name || '';
          },
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            return `Purpose: ${zones[index]?.purpose || ''}`;
          }
        }
      }
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAge('');
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 120) {
        setAge(numValue);
      }
    }
  };

  const handleReset = () => {
    setAge('');
    setMaxHeartRate(null);
    setZones([]);
  };

  const getFormulaDescription = () => {
    switch (formula) {
      case 'tanaka':
        return "Tanaka formula (MHR = 208 - 0.7 × Age) - Accurate for both men and women across different ages";
      case 'gulati':
        return gender === 'female' 
          ? "Gulati formula for women (MHR = 206 - 0.88 × Age) - More accurate for females" 
          : "Tanaka formula (MHR = 208 - 0.7 × Age) - Used for men as Gulati is female-specific";
      case 'traditional':
        return "Traditional formula (MHR = 220 - Age) - Less accurate but widely known";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Heart Rate Zone Calculator</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              Heart rate zones help you optimize your workout efficiency by targeting specific training goals.
              We provide multiple formulas to calculate your maximum heart rate, with options that are specific to gender.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your Age (years)
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleAgeChange}
                min="1"
                max="120"
                placeholder="Age (1-120)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Gender
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-pink-600"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Formula
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`border rounded-md p-3 cursor-pointer ${formula === 'tanaka' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input 
                  type="radio" 
                  className="sr-only"
                  checked={formula === 'tanaka'} 
                  onChange={() => setFormula('tanaka')} 
                />
                <div className="text-sm font-medium">Tanaka Formula</div>
                <div className="text-xs text-gray-500">Most accurate across all ages</div>
              </label>
              <label className={`border rounded-md p-3 cursor-pointer ${formula === 'gulati' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input 
                  type="radio" 
                  className="sr-only"
                  checked={formula === 'gulati'} 
                  onChange={() => setFormula('gulati')} 
                />
                <div className="text-sm font-medium">Gulati Formula</div>
                <div className="text-xs text-gray-500">More accurate for women</div>
              </label>
              <label className={`border rounded-md p-3 cursor-pointer ${formula === 'traditional' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input 
                  type="radio" 
                  className="sr-only"
                  checked={formula === 'traditional'} 
                  onChange={() => setFormula('traditional')} 
                />
                <div className="text-sm font-medium">Traditional Formula</div>
                <div className="text-xs text-gray-500">220 - Age (widely known)</div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={calculateHeartRateZones}
              disabled={age === '' || isCalculating}
              className={`px-6 py-2 rounded-md font-medium ${
                age === '' || isCalculating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
              }`}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Zones'}
            </button>
            {maxHeartRate && (
              <button
                onClick={handleReset}
                className="px-4 py-2 ml-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {maxHeartRate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-blue-50 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Your Results</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                <div className="text-center bg-white p-4 rounded-lg shadow-sm w-full sm:w-auto">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-500 mb-1">Maximum Heart Rate</p>
                    <p className="text-4xl font-bold text-blue-600">{maxHeartRate} <span className="text-xl">BPM</span></p>
                    <p className="text-xs text-gray-500 mt-1">({getFormulaDescription()})</p>
                  </motion.div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm w-full">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">What this means:</span> Your maximum heart rate is the highest rate your heart should beat during intense exercise.
                    The zones below represent percentages of this maximum value, each optimized for different training goals.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">How to use it:</span> Match your workout intensity to the appropriate zone based on your fitness goals.
                    Monitor your heart rate during exercise using a fitness tracker or heart rate monitor.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Your Heart Rate Zones</h3>
              
              <div className="mb-6">
                <div className="h-80 mb-4">
                  {zones.length > 0 && (
                    <Bar ref={chartRef} data={chartData} options={chartOptions} />
                  )}
                </div>
                <p className="text-sm text-gray-600 text-center italic">
                  Hover/tap on chart bars to see more information about each zone
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensity</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate (BPM)</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {zones.map((zone, index) => (
                      <tr key={index} style={{backgroundColor: `${zone.color.replace('0.8', '0.1')}`}}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: zone.color}}></div>
                            <span className="font-medium text-gray-900">Zone {index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.range}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{zone.bpm}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{zone.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Understanding Heart Rate Training</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Why Train in Different Zones?</h4>
                  <p className="text-sm text-gray-700">
                    Training in specific heart rate zones helps you target different energy systems and physiological adaptations.
                    A well-rounded fitness program should include training across multiple zones to achieve balanced cardiovascular health.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">How To Use These Zones</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    <li><span className="font-medium">Zone 1 (Very Light):</span> Use for warm-ups, cool-downs, recovery days, and building base endurance.</li>
                    <li><span className="font-medium">Zone 2 (Light):</span> Ideal for long, steady workouts that build endurance and improve fat metabolism.</li>
                    <li><span className="font-medium">Zone 3 (Moderate):</span> Good for improving aerobic capacity and efficiency.</li>
                    <li><span className="font-medium">Zone 4 (Hard):</span> For interval training to improve anaerobic threshold and speed endurance.</li>
                    <li><span className="font-medium">Zone 5 (Maximum):</span> Short bursts to improve maximum performance. Use sparingly!</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Tips for Effective Training</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    <li>Use a heart rate monitor or fitness tracker to stay in your target zone.</li>
                    <li>Beginners should focus more on Zones 1-3 to build a foundation.</li>
                    <li>Advanced athletes can incorporate more Zone 4-5 training, but still keep most training in lower zones.</li>
                    <li>Allow adequate recovery between high-intensity sessions.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeartRateCalculator; 