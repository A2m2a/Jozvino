# categories/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CategoryTreeViewSet

router = DefaultRouter()
router.register(r'', CategoryViewSet, basename='category')

urlpatterns = [
    # 🔹 tree باید قبل از router باشد
    path('tree/', CategoryTreeViewSet.as_view({'get': 'list'}), name='category-tree'),

    # 🔹 CRUD دسته‌بندی‌ها
    path('', include(router.urls)),
]
