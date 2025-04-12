import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { createUserProfile } from "../services/userService"; // Save user data to Firestore
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(""); 
  const [gender, setGender] = useState(""); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await register(email, password);
      const user = userCredential.user;

      // Save user data to Firestore with default role 'user'
      await createUserProfile(user.uid, {
        fullName,
        email,
        dob,
        gender,
        role: "user", // Default role
        createdAt: new Date().toISOString(),
      });

      navigate("/user-dashboard"); // Redirect to user dashboard
    } catch (error) {
      handleFirebaseError(error.code);
      setLoading(false);
    }
  }

  function validateForm() {
    if (fullName.trim() === "") {
      setError("Nama lengkap tidak boleh kosong.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Masukkan email yang valid.");
      return false;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return false;
    }
    if (!dob) {
      setError("Tanggal lahir harus diisi.");
      return false;
    }
    if (!gender) {
      setError("Pilih gender terlebih dahulu.");
      return false;
    }
    return true;
  }

  function handleFirebaseError(code) {
    const errorMessages = {
      "auth/email-already-in-use": "Email sudah terdaftar. Gunakan email lain.",
      "auth/invalid-email": "Format email tidak valid.",
      "auth/weak-password": "Password terlalu lemah. Gunakan minimal 6 karakter.",
    };
    setError(errorMessages[code] || "Terjadi kesalahan. Silakan coba lagi.");
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="border p-2 rounded mb-3"
        />
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
        <label className="text-sm text-gray-600 mb-1">Tanggal Lahir</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
          className="border p-2 rounded mb-3"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="border p-2 rounded mb-3"
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-center mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
