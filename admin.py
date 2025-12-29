# handouts/admin.py
from django.contrib import admin
from django.utils.html import format_html
from contents.admin import ContentAdminMixin
from .models import Handout
from files.admin import FileInline

@admin.register(Handout)
class HandoutAdmin(ContentAdminMixin):
    inlines = [FileInline]

    def save_formset(self, request, form, formset, change):
        # مقداردهی uploader برای هر فایل جدید
        instances = formset.save(commit=False)
        for instance in instances:
            if not instance.uploader_id:
                instance.uploader = request.user
            instance.save()
        formset.save_m2m()

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="height:50px; object-fit:cover;" />',
                obj.cover_image.file.url
            )
        return "-"

    cover_preview.short_description = "Cover"

    list_display = (
        "id",
        "title",
        "course_name",
        "cover_preview",
        "university",
        "professor",
        "semester",
        "is_official",
        "created_at",
    )

    list_filter = (
        "is_official",
        "semester",
        "categories",
        "tags",
        "created_at",
    )

    search_fields = (
        "title",
        "course_name",
        "university",
        "professor",
        "description",
    )
    filter_horizontal = ("categories", "tags")
