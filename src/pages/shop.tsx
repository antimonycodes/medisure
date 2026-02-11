"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  FileText,
  Home,
  LogOut,
  Package2,
  Search,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLES } from "@/constants/roles";
import {
  addItemToPatientCart,
  getPatientCart,
  getShopInventory,
  removeItemFromPatientCart,
  type CartDto,
  type ShopMedicineItem,
} from "@/api";

const drugImageMap: Record<string, string> = {
  "Paracetamol 500mg": "/drugs/paracetamol-500mg.jpg",
  "Cefuroxime 500mg": "/drugs/cefuroxime-500mg.jpg",
  "Amoxicillin 250mg": "/drugs/amoxicillin-250mg.jpg",
  "Cough Syrup 100ml": "/drugs/cough-syrup-100ml.jpg",
  "Artemether Injection 80mg/1ml": "/drugs/artemether-injection-80mg.jpg",
  "Atorvastatin 20mg": "/drugs/atorvastatin-20mg.jpg",
  "Azithromycin 500mg": "/drugs/azithromycin-500mg.jpg",
  "Cetirizine 10mg": "/drugs/cetirizine-10mg.jpg",
  "Ciprofloxacin 500mg": "/drugs/ciprofloxacin-500mg.jpg",
  "Co-trimoxazole 960mg": "/drugs/co-trimoxazole-960mg.jpg",
};

function getDrugImage(medicineName: string) {
  return drugImageMap[medicineName] ?? "";
}

export default function ShopPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShopMedicineItem[]>([]);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<ShopMedicineItem | null>(
    null,
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [addingInventoryId, setAddingInventoryId] = useState("");
  const [removingItemId, setRemovingItemId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const inventoryPromise = getShopInventory();
      const cartPromise = user?.id
        ? getPatientCart(user.id)
        : Promise.resolve(null);

      const [inventory, cartData] = await Promise.all([
        inventoryPromise,
        cartPromise,
      ]);

      setItems(inventory);
      if (cartData) setCart(cartData);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load shop data.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const q = router.query.search;
    if (typeof q === "string") {
      setSearch(q);
    }
  }, [router.query.search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, items.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.batchId.toLowerCase().includes(q) ||
        item.medicineName.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q),
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const cartCount = cart?.total_items || 0;

  const handleAddToCart = async (item: ShopMedicineItem) => {
    if (!user?.id) {
      toast.info("Please sign in as a patient to add items to cart.");
      router.push("/signin");
      return;
    }

    if (user.role !== "patient") {
      toast.warning("Only patients can purchase items.");
      return;
    }

    try {
      setAddingInventoryId(item.inventoryId);
      await addItemToPatientCart(user.id, item.inventoryId, 1);
      const cartData = await getPatientCart(user.id);
      setCart(cartData);
      toast.success(`${item.medicineName} added to cart.`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to add item to cart.",
      );
    } finally {
      setAddingInventoryId("");
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!user?.id) return;
    try {
      setRemovingItemId(cartItemId);
      await removeItemFromPatientCart(cartItemId);
      const cartData = await getPatientCart(user.id);
      setCart(cartData);
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setRemovingItemId("");
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-700 text-sm font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>

            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MediSure"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-semibold text-gray-900">
                MediSure Shop
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => router.push("/prescriptions")}
                    className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Prescriptions
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/orders")}
                    className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                  >
                    Order History
                  </button>
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[11px] font-semibold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="inline-flex items-center px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines, manufacturers, or batch IDs..."
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={cartCount === 0}
              className="h-12 px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {`Checkout (${cartCount})`}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 py-6">
        {loading ? (
          <section className="h-[420px] rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-gray-600">Loading medicines...</p>
            </div>
          </section>
        ) : filtered.length === 0 ? (
          <section className="h-[420px] rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
            <div className="text-center">
              <Package2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base text-gray-700">No medicines found</p>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageItems.map((item) => (
              <article
                key={item.inventoryId}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="h-56 rounded-xl bg-blue-50 flex items-center justify-center mb-4 overflow-hidden">
                  {getDrugImage(item.medicineName) ? (
                    <img
                      src={getDrugImage(item.medicineName)}
                      alt={item.medicineName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package2 className="w-12 h-12 text-blue-400" />
                  )}
                </div>

                <div className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 mb-3">
                  Verified
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {item.medicineName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.composition}</p>

                <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Store className="w-4 h-4 mr-2 text-gray-400" />
                    {item.pharmacyName}
                  </p>
                  <p className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                    Expires: {item.expiryDate}
                  </p>
                  <p>Batch: {item.batchId}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-blue-600">
                      {item.pricePerUnit.toFixed(2)} ADA
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantityAvailable} in stock
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      disabled={addingInventoryId === item.inventoryId}
                      className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                    >
                      {addingInventoryId === item.inventoryId
                        ? "Adding..."
                        : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && filtered.length > pageSize && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium border ${
                    page === safePage
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/45 z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-xl p-5 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedItem.medicineName} Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Batch ID" value={selectedItem.batchId} />
              <Info label="Manufacturer" value={selectedItem.manufacturer} />
              <Info label="Pharmacy" value={selectedItem.pharmacyName} />
              <Info label="Composition" value={selectedItem.composition} />
              <Info label="MFG Date" value={selectedItem.manufactureDate} />
              <Info label="Expiry Date" value={selectedItem.expiryDate} />
              <Info label="NFT Token" value={selectedItem.nftToken} mono />
              <Info
                label="Last Tx Hash"
                value={selectedItem.latestTxHash || "-"}
                mono
              />
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 bg-black/45 z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl p-5 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Your Cart</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!cart || cart.items.length === 0 ? (
              <p className="text-sm text-gray-600">No items in cart yet.</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-auto">
                {cart.items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.medicine_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.price_per_unit}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={removingItemId === item.id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {removingItemId === item.id ? "Removing..." : "Remove"}
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Items: {cart?.total_items || 0}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  handleCheckout();
                }}
                disabled={!cart || cart.items.length === 0}
                className="px-3 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-sm text-gray-900 ${mono ? "font-mono break-all" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
