# files/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .models import File
from .serializers import FileSerializer
from .utils import serve_file
from roles.permissions import RBACPermissionMixin

from recommender.models import UserInteraction


class FileViewSet(RBACPermissionMixin, ModelViewSet):
    serializer_class = FileSerializer

    queryset = File.objects.select_related(
        "book",
        "handout",
        "uploader",
    )

    # ⛔️ No filters (content-based architecture)
    filter_backends = []

    # ✅ RBAC (LOCKED)
    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["admin", "editor"]},
        "PUT": {"roles": ["admin", "editor"], "owner_only": True},
        "PATCH": {"roles": ["admin", "editor"], "owner_only": True},
        "DELETE": {"roles": ["admin"]},
    }

    def get_queryset(self):
        """
        Business-level filtering (after RBAC).
        """
        user = self.request.user
        role = user.role.name

        if role == "admin":
            return self.queryset

        if role == "viewer":
            # viewers only see verified files
            return self.queryset.filter(book__verified=True) | self.queryset.filter(handout__verified=True)

        # editor → only own files
        return self.queryset.filter(uploader=user)

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)

    # ✅ DOWNLOAD interaction (Recommender v1)
    @action(detail=True, methods=["post"])
    def download(self, request, pk=None):
        file = self.get_object()

        # ✅ AbstractContent resolution
        content = file.book or file.handout

        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                content=content,
                action=UserInteraction.ACTION_DOWNLOAD,
                weight=3.0,
            )

        return serve_file(file)
