"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { getManufacturerId } from "@/utils/localStorage";
import { mintBatchAPI } from "@/api";
import { MESSAGES, MY_POLICY_ID } from "@/constants";
import {
  ASSUME_WALLET_CONNECTED,
  WALLET_FEATURES_ENABLED,
  getMockTxHash,
  MOCK_WALLET_ADDRESS,
} from "@/utils/walletMode";

export default function CreateBatchPage() {
  useRequireRole([ROLES.MANUFACTURER]);
  const router = useRouter();
  const connected = false;
  const wallet = null;
  const effectiveConnected =
    (WALLET_FEATURES_ENABLED && connected) || ASSUME_WALLET_CONNECTED;
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    batchId: "",
    manufactureDate: "",
    expiryDate: "",
    chemicalComposition: "",
    quantity: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const isDateOrderInvalid =
    !!form.manufactureDate &&
    !!form.expiryDate &&
    form.expiryDate <= form.manufactureDate;
  const isQuantityInvalid = !!form.quantity && Number(form.quantity) <= 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!effectiveConnected) {
      toast.warning(MESSAGES.CONNECT_WALLET);
      return;
    }

    const manufacturerId = getManufacturerId();
    if (!manufacturerId) {
      toast.error("Please login again.");
      return;
    }

    if (
      !form.batchId ||
      !form.manufactureDate ||
      !form.expiryDate ||
      !form.chemicalComposition ||
      !form.quantity
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }
    if (isDateOrderInvalid) {
      toast.warn("Expiry date must be after manufacture date.");
      return;
    }
    if (isQuantityInvalid) {
      toast.warn("Quantity must be greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const drugName =
        form.chemicalComposition.split(",")[0]?.trim() || form.batchId;

      let txHash = "";
      let manufacturerWallet = "";

      txHash = getMockTxHash();
      manufacturerWallet = MOCK_WALLET_ADDRESS;

      const assetNameHex = Array.from(form.batchId)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");

      const backendResponse = await mintBatchAPI({
        batch_id: form.batchId,
        medicine_name: drugName,
        composition: form.chemicalComposition,
        manufacturer_id: manufacturerId,
        manufactured_date: form.manufactureDate,
        expiry_date: form.expiryDate,
        quantity: form.quantity,
        policy_id: MY_POLICY_ID,
        asset_name: assetNameHex,
        manufacturer_wallet: manufacturerWallet,
        tx_hash: txHash,
      });

      localStorage.setItem(
        "currentBatchDetails",
        JSON.stringify({
          batch_id: form.batchId,
          qr_code: backendResponse.qr_code,
          medicine_name: drugName,
          composition: form.chemicalComposition,
          expiry_date: form.expiryDate,
          manufacture_date: form.manufactureDate,
          quantity: form.quantity,
          tx_hash: txHash,
          policy_id: MY_POLICY_ID,
          asset_name: form.batchId,
        })
      );

      toast.success("Batch minted successfully!");
      router.push(`/manufacturer/batch-details?batchId=${encodeURIComponent(form.batchId)}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to mint batch."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-7">
          <button
            onClick={() => router.push("/manufacturer/dashboard")}
            className="inline-flex items-center text-gray-700 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-semibold text-gray-900">Create New Batch</h1>
          <p className="text-gray-600 mt-3 text-lg">
            Mint a new medicine batch on the blockchain
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10"
        >
          <div className="space-y-7">
            <div>
              <label className="block text-base font-medium text-gray-800 mb-3">
                Batch ID *
              </label>
              <input
                type="text"
                value={form.batchId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, batchId: e.target.value }))
                }
                placeholder="e.g., BATCH-2024-001"
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Manufacture Date *
                </label>
                <input
                  type="date"
                  value={form.manufactureDate}
                  max={today}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      manufactureDate: e.target.value,
                    }))
                  }
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  min={form.manufactureDate || today}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, expiryDate: e.target.value }))
                  }
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-3">
                Chemical Composition *
              </label>
              <input
                type="text"
                value={form.chemicalComposition}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    chemicalComposition: e.target.value,
                  }))
                }
                placeholder="e.g., Paracetamol 500mg, Caffeine 65mg"
                className="w-full h-16 rounded-xl border border-gray-200 bg-gray-100 px-4 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-3">
                Quantity (Units)
              </label>
              <input
                type="number"
                value={form.quantity}
                min={1}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, quantity: e.target.value }))
                }
                placeholder="e.g., 10000"
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isQuantityInvalid && (
                <p className="text-sm text-amber-700 mt-2">
                  Quantity must be greater than zero.
                </p>
              )}
            </div>
          </div>

          {isDateOrderInvalid && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-800">
                Expiry date must be after manufacture date.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 mt-8 pt-8">
            <button
              type="submit"
              disabled={submitting || isDateOrderInvalid || isQuantityInvalid}
              className="w-full h-14 rounded-xl bg-blue-400 hover:bg-blue-500 text-white text-base font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></span>
                  Minting on Blockchain...
                </>
              ) : (
                "Mint Batch on Blockchain"
              )}
            </button>
          </div>

          {submitting && (
            <div className="mt-6 border border-emerald-400 bg-emerald-50 rounded-xl px-4 py-4">
              <p className="text-blue-800 text-base font-semibold">
                Processing transaction...
              </p>
              <p className="text-blue-700 text-sm mt-1">
                This may take a few moments. Please do not close this window.
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
