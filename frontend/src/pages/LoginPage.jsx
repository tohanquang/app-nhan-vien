import { useState } from 'react';
import api from '../api';


function LoginPage({ setToken }) { // Nhận prop setToken từ App
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Gọi API để xác thực. 
    // Lưu ý: Django mặc định không có API đăng nhập sẵn, 
    // bạn cần đảm bảo server của bạn có endpoint '/api/login/' hoặc tương tự
    const res = await axios.post('http://localhost:8000/api/login/', {
      username: loginData.username,
      password: loginData.password
    });

    // Nếu đăng nhập thành công
    if (res.status === 200) {
      setIsLoggedIn(true);
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    alert("Sai tài khoản hoặc mật khẩu!");
  }
};

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Tên đăng nhập" 
          onChange={e => setFormData({...formData, username: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
} // <--- Dấu ngoặc này đóng hàm handleLogin (nếu bạn để nó trong hàm) hoặc đóng hàm LoginPage

export default LoginPage;