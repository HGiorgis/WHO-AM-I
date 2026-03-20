#!/usr/bin/env python3
"""
Telegram bot smoke test: token, webhook registration, and synthetic /more updates.

Run from data-center:
  cd data-center && python tests/bot_test.py

Or from monorepo root (if you add a wrapper):
  python data-center/tests/bot_test.py

Required env:
  TELEGRAM_BOT_TOKEN
  TELEGRAM_CHAT_ID     — user id or group id (e.g. supergroup -1003666380927)

Important env (fixes “commands do nothing” in Telegram):
  TELEGRAM_WEBHOOK_PUBLIC_URL — HTTPS URL Telegram will POST to, e.g.
      https://YOUR-SERVICE.onrender.com/api/telegram/webhook
  If this is not set, getWebhookInfo shows "url": "" and NO chat command reaches Django.

Optional:
  WEBHOOK_URL          — where bot_test POSTs fake updates (default: http://127.0.0.1:8000/api/telegram/webhook)
  SKIP_WEBHOOK         — "1" = don’t POST fake updates to Django
  SEND_TEST_MESSAGE    — "1" = send a ping via Telegram API
  SET_TELEGRAM_WEBHOOK — "1" force setWebhook again (e.g. wrong host). If webhook url is empty and TELEGRAM_WEBHOOK_PUBLIC_URL is set, setWebhook runs automatically.

Group commands: use /more@siteVisitor_bot (privacy mode). /check is same as /check-more.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


def _load_dotenv_files():
    here = Path(__file__).resolve().parent
    roots = [
        here.parent,
        here.parent.parent,
        here.parent.parent / "data-center",
    ]
    seen = set()
    for base in roots:
        p = base / ".env"
        if p in seen or not p.is_file():
            continue
        seen.add(p)
        try:
            for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, _, v = line.partition("=")
                k, v = k.strip(), v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v
        except OSError:
            pass


_load_dotenv_files()

TOKEN = (os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip()
CHAT_ID_RAW = (os.environ.get("TELEGRAM_CHAT_ID") or "").strip()
WEBHOOK_URL = (
    os.environ.get("WEBHOOK_URL") or "http://127.0.0.1:8000/api/telegram/webhook"
).strip()
SKIP_WEBHOOK = os.environ.get("SKIP_WEBHOOK", "").strip() in ("1", "true", "yes")
SEND_TEST_MESSAGE = os.environ.get("SEND_TEST_MESSAGE", "").strip() in ("1", "true", "yes")
# Full HTTPS URL for Telegram (Render, etc.) — NOT the same as WEBHOOK_URL (local test target)
WEBHOOK_PUBLIC = (os.environ.get("TELEGRAM_WEBHOOK_PUBLIC_URL") or "").strip()
# "1" = call setWebhook even if Telegram already has a URL (update / fix wrong host)
SET_TELEGRAM_WEBHOOK = os.environ.get("SET_TELEGRAM_WEBHOOK", "").strip() in ("1", "true", "yes")


def tg_api(method: str, params: dict | None = None) -> dict:
    q = ""
    if params:
        from urllib.parse import urlencode

        q = "?" + urlencode(params)
    url = f"https://api.telegram.org/bot{TOKEN}/{method}{q}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def tg_post(method: str, body: dict) -> dict:
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def post_json(target: str, payload: dict) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        target, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        return e.code, body
    except urllib.error.URLError as e:
        return -1, str(e.reason)


def parse_chat_id(raw: str):
    if not raw:
        return None
    s = raw.strip()
    try:
        return int(s)
    except ValueError:
        return s


def fake_update(text: str, chat_id) -> dict:
    return {
        "update_id": 9_999_001,
        "message": {
            "message_id": 9_999_002,
            "date": 1_700_000_000,
            "chat": {"id": chat_id, "type": "private"},
            "from": {
                "id": chat_id if not str(chat_id).startswith("-100") else 1,
                "is_bot": False,
                "first_name": "WebhookTest",
            },
            "text": text,
        },
    }


def print_webhook_help() -> None:
    print(
        "\n"
        + "=" * 72
        + "\n*** FIX: Webhook url is \"\" — Telegram NEVER POSTs chat commands to your app ***\n"
        + "=" * 72
        + "\n\n"
        "1) Deploy Django with HTTPS (e.g. Render).\n"
        "2) Set TELEGRAM_WEBHOOK_PUBLIC_URL to:\n"
        "     https://YOUR-HOST/api/telegram/webhook\n"
        "3) Run this script again (it will call setWebhook automatically).\n\n"
        "   PowerShell:\n"
        '     $env:TELEGRAM_WEBHOOK_PUBLIC_URL="https://hgiorgis.onrender.com/api/telegram/webhook"\n'
        "     python tests/bot_test.py\n\n"
        "4) getWebhookInfo should then show that url. Try in the group:\n"
        "     /more@YourBot   /help@YourBot\n\n"
        "Or set TELEGRAM_WEBHOOK_PUBLIC_URL on Render — Django calls setWebhook on startup.\n",
        file=sys.stderr,
    )


def run_set_webhook() -> None:
    print("\n== setWebhook → TELEGRAM_WEBHOOK_PUBLIC_URL ==")
    print("   ", WEBHOOK_PUBLIC)
    try:
        out = tg_post("setWebhook", {"url": WEBHOOK_PUBLIC})
        print(json.dumps(out, indent=2))
        if not out.get("ok"):
            print("setWebhook failed", file=sys.stderr)
            return
        info = tg_api("getWebhookInfo")
        print("\n== getWebhookInfo (after set) ==")
        print(json.dumps(info, indent=2))
    except Exception as e:
        print("setWebhook error:", e, file=sys.stderr)


def main() -> int:
    if not TOKEN:
        print("ERROR: Set TELEGRAM_BOT_TOKEN", file=sys.stderr)
        return 1

    print("== 1) getMe ==")
    try:
        me = tg_api("getMe")
        print(json.dumps(me, indent=2))
        if not me.get("ok"):
            return 1
    except Exception as e:
        print("ERROR:", e, file=sys.stderr)
        return 1

    print("\n== 2) getWebhookInfo ==")
    wh = tg_api("getWebhookInfo")
    print(json.dumps(wh, indent=2))
    res = wh.get("result") or {}
    current_url = (res.get("url") or "").strip()
    if res.get("last_error_message"):
        print(f"\n*** last_error_message: {res.get('last_error_message')}")

    if WEBHOOK_PUBLIC and (not current_url or SET_TELEGRAM_WEBHOOK):
        run_set_webhook()
    elif not current_url:
        print_webhook_help()
    elif WEBHOOK_PUBLIC and current_url != WEBHOOK_PUBLIC.rstrip("/"):
        print(
            f"\nNote: Telegram webhook is:\n  {current_url}\n"
            f"TELEGRAM_WEBHOOK_PUBLIC_URL is:\n  {WEBHOOK_PUBLIC}\n"
            "Set SET_TELEGRAM_WEBHOOK=1 to overwrite with TELEGRAM_WEBHOOK_PUBLIC_URL."
        )

    chat_id = parse_chat_id(CHAT_ID_RAW)
    if chat_id is None:
        print("\n(Optional) Set TELEGRAM_CHAT_ID for local Django POST tests.", file=sys.stderr)
        return 0

    if not SKIP_WEBHOOK:
        print("\n== 3) POST synthetic /more to Django (local test only) ==")
        print(f"    URL: {WEBHOOK_URL}")
        pl = fake_update("/more", chat_id)
        code, body = post_json(WEBHOOK_URL, pl)
        print(f"    HTTP {code}  body[:200]: {body[:200]}")

    if SEND_TEST_MESSAGE:
        print("\n== 5) sendMessage ping ==")
        try:
            sm = tg_post(
                "sendMessage",
                {
                    "chat_id": chat_id,
                    "text": (
                        "bot_test.py OK.\n"
                        "Production: set TELEGRAM_WEBHOOK_PUBLIC_URL on server (Django syncs webhook on start).\n"
                        "Try: /more  /help"
                    ),
                },
            )
            print(json.dumps(sm, indent=2))
        except Exception as e:
            print("sendMessage failed:", e, file=sys.stderr)
            return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
