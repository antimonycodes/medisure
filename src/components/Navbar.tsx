import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getPatientCart, removeItemFromPatientCart, type CartDto } from "@/api";
import { useRouter } from "next/router";

type NavMenu = {
  name: string;
  link: string;
  isButton?: boolean;
};

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [removingItemId, setRemovingItemId] = useState("");
  const [patientCart, setPatientCart] = useState<CartDto | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useAuth();

  const dashboardRoute: Record<string, string> = {
    patient: "/",
    distributor: "/distributor/dashboard",
    pharmacy: "/pharmacy/dashboard",
    manufacturer: "/manufacturer/dashboard",
  };

  const userDashboardRoute = dashboardRoute[user?.role || ""] || "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const loadPatientCart = useCallback(async () => {
    if (!user || user.role !== "patient") {
      setCartCount(0);
      setPatientCart(null);
      return;
    }
    try {
      setCartLoading(true);
      const cart = await getPatientCart(user.id);
      setPatientCart(cart);
      setCartCount(cart?.total_items || 0);
    } catch {
      setCartCount(0);
      setPatientCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPatientCart();
  }, [loadPatientCart, router.asPath]);

  const baseMenus: NavMenu[] = [
    { name: "How it works", link: "/#how-it-works" },
    { name: "About us", link: "/about" },
  ];

  const guestMenus: NavMenu[] = [
    { name: "Login", link: "/signin" },
    { name: "Sign Up", link: "/signup", isButton: true },
  ];

  const authMenus: NavMenu[] = baseMenus;
  const navMenus: NavMenu[] = user ? authMenus : [...baseMenus, ...guestMenus];

  const NavLink = ({
    menu,
    mobile = false,
  }: {
    menu: NavMenu;
    mobile?: boolean;
  }) => {
    const baseClasses = mobile
      ? "block w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200"
      : "px-4 py-2 text-sm font-medium transition-all duration-200";

    if (menu.isButton) {
      return (
        <Link
          href={menu.link}
          className={`${baseClasses} ${
            mobile
              ? "bg-blue-600 max-w-fit text-white hover:bg-blue-700 rounded-lg mx-6"
              : "bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg"
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          {menu.name}
        </Link>
      );
    }

    return (
      <Link
        href={menu.link}
        className={`${baseClasses} ${
          mobile
            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-b border-gray-100"
            : "text-gray-700 hover:text-blue-600"
        }`}
        onClick={() => mobile && setIsOpen(false)}
      >
        {menu.name}
      </Link>
    );
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 relative">
                 {/* Using img tag for simplicity as verified in public folder. Next/Image requires width/height or fill */}
                <img src="/logo.png" alt="MediSure Logo" className="w-full h-full object-contain" />
              </div>
              <span className="ml-3 text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">
                MediSure
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navMenus.map((menu) => (
                <NavLink key={menu.name} menu={menu} />
              ))}

              {user ? (
                <>
                  {user.role === "patient" && (
                    <Link
                      href="/shop"
                      className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Shop
                    </Link>
                  )}
                  {user.role === "patient" && (
                    <button
                      type="button"
                      onClick={() => setCartOpen(true)}
                      className="ml-2 p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  )}
                  {user.role !== "patient" && (
                    <Link
                      href={userDashboardRoute}
                      className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  )}

                  <div className="relative ml-2">
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold mr-2">
                        {user.username.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user.username}
                          </p>
                        </div>
                        <Link
                          href={userDashboardRoute}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/shop"
                  className="ml-4 p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="flex items-center lg:hidden space-x-2">
              {!user && (
                <Link
                  href="/shop"
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                </Link>
              )}
              {user?.role === "patient" && (
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="bg-white border-t border-gray-200">
            <div className="py-2">
              {navMenus.map((menu) => (
                <NavLink key={menu.name} menu={menu} mobile />
              ))}
              {user && (
                <>
                  {user.role !== "patient" && (
                    <Link
                      href={userDashboardRoute}
                      className="block w-full text-left px-6 py-4 text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-6 py-4 text-lg font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#344054B2] bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          style={{ top: scrolled ? "64px" : "80px" }}
        />
      )}

      {/* Patient Cart Modal */}
      {cartOpen && user?.role === "patient" && (
        <div className="fixed inset-0 z-[60] bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Cart</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[360px] overflow-auto">
              {cartLoading ? (
                <p className="text-sm text-gray-500">Loading cart...</p>
              ) : !patientCart || patientCart.items.length === 0 ? (
                <p className="text-sm text-gray-500">No items in cart yet.</p>
              ) : (
                <div className="space-y-3">
                  {patientCart.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.medicine_name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | ₦{item.subtotal}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setRemovingItemId(item.id);
                            await removeItemFromPatientCart(item.id);
                            await loadPatientCart();
                          } finally {
                            setRemovingItemId("");
                          }
                        }}
                        disabled={removingItemId === item.id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {removingItemId === item.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total items: {patientCart?.total_items || 0}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/shop");
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Shop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/checkout");
                  }}
                  disabled={!patientCart || patientCart.items.length === 0}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" /> 
    </>
  );
};

export default Navbar;
