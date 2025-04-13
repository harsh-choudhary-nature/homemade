import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data or null if not logged in

  // Login function to set the user
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function to clear the user
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
