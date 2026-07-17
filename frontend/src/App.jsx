import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form'; // Import thư viện

function App() {
  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hook cho form Đăng nhập
  const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm();
  
  // Hook cho form Nhân viên
  const { register: registerEmp, handleSubmit: handleSubmitEmp, reset, setValue } = useForm();

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:8000/api/employees/')
        .then(res => setEmployees(res.data))
        .catch(err => console.error("Lỗi tải danh sách:", err));
    }
  }, [isLoggedIn]);

  // Đăng nhập với React Hook Form
  const onLogin = async (data) => {
    try {
      await axios.post('http://localhost:8000/api/login/', data);
      setIsLoggedIn(true);
    } catch {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const openForm = (type, employee = null) => {
    setFormType(type);
    if (type === 'edit' && employee) {
      setEditId(employee.id);
      // Gán dữ liệu vào form
      setValue('name', employee.name);
      setValue('position', employee.position);
      setValue('email', employee.email);
      setValue('phone', employee.phone);
    } else {
      setEditId(null);
      reset({ name: '', position: '', email: '', phone: '' });
    }
    setIsFormOpen(true);
  };

  const onSave = async (data) => {
    try {
      if (formType === 'add') {
        const res = await axios.post('http://localhost:8000/api/employees/', data);
        setEmployees([...employees, res.data]);
      } else {
        const res = await axios.put(`http://localhost:8000/api/employees/${editId}/`, data);
        setEmployees(employees.map(emp => (emp.id === editId ? res.data : emp)));
      }
      setIsFormOpen(false);
    } catch (err) {
      alert("Lỗi server!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await axios.delete(`http://localhost:8000/api/employees/${id}/`);
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleSubmitLogin(onLogin)} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
          <input {...registerLogin("username", { required: true })} placeholder="Tài khoản" className="w-full p-3 mb-4 border rounded" />
          <input {...registerLogin("password", { required: true })} type="password" placeholder="Mật khẩu" className="w-full p-3 mb-6 border rounded" />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Danh sách nhân viên</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:underline">Đăng xuất</button>
        </div>

        <div className="flex justify-center mb-8">
          <button onClick={() => openForm('add')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow">
            + Thêm nhân viên
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-gray-700">
              <th className="p-4">Tên</th>
              <th className="p-4">Vị trí</th>
              <th className="p-4">Email</th>
              <th className="p-4">Điện thoại</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees && employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.position}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.phone}</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openForm('edit', emp)} className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmitEmp(onSave)} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{formType === 'add' ? 'Thêm mới' : 'Cập nhật'}</h2>
            <input {...registerEmp("name", { required: true })} placeholder="Tên" className="w-full p-3 mb-4 border rounded" />
            <input {...registerEmp("position")} placeholder="Vị trí" className="w-full p-3 mb-4 border rounded" />
            <input {...registerEmp("email", { 
    required: "Email bắt buộc",
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email không đúng định dạng"
    }
  })} 
  placeholder="Email" 
  className="w-full p-3 mb-4 border rounded" 
/>
            <input {...registerEmp("phone", { 
    required: "số điện thoại bắt buộc",
    pattern: {value: /^08\d{8}$/,
        message: "Chỉ được nhập số"
        
    }
  })} 
  placeholder="số điện thoại" 
  className="w-full p-3 mb-4 border rounded" 
/>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 bg-gray-200 rounded">Đóng</button>
              <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default App;