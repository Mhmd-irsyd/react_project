import AppRoutes from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ Import CartProvider

const App = () => {
  return (
    <AuthProvider> 
      <CartProvider> {/* ✅ Bungkus dengan CartProvider */}
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
