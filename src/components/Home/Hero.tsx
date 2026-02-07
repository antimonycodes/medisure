"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VerificationIcon from "@/shared/VerificationIcon";
import QrScanner from "./QrScanner";
import { useSearchParams } from "next/navigation";

// Slider images array
const sliderImages = [
  "/slider1.jpg",
  "/slider-2.jpg",
  "/slider-3.jpg",
  "/slider-4.jpg",
];

const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [initialVerifyDone, setInitialVerifyDone] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyCode = useCallback(
    async (codeToVerify: string) => {
      if (!codeToVerify) return;

      setVerifying(true);
      setInput(codeToVerify);

      try {
        const response = await fetch(
          `/api/verify_drug?assetId=${codeToVerify}`
        );
        const data = await response.json();

        if (data.isValid) {
          router.push(`/verified?batchId=${codeToVerify}`);
        } else {
          router.push(`/verified?error=not-found&batchId=${codeToVerify}`);
        }
      } catch (error) {
        console.error("Verification Error:", error);
        router.push(`/verified?error=network&batchId=${codeToVerify}`);
      } finally {
        setVerifying(false);
        setShowScanner(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const assetIdFromUrl = searchParams.get("assetId");
    if (assetIdFromUrl && !initialVerifyDone) {
      setInitialVerifyDone(true);
      handleVerifyCode(assetIdFromUrl);
      router.replace(window.location.pathname, undefined);
    }
  }, [searchParams, initialVerifyDone, router, handleVerifyCode]);

  const handleManualVerify = () => {
    handleVerifyCode(input);
  };

  const handleScanSuccess = (decodedText: string) => {
    handleVerifyCode(decodedText);
  };

  const startScan = () => {
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background Images Slider */}
      <div className="absolute inset-0" style={{ zIndex: -2 }}>
        {sliderImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Background slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
        style={{ zIndex: -1 }}
      ></div>

      {/* Slide Indicators */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3"
        style={{ zIndex: 20 }}
      >
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlideIndex
              ? "bg-white scale-125"
              : "bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>
      {/* Content */}
      <div
        className="relative max-w-sm sm:max-w-md md:max-w-lg w-full text-center flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        {/* Verification Icon */}
        <div className="w-full flex justify-center">
          <div className="animate-bounce-slow">
            <VerificationIcon />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 sm:mt-6 drop-shadow-lg">
          Verify Your Medicine
        </h2>

        {/* Description */}
        <p className="text-gray-100 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md drop-shadow-md">
          Ensure your medication is genuine and safe with a quick scan.
        </p>

        {/* QR Scan Button */}
        <button
          onClick={startScan}
          disabled={verifying}
          className="w-full max-w-xs sm:max-w-sm text-white py-3 sm:py-4 px-4 sm:px-6 mt-5 sm:mt-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 font-medium text-sm sm:text-base"
          style={{
            backgroundColor: "#2563eb",
            boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
          }}
        >
          📱 Scan QR Code to Verify
        </button>

        {/* Divider */}
        <div className="flex items-center w-full max-w-xs sm:max-w-sm my-5 sm:my-6">
          <hr className="flex-1 border-white/30" />
          <span className="text-white/80 px-3 sm:px-4 text-sm sm:text-base font-medium">
            or
          </span>
          <hr className="flex-1 border-white/30" />
        </div>

        {/* Manual*/}
        <div className="w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-2xl shadow-2xl">
          <h3
            className="text-base sm:text-lg md:text-xl font-semibold"
            style={{ color: "#1e293b" }}
          >
            Enter Batch Code Manually
          </h3>

          <input
            type="text"
            placeholder="e.g. BATCH-2024-001"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
            disabled={verifying}
            className="mt-3 sm:mt-4 border-2 border-gray-200 rounded-xl p-2.5 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
            style={{ backgroundColor: "#f8fafc" }}
          />

          <button
            onClick={handleManualVerify}
            disabled={verifying || !input}
            className="w-full text-white py-2.5 sm:py-3 px-4 sm:px-6 mt-3 sm:mt-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] font-medium text-sm sm:text-base"
            style={{
              backgroundColor: "#2563eb",
              boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
            }}
          >
            {verifying ? (
              <>
                <span
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white rounded-full"
                  style={{ borderTopColor: "transparent" }}
                ></span>
                <span>Verifying…</span>
              </>
            ) : (
              "✓ Verify Code"
            )}
          </button>
        </div>
      </div>

      {showScanner && (
        <QrScanner onScanSuccess={handleScanSuccess} onClose={closeScanner} />
      )}
    </div>
  );
};

export default Hero;
