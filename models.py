# contents/models.py
from django.db import models


class AbstractContent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    publisher = models.ForeignKey(
        "publishers.Publisher",
        on_delete=models.PROTECT,
        related_name="%(class)ss"
    )

    # ✅ Content-based taxonomy
    categories = models.ManyToManyField(
        "categories.Category",
        related_name="contents",
        blank=True,
    )

    tags = models.ManyToManyField(
        "tags.Tag",
        related_name="contents",
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.title
