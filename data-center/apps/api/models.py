from django.db import models


class Project(models.Model):
    """Portfolio project – managed from owner dashboard."""
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    year = models.CharField(max_length=4, default="")
    tags = models.JSONField(default=list)  # ["Laravel", "React", ...]
    live_url = models.URLField(max_length=500, blank=True)
    github_url = models.URLField(max_length=500, blank=True)
    featured = models.BooleanField(default=False)
    color = models.CharField(max_length=20, default="#0f0f0f")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class VisitorSession(models.Model):
    """One visitor session (e.g. one browser tab)."""
    session_id = models.CharField(max_length=64, unique=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    country_code = models.CharField(max_length=4, blank=True)  # e.g. US, GR
    started_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-started_at"]


class ContactMessage(models.Model):
    """Contact form submission."""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]


class ContentBlock(models.Model):
    """Key-value content for home, about, contact info (JSON)."""
    slug = models.SlugField(max_length=64, unique=True)
    body = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]


class PageView(models.Model):
    """Time spent on a specific page."""
    session = models.ForeignKey(
        VisitorSession, on_delete=models.CASCADE, related_name="page_views"
    )
    path = models.CharField(max_length=500, db_index=True)  # e.g. /Home, /Projects
    started_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)  # set when they leave
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]


class VisitorEvent(models.Model):
    """Click or other event (e.g. CTA click, link click)."""
    session = models.ForeignKey(
        VisitorSession, on_delete=models.CASCADE, related_name="events", null=True, blank=True
    )
    event_type = models.CharField(max_length=32, default="click")  # click, view, etc.
    path = models.CharField(max_length=500, blank=True)
    target = models.CharField(max_length=500, blank=True)  # e.g. #contact, button id
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
