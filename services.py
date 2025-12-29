# recommender/services.py

import math
from django.utils import timezone

from books.models import Book
from handouts.models import Handout
from files.models import File
from ratings.models import Rating
from recommender.models import Recommendation, UserInteraction

DECAY_DAYS = 30


def time_decay(created_at, now):
    delta_days = (now - created_at).days
    return math.exp(-delta_days / DECAY_DAYS)


def generate_recommendations_for_user(user, limit=10):
    now = timezone.now()

    # ===========================
    # 1️⃣ User interactions
    # ===========================
    interactions = (
        UserInteraction.objects
        .filter(user=user)
        .select_related("content_type")
        .prefetch_related(
            "content__categories",
            "content__tags",
        )
    )

    if not interactions.exists():
        return []

    category_scores = {}
    tag_scores = {}

    for inter in interactions:
        if not inter.content:
            continue

        decay = time_decay(inter.created_at, now)
        weight = inter.weight * decay

        for cat in inter.content.categories.all():
            category_scores[cat.id] = category_scores.get(cat.id, 0) + weight

        for tag in inter.content.tags.all():
            tag_scores[tag.id] = tag_scores.get(tag.id, 0) + weight

    # ===========================
    # 2️⃣ Exclude rated CONTENT
    # ===========================
    rated_file_ids = Rating.objects.filter(user=user).values_list("file_id", flat=True)

    rated_content_ids = set()

    for f in File.objects.filter(id__in=rated_file_ids).only("book_id", "handout_id"):
        if f.book_id:
            rated_content_ids.add(("book", f.book_id))
        if f.handout_id:
            rated_content_ids.add(("handout", f.handout_id))

    # ===========================
    # 3️⃣ Candidate contents
    # ===========================
    books = Book.objects.filter(is_active=True).prefetch_related("categories", "tags")
    handouts = Handout.objects.filter(is_active=True).prefetch_related("categories", "tags")

    candidates = list(books) + list(handouts)

    # ===========================
    # 4️⃣ Score & save
    # ===========================
    Recommendation.objects.filter(user=user).delete()

    recommendations = []

    for content in candidates:
        key = ("book" if isinstance(content, Book) else "handout", content.id)
        if key in rated_content_ids:
            continue

        score = 0.0

        for cat in content.categories.all():
            score += category_scores.get(cat.id, 0)

        for tag in content.tags.all():
            score += tag_scores.get(tag.id, 0)

        if score <= 0:
            continue

        recommendations.append(
            Recommendation(
                user=user,
                content=content,
                score=round(score, 4),
                reason="Based on your recent interests",
            )
        )

    top = sorted(recommendations, key=lambda r: r.score, reverse=True)[:limit]
    Recommendation.objects.bulk_create(top)

    return top
