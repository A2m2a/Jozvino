# contents/views_public.py

from django.db.models import Avg, Count
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from books.models import Book
from handouts.models import Handout
from .serializers_public import PublicContentSerializer


class PublicContentFilterAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicContentSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = {
        "publisher": ["exact"],
        "categories": ["exact"],
        "tags": ["exact"],
    }

    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "title"]

    def get_queryset(self):
        books = (
            Book.objects
            .filter(is_active=True)
            .annotate(
                avg_rating=Avg("file_set__rating__score"),
                files_count=Count("file_set", distinct=True),
            )
            .filter(files_count__gt=0)
            .prefetch_related("categories", "tags")
            .select_related("publisher")
        )

        for b in books:
            b.type = "book"

        handouts = (
            Handout.objects
            .filter(is_active=True)
            .annotate(
                avg_rating=Avg("file_set__rating__score"),
                files_count=Count("file_set", distinct=True),
            )
            .filter(files_count__gt=0)
            .prefetch_related("categories", "tags")
            .select_related("publisher")
        )

        for h in handouts:
            h.type = "handout"

        return list(books) + list(handouts)
