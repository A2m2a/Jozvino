#books/models.py
from django.db import models
from contents.models import AbstractContent
from categories.models import Category
from tags.models import Tag 

class Book(AbstractContent):
    isbn = models.CharField(
        max_length=13,
        unique=True
    )

    author = models.CharField(
        max_length=255
    )

    published_year = models.PositiveIntegerField()

    language = models.CharField(
        max_length=50,
        default="fa"
    )

    edition = models.CharField(
        max_length=50,
        blank=True
    )

    pages = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    # ----------------------
    # FIX: جلوگیری از تداخل ManyToMany با Handout
    # ----------------------
    categories = models.ManyToManyField(
        Category,
        related_name="books",   # ← جلوگیری از SystemCheckError (E304/E305)
        blank=True,
    )

    tags = models.ManyToManyField(
        Tag,
        related_name="books",   # ← جلوگیری از تداخل کوئری معکوس
        blank=True,
    )
    
    @property
    def cover_image(self):
        return self.files.filter(file_type="image").first()

    class Meta:
        ordering = ["-published_year"]
        verbose_name = "Book"
        verbose_name_plural = "Books"

    def __str__(self):
        return f"{self.title} ({self.isbn})"
