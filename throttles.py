# search/throttles.py
from rest_framework.throttling import SimpleRateThrottle


class PublicSearchRateThrottle(SimpleRateThrottle):
    scope = "public_search"

    def get_cache_key(self, request, view):
        # Rate-limit بر اساس IP
        if request.user and request.user.is_authenticated:
            # Public endpoint است، ولی اگر auth هم بود، باز IP-based محدود می‌شود
            ident = self.get_ident(request)
        else:
            ident = self.get_ident(request)

        return f"throttle_public_search_{ident}"
