# ratings/views.py
from rest_framework.viewsets import ModelViewSet
from roles.permissions import RBACPermissionMixin

from .models import Rating
from .serializers import RatingSerializer


class RatingViewSet(RBACPermissionMixin, ModelViewSet):
    serializer_class = RatingSerializer

    queryset = Rating.objects.select_related(
        "user",
        "file",
    )

    # ✅ RBAC نهایی و هماهنگ با get_queryset
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["editor", "viewer"]},
        "PUT": {"roles": []},
        "PATCH": {"roles": []},
        "DELETE": {"roles": ["admin"]},
    }

    def get_queryset(self):
        user = self.request.user

        # ✅ Admin همه امتیازها را می‌بیند
        if getattr(user.role, "name", None) == "admin":
            return self.queryset

        # ✅ کاربران فقط امتیازهای خودشان
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
