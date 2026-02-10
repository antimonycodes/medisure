import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  ClipboardList,
  Package,
  CreditCard,
  HelpCircle,
  Send,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqItems = [
  {
    question: "How does blockchain verification work?",
    answer:
      "Each medicine batch is registered on the Cardano blockchain as an immutable record, allowing anyone to verify authenticity and trace the supply journey.",
  },
  {
    question: "Why do I need to upload a prescription?",
    answer:
      "Prescription medicines require a valid doctor’s prescription for legal and safe access. Uploading ensures compliance with regulations.",
  },
  {
    question: "What if my prescription is rejected?",
    answer:
      "If a prescription is rejected, check that the image is clear and includes doctor details, patient name, and date. You can resubmit or contact support.",
  },
  {
    question: "How do I verify my medicine after purchase?",
    answer:
      "Each order includes a QR code to scan and view the full verification history, including manufacturer and distributor records.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept major debit/credit cards (Visa, Mastercard, American Express) and UPI payments for secure checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 2-3 business days. Express delivery (1-2 days) is available at checkout.",
  },
];

const categories = [
  { title: "Verification Issues", icon: ShieldCheck },
  { title: "Prescription Help", icon: ClipboardList },
  { title: "Orders & Delivery", icon: Package },
  { title: "Payment & Refunds", icon: CreditCard },
];

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-slate-700 transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 border border-slate-200">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Support Center</span>
          </div>
        </div>

        <section className="mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            How can we help you?
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Get help with verification, prescriptions, orders, and more. Our support team is here to assist you.
          </p>
        </section>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Email Support</h3>
            <p className="mt-1 text-sm text-slate-500">support@medisure.app</p>
            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium hover:bg-slate-100 transition">
              Send Email
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Phone Support</h3>
            <p className="mt-1 text-sm text-slate-500">+1 (555) 123-4567</p>
            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium hover:bg-slate-100 transition">
              Call Now
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Live Chat</h3>
            <p className="mt-1 text-sm text-slate-500">Available 9 AM - 6 PM</p>
            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium hover:bg-slate-100 transition">
              Start Chat
            </button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Browse by Category
          </h2>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions
            </div>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <p className="font-medium text-slate-800">{item.question}</p>
                  <p className="mt-1">{item.answer}</p>
                  <div className="mt-4 border-b border-slate-100" />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium hover:bg-slate-100 transition">
              View All FAQs
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Send className="w-5 h-5 text-blue-600" />
                Send us a Message
              </div>
              <form className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500">Your Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help?"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                Support Hours
              </div>
              <div className="mt-2 space-y-1 text-emerald-700">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
