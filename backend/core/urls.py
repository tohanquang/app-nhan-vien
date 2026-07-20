from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Đường dẫn đăng nhập (Sử dụng Token của SimpleJWT)
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 2. Đường dẫn các API của app employees
    path('api/', include('employees.urls')), 
]

  
  

