import React from "react";
import PatientDashboard from "@/components/patient/PatientDashboard";
import Head from "next/head";
import logo from "../../../public/logo.png";
import Image from "next/image";
import { User, Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PatientDashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "patient") {
      router.replace("/");
    }
  }, [user]);

  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Head>
        <title>Patient Marketplace | MediSure Health</title>
      </Head>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src={logo} alt="logo" width={60} height={60} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MediSure Marketplace
              </h1>
              <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                On-Chain Pharmacy Node
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">
                {user.username}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Logged in
              </span>
            </div>
            <button
              onClick={logout}
              className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 cursor-pointer hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-4xl font-black text-gray-900 leading-[1.1]">
            Secure Medications, <br />
            <span className="text-blue-600">Verified by Blockchain.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg font-medium leading-relaxed">
            Browse authentic drugs from certified pharmacies. Every purchase is
            tracked from manufacturer to your doorstep using NFT authentication.
          </p>
        </div>

        <PatientDashboard />
      </main>

      <footer className="mt-20 py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">
            Powered by Cardano
          </p>
          <p className="text-gray-400 text-xs">
            © 2026 MediSure Health. All medical records are encrypted and
            secured.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboardPage;
