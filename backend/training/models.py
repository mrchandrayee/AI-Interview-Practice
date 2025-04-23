from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class TrainingModule(models.Model):
    SUBJECT_CHOICES = [
        ('data_analytics', 'Data Analytics'),
        ('accounting', 'Accounting'),
        ('interview_polish', 'Interview Polish'),
        ('communication', 'Communication'),
        ('leadership', 'Leadership')
    ]

    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    description = models.TextField()
    duration_hours = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.subject}"

class TrainingLesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    topic = models.CharField(max_length=255)
    content = models.TextField()
    questions = models.JSONField(default=list)
    duration = models.IntegerField(help_text="Duration in minutes")
    objectives = models.JSONField(default=list)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.topic

class TrainingSession(models.Model):
    """Model for training sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(TrainingLesson, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    is_paused = models.BooleanField(default=False)
    current_question = models.IntegerField(default=0)
    responses = models.JSONField(default=list)
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.topic}"

    def complete(self):
        self.end_time = timezone.now()
        self.is_completed = True
        self.save()

class TrainingProgress(models.Model):
    """Model for tracking user's training progress"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(TrainingLesson, on_delete=models.CASCADE)
    completion_count = models.IntegerField(default=0)
    average_score = models.FloatField(default=0)
    last_completed = models.DateTimeField(null=True, blank=True)
    mastered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.topic}"

    def update_progress(self, score):
        """Update progress based on new score"""
        self.completion_count += 1
        self.average_score = ((self.average_score * (self.completion_count - 1)) + score) / self.completion_count
        self.last_completed = timezone.now()
        self.mastered = self.average_score >= 80  # Consider mastered if average score is 80% or higher
        self.save()
