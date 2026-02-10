"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  Eye,
  FileText,
  LogOut,
  Upload,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";

type PrescriptionStatus = "Active" | "Expired";

type PrescriptionItem = {
  id: string;
  medicineName: string;
  prescriptionId: string;
  prescriber: string;
  issuedDate: string;
  expiryDate: string;
  refillsRemaining: number;
  fileName: string;
  status: PrescriptionStatus;
};

const STORAGE_KEY = "patient_prescriptions";

const defaultPrescriptions: PrescriptionItem[] = [
  {
    id: "rx-2024-001",
    medicineName: "Lisinopril 10mg",
    prescriptionId: "RX-2024-001",
    prescriber: "Dr. Sarah Johnson",
    issuedDate: "December 1, 2024",
    expiryDate: "December 1, 2025",
    refillsRemaining: 3,
    fileName: "prescription-lisinopril.pdf",
    status: "Active",
  },
  {
    id: "rx-2024-002",
    medicineName: "Metformin 500mg",
    prescriptionId: "RX-2024-002",
    prescriber: "Dr. Michael Chen",
    issuedDate: "November 15, 2024",
    expiryDate: "November 15, 2025",
    refillsRemaining: 5,
    fileName: "prescription-metformin.pdf",
    status: "Active",
  },
  {
    id: "rx-2023-089",
    medicineName: "Amoxicillin 500mg",
    prescriptionId: "RX-2023-089",
    prescriber: "Dr. Sarah Johnson",
    issuedDate: "October 5, 2023",
    expiryDate: "October 5, 2024",
    refillsRemaining: 0,
    fileName: "prescription-amoxicillin.pdf",
    status: "Expired",
  },
];

export default function PrescriptionsPage() {
  useRequireRole([ROLES.PATIENT]);
  const router = useRouter();
  const { logout } = useAuth();
  const [items, setItems] = useState<PrescriptionItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPrescriptions));
      setItems(defaultPrescriptions);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : defaultPrescriptions);
    } catch {
      setItems(defaultPrescriptions);
    }
  }, []);

  const activeCount = useMemo(
    () => items.filter((item) => item.status === "Active").length,
    [items]
  );

  const handleUpload = (file?: File) => {
    if (!file) return;
    const now = new Date();
    const item: PrescriptionItem = {
      id: `rx-upload-${Date.now()}`,
      medicineName: "Uploaded Prescription",
      prescriptionId: `RX-UPLOAD-${Date.now().toString().slice(-5)}`,
      prescriber: "Pending review",
      issuedDate: now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      expiryDate: "Pending",
      refillsRemaining: 0,
      fileName: file.name,
      status: "Active",
    };
    const next = [item, ...items];
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast.success("Prescription uploaded.");
  };

  const handleOrderRefill = (medicineName: string) => {
    router.push(`/shop?search=${encodeURIComponent(medicineName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="inline-flex items-center text-gray-700 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="MediSure" className="w-8 h-8 object-contain" />
              <h1 className="text-2xl font-semibold text-gray-900">MediSure</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Prescriptions
              </button>
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              >
                <Clock3 className="w-4 h-4 mr-2" />
                Order History
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 py-6">
        <section className="mb-4">
          <h2 className="text-3xl font-semibold text-gray-900">Prescriptions Archive</h2>
          <p className="text-gray-600 mt-1">
            View and manage your uploaded prescriptions ({activeCount} active)
          </p>
        </section>

        <section className="mb-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-blue-800">
                Upload clear photos or scans of your prescriptions for easy reordering
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Accepted formats: PDF, JPG, PNG (max size: 10MB)
              </p>
            </div>
            <label className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Prescription
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{item.medicineName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: <span className="text-gray-700">{item.prescriptionId}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <Info label="Prescriber" value={item.prescriber} />
                <Info label="Issued Date" value={item.issuedDate} icon={<CalendarDays className="w-4 h-4 text-gray-400" />} />
                <Info label="Expiry Date" value={item.expiryDate} icon={<CalendarDays className="w-4 h-4 text-gray-400" />} />
                <Info label="Refills Remaining" value={String(item.refillsRemaining)} />
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 flex items-center justify-between">
                <p className="text-sm text-gray-700">{item.fileName}</p>
                <div className="flex items-center gap-3 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <Download className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {item.status === "Active" && item.refillsRemaining > 0 && (
                  <button
                    type="button"
                    onClick={() => handleOrderRefill(item.medicineName)}
                    className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Order Refill
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-0.5">{label}</p>
      <p className="text-gray-900 text-base flex items-center">
        {icon ? <span className="mr-2">{icon}</span> : null}
        {value}
      </p>
    </div>
  );
}
