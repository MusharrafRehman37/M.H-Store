
const API_URL = "https://mh-store-production.up.railway.app/products";

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch products"
    );
  }

  return data.products || [];
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getProductById = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch product"
    );
  }

  return data.product;
};

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (
  productData,
  token
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create product"
    );
  }

  return data;
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (
  id,
  productData,
  token
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update product"
    );
  }

  return data;
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (
  id,
  token
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete product"
    );
  }

  return data;
};

