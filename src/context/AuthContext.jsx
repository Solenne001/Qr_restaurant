import { createContext, useContext, useState } from "react";

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Fonction de connexion (appelée depuis Login.jsx)
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
