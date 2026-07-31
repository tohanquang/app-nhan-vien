from rest_framework import serializers
from .models import Employee
from rest_framework import viewsets
from rest_framework import serializers
from .models import Employee, Department
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        if user.is_superuser or user.is_staff:
            token['role'] = 'admin'
        else:
            # Nếu không phải admin thì mới kiểm tra nhóm hoặc gán 'employee'
            user_group = user.groups.first()
            token['role'] = user_group.name if user_group else 'employee'
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Bổ sung thông tin user trả về kèm theo khi gọi API login
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role # <--- Đưa role vào đây
        }
        return data

    def validate(self, attrs):
        data = super().validate(attrs)
        # Trả thêm thông tin user kèm theo lúc login thành công
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role # 👈 Đảm bảo có dòng này
        }
        return data

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'        
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']        