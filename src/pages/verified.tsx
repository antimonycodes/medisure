"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  Calendar,
  Building2,
  Eye,
  ExternalLink,
  MapPin,
  AlertCircle,
  XCircle,
} from "lucide-react";

const verified = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
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
      } catch (err) {
        setError("network");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId, errorParam, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying product...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !result?.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                {error === "network" ? (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-red-800 mb-2">
              {error === "network" ? "Connection Error" : "Product Not Found"}
            </h1>

            <p className="text-gray-600 mb-6">
              {error === "network"
                ? "Unable to verify the product. Please check your internet connection and try again."
                : "This product ID does not exist on the blockchain. It may be counterfeit or invalid."}
            </p>

            {batchId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Batch ID:</strong> {batchId}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "tel:+1234567890")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Verified Product
  const timeline = [
    {
      stage: "Manufacturer",
      name: result.manufacturer || "PharmaCorp Ltd",
      date: "Jan 15, 2024, 02:30 AM",
      hash: "nPxu123a...5e76",
      color: "blue",
      icon: "M",
    },
    {
      stage: "Distributor",
      name: "MedDistribute Inc",
      date: "Jan 20, 2024, 10:20 AM",
      hash: "pRvudu3r...ef3g",
      color: "purple",
      icon: "D",
    },
    {
      stage: "Pharmacy",
      name: "City Pharmacy",
      date: "Jan 25, 2024, 01:15 AM",
      hash: "pRrma78y...5a32",
      color: "green",
      icon: "P",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Verified Badge */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            ✅ Verified Genuine
          </h1>
          <p className="text-base text-green-700 mb-4">
            This product is authentic and issued by {result.manufacturer}.
          </p>
          <button className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            Blockchain Verified
          </button>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Package className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Batch ID</p>
                <p className="text-sm font-semibold text-gray-900">
                  {result.batchId}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-5 h-5 flex items-center justify-center text-blue-500 mr-3 mt-0.5 shrink-0">
                <span className="text-sm">💊</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Drug Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {result.drugName}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Building2 className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Manufacturer</p>
                <p className="text-sm font-semibold text-gray-900">
                  {result.manufacturer}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {result.expiry}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Blockchain Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">NFT Token ID</p>
              <p className="text-sm font-semibold text-gray-900">
                token_{batchId}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Transaction Hash</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 px-4 py-3 rounded-lg gap-2">
                <p className="text-sm font-mono text-gray-900 break-all">
                  0x1a3b...3ef9
                </p>
                <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium whitespace-nowrap">
                  <Eye className="w-4 h-4 mr-1" />
                  View in Explorer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Provenance Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Provenance Timeline
          </h2>

          <div className="space-y-6">
            {timeline.map((item, index) => {
              const isLast = index === timeline.length - 1;
              let bgColor = "bg-blue-100";
              let textColor = "text-blue-700";
              let lineColor = "border-blue-200";

              if (item.color === "purple") {
                bgColor = "bg-purple-100";
                textColor = "text-purple-700";
                lineColor = "border-purple-200";
              } else if (item.color === "green") {
                bgColor = "bg-green-100";
                textColor = "text-green-700";
                lineColor = "border-green-200";
              }

              return (
                <div key={index} className="relative">
                  <div className="flex items-start">
                    <div className="shrink-0 relative">
                      <div
                        className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center ${textColor} font-bold text-lg`}
                      >
                        {item.icon}
                      </div>
                      {!isLast && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-0.5 border-l-2 ${lineColor} -mb-6`}
                        ></div>
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {item.stage}
                          </h3>
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.date}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs font-mono text-gray-600 break-all">
                            {item.hash}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
          <p className="text-sm text-blue-800">
            This product has been verified at each stage of the supply chain
            using blockchain technology
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Report
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
          >
            Verify Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default verified;
