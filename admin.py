# files/admin.py
from django.contrib import admin
from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ("id", "file_type", "uploader", "created_at", "book", "handout")
    list_filter = ("file_type", "created_at")
    search_fields = ("uploader__email", "file")
    ordering = ("-created_at",)

    readonly_fields = ("created_at", "uploader", "book", "handout")

    # ❌ Add از صفحه مستقیم بسته
    def has_add_permission(self, request):
        return False

    # ✅ اجازه تغییر فقط از طریق Inline
    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        role = getattr(request.user.role, "name", None)
        return role in ("admin", "editor")

    def has_view_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        role = getattr(request.user.role, "name", None)
        return role in ("admin", "editor")

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        role = getattr(request.user.role, "name", None)
        return role == "admin"

class FileInline(admin.TabularInline):
    model = File
    extra = 1
    fields = ("file", "file_type")
    can_delete = True

    def has_add_permission(self, request, obj=None):
        role = getattr(request.user.role, "name", None)
        return request.user.is_staff and role in ("admin", "editor")

    def has_change_permission(self, request, obj=None):
        role = getattr(request.user.role, "name", None)
        return request.user.is_staff and role in ("admin", "editor")

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.form.base_fields["file_type"].initial = "image"
        return formset
