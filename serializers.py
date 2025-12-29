# ratings/serializers.py
from rest_framework import serializers
from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source="user.email")

    # ✅ کنترل بازه امتیاز (پیشنهاد حرفه‌ای، غیرمزاحم)
    score = serializers.IntegerField(min_value=1, max_value=5)

    score_min = serializers.SerializerMethodField()
    score_max = serializers.SerializerMethodField()

    def get_score_min(self):
        return 1

    def get_score_max(self):
        return 5
    
    class Meta:
        model = Rating
        fields = [
            "id",
            "file",
            "score",
            "comment",
            "user",
            "user_email",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "user_email",
            "created_at",
        ]

    def validate(self, data):
        request = self.context["request"]
        user = request.user

        # ✅ Safe role check (جلوگیری از AttributeError)
        if getattr(user.role, "name", None) == "admin":
            raise serializers.ValidationError(
                "ادمین نمی‌تواند امتیاز ثبت کند."
            )

        # ✅ جلوگیری از ثبت امتیاز تکراری
        if request.method == "POST":
            file = data.get("file")
            if Rating.objects.filter(user=user, file=file).exists():
                raise serializers.ValidationError(
                    "شما قبلاً به این فایل امتیاز داده‌اید."
                )

        return data
