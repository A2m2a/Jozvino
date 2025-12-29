#handouts/urls.py
from rest_framework.routers import DefaultRouter
from .views import HandoutViewSet
from .public_views import PublicHandoutViewSet
router = DefaultRouter()
router.register(r"handouts", HandoutViewSet, basename="handout")
router.register(
    r"public/handouts",
    PublicHandoutViewSet,
    basename="public-handouts",
)

urlpatterns = router.urls
