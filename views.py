# tags/views.py

from rest_framework.viewsets import ModelViewSet
from roles.permissions import RBACPermissionMixin
from .models import Tag
from .serializers import TagSerializer


class TagViewSet(RBACPermissionMixin, ModelViewSet):
    queryset = Tag.objects.all().order_by("-created_at")
    serializer_class = TagSerializer

    rbac_permissions = {
    "GET": {"roles": ["admin", "editor", "viewer"]},
    "POST": {"roles": ["admin", "editor"]},
    "PUT": {"roles": ["admin", "editor"]},
    "PATCH": {"roles": ["admin", "editor"]},
    "DELETE": {"roles": ["admin"]},
}

