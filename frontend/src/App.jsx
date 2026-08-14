import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "./api";
import { Button, Input, Table, message } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import EmployeeList from "./components/EmployeeList"; // 👈 Nhớ import component vào

function App() {
  const { t, i18n } = useTranslation();

  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchText, setSearchText] = useState("");
  const filteredEmployees = employees.filter((emp) => {
    const query = searchText.toLowerCase();
    return (
      (emp.name && emp.name.toLowerCase().includes(query)) ||
      (emp.email && emp.email.toLowerCase().includes(query))
    );
  });

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
      { duration: Infinity, position: "top-center" },
    );
  };

  const onSave = async (data) => {
    try {
      if (formType === "add") {
        const res = await axios.post(
          "http://localhost:8000/api/employees/",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
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

  // Màn hình Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white-100 relative">
        <div className="absolute top-5 right-5">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50"
          >
            {i18n.language === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
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

  // Màn hình chính sau khi đăng nhập
  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gray-50 m-0 p-0">
      <header className="w-full bg-white shadow-sm px-8 py-6 flex justify-between items-center m-0">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50"
        >
          {i18n.language === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
        </button>
        <div className="text-xl font-bold text-gray-800">{t("company")}</div>

        <Toaster position="top-left" reverseOrder={false} />
        <div className="absolute top-5 left-10"></div>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined style={{ fontSize: "25px" }} />}
          onClick={handleLogout}
        >
          {t("logout_btn")}
        </Button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">{t("emp_list")}</h1>
        <div className="w-full flex justify-between items-center my-4">
          <Input
            placeholder={t("search")}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="max-w-xs"
            size="middle"
          />
          <Button
            type="primary"
            size="middle"
            onClick={() => openForm("add")}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              minWidth: "8px",
            }}
            className="font-semibold shadow-sm"
          >
            {t("add_btn")}
          </Button>
        </div>

        {/* 🚀 GỌI COMPONENT EMPLOYEE LIST ĐÃ TÁI SỬ DỤNG */}
        <div className="w-full">
          <EmployeeList
            employees={filteredEmployees}
            openForm={openForm}
            onDelete={handleDelete}
            t={t}
          />
        </div>
      </main>
      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        <p>© 2026 Employee Management System. All rights reserved.</p>
        <p className="mt-1">Liên hệ hỗ trợ: support@company.com</p>
      </footer>

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
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder={t("col_email")}
                className="w-full mb-2 p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mb-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-3">
              <input
                {...registerEmp("phone", {
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^0(8|9)[0-9]{8}$/,
                    message:
                      "Số điện thoại phải bắt đầu bằng 08 hoặc 09 và có 10 chữ số",
                  },
                })}
                placeholder={t("col_phone")}
                className="w-full mb-2 p-2 border rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mb-2">
                  {errors.phone.message}
                </p>
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
