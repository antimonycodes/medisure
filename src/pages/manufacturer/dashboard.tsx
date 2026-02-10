"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Package, TrendingUp, Boxes, RefreshCw } from "lucide-react";
import { useRouter } from "next/router";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { getBatchDetailsByBatchId, getDashboardStats } from "../../api";
import { getManufacturerId } from "@/utils/localStorage";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import type { Batch } from "@/utils/types";
import StatCard from "../../components/manufacturer/StatsCard";
import BatchTable from "../../components/manufacturer/BatchTable";
import DashboardHeader from "../../components/manufacturer/DashboardHeader";
import AlertMessage from "../../components/manufacturer/AlertMessage";
import { MIN_ADA_BALANCE } from "../../constants/index";
import { ASSUME_WALLET_CONNECTED, WALLET_FEATURES_ENABLED } from "@/utils/walletMode";

export default function ManufacturerDashboard() {
  useRequireRole([ROLES.MANUFACTURER]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const walletState: {
    connected?: boolean;
    wallet?: null;
    connecting?: boolean;
    disconnect?: () => Promise<void>;
  } = {
    connected: false,
    wallet: null,
    connecting: false,
  };
  const { connected, wallet } = walletState;
  const effectiveConnected =
    (WALLET_FEATURES_ENABLED && connected) || ASSUME_WALLET_CONNECTED;
  const {
    balance: walletBalance,
    checking: checkingBalance,
  } = useWalletBalance(connected, wallet);

  const [walletError, setWalletError] = useState("");
  const [manualConnecting, setManualConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openingBatchId, setOpeningBatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lastSynced, setLastSynced] = useState<string>("");

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    const manufacturerId = getManufacturerId();
    if (!manufacturerId) {
      setLoading(false);
      return;
    }

    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await getDashboardStats(manufacturerId);
      if (data.success) {
        const transformed: Batch[] = data.batches.map((batch) => ({
          id: batch.batch_id,
          composition: batch.composition,
          expiryDate: batch.expiry_date,
          status: batch.status as any,
          medicine_name: batch.medicine_name,
        }));
        setBatches(transformed);
        setLastSynced(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }
    } catch {
      setWalletError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.refresh === "1") {
      fetchDashboardData(true);
    }
  }, [fetchDashboardData, router.isReady, router.query.refresh]);

  useEffect(() => {
    const refreshFlag = localStorage.getItem("manufacturerDashboardRefresh");
    if (refreshFlag === "1") {
      localStorage.removeItem("manufacturerDashboardRefresh");
      fetchDashboardData(true);
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    if (connected) setManualConnecting(false);
  }, [connected]);

  const stats = {
    total: batches.length,
    minted: batches.filter((b) => b.status === "Minted").length,
    inTransit: batches.filter((b) => b.status === "In Transit").length,
  };

  const statCards = [
    {
      id: 1,
      title: "Total Batches",
      value: stats.total,
      icon: Boxes,
      valueClassName: "text-gray-900",
      iconClassName: "text-blue-700",
      iconBgClassName: "bg-blue-100",
      borderClassName: "border-blue-100",
      badgeText: "All",
    },
    {
      id: 2,
      title: "Minted",
      value: stats.minted,
      icon: Package,
      valueClassName: "text-emerald-600",
      iconClassName: "text-emerald-700",
      iconBgClassName: "bg-emerald-100",
      borderClassName: "border-emerald-100",
      badgeText: "On-chain",
    },
    {
      id: 3,
      title: "In Transit",
      value: stats.inTransit,
      icon: TrendingUp,
      valueClassName: "text-amber-600",
      iconClassName: "text-amber-700",
      iconBgClassName: "bg-amber-100",
      borderClassName: "border-amber-100",
      badgeText: "Moving",
    },
  ];
  const sdkConnecting = Boolean(walletState?.connecting);
  const walletConnecting =
    !effectiveConnected && (manualConnecting || sdkConnecting);

  const handleLogout = async () => {
    try {
      const disconnectFn = walletState?.disconnect;
      if (typeof disconnectFn === "function") {
        await disconnectFn();
      }
    } catch (error) {
      console.warn("Wallet disconnect failed:", error);
    } finally {
      localStorage.removeItem("lastConnectedWallet");
      logout();
    }
  };

  const handleOpenBatch = async (batch: Batch) => {
    setOpeningBatchId(batch.id);
    try {
      const details = await getBatchDetailsByBatchId(batch.id);
      localStorage.setItem("currentBatchDetails", JSON.stringify(details));
      router.push(
        `/manufacturer/batch-details?batchId=${encodeURIComponent(batch.id)}`
      );
    } catch {
      // Fallback to table data if full details query fails.
      localStorage.setItem(
        "currentBatchDetails",
        JSON.stringify({
          batch_id: batch.id,
          qr_code: "",
          medicine_name: batch.medicine_name || "Unknown",
          composition: batch.composition,
          expiry_date: batch.expiryDate,
          manufacture_date: "",
          quantity: batch.quantity || "0",
          tx_hash: "",
          policy_id: "",
          asset_name: batch.id,
          status: batch.status,
        })
      );
      router.push(
        `/manufacturer/batch-details?batchId=${encodeURIComponent(batch.id)}`
      );
    } finally {
      setOpeningBatchId("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <DashboardHeader
        connected={effectiveConnected}
        connecting={walletConnecting}
        demoMode={ASSUME_WALLET_CONNECTED && !connected}
        walletBalance={walletBalance}
        checkingBalance={checkingBalance}
        companyName={user?.username || "PharmaCorp Ltd."}
        onLogout={handleLogout}
        onWalletClick={() => {
          setWalletError("");
          setManualConnecting(true);
          setTimeout(() => setManualConnecting(false), 10000);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-7">
        {connected && walletBalance > 0 && walletBalance < MIN_ADA_BALANCE && (
          <div className="mb-6">
            <AlertMessage
              type="warning"
              title="Low Balance Warning"
              message={`You have ${walletBalance.toFixed(
                2
              )} ADA but need at least ${MIN_ADA_BALANCE} ADA to transfer NFTs.`}
              link={{
                text: "Get Test ADA from Faucet",
                url: "https://faucet.preprod.world.dev.cardano.org/",
              }}
            />
          </div>
        )}

        {walletError && (
          <div className="mb-6">
            <AlertMessage
              type="error"
              title="Notice"
              message={walletError}
              onClose={() => setWalletError("")}
            />
          </div>
        )}

        {ASSUME_WALLET_CONNECTED && !connected && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm md:text-base">
              Demo mode is active: wallet is treated as connected for faster
              testing.
            </p>
          </div>
        )}

        {!effectiveConnected && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm md:text-base">
              Wallet not connected. You can still view dashboard data, but
              minting/transfers require a connected Cardano wallet. Use the
              Connect Wallet button in the header to continue.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statCards.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/manufacturer/create-batch")}
              disabled={!effectiveConnected}
              className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Batch
            </button>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center px-5 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Batches</h2>
              {lastSynced && (
                <span className="text-sm text-gray-500">
                  Last synced: {lastSynced}
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
              </div>
            ) : (
              <BatchTable
                batches={batches}
                onViewBatch={handleOpenBatch}
                onCreateBatch={() => router.push("/manufacturer/create-batch")}
              />
            )}
          </div>
        </div>
        {openingBatchId && (
          <p className="text-sm text-gray-600 mt-4">
            Loading batch details for {openingBatchId}...
          </p>
        )}
      </div>
    </div>
  );
}
