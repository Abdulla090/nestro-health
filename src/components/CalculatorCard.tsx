"use client";

import { ReactNode } from "react";

interface CalculatorCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  description?: string;
  gradient?: string;
  className?: string;
}

const CalculatorCard = ({
  title,
  children,
  icon,
  description,
  gradient = "bg-gradient-primary",
  className = "",
}: CalculatorCardProps) => {
  return (
    <div className="relative w-screen -ml-[calc(50vw-50%)] left-[calc(50vw-50%)] bg-white shadow-lg">
      <div className={`w-full ${gradient} text-white`}>
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <div className="flex items-center">
            {icon && (
              <div className="mr-4 p-3 bg-white/20 rounded-xl">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold">{title}</h2>
              {description && <p className="mt-2 text-lg text-white/90">{description}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        {children}
      </div>
    </div>
  );
};

export default CalculatorCard; 