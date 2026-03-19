"""
Owner API authentication: single key from settings (env OWNER_KEY).
Frontend sends X-Owner-Key or Authorization: Key <key>.
"""
import hmac
import hashlib
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response


def get_owner_key_from_request(request):
    key = request.headers.get("X-Owner-Key") or request.headers.get("Authorization")
    if key and key.startswith("Key "):
        key = key[4:].strip()
    return key or ""


def validate_owner_key(key):
    expected = getattr(settings, "OWNER_KEY", None) or ""
    if not expected:
        return False
    return hmac.compare_digest(key, expected)


def owner_key_required(view_func):
    """Decorator: require valid owner key or return 401."""

    def wrapped(request, *args, **kwargs):
        key = get_owner_key_from_request(request)
        if not validate_owner_key(key):
            return Response(
                {"detail": "Invalid or missing owner key."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return view_func(request, *args, **kwargs)

    return wrapped
