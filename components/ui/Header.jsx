"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/useContext";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

// --- NAV LINKS ---
const NavLinks = ({
  isAuthenticated,
  logout,
  isMobile = false,
  setMenuOpen,
}) => (
  <nav
    className={`flex ${isMobile ? "flex-col space-y-3" : "items-center gap-4"}`}
  >
    <Link
      href="#features"
      onClick={() => isMobile && setMenuOpen(false)}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-lg transition"
    >
      Features
    </Link>
    <Link
      href="#how-it-works"
      onClick={() => isMobile && setMenuOpen(false)}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-lg transition"
    >
      How it works
    </Link>
    <Link
      href="#use-cases"
      onClick={() => isMobile && setMenuOpen(false)}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-lg transition"
    >
      Use cases
    </Link>
    <Link
      href="#pricing"
      onClick={() => isMobile && setMenuOpen(false)}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-lg transition"
    >
      Pricing
    </Link>
    <Link
      href="#contact-us"
      onClick={() => isMobile && setMenuOpen(false)}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-lg transition"
    >
      Contact us
    </Link>

    {isAuthenticated
      ? isMobile && (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition text-left"
          >
            Sign Out
          </button>
        )
      : isMobile && (
          <>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition text-left"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105  transition text-left"
            >
              Get Started
            </Link>
          </>
        )}
  </nav>
);

// --- MOBILE SIDEBAR ---
const MobileSidebar = ({ isOpen, setMenuOpen, children }) => (
  <motion.div
    initial={{ y: "-100%" }}
    animate={{ y: isOpen ? 0 : "-100%" }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed top-0 left-0 w-full bg-white shadow-2xl z-50 p-6 lg:hidden rounded-b-2xl"
  >
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setMenuOpen(false)}
        className="p-1 text-purple-500 hover:text-gray-700 transition"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
    {children}
  </motion.div>
);

// --- HEADER PRINCIPAL ---
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full bg-white backdrop-blur-md shadow-lg z-50 border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* LOGO */}
          <Link href="/home" className="flex items-center gap-3">
            <Image
              src="/icons/logogetsweet.png"
              alt="GetSweet Logo"
              width={36}
              height={36}
            />
            <span className="hidden lg:flex ml-2 font-semibold text-gray-800 text-lg">
              GetSweet.AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLinks isAuthenticated={isAuthenticated} logout={logout} />
            {/* Saludo desktop */}
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-purple-900 mr-4">
                  Hey {user?.name?.split(" ")[0] || "user"}!
                </span>
                <button
                  onClick={logout}
                  className="text-gray-800 font-bold px-4 py-2 rounded-xl ml-6 hover:bg-gray-200 p-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Muestra los botones de Login/Sign Up
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-800 font-bold px-4 py-2 rounded-xl ml-6 hover:bg-gray-200 p-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
                >
                  {" "}
                  Get Started{" "}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Saludo arriba siempre */}
            {isAuthenticated && user && (
              <span className="text-sm font-medium text-purple-900">
                Hey {user?.name?.split(" ")[0]}!
              </span>
            )}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-purple-700 hover:bg-gray-200 transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <MobileSidebar isOpen={isMenuOpen} setMenuOpen={setMenuOpen}>
          <NavLinks
            isAuthenticated={isAuthenticated}
            logout={logout}
            isMobile
            setMenuOpen={setMenuOpen}
          />
        </MobileSidebar>
      )}
    </>
  );
};

export default Header;
