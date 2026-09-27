import api from "./api";

export const getWishlist = async () => {
  const data = await api("/wishlist");
  return data.wishlist || [];
};

export const addWishlistItem = async (productId) => {
  const data = await api("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
  return data;
};

export const removeWishlistItem = async (productId) => {
  const data = await api(`/wishlist/${productId}`, { method: "DELETE" });
  return data;
};

export const clearWishlistApi = async () => {
  const data = await api("/wishlist", { method: "DELETE" });
  return data;
};
