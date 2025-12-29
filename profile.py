# recommender/profile.py

def build_interest_profile(interactions):
    profile = {
        "categories": {},
        "tags": {},
    }

    for inter in interactions:
        weight = inter.weight

        for cat in inter.content.categories.all():
            profile["categories"][cat.id] = (
                profile["categories"].get(cat.id, 0) + weight
            )

        for tag in inter.content.tags.all():
            profile["tags"][tag.id] = (
                profile["tags"].get(tag.id, 0) + weight
            )

    return profile
