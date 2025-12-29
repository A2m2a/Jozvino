# publishers/serializers.py
from rest_framework import serializers
from .models import Publisher


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = [
            "id",
            "name",
            "description",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]
