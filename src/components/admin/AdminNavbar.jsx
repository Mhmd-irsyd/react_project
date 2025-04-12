import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaUserCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.svg";

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { label: "Produk", path: "/admin/products", icon: <FaBoxOpen /> },
    { label: "Pembayaran", path: "/admin/payments", icon: <FaMoneyCheckAlt /> },
  ];

  // ✅ Path dinamis berdasarkan role
  const settingsPath = currentUser?.role === "admin" ? "/admin/settings" : "/settings";

  return (
    <header className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin" className="text-xl font-bold text-green-600 flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-7 w-7" />
          Shopifya Admin
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium ${
                  isActive ? "text-green-600" : "text-gray-600"
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}

          {/* Profile / Login */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FaUserCircle size={20} />
                {currentUser.displayName || "Admin"}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50"
                  >
                    <Link
                      to={settingsPath}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Pengaturan
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Login
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Burger */}
        <button onClick={toggleMenu} className="md:hidden text-gray-600">
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className="block py-2 text-sm font-medium text-gray-700"
              onClick={toggleMenu}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
          {currentUser ? (
            <>
              <Link
                to={settingsPath}
                className="block py-2 text-sm text-gray-700"
                onClick={toggleMenu}
              >
                Pengaturan
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                  navigate("/login");
                }}
                className="block w-full text-left py-2 text-sm text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block py-2 text-sm text-green-600"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
