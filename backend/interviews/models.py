from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Interview(models.Model):
    INTERVIEWER_TYPES = [
        ('peer', 'Peer'),
        ('manager', 'Manager'),
        ('bar_raiser', 'Bar Raiser'),
        ('technical', 'Technical'),
        ('behavioral', 'Behavioral')
    ]

    INTERVIEWER_VOICE = [
        ('male', 'Male'),
        ('female', 'Female')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job_description = models.TextField()
    interviewer_type = models.CharField(max_length=20, choices=INTERVIEWER_TYPES)
    interviewer_voice = models.CharField(max_length=10, choices=INTERVIEWER_VOICE)
    duration_minutes = models.IntegerField(default=30)
    transcript = models.TextField(blank=True, null=True)
    recording_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.interviewer_type} Interview"

class InterviewAssessment(models.Model):
    interview = models.OneToOneField(Interview, on_delete=models.CASCADE, related_name='assessment')
    domain_expertise_score = models.IntegerField()
    communication_score = models.IntegerField()
    culture_fit_score = models.IntegerField()
    problem_solving_score = models.IntegerField()
    self_awareness_score = models.IntegerField()
    overall_score = models.IntegerField()
    strengths = models.TextField()
    areas_for_improvement = models.TextField()
    recommendations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assessment for {self.interview}"
