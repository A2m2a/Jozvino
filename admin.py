#publishers/admin.py
from django.contrib import admin
from .models import Publisher


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    ordering = (
        "id",
    )
