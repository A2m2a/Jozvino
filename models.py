# requestsapp/models.py
from django.db import models
from django.conf import settings
from roles.models import Role


class RoleUpgradeRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="role_requests"
    )
    requested_role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="upgrade_requests"
    )

    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "requested_role")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} → {self.requested_role} ({self.status})"
