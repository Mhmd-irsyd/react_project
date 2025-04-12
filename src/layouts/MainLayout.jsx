import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isAtTop, setIsAtTop] = useState(true);

  // Auto scroll ke atas saat ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Deteksi scroll untuk navbar transparan
  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar: Jika belum login & di atas, transparan */}
      <Navbar isTransparent={!currentUser && isAtTop} />

      {/* Konten halaman */}
      <main className="flex-grow w-full max-w-none pt-16 overflow-hidden">
  <Outlet key={location.pathname} />
</main>



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
