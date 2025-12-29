# files/models.py
from django.db import models
from django.db.models import Q
from django.conf import settings


class File(models.Model):
    FILE_TYPES = (
        ("image", "Image"),
        ("pdf", "PDF"),
        ("epub", "EPUB"),
        ("doc", "DOC"),
    )

    file = models.FileField(upload_to="files/")
    file_type = models.CharField(
        max_length=10,
        choices=FILE_TYPES,
    )

    # Content relation (exactly one required)
    book = models.ForeignKey(
        "books.Book",
        on_delete=models.CASCADE,
        related_name="files",
        null=True,
        blank=True,
    )
    handout = models.ForeignKey(
        "handouts.Handout",
        on_delete=models.CASCADE,
        related_name="files",
        null=True,
        blank=True,
    )

    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_files",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    (Q(book__isnull=False) & Q(handout__isnull=True)) |
                    (Q(book__isnull=True) & Q(handout__isnull=False))
                ),
                name="file_must_belong_to_exactly_one_content",
            )
        ]

    def __str__(self):
        content = self.book or self.handout
        return f"{self.file.name} ({content})"
