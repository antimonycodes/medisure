"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BatchDetailsPage from "../../components/manufacturer/BatchDetails";

export default function BatchDetails() {
  const router = useRouter();
  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get batch details from localStorage
    const storedData = localStorage.getItem("currentBatchDetails");

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBatchData(data);
        setLoading(false);

        // Clear from localStorage after loading
        // (optional - remove this if you want to keep it)
        // localStorage.removeItem("currentBatchDetails");
      } catch (error) {
        console.error("Error parsing batch data:", error);
        router.push("/manufacturer/dashboard");
      }
    } else {
      // No data found, redirect to dashboard
      router.push("/manufacturer/dashboard");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batchData) {
    return null;
  }

  return <BatchDetailsPage batchData={batchData} />;
}
