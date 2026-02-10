import React from "react";
import { AlertCircle, X, CheckCircle, Info } from "lucide-react";

interface AlertMessageProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  link?: {
    text: string;
    url: string;
  };
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  onClose,
  link,
}) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      subtext: "text-green-700",
      icon: CheckCircle,
      iconColor: "text-green-600",
      linkColor: "text-green-800 hover:text-green-900",
      closeColor: "text-green-400 hover:text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      subtext: "text-red-700",
      icon: AlertCircle,
      iconColor: "text-red-600",
      linkColor: "text-red-800 hover:text-red-900",
      closeColor: "text-red-400 hover:text-red-600",
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-900",
      subtext: "text-orange-700",
      icon: AlertCircle,
      iconColor: "text-orange-600",
      linkColor: "text-orange-800 hover:text-orange-900",
      closeColor: "text-orange-400 hover:text-orange-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      subtext: "text-blue-700",
      icon: Info,
      iconColor: "text-blue-600",
      linkColor: "text-blue-800 hover:text-blue-900",
      closeColor: "text-blue-400 hover:text-blue-600",
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} border-2 ${style.border} rounded-xl p-4 flex items-start`}
    >
      <Icon
        className={`w-5 h-5 ${style.iconColor} mr-3 flex-shrink-0 mt-0.5`}
      />
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>
        )}
        <p className={`text-sm ${style.subtext} whitespace-pre-line`}>
          {message}
        </p>
        {link && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center text-sm ${style.linkColor} font-semibold mt-2 transition-colors`}
          >
            {link.text} →
          </a>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.closeColor} transition-colors ml-2`}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
