#project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('admin/', admin.site.urls),

    # مسیرهای API برای هر اپ
    path('api/', include('accounts.urls')),
    path('api/roles/', include('roles.urls')),
    path('api/files/', include('files.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/publishers/', include('publishers.urls')),
    path('api/tags/', include('tags.urls')),
    path('api/ratings/', include('ratings.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/requestsapp/', include('requestsapp.urls')),
    path('api/search/', include('search.urls')),
    path('api/recommender/', include('recommender.urls')),
    path('api/', include('handouts.urls')),
    path('api/', include('books.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
