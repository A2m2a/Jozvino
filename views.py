# publishers/views.py


from rest_framework.viewsets import ModelViewSet
from roles.permissions import RBACPermissionMixin

from .models import Publisher
from .serializers import PublisherSerializer


class PublisherViewSet(RBACPermissionMixin, ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer

    # ✅ RBAC مبتنی بر HTTP Method
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["admin", "editor"]},
        "PUT": {"roles": ["admin", "editor"]},
        "PATCH": {"roles": ["admin", "editor"]},
        "DELETE": {"roles": ["admin"]},
    }
