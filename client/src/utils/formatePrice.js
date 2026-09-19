
const formatePrice = (price, currency = "PKR") => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Rs. 0";
  }

  if (currency === "USD") {
    return `$${numericPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `Rs. ${numericPrice.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default formatePrice;

