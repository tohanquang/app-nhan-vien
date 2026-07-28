import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const { user } = useAuth();
  console.log("Dữ liệu user từ AuthContext:", user);

  return (
    <div>
      <h2>Danh sách nhân viên</h2>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vị trí</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>
                {/* Chỉ hiện nút Sửa nếu là Admin hoặc Employee */}
                {user && (user.role === 'admin' || user.is_superuser || user.is_staff) ? (
  <span 
    onClick={() => onDelete && onDelete(emp.id)} 
    style={{ color: 'red', cursor: 'pointer', marginLeft: '8px' }}
  >
    Xóa
  </span>
) : null}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;