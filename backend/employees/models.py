from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('employee', 'Employee'),
        ('guest', 'Guest'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest')

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=('groups'),
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="employee_user_set",  
        related_query_name="employee_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=('user permissions'),
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="employee_user_permissions_set",  
        related_query_name="employee_user",
    )


class Department(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Employee(models.Model):
    # Liên kết 1-1 với User: Mỗi nhân viên ứng với một tài khoản đăng nhập (có thể để trống nếu nhân viên đó chưa có tài khoản)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='employee_profile')
    
    # Liên kết với phòng ban (Thêm trường này để quản lý nhân viên thuộc phòng ban nào)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True) # Đổi thành CharField để lưu số điện thoại an toàn hơn PositiveIntegerField

    def __str__(self):
        return self.name