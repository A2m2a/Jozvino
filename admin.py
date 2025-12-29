#recommender/admin.py
from django.contrib import admin
from .models import ContentSimilarity, Recommendation


@admin.register(ContentSimilarity)
class ContentSimilarityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "content_object_1",
        "content_object_2",
        "similarity_score",
        "created_at",
    )

    list_filter = (
        "content_type_1",
        "content_type_2",
        "created_at",
    )

    search_fields = (
        "object_id_1",
        "object_id_2",
    )

    readonly_fields = (
        "content_type_1",
        "object_id_1",
        "content_type_2",
        "object_id_2",
        "similarity_score",
        "created_at",
    )

    ordering = ("-similarity_score",)

    def content_object_1(self, obj):
        return obj.content1

    content_object_1.short_description = "Content 1"

    def content_object_2(self, obj):
        return obj.content2

    content_object_2.short_description = "Content 2"


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "content_object",
        "score",
        "created_at",
    )

    list_filter = (
        "content_type",
        "created_at",
    )

    search_fields = (
        "user__email",
        "user__username",
        "object_id",
        "reason",
    )

    readonly_fields = (
        "content_type",
        "object_id",
        "created_at",
    )

    ordering = ("-created_at",)

    def content_object(self, obj):
        return obj.content

    content_object.short_description = "Content"
