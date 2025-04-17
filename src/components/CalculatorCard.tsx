"use client";

import { ReactNode } from "react";

interface CalculatorCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  description?: string;
  gradient?: string;
}

const CalculatorCard = ({
  title,
  children,
  icon,
  description,
  gradient = "bg-gradient-primary",
}: CalculatorCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl w-full mx-auto transition-all duration-200 hover:shadow-lg">
      <div className={`p-6 ${gradient} text-white`}>
        <div className="flex items-center">
          {icon && (
            <div className="mr-4 p-3 bg-white/20 rounded-xl">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="mt-1 text-white/90">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
};

export default CalculatorCard; 