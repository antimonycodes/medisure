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
import { MeshWallet, stringToHex } from "@meshsdk/core";

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
import CreateBatchModal from "../../components/manufacturer/CreateBatchModal";
import TransferModal from "../../components/manufacturer/TransferModal";
import StatCard from "../../components/manufacturer/StatsCard";
import BatchTable from "../../components/manufacturer/BatchTable";
import DashboardHeader from "../../components/manufacturer/DashboardHeader";
import AlertMessage from "../../components/manufacturer/AlertMessage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Overview = () => {
  const { connected, wallet } = useWallet();
  const {
    balance: walletBalance,
    checking: checkingBalance,
    checkBalance,
  } = useWalletBalance(connected, wallet);

  const router = useRouter();
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
      const data = await getDashboardStats(manufacturerId);
      console.log("Dashboard data received:", data);

      if (data.success) {
        const transformedBatches: Batch[] = data.batches.map((batch) => ({
          id: batch.batch_id,
          composition: batch.composition,
          expiryDate: batch.expiry_date,
          status: batch.status as any,
          medicine_name: batch.medicine_name,
        }));

        setBatches(transformedBatches);

        // Track minted batches
        const minted = new Set(
          transformedBatches
            .filter((b) => b.status === "Minted" || b.status === "In Transit")
            .map((b) => b.id)
        );
        setMintedBatchIds(minted);
      }
    } catch (error: any) {
      console.error(" Error fetching dashboard data:", error);
      setStatus("Failed to load dashboard data");
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

  const handleSubmit = async () => {
    if (!connected) {
      toast.success(MESSAGES.CONNECT_WALLET);
      return;
    }

    const manufacturerId = getManufacturerId();
    if (!manufacturerId) {
      toast.error(" Please log in again.");
      return;
    }

    // Validate required fields
    if (
      !formData.drugName ||
      !formData.chemicalComposition ||
      !formData.expiryDate
    ) {
      toast.warn(" Please fill in all required fields");
      return;
    }

    setShowSuccess(false);

    try {
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
      console.log("Blockchain mint successful! TX:", txHash);

      // Get wallet address and asset name
      const addresses = await wallet.getUsedAddresses();
      const manufacturerWallet = addresses[0];
      const assetNameHex = stringToHex(batchId);

      // Backend API Call

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

      const backendResponse = await mintBatchAPI(backendPayload);

      console.log(backendResponse);

      const batchDetailsData = {
        batch_id: batchId,
        qr_code: backendResponse.qr_code,
        medicine_name: formData.drugName,
        composition: formData.chemicalComposition,
        expiry_date: formData.expiryDate,
        manufacture_date:
          formData.manufactureDate || new Date().toISOString().split("T")[0],
        quantity: formData.quantity,
        tx_hash: txHash,
        policy_id: MY_POLICY_ID,
        asset_name: batchId,
      };

      // Save to localStorage
      localStorage.setItem(
        "currentBatchDetails",
        JSON.stringify(batchDetailsData)
      );

      const newBatch: Batch = {
        id: batchId,
        composition: formData.chemicalComposition,
        expiryDate: formData.expiryDate,
        status: "Minted",
        medicine_name: formData.drugName,
        quantity: formData.quantity,
      };

      setBatches([newBatch, ...batches]);
      setMintedBatchIds((prev) => new Set(prev).add(batchId));

      toast.success(
        ` Success! Batch minted and saved!\n\nBatch ID: ${batchId}\nTX: ${txHash.substring(
          0,
          20
        )}...`
      );
      setShowSuccess(true);

      //  Refresh dashboard

      await fetchDashboardData();

      //  Close modal after delay
      setTimeout(() => {
        // setShowSuccess(false);
        // setShowModal(false);
        // setFormData({
        //   batchId: "",
        //   drugName: "",
        //   manufactureDate: "",
        //   expiryDate: "",
        //   chemicalComposition: "",
        //   quantity: "",
        //   manufacturer: "PharmaCorp Ltd",
        // });
        // setStatus("");
        setShowModal(false);
        router.push("/manufacturer/batch-details");
      }, 2000);
    } catch (error: any) {
      console.error(" error:", error);

      let errorMessage = " Error: ";

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

      toast.error(errorMessage);
      setShowSuccess(false);
    }
  };

  const handleTransfer = async () => {
    if (!connected || !selectedBatch || !recipientAddress.trim()) {
      toast(MESSAGES.CONNECT_WALLET);
      return;
    }

    if (!VALIDATION.CARDANO_ADDRESS_PATTERN.test(recipientAddress)) {
      toast.error(MESSAGES.INVALID_ADDRESS);
      return;
    }

    if (!mintedBatchIds.has(selectedBatch.id)) {
      toast.error(MESSAGES.BATCH_NOT_MINTED);
      return;
    }

    setTransferring(true);
    // setStatus(" Checking wallet balance...");

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

      toast.success(
        `${MESSAGES.TRANSFER_SUCCESS}\nTx: ${hash.substring(0, 20)}...`
      );
      await checkBalance();

      setTimeout(async () => {
        setShowTransferModal(false);
        setSelectedBatch(null);
        setRecipientAddress("");
        setTransferring(false);
        setStatus("");
        await fetchDashboardData();
      }, 3000);
    } catch (error: any) {
      console.error("Transfer error:", error);
      setStatus(` Transfer Failed: ${error.message}`);
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
      title: "Minted",
      value: stats.minted,
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
      change: "+5%",
    },
    {
      id: 3,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card) => (
                <StatCard key={card.id} {...card} />
              ))}
            </div>

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
                    <p className="text-gray-600 mt-4">Loading..</p>
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
