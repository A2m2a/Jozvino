# search/serializers.py
from rest_framework import serializers
from books.models import Book
from handouts.models import Handout
from files.models import File


# =====================================================
# INTERNAL SEARCH SERIALIZERS (UNCHANGED)
# =====================================================

class FileMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "file_type")


class BaseContentSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    categories = serializers.StringRelatedField(many=True)
    tags = serializers.StringRelatedField(many=True)
    files = FileMiniSerializer(many=True)
    created_at = serializers.DateTimeField()


class BookSearchSerializer(BaseContentSearchSerializer):
    publisher = serializers.StringRelatedField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["type"] = "book"
        return data


class HandoutSearchSerializer(BaseContentSearchSerializer):
    course_name = serializers.CharField()
    teacher = serializers.CharField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["type"] = "handout"
        return data


# =====================================================
# PUBLIC SEARCH SERIALIZERS (LIGHTWEIGHT ✅)
# =====================================================

class BasePublicSearchSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for Public Search (Preview only)
    """
    type = serializers.SerializerMethodField()

    class Meta:
        fields = (
            "id",
            "type",
            "title",
            "description",
            "thumbnail",
        )

    def get_type(self, obj):
        return obj.__class__.__name__.lower()


class BookPublicSearchSerializer(BasePublicSearchSerializer):
    file_count = serializers.IntegerField(read_only=True)

    class Meta(BasePublicSearchSerializer.Meta):
        model = Book
        fields = BasePublicSearchSerializer.Meta.fields + (
            "file_count",
        )


class HandoutPublicSearchSerializer(BasePublicSearchSerializer):
    file_count = serializers.IntegerField(read_only=True)

    class Meta(BasePublicSearchSerializer.Meta):
        model = Handout
        fields = BasePublicSearchSerializer.Meta.fields + (
            "file_count",
        )
