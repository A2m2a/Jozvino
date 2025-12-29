# ratings/models.py
from django.db import models
from accounts.models import User
from files.models import File


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.ForeignKey(File, on_delete=models.CASCADE)

    score = models.IntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "file"],
                name="unique_user_file_rating",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} → {self.file}"
