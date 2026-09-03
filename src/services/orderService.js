
const API_URL = "http://localhost:8000/orders";

// ==========================================
// CREATE ORDER
// ==========================================

export const createOrder = async (
  orderData,
  token
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to place order"
    );
  }

  return data;
};

// ==========================================
// GET MY ORDERS
// ==========================================

export const getMyOrders = async (token) => {
  const response = await fetch(
    `${API_URL}/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch orders"
    );
  }

  return data.orders || [];
};

// ==========================================
// GET SINGLE ORDER
// ==========================================

export const getMyOrderById = async (
  id,
  token
) => {
  const response = await fetch(
    `${API_URL}/my-orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch order"
    );
  }

  return data.order;
};

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================

export const getAllOrders = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch orders"
    );
  }

  return data.orders || [];
};

// ==========================================
// ADMIN - UPDATE STATUS
// ==========================================

export const updateOrderStatus = async (
  id,
  status,
  token
) => {
  const response = await fetch(
    `${API_URL}/admin/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update order status"
    );
  }

  return data;
};

