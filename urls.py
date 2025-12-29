# requestsapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoleUpgradeRequestViewSet

router = DefaultRouter()
router.register(
    r'role-upgrade-requests',
    RoleUpgradeRequestViewSet,
    basename='role-upgrade-request'
)

urlpatterns = [
    path('', include(router.urls)),
]
