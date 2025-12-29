# books/serializers.py
from rest_framework import serializers
from .models import Book
from categories.serializers import CategorySerializer
from tags.serializers import TagSerializer
from files.serializers import FileSerializer


class BookSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    files = FileSerializer(
        many=True,
        read_only=True,
        source="file_set"
    )

    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "description",
            "publisher",
            "pages",
            "isbn",
            "author",
            "published_year",
            "language",
            "edition",
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
