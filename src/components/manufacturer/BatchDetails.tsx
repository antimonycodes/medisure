"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle,
  Download,
  Share2,
  ArrowLeft,
  ExternalLink,
  Package,
  Calendar,
  Beaker,
  Hash,
  Pill,
  Shield,
} from "lucide-react";

interface BatchDetailsProps {
  batchData: {
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
  };
}

// Example URL generated: https://yourdomain.com/?assetId=d4454e99...
const getVerificationUrl = (policyId: string): string => {
  // Use window.location.origin to get the current domain (e.g., http://localhost:3000 or https://prod.com)
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/?assetId=${policyId}`;
};

const BatchDetails: React.FC<BatchDetailsProps> = ({ batchData }) => {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const verificationUrl = getVerificationUrl(batchData.policy_id);

  const downloadQRCode = async () => {
    setDownloading(true);
    try {
      const svg = document.getElementById("qr-code-svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 1000;
      canvas.height = 1000;

      const img = new Image();
      img.onload = () => {
        if (ctx) {
          // White background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw QR code
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Add batch ID text at bottom
          ctx.fillStyle = "#000000";
          ctx.font = "bold 40px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            batchData.batch_id,
            canvas.width / 2,
            canvas.height - 50
          );
        }

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR-${batchData.batch_id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();

        setDownloading(false);
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (error) {
      console.error("Download error:", error);
      setDownloading(false);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Batch ${batchData.batch_id} - Authentication`,
          text: `Verify medicine authenticity: ${batchData.medicine_name}`,
          url: verificationUrl,
        });
      } catch (err) {
        console.log("Share cancelled or error:", err);
      }
    } else {
      navigator.clipboard.writeText(verificationUrl);
      // alert("Verification URL copied to clipboard!");
    }
  };

  const viewOnExplorer = () => {
    window.open(
      `https://preprod.cardanoscan.io/transaction/${batchData.tx_hash}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Mint Successful!
          </h1>
          <p className="text-center text-gray-600">
            Your batch has been registered on the Cardano blockchain
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Batch Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-600" />
              Batch Information
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                  <Hash className="w-4 h-4 mr-2 text-gray-400" />
                  Batch ID
                </label>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {batchData.batch_id}
                </p>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                  <Pill className="w-4 h-4 mr-2 text-gray-400" />
                  Medicine Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {batchData.medicine_name}
                </p>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                  <Beaker className="w-4 h-4 mr-2 text-gray-400" />
                  Composition
                </label>
                <p className="text-gray-900">{batchData.composition}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Manufactured
                  </label>
                  <p className="text-gray-900">{batchData.manufacture_date}</p>
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-red-400" />
                    Expires
                  </label>
                  <p className="text-gray-900">{batchData.expiry_date}</p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                  <Package className="w-4 h-4 mr-2 text-gray-400" />
                  Quantity
                </label>
                <p className="text-gray-900">{batchData.quantity} units</p>
              </div>

              <div className="pb-4">
                <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  NFT Token ID
                </label>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {batchData.asset_name}
                </p>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Blockchain Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Transaction Hash:</span>
                  <button
                    onClick={viewOnExplorer}
                    className="text-blue-600 hover:text-blue-800 font-mono flex items-center"
                  >
                    {batchData.tx_hash.substring(0, 16)}...
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Policy ID:</span>
                  <span className="text-blue-900 font-mono text-xs">
                    {batchData.policy_id.substring(0, 20)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Authentication QR Code
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Print this QR code and attach it to the medicine packaging.
              Customers can scan it to verify authenticity.
            </p>

            {/* QR Code Display */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-4 border-blue-500 mb-6">
              <QRCodeSVG
                id="qr-code-svg"
                // ✅ Now using the full, scannable URL
                value={verificationUrl}
                size={280}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
              <p className="text-center mt-4 font-mono text-sm font-bold text-gray-700">
                {batchData.batch_id}
              </p>
            </div>

            {/* QR Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Policy ID (Verification Asset):
                  </span>
                  <span className="font-mono text-xs text-gray-900 break-all">
                    {batchData.policy_id.substring(0, 18)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">QR Code Target URL:</span>
                  <span className="text-blue-600 text-xs break-all">
                    /?assetId={batchData.policy_id.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadQRCode}
                disabled={downloading}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? "Downloading..." : "Download QR Code"}
              </button>

              <button
                onClick={shareQR}
                className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share QR Code
              </button>

              <button
                onClick={viewOnExplorer}
                className="w-full flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View on Explorer
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h4 className="font-semibold text-yellow-900 mb-2 text-sm">
                📋 Next Steps:
              </h4>
              <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Download the QR code image</li>
                <li>Print and attach to medicine packaging</li>
                <li>Customers can scan to verify authenticity</li>
                <li>Track batch journey on blockchain</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/manufacturer/dashboard")}
            className="flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg border-2 border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;
