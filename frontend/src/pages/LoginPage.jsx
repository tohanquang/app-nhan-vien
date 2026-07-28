import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Đang gửi yêu cầu đăng nhập...");

    try {
      // 1. Gọi trực tiếp API đăng nhập
      const response = await axiosClient.post("/auth/login/", {
        username,
        password,
      });
      console.log("KẾT QUẢ ĐĂNG NHẬP THÀNH CÔNG:", response.data);

      // 2. Lưu token và thông tin user trực tiếp vào localStorage
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }

      const userData = response.data.user || response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", response.data.access);

      // 3. Thông báo và chuyển hướng
      alert("Đăng nhập thành công!");
      navigate("/");
      window.location.reload(); // F5 lại trang để cập nhật giao diện ngay lập tức
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response || error);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Tài khoản:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
          }}
        >
          Đăng Nhập Ngay
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
