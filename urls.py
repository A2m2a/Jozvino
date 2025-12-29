# contents/urls.py

from django.urls import path
from .views import PublicContentFilterAPIView

urlpatterns = [
    path(
        "contents/public/",
        PublicContentFilterAPIView.as_view(),
        name="public-content-filter",
    ),
]
