# books/filters.py
import django_filters
from .models import Book


class BookFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(
        field_name="categories__id",
        lookup_expr="exact"
    )
    tag = django_filters.NumberFilter(
        field_name="tags__id",
        lookup_expr="exact"
    )
    publisher = django_filters.CharFilter(
        field_name="publisher__name",
        lookup_expr="icontains"
    )
    is_active = django_filters.BooleanFilter()

    search = django_filters.CharFilter(
        method="filter_search"
    )

    class Meta:
        model = Book
        fields = [
            "category",
            "tag",
            "publisher",
            "is_active",
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            title__icontains=value
        ) | queryset.filter(
            description__icontains=value
        )
