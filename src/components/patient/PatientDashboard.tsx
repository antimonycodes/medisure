import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Info,
  Store,
  Clock,
  ShieldCheck,
  Filter,
  Package,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { listMarketplaceDrugsAPI, addToCartAPI, getCartAPI } from "@/api";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Get real user ID
  const userId = user ? parseInt(user.id) : 0;

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await listMarketplaceDrugsAPI();
      setDrugs(response.drugs);
    } catch (error) {
      console.error("Error fetching marketplace drugs:", error);
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await getCartAPI(userId);
      setCartCount(response.cart.total_items);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "patient") {
      router.replace("/signin");
      return;
    }
    fetchDrugs();
    fetchCartCount();
  }, [user]);

  const handleAddToCart = async (inventoryId: string) => {
    try {
      await addToCartAPI(userId, inventoryId, 1);
      toast.success("Added to cart!");
      fetchCartCount();
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for medications or pharmacies..."
            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>My Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500 font-medium">Loading marketplace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrugs.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                No drugs found
              </h3>
              <p className="text-gray-500">
                Try searching for something else or check back later.
              </p>
            </div>
          ) : (
            filteredDrugs.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className="aspect-square bg-blue-50/50 rounded-3xl flex items-center justify-center group-hover:bg-blue-50 transition-colors overflow-hidden">
                    <Package className="w-20 h-20 text-blue-200 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm uppercase tracking-wider border border-blue-50">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                      <Store className="w-3 h-3 mr-1" />
                      {item.pharmacy_name}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">
                      {item.medicine_name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                      {item.batch_details?.composition ||
                        "Drug composition details..."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-gray-50">
                    <div className="flex items-center text-xs text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Exp: {item.batch_details?.expiry_date}
                    </div>
                    <span className="flex items-center text-xs text-green-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      NFT Secure
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black text-blue-600">
                        {item.price_per_unit}
                      </span>
                      <span className="text-xs font-bold text-gray-400 ml-1">
                        ADA
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="bg-gray-900 hover:bg-blue-600 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userId={userId}
        onCartChange={fetchCartCount}
      />
    </div>
  );
};

export default PatientDashboard;
