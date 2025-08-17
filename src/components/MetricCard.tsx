import React from 'react';

type MetricCardProps = {
  title: string;
  value: number;
  color: string;
  icon: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-transform duration-200 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800 leading-none">
            {value}
          </div>
        </div>
      </div>
      <div className="text-base font-medium text-gray-600">
        {title}
      </div>
    </div>
  );
};
