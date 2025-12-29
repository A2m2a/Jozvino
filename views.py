# reports/views.py
from rest_framework.viewsets import ModelViewSet

from roles.permissions import RBACPermissionMixin
from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [RBACPermissionMixin]

    # ✅ restrict allowed methods
    http_method_names = ["get", "post", "patch", "head", "options"]

    # ✅ Single Source of Truth for RBAC
    rbac_permissions = {
        # viewer/editor can only create reports
        "POST": {"roles": ["viewer", "editor"]},

        # admin can read & manage
        "GET": {"roles": ["admin"]},
        "PATCH": {"roles": ["admin"]},
    }

    def get_queryset(self):
        """
        Business-level data visibility.
        RBAC already validated access.
        """
        user = self.request.user
        role = getattr(user.role, "name", None)

        if role == "admin":
            return Report.objects.select_related(
                "reporter",
                "file",
            )

        # non-admin users only see their own reports
        return Report.objects.filter(reporter=user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
