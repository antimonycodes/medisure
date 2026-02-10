import React from "react";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { WALLET_FEATURES_ENABLED } from "@/utils/walletMode";

interface DashboardHeaderProps {
  connected: boolean;
  connecting?: boolean;
  demoMode?: boolean;
  walletBalance: number;
  checkingBalance: boolean;
  companyName?: string;
  onLogout: () => void;
  onWalletClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  connected,
  connecting = false,
  demoMode = false,
  walletBalance,
  checkingBalance,
  companyName,
  onLogout,
  onWalletClick,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {companyName || "Manufacturer Account"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>

            <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {connecting ? (
                <Loader2 className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2 text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {demoMode
                  ? "Demo Wallet"
                  : connecting
                  ? "Connecting..."
                  : connected
                  ? "Wallet Connected"
                  : "Wallet Not Connected"}
              </span>
            </div>

            {!demoMode &&
              (WALLET_FEATURES_ENABLED ? (
                <button
                  type="button"
                  onClick={onWalletClick}
                  className="min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="min-w-[150px] px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 text-sm font-medium">
                  Wallet Disabled
                </div>
              ))}

            <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {connected ? (checkingBalance ? "Checking..." : `${walletBalance.toFixed(2)} ADA`) : "0.00 ADA"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
