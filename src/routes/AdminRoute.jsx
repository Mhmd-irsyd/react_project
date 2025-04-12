import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // ⏳ Tampilkan loading dulu kalau masih ngecek user
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // 🚫 Belum login? Lempar ke login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Bukan admin? Lempar ke beranda atau halaman unauthorized
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin terverifikasi, render komponen child-nya
  return children;
};

export default AdminRoute;
