# files/utils.py

from django.http import FileResponse
import os


def serve_file(file_obj):
    file_path = file_obj.file.path  # فرض: FileField به اسم file داری

    return FileResponse(
        open(file_path, "rb"),
        as_attachment=True,
        filename=os.path.basename(file_path),
    )
