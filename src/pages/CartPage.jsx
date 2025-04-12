import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { updateCartItem, removeFromCart } from "../services/cartService";

// Helper format mata uang
const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center bg-white p-4 rounded-lg shadow-md"
    >
      <img
        src={item.images}
        alt={item.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{item.name}</h3>
        
        {/* Menampilkan pilihan warna dan ukuran */}
        <div className="mt-2 text-gray-700">
          <p><strong>Warna:</strong> {item.selectedColor}</p>
          <p><strong>Ukuran:</strong> {item.selectedSize}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-700">Jumlah:</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity === 1}
          >
            -
          </button>
          <span className="font-bold">{item.quantity}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <p className="text-md sm:text-lg text-blue-600 font-bold">
          {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRemove(item.id)}
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        <TrashIcon className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

const CartPage = () => {
  const { currentUser } = useAuth();
  const { cartItems, totalPrice, loading, setCartItems } = useCart(); // ✅ Ambil data dari CartContext
  const navigate = useNavigate();

  // 🔥 Hapus item dari keranjang
  const handleRemove = async (itemId) => {
    if (!currentUser) {
      Swal.fire("Gagal!", "Anda harus login untuk menghapus item.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Produk ini akan dihapus dari keranjang Anda!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await removeFromCart(currentUser.uid, itemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      Swal.fire("Dihapus!", "Produk telah dihapus dari keranjang.", "success");
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus produk.", "error");
    }
  };

  // 🔥 Update jumlah item
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (!currentUser) {
      Swal.fire("Gagal!", "Anda harus login untuk mengubah jumlah item.", "error");
      return;
    }
    if (newQuantity < 1) return; // ✅ Blokir jika kurang dari 1

    try {
      await updateCartItem(currentUser.uid, itemId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // 🔥 Proses checkout
  // Proses checkout
  const handleCheckout = () => {
    if (!currentUser) {
      Swal.fire("Login Dulu!", "Anda harus login sebelum checkout.", "warning");
      return;
    }
    if (cartItems.length === 0) {
      Swal.fire("Keranjang kosong!", "Tambahkan produk sebelum checkout.", "info");
      return;
    }
  
    // Kirim data ke halaman BuyNowPage
    navigate("/buy-now", {
      state: {
        cartItems, 
        totalPrice, 
        selectedProducts: cartItems.map(item => ({
          name: item.name,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price,
          quantity: item.quantity,
        }))
      }
    });
  };
  

  return (
    <section className="pt-28 md:pt-32 pb-16 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center"
        >
          Keranjang Belanja
        </motion.h2>

        {loading ? (
          <p className="text-center mt-6 text-gray-600">Memuat...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center mt-6 text-gray-600">Keranjang Anda kosong.</p>
        ) : (
          <>
            <div className="mt-8 space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                Total: <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
              </p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleCheckout}
                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition ${cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                disabled={cartItems.length === 0} // ✅ Tombol dinonaktifkan jika keranjang kosong
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
