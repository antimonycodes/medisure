import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  valueClassName?: string;
  iconClassName?: string;
  iconBgClassName?: string;
  borderClassName?: string;
  badgeText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  valueClassName,
  iconClassName = "text-blue-600",
  iconBgClassName = "bg-blue-100",
  borderClassName = "border-gray-200",
  badgeText,
}) => {
  return (
    <div
      className={`w-full bg-white rounded-2xl border ${borderClassName} p-5 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${iconBgClassName} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconClassName}`} />
        </div>
        {badgeText && (
          <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {badgeText}
          </span>
        )}
      </div>

      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p
        className={`text-3xl font-semibold text-gray-900 ${
          valueClassName || ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default StatCard;
