import { getNextNumericOrderId } from "./idGenerator";

const STORAGE_KEY = "orders";

const readRawOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Error reading local orders:", error);
    return [];
  }
};

const normalizeOrders = (orders) => {
  let nextId = getNextNumericOrderId(orders);
  let changed = false;

  const normalized = orders.map((order) => {
    const existingId = Number(order?.orderNumber ?? order?.id ?? order?._id);

    if (Number.isInteger(existingId) && existingId > 0) {
      return {
        ...order,
        id: existingId,
        _id: existingId,
        orderNumber: existingId,
      };
    }

    changed = true;
    const newId = nextId++;
    return {
      ...order,
      id: newId,
      _id: newId,
      orderNumber: newId,
    };
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
};

const readOrders = () => normalizeOrders(readRawOrders());

const writeOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
};

export const createLocalOrder = (orderData, user) => {
  const orders = readOrders();
  const orderNumber = getNextNumericOrderId(orders);

  const order = {
    id: orderNumber,
    _id: orderNumber,
    orderNumber,
    userId: user?.id || user?._id || user?.uid || user?.email || "guest",
    userEmail: user?.email || orderData.customer?.email || "",
    status: "Processing",
    createdAt: new Date().toISOString(),
    ...orderData,
    // Keep the generated short ID even if orderData contains another id.
    id: orderNumber,
    _id: orderNumber,
    orderNumber,
  };

  writeOrders([order, ...orders]);
  return order;
};

export const getLocalOrders = (user) => {
  const orders = readOrders();
  if (!user) return [];

  const userId = String(user.id || user._id || user.uid || user.email || "");
  const email = String(user.email || "").toLowerCase();

  return orders.filter((order) => {
    const orderUserId = String(order.userId || "");
    const orderEmail = String(
      order.userEmail || order.customer?.email || ""
    ).toLowerCase();

    return orderUserId === userId || (email && orderEmail === email);
  });
};

export const getAllLocalOrders = () => readOrders();

export const updateLocalOrderStatus = (orderId, status) => {
  const orders = readOrders();
  const updated = orders.map((order) => {
    const currentId = order.id ?? order._id;
    return String(currentId) === String(orderId)
      ? { ...order, status, updatedAt: new Date().toISOString() }
      : order;
  });

  writeOrders(updated);
  return updated.find(
    (order) => String(order.id ?? order._id) === String(orderId)
  );
};
