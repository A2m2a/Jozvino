#accounts/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model

from rest_framework.exceptions import ValidationError
from .serializers import UserSerializer, RegisterSerializer,ChangePasswordSerializer
from roles.permissions import RBACPermissionMixin
from .serializers import UserAvatarSerializer

User = get_user_model()


# 🔹 Public Register (NO RBAC)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "role": user.role.name,
            },
            status=status.HTTP_201_CREATED,
        )


# 🔹 Users (RBAC Controlled)

class UserViewSet(RBACPermissionMixin, viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    rbac_permissions = {
        "GET": {"roles": ["admin", "editor", "viewer"]},
        "POST": {"roles": ["admin"]},
        "PUT": {"roles": ["admin"]},
        "PATCH": {"roles": ["admin"]},   # فقط ادمین روی همه
        "DELETE": {"roles": ["admin"]},
        "me": {
            "GET": {"roles": ["admin", "editor", "viewer"]},
            "PATCH": {"roles": ["admin", "editor", "viewer"]},  # ✅ کلیدی
        },
    }

    def get_queryset(self):
        user = self.request.user
        if user.role and user.role.name == "admin":
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        if request.method == "GET":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["patch"],
        url_path="me/avatar",
        permission_classes=[IsAuthenticated],
    )
    def update_avatar(self, request):
        serializer = UserAvatarSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "detail": "آواتار با موفقیت بروزرسانی شد",
            "avatar": serializer.data["avatar"]
        })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            print("PASSWORD VALIDATION ERROR:", e.detail)
            raise

        user = request.user
        old_password = serializer.validated_data["old_password"]

        if not user.check_password(old_password):
            print("OLD PASSWORD IS WRONG")
            return Response(
                {"detail": "رمز عبور فعلی اشتباه است"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"force_logout": True},
            status=status.HTTP_200_OK,
        )