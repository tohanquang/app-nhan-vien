import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Đưa sự kiện trực tiếp vào đây
  const handleLogin = async () => {
    console.log("1. Đã bấm nút đăng nhập!");

    try {
      const response = await axiosClient.post("/auth/login/", {
        username,
        password,
      });
      console.log("2. Kết quả từ server:", response.data);

      // Lưu thẳng vào localStorage
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }

      const userData = response.data.user || response.data;
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("3. ĐÃ LƯU XONG VÀO LOCAL STORAGE!");
      alert("Đăng nhập thành công!");

      navigate("/");
    } catch (error) {
      console.error("Lỗi xảy ra:", error);
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Đăng Nhập</h2>

      {/* Bỏ thẻ <form> và onSubmit đi, dùng div bình thường */}
      <div>
        <div style={{ marginBottom: "15px" }}>
          <label>Tài khoản:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {/* Đổi thành type="button" và gọi onClick trực tiếp */}
        <button
          type="button"
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Đăng Nhập Ngay
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
