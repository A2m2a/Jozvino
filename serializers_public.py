# contents/serializers_public.py

from rest_framework import serializers
from categories.serializers import CategorySerializer
from tags.serializers import TagSerializer
from publishers.serializers import PublisherSerializer


class PublicContentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField()

    title = serializers.CharField()
    description = serializers.CharField()

    publisher = PublisherSerializer()
    categories = CategorySerializer(many=True)
    tags = TagSerializer(many=True)

    avg_rating = serializers.FloatField()
    files_count = serializers.IntegerField()
