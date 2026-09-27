import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { addWishlistItem, clearWishlistApi, getWishlist, removeWishlistItem } from "../services/wishlistService";

const WishlistContext = createContext();
const getProductId = (product) => String(product?.productId || product?.id || product?._id || "");

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    if (!user || !token) { setWishlistItems([]); return; }
    try {
      setLoading(true);
      setWishlistItems(await getWishlist());
    } catch (error) {
      console.error("Load wishlist error:", error);
      setWishlistItems([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadWishlist(); }, [user?.uid, token]);

  const toggleWishlist = async (product) => {
    if (!user || !token) return { success: false, requiresLogin: true };
    const productId = getProductId(product);
    if (!productId) return { success: false, message: "Invalid product." };
    try {
      const exists = wishlistItems.some((item) => getProductId(item) === productId);
      const data = exists ? await removeWishlistItem(productId) : await addWishlistItem(productId);
      setWishlistItems(data.wishlist || []);
      return { success: true, added: !exists, wishlist: data.wishlist || [] };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const removeFromWishlist = async (productId) => {
    try { const data = await removeWishlistItem(productId); setWishlistItems(data.wishlist || []); return data; }
    catch (error) { return { success: false, message: error.message }; }
  };

  const clearWishlist = async () => {
    try { const data = await clearWishlistApi(); setWishlistItems(data.wishlist || []); return data; }
    catch (error) { return { success: false, message: error.message }; }
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => getProductId(item) === String(productId));

  return <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist, clearWishlist, loading, refreshWishlist: loadWishlist }}>
    {children}
  </WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
