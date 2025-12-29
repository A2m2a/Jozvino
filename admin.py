#ratings/admin.py
from django.contrib import admin
from .models import Rating


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "file",
        "score",
        "created_at",
    )

    list_filter = (
        "score",
        "created_at",
    )

    search_fields = (
        "user__email",
        "user__username",
        "file__id",
        "comment",
    )

    readonly_fields = (
        "created_at",
        "user",
        "file",
    )

    ordering = (
        "-created_at",
    )
