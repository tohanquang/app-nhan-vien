from rest_framework.permissions import BasePermission
from rest_framework import permissions

class IsAdminRole(BasePermission):
    """
    Chỉ cho phép Admin truy cập.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsEmployeeOrAdmin(permissions.BasePermission):
    """
    - Admin: Toàn quyền (GET, POST, PUT, PATCH, DELETE).
    - Employee: Chỉ được xem (GET), thêm (POST), sửa (PUT/PATCH), KHÔNG ĐƯỢC XÓA (DELETE).
    - Guest / Khác: Tùy chỉnh theo yêu cầu.
    """
    def has_permission(self, request, view):
        # Yêu cầu user phải đăng nhập trước
        if not request.user or not request.user.is_authenticated:
            return False

        # Nếu là Admin (hoặc is_staff / is_superuser), cho phép tất cả hành động
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Kiểm tra nếu user thuộc nhóm 'Employee' hoặc kiểm tra role của họ
        # (Giả sử bạn phân quyền dựa trên User Groups của Django)
        is_employee = request.user.groups.filter(name='Employee').exists() or True # Thay đổi logic kiểm tra role tùy thuộc vào DB của bạn

        if is_employee:
            # Các phương thức an toàn (GET, HEAD, OPTIONS) -> Cho phép Read
            # Phương thức POST -> Cho phép Create
            # Phương thức PUT, PATCH -> Cho phép Edit
            if request.method in ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH']:
                return True
            
            # Chặn hoàn toàn phương thức DELETE (Xóa) đối với Employee
            if request.method == 'DELETE':
                return False

        return False
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Chỉ cho phép admin sửa/xóa dữ liệu. 
    Các user khác (đã đăng nhập) chỉ có quyền đọc (GET, HEAD, OPTIONS).
    """
    def has_permission(self, request, view):
        # Cho phép các request đọc (GET, HEAD, OPTIONS) với mọi user đã đăng nhập
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Chỉ cho phép role 'admin' hoặc superuser thực hiện các method ghi (POST, PUT, DELETE)
        return request.user and request.user.is_authenticated and (
            getattr(request.user, 'role', None) == 'admin' or request.user.is_superuser
        )    