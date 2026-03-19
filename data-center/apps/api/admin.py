from django.contrib import admin
from .models import Project, VisitorSession, PageView, VisitorEvent, ContactMessage, ContentBlock


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "year", "featured", "order", "updated_at"]
    list_filter = ["featured"]
    search_fields = ["title", "description"]


@admin.register(VisitorSession)
class VisitorSessionAdmin(admin.ModelAdmin):
    list_display = ["session_id", "started_at", "last_seen_at"]


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ["path", "session", "started_at", "left_at", "duration_seconds"]


@admin.register(VisitorEvent)
class VisitorEventAdmin(admin.ModelAdmin):
    list_display = ["event_type", "path", "target", "created_at"]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "created_at", "read"]


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ["slug", "updated_at"]
