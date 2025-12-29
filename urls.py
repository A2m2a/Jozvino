# recommender/urls.py
from rest_framework.routers import DefaultRouter
from .views import ContentSimilarityViewSet, RecommendationViewSet,UserInteractionViewSet

router = DefaultRouter()
router.register(r'content-similarity', ContentSimilarityViewSet, basename='content-similarity')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(
    r"interactions",
    UserInteractionViewSet,
    basename="user-interaction",
)
urlpatterns = router.urls
