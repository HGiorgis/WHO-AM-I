import os
import sys

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        # Avoid double-run with django runserver parent process
        if "runserver" in sys.argv and os.environ.get("RUN_MAIN") != "true":
            return
        from django.conf import settings

        if not getattr(settings, "TELEGRAM_SYNC_WEBHOOK", True):
            return
        url = getattr(settings, "TELEGRAM_WEBHOOK_PUBLIC_URL", "") or ""
        if not url:
            return
        try:
            from .telegram_notify import register_telegram_webhook

            register_telegram_webhook(url)
        except Exception:
            pass
