"use client";

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data or null if not logged in
  const router = useRouter();

  // Login function to set the user
  const login = (userData) => {
    setUser(userData);
    console.log("User logged in:", userData);
  };

  // Logout function to clear the user
  const logout = () => {
    setUser(null);
    router.replace("/login"); // Redirect to login page after logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
