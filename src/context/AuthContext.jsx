import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  createUserProfile,
  uploadUserProfileImage,
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

// Membuat Context
const AuthContext = createContext();

// Custom hook untuk penggunaan context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider untuk membungkus aplikasi
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!currentUser;

  // 🔄 Update state user dari Firestore
  const fetchUserAndSet = async (user) => {
    try {
      const userData = await getUserProfile(user.uid);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: userData?.fullName || user.displayName,
        photoURL: userData?.photoURL || user.photoURL || null,
        role: userData?.role || "user", // ✅ Default ke "user" kalau tidak ada
      });
    } catch (error) {
      console.error("🔥 Error fetching user profile:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Pantau perubahan autentikasi user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserAndSet(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fungsi untuk registrasi user baru dengan role default "user"
  const register = async (email, password, fullName, file) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      if (file) {
        photoURL = await uploadUserProfileImage(user.uid, file);
      }

      // Update profil di Firebase Auth
      await updateProfile(user, {
        displayName: fullName,
        photoURL: photoURL || null,
      });

      // Simpan ke Firestore dengan role "user" (default)
      await createUserProfile(user.uid, {
        fullName,
        email,
        photoURL: photoURL || null,
        role: "user", // Role default "user"
      });

      // Ambil data lengkap dari Firestore dan set ke state
      await fetchUserAndSet(user);

      return user;
    } catch (error) {
      console.error("❌ Error during registration:", error);
      throw error;
    }
  };

  // ✅ Fungsi login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await fetchUserAndSet(user);
      return user;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // ✅ Fungsi logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("❌ Logout gagal:", error);
    }
  };

  // ✅ Fungsi untuk memperbarui profil pengguna
  const updateProfileInfo = async (uid, data) => {
    try {
      await updateUserProfile(uid, data);
      await fetchUserAndSet({ ...currentUser, ...data });
      console.log("✅ Profil pengguna berhasil diperbarui");
    } catch (error) {
      console.error("❌ Error saat memperbarui profil:", error);
    }
  };

  // ✅ Memoize actions biar gak re-render
  const authActions = useMemo(() => ({
    currentUser,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfileInfo,
    loading,
  }), [currentUser, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={authActions}>
      {children}
    </AuthContext.Provider>
  );
}
