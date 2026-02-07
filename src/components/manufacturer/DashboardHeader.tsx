import React, { useEffect } from "react";
import { Package, Wallet } from "lucide-react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import Image from "next/image";
import logo from "../../../public/logo.png";

interface DashboardHeaderProps {
  connected: boolean;
  walletBalance: number;
  checkingBalance: boolean;
  onWalletClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  connected,
  walletBalance,
  checkingBalance,
  onWalletClick,
}) => {
  const { connect, wallet } = useWallet();

  // Auto-reconnect wallet on page refresh
  useEffect(() => {
    const reconnectWallet = async () => {
      const lastWallet = localStorage.getItem("lastConnectedWallet");
      if (lastWallet && !connected && wallet) {
        try {
          console.log("🔄 Auto-reconnecting wallet:", lastWallet);
          await connect(lastWallet);
        } catch (error) {
          console.warn("Auto-reconnect failed:", error);
          localStorage.removeItem("lastConnectedWallet");
        }
      }
    };

    reconnectWallet();
  }, []);

  // Save connected wallet name
  useEffect(() => {
    if (connected && wallet) {
      const walletName = "name" in wallet ? (wallet as any).name : undefined;

      localStorage.setItem("lastConnectedWallet", walletName);
    }
  }, [connected, wallet]);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src={logo} alt="logo" width={80} height={80} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center">
                <span
                  className={`w-2 h-2 ${
                    connected ? "bg-green-500" : "bg-orange-500"
                  } rounded-full mr-2 animate-pulse`}
                ></span>
                {connected ? "PharmaCorp Ltd." : "Wallet Disconnected"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Wallet className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {connected ? "Connected" : "Not Connected"}
              </span>
            </div>
            <div onClick={onWalletClick}>
              <CardanoWallet />
            </div>
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Wallet className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {connected ? (
                  <>
                    {checkingBalance ? (
                      "Checking..."
                    ) : (
                      <>
                        <span
                          className={
                            walletBalance < 3
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {walletBalance.toFixed(2)} ADA
                        </span>
                        {walletBalance < 3 && (
                          <span className="text-xs text-red-600 ml-2">
                            (Need 3+ ADA)
                          </span>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  "Not Connected"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
