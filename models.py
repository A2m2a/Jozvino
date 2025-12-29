# search/models.py
from django.db import models

from accounts.models import User

from files.models import File


class SearchQuery(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    query = models.CharField(max_length=255)

    related_file = models.ForeignKey(File, on_delete=models.SET_NULL, null=True, blank=True)

    count = models.IntegerField(default=1)

    last_search = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.user} → {self.query}"
