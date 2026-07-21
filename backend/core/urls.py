from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView, # <--- Nhớ import dòng này
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Đường dẫn đăng nhập (Sử dụng Token của SimpleJWT)
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 2. Đường dẫn các API của app employees
    path('api/', include('employees.urls')), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Thêm dòng này để khớp với http://localhost:8000/api/logout/
    path('api/logout/', TokenBlacklistView.as_view(), name='token_logout'),
]

  
  

