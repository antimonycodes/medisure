import Head from "next/head";
import Image from "next/image";
import {
  ShieldCheck,
  Eye,
  Lock,
  Globe2,
  Users,
  BriefcaseBusiness,
  CircleCheck,
  Box,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const values = [
  {
    title: "Transparency",
    description:
      "Track medicine movement from manufacturer to pharmacy with clear, verifiable records.",
    icon: Eye,
  },
  {
    title: "Security",
    description:
      "Blockchain-backed verification reduces tampering and counterfeit risk across the supply chain.",
    icon: Lock,
  },
  {
    title: "Global Trust",
    description:
      "Patients, pharmacies, and distributors can confirm authenticity with confidence.",
    icon: Globe2,
  },
];

const impactStats = [
  {
    value: "10%",
    description:
      "of medicines in developing countries are estimated to be counterfeit or substandard",
    boxClass: "border-red-200 bg-red-50/70",
    valueClass: "text-red-600",
  },
  {
    value: "1M+",
    description: "deaths annually due to fake or substandard medicines worldwide",
    boxClass: "border-orange-200 bg-orange-50/70",
    valueClass: "text-orange-600",
  },
  {
    value: "₦200B",
    description: "annual market value of counterfeit pharmaceutical products",
    boxClass: "border-blue-200 bg-blue-50/70",
    valueClass: "text-blue-600",
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About MediSure</title>
        <meta
          name="description"
          content="Learn how MediSure uses blockchain technology to verify medicine authenticity."
        />
      </Head>

      <div className="relative min-h-screen bg-slate-100">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/about-bg.jpg"
            alt="About background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]" />
        </div>

        <Navbar />

        <main className="max-w-6xl mx-auto px-4 pb-16 pt-6 md:pt-10">
          <section className="bg-white/90 rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              About MediSure
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Protecting patients by ensuring medicine authenticity through
              secure blockchain verification.
            </p>
          </section>

          <section className="mt-10 bg-white/90 rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center">
              Our Mission
            </h2>
            <p className="mt-6 text-slate-600 leading-8 text-lg max-w-4xl mx-auto text-center">
              MediSure is focused on reducing counterfeit medicines by creating
              a transparent and reliable verification process. We use blockchain
              technology to maintain an immutable record of each medicine
              batch&apos;s lifecycle from manufacturer to patient.
            </p>
          </section>

          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value) => (
              <article
                key={value.title}
                className="bg-white/90 rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-7">
                  {value.description}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-14 bg-white/85 rounded-2xl border border-slate-200 p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center">
              Why It Matters
            </h2>
            <p className="mt-4 text-center text-slate-600 text-lg">
              Counterfeit medicines are a global crisis affecting millions of
              patients worldwide.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {impactStats.map((stat) => (
                <article
                  key={stat.value}
                  className={`rounded-3xl border p-8 text-center ${stat.boxClass}`}
                >
                  <h3 className={`text-4xl font-semibold ${stat.valueClass}`}>
                    {stat.value}
                  </h3>
                  <p className="mt-4 text-slate-700 text-base leading-7">
                    {stat.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center">
              How We Help
            </h2>
            <p className="mt-4 text-center text-slate-600 text-lg">
              MediSure provides a comprehensive solution to ensure medicine
              authenticity.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="rounded-3xl bg-white/90 border border-slate-200 p-8 md:p-10">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                  For Patients
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-emerald-600 mr-3" />
                    Verify medicine authenticity in seconds
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-emerald-600 mr-3" />
                    View complete supply chain history
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-emerald-600 mr-3" />
                    Check expiry dates and batch information
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-emerald-600 mr-3" />
                    Report suspicious medicines easily
                  </li>
                </ul>
              </article>

              <article className="rounded-3xl bg-white/90 border border-slate-200 p-8 md:p-10">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <BriefcaseBusiness className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                  For Manufacturers &amp; Distributors
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Protect brand reputation and integrity
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Track products throughout supply chain
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Comply with regulatory requirements
                  </li>
                  <li className="flex items-center text-slate-700 text-base">
                    <CircleCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Reduce counterfeiting and diversion
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section className="mt-14 bg-white/90 rounded-2xl border border-slate-200 p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center">
              Powered by Blockchain
            </h2>
            <p className="mt-4 text-center text-slate-600 text-lg">
              We use cutting-edge blockchain technology to ensure data
              integrity and transparency.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <Lock className="w-9 h-9 text-purple-600" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                  Immutable Records
                </h3>
                <p className="mt-4 text-slate-600 text-base leading-7">
                  Once recorded, data cannot be altered, ensuring the integrity
                  of medicine information.
                </p>
              </article>

              <article className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Box className="w-9 h-9 text-blue-600" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                  Transparent Tracking
                </h3>
                <p className="mt-4 text-slate-600 text-base leading-7">
                  Every stakeholder can view the entire journey of medicine
                  from production to patient.
                </p>
              </article>

              <article className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                  Secure Verification
                </h3>
                <p className="mt-4 text-slate-600 text-base leading-7">
                  Cryptographic security ensures authenticity and protects
                  against tampering.
                </p>
              </article>
            </div>
          </section>

          <section className="mt-14">
            <div className="max-w-5xl mx-auto rounded-3xl bg-blue-600 text-white px-6 py-12 md:px-14 md:py-16 text-center">
              <h2 className="text-4xl md:text-5xl font-semibold">
                Ready to Verify Your Medicine?
              </h2>
              <p className="mt-6 text-blue-100 text-lg max-w-3xl mx-auto">
                Join thousands of users who trust MediSure to ensure their
                medication is safe and authentic.
              </p>
              <Link
                href="/"
                className="inline-block mt-8 px-8 py-4 bg-white text-blue-600 rounded-2xl text-base font-medium hover:bg-slate-100 transition-colors"
              >
                Verify Now →
              </Link>
            </div>
          </section>
        </main>

        <footer className="mt-14 py-8 border-t border-slate-200 bg-white/70">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-slate-600 text-base">
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              About Us
            </Link>
            <span>·</span>
            <button type="button" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button type="button" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </button>
            <span>·</span>
            <button type="button" className="hover:text-slate-900 transition-colors">
              Contact
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
