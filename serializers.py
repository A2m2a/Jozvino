# categories/serializers.py
from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """
    ✅ Serializer عمومی (CRUD / Admin / Filter)
    """
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "created_at",
        )
        read_only_fields = (
            "id",
            "created_at",
        )


class CategoryTreeSerializer(serializers.ModelSerializer):
    """
    ✅ Serializer مخصوص منو / Navigation (Next.js)
    فقط دسته‌های فرزند را به‌صورت بازگشتی برمی‌گرداند
    """
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "children",
        )

    def get_children(self, obj):
        # فقط یک سطح جلوتر ← recursion خودش ادامه می‌دهد
        children = obj.children.all()
        return CategoryTreeSerializer(children, many=True).data
