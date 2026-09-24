const API_URL = (import.meta.env.VITE_API_URL || "https://m-h-store2.vercel.app").replace(/\/$/, "");

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch {}

  if (!response.ok) throw new Error(data.message || data.error || "Something went wrong");
  return data;
};

export default api;
