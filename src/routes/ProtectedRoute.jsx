import { useAuth } from "../context/AuthContext";  
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const { currentUser, loading } = useAuth();  

  if (loading) {
    // Menunggu status autentikasi dari Firebase
    return <div className="text-center py-10">Loading...</div>; // Tampilkan loading jika autentikasi sedang diproses
  }

  if (!currentUser) {
    // Jika belum login, tampilkan pesan atau redirect ke halaman login
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold text-gray-700">You need to log in first</h2>
        <p className="text-gray-500">Silakan login untuk mengakses halaman ini.</p>
        <Navigate to="/login" />
      </div>
    );
  }

  // Periksa apakah role pengguna sesuai dengan role yang diperlukan
  if (currentUser.role !== requiredRole) {
    // Jika role tidak sesuai, arahkan ke halaman yang sesuai
    if (requiredRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />; // Untuk role "user" atau selain "admin"
  }

  // Jika sudah login dan role sesuai, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;
