# accounts/admin.py
from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "role", "is_staff", "is_active")
    exclude = ("groups", "user_permissions")

    # ✅ اجازه نمایش app در Admin
    def has_module_permission(self, request):
        return request.user.is_authenticated and request.user.is_staff

    def has_view_permission(self, request, obj=None):
        # 1. سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True
            
        user = request.user
        role_name = getattr(user.role, "name", None)

        # 2. ادمین‌های نقش‌محور و ادیتورها دسترسی دارند
        return role_name in ("admin", "editor")

    def has_add_permission(self, request):
        # 1. سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True

        # 2. فقط نقش "admin" می‌تواند کاربر جدید اضافه کند
        return getattr(request.user.role, "name", None) == "admin"

    def has_change_permission(self, request, obj=None):
        user = request.user
        role_name = getattr(user.role, "name", None)

        # 1. سوپریوزر همیشه دسترسی کامل دارد
        if user.is_superuser:
            return True

        # 2. کاربر با نقش 'admin' می‌تواند همه را تغییر دهد
        if role_name == "admin":
            return True

        # 3. کاربر با نقش 'editor' فقط می‌تواند پروفایل خودش را تغییر دهد
        if role_name == "editor":
            # obj is None یعنی در حال رفتن به صفحه لیست یا اضافه کردن است (که در has_add چک می‌شود)
            if obj is None: 
                return True # اجازه دیدن صفحه لیست را دارد
            return obj.id == user.id # اجازه تغییر فقط پروفایل خودش

        return False

    def has_delete_permission(self, request, obj=None):
        # 1. سوپریوزر همیشه اجازه حذف دارد
        if request.user.is_superuser:
            return True
            
        # 2. فقط نقش "admin" اجازه حذف دارد
        return getattr(request.user.role, "name", None) == "admin"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        user = request.user
        role_name = getattr(user.role, "name", None)
        
        # 1. سوپریوزر و ادمین همه کاربران را می‌بینند
        if user.is_superuser or role_name == "admin":
            return qs

        # 2. ادیتور فقط خودش را می‌بیند
        if role_name == "editor":
            return qs.filter(id=user.id)

        return qs.none()
