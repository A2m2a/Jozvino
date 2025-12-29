from django.db.models import Q
from books.models import Book
from handouts.models import Handout


def search_contents(query):
    book_qs = Book.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(publisher__name__icontains=query)
    ).distinct()

    handout_qs = Handout.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(course_name__icontains=query) |
        Q(teacher__icontains=query)
    ).distinct()

    return {
        "books": book_qs,
        "handouts": handout_qs,
    }
