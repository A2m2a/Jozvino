# recommender/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver

from recommender.models import UserInteraction, Recommendation
from ratings.models import Rating


@receiver(post_save, sender=Rating)
def log_rating_interaction(sender, instance, created, **kwargs):
    if not created:
        return

    file = instance.file
    content = file.book or file.handout

    if not content:
        return

    UserInteraction.objects.create(
        user=instance.user,
        content=content,
        action=UserInteraction.ACTION_RATE,
        weight=5.0,
    )


@receiver(post_save, sender=Recommendation)
def prevent_duplicate_recommendation(sender, instance, created, **kwargs):
    if not created:
        return

    Recommendation.objects.filter(
        user=instance.user,
        content=instance.content,
    ).exclude(id=instance.id).delete()
