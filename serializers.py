# requestsapp/serializers.py
from rest_framework import serializers

from requestsapp.models import RoleUpgradeRequest


class RoleUpgradeRequestSerializer(serializers.ModelSerializer):
    # ✅ Readable output for frontend
    requested_role_name = serializers.SerializerMethodField()

    class Meta:
        model = RoleUpgradeRequest
        fields = [
            "id",
            "user",                 # read-only (owner)
            "requested_role",
            "requested_role_name",  # ✅ human-readable
            "status",
            "created_at",
            "reviewed_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "status",
            "created_at",
            "reviewed_at",
        ]

    # ✅ جلوگیری از ارسال چند درخواست pending
    def validate(self, data):
        request = self.context["request"]
        user = request.user

        if RoleUpgradeRequest.objects.filter(
            user=user,
            status="pending"
        ).exists():
            raise serializers.ValidationError(
                "You already have a pending role upgrade request."
            )

        return data

    # ✅ Human-readable role name
    def get_requested_role_name(self, obj):
        return obj.requested_role.name
