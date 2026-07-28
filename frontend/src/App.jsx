import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "./api";
import { Button } from "antd";

function App() {
  const { t, i18n } = useTranslation();

  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userRole =
    localStorage.getItem("role") ||
    localStorage.getItem("user_role") ||
    "employee";
  const isEmployee = userRole === "employee";
  const canDelete = userRole !== "employee" && userRole !== "guest";

  axios.defaults.withCredentials = true;

  const { register: registerLogin, handleSubmit: handleSubmitLogin } =
    useForm();
  const {
    register: registerEmp,
    handleSubmit: handleSubmitEmp,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Hàm toggle đổi ngôn ngữ và lưu vào localStorage
  const toggleLanguage = () => {
    const nextLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("app_language", nextLang);
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .get("/employees/")
        .then((res) => setEmployees(res.data))
        .catch((err) => {
          console.error("Lỗi tải data:", err);
          toast.error(t("error_load"));
        });
    }
  }, [isLoggedIn, t]);

  const onLogin = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login/", data, {
        withCredentials: true,
      });

      localStorage.setItem("access_token", res.data.access);
      window.location.href = "/";
      // Giả lập lưu role nếu backend trả về, hoặc mặc định
      if (res.data.role) {
        localStorage.setItem("user_role", res.data.role);
      }
      setIsLoggedIn(true);
      toast.success(t("success_login"));
      window.location.reload();
    } catch {
      toast.error(t("fail_login"));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true },
      );
      toast.success(t("success_logout"));
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  // Mở modal Thêm hoặc Sửa
  const openForm = (type, emp = null) => {
    setFormType(type);
    if (type === "edit" && emp) {
      setEditId(emp.id);
      setValue("name", emp.name);
      setValue("position", emp.position);
      setValue("email", emp.email);
      setValue("phone", emp.phone);
    } else {
      setEditId(null);
      reset({ name: "", position: "", email: "", phone: "" });
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    toast(
      (toastInstance) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-800">{t("confirm_delete")}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(toastInstance.id)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              onClick={async () => {
                toast.dismiss(toastInstance.id);
                try {
                  await axios.delete(
                    `http://localhost:8000/api/employees/${id}/`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                      },
                    },
                  );
                  setEmployees(employees.filter((emp) => emp.id !== id));
                  toast.success(t("success_delete"));
                } catch {
                  toast.error(t("unauthorized_delete"));
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  };

  const onSave = async (data) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };
    try {
      if (formType === "add") {
        const res = await axios.post(
          "http://localhost:8000/api/employees/",
          data,
          config,
        );
        setEmployees([...employees, res.data]);
        toast.success(t("success_add"));
      } else {
        const res = await api.patch(`/employees/${editId}/`, data);
        setEmployees(employees.map((e) => (e.id === editId ? res.data : e)));
        toast.success(t("success_update"));
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Chi tiết lỗi từ Backend:", err.response?.data);
      toast.error("Lỗi lưu dữ liệu!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white-100 relative">
        <div className="absolute top-5 right-5">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50"
          >
            {i18n.language === "vi" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt"}
          </button>
        </div>

        <Toaster position="top-right" reverseOrder={false} />
        <form
          onSubmit={handleSubmitLogin(onLogin)}
          className="bg-white p-8 rounded shadow-md w-80"
        >
          <h2 className="mb-4 text-xl font-bold text-center">
            {t("login_title")}
          </h2>

          <input
            {...registerLogin("username", { required: true })}
            placeholder={t("username")}
            className="w-full mb-2 p-2 border rounded"
          />

          <div className="mb-4 relative">
            <input
              {...registerLogin("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              className="w-full p-2 pr-16 border rounded focus:outline-none focus:ring"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer select-none text-sm text-blue-500 font-medium hover:underline"
            >
              {showPassword ? t("hide") : t("show")}
            </span>
          </div>

          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">
            {t("login_btn")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-10 w-full flex flex-col items-center min-h-screen bg-gray-50 relative">
      <div className="absolute top-5 right-10">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50"
        >
          {i18n.language === "vi" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt"}
        </button>
      </div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-5xl flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">{t("emp_list")}</h1>

        <div className="w-full max-w-5xl text-center mb-6">
          {/* Nút Thêm hiển thị bình thường */}
          <button
            onClick={() => openForm("add")}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition cursor-pointer shadow-md text-sm font-semibold"
          >
            {t("add_btn")}
          </button>

          <button
            onClick={handleLogout}
            className="absolute top-5 left-10 text-red-500 hover:underline cursor-pointer"
          >
            {t("logout_btn")}
          </button>
        </div>
      </div>

      <table className="w-full max-w-5xl border text-center border-collapse bg-white shadow-sm">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 border">{t("col_name")}</th>
            <th className="p-3 border">{t("col_position")}</th>
            <th className="p-3 border">{t("col_email")}</th>
            <th className="p-3 border">{t("col_phone")}</th>
            <th className="p-3 border">{t("col_action")}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b hover:bg-gray-50">
              <td className="p-3 border">{emp.name}</td>
              <td className="p-3 border">{emp.position}</td>
              <td className="p-3 border">{emp.email}</td>
              <td className="p-3 border">{emp.phone}</td>

              {/* Cột thao tác: Hiển thị nút Sửa, nhưng chỉ hiển thị nút Xóa nếu có quyền canDelete */}
              <td className="p-3 border flex gap-3 justify-center items-center">
                <button
                  onClick={() => openForm("edit", emp)}
                  className="text-blue-500 hover:underline cursor-pointer font-medium"
                >
                  {t("edit")}
                </button>
                <Button
                  type="primary"
                  danger
                  disabled={isEmployee}
                  onClick={() => handleDelete(emp.id)}
                >
                  {t("delete")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL THÊM / SỬA NHÂN VIÊN */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmitEmp(onSave)}
            className="bg-white p-6 rounded-lg shadow-xl w-96"
          >
            <h2 className="mb-4 font-bold text-lg">
              {formType === "add" ? t("modal_add") : t("modal_update")}
            </h2>
            <input
              {...registerEmp("name", { required: true })}
              placeholder={t("col_name")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              {...registerEmp("position")}
              placeholder={t("col_position")}
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="mb-3">
              <input
                {...registerEmp("email", {
                  required: t("err_email_required"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("err_email_invalid"),
                  },
                })}
                placeholder={t("col_email")}
                className="w-full mb-2 p-2 border rounded"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-3">
              <input
                {...registerEmp("phone", {
                  required: t("err_phone_required"),
                  pattern: {
                    value: /^0(8|9)[0-9]{8}$/,
                    message: t("err_phone_invalid"),
                  },
                })}
                placeholder={t("col_phone")}
                className="w-full mb-2 p-2 border rounded"
              />
              {errors.phone && (
                <span className="text-red-500 text-xs">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              >
                {t("save")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
