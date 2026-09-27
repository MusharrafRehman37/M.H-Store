import api from "./api";

export const getProducts = async () => {
  const data = await api("/products");
  return data.products || [];
};

export const getProductById = async (id) => {
  const data = await api(`/products/${id}`);
  return data.product;
};

export const createProduct = async (productData, token) => {
  const data = await api("/products", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(productData),
  });
  return data;
};

export const updateProduct = async (id, productData, token) => {
  const data = await api(`/products/${id}`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(productData),
  });
  return data;
};

export const deleteProduct = async (id, token) => {
  const data = await api(`/products/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};
