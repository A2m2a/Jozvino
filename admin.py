# contents/admin.py
from django.contrib import admin

class ContentAdminMixin(admin.ModelAdmin):
    """
    Base admin config for all content-based models (Book, Handout, ...)
    """

    list_filter = (
        "publisher",
        "categories",
        "tags",
        "is_active",
        "created_at",
    )
    search_fields = (
        "title",
        "description",
    )
    filter_horizontal = ("categories", "tags")

    readonly_fields = ("created_at", "updated_at")

    # ----------------------------
    # RBAC (shared) - اضافه کردن چک is_superuser در تمام توابع
    # ----------------------------

    def has_module_permission(self, request):
        # is_staff باید ماژول را ببیند
        return request.user.is_authenticated and request.user.is_staff

    def has_view_permission(self, request, obj=None):
        # سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True
            
        role = getattr(request.user.role, "name", None)
        # ادمین و ادیتور دسترسی مشاهده دارند
        return role in ("admin", "editor")

    def has_add_permission(self, request):
        # سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True
            
        role = getattr(request.user.role, "name", None)
        # ادمین و ادیتور دسترسی افزودن دارند
        return role in ("admin", "editor")

    def has_change_permission(self, request, obj=None):
        # سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True
            
        role = getattr(request.user.role, "name", None)
        # ادمین و ادیتور دسترسی تغییر (ویرایش) دارند
        return role in ("admin", "editor")

    def has_delete_permission(self, request, obj=None):
        # سوپریوزر همیشه دسترسی دارد
        if request.user.is_superuser:
            return True
            
        role = getattr(request.user.role, "name", None)
        # فقط ادمین اجازه حذف دارد
        return role == "admin"
