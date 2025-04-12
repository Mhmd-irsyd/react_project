import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import {
  deleteProductFromFirestore,
} from "../../services/productservice";
import { db } from "../../services/firebase";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchProducts();

    // Bersihkan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  const fetchProducts = () => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(products); // Update state dengan data terbaru
    });

    // Kembalikan fungsi unsubscribe agar bisa dibersihkan saat komponen unmount
    return unsubscribe;
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      await deleteProductFromFirestore(productId);
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
    }
  };

  const calculateTotalStock = (product) => {
    if (!Array.isArray(product.variations)) return 0;

    return product.variations.reduce((total, variation) => {
      if (Array.isArray(variation.sizes)) {
        return (
          total + variation.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
        );
      }
      return total + (variation.stock || 0);
    }, 0);
  };

  const getVariationSummary = (product) => {
    if (!Array.isArray(product.variations)) return "-";

    const colors = new Set();
    const sizes = new Set();

    product.variations.forEach((variation) => {
      if (variation.color) colors.add(variation.color);
      if (Array.isArray(variation.sizes)) {
        variation.sizes.forEach((s) => {
          if (s.size) sizes.add(s.size);
        });
      }
    });

    const colorText = colors.size > 0 ? `🎨 ${[...colors].join(", ")}` : "";
    const sizeText = sizes.size > 0 ? `📏 ${[...sizes].join(", ")}` : "";

    return [colorText, sizeText].filter(Boolean).join(" | ");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Daftar Produk</h1>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Tambah Produk
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Gambar</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Variasi</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Review</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Tidak ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="p-2 border">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">Rp{product.price}</td>
                  <td className="p-2 border">{calculateTotalStock(product)}</td>
                  <td className="p-2 border">{getVariationSummary(product)}</td>
                  <td className="p-2 border capitalize">{product.category}</td>
                  <td className="p-2 border">⭐ {product.rating ?? 0}</td>
                  <td className="p-2 border">{product.reviews ?? 0}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
