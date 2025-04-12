import { useEffect, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Link } from "react-router-dom";
import aboutImage from "../assets/about.jpg";
import { stats } from "../data/aboutData";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section id="about" className="py-16 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Bagian Kiri: Teks */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tentang Toko Kami
            </h2>
            <p className="text-gray-700 mt-4 text-lg leading-relaxed">
              Kami menyediakan produk berkualitas tinggi dengan harga terbaik.
              Setiap produk yang kami tawarkan dipilih dengan cermat untuk
              memenuhi kebutuhan pelanggan.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Belanja Sekarang
            </Link>
          </m.div>

          {/* Bagian Kanan: Gambar */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center"
          >
            <img
              src={aboutImage}
              alt="Toko kami dengan berbagai produk unggulan"
              className="w-full max-w-lg rounded-xl shadow-lg object-cover"
              loading="lazy"
            />
          </m.div>
        </div>

        {/* Bagian Performa Bisnis */}
        <div className="mt-16 bg-gray-100 py-12 w-full">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Performa Kami
            </h2>
            <p className="text-gray-700 mt-4 text-lg">
              Bukti nyata kualitas layanan kami dari pelanggan setia.
            </p>

            {/* Grid Statistik */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                  {stat.icon}
                  <h3 className="text-3xl font-bold text-gray-900 mt-3">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default AboutSection;
