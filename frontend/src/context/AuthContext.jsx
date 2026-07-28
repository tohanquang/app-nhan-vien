import React, { createContext, useContext, useState } from "react";
import axiosClient from "../api.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Khởi tạo user từ localStorage để tránh bị mất khi F5
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await axiosClient.post("/auth/login/", {
        username,
        password,
      });
      console.log(">>> KẾT QUẢ API LOGIN TRẢ VỀ:", response);
      console.log(">>> DỮ LIỆU DATA:", response.data);

      // Thử ép lấy user từ nhiều cấu trúc phổ biến của Django/Node.js
      const userData =
        response.data.user || response.data.data || response.data;

      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.error("Không tìm thấy thông tin user trong response!");
      }
      return true;
    } catch (error) {
      console.error("Lỗi đăng nhập chi tiết:", error.response || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout/");
    } catch (error) {
      console.error("Lỗi đăng xuất từ server:", error.response || error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, setUser: () => {} };
  }
  return context;
};
