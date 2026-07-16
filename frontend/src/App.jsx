import { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State cho form
  const [formData, setFormData] = useState({ name: '', position: '', email: '', phone:'' });

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees/');
      setEmployees(res.data);
    } catch (err) { console.error("Lỗi:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}/`, formData);
      } else {
        await api.post('/employees/', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err) { console.error("Lỗi:", err); }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      await api.delete(`/employees/${id}/`);
      fetchEmployees();
    }
  };

  const startEdit = (emp) => {
  setEditingId(emp.id); // Lưu ID của nhân viên đang sửa
  setFormData({
    name: emp.name,
    position: emp.position,
    email: emp.email,
    phone: emp.phone || '' // Đảm bảo nếu phone là null/undefined thì trả về chuỗi rỗng
  });
  setIsModalOpen(true); // Mở Modal sau khi đã set dữ liệu
};

  const resetForm = () => {
    setFormData({ name: '', position: '', email: '' });
    setEditingId(null);
  };

  return (
  <div className="App" style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
    <header style={{ 
  display: 'flex', 
  flexDirection: 'column', // Chuyển sang xếp chồng theo chiều dọc
  alignItems: 'center',    // Căn giữa theo chiều ngang
  marginBottom: '30px', 
  gap: '30px'              // Tạo khoảng cách giữa tiêu đề và nút
}}>
  <h1 style={{ margin: 0 }}>Quản lý nhân viên</h1>
  <button 
    onClick={() => { resetForm(); setIsModalOpen(true); }}
    style={{ 
      padding: '12px 25px', 
      backgroundColor: '#28a745', // Màu xanh lá cho nút "Thêm"
      color: '#fff', 
      border: 'none', 
      borderRadius: '50px',       // Bo tròn nút nhìn hiện đại hơn
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}
  >
    + Thêm nhân viên
  </button>
</header>

    {/* MODAL */}
    {isModalOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '8px' }} />
            <input placeholder="Vị trí" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required style={{ padding: '8px' }} />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '8px' }} />
            <input type="number" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '8px' }} />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
                {editingId ? "Lưu thay đổi" : "Thêm nhân viên"}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* BẢNG DỮ LIỆU */}
    <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
          <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Tên</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Vị trí</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Email</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Điện thoại</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
            <td style={{ padding: '12px' }}>{emp.name}</td>
            <td style={{ padding: '12px' }}>{emp.position}</td>
            <td style={{ padding: '12px' }}>{emp.email}</td>
            <td style={{ padding: '12px' }}>{emp.phone}</td>
            <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(emp)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Sửa</button>
              <button onClick={() => deleteEmployee(emp.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default App;