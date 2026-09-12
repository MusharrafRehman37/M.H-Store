const STORAGE_KEY = "orders";

const readOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Error reading local orders:", error);
    return [];
  }
};

const writeOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
};

export const createLocalOrder = (orderData, user) => {
  const order = {
    _id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: user?.id || user?._id || user?.uid || user?.email || "guest",
    userEmail: user?.email || orderData.customer?.email || "",
    status: "Processing",
    createdAt: new Date().toISOString(),
    ...orderData,
  };

  const orders = readOrders();
  writeOrders([order, ...orders]);
  return order;
};

export const getLocalOrders = (user) => {
  const orders = readOrders();
  if (!user) return [];

  const userId = String(
    user.id || user._id || user.uid || user.email || ""
  );
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
  const updated = orders.map((order) =>
    String(order._id) === String(orderId)
      ? { ...order, status }
      : order
  );

  writeOrders(updated);
  return updated.find((order) => String(order._id) === String(orderId));
};
