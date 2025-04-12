import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, runTransaction } from "firebase/firestore";

// ✅ Tambah produk ke keranjang
export const addToCart = async (userId, product) => {
  if (!userId) {
    alert("You must be logged in to add items to the cart.");
    return;
  }

  const cartRef = doc(db, "carts", userId);

  try {
    await runTransaction(db, async (transaction) => {
      const cartSnap = await transaction.get(cartRef);
      let updatedItems = [];

      if (!cartSnap.exists()) {
        updatedItems = [{ ...product, quantity: product.quantity || 1 }];
      } else {
        const cartData = cartSnap.data();
        const existingItemIndex = cartData.items.findIndex((item) => item.id === product.id);

        if (existingItemIndex !== -1) {
          // ✅ Jika produk sudah ada, update quantity
          updatedItems = [...cartData.items];
          updatedItems[existingItemIndex].quantity += product.quantity || 1;
        } else {
          // ✅ Jika produk belum ada, tambahkan
          updatedItems = [...cartData.items, { ...product, quantity: product.quantity || 1 }];
        }
      }

      console.log("🛒 Updated Cart Items:", updatedItems);
      transaction.set(cartRef, { items: updatedItems }, { merge: true });
    });

    console.log("✅ Successfully added to cart!");
  } catch (error) {
    console.error("🔥 Error adding to cart:", error);
  }
};

// ✅ Ambil produk di keranjang
export const getCartItems = async (userId) => {
  if (!userId) return [];
  
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    const items = cartSnap.exists() ? cartSnap.data().items || [] : [];
    console.log("🛍 Cart items fetched:", items);
    return items;
  } catch (error) {
    console.error("🔥 Error fetching cart items:", error);
    return [];
  }
};

// ✅ Update quantity produk di cart
export const updateCartItem = async (userId, productId, newQuantity) => {
  if (!userId) return;

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) return;

    const updatedItems = cartSnap.data().items.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    console.log("🔄 Updated cart after quantity change:", updatedItems);
    await updateDoc(cartRef, { items: updatedItems });
  } catch (error) {
    console.error("🔥 Error updating cart item:", error);
  }
};

// ✅ Hapus produk dari keranjang (DIPERBAIKI)
export const removeFromCart = async (userId, productId) => {
  if (!userId) {
    console.error("❌ userId tidak tersedia saat menghapus item!");
    return;
  }

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) {
      console.warn("⚠️ Cart tidak ditemukan!");
      return;
    }

    const cartData = cartSnap.data();
    if (!cartData.items || cartData.items.length === 0) {
      console.warn("⚠️ Tidak ada item di cart!");
      return;
    }

    const updatedItems = cartData.items.filter((item) => item.id !== productId);

    console.log(`🗑 Menghapus item dengan ID: ${productId}`);

    if (updatedItems.length === 0) {
      // Jika cart kosong setelah penghapusan, hapus dokumen untuk menghemat ruang di Firestore
      await setDoc(cartRef, { items: [] });
      console.log("🛒 Cart kosong, menghapus dari Firestore.");
    } else {
      await updateDoc(cartRef, { items: updatedItems });
      console.log("✅ Item berhasil dihapus dari cart!");
    }
  } catch (error) {
    console.error("🔥 Error removing item from cart:", error);
  }
};

// ✅ "Beli Sekarang" -> Tambah produk ke cart & redirect ke "/cart"
export const buyNow = async (userId, product, navigate, setCart) => {
  if (!userId) {
    alert("You must be logged in to proceed.");
    navigate("/login");
    return;
  }

  try {
    // Optimistic UI update (langsung update UI sebelum data ke Firestore)
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      let newCart;

      if (existingItemIndex !== -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += product.quantity || 1;
      } else {
        newCart = [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }

      return newCart;
    });

    console.log("🛍 Menambahkan produk ke cart:", product);
    await addToCart(userId, product);
    navigate("/cart"); // ✅ Redirect ke cart setelah sukses
  } catch (error) {
    console.error("🔥 Error processing buy now:", error);
  }
};
