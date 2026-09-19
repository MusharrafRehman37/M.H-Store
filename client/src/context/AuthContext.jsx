import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Error reading saved user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (data) => {
    try {
      /*
        Backend normally returns something like:

        {
          token: "...",
          user: {
            id: "...",
            fullName: "...",
            email: "...",
            role: "customer"
          }
        }

        This function also safely supports
        the case where only a user object is passed.
      */

      const loggedInUser =
        data?.user || data?.data?.user || data;

      const loggedInToken =
        data?.token ||
        data?.data?.token ||
        null;

      if (!loggedInUser) {
        throw new Error("User information is missing.");
      }

      setUser(loggedInUser);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      if (loggedInToken) {
        setToken(loggedInToken);

        localStorage.setItem(
          "token",
          loggedInToken
        );
      }

      return loggedInUser;
    } catch (error) {
      console.error("Login context error:", error);
      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;

