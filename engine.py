# recommender/engine.py

from datetime import timedelta
from django.utils import timezone


RECENCY_DAYS = 14
RECENCY_BOOST = 1.2

POPULARITY_WEIGHT = 0.3
TRENDING_WEIGHT = 0.5

SEEN_PENALTY_FACTOR = 0.5


def apply_rules(
    *,
    content,
    interest_profile,
    popularity_score=None,
    trending_score=None,
    seen=False,
):
    score = 0.0

    reason_meta = {
        "category_match": [],
        "tag_match": [],
    }

    # R1 — category match
    for cat in content.categories.all():
        cat_score = interest_profile["categories"].get(cat.id)
        if cat_score:
            score += cat_score
            reason_meta["category_match"].append(cat.title)

    # R2 — tag match
    for tag in content.tags.all():
        tag_score = interest_profile["tags"].get(tag.id)
        if tag_score:
            score += tag_score * 0.7
            reason_meta["tag_match"].append(tag.title)

    # R3 — recency boost
    is_recent = content.created_at >= timezone.now() - timedelta(days=RECENCY_DAYS)
    if is_recent and score > 0:
        score *= RECENCY_BOOST
        reason_meta["recency"] = True

    # R4 — popularity (long window)
    if popularity_score is not None and popularity_score > 0:
        score += popularity_score * POPULARITY_WEIGHT
        reason_meta["popularity"] = True

    # R5 — trending (short window)
    if trending_score is not None and trending_score > 0:
        score += trending_score * TRENDING_WEIGHT
        reason_meta["trending"] = True

    # R6 — seen penalty
    if seen and score > 0:
        score *= SEEN_PENALTY_FACTOR
        reason_meta["seen_before"] = True

    return round(score, 4), reason_meta
