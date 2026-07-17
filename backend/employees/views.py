from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from rest_framework import viewsets
from .models import Department
from .serializers import DepartmentSerializer
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"DEBUG: Đang thử đăng nhập với user={username}, pass={password}") # Dòng này sẽ hiện trong terminal
    
    user = authenticate(username=username, password=password)
    if user and user.is_superuser: # Kiểm tra xem có phải superuser không
        return Response({"message": "Đăng nhập thành công"}, status=200)
    return Response({"error": "Sai thông tin"}, status=400)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer    