import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  change: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  change,
}) => {
  return (
    <div
      className={`w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border ${borderColor} group cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;
