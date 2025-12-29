# books/public_views.py

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from .models import Book
from .serializers import BookSerializer


class PublicBookViewSet(ReadOnlyModelViewSet):
    queryset = (
        Book.objects
        .filter(is_active=True)
        .prefetch_related("categories", "tags", "files")
    )
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
