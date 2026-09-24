import {
  createLocalOrder,
  getLocalOrders,
  getAllLocalOrders,
  updateLocalOrderStatus,
} from "../utils/orderStorage";

const API_URL = "https://m-h-store2.vercel.app/orders";

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

export const createOrder = async (orderData, token, user) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    return data;
  } catch (error) {
    // The current frontend can also run without the order API.
    // Save the order locally so checkout remains usable during local/demo work.
    console.warn("Order API unavailable; using local order storage:", error);

    const order = createLocalOrder(orderData, user);
    return { order, local: true };
  }
};

export const getMyOrders = async (token, user) => {
  try {
    const response = await fetch(`${API_URL}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

    const apiOrders = data.orders || [];
    const localOrders = getLocalOrders(user);
    const apiIds = new Set(apiOrders.map((order) => String(order._id)));
    return [
      ...apiOrders,
      ...localOrders.filter((order) => !apiIds.has(String(order._id))),
    ];
  } catch (error) {
    console.warn("My orders API unavailable; using local orders:", error);
    return getLocalOrders(user);
  }
};

export const getMyOrderById = async (id, token, user) => {
  try {
    const response = await fetch(`${API_URL}/my-orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || "Failed to fetch order");

    return data.order;
  } catch (error) {
    const localOrder = getLocalOrders(user).find(
      (order) => String(order._id) === String(id)
    );
    if (localOrder) return localOrder;
    throw error;
  }
};

export const getAllOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

    const apiOrders = data.orders || [];
    const localOrders = getAllLocalOrders();
    const apiIds = new Set(apiOrders.map((order) => String(order._id)));
    return [
      ...apiOrders,
      ...localOrders.filter((order) => !apiIds.has(String(order._id))),
    ];
  } catch (error) {
    console.warn("Admin orders API unavailable; using local orders:", error);
    return getAllLocalOrders();
  }
};

export const updateOrderStatus = async (id, status, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(data.message || "Failed to update order status");
    }

    return data;
  } catch (error) {
    const order = updateLocalOrderStatus(id, status);
    if (!order) throw error;
    return { order, local: true };
  }
};
