import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile, createUserProfile } from "../services/userService";
import { useAuth } from "./AuthContext";
import { db } from "../services/firebase";
import { doc, onSnapshot, runTransaction, setDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      resetCart();
      return;
    }

    setLoading(true);
    const cartRef = doc(db, "carts", currentUser.uid);

    const unsubscribe = onSnapshot(
      cartRef,
      async (snapshot) => {
        try {
          if (!snapshot.exists()) {
            const userData = await getUserProfile(currentUser.uid);
            if (!userData) {
              console.log("User belum terdaftar, membuat profil baru...");
              await createUserProfile(currentUser.uid, { email: currentUser.email });
            }
            resetCart();
            return;
          }

          const items = snapshot.data().items || [];
          updateCartState(items);
        } catch (error) {
          console.error("🔥 Error in CartContext:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("🔥 Error fetching cart data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // ✅ Tambah produk ke cart
  const addToCart = async (product) => {
    if (!currentUser) return;

    const cartRef = doc(db, "carts", currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const cartSnap = await transaction.get(cartRef);
        let updatedItems = [];

        if (!cartSnap.exists()) {
          updatedItems = [{ ...product, quantity: 1 }];
        } else {
          const cartData = cartSnap.data();
          const existingItemIndex = cartData.items.findIndex((item) => item.id === product.id);

          if (existingItemIndex !== -1) {
            updatedItems = [...cartData.items];
            updatedItems[existingItemIndex].quantity += 1;
          } else {
            updatedItems = [...cartData.items, { ...product, quantity: 1 }];
          }
        }

        transaction.set(cartRef, { items: updatedItems }, { merge: true });
      });

      console.log("✅ Produk ditambahkan ke keranjang!");
    } catch (error) {
      console.error("🔥 Error adding to cart:", error);
    }
  };

  // ✅ Hapus item dari cart
  const removeFromCart = async (itemId) => {
    if (!currentUser) return;

    const cartRef = doc(db, "carts", currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const cartSnap = await transaction.get(cartRef);
        if (!cartSnap.exists()) return;

        const cartData = cartSnap.data();
        const updatedItems = cartData.items.filter((item) => item.id !== itemId);

        transaction.set(cartRef, { items: updatedItems }, { merge: true });
      });

      console.log("🗑️ Produk dihapus dari keranjang");
    } catch (error) {
      console.error("🔥 Error removing item:", error);
    }
  };

  // ✅ Update jumlah item di cart
  const updateCartItem = async (itemId, newQuantity) => {
    if (!currentUser || newQuantity < 1) return;

    const cartRef = doc(db, "carts", currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const cartSnap = await transaction.get(cartRef);
        if (!cartSnap.exists()) return;

        const cartData = cartSnap.data();
        const updatedItems = cartData.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        transaction.set(cartRef, { items: updatedItems }, { merge: true });
      });

      console.log("🔄 Jumlah produk diperbarui");
    } catch (error) {
      console.error("🔥 Error updating item quantity:", error);
    }
  };

  // ✅ Reset Cart ke State Kosong
  const resetCart = () => {
    setCartItems([]);
    setCartCount(0);
    setTotalPrice(0);
    setLoading(false);
  };

  // ✅ Update State Cart secara Reaktif
  const updateCartState = (items) => {
    setCartItems(items);
    setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, totalPrice, loading, setCartItems, addToCart, removeFromCart, updateCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
