# recommender/serializers.py
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import (
    ContentSimilarity,
    Recommendation,
    UserInteraction,
)


class ContentObjectField(serializers.Field):
    """
    Serialize GenericForeignKey target object (Book / Handout).
    """

    def to_representation(self, obj):
        if obj is None:
            return None

        return {
            "id": obj.id,
            "type": obj.__class__.__name__.lower(),  # book / handout
            "title": getattr(obj, "title", None),
        }


# ----------------------------
# Content Similarity
# ----------------------------
class ContentSimilaritySerializer(serializers.ModelSerializer):
    content1 = ContentObjectField(read_only=True)
    content2 = ContentObjectField(read_only=True)

    class Meta:
        model = ContentSimilarity
        fields = [
            "id",
            "content1",
            "content2",
            "similarity_score",
            "created_at",
        ]


# ----------------------------
# User Interaction
# ----------------------------
class UserInteractionSerializer(serializers.ModelSerializer):
    # خروجی تمیز برای فرانت
    content = ContentObjectField(read_only=True)

    # ورودی ساده از فرانت
    content_type = serializers.CharField(write_only=True)
    object_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserInteraction
        fields = [
            "id",
            "user",
            "content",
            "content_type",
            "object_id",
            "action",
            "weight",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
        ]

    def validate_content_type(self, value):
        """
        فرانت فقط اسم مدل را می‌فرستد (مثلاً: 'book')
        """
        try:
            return ContentType.objects.get(model=value)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content type")

    def create(self, validated_data):
        content_type = validated_data.pop("content_type")
        object_id = validated_data.pop("object_id")

        return UserInteraction.objects.create(
            content_type=content_type,
            object_id=object_id,
            **validated_data
        )

# ----------------------------
# Recommendation
# ----------------------------
class RecommendationSerializer(serializers.ModelSerializer):
    content = ContentObjectField(read_only=True)

    class Meta:
        model = Recommendation
        fields = [
            "id",
            "user",
            "content",
            "score",
            "reason",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
        ]
