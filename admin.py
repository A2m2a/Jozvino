# search/admin.py
from django.contrib import admin
from .models import SearchQuery


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "query",
        "related_file",
        "count",
        "last_search",
    )

    list_filter = (
        "last_search",
    )

    search_fields = (
        "user__email",
        "user__username",
        "query",
        "related_file__title",
    )

    # 🔒 Admin کاملاً Read‑Only
    readonly_fields = (
        "user",
        "query",
        "related_file",
        "count",
        "last_search",
    )

    ordering = ("-last_search",)

    # ❌ بدون Add
    def has_add_permission(self, request):
        return False

    # ❌ بدون Edit
    def has_change_permission(self, request, obj=None):
        return False

    # ❌ بدون Delete
    def has_delete_permission(self, request, obj=None):
        return False
