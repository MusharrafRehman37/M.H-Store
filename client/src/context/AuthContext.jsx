import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const verifySession = async () => {
      if (!token) { setUser(null); setLoading(false); return; }
      try {
        const data = await getCurrentUser(token);
        if (!data?.user) throw new Error("Invalid session");
        setUser(data.user);
      } catch (error) {
        console.error("Session verification failed:", error.message);
        setUser(null); setToken(null); localStorage.removeItem("token");
      } finally { setLoading(false); }
    };
    verifySession();
  }, [token]);

  const login = (data) => {
    if (!data?.user || !data?.token) throw new Error("Invalid login response from server.");
    setUser(data.user); setToken(data.token); localStorage.setItem("token", data.token); return data.user;
  };
  const logout = () => { setUser(null); setToken(null); localStorage.removeItem("token"); };
  const updateUser = (updatedUser) => { if (updatedUser) setUser(updatedUser); };

  return <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout, updateUser, loading, isAuthenticated: Boolean(user && token) }}>{children}</AuthContext.Provider>;
};
export function useAuth() { return useContext(AuthContext); }
export default AuthProvider;
