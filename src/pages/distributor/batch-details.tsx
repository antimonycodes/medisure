"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Package2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/router";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { getBatchDetailsByBatchId } from "@/api";

type DistributorBatchDetails = {
  batch_id: string;
  medicine_name: string;
  composition: string;
  manufacture_date: string;
  expiry_date: string;
  quantity: string;
  tx_hash: string;
  status?: "Available" | "In Transit";
  supplier?: string;
};

export default function DistributorBatchDetailsPage() {
  useRequireRole([ROLES.DISTRIBUTOR]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batchData, setBatchData] = useState<DistributorBatchDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      const stored = localStorage.getItem("distributorCurrentBatchDetails");
      if (stored) {
        try {
          setBatchData(JSON.parse(stored));
          setLoading(false);
          return;
        } catch {
          // continue to API fallback
        }
      }

      const batchId = router.query.batchId;
      if (typeof batchId === "string" && batchId.trim()) {
        try {
          const details = await getBatchDetailsByBatchId(batchId);
          setBatchData({
            batch_id: details.batch_id,
            medicine_name: details.medicine_name,
            composition: details.composition,
            manufacture_date: details.manufacture_date,
            expiry_date: details.expiry_date,
            quantity: details.quantity,
            tx_hash: details.tx_hash,
            status:
              details.status === "In Transit" ? "In Transit" : "Available",
          });
          setLoading(false);
          return;
        } catch {
          // fall through
        }
      }

      router.push("/distributor/dashboard");
    };

    if (!router.isReady) return;
    load();
  }, [router, router.isReady, router.query.batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batchData) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-7">
          <button
            onClick={() => router.push("/distributor/dashboard")}
            className="inline-flex items-center text-gray-800 hover:text-blue-700 text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            {batchData.batch_id}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">{batchData.composition}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Batch Information</h2>
          <InfoRow icon={<Package2 className="w-4 h-4 text-gray-500" />} label="Medicine" value={batchData.medicine_name || batchData.composition} />
          <InfoRow icon={<Package2 className="w-4 h-4 text-gray-500" />} label="Quantity" value={`${batchData.quantity} units`} />
          <InfoRow icon={<CalendarDays className="w-4 h-4 text-gray-500" />} label="Manufactured" value={batchData.manufacture_date || "-"} />
          <InfoRow icon={<CalendarDays className="w-4 h-4 text-gray-500" />} label="Expires" value={batchData.expiry_date || "-"} />
          <InfoRow icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} label="Status" value={batchData.status || "Available"} />
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Blockchain Record</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Transaction Hash</p>
            <p className="text-sm font-mono text-gray-900 break-all mt-1">
              {batchData.tx_hash || "N/A"}
            </p>
          </div>
          <button
            type="button"
            disabled={!batchData.tx_hash}
            onClick={() =>
              window.open(
                `https://preprod.cardanoscan.io/transaction/${batchData.tx_hash}`,
                "_blank"
              )
            }
            className="mt-4 inline-flex items-center text-sm text-gray-800 hover:text-blue-700 disabled:opacity-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </button>
        </section>
      </main>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 py-2 text-base">
      {icon}
      <span className="text-gray-600">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
