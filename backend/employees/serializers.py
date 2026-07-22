from rest_framework import serializers
from .models import Employee
from rest_framework import viewsets
from rest_framework import serializers
from .models import Employee, Department
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Nhúng thêm role và username vào payload của token
        token['role'] = getattr(user, 'role', 'guest')
        token['username'] = user.username
        
        return token

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'        