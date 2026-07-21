import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';


function App() {
  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm();
  const { 
    register: registerEmp, 
    handleSubmit: handleSubmitEmp, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm();

  useEffect(() => {
    if (localStorage.getItem('access_token')) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:8000/api/employees/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Lỗi tải data:", err));
    }
  }, [isLoggedIn]);

  const onLogin = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/api/login/', data);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setIsLoggedIn(true);
      window.location.reload();
    } catch { alert("Đăng nhập thất bại!"); }
  };

  
  const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      // Thay thế 'http://localhost:8000/api/' bằng đường dẫn backend thực tế của bạn
      await axios.post('http://localhost:8000/api/logout/', { refresh: refreshToken });
    }
  } catch (error) {
    console.error("Lỗi khi đăng xuất trên server", error);
  } finally {
    localStorage.clear();
    setIsLoggedIn(false);
  }
};

  const openForm = (type, emp = null) => {
    setFormType(type);
    if (type === 'edit' && emp) {
      setEditId(emp.id);
      setValue('name', emp.name);
      setValue('position', emp.position);
      setValue('email', emp.email);
      setValue('phone', emp.phone);
    } else {
      setEditId(null);
      reset({ name: '', position: '', email: '', phone: '' });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/employees/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch { alert("Lỗi khi xóa!"); }
  };

  const onSave = async (data) => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } };
    try {
      if (formType === 'add') {
        const res = await axios.post('http://localhost:8000/api/employees/', data, config);
        setEmployees([...employees, res.data]);
      } else {
        const res = await axios.put(`http://localhost:8000/api/employees/${editId}/`, data, config);
        setEmployees(employees.map(e => e.id === editId ? res.data : e));
      }
      setIsFormOpen(false);
    } catch (err) { alert("Lỗi lưu dữ liệu: " + (err.response?.data?.phone || "Kiểm tra lại dữ liệu")); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmitLogin(onLogin)} className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="mb-4 text-xl font-bold text-center">Đăng nhập</h2>
          <input {...registerLogin("username", {required: true})} placeholder="Tài khoản" className="w-full mb-2 p-2 border rounded" />
          <input {...registerLogin("password", {required: true})} type="password" placeholder="Mật khẩu" className="w-full mb-4 p-2 border rounded" />
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    
    <div className="p-10 w-full flex flex-col items-center min-h-screen">
      
      {/* Container chứa tiêu đề và nút đăng xuất */}
      {/* Dùng 'relative' để định vị nút đăng xuất sang góc phải */}
      <div className="w-full max-w-5xl relative flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách Nhân viên</h1>
        
        {/* Nút đăng xuất được định vị tuyệt đối (absolute) sang góc phải */}
        <button 
          onClick={handleLogout} 
          className="absolute right-0 text-red-500 hover:underline cursor-pointer"
        >
          Đăng xuất
        </button>
      </div>
      
      {/* Khối chứa nút Thêm */}
      <div className="w-full max-w-5xl text-center mb-6">
        <button 
          onClick={() => openForm('add')} 
          className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 transition hover:scale-105 cursor-pointer shadow-md"
        >
          + Thêm
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <table className="w-full max-w-5xl border text-center border-collapse bg-white">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 border">Tên</th>
            <th className="p-3 border">Vị trí</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Số ĐT</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b hover:bg-gray-50">
              <td className="p-3 border">{emp.name}</td>
              <td className="p-3 border">{emp.position}</td>
              <td className="p-3 border">{emp.email}</td>
              <td className="p-3 border">{emp.phone}</td>
              <td className="p-3 border flex gap-3 justify-center">
                <button onClick={() => openForm('edit', emp)} className="text-blue-500 hover:underline cursor-pointer">Sửa</button>
                <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:underline cursor-pointer">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
  
  

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmitEmp(onSave)} className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="mb-4 font-bold text-lg">{formType === 'add' ? 'Thêm mới' : 'Cập nhật'}</h2>
            <input {...registerEmp("name", {required: true})} placeholder="Tên" className="w-full mb-2 p-2 border rounded" />
            <input {...registerEmp("position")} placeholder="Vị trí" className="w-full mb-2 p-2 border rounded" />
            <input 
        {...registerEmp("email", { 
          required: "Email là bắt buộc",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email không hợp lệ"
          }
        })} 
        placeholder="Email" 
        className="w-full mb-1 p-2 border rounded" 
      />
      {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>}
            <input 
  {...registerEmp("phone", { 
    required: "Số điện thoại là bắt buộc",
    pattern: {
      value: /^08[0-9]{8}$/,
      message: "Số điện thoại phải bắt đầu bằng 08 và có 10 chữ số"
    }
  })} 
  placeholder="Số ĐT (ví dụ: 08xxxxxxxx)" 
  className="w-full mb-1 p-2 border rounded" 
/>
{errors.phone && <p className="text-red-500 text-xs mb-2">{errors.phone.message}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default App;