import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StarIcon, TagIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const Hero = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });

        // Cari produk dengan kata "jam" di nama (case insensitive)
        const jamTangan = products.find((p) =>
          p.name?.toLowerCase().includes("jam")
        );
        setProduct(jamTangan);
      } catch (error) {
        console.error("❌ Gagal mengambil produk:", error.message);
      }
    };

    fetchProduct();
  }, []);

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-blue-100 pt-24 md:pt-32">
        <p className="text-gray-600 text-xl">Memuat produk terbaik...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-blue-100 pt-24 md:pt-32">
      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Bagian Teks */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: "some" }} 
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Tingkatkan Gaya Anda dengan{" "}
            <span className="text-blue-600">Fashion Modern</span>
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Temukan koleksi terbaru dengan kualitas terbaik.
            Tampil percaya diri setiap hari dengan produk eksklusif kami.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Belanja Sekarang
          </motion.button>
        </motion.div>

        {/* Card Produk Best Seller */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: "some" }} 
          className="relative w-full max-w-sm h-[450px] mx-auto rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.images?.[0]})` }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute top-5 left-5 bg-yellow-400 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-gray-900" />
            Koleksi Eksklusif
          </div>

          <div className="absolute top-5 right-5 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <TagIcon className="w-4 h-4" />
            Diskon 20%
          </div>

          <div className="absolute bottom-6 left-6 text-white space-y-2">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-white/90 text-lg">{product.shortDescription}</p>
            <p className="text-yellow-300 text-2xl font-semibold">
              Rp {Number(product.price).toLocaleString()}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (product?.id) {
                  navigate(`/product/${product.id}`);
                } else {
                  console.warn("⚠️ ID produk tidak ditemukan!");
                }
              }}
              className="mt-3 px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Lihat Detail
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
