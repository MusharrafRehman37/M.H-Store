import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const verifySession = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const data = await getCurrentUser(token);
        const currentUser = data?.user;
        if (!currentUser) throw new Error("Invalid session");
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Session verification failed:", error.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, [token]);

  const login = (data) => {
    const loggedInUser = data?.user;
    const loggedInToken = data?.token;
    if (!loggedInUser || !loggedInToken) throw new Error("Invalid login response from server.");
    setUser(loggedInUser);
    setToken(loggedInToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", loggedInToken);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) return;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, token, setToken, login, logout, updateUser, loading,
      isAuthenticated: Boolean(user && token),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() { return useContext(AuthContext); }
export default AuthProvider;
