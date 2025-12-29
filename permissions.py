# roles/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS


class RBACPermissionMixin(BasePermission):
    """
    Central RBAC Permission Engine

    Priority:
    1. rbac_permissions[action]
    2. rbac_permissions[HTTP METHOD]
    3. rbac_permissions["*"]
    """

    def has_permission(self, request, view):
        user = request.user

        # 1. Auth check
        if not user or not user.is_authenticated:
            return False

        # Superuser shortcut (optional)
        if getattr(user, "is_superuser", False):
            return True

        role = getattr(user, "role", None)
        if not role:
            return False

        rule = self._get_rule(request, view)
        if not rule:
            return False

        allowed_roles = rule.get("roles", [])
        return role.name in allowed_roles

    def has_object_permission(self, request, view, obj):
        user = request.user
        rule = self._get_rule(request, view)

        # if no owner_only → allowed
        if not rule or not rule.get("owner_only"):
            return True

        return self._is_owner(user, obj)

    # -----------------------
    # Helpers
    # -----------------------

    def _get_rule(self, request, view):
        perms = getattr(view, "rbac_permissions", None)
        if not perms:
            return None

        # 1. DRF action (approve / reject / retrieve / ...)
        if hasattr(view, "action") and view.action in perms:
            return perms[view.action]

        # 2. HTTP method
        method = request.method.upper()
        if method in perms:
            return perms[method]

        # 3. fallback
        return perms.get("*")

    def _is_owner(self, user, obj):
        possible_fields = ["user", "owner", "uploader", "requester"]

        for field in possible_fields:
            if hasattr(obj, field):
                return getattr(obj, field) == user

        return False
