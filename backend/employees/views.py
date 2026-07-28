from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate

from .models import Employee, Department
from .serializers import EmployeeSerializer, DepartmentSerializer, MyTokenObtainPairSerializer
from .permissions import IsAdminRole, IsEmployeeOrAdmin

from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from .permissions import IsAdminOrReadOnly
class EmployeeListView(APIView):
    permission_classes = [AllowAny] # Cho phép tất cả mọi người truy cập không cần token

    def get(self, request):
        # Đoạn code lấy danh sách nhân viên của bạn ở đây
        return Response({"message": "Thành công"})

# 1. Custom Login View: Xử lý gán HttpOnly Cookie cho refresh token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data
        
        # Lấy refresh token từ response mặc định
        refresh_token = data.get('refresh')
        
        # Xóa refresh khỏi JSON body để tránh lưu vào localStorage / memory không an toàn
        if 'refresh' in data:
            del data['refresh']

        # Đặt refresh token vào HttpOnly Cookie
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,       # Chặn JavaScript truy cập (chống XSS)
            secure=False,        # False nếu chạy HTTP localhost
            samesite='Lax',      # Chống tấn công CSRF
            max_age=7 * 24 * 60 * 60 # Thời gian sống: 7 ngày
        )
        
        return response

# 2. Custom Logout View: Xóa HttpOnly Cookie và trả về 200 OK
class CustomLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"detail": "Đăng xuất thành công."}, status=status.HTTP_200_OK)
        # Xóa cookie refresh_token trên trình duyệt
        response.delete_cookie('refresh_token')
        return response

# 3. ViewSets cho Employee và Department
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsEmployeeOrAdmin]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['destroy']:
            permission_classes = [IsAdminRole]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsEmployeeOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user and user.is_superuser:
        return Response({"message": "Đăng nhập thành công"}, status=200)
    return Response({"error": "Sai thông tin"}, status=400)