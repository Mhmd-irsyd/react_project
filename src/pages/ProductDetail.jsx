import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Swal from "sweetalert2";
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon, 
  MinusIcon, 
  PlusIcon 
} from "@heroicons/react/24/solid";

import { useAuth } from "../context/AuthContext";
import { addToCart } from "../services/cartService";
import { getAllProductsFromFirestore, updateProductStock } from "../services/productservice"; // Pastikan updateProductStock diimport

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [stock, setStock] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fungsi untuk memperbarui stok produk di Firestore
  const updateProductStockInFirestore = async (productId) => {
    try {
      await updateProductStock(productId, selectedColor, selectedSize, quantity); // Gunakan fungsi updateProductStock dari productservice
      console.log("✅ Stok produk berhasil diperbarui di Firestore.");
    } catch (error) {
      console.error("❌ Gagal memperbarui stok produk di Firestore:", error);
    }
  };

  // Fungsi untuk format angka dengan pemisah ribuan
  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchProduct = async () => {
      try {
        // Ambil semua produk dari Firestore
        const allProducts = await getAllProductsFromFirestore();

        // Cek apakah produk ditemukan
        if (allProducts && Array.isArray(allProducts) && allProducts.length > 0) {
          // Cari produk yang sesuai dengan id
          const foundProduct = allProducts.find((item) => item.id === id);

          // Format harga sebelum diset
          if (foundProduct) {
            foundProduct.formattedPrice = formatNumber(parseFloat(foundProduct.price.replace(/[^\d.-]/g, '')));
            // Atur variasi ukuran dan warna
            setAvailableSizes(foundProduct.variations.map((variant) => variant.size));
          }
          
          // Set produk yang ditemukan atau null jika tidak ada
          setProduct(foundProduct || null);
        } else {
          console.error("Tidak ada produk yang ditemukan di Firestore.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  // Ketika warna dipilih, perbarui ukuran dan stok, baris 65-83
  useEffect(() => {
    if (product?.variations && selectedColor) {
      const colorVariant = product.variations.find(
        (variant) => variant.color === selectedColor
      );
  
      if (colorVariant) {
        if (colorVariant.sizes) {
          setAvailableSizes(colorVariant.sizes); // Set available sizes if sizes exist
          setSelectedSize(null); // Reset size when color is changed
          setStock(0); // Reset stock for sizes
        } else {
          setAvailableSizes([]); // No sizes available
          setStock(colorVariant.stock || 0); // Set stock based on the color variant
        }
  
        // Update stok di Firestore setiap kali warna dipilih
        updateProductStockInFirestore(product.id, colorVariant);
      }
    }
  }, [selectedColor, product]);
  


  // Update stok berdasarkan ukuran yang dipilih
  useEffect(() => {
    if (availableSizes.length > 0 && selectedSize) {
      const sizeVariant = availableSizes.find((size) => size.size === selectedSize);
      setStock(sizeVariant ? sizeVariant.stock : 0);
  
      // Update stok di Firestore jika ukuran dipilih
      updateProductStockInFirestore(product.id, sizeVariant);
    }
  }, [selectedSize, availableSizes]);
  


  // Fungsi untuk menambahkan produk ke keranjang dan Firestore, baris 96-184
  const handleAddToCart = async () => {
    // Cek apakah user sudah login
    if (!currentUser) {
      Swal.fire({
        title: "Perhatian!",
        text: "Silakan login terlebih dahulu.",
        icon: "warning",
      });
      return navigate("/login");
    }
  
    // Cek apakah warna sudah dipilih
    if (!selectedColor) {
      Swal.fire({
        title: "Pilih Warna",
        text: "Silakan pilih warna terlebih dahulu.",
        icon: "warning",
      });
      return;
    }
  
    // Cek apakah ukuran sudah dipilih jika tersedia
    if (availableSizes.length > 0 && !selectedSize) {
      Swal.fire({
        title: "Pilih Ukuran",
        text: "Silakan pilih ukuran terlebih dahulu.",
        icon: "warning",
      });
      return;
    }
  
    // Cek apakah jumlah yang dipilih tidak melebihi stok
    if (quantity > stock) {
      Swal.fire({
        title: "Stok Tidak Cukup",
        text: "Jumlah yang Anda pilih melebihi stok yang tersedia.",
        icon: "error",
      });
      return;
    }
  
    try {
      let selectedVariationPrice = 0;
      let selectedVariationStock = 0;
  
      const selectedVariation = product?.variations?.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize
      );
  
      if (selectedVariation) {
        selectedVariationPrice = parseFloat(
          selectedVariation.price.replace(/[^\d.-]/g, '')
        );
        selectedVariationStock = selectedVariation.stock;
      } else {
        selectedVariationPrice = parseFloat(
          product.price.replace(/[^\d.-]/g, '')
        );
        selectedVariationStock = product.stock;
      }
  
      // Validasi stok setelah memilih variasi
      if (quantity > selectedVariationStock) {
        Swal.fire({
          title: "Stok Tidak Cukup",
          text: "Jumlah yang Anda pilih melebihi stok yang tersedia.",
          icon: "error",
        });
        return;
      }
  
      // Menambahkan produk ke keranjang
      await addToCart(currentUser.uid, {
        ...product,
        price: selectedVariationPrice,
        selectedColor,
        selectedSize,
        quantity,
      });
  
      // Update stok produk di Firestore setelah ditambahkan ke keranjang
      const updatedProduct = {
        ...product,
        variations: product.variations.map((variant) => {
          if (variant.color === selectedColor && variant.size === selectedSize) {
            return {
              ...variant,
              stock: variant.stock - quantity // Update stok variasi yang dipilih
            };
          }
          return variant;
        }),
      };
  
      await updateProductStock(product.id, selectedColor, selectedSize, quantity);

// Update state produk dengan stok terbaru
setProduct(updatedProduct); // Pastikan produk UI di-update sesuai stok terbaru

  
      // Tampilkan pesan sukses
      Swal.fire({
        title: "Berhasil!",
        text: `${product.name} telah ditambahkan ke keranjang.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan ke keranjang.",
        icon: "error",
      });
    }
  };
  
  
  


  // Fungsi untuk memilih warna
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset ukuran saat warna berubah
    setStock(0); // Reset stok jika warna berubah
  };

  // Fungsi untuk memilih ukuran
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Cari varian produk berdasarkan warna yang dipilih
  const selectedVariation = product?.variations?.find(
    (variant) => variant.color === selectedColor
  );

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    console.log(`Produk ${isLiked ? "tidak disukai" : "disukai"}`);
  };


  // Fungsi untuk menangani pembelian langsung (Buy Now)
  const handleBuyNow = async () => {
    if (!currentUser) {
      Swal.fire({
        title: "Perhatian!",
        text: "Silakan login terlebih dahulu.",
        icon: "warning",
      });
      return navigate("/login");
    }
  
    if (!selectedColor) {
      Swal.fire({
        title: "Pilih Warna",
        text: "Silakan pilih warna terlebih dahulu.",
        icon: "warning",
      });
      return;
    }
  
    if (availableSizes.length > 0 && !selectedSize) {
      Swal.fire({
        title: "Pilih Ukuran",
        text: "Silakan pilih ukuran terlebih dahulu.",
        icon: "warning",
      });
      return;
    }
  
    if (quantity > stock) {
      Swal.fire({
        title: "Stok Tidak Cukup",
        text: "Jumlah yang Anda pilih melebihi stok yang tersedia.",
        icon: "error",
      });
      return;
    }
  
    try {
      // Menambahkan produk ke keranjang sebelum melakukan pembelian
      await addToCart(currentUser.uid, { ...product, selectedColor, selectedSize, quantity });
  
      // Mengarahkan pengguna ke halaman keranjang setelah berhasil menambahkan produk
      navigate("/cart");
  
      // Update stok produk setelah pembelian
      const updatedProduct = {
        ...product,
        variations: product.variations.map((variant) => {
          if (variant.color === selectedColor) {
            if (variant.sizes) {
              return {
                ...variant,
                sizes: variant.sizes.map((size) =>
                  size.size === selectedSize
                    ? { ...size, stock: size.stock - quantity }
                    : size
                ),
              };
            } else {
              return { ...variant, stock: variant.stock - quantity };
            }
          }
          return variant;
        }),
      };
  
      // Memperbarui stok produk di Firestore
      updateProductStockInFirestore(product.id, updatedProduct.variations);
  
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memproses pembelian.",
        icon: "error",
      });
    }
  };
  


  // Menampilkan loading jika data produk sedang diambil
  if (isLoading) {
    return <div className="text-center text-gray-600 text-xl py-20">Loading...</div>;
  }

  // Menampilkan pesan jika produk tidak ditemukan
  if (!product) {
    return (
      <div className="text-center text-gray-600 text-xl py-20">
        Produk Tidak Ditemukan
      </div>
    );
  }

  // Pengaturan slider produk
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };


  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    {/* Gambar Produk */}
    <Slider {...settings} className="rounded-lg overflow-hidden shadow-md">
      {product.images?.map((img, index) => (
        <div key={index}>
          <img
            src={img}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>
      ))}
    </Slider>

    {/* Detail Produk */}
    <div className="relative">
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      <HeartIcon
        className={`absolute right-0 top-0 w-7 h-7 cursor-pointer transition-all ${isLiked ? "text-red-500" : "text-gray-400"}`}
        onClick={toggleLike}
      />

      <div className="flex items-center mt-2">
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <span className="text-gray-600 ml-2 text-lg">
          {parseFloat(product.rating).toFixed(1)} | {product.reviews} Ulasan
        </span>
      </div>

      <p className="text-4xl font-semibold text-blue-600 mt-4">
        Rp{" "}
        {product?.price
          ? parseFloat(product.price.replace(/[^\d.-]/g, "")) // Menghapus simbol selain angka dan titik
              .toLocaleString("id-ID") // Format angka dengan pemisah ribuan
          : "Harga tidak tersedia"}
      </p>

      <p className="text-gray-700 mt-4">
        {product.shortDescription
          ? product.shortDescription.substring(0, 100) + "..."
          : "Deskripsi tidak tersedia."}
      </p>
  
          {/* Pilih Warna */}
          <div className="mt-6">
            <p className="text-lg font-semibold">Pilih Warna:</p>
            <div className="flex gap-3 mt-2">
              {product.variations.map((variation, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-md ${
                    selectedColor === variation.color
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleColorSelect(variation.color)}
                >
                  {variation.color}
                </button>
              ))}
            </div>
          </div>
  
          {selectedColor && (
            <div className="mt-4">
              <p className="text-lg font-semibold">Pilih Ukuran:</p>
  
              {/* Jika produk memiliki variasi ukuran */}
              {selectedVariation?.sizes ? (
                <div className="flex gap-3 mt-2">
                  {selectedVariation.sizes.map((sizeObj, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === sizeObj.size
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSizeSelect(sizeObj.size)}
                      disabled={sizeObj.stock === 0} // Tidak bisa dipilih jika stok habis
                    >
                      {sizeObj.size} ({sizeObj.stock} stok)
                    </button>
                  ))}
                </div>
              ) : (
                // Jika produk tidak memiliki ukuran, langsung tampilkan stok
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  Stok tersedia:{" "}
                  <span className="font-semibold">{selectedVariation.stock}</span>
                </p>
              )}
  
              {/* Menampilkan stok setelah ukuran dipilih */}
              {selectedSize && selectedVariation?.sizes && (
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  Stok tersedia:{" "}
                  <span className="font-semibold">
                    {
                      selectedVariation.sizes.find(
                        (sizeObj) => sizeObj.size === selectedSize
                      )?.stock || 0
                    }
                  </span>
                </p>
              )}
            </div>
          )}
  
          {/* Jumlah & Tambah ke Keranjang */}
          {selectedColor && (!selectedVariation.sizes || selectedSize) && (
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">Jumlah:</p>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-200 hover:bg-gray-300"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="px-4 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 bg-gray-200 hover:bg-gray-300"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
  
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Tambah ke Keranjang
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Detail Produk & Ulasan */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
        <p className="text-gray-700 mt-2">{product.fullDescription || "Tidak ada deskripsi."}</p>
  
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">Ulasan Pelanggan</h2>
          <p className="text-gray-500 mt-2">Segera hadir...</p>
        </div>
  
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">Produk Terkait</h2>
          <p className="text-gray-500 mt-2">Segera hadir...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
