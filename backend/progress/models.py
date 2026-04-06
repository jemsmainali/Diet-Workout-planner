"""Progress tracking: weight, body fat, measurements over time."""
from django.db import models
from django.conf import settings


class Progress(models.Model):
    """User progress entry - logged periodically."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_entries')
    date = models.DateField()
    weight = models.FloatField(help_text="Weight in kg")
    body_fat = models.FloatField(null=True, blank=True, help_text="Body fat percentage")
    chest = models.FloatField(null=True, blank=True, help_text="Chest measurement cm")
    waist = models.FloatField(null=True, blank=True, help_text="Waist measurement cm")
    hips = models.FloatField(null=True, blank=True, help_text="Hips measurement cm")
    bicep = models.FloatField(null=True, blank=True, help_text="Bicep measurement cm")
    notes = models.TextField(blank=True, default='')
    energy_level = models.IntegerField(default=5, help_text="1-10 scale")
    sleep_hours = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [models.Index(fields=['user', 'date'])]

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.weight}kg"

    @property
    def bmi(self):
        if self.user.height:
            h = self.user.height / 100
            return round(self.weight / (h ** 2), 2)
        return None
