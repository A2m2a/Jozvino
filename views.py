# recommender/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from roles.permissions import RBACPermissionMixin

from .models import ContentSimilarity, Recommendation
from .serializers import (
    ContentSimilaritySerializer,
    RecommendationSerializer,
)
from .services import generate_recommendations_for_user
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import UserInteraction
from .serializers import UserInteractionSerializer

from books.models import Book
from handouts.models import Handout
from django.contrib.contenttypes.models import ContentType



class ContentSimilarityViewSet(RBACPermissionMixin, ModelViewSet):
    """
    Content Similarity Management

    - فقط Admin اجازه CRUD دارد
    - برای مدیریت شباهت محتوایی (offline / ML-ready)
    """

    queryset = ContentSimilarity.objects.all()
    serializer_class = ContentSimilaritySerializer
    owner_field = None

    rbac_permissions = {
        "GET": {"roles": ["admin"]},
        "POST": {"roles": ["admin"]},
        "PUT": {"roles": ["admin"]},
        "PATCH": {"roles": ["admin"]},
        "DELETE": {"roles": ["admin"]},
    }



class UserInteractionViewSet(ModelViewSet):
    serializer_class = UserInteractionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post"]

    def get_queryset(self):
        return (
            UserInteraction.objects
            .select_related("content_type")
            .filter(user=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RecommendationViewSet(RBACPermissionMixin, ModelViewSet):
    """
    Recommendation API

    - Admin: مشاهده همه recommendation ها
    - Editor / Viewer: فقط recommendation های خودشان
    """

    serializer_class = RecommendationSerializer
    owner_field = "user"

    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"], "owner_only": True},
        "POST": {"roles": ["admin"]},
        "PUT": {"roles": ["admin"]},
        "PATCH": {"roles": ["admin"]},
        "DELETE": {"roles": ["admin"]},

        # ✅ action سفارشی
        "POST_generate": {"roles": ["admin", "editor", "viewer"]},
    }

    def get_queryset(self):
        user = self.request.user

        if user.role.name == "admin":
            return Recommendation.objects.all().order_by("-score", "-created_at")

        return Recommendation.objects.filter(user=user).order_by("-score", "-created_at")

    def perform_create(self, serializer):
        """
        Admin-only manual creation
        (معمولاً استفاده نمی‌شود)
        """
        serializer.save()

    # 🔥 روشن‌کردن موتور recommendation
    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        user = request.user

        # 1️⃣ generate via service layer
        generate_recommendations_for_user(user)

        # 2️⃣ fetch fresh queryset (بعد از bulk_create)
        qs = Recommendation.objects.filter(user=user).order_by("-score")

        serializer = self.get_serializer(qs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        user = request.user

        qs = Recommendation.objects.filter(user=user).order_by("-score", "-created_at")

        # ✅ اگر recommendation وجود دارد → همان
        if qs.exists():
            serializer = self.get_serializer(qs, many=True)
            return Response(serializer.data)

        # ✅ FALLBACK: Cold Start
        books = Book.objects.filter(is_active=True).order_by("-created_at")[:5]
        handouts = Handout.objects.filter(is_active=True).order_by("-created_at")[:5]

        fallback_items = []

        for b in books:
            fallback_items.append({
                "id": None,
                "user": user.id,
                "content": {
                    "id": b.id,
                    "type": "book",
                    "title": b.title,
                },
                "score": 0,
                "reason": "Latest books",
                "created_at": b.created_at,
            })

        for h in handouts:
            fallback_items.append({
                "id": None,
                "user": user.id,
                "content": {
                    "id": h.id,
                    "type": "handout",
                    "title": h.title,
                },
                "score": 0,
                "reason": "Latest handouts",
                "created_at": h.created_at,
            })

        return Response(fallback_items, status=200)