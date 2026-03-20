import os
from urllib.parse import urlparse
from django.conf import settings
from django.utils import timezone
from django.db.models import Prefetch
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Project, VisitorSession, PageView, VisitorEvent, ContactMessage, ContentBlock
from .serializers import ProjectSerializer
from .owner_auth import get_owner_key_from_request, validate_owner_key, owner_key_required


def _get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or ""


def _get_country_for_ip(ip):
    if not ip or ip in ("127.0.0.1", "::1"):
        return ""
    try:
        import urllib.request
        url = f"http://ip-api.com/json/{ip}?fields=countryCode"
        with urllib.request.urlopen(url, timeout=2) as r:
            import json
            data = json.loads(r.read().decode())
            return (data.get("countryCode") or "")[:4]
    except Exception:
        return ""


def _parse_period(period):
    """Return (start_time, end_time) for period string."""
    now = timezone.now()
    period = (period or "week").lower()
    if period == "day":
        start = now - timezone.timedelta(days=1)
    elif period == "month":
        start = now - timezone.timedelta(days=30)
    elif period == "year":
        start = now - timezone.timedelta(days=365)
    else:
        start = now - timezone.timedelta(weeks=1)
    return start, now


def _classify_traffic(referrer, utm_medium, utm_source):
    """Rough bucket: direct, organic, social, referral."""
    ref = (referrer or "").strip().lower()
    um = (utm_medium or "").strip().lower()
    us = (utm_source or "").strip().lower()
    if um == "cpc" or um == "paid" or us == "google" and um:
        return "paid"
    if um == "organic" or "google." in ref or "bing." in ref or "duckduckgo." in ref:
        return "organic"
    social_hosts = ("twitter.", "t.co", "facebook.", "fb.", "instagram.", "linkedin.", "tiktok.", "reddit.")
    if any(h in ref for h in social_hosts):
        return "social"
    if not ref or ref in ("", "direct"):
        return "direct"
    return "referral"


def _parse_user_agent_heuristic(ua):
    """Best-effort device / browser / OS from User-Agent (no extra deps)."""
    ua = (ua or "")[:512]
    ul = ua.lower()
    if "iphone" in ul or ("android" in ul and "mobile" in ul) or ("mobile" in ul and "ipad" not in ul):
        device = "mobile"
    elif "ipad" in ul or "tablet" in ul:
        device = "tablet"
    else:
        device = "desktop"
    browser = "other"
    if "edg/" in ul:
        browser = "Edge"
    elif "chrome" in ul and "chromium" not in ul:
        browser = "Chrome"
    elif "safari" in ul and "chrome" not in ul:
        browser = "Safari"
    elif "firefox" in ul:
        browser = "Firefox"
    os_name = "other"
    if "windows" in ul:
        os_name = "Windows"
    elif "mac os" in ul or "macintosh" in ul:
        os_name = "macOS"
    elif "android" in ul:
        os_name = "Android"
    elif "iphone" in ul or "ipad" in ul:
        os_name = "iOS"
    elif "linux" in ul:
        os_name = "Linux"
    return device, browser, os_name


def _apply_session_context(session, request, context):
    """Merge client-reported context into VisitorSession (only fills blanks)."""
    if not context or not isinstance(context, dict):
        context = {}
    updates = {}
    server_ua = (request.META.get("HTTP_USER_AGENT") or "")[:512]
    ua = (context.get("userAgent") or context.get("user_agent") or server_ua or "")[:512]
    if ua and not session.user_agent:
        updates["user_agent"] = ua
        d, b, o = _parse_user_agent_heuristic(ua)
        if not session.device_type:
            updates["device_type"] = context.get("deviceType") or context.get("device_type") or d
        if not session.browser:
            updates["browser"] = context.get("browser") or b
        if not session.os:
            updates["os"] = context.get("os") or context.get("platform") or o
    elif context.get("deviceType") and not session.device_type:
        updates["device_type"] = context.get("deviceType") or context.get("device_type")
    if context.get("browser") and not session.browser:
        updates["browser"] = context.get("browser")[:64]
    if context.get("os") and not session.os:
        updates["os"] = context.get("os")[:64]
    ref = (context.get("referrer") or context.get("documentReferrer") or "")[:2048]
    if ref and not session.referrer:
        updates["referrer"] = ref
    lp = (context.get("landingPath") or context.get("landing_path") or "")[:500]
    if lp and not session.landing_path:
        updates["landing_path"] = lp
    usrc = (context.get("utm_source") or context.get("utmSource") or "")[:128]
    umed = (context.get("utm_medium") or context.get("utmMedium") or "")[:128]
    ucamp = (context.get("utm_campaign") or context.get("utmCampaign") or "")[:128]
    if usrc and not session.utm_source:
        updates["utm_source"] = usrc
    if umed and not session.utm_medium:
        updates["utm_medium"] = umed
    if ucamp and not session.utm_campaign:
        updates["utm_campaign"] = ucamp
    eff_ref = updates.get("referrer", session.referrer)
    eff_us = updates.get("utm_source", session.utm_source)
    eff_um = updates.get("utm_medium", session.utm_medium)
    ttype = _classify_traffic(eff_ref, eff_um, eff_us)
    if not session.traffic_type:
        updates["traffic_type"] = ttype
    if updates:
        for k, v in updates.items():
            setattr(session, k, v)
        session.last_seen_at = timezone.now()
        session.save(update_fields=list(updates.keys()) + ["last_seen_at"])



# ---------- Owner: validate key (no auth) ----------
@csrf_exempt
@require_http_methods(["POST"])
def owner_validate(request):
    """POST /api/owner/validate  Body: { "key": "..." }  → { "valid": true }"""
    try:
        import json
        body = json.loads(request.body or "{}")
        key = body.get("key", "").strip()
    except Exception:
        return JsonResponse({"valid": False}, status=status.HTTP_400_BAD_REQUEST)
    if not key:
        return JsonResponse({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)
    if validate_owner_key(key):
        return JsonResponse({"valid": True})
    return JsonResponse({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)


# ---------- Owner: projects CRUD ----------
@owner_key_required
def owner_projects_list_or_create(request):
    """GET /api/owner/projects  or  POST /api/owner/projects"""
    if request.method == "GET":
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse({"projects": serializer.data})

    if request.method == "POST":
        try:
            import json
            data = json.loads(request.body or "{}")
        except Exception:
            return JsonResponse({"detail": "Invalid JSON"}, status=400)
        data.setdefault("tags", [])
        if "desc" in data and "description" not in data:
            data["description"] = data["desc"]
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"project": serializer.data}, status=201)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({"detail": "Method not allowed"}, status=405)


@owner_key_required
def owner_project_detail(request, pk):
    """PATCH /api/owner/projects/:id  and  DELETE"""
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if request.method == "PATCH":
        try:
            data = __import__("json").loads(request.body or "{}")
        except Exception:
            return JsonResponse({"detail": "Invalid JSON"}, status=400)
        if "desc" in data and "description" not in data:
            data["description"] = data["desc"]
        serializer = ProjectSerializer(project, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"project": serializer.data})
        return JsonResponse(serializer.errors, status=400)

    if request.method == "DELETE":
        project.delete()
        return JsonResponse({}, status=204)

    return JsonResponse({"detail": "Method not allowed"}, status=405)


# ---------- Owner: visitors stats ----------
@owner_key_required
def owner_visitors(request):
    """GET /api/owner/visitors?period=day|week|month|year"""
    period = request.GET.get("period", "week")
    start, end = _parse_period(period)

    # Sessions that had activity (last_seen_at) in the period
    sessions = VisitorSession.objects.filter(last_seen_at__gte=start, last_seen_at__lte=end).order_by("-last_seen_at")
    total_visits = sessions.count()

    from django.db.models import Sum, Count, Avg

    # Total time: sum of PageView durations for sessions active in period
    duration_sum = PageView.objects.filter(
        session__in=sessions,
        duration_seconds__isnull=False,
    ).aggregate(Sum("duration_seconds"))["duration_seconds__sum"] or 0
    total_time_min = round(duration_sum / 60, 1)

    # By page: path -> total duration (and/or visit count) for sessions in period
    by_page = list(
        PageView.objects.filter(session__in=sessions)
        .values("path")
        .annotate(
            duration=Sum("duration_seconds"),
            visits=Count("id"),
            avg_scroll=Avg("max_scroll_percent"),
        )
        .order_by("-duration")
    )
    by_page = [
        {
            "page": x["path"],
            "path": x["path"],
            "duration": round((x["duration"] or 0) / 60, 1),
            "visits": x["visits"],
            "avgScrollPct": round(x["avg_scroll"] or 0, 1) if x.get("avg_scroll") is not None else None,
        }
        for x in by_page
    ]

    events = list(
        VisitorEvent.objects.filter(session__in=sessions)
        .order_by("-created_at")[:200]
        .values("id", "event_type", "path", "target", "created_at", "meta")
    )
    events_serializable = []
    for e in events:
        dt = e.get("created_at")
        meta = e.get("meta") or {}
        if isinstance(meta, dict) and len(str(meta)) > 600:
            meta = {"_truncated": True, "keys": list(meta.keys())[:20]}
        events_serializable.append({
            "id": e.get("id"),
            "event_type": e.get("event_type"),
            "path": e.get("path") or "",
            "target": e.get("target") or "",
            "type": e.get("event_type") or "click",
            "timestamp": timezone.localtime(dt).isoformat() if dt else "",
            "page": e.get("path") or e.get("target") or "",
            "meta": meta,
        })

    visitors_list = list(
        sessions.values(
            "id",
            "session_id",
            "ip_address",
            "country_code",
            "started_at",
            "last_seen_at",
            "device_type",
            "browser",
            "os",
            "referrer",
            "landing_path",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "traffic_type",
        )[:100]
    )
    visitors_serializable = []
    for v in visitors_list:
        started = v.get("started_at")
        last_seen = v.get("last_seen_at")
        visitors_serializable.append({
            "id": v.get("id"),
            "session_id": v.get("session_id") or "",
            "ip_address": v.get("ip_address") or "",
            "country_code": v.get("country_code") or "",
            "ip": v.get("ip_address") or "",
            "country": v.get("country_code") or "",
            "device_type": v.get("device_type") or "",
            "browser": v.get("browser") or "",
            "os": v.get("os") or "",
            "referrer": (v.get("referrer") or "")[:200],
            "landing_path": v.get("landing_path") or "",
            "utm_source": v.get("utm_source") or "",
            "utm_medium": v.get("utm_medium") or "",
            "utm_campaign": v.get("utm_campaign") or "",
            "traffic_type": v.get("traffic_type") or "",
            "started_at": timezone.localtime(started).isoformat() if started else "",
            "last_seen_at": timezone.localtime(last_seen).isoformat() if last_seen else "",
        })

    live_now = VisitorSession.objects.filter(
        last_seen_at__gte=timezone.now() - timezone.timedelta(minutes=5)
    ).count()

    avg_scroll_all = PageView.objects.filter(
        session__in=sessions,
        max_scroll_percent__isnull=False,
    ).aggregate(Avg("max_scroll_percent"))["max_scroll_percent__avg"] or 0

    devices = list(
        sessions.exclude(device_type="").values("device_type").annotate(c=Count("id")).order_by("-c")[:12]
    )
    browsers = list(
        sessions.exclude(browser="").values("browser").annotate(c=Count("id")).order_by("-c")[:12]
    )
    traffic_types = list(
        sessions.exclude(traffic_type="").values("traffic_type").annotate(c=Count("id")).order_by("-c")
    )

    ref_counts = {}
    for r in sessions.exclude(referrer="").values_list("referrer", flat=True)[:2500]:
        try:
            host = urlparse(r).netloc or str(r)[:120]
        except Exception:
            host = str(r)[:120]
        if host:
            ref_counts[host] = ref_counts.get(host, 0) + 1
    top_referrers = [{"host": k, "count": v} for k, v in sorted(ref_counts.items(), key=lambda x: -x[1])[:15]]

    sessions_sample = list(
        sessions.prefetch_related(
            Prefetch("page_views", queryset=PageView.objects.order_by("started_at"))
        )[:400]
    )
    flow_counts = {}
    for sess in sessions_sample:
        paths = [pv.path for pv in sess.page_views.all()][:10]
        if len(paths) >= 2:
            key = " → ".join(paths)
            flow_counts[key] = flow_counts.get(key, 0) + 1
    top_flows = [{"flow": k, "count": v} for k, v in sorted(flow_counts.items(), key=lambda x: -x[1])[:18]]

    insights = {
        "liveNow": live_now,
        "avgScrollPct": round(float(avg_scroll_all), 1),
        "devices": devices,
        "browsers": browsers,
        "trafficTypes": traffic_types,
        "topReferrers": top_referrers,
        "topFlows": top_flows,
    }

    return JsonResponse({
        "visitors": visitors_serializable,
        "summary": {
            "totalVisits": total_visits,
            "totalTime": total_time_min,
            "byPage": by_page,
        },
        "events": events_serializable,
        "insights": insights,
    })


@owner_key_required
def owner_visitors_events(request):
    """GET /api/owner/visitors/events?period=..."""
    period = request.GET.get("period", "week")
    start, end = _parse_period(period)
    events = list(
        VisitorEvent.objects.filter(created_at__gte=start, created_at__lte=end)
        .order_by("-created_at")[:500]
        .values("id", "event_type", "path", "target", "created_at", "meta")
    )
    events_serializable = []
    for e in events:
        dt = e.get("created_at")
        meta = e.get("meta") or {}
        if isinstance(meta, dict) and len(str(meta)) > 600:
            meta = {"_truncated": True, "keys": list(meta.keys())[:20]}
        events_serializable.append({
            "id": e.get("id"),
            "event_type": e.get("event_type"),
            "path": e.get("path") or "",
            "target": e.get("target") or "",
            "type": e.get("event_type") or "click",
            "timestamp": timezone.localtime(dt).isoformat() if dt else "",
            "page": e.get("path") or e.get("target") or "",
            "meta": meta,
        })
    return JsonResponse({"events": events_serializable})


# ---------- Public: list projects (for portfolio site, no auth) ----------
def projects_list_public(request):
    """GET /api/projects  – list all projects for the main portfolio site."""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return JsonResponse({"projects": serializer.data})


# ---------- Public: home content ----------
def home_content(request):
    """GET /api/home  – panels, featured projects, works (from projects)."""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    try:
        block = ContentBlock.objects.get(slug="home_panels")
        panels = block.body.get("panels", [])
    except ContentBlock.DoesNotExist:
        panels = []
    projects = Project.objects.filter(featured=True)[:6]
    serializer = ProjectSerializer(projects, many=True)
    works = [
        {"title": p["title"], "cat": ", ".join(p.get("tags", [])[:2]), "year": p.get("year", ""), "color": p.get("color", "#0f0f0f")}
        for p in serializer.data
    ]
    return JsonResponse({"panels": panels, "featuredProjects": serializer.data, "works": works})


# ---------- Public: about content ----------
def about_content(request):
    """GET /api/about  – skills, stack, experience."""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    try:
        block = ContentBlock.objects.get(slug="about")
        return JsonResponse(block.body)
    except ContentBlock.DoesNotExist:
        return JsonResponse({"skills": [], "stack": [], "experience": []})


# ---------- Public: contact info ----------
def contact_info(request):
    """GET /api/contact-info  – email, location, status, socials."""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    try:
        block = ContentBlock.objects.get(slug="contact_info")
        return JsonResponse(block.body)
    except ContentBlock.DoesNotExist:
        return JsonResponse({
            "email": "hello@yourname.dev",
            "location": "San Francisco, CA",
            "status": "Available for new projects",
            "responseTime": "Within 24 hours",
            "socials": [{"label": "GitHub", "href": "#"}, {"label": "LinkedIn", "href": "#"}],
        })


# ---------- Public: submit contact message ----------
@csrf_exempt
@require_http_methods(["POST"])
def contact_submit(request):
    """POST /api/contact  Body: { name, email, message }"""
    try:
        import json
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"ok": False, "detail": "Invalid JSON"}, status=400)
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    if not name or not email or not message:
        return JsonResponse({"ok": False, "detail": "name, email, and message required"}, status=400)
    ContactMessage.objects.create(name=name, email=email, message=message)
    try:
        from .telegram_notify import notify_contact_message
        notify_contact_message(name, email, message)
    except Exception:
        pass
    return JsonResponse({"ok": True})


# ---------- Owner: contact messages ----------
@owner_key_required
def owner_messages(request):
    """GET /api/owner/messages"""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    messages = ContactMessage.objects.all()[:100]
    return JsonResponse({
        "messages": [
            {"id": m.id, "name": m.name, "email": m.email, "message": m.message, "created_at": m.created_at.isoformat(), "read": m.read}
            for m in messages
        ]
    })


# ---------- Owner: site profile (ContentBlock: home_panels, about, contact_info) ----------
OWNER_CONTENT_SLUGS = frozenset({"home_panels", "about", "contact_info"})


@csrf_exempt
@owner_key_required
def owner_content_list(request):
    """GET /api/owner/content — { blocks: { home_panels, about, contact_info } }"""
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    blocks = {}
    for slug in OWNER_CONTENT_SLUGS:
        try:
            cb = ContentBlock.objects.get(slug=slug)
            blocks[slug] = cb.body
        except ContentBlock.DoesNotExist:
            blocks[slug] = {}
    return JsonResponse({"blocks": blocks})


@csrf_exempt
@owner_key_required
def owner_content_detail(request, slug):
    """GET /api/owner/content/<slug>  PATCH { "body": { ... } }"""
    if slug not in OWNER_CONTENT_SLUGS:
        return JsonResponse({"detail": "Unknown slug"}, status=404)
    if request.method == "GET":
        try:
            cb = ContentBlock.objects.get(slug=slug)
            return JsonResponse({"slug": slug, "body": cb.body})
        except ContentBlock.DoesNotExist:
            return JsonResponse({"slug": slug, "body": {}})

    if request.method == "PATCH":
        try:
            import json
            data = json.loads(request.body or "{}")
        except Exception:
            return JsonResponse({"detail": "Invalid JSON"}, status=400)
        body = data.get("body")
        if body is None:
            return JsonResponse({"detail": "body required"}, status=400)
        if not isinstance(body, dict):
            return JsonResponse({"detail": "body must be a JSON object"}, status=400)
        cb, _ = ContentBlock.objects.update_or_create(slug=slug, defaults={"body": body})
        return JsonResponse({"slug": slug, "body": cb.body})

    return JsonResponse({"detail": "Method not allowed"}, status=405)


# ---------- Public: track (for portfolio frontend) ----------
@csrf_exempt
@require_http_methods(["POST"])
def track(request):
    """
    POST /api/track
    Body: { "sessionId": "...", "type": "page_view"|"event", "path": "/Home", "target": "#contact", "eventType": "click" }
    Creates or reuses VisitorSession, creates PageView or VisitorEvent.
    """
    try:
        import json
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"ok": False}, status=400)

    session_id = (data.get("sessionId") or data.get("session_id") or "").strip()
    if not session_id:
        return JsonResponse({"ok": False, "detail": "sessionId required"}, status=400)

    session, created = VisitorSession.objects.get_or_create(
        session_id=session_id,
        defaults={},
    )
    # Store IP and country (update on first create or if missing)
    if created or not session.country_code:
        ip = _get_client_ip(request)
        if ip:
            session.ip_address = ip
            if not session.country_code:
                session.country_code = _get_country_for_ip(ip)
            session.save(update_fields=["ip_address", "country_code", "last_seen_at"])
        if created:
            try:
                from .telegram_notify import notify_new_visitor
                notify_new_visitor(
                    session.session_id,
                    session.ip_address or ip,
                    session.country_code,
                )
            except Exception:
                pass
    else:
        session.last_seen_at = timezone.now()
        session.save(update_fields=["last_seen_at"])

    ctx = data.get("context")
    if isinstance(ctx, dict) and ctx:
        _apply_session_context(session, request, ctx)
    session.last_seen_at = timezone.now()
    session.save(update_fields=["last_seen_at"])

    event_type = (data.get("type") or data.get("eventType") or "event").strip()
    path = (data.get("path") or "").strip() or "/"
    target = (data.get("target") or "").strip()
    meta = data.get("meta") if isinstance(data.get("meta"), dict) else {}

    if event_type == "session_init":
        return JsonResponse({"ok": True})

    if event_type == "page_view":
        PageView.objects.create(session=session, path=path)
        return JsonResponse({"ok": True})

    if event_type == "scroll":
        try:
            pct = int(data.get("percent") or data.get("scrollPercent") or 0)
        except (TypeError, ValueError):
            pct = 0
        pct = max(0, min(100, pct))
        pv = (
            PageView.objects.filter(session=session, path=path)
            .order_by("-started_at")
            .first()
        )
        if pv:
            prev = pv.max_scroll_percent or 0
            if pct > prev:
                pv.max_scroll_percent = pct
                pv.save(update_fields=["max_scroll_percent"])
        return JsonResponse({"ok": True})

    if event_type == "performance":
        VisitorEvent.objects.create(
            session=session,
            event_type="web_vitals",
            path=path,
            target=(data.get("metric") or data.get("name") or "perf")[:500],
            meta=meta,
        )
        return JsonResponse({"ok": True})

    if event_type == "error":
        VisitorEvent.objects.create(
            session=session,
            event_type="js_error",
            path=path,
            target=(data.get("message") or "error")[:500],
            meta=meta,
        )
        return JsonResponse({"ok": True})

    if event_type == "heatmap":
        pts = data.get("points") or meta.get("points") or []
        if isinstance(pts, list):
            pts = pts[:40]
        else:
            pts = []
        VisitorEvent.objects.create(
            session=session,
            event_type="heatmap",
            path=path,
            target="sample",
            meta={"points": pts, "w": data.get("w"), "h": data.get("h")},
        )
        return JsonResponse({"ok": True})

    if event_type in ("click", "event"):
        VisitorEvent.objects.create(
            session=session,
            event_type=(data.get("eventType") or "click")[:32],
            path=path,
            target=target[:500],
            meta=meta,
        )
        return JsonResponse({"ok": True})

    return JsonResponse({"ok": False, "detail": "unknown type"}, status=400)


# ---------- Telegram webhook: interactive bot (e.g. /more for visitor details) ----------
def _format_visitor_detail(session):
    """Build HTML message for one visitor (pages, events, time). Used when user says /more."""
    from .telegram_notify import _escape_html, _country_flag_emoji

    ip = _escape_html(str(session.ip_address or "—"))
    country = _escape_html(session.country_code or "—")
    flag = _country_flag_emoji(session.country_code) if session.country_code else "🌍"
    started = timezone.localtime(session.started_at).strftime("%Y-%m-%d %H:%M")
    last_seen = timezone.localtime(session.last_seen_at).strftime("%Y-%m-%d %H:%M")

    page_views = list(session.page_views.all()[:20])
    events = list(session.events.all()[:30])
    total_seconds = sum((pv.duration_seconds or 0) for pv in page_views)
    total_m = total_seconds // 60
    total_s = total_seconds % 60

    dev = _escape_html(
        " / ".join(
            x
            for x in (
                session.device_type or "",
                session.browser or "",
                session.os or "",
            )
            if x
        )
        or "—"
    )
    ref_short = _escape_html((session.referrer or "—")[:180])
    traffic = _escape_html(session.traffic_type or "—")

    lines = [
        "📋 <b>Visitor details</b>",
        "",
        f"🌐 <b>IP:</b> {ip}",
        f"📍 <b>Location:</b> {flag} {country}",
        f"💻 <b>Device:</b> {dev}",
        f"🔗 <b>Traffic:</b> {traffic}",
        f"↩️ <b>Referrer:</b> {ref_short}",
        f"🕐 <b>First seen:</b> {started}",
        f"🕐 <b>Last seen:</b> {last_seen}",
        f"⏱ <b>Time on site:</b> {total_m}m {total_s}s",
        "",
        f"<b>Pages</b> ({len(page_views)})",
    ]
    for pv in page_views[:10]:
        path = _escape_html(pv.path or "/")
        dur = pv.duration_seconds or 0
        scroll = pv.max_scroll_percent
        scroll_bit = f", scroll {scroll}%" if scroll is not None else ""
        lines.append(f"• {path} — {dur}s{scroll_bit}")
    if len(page_views) > 10:
        lines.append(f"… and {len(page_views) - 10} more")

    if events:
        lines.append("")
        lines.append(f"<b>Activity</b> ({len(events)})")
        for ev in events[:15]:
            path = _escape_html(ev.path or "—")
            target = _escape_html(ev.target or "—")
            lines.append(f"• {ev.event_type}: {path} {target}".strip())
        if len(events) > 15:
            lines.append(f"… and {len(events) - 15} more")

    return "\n".join(lines)


@csrf_exempt
@require_http_methods(["POST"])
def telegram_webhook(request):
    """
    POST /api/telegram/webhook — receives Telegram updates. Set webhook:
    https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_BASE>/api/telegram/webhook
    Handles: /more (details for last notified visitor), /visitors (last 5), /help.
    """
    import json
    from django.core.cache import cache
    from .telegram_notify import (
        send_telegram_message,
        TELEGRAM_LAST_VISITOR_CACHE_KEY,
        _escape_html,
        _country_flag_emoji,
    )

    try:
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"ok": True})

    message = (data.get("message") or data.get("channel_post")) or {}
    chat_id = message.get("chat", {}).get("id")
    text = (message.get("text") or "").strip()

    if not chat_id or not text:
        return JsonResponse({"ok": True})

    cmd = text.lower().split()[0] if text.split() else text.lower()
    # Treat /more, "more", "give more info", "details" etc.
    ask_more = cmd in ("/more", "more", "details", "info") or "more" in text.lower() or "detail" in text.lower()

    if ask_more:
        session_id = cache.get(TELEGRAM_LAST_VISITOR_CACHE_KEY)
        if session_id:
            try:
                session = VisitorSession.objects.prefetch_related("page_views", "events").get(session_id=session_id)
                reply = _format_visitor_detail(session)
                send_telegram_message(reply, chat_id=chat_id)
            except VisitorSession.DoesNotExist:
                send_telegram_message("No visitor data for that session.", chat_id=chat_id)
        else:
            send_telegram_message(
                "No recent visitor was notified. I’ll give more details when you reply /more after the next new visitor.",
                chat_id=chat_id,
            )
        return JsonResponse({"ok": True})

    if cmd in ("/visitors", "/list"):
        sessions = VisitorSession.objects.prefetch_related("page_views").order_by("-started_at")[:5]
        if not sessions:
            send_telegram_message("No visitors yet.", chat_id=chat_id)
        else:
            parts = ["<b>Last 5 visitors</b>", ""]
            for s in sessions:
                flag = _country_flag_emoji(s.country_code) if s.country_code else "🌍"
                ip = _escape_html(str(s.ip_address or "—"))
                parts.append(f"{flag} {ip} — {s.started_at.strftime('%Y-%m-%d %H:%M')}")
            send_telegram_message("\n".join(parts), chat_id=chat_id)
        return JsonResponse({"ok": True})

    if cmd in ("/help", "/start"):
        help_text = (
            "<b>Portfolio bot</b>\n\n"
            "<b>/more</b> — full details for the last announced visitor (pages, time, activity)\n"
            "<b>/visitors</b> — last 5 visitors\n"
            "<b>/help</b> — this message\n\n"
            "You can also say \"more\" or \"details\" after a new visitor notification."
        )
        send_telegram_message(help_text, chat_id=chat_id)
        return JsonResponse({"ok": True})

    return JsonResponse({"ok": True})


@csrf_exempt
@require_http_methods(["POST"])
def track_leave(request):
    """
    POST /api/track/leave
    Body: { "sessionId": "...", "path": "/Home", "durationSeconds": 120 }
    Marks page view as left and sets duration.
    """
    try:
        import json
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"ok": False}, status=400)

    session_id = (data.get("sessionId") or data.get("session_id") or "").strip()
    path = (data.get("path") or "").strip() or "/"
    duration_seconds = int(data.get("durationSeconds") or data.get("duration_seconds") or 0)

    try:
        session = VisitorSession.objects.get(session_id=session_id)
    except VisitorSession.DoesNotExist:
        return JsonResponse({"ok": True})  # no session to update

    from django.utils import timezone
    now = timezone.now()
    session.last_seen_at = now
    session.save(update_fields=["last_seen_at"])

    pv = PageView.objects.filter(session=session, path=path, left_at__isnull=True).order_by("-started_at").first()
    if pv:
        pv.left_at = now
        pv.duration_seconds = duration_seconds or max(0, (now - pv.started_at).total_seconds())
        pv.save(update_fields=["left_at", "duration_seconds"])

    return JsonResponse({"ok": True})
