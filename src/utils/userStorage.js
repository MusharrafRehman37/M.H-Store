const USERS_KEY = "users";
const DELETED_USERS_KEY = "deletedUsers";

export const normalizeEmail = (email = "") =>
  email.trim().toLowerCase();

export const getStoredUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("usersUpdated"));
};

export const getDeletedUsers = () => {
  try {
    const users = JSON.parse(
      localStorage.getItem(DELETED_USERS_KEY) || "[]"
    );
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const isDeletedUser = (email) =>
  getDeletedUsers().includes(normalizeEmail(email));

export const markUserDeleted = (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return;

  const deleted = getDeletedUsers();
  if (!deleted.includes(normalized)) deleted.push(normalized);
  localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(deleted));
};

export const unmarkUserDeleted = (email) => {
  const normalized = normalizeEmail(email);
  const updated = getDeletedUsers().filter((item) => item !== normalized);
  localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(updated));
};
