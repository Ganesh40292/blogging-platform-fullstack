import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ================= LOAD USER =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user in localStorage");
      localStorage.removeItem("user");
    }
  }, []);

  // ================= LOGIN =================
  const login = (userData) => {
    if (!userData) return;

    setUser(userData);

    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ================= CUSTOM HOOK =================
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;