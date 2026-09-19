import defaultProducts from "../data/product";
import { getNextNumericProductId } from "./idGenerator";

const STORAGE_KEY = "products";

export const getAdminProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Error reading admin products:", error);
    return [];
  }
};

export const getAllProducts = () => {
  const adminProducts = getAdminProducts();
  const byId = new Map();

  defaultProducts.forEach((product) => {
    byId.set(String(product.id || product._id), product);
  });

  adminProducts.forEach((product) => {
    byId.set(String(product.id || product._id), product);
  });

  return Array.from(byId.values());
};

export const getNextProductId = () => {
  return getNextNumericProductId(getAllProducts());
};

export const saveAdminProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("productsUpdated"));
};
