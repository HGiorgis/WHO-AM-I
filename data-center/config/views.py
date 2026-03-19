"""
Serve frontend SPA: index.html for all non-API routes and static files from frontend_dist/assets.
Used when running in production (single Docker container).
"""
import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse


def serve_spa_index(request):
    """Return frontend index.html for SPA fallback (any path not matched by api/static/assets)."""
    index_path = settings.FRONTEND_DIST / "index.html"
    if not index_path.exists():
        raise Http404("Frontend not built")
    return FileResponse(open(index_path, "rb"), content_type="text/html")


def serve_frontend_asset(request, path):
    """Serve a file from frontend_dist/assets/<path> (JS, CSS, etc.)."""
    assets_dir = settings.FRONTEND_DIST / "assets"
    file_path = (assets_dir / path).resolve()
    if not file_path.is_file() or not str(file_path).startswith(str(assets_dir.resolve())):
        raise Http404()
    content_type, _ = mimetypes.guess_type(str(file_path))
    return FileResponse(open(file_path, "rb"), content_type=content_type or "application/octet-stream")
