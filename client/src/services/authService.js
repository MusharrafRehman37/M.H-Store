const API_URL = (import.meta.env.VITE_API_URL || "https://m-h-store2.vercel.app").replace(/\/$/, "");

const request = async (endpoint, body) => {
  const response = await fetch(`${API_URL}/auth${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = {};
  try { data = await response.json(); } catch {}

  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const registerUser = (userData) => request("/register", userData);
export const loginUser = (userData) => request("/login", userData);

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.message || "Session expired");
  return data;
};
