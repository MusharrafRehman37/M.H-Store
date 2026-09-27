import api from "./api";

export const getAdminUsers = async () => {
  const data = await api("/auth/admin/users");
  return data.users || [];
};

export const deleteAdminUser = async (uid) => {
  return api(`/auth/admin/users/${uid}`, { method: "DELETE" });
};
