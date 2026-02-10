"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Clock3,
  Eye,
  LogOut,
  RefreshCw,
  Search,
  Send,
  Warehouse,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import {
  getDistributorById,
  getDistributorDashboardData,
  getPharmacies,
  recordTransferWithFallback,
  type SupplyChainEntity,
  type TransferBatchPayload,
  type DistributorBatchItem,
} from "@/api";
import { getDistributorId } from "@/utils/localStorage";
import { getMockTxHash } from "@/utils/walletMode";
import { toast } from "react-toastify";
import StatCard from "@/components/manufacturer/StatsCard";

export default function DistributorDashboard() {
  useRequireRole([ROLES.DISTRIBUTOR]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState<DistributorBatchItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [distributorWallet, setDistributorWallet] = useState("");
  const [pharmacies, setPharmacies] = useState<SupplyChainEntity[]>([]);
  const [requestingBatchId, setRequestingBatchId] = useState("");
  const [showPharmacyPicker, setShowPharmacyPicker] = useState(false);
  const [selectedBatchForRequest, setSelectedBatchForRequest] =
    useState<DistributorBatchItem | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");
  const [openingBatchId, setOpeningBatchId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState("");

  const fetchData = useCallback(async (manualRefresh = false) => {
    const distributorId = getDistributorId();
    if (!distributorId) {
      setError("Distributor account is missing entity ID. Please login again.");
      setLoading(false);
      return;
    }
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const distributorEntity = await getDistributorById(distributorId);
      const [data, pharmacyList] = await Promise.all([
        getDistributorDashboardData(distributorEntity.wallet_address),
        getPharmacies(),
      ]);
      setDistributorWallet(distributorEntity.wallet_address);
      const verifiedPharmacies = pharmacyList.filter((p) => p.verified);
      setPharmacies(verifiedPharmacies.length > 0 ? verifiedPharmacies : pharmacyList);
      setBatches(data);
      setLastSynced(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      setError("Failed to load distributor dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(batches.map((b) => b.category)));
    const preferredOrder = [
      "Antibiotic",
      "Pain Relief",
      "Acid Reducer",
      "Diabetes",
      "Blood Pressure",
      "General",
    ];
    const ordered = preferredOrder.filter((name) => values.includes(name));
    const extra = values
      .filter((name) => !preferredOrder.includes(name))
      .sort((a, b) => a.localeCompare(b));
    return ["All Categories", ...ordered, ...extra];
  }, [batches]);

  const statusOptions = useMemo(() => {
    const present = new Set(batches.map((b) => b.status));
    const options = ["All Status"];
    if (present.has("Available")) options.push("Available");
    if (present.has("In Transit")) options.push("In Transit");
    if (options.length === 1) {
      options.push("Available", "In Transit");
    }
    return options;
  }, [batches]);

  const filteredBatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const searchMatch =
        !q ||
        batch.batchId.toLowerCase().includes(q) ||
        batch.medicineName.toLowerCase().includes(q) ||
        batch.supplier.toLowerCase().includes(q);
      const statusMatch =
        statusFilter === "All Status" || batch.status === statusFilter;
      const categoryMatch =
        categoryFilter === "All Categories" || batch.category === categoryFilter;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [batches, categoryFilter, search, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredBatches.length;
    const available = filteredBatches.filter((b) => b.status === "Available").length;
    const inTransit = filteredBatches.filter((b) => b.status === "In Transit").length;
    const totalUnits = filteredBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
    return { total, available, inTransit, totalUnits };
  }, [filteredBatches]);

  const handleOpenRequestModal = (batch: DistributorBatchItem) => {
    if (batch.status !== "Available") {
      toast.info("This batch is already in transit.");
      return;
    }
    if (pharmacies.length === 0) {
      toast.warning("No verified pharmacy found in backend yet.");
      return;
    }
    setSelectedBatchForRequest(batch);
    setSelectedPharmacyId(pharmacies[0].id);
    setShowPharmacyPicker(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedBatchForRequest) return;
    const selectedPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId);
    if (!selectedPharmacy) {
      toast.warning("Please select a pharmacy.");
      return;
    }
    if (!distributorWallet) {
      toast.error("Distributor wallet is not available. Please login again.");
      return;
    }
    const payload: TransferBatchPayload = {
      batch_id: selectedBatchForRequest.batchId,
      from_wallet: distributorWallet,
      to_wallet: selectedPharmacy.wallet_address,
      tx_hash: getMockTxHash(),
    };

    setRequestingBatchId(selectedBatchForRequest.id);
    try {
      await recordTransferWithFallback(payload);
      toast.success(`Batch forwarded to ${selectedPharmacy.name}.`);
      setShowPharmacyPicker(false);
      setSelectedBatchForRequest(null);
      setSelectedPharmacyId("");
      await fetchData();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to transfer batch to pharmacy."
      );
    } finally {
      setRequestingBatchId("");
    }
  };

  const handleViewDetails = async (batch: DistributorBatchItem) => {
    setOpeningBatchId(batch.batchId);
    try {
      const details = {
        batch_id: batch.batchId,
        qr_code: "",
        medicine_name: batch.medicineName,
        composition: batch.composition,
        expiry_date: batch.expiryDate,
        manufacture_date: batch.manufactureDate,
        quantity: String(batch.quantity || 0),
        tx_hash: batch.lastTransferTxHash || "",
        policy_id: "",
        asset_name: batch.batchId,
        status: batch.status,
        supplier: batch.supplier,
      };
      localStorage.setItem("distributorCurrentBatchDetails", JSON.stringify(details));
      router.push(
        `/distributor/batch-details?batchId=${encodeURIComponent(batch.batchId)}`
      );
    } finally {
      setOpeningBatchId("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                {user?.username || "Distributor Account"}
              </p>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-base font-medium"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_210px_230px] gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by batch ID, medicine name, or supplier..."
                className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 rounded-xl border border-gray-200 bg-gray-50 px-4 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-14 rounded-xl border border-gray-200 bg-gray-50 px-4 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-7">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Batches"
            value={stats.total}
            icon={Boxes}
            iconClassName="text-blue-700"
            iconBgClassName="bg-blue-100"
            borderClassName="border-blue-100"
            badgeText="All"
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon={CheckCircle2}
            valueClassName="text-emerald-600"
            iconClassName="text-emerald-700"
            iconBgClassName="bg-emerald-100"
            borderClassName="border-emerald-100"
            badgeText="Ready"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            icon={Clock3}
            valueClassName="text-amber-600"
            iconClassName="text-amber-700"
            iconBgClassName="bg-amber-100"
            borderClassName="border-amber-100"
            badgeText="Moving"
          />
          <StatCard
            title="Total Units"
            value={stats.totalUnits.toLocaleString()}
            icon={Warehouse}
            iconClassName="text-violet-700"
            iconBgClassName="bg-violet-100"
            borderClassName="border-violet-100"
            badgeText="Inventory"
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Medicine Batches ({filteredBatches.length})
          </h2>
          <div className="flex items-center gap-3">
            {lastSynced && (
              <span className="text-sm text-gray-500">Last synced: {lastSynced}</span>
            )}
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden min-h-[470px]">
          {loading ? (
            <div className="h-[470px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-base text-gray-600">Loading batches...</p>
              </div>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="h-[470px] flex items-center justify-center">
              <div className="text-center">
                <Boxes className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No batches yet</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Batch ID
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Composition
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Supplier
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Qty
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Expiry
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((batch) => {
                    const isTransferring = requestingBatchId === batch.id;
                    const isAvailable = batch.status === "Available";
                    return (
                      <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50/70">
                        <td className="px-5 py-4 align-top">
                          <p className="font-semibold text-gray-900">{batch.batchId}</p>
                          <p className="text-xs text-gray-500 mt-1">{batch.nftToken}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-800 align-top">
                          {batch.composition}
                        </td>
                        <td className="px-5 py-4 text-gray-700 align-top">
                          {batch.supplier}
                        </td>
                        <td className="px-5 py-4 text-gray-700 align-top">
                          {batch.quantity.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-gray-700 align-top">
                          {batch.expiryDate}
                        </td>
                        <td className="px-5 py-4 align-top">
                          <span className="inline-flex px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-700 bg-white">
                            {batch.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              isAvailable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(batch)}
                              className="h-9 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 inline-flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleOpenRequestModal(batch)}
                              disabled={!isAvailable || isTransferring}
                              className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4 mr-1.5" />
                              {isTransferring ? "Transferring..." : "Transfer"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {openingBatchId && (
          <p className="text-sm text-gray-600 mt-4">
            Loading batch details for {openingBatchId}...
          </p>
        )}
      </main>

      {showPharmacyPicker && selectedBatchForRequest && (
        <PharmacyPickerModal
          batch={selectedBatchForRequest}
          pharmacies={pharmacies}
          selectedPharmacyId={selectedPharmacyId}
          onSelectPharmacy={setSelectedPharmacyId}
          requesting={requestingBatchId === selectedBatchForRequest.id}
          onClose={() => {
            if (requestingBatchId) return;
            setShowPharmacyPicker(false);
          }}
          onConfirm={handleConfirmRequest}
        />
      )}
    </div>
  );
}

function PharmacyPickerModal({
  batch,
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
  requesting,
  onClose,
  onConfirm,
}: {
  batch: DistributorBatchItem;
  pharmacies: SupplyChainEntity[];
  selectedPharmacyId: string;
  onSelectPharmacy: (value: string) => void;
  requesting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const selectedPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Transfer Batch to Pharmacy
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Select destination pharmacy for this transfer.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={requesting}
            className="w-9 h-9 rounded-lg border border-gray-200 inline-flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Batch</p>
            <p className="text-base font-semibold text-gray-900">
              {batch.batchId}
            </p>
            <p className="text-sm text-gray-600 mt-1">{batch.composition}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pharmacy
            </label>
            <select
              value={selectedPharmacyId}
              onChange={(e) => onSelectPharmacy(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPharmacy && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Destination Wallet</p>
              <p className="text-sm text-blue-900 font-mono break-all mt-1">
                {selectedPharmacy.wallet_address}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={requesting}
            className="h-11 px-5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!selectedPharmacyId || requesting}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {requesting ? "Transferring..." : "Confirm Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
