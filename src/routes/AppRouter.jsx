import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import Login from "../pages/LoginTemp";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ShopSection from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import BuyNowPage from "../pages/BuyNowPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

// Admin
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/ProductList";
import PaymentTracking from "../pages/admin/PaymentTracking";
import AdminSettings from "../pages/admin/AdminSettings";
import ProductAdd from "../pages/admin/AddProduct"; 
import ProductEdit from "../pages/admin/EditProduct";

// ProtectedRoute to protect routes for logged-in users only
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

// Main App Routes
const AppRoutes = () => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    // Smooth scroll to top of the page on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Show loading state while checking authentication status
  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <Suspense fallback={<div className="text-center mt-10 text-lg">Loading...</div>}>
      <Routes key={location.pathname}>

        {/* 🔐 Auth Routes (Login, Register) */}
        <Route element={<AuthLayout />}>
          {/* Login route */}
          <Route
            path="/login"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          {/* Register route */}
          <Route
            path="/register"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Register />
              )
            }
          />
        </Route>

        {/* 🌐 User Routes */}
        <Route element={<MainLayout />}>
          {/* Home route */}
          <Route
            path="/"
            element={
              currentUser && currentUser.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/shop" element={<ShopSection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/buy-now" element={<ProtectedRoute><BuyNowPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>

        {/* 🧑‍💻 Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="/admin/products/add" element={<AdminRoute><ProductAdd /></AdminRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductEdit /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><PaymentTracking /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        </Route>

        {/* ❌ Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
