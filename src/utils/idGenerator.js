// Generate a unique numeric ID for locally stored products/orders.
export const getNextNumericId = (items = [], key = "id") => {
  const numericIds = items
    .map((item) => Number(item?.[key] ?? item?.id ?? item?._id))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Math.max(0, ...numericIds) + 1;
};

export const getNextNumericProductId = (products = []) => {
  const ids = products
    .map((product) => Number(product?.id ?? product?._id))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Math.max(0, ...ids) + 1;
};

export const getNextNumericOrderId = (orders = []) => {
  const ids = orders
    .map((order) => Number(order?.orderNumber ?? order?.id ?? order?._id))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Math.max(0, ...ids) + 1;
};
