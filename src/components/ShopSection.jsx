import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

// Helper untuk format angka menjadi Rupiah
const formatCurrencyIDR = (amount) =>
  new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const ShopSection = () => {
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [products, setProducts] = useState([]);

  // Ambil data dari Firestore saat komponen dimount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => {
          const productData = doc.data();
    
          // Pastikan price adalah string, jika tidak konversi menjadi string terlebih dahulu
          let price = productData.price;
          if (typeof price === 'number') {
            price = price.toString();  // Ubah angka menjadi string
          }
    
          // Menghapus titik dan mengubah harga menjadi angka
          price = parseFloat(price.replace(/\./g, "").replace(',', '.'));
    
          return {
            id: doc.id,
            ...productData,
            price: price,  // Simpan harga yang sudah diformat
          };
        });
    
        console.log(fetchedProducts);  // Cek harga produk setelah konversi
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      }
    };
    
    
    fetchProducts();
  }, []);

  // Toggle Wishlist
  const toggleLike = useCallback((id) => {
    setLikedProducts((prev) => {
      const updatedLikes = new Set(prev);
      updatedLikes.has(id) ? updatedLikes.delete(id) : updatedLikes.add(id);
      return updatedLikes;
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <section className="pt-28 md:pt-32 pb-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center"
        >
          Jelajahi Produk Kami
        </motion.h2>
        <p className="text-gray-700 mt-3 sm:mt-4 text-base sm:text-lg text-center">
          Temukan produk berkualitas tinggi dengan desain premium.
        </p>

        {/* Grid Produk */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              Tidak ada produk yang tersedia.
            </p>
          ) : (
            products.map((product, index) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  className="relative bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-transform cursor-pointer"
                >
                  <motion.img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-56 md:h-64 object-cover rounded-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                  />

                  {/* Detail Produk */}
                  <div className="mt-4 flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    {/* Tombol Wishlist */}
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(product.id);
                      }}
                      whileTap={{ scale: 0.8 }}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      {likedProducts.has(product.id) ? (
                        <SolidHeartIcon className="w-6 h-6 text-red-500" />
                      ) : (
                        <OutlineHeartIcon className="w-6 h-6" />
                      )}
                    </motion.button>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {product.shortDescription}
                  </p>
                  <p className="text-md sm:text-lg text-blue-600 font-bold mt-2">
                    Rp {formatCurrencyIDR(product.price)}
                  </p>
                  <p className="text-yellow-500 text-sm mt-1">
                    ⭐ {product.rating} / 5
                  </p>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
