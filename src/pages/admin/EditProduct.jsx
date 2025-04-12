import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.error("Product not found!");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleVariationChange = (e, index) => {
    const updatedVariations = [...product.variations];
    const value =
      e.target.name === "stock" ? parseInt(e.target.value) || 0 : e.target.value;
    updatedVariations[index][e.target.name] = value;
    setProduct({ ...product, variations: updatedVariations });
  };

  const handleSizeChange = (e, variationIndex, sizeIndex) => {
    const updatedVariations = [...product.variations];
    const value =
      e.target.name === "stock" ? parseInt(e.target.value) || 0 : e.target.value;
    updatedVariations[variationIndex].sizes[sizeIndex][e.target.name] = value;
    setProduct({ ...product, variations: updatedVariations });
  };

  const handleAddVariation = () => {
    const newVariation = { color: "", stock: 0 };
    setProduct({
      ...product,
      variations: [...(product.variations || []), newVariation],
    });
  };

  const handleAddSize = (variationIndex) => {
    const updatedVariations = [...product.variations];
    if (!updatedVariations[variationIndex].sizes) {
      updatedVariations[variationIndex].sizes = [];
      delete updatedVariations[variationIndex].stock;
    }
    updatedVariations[variationIndex].sizes.push({ size: "", stock: 0 });
    setProduct({ ...product, variations: updatedVariations });
  };

  const handleRemoveVariation = (index) => {
    const updatedVariations = [...product.variations];
    updatedVariations.splice(index, 1);
    setProduct({ ...product, variations: updatedVariations });
  };

  const handleRemoveSize = (variationIndex, sizeIndex) => {
    const updatedVariations = [...product.variations];
    updatedVariations[variationIndex].sizes.splice(sizeIndex, 1);

    if (updatedVariations[variationIndex].sizes.length === 0) {
      delete updatedVariations[variationIndex].sizes;
      updatedVariations[variationIndex].stock = 0;
    }

    setProduct({ ...product, variations: updatedVariations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "products", id);
    try {
      await updateDoc(docRef, {
        ...product,
        updatedAt: new Date(),
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (!product) return <div className="text-center text-xl">Loading...</div>;


  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Product</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-lg font-medium">Nama Produk:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="shortDescription" className="block text-lg font-medium">Deskripsi Pendek:</label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={product.shortDescription}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="fullDescription" className="block text-lg font-medium">Deskripsi Lengkap:</label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          value={product.fullDescription}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-lg font-medium">Harga:</label>
        <input
          id="price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={handleAddVariation}
          className="px-4 py-2 mb-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Tambah Variasi
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium">Variasi (Warna):</label>
        {product.variations?.map((variation, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-md">Warna:</label>
                <input
                  type="text"
                  name="color"
                  value={variation.color}
                  onChange={(e) => handleVariationChange(e, index)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {!variation.sizes && (
                <div className="w-1/2">
                  <label className="block text-md">Stok:</label>
                  <input
                    type="number"
                    name="stock"
                    value={variation.stock}
                    onChange={(e) => handleVariationChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>

            {variation.sizes?.map((size, sizeIndex) => (
              <div key={sizeIndex} className="flex justify-between gap-4 mb-2 items-end">
                <div className="w-1/2">
                  <label className="block text-md">Ukuran:</label>
                  <input
                    type="text"
                    name="size"
                    value={size.size}
                    onChange={(e) => handleSizeChange(e, index, sizeIndex)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-md">Stok:</label>
                  <input
                    type="number"
                    name="stock"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(e, index, sizeIndex)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index, sizeIndex)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Hapus Ukuran
                </button>
              </div>
            ))}

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleAddSize(index)}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Tambah Ukuran
              </button>
              <button
                type="button"
                onClick={() => handleRemoveVariation(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Hapus Variasi
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
        >
          Update Product
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
