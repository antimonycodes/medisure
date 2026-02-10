"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  Package,
  Pill,
  Send,
  TestTubeDiagonal,
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
    status?: "Pending" | "Minted" | "In Transit";
  };
}

const getVerificationUrl = (qrCode: string, batchId: string): string => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  if (qrCode) return `${base}/verified?batchId=${encodeURIComponent(qrCode)}`;
  return `${base}/verified?batchId=${encodeURIComponent(batchId)}`;
};

const formatTx = (txHash?: string) => {
  if (!txHash) return "N/A";
  if (txHash.length <= 14) return txHash;
  return `${txHash.slice(0, 8)}...${txHash.slice(-4)}`;
};

const BatchDetails: React.FC<BatchDetailsProps> = ({ batchData }) => {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const verificationUrl = getVerificationUrl(batchData.qr_code, batchData.batch_id);
  const txShort = formatTx(batchData.tx_hash);
  const tokenId = batchData.asset_name || "token_abc123";
  const status = batchData.status || (batchData.tx_hash ? "Minted" : "Pending");
  const statusStyles =
    status === "In Transit"
      ? "bg-amber-500 text-white"
      : status === "Minted"
      ? "bg-emerald-500 text-white"
      : "bg-gray-500 text-white";

  const downloadQRCode = async () => {
    setDownloading(true);
    try {
      const svg = document.getElementById("qr-code-svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 1024;
      canvas.height = 1024;

      const img = new Image();
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 112, 112, 800, 800);
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
      setDownloading(false);
    }
  };

  const viewOnExplorer = () => {
    if (!batchData.tx_hash) return;
    window.open(
      `https://preprod.cardanoscan.io/transaction/${batchData.tx_hash}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {batchData.batch_id}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {batchData.medicine_name || batchData.composition}
            </p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusStyles}`}>
            {status}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <section className="space-y-6">
            <article className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Batch Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoItem
                  icon={<Package className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-100"
                  label="Batch ID"
                  value={batchData.batch_id}
                />
                <InfoItem
                  icon={<CalendarDays className="w-5 h-5 text-emerald-600" />}
                  iconBg="bg-emerald-100"
                  label="Manufacture Date"
                  value={batchData.manufacture_date || "-"}
                />
                <InfoItem
                  icon={<TestTubeDiagonal className="w-5 h-5 text-indigo-600" />}
                  iconBg="bg-indigo-100"
                  label="Composition"
                  value={batchData.composition}
                />
                <InfoItem
                  icon={<CalendarDays className="w-5 h-5 text-red-600" />}
                  iconBg="bg-red-100"
                  label="Expiry Date"
                  value={batchData.expiry_date}
                />
                <InfoItem
                  icon={<Pill className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-100"
                  label="Quantity"
                  value={`${batchData.quantity || "0"} units`}
                />
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Blockchain Information
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-base">NFT Token ID</p>
                  <p className="text-base text-gray-900 mt-1 break-all">
                    {tokenId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-base">Transaction Hash</p>
                  <div className="mt-1 flex flex-wrap items-center gap-5">
                    <p className="text-base text-gray-900">{txShort}</p>
                    <button
                      type="button"
                      onClick={viewOnExplorer}
                      disabled={!batchData.tx_hash}
                      className="inline-flex items-center text-sm text-gray-800 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-base">Minting Status</p>
                  <span
                    className={`inline-flex mt-2 px-4 py-1.5 text-sm rounded-full font-medium ${statusStyles}`}
                  >
                    {status === "Pending" ? "Pending Mint" : status}
                  </span>
                </div>
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Supply Chain Timeline
              </h2>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Manufacturer
                    </p>
                    <p className="text-gray-700 text-base">
                      PharmaCorp Ltd.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {batchData.manufacture_date || "Jan 15, 2024, 02:30 AM"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={viewOnExplorer}
                  className="inline-flex items-center text-sm text-gray-800 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  {txShort}
                </button>
              </div>
            </article>

            <article className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Ready to Transfer
                </h3>
                <p className="text-gray-700 text-base mt-2">
                  Transfer this batch to the next verified party in the supply
                  chain
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/manufacturer/transfer-batch")}
                disabled={status === "In Transit"}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {status === "In Transit" ? "Already In Transit" : "Transfer Batch"}
              </button>
            </article>
          </section>

          <aside>
            <article className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Verification QR Code
              </h2>

              <div className="w-[250px] h-[250px] max-w-full mx-auto rounded-2xl border border-gray-300 bg-white flex items-center justify-center">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={verificationUrl}
                  size={180}
                  level="H"
                  includeMargin
                />
              </div>

              <button
                type="button"
                onClick={downloadQRCode}
                disabled={downloading}
                className="mt-5 w-full h-12 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm hover:bg-gray-50 transition-colors inline-flex items-center justify-center disabled:opacity-60"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? "Downloading..." : "Download QR Code"}
              </button>

              <p className="mt-6 text-gray-700 text-base leading-7">
                Print and attach this QR code to product packaging for patient
                verification
              </p>
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
};

function InfoItem({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-gray-900 text-base leading-7">{value}</p>
      </div>
    </div>
  );
}

export default BatchDetails;
