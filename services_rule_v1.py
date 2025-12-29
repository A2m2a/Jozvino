# recommender/services_rule_v1.py

from books.models import Book
from handouts.models import Handout

from recommender.engine import apply_rules
from recommender.profile import build_interest_profile
from recommender.reasons import build_reason
from recommender.models import Recommendation, UserInteraction
from recommender.popularity import get_popularity_map, get_trending_map
from recommender.utils import normalize_scores


def generate_rule_based_recommendations(user, limit=10):
    interactions = UserInteraction.objects.filter(user=user)

    if not interactions.exists():
        return []

    profile = build_interest_profile(interactions)

    Recommendation.objects.filter(user=user).delete()

    popularity_map = normalize_scores(get_popularity_map())
    trending_map = normalize_scores(get_trending_map())

    candidates = (
        list(Book.objects.filter(is_active=True)) +
        list(Handout.objects.filter(is_active=True))
    )

    recs = []

    seen_keys = {
        (i.content_type_id, i.object_id)
        for i in interactions
    }

    for content in candidates:
        key = (content._meta.model_name, content.id)

        score, meta = apply_rules(
            content=content,
            interest_profile=profile,
            popularity_score=popularity_map.get(key),
            trending_score=trending_map.get(key),
            seen=key in seen_keys,
        )

        if score <= 0:
            continue

        recs.append(
            Recommendation(
                user=user,
                content=content,
                score=score,
                reason=build_reason(meta),
                reason_meta=meta,
            )
        )

    top = sorted(recs, key=lambda r: r.score, reverse=True)[:limit]
    Recommendation.objects.bulk_create(top)
    return top
