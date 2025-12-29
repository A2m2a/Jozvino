# requestsapp/permissions.py
from rest_framework.permissions import BasePermission


class IsAdminOrCreateOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False

        if request.method == "POST":
            return True

        return request.user.is_staff
