import Navbar from "@/components/Navbar";
import Head from "next/head";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";
import { useState } from "react";
import HowItWork from "@/components/Home/HowItWork";
import Hero from "@/components/Home/Hero";
// import Hero from "@/components/Home/Hero";
// import HowItWork fro@/components/Home/HowItWorkork";

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWork />
    </div>
  );
}
