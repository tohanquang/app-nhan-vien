from django.core.management.base import BaseCommand
from employees.models import Employee

class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **kwargs):
        # Xóa dữ liệu cũ nếu cần
        Employee.objects.all().delete()
        
        # Thêm dữ liệu mới
        Employee.objects.create(name="Nguyen Van A", email="a@test.com", position="Dev")
        Employee.objects.create(name="Tran Thi B", email="b@test.com", position="Tester")
        
        self.stdout.write(self.style.SUCCESS('Đã seed dữ liệu thành công!'))