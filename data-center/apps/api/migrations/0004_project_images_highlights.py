# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_visitorsession_context_pageview_scroll_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="cover_image",
            field=models.URLField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="project",
            name="gallery_images",
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name="project",
            name="feature_highlights",
            field=models.JSONField(default=list),
        ),
    ]
