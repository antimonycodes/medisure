"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  Package,
  Truck,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { getPatientOrderById } from "@/api";

type OrderItem = {
  id: string;
  medicine_name?: string;
  quantity?: number;
  subtotal?: string;
};

type PatientOrder = {
  id: string;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at?: string;
  pharmacy_name?: string;
  items: OrderItem[];
};

const statusConfig: Record<
  string,
  { label: string; className: string; icon: ReactNode }
> = {
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
  },
  shipped: {
    label: "In Transit",
    className: "bg-blue-100 text-blue-700",
    icon: <Truck className="w-4 h-4 mr-2" />,
  },
  processing: {
    label: "Processing",
    className: "bg-amber-100 text-amber-700",
    icon: <Package className="w-4 h-4 mr-2" />,
  },
  pending: {
    label: "Pending",
    className: "bg-gray-200 text-gray-700",
    icon: <Clock3 className="w-4 h-4 mr-2" />,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-indigo-100 text-indigo-700",
    icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-100 text-rose-700",
    icon: <Clock3 className="w-4 h-4 mr-2" />,
  },
};

export default function OrderDetailsPage() {
  useRequireRole([ROLES.PATIENT]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<PatientOrder | null>(null);

  const orderId = typeof router.query.orderId === "string" ? router.query.orderId : "";

  const loadOrder = useCallback(async () => {
    if (!orderId || !user?.id) return;
    try {
      setLoading(true);
      const data = await getPatientOrderById(orderId);
      if (!data || String(data.user) !== String(user.id)) {
        toast.error("Order not found.");
        router.replace("/orders");
        return;
      }
      setOrder(data);
    } catch {
      toast.error("Failed to load order details.");
      router.replace("/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, router, user?.id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const timeline = useMemo(() => {
    if (!order) return [];
    const created = order.created_at ? new Date(order.created_at) : new Date();
    const updated = order.updated_at ? new Date(order.updated_at) : new Date();
    const raw = (order.status || "pending").toLowerCase();

    const base = [
      {
        key: "ordered",
        title: "Order Placed",
        at: created,
        done: true,
      },
      {
        key: "processing",
        title: "Processing",
        at: new Date(created.getTime() + 2 * 60 * 60 * 1000),
        done: ["processing", "shipped", "delivered"].includes(raw),
      },
      {
        key: "shipped",
        title: "Shipped",
        at: new Date(created.getTime() + 24 * 60 * 60 * 1000),
        done: ["shipped", "delivered"].includes(raw),
      },
      {
        key: "delivered",
        title: "Delivered",
        at: updated,
        done: raw === "delivered",
      },
    ];
    return base;
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">
        Loading order details...
      </div>
    );
  }

  if (!order) return null;

  const rawStatus = (order.status || "pending").toLowerCase();
  const cfg = statusConfig[rawStatus] || statusConfig.pending;
  const trackingNumber = `TRK-${String(order.id).replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const createdLabel = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/orders")}
              className="inline-flex items-center text-gray-700 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Order History
            </button>

            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="MediSure" className="w-8 h-8 object-contain" />
              <h1 className="text-2xl font-semibold text-gray-900">MediSure</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/prescriptions")}
                className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Prescriptions
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

      <main className="max-w-[1200px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-5">
          <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  ORD-{String(order.id).slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-gray-500 mt-1">Placed on {createdLabel}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cfg.className}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-gray-500 text-sm">Tracking Number</p>
              <p className="text-gray-800 text-lg">{trackingNumber}</p>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.medicine_name || "Medicine"}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₦{item.subtotal || "0.00"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="space-y-5">
          <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold text-gray-900">₦{order.total_amount}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">Pharmacy</p>
              <p className="text-sm font-medium text-gray-800">
                {order.pharmacy_name || "Assigned Pharmacy"}
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
            <div className="space-y-3">
              {timeline.map((step) => (
                <div key={step.key} className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full mt-0.5 ${
                      step.done ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <CalendarDays className="w-3.5 h-3.5 mr-1" />
                      {step.at.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
