#recommender/utils.py
def normalize_scores(score_map):
    if not score_map:
        return {}

    max_score = max(score_map.values()) or 1

    return {
        k: round(v / max_score, 4)
        for k, v in score_map.items()
    }
