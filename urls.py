#accounts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RegisterView, UserViewSet,ChangePasswordView
from .views_password_reset import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path("auth/login/", TokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/register/", RegisterView.as_view()),
    path("auth/password-reset/", PasswordResetRequestView.as_view()),
    path("auth/change-password/", ChangePasswordView.as_view()),
    path(
        "auth/password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
    ),
]

urlpatterns += router.urls

