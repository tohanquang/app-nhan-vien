from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView

# Import đúng các view từ app employees
from employees.views import MyTokenObtainPairView, CustomLogoutView 

urlpatterns = [
    
    path('admin/', admin.site.urls),
    
    # Đăng nhập chính (gắn Cookie)
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair_login'),
    
    # Các API của app employees
    path('api/', include('employees.urls')), 
    
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Đăng xuất chính (Xóa Cookie)
    path('api/logout/', CustomLogoutView.as_view(), name='token_logout'),
]