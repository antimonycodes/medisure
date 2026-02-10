import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle,
  History,
  Route,
  Scan,
  Shield,
  ShieldCheck,
  Store,
  Users,
  Sparkles,
  Heart,
  Target,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import scanImg from "../../../public/Containerscan-code.png";
import verifyImg from "../../../public/Containerverify-history.png";
import confirmImg from "../../../public/Containerconfirm-authencity.png";

const stats = [
  { label: "Verified Batches", value: "25K+", icon: Boxes, tone: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Pharmacies", value: "1,200+", icon: Store, tone: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Supply Partners", value: "420+", icon: Building2, tone: "text-violet-600", bg: "bg-violet-50" },
  { label: "Protected Patients", value: "100K+", icon: Users, tone: "text-amber-600", bg: "bg-amber-50" },
];

const pillars = [
  {
    title: "Tamper-Proof Records",
    description: "Every medicine batch is recorded on immutable blockchain ledgers, ensuring data integrity and preventing unauthorized alterations.",
    icon: Lock,
    tint: "from-blue-50/80 to-cyan-50/60",
    border: "border-blue-100",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
  },
  {
    title: "End-to-End Transparency",
    description: "Track each medicine's complete journey from manufacturer to pharmacy with a single, auditable timeline that builds trust.",
    icon: Route,
    tint: "from-emerald-50/80 to-teal-50/60",
    border: "border-emerald-100",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5",
  },
  {
    title: "Patient Confidence",
    description: "Empower patients with instant verification tools to confirm authenticity before purchase and consumption.",
    icon: Heart,
    tint: "from-violet-50/80 to-purple-50/60",
    border: "border-violet-100",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
    gradient: "bg-gradient-to-br from-violet-500/10 to-purple-500/5",
  },
];

const howItWorks = [
  {
    id: "01",
    title: "Scan the Code",
    description: "Use your smartphone camera to scan the unique QR code on any medicine package.",
    icon: Scan,
    highlight: "Instant identification",
    gradient: "from-blue-500/10 to-cyan-500/10",
    shadow: "shadow-blue-100/50",
  },
  {
    id: "02",
    title: "View the Journey",
    description: "Review the complete, blockchain-verified history from manufacturer through distribution to pharmacy.",
    icon: History,
    highlight: "Complete transparency",
    gradient: "from-emerald-500/10 to-teal-500/10",
    shadow: "shadow-emerald-100/50",
  },
  {
    id: "03",
    title: "Confirm Authenticity",
    description: "Receive clear verification results with green-check confirmation or warnings for suspicious batches.",
    icon: CheckCircle,
    highlight: "Verified safety",
    gradient: "from-violet-500/10 to-purple-500/10",
    shadow: "shadow-violet-100/50",
  },
];

const storyPoints = [
  {
    phase: "The Challenge",
    title: "Every Pill Tells a Story",
    description: "In a world where medicine counterfeiting affects millions, the journey from manufacturer to patient is often a mystery. We believe every medicine should have a transparent, trustworthy story.",
    icon: Target,
    color: "bg-gradient-to-br from-rose-50/50 to-pink-50/50",
    border: "border-rose-100",
    accent: "text-rose-600",
  },
  {
    phase: "Our Promise",
    title: "Building Trust Through Technology",
    description: "MediSure creates an immutable digital twin for every medicine batch, recording each transfer on a secure blockchain that cannot be altered or falsified. We're restoring faith in medicine.",
    icon: ShieldCheck,
    color: "bg-gradient-to-br from-blue-50/50 to-cyan-50/50",
    border: "border-blue-100",
    accent: "text-blue-600",
  },
  {
    phase: "The Future",
    title: "A Healthier World, One Scan at a Time",
    description: "By giving patients and providers instant verification tools, we're building a safer pharmaceutical ecosystem where authenticity is guaranteed and trust is restored.",
    icon: Sparkles,
    color: "bg-gradient-to-br from-emerald-50/50 to-teal-50/50",
    border: "border-emerald-100",
    accent: "text-emerald-600",
  },
];

const trustMarkers = [
  "100% Data Integrity",
  "Real-time Verification",
  "End-to-end Encryption",
  "24/7 Monitoring",
  "Regulatory Compliant",
  "GDPR Ready"
];

export default function HomeHighlights() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white py-16 md:py-24">
      {/* Beautiful Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[-10%] h-96 w-96 rounded-full bg-gradient-to-r from-blue-100/30 to-cyan-100/20 blur-3xl" />
        <div className="absolute bottom-40 right-[-10%] h-96 w-96 rounded-full bg-gradient-to-r from-emerald-100/30 to-teal-100/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-violet-100/10 to-purple-100/5 blur-3xl" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-blue-400/20"
            initial={{ y: 0, x: 0 }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Elegant Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2 mb-8 border border-blue-100 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Trust in Every Pill
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Secure Medicine,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Protected Lives
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed mb-8">
            MediSure provides blockchain-powered verification that ensures every medicine is authentic, 
            creating a safer healthcare experience for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/demo"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                Signup Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-base font-semibold text-slate-700 backdrop-blur-sm hover:bg-white hover:border-blue-300 transition-all duration-300"
            >
              Watch Demo Video
              <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Stats - Elegant Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm group-hover:shadow-lg transition-all duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 group-hover:border-blue-200 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2.5 rounded-lg ${item.bg} ${item.tone.replace('text', 'bg')} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-5 w-5 ${item.tone}`} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{item.value}</p>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Story Section - Beautiful Narrative */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Our Journey to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Safer Medicine</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A story of innovation, trust, and commitment to healthcare excellence
            </p>
          </div>

          <div className="space-y-8 relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 via-emerald-200 to-violet-200" />
            
            {storyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.phase}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-blue-500 z-10" />
                  
                  <div className={`flex-1 rounded-2xl border ${point.border} ${point.color} p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl bg-white border ${point.border} shadow-sm`}>
                          <Icon className={`h-6 w-6 ${point.accent}`} />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 border border-gray-200 mb-3">
                          <span className="text-xs font-semibold text-gray-700">{point.phase}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{point.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{point.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Core Pillars - Elegant Cards */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              The <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Three Pillars</span> of Trust
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fundamental principles that form the foundation of our verification system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  {/* Card background with gradient */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.tint} ${pillar.border} opacity-60 group-hover:opacity-80 transition-all duration-500`} />
                  
                  {/* Floating gradient effect */}
                  <div className={`absolute inset-0 rounded-2xl ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                  
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 h-full group-hover:border-gray-300 transition-all duration-300">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200" />
                      <div className={`relative p-4 rounded-xl ${pillar.iconBg} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {pillar.description}
                    </p>

                    {/* Decorative line */}
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-gray-300 to-transparent mt-6" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* How It Works - Beautiful Steps */}
        <div id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Simple</span> Verification
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three easy steps to ensure your medicine&apos;s authenticity
            </p>
          </div>

          <div className="relative">
            {/* Connecting Arc */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-32">
              <svg className="w-full h-full" viewBox="0 0 1200 100">
                <path
                  d="M0,50 Q300,0 600,50 T1200,50"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative"
                  >
                    {/* Step glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                    
                    <div className={`relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm ${step.shadow} hover:shadow-xl transition-all duration-300 h-full`}>
                      <div className="flex flex-col items-center text-center">
                        {/* Step number */}
                        <div className="relative mb-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white blur-sm" />
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 flex items-center justify-center">
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                              {step.id}
                            </span>
                          </div>
                        </div>

                        {/* Icon */}
                        <div className="mb-4">
                          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-6 w-6 text-gray-700" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 text-sm font-medium border border-blue-100">
                            {step.highlight}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                        {/* Image Preview */}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Markers */}
        <div className="mb-12">
          <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-1.5 mb-4 border border-blue-100">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Enterprise-Grade Security</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Built on a Foundation of Trust
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trustMarkers.map((marker, index) => (
                <motion.div
                  key={marker}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">{marker}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA - Beautiful Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-violet-500/5" />
          
          {/* Animated orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-6" />
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Medicine Safety</span>?
              </h3>
              
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands who trust MediSure for verified medicine authenticity. 
                Start your journey to safer healthcare today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/demo"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Signup Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  Schedule a Demo
                </Link>
              </div>
              
              <p className="mt-8 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
  
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
