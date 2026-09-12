// Shipping charges are calculated from the customer's city.
// These rates are easy to change later when your courier rates are finalized.

const CITY_RATES = {
  faisalabad: 150,
  lahore: 200,
  islamabad: 200,
  rawalpindi: 200,
  gujranwala: 200,
  multan: 220,
  sialkot: 220,
  peshawar: 250,
  quetta: 300,
  karachi: 300,
  hyderabad: 300,
};

export const getShippingCharge = (city = "") => {
  const normalizedCity = city.trim().toLowerCase();

  if (!normalizedCity) return 0;

  return CITY_RATES[normalizedCity] ?? 250;
};

export const formatShipping = (amount) =>
  `Rs.${Number(amount || 0).toFixed(2)}`;
