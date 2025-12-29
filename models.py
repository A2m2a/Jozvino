# recommender/models.py
from django.db import models
from accounts.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class ContentSimilarity(models.Model):
    """
    Stores similarity score between two contents (Book / Handout).
    Used for content-based and hybrid recommendations.
    """

    content_type_1 = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="similarity_content_type_1",
    )
    object_id_1 = models.PositiveIntegerField()
    content1 = GenericForeignKey("content_type_1", "object_id_1")

    content_type_2 = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="similarity_content_type_2",
    )
    object_id_2 = models.PositiveIntegerField()
    content2 = GenericForeignKey("content_type_2", "object_id_2")

    similarity_score = models.FloatField(
        help_text="Similarity score between content1 and content2 (0..1)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("content_type_1", "object_id_1", "content_type_2", "object_id_2")
        indexes = [
            models.Index(fields=["content_type_1", "object_id_1"]),
            models.Index(fields=["content_type_2", "object_id_2"]),
            models.Index(fields=["similarity_score"]),
        ]
        verbose_name = "Content Similarity"
        verbose_name_plural = "Content Similarities"

    def __str__(self):
        return f"{self.content1} ↔ {self.content2} ({self.similarity_score:.2f})"


class UserInteraction(models.Model):
    """
    Logs user behavior on contents.
    Core input for the recommender system.
    """

    ACTION_VIEW = "view"
    ACTION_DOWNLOAD = "download"
    ACTION_RATE = "rate"
    ACTION_SEARCH = "search"

    ACTION_CHOICES = (
        (ACTION_VIEW, "View"),
        (ACTION_DOWNLOAD, "Download"),
        (ACTION_RATE, "Rate"),
        (ACTION_SEARCH, "Search"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="content_interactions",
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="interaction_content_type",
    )
    object_id = models.PositiveIntegerField()
    content = GenericForeignKey("content_type", "object_id")

    action = models.CharField(
        max_length=16,
        choices=ACTION_CHOICES,
    )

    weight = models.FloatField(
        default=1.0,
        help_text="Relative weight of this interaction",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "action"]),
            models.Index(fields=["user", "content_type", "object_id"]),
        ]
        verbose_name = "User Interaction"
        verbose_name_plural = "User Interactions"

    def __str__(self):
        return f"{self.user} {self.action} {self.content}"


class Recommendation(models.Model):
    """
    Final recommendation result for a user.
    Explainable & score-based.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recommendations",
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="recommended_content_type",
    )
    object_id = models.PositiveIntegerField()
    content = GenericForeignKey("content_type", "object_id")

    score = models.FloatField(
        help_text="Final recommendation score"
    )

    reason = models.CharField(
        max_length=255,
        help_text="Human readable explanation",
    )

    reason_meta = models.JSONField(
        default=dict,
        blank=True,
        help_text="Structured explanation data (machine readable)",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "content_type", "object_id")
        indexes = [
            models.Index(fields=["user", "score"]),
            models.Index(fields=["created_at"]),
        ]
        verbose_name = "Recommendation"
        verbose_name_plural = "Recommendations"

    def __str__(self):
        return f"{self.user} → {self.content} ({self.score:.2f})"
