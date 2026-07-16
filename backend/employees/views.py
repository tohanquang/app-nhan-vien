from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from rest_framework import viewsets
from .models import Department
from .serializers import DepartmentSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer    