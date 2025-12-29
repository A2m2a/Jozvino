# requestsapp/views.py
from django.db import transaction
from django.utils import timezone

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from requestsapp.models import RoleUpgradeRequest
from requestsapp.serializers import RoleUpgradeRequestSerializer
from roles.permissions import RBACPermissionMixin


class RoleUpgradeRequestViewSet(ModelViewSet):
    """
    Role Upgrade Requests:
    - viewer / editor / admin can create request
    - users see their own requests
    - admin sees all
    - only admin can approve / reject
    """

    serializer_class = RoleUpgradeRequestSerializer
    permission_classes = [RBACPermissionMixin]

    # ✅ avoid accidental full access
    queryset = RoleUpgradeRequest.objects.none()

    # ✅ Explicit & locked HTTP methods
    http_method_names = ["get", "post", "head", "options"]

    # ✅ Single Source of Truth (RBAC)
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["admin", "editor", "viewer"]},
        "approve": {"roles": ["admin"]},
        "reject": {"roles": ["admin"]},
    }

    def get_queryset(self):
        user = self.request.user
        role = getattr(user.role, "name", None)

        if role == "admin":
            return RoleUpgradeRequest.objects.select_related(
                "user",
                "requested_role",
            )

        return RoleUpgradeRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # ✅ ADMIN ACTIONS

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def approve(self, request, pk=None):
        role_request = self.get_object()

        if role_request.status != "pending":
            return Response(
                {"detail": "This request has already been processed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = role_request.user
        user.role = role_request.requested_role
        user.save(update_fields=["role"])

        role_request.status = "approved"
        role_request.reviewed_at = timezone.now()
        role_request.save(update_fields=["status", "reviewed_at"])

        return Response(
            {"detail": "Role upgrade request approved successfully."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def reject(self, request, pk=None):
        role_request = self.get_object()

        if role_request.status != "pending":
            return Response(
                {"detail": "This request has already been processed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role_request.status = "rejected"
        role_request.reviewed_at = timezone.now()
        role_request.save(update_fields=["status", "reviewed_at"])

        return Response(
            {"detail": "Role upgrade request rejected."},
            status=status.HTTP_200_OK,
        )
