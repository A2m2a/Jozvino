# search/views.py
from django.contrib.postgres.search import (
    SearchVector,
    SearchRank,
    SearchQuery as PostgresSearchQuery,
)
from django.db.models import Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from roles.permissions import RBACPermissionMixin

from books.models import Book
from handouts.models import Handout

from .serializers import (
    BookSearchSerializer,
    HandoutSearchSerializer,
    BookPublicSearchSerializer,
    HandoutPublicSearchSerializer,
)
from .pagination import PublicSearchPagination
from .throttles import PublicSearchRateThrottle


class ContentSearchAPIView(RBACPermissionMixin, APIView):
    """
    RBAC:
    - admin: همه محتوا
    - editor: فقط محتوای خودش
    - viewer: فقط محتوای فعال
    """

    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
    }

    ALLOWED_TYPES = {"book", "handout"}
    DEFAULT_LIMIT = 50

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        content_type = request.query_params.get("type")
        limit = min(
            int(request.query_params.get("limit", self.DEFAULT_LIMIT)),
            self.DEFAULT_LIMIT,
        )

        results = []
        role_name = getattr(getattr(request.user, "role", None), "name", None)

        # 🔍 BOOK SEARCH (INTERNAL)
        book_qs = Book.objects.all()

        if role_name == "editor":
            book_qs = book_qs.filter(created_by=request.user)
        elif role_name == "viewer":
            book_qs = book_qs.filter(is_active=True)

        if query:
            vector = (
                SearchVector("title", weight="A")
                + SearchVector("description", weight="B")
                + SearchVector("publisher__name", weight="B")
            )
            book_qs = (
                book_qs.annotate(rank=SearchRank(vector, PostgresSearchQuery(query)))
                .filter(rank__gt=0)
                .order_by("-rank")
            )

        book_qs = book_qs.prefetch_related(
            "categories",
            "tags",
            "files",
        )[:limit]

        if not content_type or content_type == "book":
            results += BookSearchSerializer(book_qs, many=True).data

        # 🔍 HANDOUT SEARCH (INTERNAL)
        handout_qs = Handout.objects.all()

        if role_name == "editor":
            handout_qs = handout_qs.filter(created_by=request.user)
        elif role_name == "viewer":
            handout_qs = handout_qs.filter(is_active=True)

        if query:
            vector = (
                SearchVector("title", weight="A")
                + SearchVector("description", weight="B")
                + SearchVector("course_name", weight="B")
                + SearchVector("teacher", weight="B")
            )
            handout_qs = (
                handout_qs.annotate(rank=SearchRank(vector, PostgresSearchQuery(query)))
                .filter(rank__gt=0)
                .order_by("-rank")
            )

        handout_qs = handout_qs.prefetch_related(
            "categories",
            "tags",
            "files",
        )[:limit]

        if not content_type or content_type == "handout":
            results += HandoutSearchSerializer(handout_qs, many=True).data

        return Response(results)


class PublicContentSearchAPIView(APIView):
    """
    Public Search – Lightweight + Paginated
    """

    permission_classes = [AllowAny]
    throttle_classes = [PublicSearchRateThrottle]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        paginator = PublicSearchPagination()

        results = []

        # 📘 BOOKS (PUBLIC)
        book_qs = (
            Book.objects
            .filter(is_active=True)
            .annotate(file_count=Count("files"))
        )

        if query:
            book_qs = (
                book_qs.annotate(
                    rank=SearchRank(
                        SearchVector("title", weight="A")
                        + SearchVector("description", weight="B"),
                        PostgresSearchQuery(query),
                    )
                )
                .filter(rank__gt=0)
                .order_by("-rank")
            )

        # 📄 HANDOUTS (PUBLIC)
        handout_qs = (
            Handout.objects
            .filter(is_active=True)
            .annotate(file_count=Count("files"))
        )

        if query:
            handout_qs = (
                handout_qs.annotate(
                    rank=SearchRank(
                        SearchVector("title", weight="A")
                        + SearchVector("description", weight="B"),
                        PostgresSearchQuery(query),
                    )
                )
                .filter(rank__gt=0)
                .order_by("-rank")
            )

        combined = list(book_qs) + list(handout_qs)

        page = paginator.paginate_queryset(combined, request)

        for obj in page:
            if isinstance(obj, Book):
                results.append(BookPublicSearchSerializer(obj).data)
            else:
                results.append(HandoutPublicSearchSerializer(obj).data)

        return paginator.get_paginated_response(results)
