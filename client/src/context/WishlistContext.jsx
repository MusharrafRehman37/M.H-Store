
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const getProductId = (product) =>
  String(product?.id || product?._id || "");

const getWishlistStorageKey = (
  user
) => {
  if (!user) return null;

  const userId =
    user.id ||
    user._id ||
    user.uid ||
    user.email;

  return userId
    ? `wishlist_${String(userId)}`
    : null;
};

const readWishlist = (user) => {
  const key =
    getWishlistStorageKey(user);

  if (!key) {
    return [];
  }

  try {
    const savedWishlist =
      localStorage.getItem(key);

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];
  } catch (error) {
    console.error(
      "Error reading wishlist:",
      error
    );

    return [];
  }
};

export const WishlistProvider = ({
  children,
}) => {
  const { user } = useAuth();

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState(() =>
    readWishlist(user)
  );

  // ==========================================
  // LOAD USER WISHLIST
  // ==========================================

  useEffect(() => {
    setWishlistItems(
      readWishlist(user)
    );
  }, [
    user?.id,
    user?._id,
    user?.uid,
    user?.email,
  ]);

  // ==========================================
  // SAVE USER WISHLIST
  // ==========================================

  useEffect(() => {
    const key =
      getWishlistStorageKey(user);

    if (!key) {
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, user]);

  // ==========================================
  // ADD / REMOVE WISHLIST
  // ==========================================

  const toggleWishlist = (
    product
  ) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    const productId =
      getProductId(product);

    if (!productId) {
      return {
        success: false,
        message: "Invalid product.",
      };
    }

    let added = false;

    setWishlistItems(
      (currentItems) => {
        const exists =
          currentItems.some(
            (item) =>
              getProductId(item) ===
              productId
          );

        if (exists) {
          return currentItems.filter(
            (item) =>
              getProductId(item) !==
              productId
          );
        }

        added = true;

        return [
          ...currentItems,
          product,
        ];
      }
    );

    return {
      success: true,
      added,
    };
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromWishlist = (
    productId
  ) => {
    setWishlistItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            getProductId(item) !==
            String(productId)
        )
    );
  };

  // ==========================================
  // CHECK WISHLIST
  // ==========================================

  const isInWishlist = (
    productId
  ) => {
    if (!user) {
      return false;
    }

    return wishlistItems.some(
      (item) =>
        getProductId(item) ===
        String(productId)
    );
  };

  // ==========================================
  // CLEAR WISHLIST
  // ==========================================

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export default WishlistContext;

