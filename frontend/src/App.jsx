import { useState, useEffect } from 'react';
import './index.css'; // Đảm bảo bạn đã import file CSS để nhận style của Modal

function App() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '' });

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/employees/');
      const data = await res.json();
      setEmployees(data);
    } catch (err) { console.error("Lỗi fetch dữ liệu:", err); }
  };

  const deleteEmployee = async (id) => {
    await fetch(`http://localhost:8000/api/employees/${id}/`, { method: 'DELETE' });
    fetchEmployees();
  };

  const addEmployee = async () => {
    await fetch('http://localhost:8000/api/employees/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    });
    setIsModalOpen(false);
    setNewEmployee({ name: '', department: '' });
    fetchEmployees();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý nhân viên</h1>
      <button onClick={() => setIsModalOpen(true)}>+ Thêm Nhân Viên</button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal">
          <h3>Thêm mới</h3>
          <input placeholder="Tên" onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} />
          <input placeholder="Phòng ban" onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} />
          <br/>
          <button onClick={addEmployee}>Lưu</button>
          <button onClick={() => setIsModalOpen(false)}>Hủy</button>
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Phòng ban</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td><button onClick={() => deleteEmployee(emp.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;