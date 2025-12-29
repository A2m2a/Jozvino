# rolse/views.py
from rest_framework import viewsets
from .models import Role
from .serializers import RoleSerializer
from roles.permissions import RBACPermissionMixin


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [RBACPermissionMixin]

    rbac_permissions = {
        "GET": {
            "roles": ["admin"]
        }
    }

