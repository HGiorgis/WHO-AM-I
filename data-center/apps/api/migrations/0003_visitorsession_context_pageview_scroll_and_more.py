# Generated manually for advanced visitor analytics

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_contactmessage_contentblock_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="visitorsession",
            name="browser",
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="device_type",
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="landing_path",
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="os",
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="referrer",
            field=models.CharField(blank=True, max_length=2048),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="traffic_type",
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="user_agent",
            field=models.CharField(blank=True, max_length=512),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="utm_campaign",
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="utm_medium",
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name="visitorsession",
            name="utm_source",
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name="pageview",
            name="max_scroll_percent",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="visitorevent",
            name="meta",
            field=models.JSONField(default=dict),
        ),
    ]
