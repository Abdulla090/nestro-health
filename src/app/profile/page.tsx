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

    if (profile) {
      console.log('Profile loaded:', profile);
      
      // Clear any redirect flags since we're now on the profile page
      localStorage.removeItem('redirectingToProfile');
      
      setUserName(profile.username || profile.full_name || '');
      
      // Load health records
      const loadHealthRecords = async () => {
        try {
          // Check if profile has a valid ID before proceeding
          if (!profile || !profile.id) {
            console.error('Profile ID is missing or invalid');
            return;
          }
          
          console.log('Fetching health records for profile ID:', profile.id);
          const { data, error } = await getHealthRecords(profile.id);
          
          if (error) {
            console.error('Error loading health records:', error);
            return;
          }
          
          if (!data) {
            console.log('No health records data returned');
            setHealthRecords([]);
            return;
          }
          
          console.log(`Loaded ${data.length} health records`);
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
        }
      };
      
      loadHealthRecords();
      setLoading(false);
    }
  }, [profile, loading, router]);

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
        author: 'HealthTrack',
        creator: 'HealthTrack App'
      });
      
      // Add header with app name
      pdf.setFillColor(59, 130, 246); // Blue color for header
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 35, 'F');
      
      // Add title with user name
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFontSize(22);
      const title = `HealthTrack`;
      pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // Add subtitle with user info
      pdf.setFontSize(14);
      const subtitle = `Health Profile: ${userName}`;
      pdf.text(subtitle, pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
      
      // Start y-position after header
      let yPos = 45;
      
      // Add report info
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPos);
      yPos += 10;
      
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
      yPos += 20;
      
      // Enhanced visual stat box with more details
      const addDetailedStatBox = (
        title: string, 
        value: string, 
        description: string, 
        y: number, 
        color: RGBColor, 
        details: string
      ) => {
        // Base box
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(15, y, 180, 35, 3, 3, 'F');
        
        // Colored accent on left side
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(15, y, 7, 35, 'F');
        
        // Feature title in colored box
        pdf.setFillColor(color[0], color[1], color[2], 0.2);
        pdf.rect(22, y, 40, 8, 'F');
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 42, y + 5.5, { align: 'center' });
        
        // Main value (large)
        pdf.setFontSize(18);
        pdf.text(value, 42, y + 20);
        pdf.setFont('helvetica', 'normal');
        
        // Last updated info
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(description, 42, y + 28);
        
        // Detailed information about the feature
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        const splitDetails = pdf.splitTextToSize(details, 100);
        pdf.text(splitDetails, 95, y + 15);
      };
      
      // Define colors for different metrics (in RGB format)
      const colors = {
        bmi: [59, 130, 246] as RGBColor,       // blue
        weight: [16, 185, 129] as RGBColor,    // green
        bodyFat: [249, 115, 22] as RGBColor,   // orange
        calories: [239, 68, 68] as RGBColor,   // red
        water: [6, 182, 212] as RGBColor,      // cyan
        bloodPressure: [139, 92, 246] as RGBColor // purple
      };
      
      // Define detailed descriptions for each feature
      const featureDescriptions = {
        bmi: "Body Mass Index (BMI) measures body fat based on height and weight. It helps classify weight status and potential health risks.",
        weight: "Weight tracking helps monitor changes over time. Combined with other metrics, it provides insights into overall health progress.",
        bodyFat: "Body fat percentage indicates the proportion of fat tissue relative to total body weight. Lower percentages generally indicate better fitness.",
        calories: "Calorie needs vary based on age, weight, height, gender, and activity level. This is your estimated daily requirement.",
        water: "Water intake requirements depend on activity level, climate, and body size. Adequate hydration is essential for overall health.",
        bloodPressure: "Blood pressure readings show systolic/diastolic pressure. Normal levels are important for cardiovascular health."
      };
      
      // Add health metrics with enhanced visual elements and detailed information
      if (latestBMI) {
        let bmiCategory = "";
        const bmi = latestBMI.record_value;
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi < 25) bmiCategory = "Normal weight";
        else if (bmi < 30) bmiCategory = "Overweight";
        else if (bmi < 35) bmiCategory = "Obesity (Class I)";
        else if (bmi < 40) bmiCategory = "Obesity (Class II)";
        else bmiCategory = "Obesity (Class III)";
        
        addDetailedStatBox(
          'BMI', 
          `${latestBMI.record_value.toFixed(1)} (${bmiCategory})`, 
          `Last updated: ${formatDate(latestBMI.record_date)}`,
          yPos,
          colors.bmi,
          `${featureDescriptions.bmi}\nYour value of ${latestBMI.record_value.toFixed(1)} places you in the ${bmiCategory} category.`
        );
        yPos += 40;
      }
      
      if (latestWeight) {
        addDetailedStatBox(
          'Weight', 
          `${latestWeight.record_value} kg`, 
          `Last updated: ${formatDate(latestWeight.record_date)}`,
          yPos,
          colors.weight,
          featureDescriptions.weight
        );
        yPos += 40;
      }
      
      if (latestBodyFat) {
        let category = "";
        const bf = latestBodyFat.record_value;
        // Simple categorization
        if (bf < 10) category = "Essential fat (very low)";
        else if (bf < 20) category = "Athletic";
        else if (bf < 30) category = "Fitness";
        else if (bf < 35) category = "Average";
        else category = "Obese";
        
        addDetailedStatBox(
          'Body Fat', 
          `${latestBodyFat.record_value.toFixed(1)}% (${category})`, 
          `Last updated: ${formatDate(latestBodyFat.record_date)}`,
          yPos,
          colors.bodyFat,
          `${featureDescriptions.bodyFat}\nYour value of ${latestBodyFat.record_value.toFixed(1)}% is considered "${category}".`
        );
        yPos += 40;
      }
      
      if (latestCalories) {
        addDetailedStatBox(
          'Calories', 
          `${latestCalories.record_value} kcal`, 
          `Last updated: ${formatDate(latestCalories.record_date)}`,
          yPos,
          colors.calories,
          `${featureDescriptions.calories}\nYour daily calorie need is approximately ${latestCalories.record_value} kcal.`
        );
        yPos += 40;
      }
      
      if (latestWater) {
        addDetailedStatBox(
          'Water', 
          `${latestWater.record_value} ml`, 
          `Last updated: ${formatDate(latestWater.record_date)}`,
          yPos,
          colors.water,
          `${featureDescriptions.water}\nYour recommended daily water intake is ${latestWater.record_value} ml.`
        );
        yPos += 40;
      }
      
      if (latestBloodPressure) {
        let category = "";
        const systolic = latestBloodPressure.record_value;
        const diastolic = latestBloodPressure.record_value_2 || 0; // Default to 0 if undefined
        
        if (systolic < 90 || diastolic < 60) category = "Low";
        else if (systolic < 120 && diastolic < 80) category = "Normal";
        else if (systolic < 130 && diastolic < 80) category = "Elevated";
        else if (systolic < 140 || diastolic < 90) category = "Hypertension Stage 1";
        else if (systolic < 180 || diastolic < 120) category = "Hypertension Stage 2";
        else category = "Hypertensive Crisis";
        
        addDetailedStatBox(
          'Blood Pressure', 
          `${latestBloodPressure.record_value}/${latestBloodPressure.record_value_2} (${category})`, 
          `Last updated: ${formatDate(latestBloodPressure.record_date)}`,
          yPos,
          colors.bloodPressure,
          `${featureDescriptions.bloodPressure}\nYour reading of ${latestBloodPressure.record_value}/${latestBloodPressure.record_value_2} mmHg is categorized as "${category}".`
        );
        yPos += 40;
      }
      
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
      
      // Enhanced Charts Section - Add fancy header
      if (healthRecords.length > 1) {
        // Check if we need a new page
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
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
        
        // Improved visualization for BMI trend
        if (chartData.bmi.length > 1) {
          // Draw chart title and container
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'bold');
          pdf.text("BMI Trend Analysis", 15, yPos);
          pdf.setFont('helvetica', 'normal');
          
          // Draw chart background
          pdf.setFillColor(245, 247, 250);
          pdf.roundedRect(15, yPos + 5, 180, 60, 3, 3, 'F');
          
          // Get BMI values and dates for chart
          const bmiValues = chartData.bmi.map(r => r.record_value);
          const bmiDates = chartData.bmi.map(r => formatDate(r.record_date));
          const maxBmi = Math.max(...bmiValues, 25) * 1.1; // Add 10% margin
          
          // Draw chart title and description
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text("This chart shows your BMI trend over time. The healthy BMI range is 18.5-24.9.", 105, yPos + 15, { align: 'center' });
          
          // Draw axes labels
          pdf.setFontSize(8);
          pdf.text("BMI", 20, yPos + 35);
          pdf.text("Date", 105, yPos + 60);
          
          // Draw Y-axis reference lines and labels
          pdf.setDrawColor(220, 220, 220);
          
          // Draw horizontal grid lines
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
          
          // Draw bars with connecting line
          const barWidth = 140 / bmiValues.length;
          const points: ChartPoint[] = [];
          
          // First draw connecting line to show trend
          pdf.setDrawColor(colors.bmi[0], colors.bmi[1], colors.bmi[2]);
          pdf.setLineWidth(1.5);
          
          bmiValues.forEach((bmi, idx) => {
            const barHeight = (bmi / maxBmi) * 40;
            const x = 30 + (idx * barWidth) + (barWidth / 2);
            const y = yPos + 50 - barHeight;
            points.push({ x, y });
          });
          
          // Draw trend line
          for (let i = 0; i < points.length - 1; i++) {
            pdf.line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
          }
          
          // Draw bars and data points
          bmiValues.forEach((bmi, idx) => {
            const barHeight = (bmi / maxBmi) * 40;
            const x = 30 + (idx * barWidth);
            
            // Draw bar
            pdf.setFillColor(...colors.bmi, 0.3);
            pdf.rect(x, yPos + 50 - barHeight, barWidth - 2, barHeight, 'F');
            
            // Draw data point
            pdf.setFillColor(...colors.bmi);
            pdf.circle(x + (barWidth / 2), yPos + 50 - barHeight, 2, 'F');
            
            // Add value on top of bar
            pdf.setFontSize(7);
            pdf.setTextColor(0, 0, 0);
            pdf.text(bmi.toFixed(1), x + (barWidth / 2), yPos + 47 - barHeight, { align: 'center' });
            
            // Add date below
            pdf.setFontSize(6);
            pdf.setTextColor(100, 100, 100);
            
            // Rotate date labels if multiple dates to prevent overlap
            pdf.text(bmiDates[idx], x + (barWidth / 2), yPos + 55, { align: 'center' });
          });
          
          // Add categorizations
          pdf.setFontSize(7);
          
          // Category zones with labels
          const categories: Category[] = [
            { name: "Underweight", y: 18.5, color: [59, 130, 246] as RGBColor },
            { name: "Normal", y: 25, color: [16, 185, 129] as RGBColor },
            { name: "Overweight", y: 30, color: [245, 158, 11] as RGBColor },
            { name: "Obese", y: 35, color: [239, 68, 68] as RGBColor }
          ];
          
          for (let i = 0; i < categories.length - 1; i++) {
            const startY = yPos + 50 - ((categories[i].y / maxBmi) * 40);
            const endY = yPos + 50 - ((categories[i+1].y / maxBmi) * 40);
            if (endY < yPos + 10) continue; // Skip if out of chart area
            
            // Add category label
            pdf.setTextColor(categories[i].color[0], categories[i].color[1], categories[i].color[2]);
            pdf.text(categories[i].name, 180, (startY + endY) / 2);
          }
          
          // Add last category
          const lastCat = categories[categories.length - 1];
          pdf.setTextColor(lastCat.color[0], lastCat.color[1], lastCat.color[2]);
          pdf.text(lastCat.name, 180, yPos + 50 - ((lastCat.y / maxBmi) * 40) - 3);
          
          yPos += 70;
        }
        
        // Weight trend visualization similar to BMI
        if (chartData.weight.length > 1) {
          // Check if need new page
          if (yPos > 220) {
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
          pdf.roundedRect(15, yPos + 5, 180, 50, 3, 3, 'F');
          
          const weightValues = chartData.weight.map(r => r.record_value);
          const weightDates = chartData.weight.map(r => formatDate(r.record_date));
          const maxWeight = Math.max(...weightValues) * 1.1;
          const minWeight = Math.min(...weightValues) * 0.9;
          const weightRange = maxWeight - minWeight;
          
          // Draw axes
          pdf.setDrawColor(150, 150, 150);
          pdf.line(25, yPos + 45, 175, yPos + 45); // X-axis
          
          // Draw connecting line for trend
          pdf.setDrawColor(...colors.weight);
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
            pdf.setFillColor(...colors.weight, 0.3);
            pdf.rect(x, yPos + 45 - barHeight, weightBarWidth - 2, barHeight, 'F');
            
            // Draw data point
            pdf.setFillColor(...colors.weight);
            pdf.circle(x + (weightBarWidth / 2), yPos + 45 - barHeight, 2, 'F');
            
            // Add weight value
            pdf.setFontSize(7);
            pdf.setTextColor(0, 0, 0);
            pdf.text(weight.toString(), x + (weightBarWidth / 2), yPos + 42 - barHeight, { align: 'center' });
            
            // Add date
            pdf.setFontSize(6);
            pdf.setTextColor(100, 100, 100);
            pdf.text(weightDates[idx], x + (weightBarWidth / 2), yPos + 50, { align: 'center' });
          });
          
          yPos += 60;
        }
      }
      
      // Add recent activity section if we have records
      if (healthRecords.length > 0) {
        // Check if we need a new page
        if (yPos > 200) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Add activity section header
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
        
        // Table header with colored background
        pdf.setFillColor(59, 130, 246, 0.2);
        pdf.rect(15, yPos, 180, 8, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Date", 20, yPos + 5);
        pdf.text("Measurement", 70, yPos + 5);
        pdf.text("Value", 140, yPos + 5);
        
        yPos += 10;
        
        // Table rows
        const sortedRecords = [...healthRecords]
          .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
          .slice(0, 10);
          
        sortedRecords.forEach((record, index) => {
          // Ensure we don't go off the page
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
            
            // Re-add table header on new page
            pdf.setFillColor(59, 130, 246, 0.2);
            pdf.rect(15, yPos, 180, 8, 'F');
            
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Date", 20, yPos + 5);
            pdf.text("Measurement", 70, yPos + 5);
            pdf.text("Value", 140, yPos + 5);
            
            yPos += 10;
          }
          
          // Format data for display
          let displayValue;
          let displayType;
          let rowColor;
          
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
              displayValue = record.record_value;
              displayType = record.record_type;
              rowColor = [100, 100, 100];
          }
          
          // Add alternating background color
          if (index % 2 === 0) {
            pdf.setFillColor(245, 247, 250);
            pdf.rect(15, yPos - 2, 180, 10, 'F');
          }
          
          // Add color indicator for record type
          pdf.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
          pdf.rect(15, yPos - 2, 3, 10, 'F');
          
          // Add thin border line between rows
          pdf.setDrawColor(240, 240, 240);
          pdf.line(15, yPos + 6, 195, yPos + 6);
          
          // Add row data
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(formatDate(record.record_date), 20, yPos + 3);
          
          pdf.setTextColor(0, 0, 0);
          pdf.text(displayType, 70, yPos + 3);
          
          pdf.setTextColor(100, 100, 100);
          pdf.text(String(displayValue), 140, yPos + 3);
          
          yPos += 10;
        });
      }
      
      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for(let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Add page border for better appearance
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10, 'S');
        
        // Add footer text
        pdf.setFontSize(8);
        pdf.setTextColor(156, 163, 175);
        pdf.text(
          `Generated on ${new Date().toLocaleString()} | HealthTrack | Page ${i} of ${totalPages}`, 
          pdf.internal.pageSize.getWidth() / 2, 
          pdf.internal.pageSize.getHeight() - 10, 
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
                icon={<HeartIcon className="h-6 w-6 text-purple-600" />}
                title={t('nav.bloodPressure') || 'Blood Pressure'}
                value={`${latestBloodPressure.record_value}/${latestBloodPressure.record_value_2}`}
                description={
                  `${t('profile.lastUpdated') || 'Last updated'}: ${formatDate(latestBloodPressure.record_date)}`
                }
                color="border-purple-500"
              />
            )}
            
            {/* Show placeholders if no data */}
            {healthRecords.length === 0 && (
              <>
                <StatCard 
                  icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
                  title={t('nav.bmiCalculator') || 'BMI'}
                  value={t('profile.noData') || 'No data yet'}
                  description={t('profile.tryCalculator') || 'Try the calculator to get started'}
                  color="border-blue-500"
                />
                
                <StatCard 
                  icon={<ScaleIcon className="h-6 w-6 text-green-600" />}
                  title={t('nav.idealWeight') || 'Weight'}
                  value={t('profile.noData') || 'No data yet'}
                  description={t('profile.tryCalculator') || 'Try the calculator to get started'}
                  color="border-green-500"
                />
                
                <StatCard 
                  icon={<FireIcon className="h-6 w-6 text-red-600" />}
                  title={t('nav.calorieCalculator') || 'Calories'}
                  value={t('profile.noData') || 'No data yet'}
                  description={t('profile.tryCalculator') || 'Try the calculator to get started'}
                  color="border-red-500"
                />
              </>
            )}
          </div>
        </div>
        
        {/* Health Trends Section - Only shown if data exists */}
        {healthRecords.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('profile.healthTrends') || 'Health Trends'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chartData.bmi.length > 0 && (
                <BarChart 
                  data={chartData.bmi.map(r => r.record_value)}
                  labels={chartData.bmi.map(r => formatDate(r.record_date))}
                  colors={['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300', 'bg-blue-200']}
                  title={t('nav.bmiCalculator') || 'BMI Over Time'}
                  unit=""
                />
              )}
              
              {chartData.weight.length > 0 && (
                <BarChart 
                  data={chartData.weight.map(r => r.record_value)}
                  labels={chartData.weight.map(r => formatDate(r.record_date))}
                  colors={['bg-green-600', 'bg-green-500', 'bg-green-400', 'bg-green-300', 'bg-green-200']}
                  title={t('nav.idealWeight') || 'Weight Over Time'}
                  unit="kg"
                />
              )}
              
              {chartData.bodyFat.length > 0 && (
                <BarChart 
                  data={chartData.bodyFat.map(r => r.record_value)}
                  labels={chartData.bodyFat.map(r => formatDate(r.record_date))}
                  colors={['bg-orange-600', 'bg-orange-500', 'bg-orange-400', 'bg-orange-300', 'bg-orange-200']}
                  title={t('nav.bodyFat') || 'Body Fat Over Time'}
                  unit="%"
                />
              )}
              
              {chartData.calories.length > 0 && (
                <BarChart 
                  data={chartData.calories.map(r => r.record_value)}
                  labels={chartData.calories.map(r => formatDate(r.record_date))}
                  colors={['bg-red-600', 'bg-red-500', 'bg-red-400', 'bg-red-300', 'bg-red-200']}
                  title={t('nav.calorieCalculator') || 'Calories Over Time'}
                  unit="kcal"
                />
              )}
            </div>
          </div>
        ) : null}
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('profile.quickActions') || 'Quick Actions'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/bmi" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.bmiCalculator') || 'BMI Calculator'}</p>
            </Link>
            
            <Link href="/calories" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <FireIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.calorieCalculator') || 'Calorie Calculator'}</p>
            </Link>
            
            <Link href="/ideal-weight" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <ScaleIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.idealWeight') || 'Ideal Weight'}</p>
            </Link>
            
            <Link href="/body-fat" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.bodyFat') || 'Body Fat'}</p>
            </Link>
            
            <Link href="/water-intake" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                <BeakerIcon className="h-6 w-6 text-cyan-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.waterIntake') || 'Water Intake'}</p>
            </Link>
            
            <Link href="/blood-pressure" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">{t('nav.bloodPressure') || 'Blood Pressure'}</p>
            </Link>
          </div>
        </div>
        
        {/* Health History */}
        {healthRecords.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('profile.recentActivity') || 'Recent Activity'}
            </h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('profile.date') || 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('profile.measurement') || 'Measurement'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('profile.value') || 'Value'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {healthRecords
                    .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
                    .slice(0, 10)
                    .map((record, index) => {
                      // Format value based on record type
                      let displayValue;
                      let displayType;
                      
                      switch(record.record_type) {
                        case 'bmi':
                          displayValue = record.record_value.toFixed(1);
                          displayType = t('nav.bmiCalculator') || 'BMI';
                          break;
                        case 'weight':
                          displayValue = `${record.record_value} kg`;
                          displayType = t('nav.idealWeight') || 'Weight';
                          break;
                        case 'body_fat':
                          displayValue = `${record.record_value.toFixed(1)}%`;
                          displayType = t('nav.bodyFat') || 'Body Fat';
                          break;
                        case 'calories':
                          displayValue = `${record.record_value} kcal`;
                          displayType = t('nav.calorieCalculator') || 'Calories';
                          break;
                        case 'water':
                          displayValue = `${record.record_value} ml`;
                          displayType = t('nav.waterIntake') || 'Water Intake';
                          break;
                        case 'blood_pressure':
                          displayValue = `${record.record_value}/${record.record_value_2} mmHg`;
                          displayType = t('nav.bloodPressure') || 'Blood Pressure';
                          break;
                        default:
                          displayValue = record.record_value;
                          displayType = record.record_type;
                      }
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.record_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {displayType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {String(displayValue)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Empty state if no health records */}
        {healthRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t('profile.noHealthData') || 'No health data yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('profile.startUsingCalculators') || 'Start using our health calculators to track your progress and see your data here.'}
            </p>
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              {t('profile.exploreCalculators') || 'Explore Calculators'}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
} 