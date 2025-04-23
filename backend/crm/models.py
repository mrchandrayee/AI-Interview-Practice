from django.db import models
from django.conf import settings
from django.utils import timezone

class UserSegment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    criteria = models.JSONField()  # Store segment criteria as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UserSegmentMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    segment = models.ForeignKey(UserSegment, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'segment')

    def __str__(self):
        return f"{self.user.email} - {self.segment.name}"

class AdAttribution(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    utm_term = models.CharField(max_length=100, blank=True)
    utm_content = models.CharField(max_length=100, blank=True)
    referrer = models.URLField(blank=True)
    landing_page = models.URLField()
    first_visit = models.DateTimeField(auto_now_add=True)
    last_visit = models.DateTimeField(auto_now=True)
    conversion_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    conversion_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.utm_source}"

class UserLifecycleStage(models.Model):
    STAGE_CHOICES = [
        ('lead', 'Lead'),
        ('trial', 'Trial User'),
        ('active', 'Active User'),
        ('churned', 'Churned User'),
        ('reactivated', 'Reactivated User'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    entered_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.stage}"

class UserEngagementScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    last_calculated = models.DateTimeField(auto_now=True)
    factors = models.JSONField()  # Store engagement factors and weights

    def __str__(self):
        return f"{self.user.email} - {self.score}"

    def calculate_score(self):
        """Calculate user engagement score based on various factors"""
        from analytics.models import UserProgress, UserActivity
        
        progress = UserProgress.objects.get(user=self.user)
        activities = UserActivity.objects.filter(user=self.user)
        
        score = 0
        factors = {}
        
        # Interview activity
        interview_count = progress.total_interviews
        factors['interview_count'] = interview_count
        score += interview_count * 10
        
        # Training activity
        training_hours = progress.total_training_hours
        factors['training_hours'] = training_hours
        score += training_hours * 5
        
        # Recent activity
        recent_activities = activities.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        factors['recent_activities'] = recent_activities
        score += recent_activities * 2
        
        # Streak bonus
        if progress.current_streak_days > 0:
            factors['streak_days'] = progress.current_streak_days
            score += progress.current_streak_days * 3
        
        self.score = score
        self.factors = factors
        self.save()
        
        return score 