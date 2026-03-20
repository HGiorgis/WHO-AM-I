"""
Seed portfolio data: projects, home panels, about, contact info,
and sample visitor analytics (3 sessions, 3 page views, 3 events) for dashboard testing.

Run: python manage.py seed_data
Clear all portfolio data then re-seed defaults: python manage.py seed_data --clear
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import (
    Project,
    ContentBlock,
    VisitorSession,
    PageView,
    VisitorEvent,
    ContactMessage,
)


def clear_portfolio_data(stdout, style):
    """
    Remove all portfolio-related rows: projects, content blocks, contact messages,
    visitors (sessions, page views, events). Does not touch Django auth/admin users.
    """
    n_pv = PageView.objects.count()
    n_ev = VisitorEvent.objects.count()
    n_sess = VisitorSession.objects.count()
    n_msg = ContactMessage.objects.count()
    n_block = ContentBlock.objects.count()
    n_proj = Project.objects.count()

    VisitorEvent.objects.all().delete()
    PageView.objects.all().delete()
    VisitorSession.objects.all().delete()
    ContactMessage.objects.all().delete()
    ContentBlock.objects.all().delete()
    Project.objects.all().delete()

    stdout.write(
        style.WARNING(
            f"Cleared: {n_proj} projects, {n_block} content blocks, {n_msg} contact messages, "
            f"{n_sess} visitor sessions (and {n_pv} page views, {n_ev} events)."
        )
    )


PROJECTS = [
    {
        "title": "KYC Verification Service",
        "subtitle": "",
        "description": "Secure identity verification system with automated document processing and facial matching. Designed for compliance workflows with scalable async processing.",
        "year": "2024",
        "tags": ["Django", "OCR", "Face Recognition", "R2 S3", "Python"],
        "live_url": "https://kyc-service-au1k.onrender.com",
        "github_url": "https://github.com/HGiorgis/kyc-service",
        "featured": True,
        "color": "#e84040",
        "order": 1,
        "cover_image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
        "gallery_images": [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
        ],
        "feature_highlights": [
            {
                "title": "Compliance-ready",
                "body": "Document verification pipeline built for audit trails and secure storage.",
                "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Scalable APIs",
                "body": "Async workers and queues for high-throughput identity checks.",
                "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Privacy first",
                "body": "Minimal PII retention with encryption in transit and at rest.",
                "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
            },
        ],
    },
    {
        "title": "LinkFlow",
        "subtitle": "Redirect Tracking & Pixel Management",
        "description": "Tracking platform for managing redirects and marketing pixels across multiple platforms. Designed for performance and accurate event tracking.",
        "year": "2024",
        "tags": ["Laravel", "PHP", "PostgreSQL", "Tracking Pixel ", "Google Analytics 4 "],
        "live_url": "https://redirect-tracker-admin.onrender.com",
        "github_url": "https://github.com/HGiorgis/redirect_tracker",
        "featured": True,
        "color": "#f5c842",
        "order": 2,
        "cover_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        "gallery_images": [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        ],
        "feature_highlights": [
            {
                "title": "Redirect engine",
                "body": "Fast edge-friendly redirects with full click and conversion signals.",
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Pixel hub",
                "body": "Central place to orchestrate marketing tags without slowing pages.",
                "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Laravel core",
                "body": "Solid PHP backend with queues, cache, and Postgres.",
                "image": "https://images.unsplash.com/photo-1537432376779-00d5cdb45746?auto=format&fit=crop&w=600&q=80",
            },
        ],
    },
    {
        "title": "Subscription Showcase",
        "subtitle": "SaaS Platform",
        "description": "Full-stack SaaS application with subscription-based architecture, user management, and scalable backend design.",
        "year": "2023",
        "tags": ["Django", "PostgreSQL", "Stripe API", "Docker"],
        "live_url": "https://subscription-ibxp.onrender.com",
        "github_url": "https://github.com/hgiorgis/subscription",
        "featured": True,
        "color": "#4fa3e0",
        "order": 3,
        "cover_image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
        "gallery_images": [
            "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563986768494-4cdf02b2e593?auto=format&fit=crop&w=800&q=80",
        ],
        "feature_highlights": [
            {
                "title": "Subscriptions",
                "body": "Stripe-powered billing with trials, proration, and webhooks.",
                "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Multi-tenant",
                "body": "Isolated workspaces and roles for teams and customers.",
                "image": "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": "Dockerized",
                "body": "Repeatable deploys with containers and env-based config.",
                "image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=600&q=80",
            },
        ],
    },
    {
        "title": "Sankrypt",
        "subtitle": "Zero-Knowledge Password Vault",
        "description": "Secure password manager using client-side encryption — sensitive data is never exposed to the server.",
        "year": "2023",
        "tags": ["JavaScript", "Cryptography", "Zero Trust Architecture", "Laravel"], 
        "live_url": "https://sankrypt.pro.et",
        "github_url": "https://github.com/hgiorgis/sankrypt",
        "featured": True,
        "color": "#2ecc71",
        "order": 4,
    },
    {
        "title": "InviFlow",
        "subtitle": "Automated Invoice Generation",
        "description": "System that generates PDF invoices automatically using dynamic data from Google Sheets integration.",
        "year": "2023",
        "tags": ["Django", "Google Sheets API", "PDF Generation", "Automation", "PostgreSQL"],
        "live_url": "https://inviflow.onrender.com",
        "github_url": "https://github.com/hgiorgis/inviflow",
        "featured": False,
        "color": "#e84040",
        "order": 5,
    },
    {
        "title": "Poultry Farm Analytics",
        "subtitle": "Reporting System",
        "description": "Data-driven platform for tracking farm operations, generating reports, and supporting operational decisions.",
        "year": "2022",
        "tags": ["React", "ExpressJS", "MySQL", "Chart.js"],  
        "live_url": "https://kdpolutry.pro.et",
        "github_url": "",
        "featured": False,
        "color": "#f5c842",
        "order": 6,
    },
    {
        "title": "Sankrypt Plugin",
        "subtitle": "File Encryption for Obsidian",
        "description": "Plugin for secure file encryption within Obsidian, enabling safe local data storage using modern crypto algorithms.",
        "year": "2022",
        "tags": ["TypeScript", "Encryption", "Obsidian API", "JavaScript"], 
        "live_url": "",
        "github_url": "https://github.com/HGiorgis/sankryptidian",
        "featured": False,
        "color": "#4fa3e0",
        "order": 7,
    },
    {
        "title": "Laravel Infrastructure Nginx Load Balancing",
        "subtitle": "High-Availability Production System",
        "description": "Production-ready Laravel system with load balancing, containerization, and CI/CD pipelines for enterprise scale.",
        "year": "2022",
        "tags": ["Laravel", "Docker", "Nginx", "CI/CD", "Cloud","DevOps","Load Balancing"],
        "live_url": "",
        "github_url": "https://github.com/HGiorgis/Local-DevOps-Demo",
        "featured": False,
        "color": "#2ecc71",
        "order": 8,
    },
]

# ContentBlock slugs: home_panels, about, contact_info — editable at /owner/profile (PATCH /api/owner/content/<slug>).
# contact_info also drives the site footer (Connect + Status) via GET /api/contact-info.

HOME_PANELS = {
    "panels": [
        {
            "num": "01",
            "tag": "BACKEND",
            "title": ["SAAS", "ARCHITECT"],
            "sub": "Building subscription platforms, user management systems, and scalable backend APIs with Laravel & Django.",
            "accent": "#e84040",
            "shape": "circle",
            "backgroundImage": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=80",
        },
        {
            "num": "02",
            "tag": "SECURITY",
            "title": ["ZERO-KNOWLEDGE", "SYSTEMS"],
            "sub": "Designing end-to-end encrypted vaults, KYC verification services, and client-side crypto applications.",
            "accent": "#f5c842",
            "shape": "square",
            "backgroundImage": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1800&q=80",
        },
        {
            "num": "03",
            "tag": "DEVOPS",
            "title": ["HIGH-AVAILABILITY", "INFRA"],
            "sub": "Deploying containerized systems with CI/CD pipelines, Nginx load balancing, and cloud infrastructure.",
            "accent": "#4fa3e0",
            "shape": "diamond",
            "backgroundImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80",
        },
    ]
}

ABOUT_BODY = {
    "skills": [
        {"name": "Laravel / PHP", "level": 95, "color": "#e84040"},
        {"name": "Django / Python", "level": 92, "color": "#f5c842"},
        {"name": "Node.js / JavaScript", "level": 90, "color": "#4fa3e0"},
        {"name": "React / Frontend", "level": 85, "color": "#2ecc71"},
        {"name": "Docker & CI/CD", "level": 93, "color": "#e84040"},
        {"name": "API Design & Security", "level": 96, "color": "#f5c842"},
        {"name": "Encryption & Zero-Knowledge", "level": 88, "color": "#4fa3e0"},
        {"name": "Cloud Infrastructure", "level": 89, "color": "#2ecc71"},
    ],
    "stack": [
        {"cat": "Backend", "items": ["Laravel", "Django", "Node.js", "Python", "PHP", "Go"]},
        {"cat": "Frontend", "items": ["React", "JavaScript", "TypeScript", "Tailwind CSS"]},
        {"cat": "DevOps", "items": ["Docker", "Nginx", "CI/CD", "GitHub Actions", "Linux"]},
        {"cat": "Data & Cloud", "items": ["MySQL", "PostgreSQL", "Redis", "AWS S3", "Cloud VPS"]},
    ],
    "experience": [
        {"role": "Backend & SaaS Architect", "co": "Independent / Freelance", "period": "2022 – Now", "color": "#e84040", "desc": "Designing and building production-ready platforms for startups — SaaS, verification systems, analytics tools."},
        {"role": "Full-Stack Developer", "co": "TechForge Labs", "period": "2020 – 2022", "color": "#f5c842", "desc": "Delivered complex web applications with Laravel, Django, and React across diverse industry verticals."},
        {"role": "System Engineer", "co": "DataStream Corp", "period": "2018 – 2020", "color": "#4fa3e0", "desc": "Managed server infrastructure, optimized backend performance, and ensured 99.9% uptime."},
    ],
}

CONTACT_INFO_BODY = {
    "email": "hailegiorgiswagaye@gmail.com",
    "location": "Addis Ababa, Ethiopia",
    "status": "Available for new projects",
    "responseTime": "Within 24 hours",
    "resumeUrl": "/HailegiorgisWagayeResume.pdf",
    "socials": [
        {"label": "GitHub", "href": "https://github.com/hgiorgis"},
        {"label": "LinkedIn", "href": "https://linkedin.com/in/hgiorgis23"},
        {"label": "Twitter", "href": "https://twitter.com/hgiorgis"}
    ],
}


def seed_analytics_sample(stdout, style):
    """
    Creates 3 VisitorSessions, 3 PageViews (different paths → Time by page),
    3 VisitorEvents (Recent activity). Uses session_id prefix seed_test_ so
    re-running removes old sample rows first.
    """
    prefix = "seed_test_"
    VisitorSession.objects.filter(session_id__startswith=prefix).delete()

    now = timezone.now()

    samples = [
        {
            "session_id": f"{prefix}sess_1",
            "ip": "203.0.113.10",
            "country": "JP",
            "last_offset": timedelta(minutes=12),
            "started_offset": timedelta(hours=2),
            "page": {"path": "/Home", "duration": 180},
            "event": {"type": "click", "path": "/Home", "target": "nav:/Projects"},
            "event_offset": timedelta(minutes=5),
        },
        {
            "session_id": f"{prefix}sess_2",
            "ip": "198.51.100.22",
            "country": "KE",
            "last_offset": timedelta(minutes=45),
            "started_offset": timedelta(hours=6),
            "page": {"path": "/Projects", "duration": 420},
            "event": {"type": "click", "path": "/Projects", "target": "filter:security"},
            "event_offset": timedelta(minutes=8),
        },
        {
            "session_id": f"{prefix}sess_3",
            "ip": "192.0.2.55",
            "country": "ET",
            "last_offset": timedelta(hours=1, minutes=20),
            "started_offset": timedelta(hours=8),
            "page": {"path": "/Contact", "duration": 95},
            "event": {"type": "click", "path": "/Contact", "target": "contact_submit"},
            "event_offset": timedelta(minutes=3),
        },
    ]

    for row in samples:
        s = VisitorSession.objects.create(
            session_id=row["session_id"],
            ip_address=row["ip"],
            country_code=row["country"],
        )
        last_at = now - row["last_offset"]
        started_at = now - row["started_offset"]
        VisitorSession.objects.filter(pk=s.pk).update(
            started_at=started_at,
            last_seen_at=last_at,
        )

        p = row["page"]
        pv = PageView.objects.create(
            session=s,
            path=p["path"],
            duration_seconds=p["duration"],
        )
        pv_started = started_at + timedelta(seconds=30)
        PageView.objects.filter(pk=pv.pk).update(
            started_at=pv_started,
            left_at=pv_started + timedelta(seconds=p["duration"]),
        )

        e = row["event"]
        ev = VisitorEvent.objects.create(
            session=s,
            event_type=e["type"],
            path=e["path"],
            target=e["target"],
        )
        ev_time = last_at - row["event_offset"]
        VisitorEvent.objects.filter(pk=ev.pk).update(created_at=ev_time)

    stdout.write(
        style.SUCCESS(
            "Seeded analytics sample: 3 visitors, 3 page views (/Home, /Projects, /Contact), 3 events"
        )
    )


class Command(BaseCommand):
    help = "Seed projects, content blocks, and sample visitor analytics. Use --clear to wipe portfolio data first."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all projects, content blocks, contact messages, and visitor/analytics data, then seed defaults.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            clear_portfolio_data(self.stdout, self.style)

        # Projects
        for i, p in enumerate(PROJECTS):
            Project.objects.update_or_create(
                title=p["title"],
                defaults={
                    "subtitle": p.get("subtitle", ""),
                    "description": p.get("description", ""),
                    "year": p.get("year", ""),
                    "tags": p.get("tags", []),
                    "live_url": p.get("live_url", ""),
                    "github_url": p.get("github_url", ""),
                    "cover_image": p.get("cover_image", ""),
                    "gallery_images": p.get("gallery_images", []),
                    "feature_highlights": p.get("feature_highlights", []),
                    "featured": p.get("featured", False),
                    "color": p.get("color", "#0f0f0f"),
                    "order": p.get("order", i + 1),
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PROJECTS)} projects"))

        # Content blocks
        ContentBlock.objects.update_or_create(slug="home_panels", defaults={"body": HOME_PANELS})
        ContentBlock.objects.update_or_create(slug="about", defaults={"body": ABOUT_BODY})
        ContentBlock.objects.update_or_create(slug="contact_info", defaults={"body": CONTACT_INFO_BODY})
        self.stdout.write(self.style.SUCCESS("Seeded content blocks: home_panels, about, contact_info"))

        seed_analytics_sample(self.stdout, self.style)
