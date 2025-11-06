"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; 
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const headerVariants = {
    initial: { opacity: 0, y: -10 }, 
    animate: { opacity: 1, y: 0 }, 
  };
  
  const headerTransition = {
    duration: 0.5, 
    ease: "easeOut",
  };


  // --- Animación del Menú Móvil ---
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { 
        type: "tween", 
        duration: 0.15, 
        ease: "easeOut"
      } 
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        type: "spring", 
        damping: 10, 
        stiffness: 80,
      } 
    },
  };

  // Función para enlaces a secciones
    const sectionLink = (id) => {
    if (pathname === "/") {
    return `#${id}`;

    }
    return { pathname: "/", hash: id };
    };

  return (
    <motion.header 
      className="bg-white shadow-sm fixed w-full z-60"
      initial="initial" 
      animate="animate" 
      transition={headerTransition} 
      variants={headerVariants} 
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src="/icons/logogetsweet.png" alt="Sweet AI Logo" width={32} height={32} />
            <span className="hidden xl:flex ml-2 font-semibold text-gray-900 text-lg">GetSweet.AI</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center"> 
          <Link href={sectionLink("features")} className="text-gray-700 hover:text-black">Features</Link> 
          <Link href={sectionLink("how-it-works")} className="text-gray-700 hover:text-black">How it works</Link> 
          <Link href={sectionLink("use-cases")} className="text-gray-700 hover:text-black">Use cases</Link> 
          <Link href={sectionLink("pricing")} className="text-gray-700 hover:text-black">Pricing</Link> 
          <Link href={sectionLink("contact-us")} className="text-gray-700 hover:text-black">Contact us</Link> 
          <Link href="/sign-in" className="text-gray-800 font-bold px-4 py-2 rounded-xl ml-6 hover:bg-gray-200 p-2">Sign In</Link> 
          <Link href="/sign-up" className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:brightness-90 transition" > Get Started </Link> 
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link
            href="/sign-up"
            className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <button onClick={toggleMenu} className="ml-3 focus:outline-none">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu con Animación Spring */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="mobile-menu" 
            className="md:hidden bg-white shadow-sm px-6 py-4 overflow-hidden" 
            variants={menuVariants}
            initial="hidden" 
            animate="visible" 
            exit="hidden" 
          >
            <ul className="flex flex-col space-y-3">
            <li> 
              <Link href={sectionLink("features")} className="block text-gray-700 hover:text-gray-900" onClick={toggleMenu}>Features</Link> 
            </li>
              <li>
                <Link href={sectionLink("how-it-works")} className="block text-gray-700 hover:text-gray-900" onClick={toggleMenu}>How It Works</Link>
              </li>
              <li>
                <Link href={sectionLink("use-cases")} className="block text-gray-700 hover:text-gray-900" onClick={toggleMenu}>Use Cases</Link>
              </li>
              <li>
                <Link href={sectionLink("pricing")} className="block text-gray-700 hover:text-gray-900" onClick={toggleMenu}>Pricing</Link>
              </li>
              <li>
                <Link href="/sign-in" className="block text-gray-700 hover:text-gray-900" onClick={toggleMenu}>Sign In</Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
