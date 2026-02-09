import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  Loader2,
  Package,
} from "lucide-react";
import { getCartAPI, createOrderAPI } from "@/api";
import { toast } from "react-toastify";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onCartChange: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  userId,
  onCartChange,
}) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartAPI(userId);
      setCart(response.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchCart();
    }
  }, [isOpen, userId]);

  const handleCheckout = async () => {
    if (!cart?.items?.length) return;

    try {
      setCheckingOut(true);
      // For simplicity, we create an order for the first pharmacy in the cart
      // Modern carts might need split orders per pharmacy
      const pharmacyId = cart.items[0].pharmacy_id;
      await createOrderAPI(userId, pharmacyId);

      toast.success("Order placed successfully!");
      onCartChange();
      onClose();
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : !cart?.items?.length ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Cart is empty
                </h3>
                <p className="text-sm text-gray-500">
                  Pick something from the marketplace
                </p>
              </div>
            ) : (
              cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex space-x-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100"
                >
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <Package className="w-10 h-10 text-blue-100" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 leading-tight">
                        {item.medicine_name}
                      </h4>
                      <span className="font-bold text-blue-600 text-sm whitespace-nowrap">
                        {item.price_per_unit} ADA
                      </span>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      From: {item.pharmacy_name}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1">
                        <button className="p-1 hover:text-blue-600 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button className="p-1 hover:text-blue-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart?.items?.length > 0 && (
            <div className="p-6 bg-gray-50/80 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">
                    {cart.total_price}{" "}
                    <span className="text-sm font-bold text-blue-600">ADA</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {cart.total_items} Items
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {checkingOut ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Pay with Cardano</span>
                    <ArrowRight className="w-5 h-5 ml-auto" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 font-medium px-4">
                By clicking "Pay with Cardano", you will initiate a blockchain
                transaction to the pharmacy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
