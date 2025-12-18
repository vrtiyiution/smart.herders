// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      const { password, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const signUp = (userData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: "Энэ и-мэйл хаяг бүртгэлтэй байна." };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto login
    const { password, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("currentUser", JSON.stringify(safeUser));

    return { success: true };
  };

  const updateProfile = (updatedData) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, ...updatedData } : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      console.error("Failed to update profile:", error);
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        return { success: false, message: "Зураг хэтэрхий том байна. Өөр зураг сонгоно уу." };
      }
      return { success: false, message: "Мэдээлэл хадгалахад алдаа гарлаа." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
