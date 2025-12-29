# recommender/popularity.py

from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone
from recommender.models import UserInteraction

POPULARITY_WINDOW_DAYS = 30
TRENDING_WINDOW_DAYS = 7


def get_popularity_map():
    since = timezone.now() - timedelta(days=POPULARITY_WINDOW_DAYS)

    qs = (
        UserInteraction.objects
        .filter(created_at__gte=since)
        .values("content_type_id", "object_id")
        .annotate(score=Sum("weight"))
    )

    return {
        (row["content_type_id"], row["object_id"]): float(row["score"])
        for row in qs
    }


def get_trending_map():
    now = timezone.now()
    recent_since = now - timedelta(days=TRENDING_WINDOW_DAYS)
    past_since = now - timedelta(days=2 * TRENDING_WINDOW_DAYS)

    recent = (
        UserInteraction.objects
        .filter(created_at__gte=recent_since)
        .values("content_type_id", "object_id")
        .annotate(score=Sum("weight"))
    )

    past = (
        UserInteraction.objects
        .filter(
            created_at__gte=past_since,
            created_at__lt=recent_since,
        )
        .values("content_type_id", "object_id")
        .annotate(score=Sum("weight"))
    )

    past_map = {
        (r["content_type_id"], r["object_id"]): float(r["score"])
        for r in past
    }

    trending = {}

    for r in recent:
        key = (r["content_type_id"], r["object_id"])
        diff = float(r["score"]) - past_map.get(key, 0)
        if diff > 0:
            trending[key] = diff

    return trending
