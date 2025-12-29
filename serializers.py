# files/serializers.py
from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    content_type = serializers.SerializerMethodField(read_only=True)
    content_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = File
        fields = [
            "id",
            "file",
            "file_type",
            "book",
            "handout",
            "content_type",
            "content_id",
            "uploader",
            "created_at",
        ]
        read_only_fields = [
            "uploader",
            "created_at",
            "content_type",
            "content_id",
        ]

    def get_content_type(self, obj):
        if obj.book_id:
            return "book"
        if obj.handout_id:
            return "handout"
        return None

    def get_content_id(self, obj):
        return obj.book_id or obj.handout_id

    def validate(self, attrs):
        book = attrs.get("book")
        handout = attrs.get("handout")

        if book and handout:
            raise serializers.ValidationError(
                "File can be attached to either a book or a handout, not both."
            )

        if not book and not handout:
            raise serializers.ValidationError(
                "File must be attached to a book or a handout."
            )

        return attrs

    def update(self, instance, validated_data):
        if "book" in validated_data or "handout" in validated_data:
            raise serializers.ValidationError(
                "Changing file content association is not allowed."
            )
        return super().update(instance, validated_data)
