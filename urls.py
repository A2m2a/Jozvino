# search/urls.py
from django.urls import path
from .views import (
    ContentSearchAPIView,
    PublicContentSearchAPIView,
)

urlpatterns = [
    path("contents/search/", ContentSearchAPIView.as_view()),
    path("contents/search/public/", PublicContentSearchAPIView.as_view()),
]
