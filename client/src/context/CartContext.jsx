import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { addCartItem, clearCartApi, getCart, removeCartItem, updateCartItem } from "../services/cartService";

const CartContext = createContext();
const getProductId = (product) => String(product?.productId || product?.id || product?._id || "");

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user || !token) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      setCartItems(await getCart());
    } catch (error) {
      console.error("Load cart error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [user?.uid, token]);

  const addToCart = async (product, quantity = 1) => {
    if (!user || !token) return { success: false, requiresLogin: true };
    const productId = getProductId(product);
    if (!productId) return { success: false, message: "Invalid product." };
    try {
      const data = await addCartItem(productId, quantity);
      setCartItems(data.cart || []);
      return { success: true, cart: data.cart || [], message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await removeCartItem(productId);
      setCartItems(data.cart || []);
      return data;
    } catch (error) { return { success: false, message: error.message }; }
  };

  const increaseQuantity = async (productId) => {
    const item = cartItems.find((x) => getProductId(x) === String(productId));
    if (!item) return;
    try {
      const data = await updateCartItem(productId, Number(item.quantity || 1) + 1);
      setCartItems(data.cart || []);
    } catch (error) { console.error("Increase cart error:", error); }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((x) => getProductId(x) === String(productId));
    if (!item) return;
    const quantity = Number(item.quantity || 1) - 1;
    try {
      if (quantity <= 0) {
        const data = await removeCartItem(productId);
        setCartItems(data.cart || []);
      } else {
        const data = await updateCartItem(productId, quantity);
        setCartItems(data.cart || []);
      }
    } catch (error) { console.error("Decrease cart error:", error); }
  };

  const clearCart = async () => {
    if (!user || !token) { setCartItems([]); return; }
    try {
      const data = await clearCartApi();
      setCartItems(data.cart || []);
    } catch (error) { console.error("Clear cart error:", error); }
  };

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0), [cartItems]);
  const totalAmount = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [cartItems]);

  return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, totalItems, totalAmount, loading, refreshCart: loadCart }}>
    {children}
  </CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
export default CartContext;
