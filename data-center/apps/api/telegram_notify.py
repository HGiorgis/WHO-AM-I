"""
Send notifications to Telegram. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in env.
Uses HTML formatting for a clean, professional look.
When a new visitor is notified, their session_id is cached so /more in the group returns details.
"""
import json
import urllib.request
from django.conf import settings
from django.core.cache import cache

# Cache key and TTL for "last notified visitor" (so bot can answer /more)
TELEGRAM_LAST_VISITOR_CACHE_KEY = "telegram_last_visitor_session_id"
TELEGRAM_LAST_VISITOR_CACHE_TTL = 86400  # 24 hours
TELEGRAM_LAST_CONTACT_ID_KEY = "telegram_last_contact_message_id"
TELEGRAM_LAST_CONTACT_ID_TTL = 86400


def telegram_inbox_inline_keyboard():
    """Under /more: mark latest notified contact (cache) + mark all."""
    return {
        "inline_keyboard": [
            [{"text": "✓ Mark latest contact read", "callback_data": "inbox_read_latest"}],
            [{"text": "✓ Mark all inbox read", "callback_data": "inbox_read_all"}],
        ]
    }


def telegram_contact_inline_keyboard(contact_message_id: int):
    """Per contact notification: mark this DB row + mark all (callback_data max 64 bytes)."""
    cid = int(contact_message_id)
    one = f"inbox_one:{cid}"
    if len(one) > 64:
        one = "inbox_read_latest"
    return {
        "inline_keyboard": [
            [{"text": "✓ Mark this message read", "callback_data": one}],
            [{"text": "✓ Mark all inbox read", "callback_data": "inbox_read_all"}],
        ]
    }


def register_telegram_webhook(webhook_url: str) -> bool:
    """Call Telegram setWebhook. Returns True if API reports ok."""
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "") or ""
    url = (webhook_url or "").strip()
    if not token or not url:
        return False
    try:
        body = json.dumps({"url": url}).encode("utf-8")
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{token}/setWebhook",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read().decode("utf-8"))
        return bool(data.get("ok"))
    except Exception:
        return False


def _escape_html(s):
    if not s:
        return ""
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def send_telegram_message(text, parse_mode="HTML", disable_preview=True, chat_id=None, reply_markup=None):
    """Fire-and-forget: send text to Telegram. chat_id overrides TELEGRAM_CHAT_ID when replying in a group.
    parse_mode=None → plain text (no HTML). reply_markup = Telegram inline_keyboard dict."""
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "") or ""
    cid = chat_id if chat_id is not None else (getattr(settings, "TELEGRAM_CHAT_ID", "") or "")
    if not token or not cid:
        return
    try:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        body = {
            "chat_id": cid,
            "text": text,
            "disable_web_page_preview": disable_preview,
        }
        if parse_mode is not None:
            body["parse_mode"] = parse_mode
        if reply_markup:
            body["reply_markup"] = reply_markup
        payload = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urllib.request.urlopen(req, timeout=8)
    except Exception:
        pass  # do not fail the main request


def answer_telegram_callback_query(callback_query_id, text=None, show_alert=False):
    """Required after inline button taps so Telegram stops the loading spinner."""
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "") or ""
    if not token or not callback_query_id:
        return
    try:
        url = f"https://api.telegram.org/bot{token}/answerCallbackQuery"
        body = {"callback_query_id": callback_query_id}
        if text is not None:
            body["text"] = text[:200]
            body["show_alert"] = bool(show_alert)
        payload = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urllib.request.urlopen(req, timeout=8)
    except Exception:
        pass


def notify_contact_message(name, email, message, contact_message_id=None):
    """Short contact alert + mark-read buttons (HTML). Caches message id before send for callbacks."""
    if contact_message_id is not None:
        try:
            cache.set(TELEGRAM_LAST_CONTACT_ID_KEY, int(contact_message_id), TELEGRAM_LAST_CONTACT_ID_TTL)
        except (TypeError, ValueError):
            pass

    name = _escape_html(name).strip() or "—"
    email = _escape_html(email).strip() or "—"
    raw_msg = (message or "").strip().replace("\r\n", "\n").replace("\n", " ")
    preview = _escape_html(raw_msg[:220] + ("…" if len(raw_msg) > 220 else "")) or "—"

    site_url = getattr(settings, "SITE_URL", "") or ""
    site_link = ""
    if site_url:
        try:
            from urllib.parse import urlparse

            parsed = urlparse(site_url)
            netloc = (parsed.netloc or parsed.path or "").lstrip("/")
            if netloc.startswith("www."):
                netloc = netloc[4:]
            label = _escape_html(netloc or "Dashboard")
            site_link = f'\n— <a href="{site_url.rstrip("/")}/owner">{label}</a>'
        except Exception:
            site_link = ""

    text = (
        "<b>📩 New contact</b>\n"
        f"👤 {name} · ✉️ {email}\n"
        f"📝 {preview}"
        f"{site_link}",
    )
    markup = (
        telegram_contact_inline_keyboard(int(contact_message_id))
        if contact_message_id is not None
        else telegram_inbox_inline_keyboard()
    )
    send_telegram_message(text, reply_markup=markup)


def _country_flag_emoji(code):
    if not code or len(code) != 2:
        return ""
    code = code.upper()
    try:
        return chr(0x1F1E6 - 65 + ord(code[0])) + chr(0x1F1E6 - 65 + ord(code[1]))
    except Exception:
        return ""


def notify_new_visitor(session_id, ip_address, country_code):
    """Send a clean new visitor notification and cache session_id so /more returns details."""
    ip = _escape_html(ip_address or "—")
    country = _escape_html(country_code or "—")
    flag = _country_flag_emoji(country_code) if country_code else "🌍"

    site_url = getattr(settings, "SITE_URL", "") or ""
    parts = [
        " <b>New unique visitor</b>",
        "",
        f" <b>— IP:</b> {ip}",
        f" <b>— Location:</b> {flag} {country}",
        "",
        "💬 Reply <b>/more</b> for full details.",
    ]
    if site_url:
        parts.append("")
        parts.append(f'—  <a href="{site_url}/owner">View analytics</a>')

    text = "\n".join(parts)
    send_telegram_message(text)

    if session_id:
        cache.set(TELEGRAM_LAST_VISITOR_CACHE_KEY, session_id, TELEGRAM_LAST_VISITOR_CACHE_TTL)
