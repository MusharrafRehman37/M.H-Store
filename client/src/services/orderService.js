import api from "./api";

export const createOrder = async (orderData) => api("/orders", {
  method: "POST",
  body: JSON.stringify(orderData),
});

export const getMyOrders = async () => {
  const data = await api("/orders/my-orders");
  return data.orders || [];
};

export const getMyOrderById = async (id) => {
  const data = await api(`/orders/my-orders/${id}`);
  return data.order;
};

export const getAllOrders = async () => {
  const data = await api("/orders/admin/all");
  return data.orders || [];
};

export const getAdminOrderById = async (id) => {
  const data = await api(`/orders/admin/${id}`);
  return data.order;
};

export const updateOrderStatus = async (id, status) => api(`/orders/admin/${id}/status`, {
  method: "PUT",
  body: JSON.stringify({ status }),
});

export const deleteOrder = async (id) => api(`/orders/admin/${id}`, { method: "DELETE" });
