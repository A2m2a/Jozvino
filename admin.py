# books/admin.py
from django.contrib import admin
from django.utils.html import format_html
from contents.admin import ContentAdminMixin
from .models import Book
from files.admin import FileInline

@admin.register(Book)
class BookAdmin(ContentAdminMixin):
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
        "author",
        "cover_preview",
        "isbn",
        "published_year",
        "language",
        "created_at",
    )

    list_filter = ContentAdminMixin.list_filter + ("published_year", "language",)
    search_fields = ContentAdminMixin.search_fields + ("author", "isbn",)
    filter_horizontal = ("categories", "tags")
