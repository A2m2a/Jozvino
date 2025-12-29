from rest_framework.routers import DefaultRouter
from .views import BookViewSet
from .public_views import PublicBookViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(
    r"public/books",
    PublicBookViewSet,
    basename="public-books",
)
urlpatterns = router.urls
