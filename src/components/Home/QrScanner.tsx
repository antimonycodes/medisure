"use client";

import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera, RotateCw } from "lucide-react";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onClose }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    // Configuration for the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      // You can explicitly specify a camera or rely on the default behavior
      // supportedDevices: [{ id: 'deviceId', label: 'Camera Name' }]
    };

    // Initialize the scanner inside the ref container
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrCodeRef.current.id,
      config,
      false // Verbose logging
    );

    const onScanError = (errorMessage: string) => {
      // Optional: Log errors if the scanner fails to start or decode
      // console.warn(`QR Code Scanning Error: ${errorMessage}`);
    };

    // Start the scanner
    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Cleanup function: Stop the scanner when the component unmounts
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner:", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          <Camera className="inline w-6 h-6 mr-2 text-blue-600" />
          Scan Medicine QR Code
        </h2>

        {/* The target element for the scanner */}
        <div
          id="reader"
          ref={qrCodeRef}
          className="rounded-lg border-2 border-dashed border-blue-300 overflow-hidden"
        >
          {/* The scanner renders its UI here */}
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Ensure the code is centered in the box.
        </p>
      </div>
    </div>
  );
};

export default QrScanner;
