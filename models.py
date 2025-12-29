#handouts/models.py
from django.db import models
from contents.models import AbstractContent
from categories.models import Category
from tags.models import Tag


class Handout(AbstractContent):
    course_name = models.CharField(
        max_length=255
    )

    university = models.CharField(
        max_length=255,
        blank=True
    )

    professor = models.CharField(
        max_length=255,
        blank=True
    )

    semester = models.CharField(
        max_length=50,
        blank=True
    )

    is_official = models.BooleanField(
        default=False
    )

    # ✅ taxonomy مخصوص Handout (رفع E304 / E305)
    categories = models.ManyToManyField(
        Category,
        related_name="handouts",
        blank=True,
    )

    tags = models.ManyToManyField(
        Tag,
        related_name="handouts",
        blank=True,
    )

    @property
    def cover_image(self):
        return self.files.filter(file_type="image").first()
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Handout"
        verbose_name_plural = "Handouts"

    def __str__(self):
        return f"{self.title} - {self.course_name}"
