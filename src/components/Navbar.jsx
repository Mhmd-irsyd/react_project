import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import logo from "../assets/Logo.svg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const uniqueCartCount = cartItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      Swal.fire({
        title: "Login Diperlukan!",
        text: "Silakan login untuk melihat keranjang.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    } else {
      navigate("/cart");
    }
  };

  return (
    <motion.nav
      className={`fixed w-full top-0 left-0 transition-all duration-300 z-50 ${
        scrolled ? "bg-blue-700 shadow-lg" : "bg-blue-100"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-3">
        {/* Logo & Toggle Menu */}
        <div className="flex items-center gap-4 h-[50px]">
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Bars3Icon className={`h-7 w-7 ${scrolled ? "text-white" : "text-blue-700"}`} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Shopifya Logo" className="h-6 md:h-8 w-auto" />
            <span className={`text-xl font-bold ${scrolled ? "text-white" : "text-blue-700"}`}>
              Shopifya
            </span>
          </Link>
        </div>

        {/* Menu Desktop */}
        <ul className={`hidden md:flex gap-6 text-lg ${scrolled ? "text-white" : "text-blue-700"}`}>
          {["/", "/shop", "/about", "/contact"].map((path, index) => (
            <li key={index}>
              <Link to={path} className="hover:text-gray-300 transition">
                {path === "/" ? "Beranda" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Ikon Cart & User */}
        <div className="flex items-center gap-4">
          <button onClick={handleCartClick} className="relative">
            <ShoppingCartIcon className={`h-7 w-7 ${scrolled ? "text-white" : "text-blue-700"}`} />
            {uniqueCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {uniqueCartCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <UserCircleIcon className="h-8 w-8 text-blue-700" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden"
                  >
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Pengaturan
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Log-Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-blue-900 text-white shadow-lg z-50 md:hidden flex flex-col p-6"
          >
            <button className="self-end mb-4" onClick={() => setIsOpen(false)}>
              <XMarkIcon className="h-7 w-7" />
            </button>
            <ul className="space-y-4 text-lg">
              {["/", "/shop", "/about", "/contact"].map((path, index) => (
                <li key={index}>
                  <Link to={path} onClick={() => setIsOpen(false)}>
                    {path === "/" ? "Beranda" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
