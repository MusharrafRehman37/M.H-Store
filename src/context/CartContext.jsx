
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const getProductId = (product) =>
  String(product?.id || product?._id || "");

const getCartStorageKey = (user) => {
  if (!user) return null;

  const userId =
    user.id ||
    user._id ||
    user.uid ||
    user.email;

  return userId
    ? `cart_${String(userId)}`
    : null;
};

const readCart = (user) => {
  const key = getCartStorageKey(user);

  if (!key) {
    return [];
  }

  try {
    const savedCart =
      localStorage.getItem(key);

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  } catch (error) {
    console.error(
      "Error reading cart:",
      error
    );

    return [];
  }
};

export const CartProvider = ({
  children,
}) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] =
    useState(() => readCart(user));

  // ==========================================
  // LOAD CART WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    setCartItems(readCart(user));
  }, [
    user?.id,
    user?._id,
    user?.uid,
    user?.email,
  ]);

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    const key = getCartStorageKey(user);

    if (!key) {
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(cartItems)
    );
  }, [cartItems, user]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
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

    setCartItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            getProductId(item) ===
            productId
        );

      if (existingItem) {
        return currentItems.map(
          (item) =>
            getProductId(item) ===
            productId
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity || 1
                    ) + 1,
                }
              : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    return {
      success: true,
    };
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = (
    productId
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          getProductId(item) !==
          String(productId)
      )
    );
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (
    productId
  ) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        getProductId(item) ===
        String(productId)
          ? {
              ...item,
              quantity:
                Number(
                  item.quantity || 1
                ) + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (
    productId
  ) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          getProductId(item) ===
          String(productId)
            ? {
                ...item,
                quantity:
                  Number(
                    item.quantity || 1
                  ) - 1,
              }
            : item
        )
        .filter(
          (item) =>
            Number(item.quantity || 0) >
            0
        )
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  // ==========================================
  // TOTAL AMOUNT
  // ==========================================

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

export default CartContext;

