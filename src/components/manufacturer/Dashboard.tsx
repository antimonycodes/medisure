"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Package,
  CheckCircle,
  TrendingUp,
  Activity,
  Wallet,
} from "lucide-react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import type { MeshWallet } from "@meshsdk/core";

// Import all utilities from centralized index
import { mintDrugBatch } from "@/utils/mint";
import { transferDrugBatch } from "@/utils/transfer";
import { mintBatchAPI, getDashboardStats } from "../../api";
import { getManufacturerId } from "@/utils/localStorage";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import {
  MY_POLICY_ID,
  MIN_ADA_BALANCE,
  MESSAGES,
  VALIDATION,
} from "../../constants/index";

// Import types
import type { Batch, FormData } from "@/utils/types";

// Import components
import CreateBatchModal from "./CreateBatchModal";
import TransferModal from "./TransferModal";
import StatCard from "./StatsCard";
import BatchTable from "./BatchTable";
import DashboardHeader from "./DashboardHeader";
import AlertMessage from "./AlertMessage";

const Overview = () => {
  const { connected, wallet } = useWallet();
  const {
    balance: walletBalance,
    checking: checkingBalance,
    checkBalance,
  } = useWalletBalance(connected, wallet);

  // State management
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [status, setStatus] = useState("");
  const [walletError, setWalletError] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [mintedBatchIds, setMintedBatchIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    batchId: "",
    drugName: "",
    manufactureDate: "",
    expiryDate: "",
    chemicalComposition: "",
    quantity: "",
    manufacturer: "PharmaCorp Ltd",
  });

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    const manufacturerId = getManufacturerId();
    if (!manufacturerId) {
      console.warn("No manufacturer ID found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(
        "Fetching dashboard data for manufacturer:",
        manufacturerId
      );

      const data = await getDashboardStats(manufacturerId);
      console.log("Dashboard data received:", data);

      if (data.success) {
        // Transform backend data to match frontend format
        const transformedBatches: Batch[] = data.batches.map((batch) => ({
          id: batch.batch_id,
          composition: batch.composition,
          expiryDate: batch.expiry_date,
          status: batch.status as any,
          views: 0,
          medicine_name: batch.medicine_name,
        }));

        console.log("Transformed batches:", transformedBatches);
        setBatches(transformedBatches);

        // Track minted batches
        const minted = new Set(
          transformedBatches
            .filter((b) => b.status === "Minted" || b.status === "In Transit")
            .map((b) => b.id)
        );
        setMintedBatchIds(minted);
        console.log("Minted batch IDs:", Array.from(minted));
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setStatus("Failed to load dashboard data from backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FINAL FIXED VERSION - Replace your entire handleSubmit function with this
  // This version has proper async/await flow and will definitely call the backend

  const handleSubmit = async () => {
    console.log("[submit] started");

    if (!connected) {
      setStatus(MESSAGES.CONNECT_WALLET);
      return;
    }

    const manufacturerId = getManufacturerId();
    if (!manufacturerId) {
      setStatus("Manufacturer ID not found. Please log in again.");
      return;
    }

    // Validate required fields
    if (
      !formData.drugName ||
      !formData.chemicalComposition ||
      !formData.expiryDate
    ) {
      setStatus("Please fill in all required fields.");
      return;
    }

    setStatus("Step 1/3: Minting on blockchain...");
    setShowSuccess(false);

    try {
      // STEP 1: Blockchain Mint
      console.log("[submit] step 1: minting on blockchain");

      const batchId =
        formData.batchId || "BATCH-" + Math.floor(Math.random() * 10000);

      const batchData = {
        drugName: formData.drugName,
        batchId,
        expiryDate: formData.expiryDate,
        manufacturer: formData.manufacturer,
        quantity: formData.quantity,
      };

      const txHash = await mintDrugBatch(
        wallet as unknown as MeshWallet,
        batchData
      );
      console.log("[submit] blockchain mint successful. TX:", txHash);

      // Get wallet address and asset name
      const addresses = await wallet.getUsedAddresses();
      const manufacturerWallet = addresses[0];
      const { stringToHex } = await import("@meshsdk/core");
      const assetNameHex = stringToHex(batchId);

      // STEP 2: Backend API Call
      console.log("[submit] step 2: calling backend API");
      setStatus("Step 2/3: Saving to database...");

      const backendPayload = {
        batch_id: batchId,
        medicine_name: formData.drugName,
        composition: formData.chemicalComposition,
        manufacturer_id: manufacturerId,
        manufactured_date:
          formData.manufactureDate || new Date().toISOString().split("T")[0],
        expiry_date: formData.expiryDate,
        quantity: formData.quantity || "0",
        policy_id: MY_POLICY_ID,
        asset_name: assetNameHex,
        manufacturer_wallet: manufacturerWallet,
        tx_hash: txHash,
      };

      console.log("[submit] sending to backend:", backendPayload);

      // THIS IS THE CRITICAL LINE - Make sure this actually executes
      const backendResponse = await mintBatchAPI(backendPayload);

      console.log("[submit] backend save successful", backendResponse);

      // STEP 3: Update UI
      console.log("[submit] step 3: updating local state");
      setStatus("Step 3/3: Updating dashboard...");

      const newBatch: Batch = {
        id: batchId,
        composition: formData.chemicalComposition,
        expiryDate: formData.expiryDate,
        status: "Minted",
        views: 0,
        medicine_name: formData.drugName,
        quantity: formData.quantity,
      };

      setBatches([newBatch, ...batches]);
      setMintedBatchIds((prev) => new Set(prev).add(batchId));

      setStatus(
        `Success. Batch minted and saved.\n\nBatch ID: ${batchId}\nTX: ${txHash.substring(
          0,
          20
        )}...`
      );
      setShowSuccess(true);

      // STEP 4: Refresh dashboard
      console.log("[submit] step 4: refreshing dashboard");
      await fetchDashboardData();

      // STEP 5: Close modal after delay
      console.log("[submit] step 5: closing modal in 2 seconds");
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
        setFormData({
          batchId: "",
          drugName: "",
          manufactureDate: "",
          expiryDate: "",
          chemicalComposition: "",
          quantity: "",
          manufacturer: "PharmaCorp Ltd",
        });
        setStatus("");
      }, 2000);

      console.log("[submit] completed");
    } catch (error: any) {
      console.error("[submit] error caught");
      console.error("Full error:", error);

      let errorMessage = "Error: ";

      if (error.response) {
        console.error("Backend error response:", error.response.data);
        errorMessage +=
          error.response.data.error ||
          error.response.data.message ||
          error.message;
      } else if (error.request) {
        console.error("No response from backend");
        errorMessage += "No response from backend. Check if server is running.";
      } else {
        errorMessage += error.message;
      }

      setStatus(errorMessage);
      setShowSuccess(false);
    }
  };
  // Also add this helper function to check if API is reachable
  const checkBackendHealth = async () => {
    try {
      console.log("[health] checking backend status");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/health`,
        {
          method: "GET",
        }
      );
      console.log("[health] backend check:", response.ok);
      return response.ok;
    } catch (error) {
      console.error("[health] backend check failed:", error);
      return false;
    }
  };

  const handleTransfer = async () => {
    if (!connected || !selectedBatch || !recipientAddress.trim()) {
      setStatus(MESSAGES.CONNECT_WALLET);
      return;
    }

    if (!VALIDATION.CARDANO_ADDRESS_PATTERN.test(recipientAddress)) {
      setStatus(MESSAGES.INVALID_ADDRESS);
      return;
    }

    if (!mintedBatchIds.has(selectedBatch.id)) {
      setStatus(MESSAGES.BATCH_NOT_MINTED);
      return;
    }

    setTransferring(true);
    setStatus("Checking wallet balance...");

    try {
      const utxos = await wallet.getUtxos();
      if (!utxos?.length) throw new Error("No UTxOs found");

      let totalLovelace = 0;
      utxos.forEach((utxo: any) => {
        const lovelace = utxo.output.amount.find(
          (a: any) => a.unit === "lovelace"
        );
        if (lovelace) totalLovelace += parseInt(lovelace.quantity);
      });

      const totalAda = totalLovelace / 1000000;
      if (totalAda < MIN_ADA_BALANCE) {
        throw new Error(
          `${MESSAGES.INSUFFICIENT_FUNDS} You have: ${totalAda.toFixed(2)} ADA`
        );
      }

      const { stringToHex } = await import("@meshsdk/core");
      const assetNameHex = stringToHex(selectedBatch.id);
      const hash = await transferDrugBatch(
        wallet as unknown as MeshWallet,
        recipientAddress,
        MY_POLICY_ID,
        assetNameHex
      );

      setBatches((prev) =>
        prev.map((b) =>
          b.id === selectedBatch.id ? { ...b, status: "In Transit" } : b
        )
      );

      setMintedBatchIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedBatch.id);
        return newSet;
      });

      setStatus(
        `${MESSAGES.TRANSFER_SUCCESS}\nTx: ${hash.substring(0, 20)}...`
      );
      await checkBalance();

      setTimeout(async () => {
        setShowTransferModal(false);
        setSelectedBatch(null);
        setRecipientAddress("");
        setTransferring(false);
        setStatus("");
        await fetchDashboardData(); // Refresh from backend
      }, 3000);
    } catch (error: any) {
      console.error("Transfer error:", error);
      setStatus(`Transfer failed: ${error.message}`);
      setTransferring(false);
    }
  };

  // Calculate statistics from backend data
  const stats = {
    total: batches.length,
    active: batches.filter((b) => b.status === "Active").length,
    minted: batches.filter((b) => b.status === "Minted").length,
    inTransit: batches.filter((b) => b.status === "In Transit").length,
  };

  const statCards = [
    {
      id: 1,
      title: "Total Batches",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      change: "+12%",
    },
    {
      id: 2,
      title: "Active Batches",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      change: "+8%",
    },
    {
      id: 3,
      title: "Minted",
      value: stats.minted,
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
      change: "+5%",
    },
    {
      id: 4,
      title: "In Transit",
      value: stats.inTransit,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      change: "+15%",
    },
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <DashboardHeader
        connected={connected}
        walletBalance={walletBalance}
        checkingBalance={checkingBalance}
        onWalletClick={() => setWalletError("")}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Low Balance Warning */}
        {connected && walletBalance > 0 && walletBalance < MIN_ADA_BALANCE && (
          <div className="mb-8">
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

        {/* Wallet Error */}
        {walletError && (
          <div className="mb-8">
            <AlertMessage
              type="error"
              title="Wallet Connection Error"
              message={walletError}
              onClose={() => setWalletError("")}
            />
          </div>
        )}

        {!connected ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600">
              Please connect your Cardano wallet to start managing batches.
            </p>
          </div>
        ) : (
          <>
            {/* Stats from Backend */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <StatCard key={card.id} {...card} />
              ))}
            </div>

            {/* Status */}
            {status && (
              <div className="mb-8">
                <AlertMessage
                  type={
                    status.startsWith("Success")
                      ? "success"
                      : status.startsWith("Error") || status.startsWith("Transfer failed")
                      ? "error"
                      : "info"
                  }
                  message={status}
                />
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={() => setShowModal(true)}
              className="mb-8 flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Batch
            </button>

            {/* Table from Backend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Batches
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Data loaded from backend database
                </p>
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
                    mintedBatchIds={mintedBatchIds}
                    onViewBatch={(b) => console.log("View:", b)}
                    onTransferBatch={(b) => {
                      setSelectedBatch(b);
                      setShowTransferModal(true);
                    }}
                    onCreateBatch={() => setShowModal(true)}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CreateBatchModal
          setShowModal={setShowModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          showSuccess={showSuccess}
        />
      )}

      {showTransferModal && selectedBatch && (
        <TransferModal
          batch={selectedBatch}
          recipientAddress={recipientAddress}
          transferring={transferring}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedBatch(null);
            setRecipientAddress("");
          }}
          onAddressChange={setRecipientAddress}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
};

export default Overview;
