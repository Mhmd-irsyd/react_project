import { useState } from "react";
import uploadToCloudinary from "../../services/uploadtocloudinarytemp";
import { useNavigate } from "react-router-dom";
import { addProductToFirestore } from "../../services/productservice";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    category: "",
    images: [],
    variations: [],
    rating: 0,
    reviews: 0,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [sizeStock, setSizeStock] = useState("");
  const [selectedColorSizes, setSelectedColorSizes] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) throw new Error("URL dari Cloudinary tidak tersedia.");
      setProduct((prev) => ({
        ...prev,
        images: [imageUrl],
      }));
    } catch (err) {
      console.error("Upload gagal:", err);
      alert("Gagal mengupload gambar.");
    } finally {
      setUploading(false);
    }
  };

  const addVariation = () => {
    if (product.category === "sepatu") {
      if (!color || selectedColorSizes.length === 0) return alert("Lengkapi warna dan ukuran");
      const newVariation = {
        color,
        sizes: selectedColorSizes,
      };
      setProduct((prev) => ({
        ...prev,
        variations: [...prev.variations, newVariation],
      }));
      setColor("");
      setSelectedColorSizes([]);
    } else {
      if (!color || !stock) return alert("Lengkapi warna dan stok");
      const newVariation = { color, stock: parseInt(stock, 10) };
      setProduct((prev) => ({
        ...prev,
        variations: [...prev.variations, newVariation],
      }));
      setColor("");
      setStock("");
    }
  };

  const addSize = () => {
    if (!size || !sizeStock) return;
    setSelectedColorSizes((prev) => [
      ...prev,
      { size: parseInt(size, 10), stock: parseInt(sizeStock, 10) },
    ]);
    setSize("");
    setSizeStock("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      name,
      shortDescription,
      fullDescription,
      price,
      category,
      images,
      variations,
    } = product;
  
    if (
      !name ||
      !shortDescription ||
      !fullDescription ||
      !price ||
      !category ||
      images.length === 0 ||
      variations.length === 0
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
  
    try {
      // Pastikan price dikirim sebagai string dengan format ribuan
      const formattedPrice = price.toString().trim().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
      const preparedProduct = {
        ...product,
        price: formattedPrice,
      };
  
      const id = await addProductToFirestore(preparedProduct);
      alert("Produk berhasil ditambahkan!");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Gagal menyimpan produk:", err);
      alert("Gagal menyimpan produk.");
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Tambah Produk Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="shortDescription"
          placeholder="Deskripsi Singkat"
          value={product.shortDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="fullDescription"
          placeholder="Deskripsi Lengkap"
          value={product.fullDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Harga"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Pilih Kategori</option>
          <option value="jam">Jam</option>
          <option value="sepatu">Sepatu</option>
          <option value="tas">Tas</option>
          <option value="elektronik">Elektronik</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <hr />
        <h2 className="text-lg font-semibold">Variasi Produk</h2>
        <input
          type="text"
          placeholder="Warna"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {product.category === "sepatu" ? (
          <>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Ukuran"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Stok"
                value={sizeStock}
                onChange={(e) => setSizeStock(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={addSize}
                className="bg-green-600 text-white px-4 rounded"
              >
                Tambah Ukuran
              </button>
            </div>
            {selectedColorSizes.length > 0 && (
              <ul className="text-sm list-disc ml-6">
                {selectedColorSizes.map((item, idx) => (
                  <li key={idx}>
                    Size {item.size} - Stok {item.stock}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <input
            type="number"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <button
          type="button"
          onClick={addVariation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Variasi
        </button>

        {product.variations.length > 0 && (
          <ul className="text-sm list-disc ml-6 mt-2">
            {product.variations.map((v, i) => (
              <li key={i}>
                {v.color}{" "}
                {v.sizes
                  ? v.sizes.map((s) => `| Size ${s.size}: ${s.stock} stok`).join(", ")
                  : `| Stok: ${v.stock}`}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {uploading ? "Mengunggah..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
