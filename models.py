# reports/models.py
from django.db import models
from django.conf import settings
from files.models import File


class Report(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("resolved", "Resolved"),
        ("rejected", "Rejected"),
    ]

    ISSUE_CHOICES = [
        ("copyright", "Copyright violation"),
        ("spam", "Spam or misleading"),
        ("inappropriate", "Inappropriate content"),
        ("quality", "Low quality"),
        ("other", "Other"),
    ]

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports"
    )
    file = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name="reports"
    )

    issue_type = models.CharField(
        max_length=32,
        choices=ISSUE_CHOICES
    )
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("reporter", "file")

    def __str__(self):
        return f"{self.reporter} → {self.file} ({self.status})"
