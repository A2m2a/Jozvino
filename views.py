# books/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from .models import Book
from .serializers import BookSerializer
from .filters import BookFilter
from categories.models import Category
from tags.models import Tag
from roles.permissions import RBACPermissionMixin

# ✅ NEW
from recommender.models import UserInteraction


class BookViewSet(RBACPermissionMixin, ModelViewSet):
    queryset = Book.objects.prefetch_related(
        "categories",
        "tags",
        "file_set",
    )
    serializer_class = BookSerializer

    # ✅ Filter
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter

    # ✅ RBAC
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor"]},
        "POST": {"roles": ["admin", "editor"]},
        "PUT": {"roles": ["admin", "editor"], "owner_only": True},
        "PATCH": {"roles": ["admin", "editor"], "owner_only": True},
        "DELETE": {"roles": ["admin"]},
    }

    # ✅ VIEW logging (Recommender)
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                content=self.get_object(),  # Book → AbstractContent ✅
                action=UserInteraction.ACTION_VIEW,
                weight=1.0,
            )

        return response

    # ✅ Category Assignment
    @action(
        detail=True,
        methods=["post", "delete"],
        url_path="categories/(?P<category_id>[^/.]+)",
    )
    def manage_category(self, request, pk=None, category_id=None):
        book = self.get_object()
        category = Category.objects.get(pk=category_id)

        if request.method == "POST":
            book.categories.add(category)
            return Response(status=status.HTTP_204_NO_CONTENT)

        book.categories.remove(category)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ✅ Tag Assignment
    @action(
        detail=True,
        methods=["post", "delete"],
        url_path="tags/(?P<tag_id>[^/.]+)",
    )
    def manage_tag(self, request, pk=None, tag_id=None):
        book = self.get_object()
        tag = Tag.objects.get(pk=tag_id)

        if request.method == "POST":
            book.tags.add(tag)
            return Response(status=status.HTTP_204_NO_CONTENT)

        book.tags.remove(tag)
        return Response(status=status.HTTP_204_NO_CONTENT)
