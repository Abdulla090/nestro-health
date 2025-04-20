"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getHealthRecords } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  HomeIcon, 
  ChartBarIcon, 
  ScaleIcon, 
  HeartIcon, 
  FireIcon, 
  BeakerIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Define health record type
interface HealthRecord {
  id?: string;
  profile_id?: string;
  record_type: string;
  record_value: number;
  record_value_2?: number;
  record_date: string;
  created_at?: string;
}

// Define a type for points in charts
interface ChartPoint {
  x: number;
  y: number;
}

// Define a type for color arrays
type RGBColor = [number, number, number];

// Define prop types for BarChart
interface BarChartProps {
  data: number[];
  labels: string[];
  colors: string[];
  title: string;
  unit: string;
}

// Simple chart component
const BarChart: React.FC<BarChartProps> = ({ data, labels, colors, title, unit }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((value, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{labels[index]}</span>
              <span className="font-medium">{value} {unit}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${colors[index % colors.length]}`} 
                style={{ width: `${(value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define prop types for StatCard
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  color: string;
}

// Stat card component for individual stats
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white p-5 rounded-xl shadow-md border-t-4 ${color}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('border', 'bg') + '/20'}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Add type for category
interface Category {
  name: string;
  y: number;
  color: RGBColor;
}

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, updateProfile, signOut } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [chartData, setChartData] = useState({
    bmi: [] as HealthRecord[],
    weight: [] as HealthRecord[],
    calories: [] as HealthRecord[],
    water: [] as HealthRecord[],
    bodyFat: [] as HealthRecord[],
    bloodPressure: [] as HealthRecord[]
  });
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    // Check if we have a profile, redirect to create profile if not
    if (!loading && !profile) {
      console.log('No profile found, redirecting to create-profile');
      
      // Clear any potential redirect flags
      localStorage.removeItem('redirectingToProfile');
      
      // Use direct location change for more reliable redirect
      window.location.href = '/create-profile';
      return;
    }

    const loadProfileData = async () => {
      if (!profile) {
        return;
      }

      console.log('Profile loaded:', profile);
      
      // Clear any redirect flags since we're now on the profile page
      localStorage.removeItem('redirectingToProfile');
      
      setUserName(profile.username || profile.full_name || '');
      
      try {
        // Check if profile has a valid ID before proceeding
        if (!profile.id) {
          console.error('Profile ID is missing or invalid');
          setError('Invalid profile data');
          setLoading(false);
          return;
        }
        
        console.log('Fetching health records for profile ID:', profile.id);
        const { data, error } = await getHealthRecords(profile.id);
        
        if (error) {
          console.error('Error loading health records:', error);
          setError('Failed to load health records');
          setLoading(false);
          return;
        }
        
        console.log(`Loaded ${data?.length || 0} health records`);
        setHealthRecords(data || []);
        
        if (data && data.length > 0) {
          // Process data for charts
          const bmiData = data.filter(r => r.record_type === 'bmi')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
            
          const weightData = data.filter(r => r.record_type === 'weight')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
            
          const caloriesData = data.filter(r => r.record_type === 'calories')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
            
          const waterData = data.filter(r => r.record_type === 'water')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
            
          const bodyFatData = data.filter(r => r.record_type === 'body_fat')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
            
          const bloodPressureData = data.filter(r => r.record_type === 'blood_pressure')
            .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
            .slice(-5);
          
          setChartData({
            bmi: bmiData,
            weight: weightData,
            calories: caloriesData,
            water: waterData,
            bodyFat: bodyFatData,
            bloodPressure: bloodPressureData
          });
        }
      } catch (err: unknown) {
        console.error('Caught error in loadHealthRecords:', err);
        setError(err instanceof Error ? err.message : 'Failed to load health records');
      } finally {
        setLoading(false);
      }
    };
    
    if (profile) {
      loadProfileData();
    }
  }, [profile, loading]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navigateToHome = () => {
    // This function uses router.push to navigate to home
    // The AuthContext state will maintain the profile information
    router.push('/');
  };

  // Format a date nicely
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };

  // Function to export profile as PDF
  const exportToPDF = async () => {
    try {
      setExportLoading(true);
      
      // Create a new jsPDF instance with standard font and LTR for better compatibility
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Set up PDF document properties
      pdf.setProperties({
        title: `${userName} - Health Profile`,
        subject: 'Health Records',
        author: 'Nestro Health',
        creator: 'Nestro Health App'
      });
      
      // Add header with app name
      pdf.setFillColor(59, 130, 246); // Blue color for header
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 35, 'F');
      
      // Add title with user name
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFontSize(22);
      const title = `Nestro Health`;
      pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // Add subtitle with user info
      pdf.setFontSize(14);
      const subtitle = `Health Profile: ${userName}`;
      pdf.text(subtitle, pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
      
      // Start y-position after header with better spacing
      let yPos = 45;
      
      // Add report info
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPos);
      yPos += 12; // Increased spacing
      
      // Add health overview title with fancy styling
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.line(15, yPos, pdf.internal.pageSize.getWidth() - 15, yPos);
      
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text("HEALTH OVERVIEW", pdf.internal.pageSize.getWidth() / 2, yPos + 7, { align: 'center' });
      
      pdf.setLineWidth(0.5);
      pdf.line(15, yPos + 10, pdf.internal.pageSize.getWidth() - 15, yPos + 10);
      
      pdf.setFont('helvetica', 'normal');
      yPos += 22; // Increased spacing
      
      // Enhanced visual stat box with more details - fix text overlap
      const addDetailedStatBox = (
        title: string, 
        value: string, 
        description: string, 
        y: number, 
        color: RGBColor, 
        details: string
      ) => {
        // Base box - increase width slightly for more space
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(15, y, 180, 45, 3, 3, 'F'); // Increased height more
        
        // Colored accent on left side
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(15, y, 7, 45, 'F'); // Match increased height
        
        // Feature title in colored box - change from black to light color
        pdf.setFillColor(50, 50, 50); // Dark gray background instead of black
        pdf.rect(22, y, 40, 8, 'F');
        
        // Title text in white for better contrast
        pdf.setTextColor(255, 255, 255); // White text for better contrast with dark background
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 42, y + 5.5, { align: 'center' });
        
        // Main value (large) - Handle long values by limiting width and adding line breaks if needed
        pdf.setTextColor(0, 0, 0); // Reset text color for the value
        pdf.setFontSize(15); // Slightly smaller to avoid overflow
        
        // Wrap long values to prevent overlap
        const valueLines = pdf.splitTextToSize(value, 55); // Reduce width more to avoid overlap
        pdf.text(valueLines, 32, y + 20); // Moved more left
        pdf.setFont('helvetica', 'normal');
        
        // Last updated info
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(description, 32, y + 35); // Moved down further for better spacing
        
        // Create a clearer separation between value and description sections
        pdf.setDrawColor(220, 220, 220);
        pdf.line(85, y + 5, 85, y + 40); // Move line slightly to the left
        
        // Detailed information about the feature - moved further right with more space
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        const splitDetails = pdf.splitTextToSize(details, 85); // Slightly narrower to prevent edge overflow
        // Ensure the text doesn't overflow by limiting lines if needed
        const maxLines = 4; // Allow one more line
        const truncatedDetails = splitDetails.length > maxLines ? 
          [...splitDetails.slice(0, maxLines - 1), splitDetails[maxLines - 1] + '...'] : 
          splitDetails;
        pdf.text(truncatedDetails, 95, y + 15); // Moved further right
      };
      
      // Define colors for different metrics (in RGB format)
      const colors = {
        bmi: [59, 130, 246] as RGBColor,       // blue
        weight: [16, 185, 129] as RGBColor,    // green
        bodyFat: [249, 115, 22] as RGBColor,   // orange
        calories: [239, 68, 68] as RGBColor,   // red
        water: [6, 182, 212] as RGBColor,      // cyan
        bloodPressure: [139, 92, 246] as RGBColor, // purple
        steps: [102, 178, 255] as RGBColor,     // light blue
        boneMass: [20, 184, 166] as RGBColor,   // teal
        macros: [168, 85, 247] as RGBColor      // purple
      };
      
      // Define detailed descriptions for each feature
      const featureDescriptions = {
        bmi: "Body Mass Index (BMI) measures body fat based on height and weight. It helps classify weight status and potential health risks.",
        weight: "Weight tracking helps monitor changes over time. Combined with other metrics, it provides insights into overall health progress.",
        bodyFat: "Body fat percentage indicates the proportion of fat tissue relative to total body weight. Lower percentages generally indicate better fitness.",
        calories: "Calorie needs vary based on age, weight, height, gender, and activity level. This is your estimated daily requirement.",
        water: "Water intake requirements depend on activity level, climate, and body size. Adequate hydration is essential for overall health.",
        bloodPressure: "Blood pressure readings show systolic/diastolic pressure. Normal levels are important for cardiovascular health.",
        steps: "Steps taken per day help measure physical activity and contribute to overall health.",
        boneMass: "Bone mass is the amount of bone mineral in your skeletal system. It's important for skeletal health and to prevent osteoporosis.",
        macros: "Macronutrients (protein, carbs, and fats) are essential nutrients needed in larger amounts. The right balance supports your fitness goals."
      };
      
      // Check if we need a new page between each major section and before/after adding health metrics
      if (latestBMI) {
        // Check if we need a page break
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        let bmiCategory = "";
        const bmi = latestBMI.record_value;
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi < 25) bmiCategory = "Normal weight";
        else if (bmi < 30) bmiCategory = "Overweight";
        else if (bmi < 35) bmiCategory = "Obesity (Class I)";
        else if (bmi < 40) bmiCategory = "Obesity (Class II)";
        else bmiCategory = "Obesity (Class III)";
        
        // Format the BMI value and category with clear line breaks
        const bmiValue = latestBMI.record_value.toFixed(1);
        const bmiWithCategory = `${bmiValue}\n(${bmiCategory})`;
        
        // Use more descriptive but shorter description to avoid overflow
        const bmiDescription = `${featureDescriptions.bmi}\n${bmiValue}: "${bmiCategory}"`;
        
        addDetailedStatBox(
          'BMI', 
          bmiWithCategory, // Add a line break between value and category
          `Last updated: ${formatDate(latestBMI.record_date)}`,
          yPos,
          colors.bmi,
          bmiDescription // Simplified description that won't wrap as much
        );
        yPos += 50; // Extra spacing for the increased box height
      }
      
      if (latestWeight) {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format with consistent approach for better layout
        const weightValue = `${latestWeight.record_value} kg`;
        
        addDetailedStatBox(
          'Weight', 
          weightValue,
          `Last updated: ${formatDate(latestWeight.record_date)}`,
          yPos,
          colors.weight,
          featureDescriptions.weight
        );
        yPos += 50; // Extra spacing for the increased box height
      }
      
      if (latestBodyFat) {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        let category = "";
        const bf = latestBodyFat.record_value;
        // Simple categorization
        if (bf < 10) category = "Essential fat (very low)";
        else if (bf < 20) category = "Athletic";
        else if (bf < 30) category = "Fitness";
        else if (bf < 35) category = "Average";
        else category = "Obese";
        
        // Format the body fat value and category to avoid long text in one line
        const bfValue = latestBodyFat.record_value.toFixed(1);
        const bfWithCategory = `${bfValue}%\n(${category})`;
        
        addDetailedStatBox(
          'Body Fat', 
          bfWithCategory, // Add a line break between value and category
          `Last updated: ${formatDate(latestBodyFat.record_date)}`,
          yPos,
          colors.bodyFat,
          `${featureDescriptions.bodyFat}\nYour value of ${bfValue}% is considered "${category}".`
        );
        yPos += 50; // Extra spacing for the increased box height
      }
      
      if (latestCalories) {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format with consistent approach for better layout
        const caloriesValue = `${latestCalories.record_value} kcal`;
        
        addDetailedStatBox(
          'Calories', 
          caloriesValue,
          `Last updated: ${formatDate(latestCalories.record_date)}`,
          yPos,
          colors.calories,
          `${featureDescriptions.calories}\nYour daily calorie need is approximately ${latestCalories.record_value} kcal.`
        );
        yPos += 50; // Extra spacing for the increased box height
      }
      
      if (latestWater) {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format with consistent approach for better layout
        const waterValue = `${latestWater.record_value} ml`;
        
        addDetailedStatBox(
          'Water', 
          waterValue,
          `Last updated: ${formatDate(latestWater.record_date)}`,
          yPos,
          colors.water,
          `${featureDescriptions.water}\nYour recommended daily water intake is ${latestWater.record_value} ml.`
        );
        yPos += 50; // Extra spacing for the increased box height
      }
      
      if (latestBloodPressure) {
        // Check if we need a page break
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Parse the blood pressure value (expecting format like "120/80")
        const bpValue = String(latestBloodPressure.record_value);
        const bpParts = bpValue.split('/');
        const formattedBP = bpParts.length === 2 
          ? `${bpParts[0]}/${bpParts[1]} mmHg`
          : `${bpValue} mmHg`;
        
        // Determine blood pressure category
        let bpCategory = '';
        if (bpParts.length === 2) {
          const systolic = parseInt(bpParts[0]);
          const diastolic = parseInt(bpParts[1]);
          
          if (systolic < 120 && diastolic < 80) {
            bpCategory = 'Normal';
          } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
            bpCategory = 'Elevated';
          } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
            bpCategory = 'Stage 1 Hypertension';
          } else if (systolic >= 140 || diastolic >= 90) {
            bpCategory = 'Stage 2 Hypertension';
          } else if (systolic > 180 || diastolic > 120) {
            bpCategory = 'Hypertensive Crisis';
          }
        }
        
        // Display blood pressure with category
        const displayBP = bpCategory 
          ? `${formattedBP}\n${bpCategory}`
          : formattedBP;
          
        // Simplified description
        const bpDescription = featureDescriptions.bloodPressure;
        
        addDetailedStatBox(
          'Blood Pressure',
          displayBP,
          `Last updated: ${formatDate(latestBloodPressure.record_date)}`,
          yPos,
          colors.bloodPressure,
          bpDescription
        );
        yPos += 50;
      }
      
      if (latestSteps) {
        // Check if we need a page break
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format the value to be more readable
        const formattedSteps = Number(latestSteps.record_value).toLocaleString();
        
        // Simplified description to avoid overlap
        const stepsDescription = `${featureDescriptions.steps}\nDaily goal: 10,000 steps`;
        
        addDetailedStatBox(
          'Daily Steps', 
          formattedSteps,
          `Last updated: ${formatDate(latestSteps.record_date)}`,
          yPos,
          colors.steps,
          stepsDescription
        );
        yPos += 50;
      }
      
      if (latestBoneMass) {
        // Check if we need a page break
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format the value to be more readable
        const formattedBoneMass = latestBoneMass.record_value.toFixed(1);
        
        // Simplified description
        const boneMassDescription = `${featureDescriptions.boneMass}\nBone mass is calculated based on weight, height, and gender.`;
        
        addDetailedStatBox(
          'Bone Mass', 
          `${formattedBoneMass} kg`,
          `Last updated: ${formatDate(latestBoneMass.record_date)}`,
          yPos,
          colors.boneMass,
          boneMassDescription
        );
        yPos += 50;
      }

      if (latestMacros) {
        // Check if we need a page break
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Format the value to be more readable
        const formattedCalories = latestMacros.record_value.toLocaleString();
        
        // Calculate approximate macronutrient distribution based on calories
        // Standard distribution: 30% protein, 40% carbs, 30% fat
        const protein = Math.round((latestMacros.record_value * 0.3) / 4); // 4 calories per gram of protein
        const carbs = Math.round((latestMacros.record_value * 0.4) / 4);   // 4 calories per gram of carbs
        const fats = Math.round((latestMacros.record_value * 0.3) / 9);    // 9 calories per gram of fat
        
        // Simplified description with macronutrient breakdown
        const macrosDescription = `${featureDescriptions.macros}\nApproximate daily needs: ${protein}g protein, ${carbs}g carbs, ${fats}g fat.`;
        
        addDetailedStatBox(
          'Macronutrients', 
          `${formattedCalories} kcal`,
          `Last updated: ${formatDate(latestMacros.record_date)}`,
          yPos,
          colors.macros,
          macrosDescription
        );
        yPos += 50;
      }
      
      // If we have no records, show empty state
      if (healthRecords.length === 0) {
        pdf.setFillColor(240, 240, 250);
        pdf.roundedRect(15, yPos, 180, 40, 3, 3, 'F');
        
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text("No health data available yet", pdf.internal.pageSize.getWidth() / 2, yPos + 15, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text("Start using our calculators to track your health metrics", pdf.internal.pageSize.getWidth() / 2, yPos + 25, { align: 'center' });
        yPos += 50;
      }
      
      // Improved BMI chart with better spacing
      if (chartData.bmi.length > 1) {
        // Always add a new page for chart sections to avoid overlap
        pdf.addPage();
        yPos = 20;
        
        // Add charts section header
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.5);
        pdf.line(15, yPos, pdf.internal.pageSize.getWidth() - 15, yPos);
        
        pdf.setTextColor(59, 130, 246);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text("HEALTH TRENDS & VISUALIZATIONS", pdf.internal.pageSize.getWidth() / 2, yPos + 7, { align: 'center' });
        
        pdf.setLineWidth(0.5);
        pdf.line(15, yPos + 10, pdf.internal.pageSize.getWidth() - 15, yPos + 10);
        
        pdf.setFont('helvetica', 'normal');
        yPos += 20;
        
        // Draw BMI chart with better spacing
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text("BMI Trend Analysis", 15, yPos);
        pdf.setFont('helvetica', 'normal');
        
        // Increase chart height for better readability
        pdf.setFillColor(245, 247, 250);
        pdf.roundedRect(15, yPos + 5, 180, 70, 3, 3, 'F');
        
        // Get BMI values and dates for chart
        const bmiValues = chartData.bmi.map(r => r.record_value);
        const bmiDates = chartData.bmi.map(r => formatDate(r.record_date));
        const maxBmi = Math.max(...bmiValues, 25) * 1.1; // Add 10% margin
        
        // Draw chart title and description with more spacing
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text("This chart shows your BMI trend over time. The healthy BMI range is 18.5-24.9.", 105, yPos + 15, { align: 'center' });
        
        // Better positioning for axis labels
        pdf.setFontSize(8);
        pdf.text("BMI", 20, yPos + 35);
        pdf.text("Date", 105, yPos + 65);
        
        // Draw horizontal grid lines with better spacing
        const gridPositions = [18.5, 25, 30, 35];
        gridPositions.forEach(gridValue => {
          const lineY = yPos + 50 - ((gridValue / maxBmi) * 40);
          pdf.setDrawColor(220, 220, 220);
          pdf.setLineDashPattern([2, 2], 0);
          pdf.line(25, lineY, 175, lineY);
          
          // Add label for reference line
          pdf.setFontSize(6);
          pdf.setTextColor(100, 100, 100);
          pdf.text(gridValue.toString(), 22, lineY);
        });
        
        // Reset dash pattern
        pdf.setLineDashPattern([], 0);
        
        // Draw X and Y axes
        pdf.setDrawColor(150, 150, 150);
        pdf.line(25, yPos + 50, 175, yPos + 50); // X-axis
        pdf.line(25, yPos + 10, 25, yPos + 50); // Y-axis
        
        // Calculate bar width based on number of data points
        const barWidth = bmiValues.length <= 3 ? 30 : 140 / bmiValues.length;
        const points: ChartPoint[] = [];
        
        // Prepare data points for trend line
        bmiValues.forEach((bmi, idx) => {
          const barHeight = (bmi / maxBmi) * 40;
          const x = 30 + (idx * barWidth) + (barWidth / 2);
          const y = yPos + 50 - barHeight;
          points.push({ x, y });
        });
        
        // Draw trend line
        pdf.setDrawColor(colors.bmi[0], colors.bmi[1], colors.bmi[2]);
        pdf.setLineWidth(1.5);
        for (let i = 0; i < points.length - 1; i++) {
          pdf.line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
        }
        
        // Draw bars and data points with better spacing
        bmiValues.forEach((bmi, idx) => {
          const barHeight = (bmi / maxBmi) * 40;
          const x = 30 + (idx * barWidth);
          
          // Draw bar
          pdf.setFillColor(colors.bmi[0], colors.bmi[1], colors.bmi[2], 0.3);
          pdf.rect(x, yPos + 50 - barHeight, barWidth - 2, barHeight, 'F');
          
          // Draw data point with better visibility
          pdf.setFillColor(colors.bmi[0], colors.bmi[1], colors.bmi[2]);
          pdf.circle(x + (barWidth / 2), yPos + 50 - barHeight, 2, 'F');
          
          // Add value on top of bar with proper positioning
          pdf.setFontSize(7);
          pdf.setTextColor(0, 0, 0);
          pdf.text(bmi.toFixed(1), x + (barWidth / 2), yPos + 47 - barHeight, { align: 'center' });
          
          // Add date labels with alternating positions to prevent overlap
          pdf.setFontSize(6);
          pdf.setTextColor(100, 100, 100);
          const dateText = bmiDates[idx];
          
          // Alternate date positions based on index to avoid overlap
          if (bmiValues.length > 3) {
            if (idx % 2 === 0) {
              pdf.text(dateText, x + (barWidth / 2), yPos + 55, { align: 'center' });
            } else {
              pdf.text(dateText, x + (barWidth / 2), yPos + 57, { align: 'center' });
            }
          } else {
            pdf.text(dateText, x + (barWidth / 2), yPos + 55, { align: 'center' });
          }
        });
        
        // Add BMI categories with better spacing
        pdf.setFontSize(7);
        const categories: Category[] = [
          { name: "Underweight", y: 18.5, color: [59, 130, 246] as RGBColor },
          { name: "Normal", y: 25, color: [16, 185, 129] as RGBColor },
          { name: "Overweight", y: 30, color: [245, 158, 11] as RGBColor },
          { name: "Obese", y: 35, color: [239, 68, 68] as RGBColor }
        ];
        
        // Add category labels with proper spacing to avoid overlap
        for (let i = 0; i < categories.length - 1; i++) {
          const startY = yPos + 50 - ((categories[i].y / maxBmi) * 40);
          const endY = yPos + 50 - ((categories[i+1].y / maxBmi) * 40);
          if (endY < yPos + 10) continue; // Skip if out of chart area
          
          // Add category label with proper coloring
          pdf.setTextColor(categories[i].color[0], categories[i].color[1], categories[i].color[2]);
          pdf.text(categories[i].name, 180, (startY + endY) / 2);
        }
        
        // Add last category
        const lastCat = categories[categories.length - 1];
        pdf.setTextColor(lastCat.color[0], lastCat.color[1], lastCat.color[2]);
        pdf.text(lastCat.name, 180, yPos + 50 - ((lastCat.y / maxBmi) * 40) - 3);
        
        yPos += 80; // Add extra spacing after chart
      }
      
      // Weight trend visualization similar to BMI
      if (chartData.weight.length > 1) {
        // Check if need new page
        if (yPos > 200) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Weight Tracking", 15, yPos);
        pdf.setFont('helvetica', 'normal');
        
        // Similar chart rendering logic as BMI but with weight values and colors
        pdf.setFillColor(245, 247, 250);
        pdf.roundedRect(15, yPos + 5, 180, 55, 3, 3, 'F'); // Increased height
        
        const weightValues = chartData.weight.map(r => r.record_value);
        const weightDates = chartData.weight.map(r => formatDate(r.record_date));
        const maxWeight = Math.max(...weightValues) * 1.1;
        const minWeight = Math.min(...weightValues) * 0.9;
        const weightRange = maxWeight - minWeight;
        
        // Add chart description
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text("This chart shows your weight changes over time.", 105, yPos + 15, { align: 'center' });
        
        // Draw axes
        pdf.setDrawColor(150, 150, 150);
        pdf.line(25, yPos + 45, 175, yPos + 45); // X-axis
        
        // Draw connecting line for trend
        pdf.setDrawColor(colors.weight[0], colors.weight[1], colors.weight[2]);
        pdf.setLineWidth(1.5);
        
        const weightPoints: ChartPoint[] = [];
        const weightBarWidth = 140 / weightValues.length;
        
        weightValues.forEach((weight, idx) => {
          const normWeight = (weight - minWeight) / weightRange;
          const barHeight = normWeight * 35;
          const x = 30 + (idx * weightBarWidth) + (weightBarWidth / 2);
          const y = yPos + 45 - barHeight;
          weightPoints.push({ x, y });
        });
        
        // Draw weight trend line
        for (let i = 0; i < weightPoints.length - 1; i++) {
          pdf.line(weightPoints[i].x, weightPoints[i].y, weightPoints[i+1].x, weightPoints[i+1].y);
        }
        
        // Draw weight bars and values
        weightValues.forEach((weight, idx) => {
          const normWeight = (weight - minWeight) / weightRange;
          const barHeight = normWeight * 35;
          const x = 30 + (idx * weightBarWidth);
          
          // Draw bar
          pdf.setFillColor(colors.weight[0], colors.weight[1], colors.weight[2], 0.3);
          pdf.rect(x, yPos + 45 - barHeight, weightBarWidth - 2, barHeight, 'F');
          
          // Draw data point
          pdf.setFillColor(colors.weight[0], colors.weight[1], colors.weight[2]);
          pdf.circle(x + (weightBarWidth / 2), yPos + 45 - barHeight, 2, 'F');
          
          // Add weight value with better positioning
          pdf.setFontSize(7);
          pdf.setTextColor(0, 0, 0);
          pdf.text(weight.toString(), x + (weightBarWidth / 2), yPos + 42 - barHeight, { align: 'center' });
          
          // Add date with alternate positioning to avoid overlap
          pdf.setFontSize(6);
          pdf.setTextColor(100, 100, 100);
          if (weightValues.length > 3 && idx % 2 === 1) {
            pdf.text(weightDates[idx], x + (weightBarWidth / 2), yPos + 52, { align: 'center' });
          } else {
            pdf.text(weightDates[idx], x + (weightBarWidth / 2), yPos + 50, { align: 'center' });
          }
        });
        
        yPos += 65; // Increased spacing
      }
      
      // Add recent activity section if we have records
      if (healthRecords.length > 0) {
        // Always start the activity section on a new page to avoid overlap
        pdf.addPage();
        yPos = 20;
        
        // Add activity section header with proper spacing
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.5);
        pdf.line(15, yPos, pdf.internal.pageSize.getWidth() - 15, yPos);
        
        pdf.setTextColor(59, 130, 246);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text("ACTIVITY HISTORY", pdf.internal.pageSize.getWidth() / 2, yPos + 7, { align: 'center' });
        
        pdf.setLineWidth(0.5);
        pdf.line(15, yPos + 10, pdf.internal.pageSize.getWidth() - 15, yPos + 10);
        
        pdf.setFont('helvetica', 'normal');
        yPos += 20;
        
        // Table header with increased height for better readability
        pdf.setFillColor(59, 130, 246, 0.2);
        pdf.rect(15, yPos, 180, 10, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Date", 25, yPos + 6);
        pdf.text("Measurement", 80, yPos + 6);
        pdf.text("Value", 150, yPos + 6);
        
        yPos += 12; // Increase spacing after header
        
        // Table rows with better spacing between rows
        const sortedRecords = [...healthRecords]
          .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
          .slice(0, 10);
          
        sortedRecords.forEach((record, index) => {
          // Ensure we don't go off the page - reduced threshold for more margin
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
            
            // Re-add table header on new page
            pdf.setFillColor(59, 130, 246, 0.2);
            pdf.rect(15, yPos, 180, 10, 'F');
            
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Date", 25, yPos + 6);
            pdf.text("Measurement", 80, yPos + 6);
            pdf.text("Value", 150, yPos + 6);
            
            yPos += 12;
          }
          
          // Format data for display with defaults for TypeScript
          let displayValue = "";
          let displayType = "";
          let rowColor: RGBColor = [100, 100, 100]; // Default color
          
          switch(record.record_type) {
            case 'bmi':
              displayValue = record.record_value.toFixed(1);
              displayType = 'BMI';
              rowColor = colors.bmi;
              break;
            case 'weight':
              displayValue = `${record.record_value} kg`;
              displayType = 'Weight';
              rowColor = colors.weight;
              break;
            case 'body_fat':
              displayValue = `${record.record_value.toFixed(1)}%`;
              displayType = 'Body Fat';
              rowColor = colors.bodyFat;
              break;
            case 'calories':
              displayValue = `${record.record_value} kcal`;
              displayType = 'Calories';
              rowColor = colors.calories;
              break;
            case 'water':
              displayValue = `${record.record_value} ml`;
              displayType = 'Water Intake';
              rowColor = colors.water;
              break;
            case 'blood_pressure':
              displayValue = `${record.record_value}/${record.record_value_2} mmHg`;
              displayType = 'Blood Pressure';
              rowColor = colors.bloodPressure;
              break;
            default:
              displayValue = String(record.record_value);
              displayType = record.record_type;
              rowColor = [100, 100, 100];
          }
          
          // Add alternating background color for better readability
          if (index % 2 === 0) {
            pdf.setFillColor(245, 247, 250);
            pdf.rect(15, yPos - 2, 180, 12, 'F');
          }
          
          // Add color indicator for record type
          pdf.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
          pdf.rect(15, yPos - 2, 4, 12, 'F');
          
          // Add thin border line between rows for better separation
          pdf.setDrawColor(240, 240, 240);
          pdf.line(15, yPos + 8, 195, yPos + 8);
          
          // Add row data with proper alignment and spacing
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(formatDate(record.record_date), 25, yPos + 4);
          
          pdf.setTextColor(0, 0, 0);
          pdf.text(displayType, 80, yPos + 4);
          
          pdf.setTextColor(100, 100, 100);
          pdf.text(String(displayValue), 150, yPos + 4);
          
          yPos += 14; // Increase row height for better readability
        });
      }
      
      // Add footer to all pages with better positioning
      const totalPages = pdf.getNumberOfPages();
      for(let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Add page border for better appearance
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10, 'S');
        
        // Add footer background for better readability
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, pdf.internal.pageSize.getHeight() - 15, pdf.internal.pageSize.getWidth(), 15, 'F');
        
        // Add footer text with improved positioning
        pdf.setFontSize(8);
        pdf.setTextColor(156, 163, 175);
        pdf.text(
          `Generated on ${new Date().toLocaleString()} | Nestro Health | Page ${i} of ${totalPages}`, 
          pdf.internal.pageSize.getWidth() / 2, 
          pdf.internal.pageSize.getHeight() - 7, 
          { align: 'center' }
        );
      }
      
      // Save the PDF
      pdf.save(`${userName}-health-profile.pdf`);
      
      setExportLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportLoading(false);
    }
  };

  // Show loading state while checking profile
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If we have an error, show it
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Get the latest values for each health metric
  const getLatestMetric = (type: string): HealthRecord | null => {
    const records = healthRecords.filter(r => r.record_type === type);
    if (records.length === 0) return null;
    
    return records.sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())[0];
  };

  const latestBMI = getLatestMetric('bmi');
  const latestWeight = getLatestMetric('weight');
  const latestCalories = getLatestMetric('calories');
  const latestWater = getLatestMetric('water');
  const latestBodyFat = getLatestMetric('body_fat');
  const latestBloodPressure = getLatestMetric('blood_pressure');
  const latestSteps = getLatestMetric('steps');
  const latestMacros = getLatestMetric('calories'); // We're using the calories record type for macros
  const latestBoneMass = getLatestMetric('bone_mass'); // Add bone mass metric

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div id="profile-container" className="max-w-7xl mx-auto">
        {/* Header with user info and actions */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
                <p className="text-gray-600 mt-1">{t('profile.nameOnly') || 'Name-only profile'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={navigateToHome}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {t('common.home') || 'Home'}
              </button>
              
              <button
                onClick={exportToPDF}
                disabled={exportLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {exportLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('profile.exporting') || 'Exporting...'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('profile.exportAsPDF') || 'Export as PDF'}
                  </>
                )}
              </button>
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('auth.signOut') || 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Health Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('profile.healthOverview') || 'Health Overview'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBMI && (
              <StatCard 
                icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
                title={t('nav.bmiCalculator') || 'BMI'}
                value={latestBMI.record_value.toFixed(1)}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestBMI.record_date)}`
                }
                color="border-blue-500"
              />
            )}
            
            {latestWeight && (
              <StatCard 
                icon={<ScaleIcon className="h-6 w-6 text-green-600" />}
                title={t('nav.idealWeight') || 'Weight'}
                value={`${latestWeight.record_value} kg`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestWeight.record_date)}`
                }
                color="border-green-500"
              />
            )}
            
            {latestBodyFat && (
              <StatCard 
                icon={<ChartBarIcon className="h-6 w-6 text-orange-600" />}
                title={t('nav.bodyFat') || 'Body Fat'}
                value={`${latestBodyFat.record_value.toFixed(1)}%`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestBodyFat.record_date)}`
                }
                color="border-orange-500"
              />
            )}
            
            {latestCalories && (
              <StatCard 
                icon={<FireIcon className="h-6 w-6 text-red-600" />}
                title={t('nav.calorieCalculator') || 'Calories'}
                value={`${latestCalories.record_value} kcal`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestCalories.record_date)}`
                }
                color="border-red-500"
              />
            )}
            
            {latestWater && (
              <StatCard 
                icon={<BeakerIcon className="h-6 w-6 text-cyan-600" />}
                title={t('nav.waterIntake') || 'Water Intake'}
                value={`${latestWater.record_value} ml`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestWater.record_date)}`
                }
                color="border-cyan-500"
              />
            )}
            
            {latestBloodPressure && (
              <StatCard 
                icon={<HeartIcon className="h-6 w-6 text-pink-600" />}
                title={t('nav.bloodPressure') || 'Blood Pressure'}
                value={`${latestBloodPressure.record_value}/${latestBloodPressure.record_value_2} mmHg`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestBloodPressure.record_date)}`
                }
                color="border-pink-500"
              />
            )}
            
            {latestSteps && (
              <StatCard 
                icon={<DocumentArrowDownIcon className="h-6 w-6 text-indigo-600" />}
                title={t('nav.steps') || 'Steps'}
                value={latestSteps.record_value.toLocaleString()}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestSteps.record_date)}`
                }
                color="border-indigo-500"
              />
            )}

            {latestMacros && (
              <Link href="/macros">
                <StatCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>}
                  title={t('nav.macronutrients') || 'Macronutrients'}
                  value={`${latestMacros.record_value} kcal`}
                  description={
                    `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestMacros.record_date)}`
                  }
                  color="border-purple-500"
                />
              </Link>
            )}

            {latestBoneMass && (
              <Link href="/bone-mass">
                <StatCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>}
                  title={t('nav.boneMass') || 'Bone Mass'}
                  value={`${latestBoneMass.record_value.toFixed(1)} kg`}
                  description={
                    `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestBoneMass.record_date)}`
                  }
                  color="border-teal-500"
                />
              </Link>
            )}
          </div>
        </div>
        
        {/* Health Trends and Visualizations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('profile.healthTrends') || 'Health Trends and Visualizations'}
          </h2>
          
          {/* Add charts and visualizations here */}
        </div>
        
        {/* Activity History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('profile.activityHistory') || 'Activity History'}
          </h2>
          
          {/* Add activity history section here */}
        </div>

        {/* Export to PDF button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={exportToPDF}
            disabled={exportLoading}
            className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center space-x-2 ${exportLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {exportLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                {t('profile.exporting') || 'Exporting...'}
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                {t('profile.exportPDF') || 'Export Health Report (PDF)'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}