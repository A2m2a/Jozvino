# reports/serializers.py
from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "file",
            "issue_type",
            "description",
            "status",
            "reporter",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "reporter",
            "created_at",
        ]

    def validate_status(self, value):
        """
        Only admin can change report status.
        """
        request = self.context.get("request")

        if request is None:
            return value

        user = request.user
        role = getattr(user.role, "name", None)

        if role != "admin":
            raise serializers.ValidationError(
                "You are not allowed to change report status."
            )

        return value
