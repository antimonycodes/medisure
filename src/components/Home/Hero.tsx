"use client";
import { type ChangeEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VerificationIcon from "@/shared/VerificationIcon";
import QrScanner from "./QrScanner";
import { useSearchParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  ShieldCheck,
  Upload,
  CheckCircle,
  AlertTriangle,
  Package,
  Shield,
  BarChart3,
  Users,
  Globe,
  Clock,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ChevronRight,
  ArrowRight,
  Star,
  Truck,
  Headphones,
  Shield as ShieldIcon,
  Leaf,
  Zap,
  Lock,
  FileCheck,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sliderImages = [
  "/slider1.jpg",
  "/slider-2.jpg",
  "/slider-3.jpg",
  "/slider-4.jpg",
];

const features = [
  {
    icon: Shield,
    title: "Blockchain Verification",
    description:
      "Every product is registered on an immutable blockchain ledger",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description:
      "Track your medicine from manufacturer to pharmacy in real-time",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Lock,
    title: "Military-grade Security",
    description: "End-to-end encryption ensures your data remains private",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: FileCheck,
    title: "Regulatory Compliance",
    description: "Compliant with FDA, EMA, and WHO standards",
    color: "bg-amber-100 text-amber-600",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Scan or Enter Code",
    description:
      "Use our scanner or enter the unique code from your medicine packaging",
    icon: Camera,
  },
  {
    step: "02",
    title: "Instant Verification",
    description:
      "Our system checks against the official database in milliseconds",
    icon: Zap,
  },
  {
    step: "03",
    title: "Get Results",
    description:
      "Receive detailed verification report with manufacturing details",
    icon: CheckCircle,
  },
];

const partners = [
  { name: "FDA", logo: "/fda-logo.png" },
  { name: "WHO", logo: "/who-logo.png" },
  { name: "Pfizer", logo: "/pfizer-logo.png" },
  { name: "Novartis", logo: "/novartis-logo.png" },
  { name: "Johnson & Johnson", logo: "/jj-logo.png" },
];

const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [uploadingCodeImage, setUploadingCodeImage] = useState(false);
  const [initialVerifyDone, setInitialVerifyDone] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyCode = useCallback(
    async (codeToVerify: string) => {
      const trimmedCode = codeToVerify.trim();
      if (!trimmedCode) return;

      setVerifying(true);
      setInput(trimmedCode);
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(
          `/api/verify_drug?assetId=${encodeURIComponent(trimmedCode)}`,
          {
            signal: controller.signal,
          },
        );
        const data = await response.json();

        if (data.isValid) {
          router.push(`/verified?batchId=${encodeURIComponent(trimmedCode)}`);
        } else {
          router.push(
            `/verified?error=not-found&batchId=${encodeURIComponent(trimmedCode)}`,
          );
        }
      } catch (error) {
        console.error("Verification Error:", error);
        router.push(
          `/verified?error=network&batchId=${encodeURIComponent(trimmedCode)}`,
        );
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        setVerifying(false);
        setShowScanner(false);
      }
    },
    [router],
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
    handleVerifyCode(input.trim());
  };

  const handleScanSuccess = (decodedText: string) => {
    handleVerifyCode(decodedText);
  };

  const startScan = () => {
    setShowScanner(true);
  };

  const handleCodeImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCodeImage(true);
      const reader = new Html5Qrcode("code-image-reader");
      const decoded = await reader.scanFile(file, true);
      try {
        reader.clear();
      } catch {}
      handleVerifyCode(decoded);
    } catch {
      router.push("/verified?error=not-found");
    } finally {
      setUploadingCodeImage(false);
      event.target.value = "";
    }
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 overflow-hidden">
        {/* Background Images Slider */}
        <div className="absolute inset-0" style={{ zIndex: -2 }}>
          {sliderImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlideIndex ? "opacity-100" : "opacity-0"
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

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-emerald-900/70"
          style={{ zIndex: -1 }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Main Content */}
        <div className="relative max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Story & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                Trusted By Health Care Professionals{" "}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Fight Counterfeit
              <span className="block text-blue-300">Medicines</span>
              With Technology
            </h1>

            <p className="text-xl text-white/90 leading-relaxed">
              Every year, millions suffer from counterfeit medications. We
              provide a secure verification system to ensure every medicine you
              take is{" "}
              <span className="font-semibold text-emerald-300">
                authentic, safe, and traceable
              </span>
              .
            </p>

            {/* Story Toggle */}
            <div className="pt-4">
              <button
                onClick={() => setShowStory(!showStory)}
                className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Why verification matters →</span>
              </button>

              <AnimatePresence>
                {showStory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3">
                      The Verification Story
                    </h3>
                    <ul className="space-y-3 text-white/90">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                        <span>
                          Track every medicine from manufacturer to consumer
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                        <span>
                          Detect counterfeit drugs before they reach patients
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <span>
                          Ensure compliance with global pharmaceutical standards
                        </span>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats in Hero */}
          </motion.div>

          {/* Right Column - Verification Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Verify Authenticity
              </h2>
              <p className="text-gray-600 mt-2">
                Scan, upload, or enter your medicine code
              </p>
            </div>

            {/* Verification Options */}
            <div className="space-y-4">
              <button
                onClick={startScan}
                disabled={verifying}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 font-semibold text-lg"
              >
                <Camera className="w-6 h-6" />
                Scan QR Code
              </button>

              <label
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer ${
                  uploadingCodeImage || verifying
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-lg hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-3">
                  <Upload className="w-6 h-6" />
                  {uploadingCodeImage ? "Processing..." : "Upload Code Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCodeImageUpload}
                  disabled={uploadingCodeImage || verifying}
                />
              </label>

              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or enter manually
                  </span>
                </div>
              </div>

              {/* Manual Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch / Serial Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. BATCH-2024-001-A1B2C3"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleManualVerify()
                      }
                      disabled={verifying}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the 12-16 digit code found on your medicine packaging
                  </p>
                </div>

                <button
                  onClick={handleManualVerify}
                  disabled={verifying || !input}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 font-semibold text-lg"
                >
                  {verifying ? (
                    <>
                      <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Verifying Authenticity...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Verify Medicine
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>Real-time Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>FDA Approved</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Shop Verified Button - Fixed Position */}
        <button
          onClick={() => router.push("/shop")}
          className="fixed bottom-8 right-8 bg-white text-gray-800 py-3 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 font-semibold flex items-center gap-3 group z-50"
        >
          <ShieldCheck className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          Shop Verified Medicines
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </button>
      </section>

      {/* Stats Section */}

      {showScanner && (
        <QrScanner onScanSuccess={handleScanSuccess} onClose={closeScanner} />
      )}
      <div id="code-image-reader" className="hidden" />
    </div>
  );
};

export default Hero;
