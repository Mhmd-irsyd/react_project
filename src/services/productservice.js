import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,  // Jangan lupa import updateDoc untuk pembaruan data
} from "firebase/firestore";
import { db } from "./firebase";

// 🔹 Menambahkan produk ke Firestore
export const addProductToFirestore = async (product) => {
  try {
    if (!product.name || !product.price) {
      throw new Error("Nama produk dan harga wajib diisi");
    }

    const cleanedProduct = {};
    Object.keys(product).forEach((key) => {
      if (product[key] !== undefined && product[key] !== null) {
        cleanedProduct[key] = product[key];
      }
    });

    const docRef = await addDoc(collection(db, "products"), {
      ...cleanedProduct,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Produk berhasil ditambahkan:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Gagal menambahkan produk ke Firestore:", error);
    throw error;
  }
};

// 🔹 Mengambil semua produk dari Firestore
export const getAllProductsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs ? querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) : [];

    console.log("✅ Produk berhasil diambil:", products.length);
    return products;
  } catch (error) {
    console.error("❌ Gagal mengambil data produk:", error);
    throw error;
  }
};

// 🔹 Menghapus produk dari Firestore
export const deleteProductFromFirestore = async (productId) => {
  try {
    if (!productId) throw new Error("ID produk tidak valid");

    await deleteDoc(doc(db, "products", productId));
    console.log("🗑️ Produk berhasil dihapus:", productId);
  } catch (error) {
    console.error("❌ Gagal menghapus produk:", error);
    throw error;
  }
};

// 🔹 Mengambil satu produk berdasarkan ID
export const getProductByIdFromFirestore = async (productId) => {
  try {
    if (!productId) throw new Error("ID produk tidak valid");

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      console.log("✅ Produk ditemukan:", productSnap.data());
      return { id: productSnap.id, ...productSnap.data() };
    } else {
      throw new Error("Produk tidak ditemukan");
    }
  } catch (error) {
    console.error("❌ Gagal mengambil detail produk:", error);
    throw error;
  }
};

// 🔹 Update stok produk setelah pembelian
export const updateProductStock = async (productId, selectedColor, selectedSize, quantity) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      throw new Error("Produk tidak ditemukan!");
    }

    const productData = productSnapshot.data();
    console.log("Produk ditemukan:", productData);

    // Pastikan variations itu array
    if (!Array.isArray(productData.variations)) {
      throw new Error("Variasi produk tidak ditemukan atau tidak valid.");
    }

    // Tambahkan log untuk memeriksa struktur variations
    console.log("Variasi produk:", productData.variations);

    let stokCukup = false;
    let foundVariant = false;

    // Pastikan selectedSize adalah angka
    const size = typeof selectedSize === 'string' ? Number(selectedSize) : selectedSize;  // Konversi menjadi angka jika string
    console.log("Ukuran yang dipilih:", size);  // Menambahkan log untuk memverifikasi ukuran

    const updatedVariations = productData.variations.map((variant) => {
      console.log(`Memeriksa variasi: Warna: ${variant.color}`);

      // Pastikan warna cocok
      if (variant.color === selectedColor) {
        // Cari ukuran dalam array sizes
        const sizeVariant = variant.sizes.find((sizeObj) => sizeObj.size === size);
        
        console.log(`Mencari ukuran ${size}:`, sizeVariant);  // Log untuk melihat hasil pencarian ukuran

        if (sizeVariant) {
          console.log(`Ukuran ditemukan: ${sizeVariant.size}, Stok: ${sizeVariant.stock}`);

          const newStock = sizeVariant.stock - quantity;

          if (newStock < 0) {
            throw new Error("Stok tidak cukup untuk variasi yang dipilih.");
          }

          stokCukup = true;
          // Update stok ukuran dalam variasi
          const updatedSizes = variant.sizes.map((sizeObj) => {
            if (sizeObj.size === size) {
              return { ...sizeObj, stock: newStock };
            }
            return sizeObj;
          });

          return { ...variant, sizes: updatedSizes };
        }
      }
      return variant;
    });

    // Jika variasi yang dicari tidak ditemukan
    if (!stokCukup) {
      throw new Error(`Variasi warna: ${selectedColor} dan ukuran: ${size} tidak ditemukan.`);
    }

    // Jika stok cukup, update data produk
    await updateDoc(productRef, {
      variations: updatedVariations,
    });
    console.log("✅ Stok produk berhasil diperbarui!");
    return { id: productId, variations: updatedVariations };

  } catch (error) {
    console.error("❌ Gagal memperbarui stok produk:", error.message);
    throw error;
  }
};
