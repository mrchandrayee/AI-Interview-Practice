from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    criteria = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Title(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    level = models.IntegerField(default=1)
    criteria = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_interviews = models.IntegerField(default=0)
    total_training_hours = models.IntegerField(default=0)
    average_interview_score = models.FloatField(default=0)
    current_streak_days = models.IntegerField(default=0)
    longest_streak_days = models.IntegerField(default=0)
    badges = models.ManyToManyField(Badge, through='UserBadge')
    current_title = models.ForeignKey(Title, null=True, blank=True, on_delete=models.SET_NULL)
    last_activity_date = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    session_count = models.IntegerField(default=0)  # For CSAT tracking
    last_csat_prompt = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - Progress"

    def check_and_award_badges(self):
        """Check and award badges based on user progress"""
        from .services import BadgeService
        BadgeService.check_and_award_badges(self)

    def check_and_update_title(self):
        """Check and update user title based on progress"""
        from .services import TitleService
        TitleService.check_and_update_title(self)

    def should_prompt_csat(self):
        """Check if user should be prompted for CSAT"""
        if self.session_count >= 5 and (
            not self.last_csat_prompt or 
            (self.last_activity_date - self.last_csat_prompt).days >= 30
        ):
            return True
        return False

class UserBadge(models.Model):
    user_progress = models.ForeignKey(UserProgress, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)
    shared_on_facebook = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user_progress.user.email} - {self.badge.name}"

class UserActivity(models.Model):
    ACTIVITY_TYPES = [
        ('interview', 'Mock Interview'),
        ('training', 'Training Module'),
        ('assessment', 'Assessment'),
        ('subscription', 'Subscription Change'),
        ('badge', 'Badge Earned'),
        ('title', 'Title Earned')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.activity_type}"

class UserFeedback(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    feedback = models.TextField()
    session_type = models.CharField(max_length=20)
    session_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.rating} stars"
