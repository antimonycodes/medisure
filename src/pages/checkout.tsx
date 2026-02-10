"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogOut, Package2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import {
  createPatientOrder,
  getPatientCart,
  getShopInventory,
  type CartDto,
  type ShopMedicineItem,
} from "@/api";

export default function CheckoutPage() {
  useRequireRole([ROLES.PATIENT]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [inventory, setInventory] = useState<ShopMedicineItem[]>([]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [cartData, inventoryData] = await Promise.all([
        getPatientCart(user.id),
        getShopInventory(),
      ]);
      setCart(cartData);
      setInventory(inventoryData);
      setEmail(`${user.username}@example.com`);
    } catch {
      toast.error("Failed to load checkout data.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const orderLines = useMemo(() => {
    const items = cart?.items || [];
    return items.map((line) => {
      const source = inventory.find((item) => item.inventoryId === line.inventory_item);
      const subtotal = Number(line.subtotal || 0);
      return {
        ...line,
        medicineName: line.medicine_name || source?.medicineName || "Medicine",
        pharmacyId: source?.pharmacyId || "",
        price: subtotal,
      };
    });
  }, [cart?.items, inventory]);

  const subtotal = useMemo(
    () => orderLines.reduce((sum, item) => sum + (item.price || 0), 0),
    [orderLines]
  );
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  const handleCompleteOrder = async () => {
    if (!user?.id || !cart || cart.items.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }
    if (!email.trim() || !phone.trim() || !firstName.trim() || !lastName.trim() || !address.trim()) {
      toast.warning("Please fill required contact and shipping fields.");
      return;
    }

    const pharmacyIds = new Set<string>();
    for (const line of orderLines) {
      if (line.pharmacyId) pharmacyIds.add(line.pharmacyId);
    }
    const pharmacyId = pharmacyIds.values().next().value as string | undefined;
    if (!pharmacyId) {
      toast.error("Unable to determine pharmacy for this order.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createPatientOrder(user.id, pharmacyId);
      toast.success("Order completed successfully.");
      if (result?.order_id) {
        router.push(`/orders/${encodeURIComponent(result.order_id)}`);
      } else {
        router.push("/orders");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to complete order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">
        Loading checkout...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cart is empty</h1>
          <p className="text-gray-600 mb-4">Add medicines from shop before checkout.</p>
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 py-4">
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
      </header>

      <main className="max-w-[1200px] mx-auto px-5 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="space-y-5">
            <article className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="col-span-2 h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apartment, suite, etc."
                  className="col-span-2 h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
                <input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP code"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                />
              </div>
            </article>
          </section>

          <section>
            <article className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {orderLines.map((line) => (
                  <div key={line.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package2 className="w-7 h-7 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{line.medicineName}</p>
                        <p className="text-xs text-gray-500">Qty: {line.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₦{line.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₦{shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₦{tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-gray-900 font-semibold">₦{total.toFixed(2)}</span>
                </div>
              </div>
            </article>
          </section>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleCompleteOrder}
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Completing Order..." : "Complete Order"}
          </button>
        </div>
      </main>
    </div>
  );
}
