import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navMenus = [
    { name: "How it works", link: "/#how-it-works" },
    { name: "About us", link: "/about" },
    { name: "Login", link: "/signin" },
    { name: "Shop Now", link: "/shop", isButton: true },
  ];

  const NavLink = ({
    menu,
    mobile = false,
  }: {
    menu: any;
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
                <img
                  src="/logo.png"
                  alt="MediSure Logo"
                  className="w-full h-full object-contain"
                />
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
              <Link
                href="/cart"
                className="ml-4 p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="flex items-center lg:hidden space-x-2">
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span> */}
              </Link>
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

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
