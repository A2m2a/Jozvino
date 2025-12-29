#reports/admin.py
from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "file",
        "reporter",
        "issue_type",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "issue_type",
        "created_at",
    )

    search_fields = (
        "file__title",
        "user__email",
        "user__username",
        "description",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )
