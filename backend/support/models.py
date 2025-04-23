from django.db import models
from django.conf import settings
from django.utils import timezone

class SupportIntent(models.Model):
    """Predefined support intents for automated chat responses"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    keywords = models.JSONField(default=list, help_text="List of keywords that trigger this intent")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class FAQ(models.Model):
    """Frequently asked questions for self-help"""
    question = models.CharField(max_length=255)
    answer = models.TextField()
    intent = models.ForeignKey(SupportIntent, on_delete=models.CASCADE, related_name='faqs')
    category = models.CharField(max_length=100, choices=[
        ('account', 'Account Issues'),
        ('interview', 'Mock Interview Setup'),
        ('training', 'Training Module Navigation'),
        ('payment', 'Payment Issues'),
        ('other', 'Other'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.question

class SupportTicket(models.Model):
    """Support tickets created by users"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('waiting', 'Waiting on Customer'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    SOURCE_CHOICES = [
        ('chat', 'Chat Widget'),
        ('report', 'Problem Report'),
        ('email', 'Email'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    browser_info = models.TextField(blank=True)
    last_url = models.URLField(blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    console_log = models.TextField(blank=True)
    transcript_snippet = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ], default='medium')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='chat')
    external_id = models.CharField(max_length=100, blank=True, help_text="ID in external helpdesk system")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Ticket #{self.id}: {self.subject}"
    
    def resolve(self):
        self.status = 'resolved'
        self.resolved_at = timezone.now()
        self.save()

class ChatInteraction(models.Model):
    """Records of chat interactions between users and the support system"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_interactions')
    session_id = models.CharField(max_length=100)
    user_message = models.TextField()
    system_response = models.TextField()
    intent = models.ForeignKey(SupportIntent, on_delete=models.SET_NULL, null=True, blank=True)
    confidence_score = models.FloatField(default=0.0, help_text="Confidence score of intent detection (0-1)")
    escalated = models.BooleanField(default=False)
    ticket = models.ForeignKey(SupportTicket, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_interactions')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Chat with {self.user} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class CSATRating(models.Model):
    """Customer satisfaction ratings"""
    RATING_CHOICES = [
        (1, '👎'),
        (5, '👍'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='csat_ratings')
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='csat_ratings', null=True, blank=True)
    chat_interaction = models.ForeignKey(ChatInteraction, on_delete=models.CASCADE, related_name='csat_ratings', null=True, blank=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Rating: {'👍' if self.rating == 5 else '👎'} by {self.user}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(ticket__isnull=False) | models.Q(chat_interaction__isnull=False),
                name='rating_must_reference_ticket_or_chat'
            )
        ]
