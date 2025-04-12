// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect berdasarkan role
  useEffect(() => {
    console.log("✅ User setelah login:", currentUser); // ⬅️ Tambahkan ini
    if (currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [currentUser, navigate]);
  

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // 🚫 Jangan redirect di sini, biar di-handle oleh useEffect
    } catch (error) {
      handleFirebaseError(error.code);
    }

    setLoading(false);
  }

  // 🔥 Menangani error dari Firebase
  function handleFirebaseError(code) {
    switch (code) {
      case "auth/invalid-credential":
        setError("Email atau password yang Anda masukkan salah.");
        break;
      case "auth/user-not-found":
        setError("Akun dengan email ini tidak ditemukan.");
        break;
      case "auth/wrong-password":
        setError("Password yang Anda masukkan salah.");
        break;
      case "auth/too-many-requests":
        setError("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
        break;
      default:
        setError("Terjadi kesalahan. Silakan coba lagi.");
        break;
    }
  }

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      {/* 🔥 Tampilkan pesan error */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Link ke Register */}
      <p className="text-sm text-center mt-3">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
