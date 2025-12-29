# handouts/serializers.py
from rest_framework import serializers
from .models import Handout
from categories.serializers import CategorySerializer
from tags.serializers import TagSerializer
from files.serializers import FileSerializer


class HandoutSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    # ✅ درست: related_name = "files"
    files = FileSerializer(
        many=True,
        read_only=True
    )

    # ✅ کاور محاسبه‌ای
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Handout
        fields = (
            "id",
            "title",
            "description",
            "publisher",
            "course_name",
            "university",
            "professor",
            "semester",
            "is_official",
            "categories",
            "tags",
            "files",
            "cover_image",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def get_cover_image(self, obj):
        """
        اولین فایل image به‌عنوان کاور
        """
        file = obj.files.filter(file_type="image").first()
        if not file:
            return None
        return FileSerializer(file, context=self.context).data
