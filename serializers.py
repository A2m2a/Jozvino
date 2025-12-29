#accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from roles.models import Role
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions
from .models import User

User = get_user_model()


# 🔹 نمایش کاربر
class UserSerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Role.objects.all(),
        required=False
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "role",
            "date_joined",
            "last_login",
        )
        read_only_fields = ("id", "date_joined", "last_login")


# 🔹 ثبت‌نام

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "password_confirm")

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as errors:
            translated = {
                "This password is too short.":
                    "رمز عبور باید حداقل ۸ کاراکتر باشد",
                "This password is too common.":
                    "رمز عبور بیش از حد ساده است",
                "This password is entirely numeric.":
                    "رمز عبور نباید فقط عدد باشد",
                "The password is too similar to the username.":
                    "رمز عبور نباید شبیه نام کاربری باشد",
            }

            messages = [
                translated.get(str(e), "رمز عبور معتبر نیست")
                for e in errors
            ]
            raise serializers.ValidationError(messages)

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "رمز عبور و تکرار آن یکسان نیستند"}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )

        try:
            user.role = Role.objects.get(name="viewer")
            user.save()
        except Role.DoesNotExist:
            pass

        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as errors:
            translated = {
                "This password is too short.":
                    "رمز عبور باید حداقل ۸ کاراکتر باشد",
                "This password is too common.":
                    "رمز عبور انتخاب‌شده بیش از حد ساده است",
                "This password is entirely numeric.":
                    "رمز عبور نباید فقط عدد باشد",
                "The password is too similar to the username.":
                    "رمز عبور نباید شبیه نام کاربری باشد",
            }

            messages = [
                translated.get(str(e), "رمز عبور معتبر نیست")
                for e in errors
            ]

            raise serializers.ValidationError(messages)

        return value
    
class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("avatar",)

    def validate_avatar(self, value):
        # محدودیت اختیاری
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("حجم تصویر نباید بیشتر از ۲ مگابایت باشد")
        return value    