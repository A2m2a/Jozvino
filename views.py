# categories/views.py
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from roles.permissions import RBACPermissionMixin
from .models import Category
from .serializers import CategorySerializer, CategoryTreeSerializer


# 🔹 CRUD دسته‌بندی‌ها (RBAC)
class CategoryViewSet(RBACPermissionMixin, ModelViewSet):
    queryset = Category.objects.all().order_by("-created_at")
    serializer_class = CategorySerializer

    # ✅ Single Source of Truth (LOCKED)
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["admin", "editor"]},
        "PUT": {"roles": ["admin", "editor"]},
        "PATCH": {"roles": ["admin", "editor"]},
        "DELETE": {"roles": ["admin"]},
    }


# 🔹 Tree API برای فرانت (Public)
class CategoryTreeViewSet(ReadOnlyModelViewSet):
    """
    API درختی دسته‌بندی‌ها برای frontend (Next.js)
    - public
    - no pagination
    """
    serializer_class = CategoryTreeSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True).prefetch_related("children")
