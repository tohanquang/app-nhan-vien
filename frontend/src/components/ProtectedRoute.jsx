import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Chưa đăng nhập -> Chuyển hướng về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có phân quyền cụ thể mà role của user không nằm trong danh sách được phép -> Chuyển về trang chủ hoặc báo lỗi 403
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '20px', color: 'red' }}>Bạn không có quyền truy cập trang này (403 Forbidden).</div>;
  }

  return children;
};