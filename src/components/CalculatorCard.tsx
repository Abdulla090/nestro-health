"use client";

import { FC } from 'react';
import Link from 'next/link';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon?: JSX.Element;
  href?: string;
  children?: React.ReactNode;
}

const CalculatorCard: FC<CalculatorCardProps> = ({ title, description, icon, href, children }) => {
  const content = (
    <div className="flex items-start">
      {icon && (
        <div className="flex-shrink-0 mr-4 text-blue-500">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="block p-6 bg-white rounded-lg shadow-md">
      {content}
    </div>
  );
};

export default CalculatorCard;

export const calculators = [
  {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) based on your height and weight.',
    link: '/bmi',
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    title: 'Ideal Weight',
    description: 'Calculate your ideal weight range based on height, age, and gender.',
    link: '/ideal-weight',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    title: 'Calorie Calculator',
    description: 'Calculate your daily calorie needs based on your activity level and goals.',
    link: '/calories',
    gradient: 'bg-gradient-to-br from-red-400 to-red-600'
  },
  {
    title: 'Body Fat',
    description: 'Calculate your body fat percentage using accurate measurements.',
    link: '/body-fat',
    gradient: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  {
    title: 'Water Intake',
    description: 'Calculate how much water you should drink daily based on your weight and activity.',
    link: '/water-intake',
    gradient: 'bg-gradient-to-br from-cyan-400 to-cyan-600'
  },
  {
    title: 'Blood Pressure',
    description: 'Calculate your mean arterial pressure and evaluate your blood pressure status.',
    link: '/blood-pressure',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    title: 'Heart Rate Zones',
    description: 'Calculate your training heart rate zones based on age and resting heart rate.',
    link: '/heart-rate',
    gradient: 'bg-gradient-to-br from-pink-400 to-pink-600'
  },
  {
    title: 'Macronutrient Calculator',
    description: 'Calculate your daily protein, carbs, and fat needs based on your fitness goals.',
    link: '/macros',
    gradient: 'bg-gradient-primary'
  },
  {
    title: 'Bone Mass Calculator',
    description: 'Estimate your bone mass based on weight, height, and gender.',
    link: '/bone-mass',
    gradient: 'bg-gradient-to-br from-teal-400 to-teal-600'
  }
]; 