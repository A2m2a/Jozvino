# handouts/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from .models import Handout
from .serializers import HandoutSerializer
from .filters import HandoutFilter
from categories.models import Category
from tags.models import Tag
from roles.permissions import RBACPermissionMixin

# ✅ NEW (for Recommender Interaction Logging)
from recommender.models import UserInteraction


class HandoutViewSet(RBACPermissionMixin, ModelViewSet):
    queryset = Handout.objects.select_related(
        "publisher"
    ).prefetch_related(
        "categories",
        "tags",
        "files",
    )
    serializer_class = HandoutSerializer

    # ✅ Filter
    filter_backends = [DjangoFilterBackend]
    filterset_class = HandoutFilter

    # ✅ RBAC (مشابه Book)
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor"]},
        "POST": {"roles": ["admin", "editor"]},
        "PUT": {"roles": ["admin", "editor"], "owner_only": True},
        "PATCH": {"roles": ["admin", "editor"], "owner_only": True},
        "DELETE": {"roles": ["admin"]},
    }

    # ✅ VIEW interaction logging (Recommender)
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                content=self.get_object(),  # Handout → AbstractContent ✅
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
        handout = self.get_object()
        category = Category.objects.get(pk=category_id)

        if request.method == "POST":
            handout.categories.add(category)
            return Response(status=status.HTTP_204_NO_CONTENT)

        handout.categories.remove(category)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ✅ Tag Assignment
    @action(
        detail=True,
        methods=["post", "delete"],
        url_path="tags/(?P<tag_id>[^/.]+)",
    )
    def manage_tag(self, request, pk=None, tag_id=None):
        handout = self.get_object()
        tag = Tag.objects.get(pk=tag_id)

        if request.method == "POST":
            handout.tags.add(tag)
            return Response(status=status.HTTP_204_NO_CONTENT)

        handout.tags.remove(tag)
        return Response(status=status.HTTP_204_NO_CONTENT)
