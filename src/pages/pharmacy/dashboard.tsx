"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  Package2,
  Search,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/router";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import {
  getPharmacyById,
  getPharmacyDashboardData,
  type PharmacyBatchItem,
} from "@/api";
import { getPharmacyId } from "@/utils/localStorage";

export default function PharmacyDashboard() {
  useRequireRole([ROLES.PHARMACY]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState<PharmacyBatchItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const fetchData = useCallback(async () => {
    const pharmacyId = getPharmacyId();
    if (!pharmacyId) {
      setError("Pharmacy account is missing entity ID. Please login again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const pharmacy = await getPharmacyById(pharmacyId);
      const data = await getPharmacyDashboardData(pharmacy.wallet_address);
      setBatches(data);
    } catch {
      setError("Failed to load pharmacy dashboard data.");
    } finally {
      setLoading(false);
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
    if (options.length === 1) options.push("Available", "In Transit");
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center text-gray-800 hover:text-blue-700 text-base font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="w-px h-9 bg-gray-200" />
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {user?.username || "My Pharmacy"}
                </h1>
                <p className="text-gray-500 text-base mt-0.5">Pharmacy</p>
              </div>
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
                placeholder="Search by batch ID, medicine name, or distributor..."
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

      <main className="max-w-[1400px] mx-auto px-5 py-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Batches"
            value={stats.total}
            icon={<Boxes className="w-7 h-7 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Available"
            value={stats.available}
            icon={<CheckCircle2 className="w-7 h-7 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="In Transit"
            value={stats.inTransit}
            icon={<Clock3 className="w-7 h-7 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Units"
            value={stats.totalUnits.toLocaleString()}
            icon={<Warehouse className="w-7 h-7 text-violet-600" />}
            iconBg="bg-violet-100"
          />
        </div>

        <h2 className="text-3xl font-semibold text-gray-900 mb-5">
          Pharmacy Inventory Batches ({filteredBatches.length})
        </h2>

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
                <p className="text-3xl text-gray-600">No batches yet</p>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredBatches.map((batch) => (
                  <PharmacyBatchCard key={batch.id} batch={batch} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-lg">{title}</p>
          <p className="text-4xl font-semibold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`w-20 h-20 rounded-2xl ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

function PharmacyBatchCard({ batch }: { batch: PharmacyBatchItem }) {
  const badgeClass =
    batch.status === "In Transit"
      ? "bg-blue-100 text-blue-700"
      : "bg-emerald-100 text-emerald-700";
  const manufacturerProgress = "w-[95%]";
  const distributorProgress = "w-[95%]";
  const pharmacyProgress =
    batch.status === "In Transit" ? "w-[45%]" : "w-[95%]";

  return (
    <article className="border border-gray-200 rounded-2xl p-5 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              {batch.batchId}
            </h3>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
            >
              {batch.status}
            </span>
          </div>
          <p className="text-gray-600 text-lg mt-2">{batch.composition}</p>
        </div>
        <div className="w-[220px] h-[150px] rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
          <Package2 className="w-14 h-14 text-blue-400" />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <InfoRow
          icon={<Package2 className="w-4 h-4 text-gray-400" />}
          label="Quantity:"
          value={`${batch.quantity.toLocaleString()} units`}
        />
        <InfoRow
          icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
          label="Manufactured:"
          value={batch.manufactureDate}
        />
        <InfoRow
          icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
          label="Expires:"
          value={batch.expiryDate}
        />
        <InfoRow
          icon={<MapPin className="w-4 h-4 text-gray-400" />}
          label="Received From:"
          value={batch.supplier}
        />
        <InfoRow
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
          label="NFT Token:"
          value={batch.nftToken}
          valueClassName="font-mono text-sm"
        />
      </div>

      <div className="mt-4 inline-flex px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700">
        {batch.category}
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-2">Supply Chain Progress</p>
        <div className="grid grid-cols-3 gap-2">
          <ProgressSegment widthClassName={manufacturerProgress} />
          <ProgressSegment widthClassName={distributorProgress} />
          <ProgressSegment widthClassName={pharmacyProgress} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-1.5 text-sm text-gray-500">
          <span>Manufacturer</span>
          <span className="text-center">Distributor</span>
          <span className="text-right">Pharmacy</span>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start text-base gap-2">
      <span className="mt-0.5">{icon}</span>
      <span className="text-gray-600">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function ProgressSegment({ widthClassName }: { widthClassName: string }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full bg-emerald-500 rounded-full ${widthClassName}`} />
    </div>
  );
}
