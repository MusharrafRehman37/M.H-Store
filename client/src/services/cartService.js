import api from "./api";

export const getCart = async () => {
  const data = await api("/cart");
  return data.cart || [];
};

export const addCartItem = async (productId, quantity = 1) => {
  const data = await api("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
  return data;
};

export const updateCartItem = async (productId, quantity) => {
  const data = await api(`/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
  return data;
};

export const removeCartItem = async (productId) => {
  const data = await api(`/cart/${productId}`, { method: "DELETE" });
  return data;
};

export const clearCartApi = async () => {
  const data = await api("/cart", { method: "DELETE" });
  return data;
};
