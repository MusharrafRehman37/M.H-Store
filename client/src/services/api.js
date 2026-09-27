const API_URL = (import.meta.env.VITE_API_URL || "https://m-h-store2.vercel.app").replace(/\/$/, "");

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try { response = await fetch(`${API_URL}${endpoint}`, { ...options, headers }); }
  catch (error) { throw new Error(`Cannot connect to server: ${error.message}`); }

  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) throw new Error(data.message || data.error || `Server returned ${response.status}`);
  return data;
};
export default api;
