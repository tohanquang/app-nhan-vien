from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Nếu chưa được đăng ký thì đăng ký lại để hiện trên trang Admin



admin.site.register(User, UserAdmin)
