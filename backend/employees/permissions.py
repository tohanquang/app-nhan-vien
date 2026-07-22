from rest_framework.permissions import BasePermission

# Chỉ Admin mới được phép xóa
class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

# Admin hoặc Employee được phép thêm/sửa
class IsEmployeeOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) in ['admin', 'employee']