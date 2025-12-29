# accounts/models.py
from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):

    def create_user(self, email, username, password=None, **extra_fields):

        if not email:
            raise ValueError("کاربران باید ایمیل داشته باشند.")

        if not username:
            raise ValueError("کاربران باید نام کاربری داشته باشند.")

        email = self.normalize_email(email)

        user = self.model(email=email, username=username, **extra_fields)

        user.set_password(password)

        user.save(using=self._db)

        return user


    def create_superuser(self, email, username, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)

        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("سوپریوزر باید is_staff=True داشته باشد.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("سوپریوزر باید is_superuser=True داشته باشد.")

        return self.create_user(email, username, password, **extra_fields)



class User(AbstractUser):

    email = models.EmailField(unique=True)

    username = models.CharField(max_length=150, unique=True)

    role = models.ForeignKey(
        'roles.Role',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['username']

    objects = UserManager()


    def __str__(self):
        return f"{self.username} ({self.email})"
