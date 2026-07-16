from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Tất cả các API sẽ được dẫn qua file urls.py của app employees
    path('api/', include('employees.urls')), 
]