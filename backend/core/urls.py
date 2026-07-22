from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)
# IMPORT VIEW TÙY CHỈNH CỦA BẠN (nằm ở app employees)
from employees.views import MyTokenObtainPairView 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Đường dẫn đăng nhập chính (SỬ DỤNG VIEW TÙY CHỈNH ĐỂ CÓ ROLE)
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair_login'),
    
    # 2. Đường dẫn các API của app employees (gồm employees và departments)
    path('api/', include('employees.urls')), 
    
    # Nếu không cần thiết, bạn có thể bỏ bớt dòng /api/token/ trùng lặp bên dưới hoặc trỏ chung về MyTokenObtainPairView
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/logout/', TokenBlacklistView.as_view(), name='token_logout'),
]