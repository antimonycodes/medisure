"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BatchDetailsPage from "../../components/manufacturer/BatchDetails";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { getBatchDetailsByBatchId } from "@/api";

type BatchDetailsData = {
  batch_id: string;
  qr_code: string;
  medicine_name: string;
  composition: string;
  expiry_date: string;
  manufacture_date: string;
  quantity: string;
  tx_hash: string;
  policy_id: string;
  asset_name: string;
  status?: "Pending" | "Minted" | "In Transit";
};

export default function BatchDetails() {
  useRequireRole([ROLES.MANUFACTURER]);
  const router = useRouter();
  const [batchData, setBatchData] = useState<BatchDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const storedData = localStorage.getItem("currentBatchDetails");

      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setBatchData(data);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing batch data:", error);
        }
      }

      const batchId = router.query.batchId;
      if (typeof batchId === "string" && batchId.trim()) {
        try {
          const details = await getBatchDetailsByBatchId(batchId);
          setBatchData(details);
          localStorage.setItem("currentBatchDetails", JSON.stringify(details));
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error loading batch details from backend:", error);
        }
      }

      router.push("/manufacturer/dashboard");
    };

    if (!router.isReady) return;
    load();
  }, [router, router.isReady, router.query.batchId]);

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
