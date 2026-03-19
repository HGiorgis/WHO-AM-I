from django.urls import path
from . import views

urlpatterns = [
    path("projects", views.projects_list_public),
    path("home", views.home_content),
    path("about", views.about_content),
    path("contact-info", views.contact_info),
    path("contact", views.contact_submit),
    path("owner/validate", views.owner_validate),
    path("owner/projects", views.owner_projects_list_or_create),
    path("owner/projects/<int:pk>", views.owner_project_detail),
    path("owner/visitors", views.owner_visitors),
    path("owner/visitors/events", views.owner_visitors_events),
    path("owner/messages", views.owner_messages),
    path("owner/content", views.owner_content_list),
    path("owner/content/<slug>", views.owner_content_detail),
    path("track", views.track),
    path("track/leave", views.track_leave),
    path("telegram/webhook", views.telegram_webhook),
]
