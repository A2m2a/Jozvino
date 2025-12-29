# recommender/reasons.py

def build_reason(meta):
    parts = []

    if meta.get("category_match"):
        parts.append(
            f"Because you are interested in {', '.join(meta['category_match'])}"
        )

    if meta.get("tag_match"):
        parts.append(
            f"Related to topics you follow: {', '.join(meta['tag_match'])}"
        )

    if meta.get("popularity"):
        parts.append("Trending among users")
        
    if meta.get("trending"):
        parts.append("Trending recently")

    if meta.get("recency"):
        parts.append("Recently published content")

    return " · ".join(parts)
