from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    desc = serializers.CharField(source="description", required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "subtitle",
            "description",
            "desc",
            "year",
            "tags",
            "live_url",
            "github_url",
            "featured",
            "color",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["description"] = data.get("description") or data.get("desc") or ""
        if "desc" in data:
            del data["desc"]
        return data
