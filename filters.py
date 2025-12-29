#files/filters.py

import django_filters
from django.db.models import Q

from .models import File
from categories.models import Category


class FileFilter(django_filters.FilterSet):
    """
    Filters for File model
    """

    # simple filters
    category = django_filters.NumberFilter(method='filter_by_category')
    file_type = django_filters.CharFilter(field_name='file_type', lookup_expr='iexact')
    is_free = django_filters.BooleanFilter(field_name='is_free')
    verified = django_filters.BooleanFilter(field_name='verified')
    uploader = django_filters.NumberFilter(field_name='uploader_id')

    # numeric filters
    min_pages = django_filters.NumberFilter(field_name='pages', lookup_expr='gte')
    max_pages = django_filters.NumberFilter(field_name='pages', lookup_expr='lte')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    # text filters
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = File
        fields = [
            'category',
            'file_type',
            'is_free',
            'verified',
            'uploader',
            'min_pages',
            'max_pages',
            'min_price',
            'max_price',
            'title',
        ]

    # ------------------------------------------------------------------
    # Recursive category filter (works without related_name)
    # ------------------------------------------------------------------
    def filter_by_category(self, queryset, name, value):
        """
        Filters files by category and all its descendants
        """

        try:
            root_category = Category.objects.get(id=value)
        except Category.DoesNotExist:
            return queryset.none()

        def get_descendant_ids(category):
            """
            Recursively collect id of category and all its children
            """
            ids = [category.id]
            children = Category.objects.filter(parent=category)
            for child in children:
                ids.extend(get_descendant_ids(child))
            return ids

        category_ids = get_descendant_ids(root_category)

        return queryset.filter(
            category_id__in=category_ids
        ).distinct()
