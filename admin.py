#requestsapp/admin.py
from django.contrib import admin
from .models import RoleUpgradeRequest


@admin.register(RoleUpgradeRequest)
class RequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "requested_role",
        "status",
        "created_at",
    )

    list_filter = (
        "requested_role",
        "status",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )
