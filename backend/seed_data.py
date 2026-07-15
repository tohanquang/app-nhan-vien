import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from employees.models import Employee

employees = [
    {'name': 'Nguyen Van A', 'email': 'a@example.com', 'position': 'Dev'},
    {'name': 'Tran Thi B', 'email': 'b@example.com', 'position': 'HR'},
]

for emp in employees:
    Employee.objects.get_or_create(**emp)

print("Đã seed dữ liệu thành công!")