import React, { useState, useEffect } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import {
  Package,
  Truck,
  Settings,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Wallet,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getPharmacyDashboardStats,
  receiveBatchAPI,
  PharmacyDashboardStats,
} from "@/api";

const PharmacyDashboard: React.FC = () => {
  const { connected, wallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PharmacyDashboardStats | null>(null);
  const [receiving, setReceiving] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<{ [key: string]: string }>({});

  const fetchStats = async () => {
    if (!connected || !wallet) return;
    try {
      setLoading(true);
      const address = await wallet.getChangeAddress();
      const response = await getPharmacyDashboardStats(address);
      setStats(response);
    } catch (error) {
      console.error("Error fetching pharmacy stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchStats();
    }
  }, [connected]);

  const handleReceive = async (batchId: string, internalId: string) => {
    if (!wallet) return;
    const price = parseFloat(priceInput[internalId]);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setReceiving(internalId);
      const address = await wallet.getChangeAddress();

      await receiveBatchAPI({
        batch_id: internalId,
        wallet_address: address,
        price_per_unit: price,
      });

      toast.success("Batch received and added to inventory!");
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to receive batch");
    } finally {
      setReceiving(null);
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
          <Wallet className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Connect Your Wallet
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Please connect your Cardano wallet to access the pharmacy management
          system and your inventory.
        </p>
        <CardanoWallet />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Inventory
            </span>
          </div>
          <h4 className="text-3xl font-bold text-gray-900">
            {stats?.total_inventory || 0}
          </h4>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Distinct Batches
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-nowrap">
              In Transit
            </span>
          </div>
          <h4 className="text-3xl font-bold text-gray-900">
            {stats?.pending_transfers || 0}
          </h4>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Incoming Batches
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900">Chain Status</h4>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600 font-semibold bg-green-50/50 p-4 rounded-2xl border border-green-100">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">
              Network Synced: Blockfrost API Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Incoming Transfers Section */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-amber-500" />
              Incoming
            </h3>
            {stats?.incoming?.length ? (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {stats.incoming.length} PENDING
              </span>
            ) : null}
          </div>

          <div className="space-y-4">
            {stats?.incoming?.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                <p className="text-gray-400 font-medium">
                  No incoming transfers found
                </p>
              </div>
            ) : (
              stats?.incoming?.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:border-amber-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {batch.medicine_name}
                      </h4>
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-tight">
                        #{batch.batch_id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Expires: {batch.expiry_date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="w-4 h-4 mr-2 text-gray-400" />
                      From: {batch.from_wallet.slice(0, 10)}...
                      {batch.from_wallet.slice(-6)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                      Retail Price (ADA)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="e.g. 150"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={priceInput[batch.id] || ""}
                        onChange={(e) =>
                          setPriceInput({
                            ...priceInput,
                            [batch.id]: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => handleReceive(batch.batch_id, batch.id)}
                        disabled={receiving === batch.id}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center"
                      >
                        {receiving === batch.id ? "Syncing..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Current Inventory Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-500" />
              Active Inventory
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                className="bg-gray-100 rounded-full pl-10 pr-6 py-2 text-sm border-transparent focus:bg-white focus:border-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Medication
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Batch Info
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Stock Qty
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Pricing
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.inventory?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-400 font-medium"
                      >
                        Inventory is empty. Use the "Incoming" section to
                        receive batches.
                      </td>
                    </tr>
                  ) : (
                    stats?.inventory?.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {item.batch_details?.medicine_name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.batch_details?.composition?.slice(0, 20)}
                                ...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600 block w-fit">
                            {item.batch_details?.batch_id}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1 block tracking-wide">
                            EXP: {item.batch_details?.expiry_date}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-900">
                            {item.quantity_available}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            Units
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-purple-600">
                            {item.price_per_unit} ADA
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase">
                            Per Unit
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1.5 rounded-full w-fit">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            In Stock
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
