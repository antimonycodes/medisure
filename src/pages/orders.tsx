"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  LogOut,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { getPatientOrders } from "@/api";

type OrderItem = {
  id: string;
  inventory_item: string;
  medicine_name?: string;
  quantity?: number;
  subtotal?: string;
};

type PatientOrder = {
  id: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
};

const statusConfig: Record<
  string,
  { label: string; className: string; icon: ReactNode }
> = {
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
  },
  shipped: {
    label: "In Transit",
    className: "bg-blue-100 text-blue-700",
    icon: <Truck className="w-3.5 h-3.5 mr-1" />,
  },
  processing: {
    label: "Processing",
    className: "bg-amber-100 text-amber-700",
    icon: <PackageCheck className="w-3.5 h-3.5 mr-1" />,
  },
  pending: {
    label: "Pending",
    className: "bg-gray-200 text-gray-700",
    icon: <Clock3 className="w-3.5 h-3.5 mr-1" />,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-indigo-100 text-indigo-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-100 text-rose-700",
    icon: <Clock3 className="w-3.5 h-3.5 mr-1" />,
  },
};

export default function OrdersPage() {
  useRequireRole([ROLES.PATIENT]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<PatientOrder[]>([]);

  const loadOrders = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getPatientOrders(user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load order history.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const normalizedOrders = useMemo(() => {
    return orders.map((order, index) => {
      const rawStatus = (order.status || "pending").toLowerCase();
      const cfg = statusConfig[rawStatus] || statusConfig.pending;
      const created = order.created_at
        ? new Date(order.created_at)
        : new Date(Date.now() - index * 86400000);
      const displayDate = created.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const trackingNumber = `TRK-${String(order.id).replace(/-/g, "").slice(0, 12).toUpperCase()}`;
      const medicineLine =
        order.items?.length > 0
          ? order.items
              .map((item) => `${item.medicine_name || "Medicine"} x ${item.quantity || 1}`)
              .join(", ")
          : "No items";
      return {
        ...order,
        cfg,
        displayDate,
        trackingNumber,
        medicineLine,
      };
    });
  }, [orders]);

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
                onClick={() => router.push("/prescriptions")}
                className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Prescriptions
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium"
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
        <section className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900">Order History</h2>
          <p className="text-gray-600 mt-1">View and track your past orders</p>
        </section>

        {loading ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
            Loading order history...
          </section>
        ) : normalizedOrders.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
            No orders yet.
          </section>
        ) : (
          <section className="space-y-4">
            {normalizedOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900">
                      ORD-{String(order.id).slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-gray-500 mt-1">{order.displayDate}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.cfg.className}`}
                  >
                    {order.cfg.icon}
                    {order.cfg.label}
                  </span>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <p className="text-gray-700 text-xl">{order.medicineLine}</p>
                  <p className="text-gray-900 text-2xl font-medium">₦{order.total_amount}</p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex items-start justify-between">
                    <p className="text-2xl text-gray-800">Total</p>
                    <p className="text-2xl font-medium text-gray-900">₦{order.total_amount}</p>
                  </div>

                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <p className="text-gray-500 text-sm">Tracking Number</p>
                    <p className="text-gray-800 text-lg">{order.trackingNumber}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => router.push(`/orders/${encodeURIComponent(order.id)}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => toast.info("Invoice export can be added next.")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => router.push(`/orders/${encodeURIComponent(order.id)}`)}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Package
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
