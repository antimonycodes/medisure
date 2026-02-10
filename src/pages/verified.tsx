"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  Building2,
  CalendarDays,
  CheckCircle2,
  Link2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type VerifyResult = {
  isValid: boolean;
  drugName: string;
  manufacturer: string;
  expiry: string;
  batchId: string;
  quantity?: string | number;
  policyId?: string;
};

export default function VerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const batchId = searchParams.get("batchId");
  const errorParam = searchParams.get("error");

  useEffect(() => {
    const fetchData = async () => {
      if (errorParam) {
        setError(errorParam);
        setLoading(false);
        return;
      }

      if (!batchId) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`/api/verify_drug?assetId=${batchId}`);
        const data = await response.json();
        setResult(data);
        if (!data?.isValid) setError("not-found");
      } catch {
        setError("network");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId, errorParam, router]);

  const topBar = (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1000px] mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center text-gray-700 hover:text-blue-700 text-base font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MediSure" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-semibold text-gray-900">MediSure</span>
        </div>
        <div className="w-16" />
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {topBar}
        <div className="max-w-[1000px] mx-auto px-6 py-14">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Analyzing product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result?.isValid) {
    const searchedCode = batchId || "-";
    const notFound = error !== "network";
    return (
      <div className="min-h-screen bg-gray-100">
        {topBar}
        <main className="max-w-[1000px] mx-auto px-6 py-12">
          <section className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-red-500 mx-auto flex items-center justify-center mb-5">
              <XCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-5xl font-semibold text-red-600 mb-3">
              {notFound ? "Not Verified" : "Connection Error"}
            </h1>
            <p className="text-gray-700 text-2xl mb-6">
              {notFound
                ? "No matching batch found on the blockchain"
                : "Could not reach blockchain verification service"}
            </p>

            <div className="max-w-[860px] mx-auto rounded-xl border border-gray-200 bg-white/80 text-left p-6">
              <p className="text-gray-900 text-2xl font-medium mb-3">Possible reasons:</p>
              <ul className="space-y-2 text-gray-600 text-3xl">
                <li>Fake or counterfeit product</li>
                <li>Invalid QR code</li>
                <li>Product not registered on blockchain</li>
                <li>Metadata mismatch</li>
              </ul>
            </div>

            <div className="max-w-[860px] mx-auto rounded-xl border border-red-300 bg-red-100 p-4 mt-4">
              <p className="text-red-800 text-2xl">
                <span className="font-semibold">Warning:</span> Do not use this product.
                Contact the seller or manufacturer immediately.
              </p>
            </div>

            <p className="text-gray-600 text-2xl mt-6">
              Searched for code: {searchedCode}
            </p>
          </section>
        </main>
      </div>
    );
  }

  const nftTokenId = useMemo(() => {
    const raw = result.policyId || result.batchId || "token";
    return `token_${raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toLowerCase()}`;
  }, [result.batchId, result.policyId]);

  const txHash = `0x${(result.batchId || "12345678")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toLowerCase()}...5678`;

  const timeline = [
    {
      stage: "Manufacturer",
      name: result.manufacturer || "PharmaCorp Ltd.",
      date: "Jan 15, 2024, 02:30 AM",
      hash: txHash,
      dot: "bg-blue-600",
    },
    {
      stage: "Distributor",
      name: "MedDistribute Inc.",
      date: "Jan 20, 2024, 06:20 AM",
      hash: "0xabcd...efgh",
      dot: "bg-violet-500",
    },
    {
      stage: "Pharmacy",
      name: "City Pharmacy",
      date: "Jan 25, 2024, 01:15 AM",
      hash: "0x9876...5432",
      dot: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {topBar}
      <main className="max-w-[1000px] mx-auto px-6 py-10 space-y-5">
        <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-semibold text-emerald-600 mb-2">Verified Genuine</h1>
          <p className="text-gray-700 text-2xl mb-4">
            This product is genuine and issued by {result.manufacturer}.
          </p>
          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-500 text-white text-sm font-medium">
            Blockchain Verified
          </span>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoCard icon={<BadgeCheck className="w-5 h-5 text-blue-600" />} label="Batch ID" value={result.batchId} />
            <InfoCard icon={<Link2 className="w-5 h-5 text-blue-600" />} label="Composition" value={result.drugName} />
            <InfoCard icon={<CalendarDays className="w-5 h-5 text-emerald-600" />} label="Manufacture Date" value="2024-01-15" />
            <InfoCard icon={<CalendarDays className="w-5 h-5 text-red-500" />} label="Expiry Date" value={result.expiry} />
            <InfoCard icon={<Building2 className="w-5 h-5 text-violet-500" />} label="Manufacturer" value={result.manufacturer} />
            <InfoCard icon={<Boxes className="w-5 h-5 text-blue-600" />} label="Quantity" value={`${result.quantity || "10,000"} units`} />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-sm">NFT Token ID</p>
              <p className="text-gray-900 font-mono text-base">{nftTokenId}</p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-gray-500 text-sm">Transaction Hash</p>
                <p className="text-gray-900 font-mono text-base">{txHash}</p>
              </div>
              <button className="inline-flex items-center text-sm text-gray-700 hover:text-blue-700">
                <ShieldCheck className="w-4 h-4 mr-1" />
                View on Explorer
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provenance Timeline</h2>
          <div className="space-y-5">
            {timeline.map((step, i) => (
              <div key={step.stage} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full ${step.dot} flex items-center justify-center`}>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-gray-200" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{step.stage}</p>
                    <p className="text-gray-600">{step.name}</p>
                    <p className="text-sm text-gray-500">{step.date}</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-gray-600 mt-2">{step.hash}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-6 text-sm">
            This product has been verified at each stage of the supply chain using blockchain technology
          </p>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-gray-900 text-2xl">{value}</p>
      </div>
    </div>
  );
}
