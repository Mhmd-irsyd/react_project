import { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../services/firebase"; // Pastikan sudah import db dari Firebase
import { collection, getDocs } from "firebase/firestore";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { FaUniversity, FaWallet, FaCcVisa } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const BuyNowPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const shippingFee = 10000;

  // Mengambil data dari CartPage menggunakan useLocation
  const location = useLocation();
  console.log(location.state?.selectedProducts); // Periksa data yang dikirimkan
  const cartItemsFromLocation = location.state?.cartItems || cartItems;

  console.log(cartItemsFromLocation); // Periksa apakah data benar diterima

  // Ambil data produk dari Firestore jika dibutuhkan
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: doc.data().price,
          stock: doc.data().stock,
          variations: doc.data().variations || [],
        }));
        setProducts(fetchedProducts);
        console.log(fetchedProducts); // Periksa produk yang diterima dari Firestore
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Format uang dalam IDR
  const formatCurrency = (amount) => `Rp${amount.toLocaleString("id-ID")}`;

  // Total pembayaran (harga total + biaya pengiriman)
  const totalPayment = useMemo(() => totalPrice + shippingFee, [totalPrice]);

  const handlePayment = () => {
    if (!address.trim() || address.length < 5) {
      setSuccessMessage("Mohon isi alamat pengiriman yang valid.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Transaksi berhasil dengan metode ${paymentMethod}!`);
    }, 2000);
  };

  // List metode pembayaran beserta ikon
  const paymentMethods = [
    { value: "cod", label: "Bayar di Tempat (COD)", icon: <BanknotesIcon className="h-6 w-6 text-gray-700" /> },
    { value: "mandiri", label: "Bank Mandiri", icon: <FaUniversity className="h-6 w-6 text-blue-600" /> },
    { value: "bca", label: "Bank BCA", icon: <FaUniversity className="h-6 w-6 text-blue-600" /> },
    { value: "dana", label: "Dana", icon: <FaWallet className="h-6 w-6 text-blue-400" /> },
    { value: "ovo", label: "OVO", icon: <FaWallet className="h-6 w-6 text-purple-500" /> },
    { value: "gopay", label: "GoPay", icon: <FaCcVisa className="h-6 w-6 text-blue-500" /> },
  ];

  // Ambil ikon sesuai metode pembayaran yang dipilih
  const selectedPayment = paymentMethods.find((method) => method.value === paymentMethod);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Check-Out</h2>

      {/* List Produk di Keranjang */}
      <div className="space-y-4">
        {cartItemsFromLocation.length > 0 ? (
          cartItemsFromLocation.map(({ id, quantity, size, variation }) => {
            const product = products.find((p) => p.id === id);
            const productVariation = product?.variations?.find((v) => v.color === variation);
            const selectedSize = productVariation?.sizes.find((s) => s.size === size);

            return (
              <div key={id} className="flex justify-between p-4 border rounded-lg bg-gray-50">
                <span className="text-gray-700">
                  {product?.name || "Produk tidak ditemukan"}
                  <span className="text-gray-500"> ({quantity}x)</span>
                  {size && <span className="text-gray-500"> - Ukuran: {size}</span>}
                  {variation && <span className="text-gray-500"> - Variasi: {variation}</span>}
                  <span className="text-gray-500"> - Stok: {product?.stock}</span>
                </span>
                <span className="font-semibold">{formatCurrency((product?.price || 0) * quantity)}</span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">Keranjang kosong.</p>
        )}
      </div>

      {/* Biaya Antar */}
      <div className="text-lg font-semibold flex justify-between border-t pt-4">
        <span>Biaya Antar:</span>
        <span className="text-blue-500">{formatCurrency(shippingFee)}</span>
      </div>

      {/* Total Pembayaran */}
      <div className="text-xl font-bold flex justify-between border-t pt-4">
        <span>Total Pembayaran:</span>
        <span className="text-red-500">{formatCurrency(totalPayment)}</span>
      </div>

      {/* Input Alamat */}
      <input
        type="text"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        placeholder="Masukkan alamat"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        aria-label="Alamat Pengiriman"
      />

      {/* Pilihan Metode Pembayaran */}
      <div className="relative w-full">
        <select
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Metode Pembayaran"
        >
          {paymentMethods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
        {/* Ikon metode pembayaran */}
        <div className="absolute right-3 top-3">{selectedPayment?.icon}</div>
      </div>

      {/* Tombol Proses Pesanan */}
      <button
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Memproses..." : "Proses Pesanan"}
      </button>

      {/* Pesan Berhasil */}
      {successMessage && <p className="text-center text-green-600 font-semibold mt-4">{successMessage}</p>}
    </div>
  );
};

export default BuyNowPage;
