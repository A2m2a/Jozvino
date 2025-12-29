# handouts/public_views.py
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from .models import Handout
from .serializers import HandoutSerializer


from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from .models import Handout
from .serializers import HandoutSerializer


class PublicHandoutViewSet(ReadOnlyModelViewSet):
    queryset = (
        Handout.objects
        .filter(is_active=True)
        .prefetch_related("categories", "tags", "files")
    )
    serializer_class = HandoutSerializer
    permission_classes = [AllowAny]
