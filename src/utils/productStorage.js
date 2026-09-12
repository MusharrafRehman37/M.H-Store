import defaultProducts from "../data/product";

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

  // Admin-created products are added to the built-in catalogue.
  // If an admin product uses the same id as a default product, the admin
  // version wins so edits are reflected everywhere.
  const byId = new Map();

  defaultProducts.forEach((product) => {
    byId.set(String(product.id || product._id), product);
  });

  adminProducts.forEach((product) => {
    byId.set(String(product.id || product._id), product);
  });

  return Array.from(byId.values());
};

export const saveAdminProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("productsUpdated"));
};
