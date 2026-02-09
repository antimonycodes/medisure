import React from "react";
import PharmacyDashboard from "@/components/pharmacy/Dashboard";
import PharmacyDashboardHeader from "@/components/pharmacy/DashboardHeader";
import Head from "next/head";
import { useWallet } from "@meshsdk/react";

const DashboardPage = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Head>
        <title>Pharmacy Dashboard | MediSure Health</title>
      </Head>

      <PharmacyDashboardHeader connected={connected} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Pharmacy Central
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            Manage your inventory and secure blockchain drug transfers.
          </p>
        </div>

        <PharmacyDashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
