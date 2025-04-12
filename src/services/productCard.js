import { useAuth } from "../context/AuthContext"; 
import { addToCart } from "./cartService"; 

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth();

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    await addToCart(currentUser.uid, product);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-500">Rp {product.price.toLocaleString()}</p>
      <button onClick={handleAddToCart} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
