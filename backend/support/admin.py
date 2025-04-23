from django.contrib import admin
from .models import SupportIntent, FAQ, SupportTicket, ChatInteraction, CSATRating

@admin.register(SupportIntent)
class SupportIntentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('is_active',)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'intent', 'is_active')
    list_filter = ('category', 'intent', 'is_active')
    search_fields = ('question', 'answer')

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'user', 'status', 'priority', 'source', 'created_at')
    list_filter = ('status', 'priority', 'source')
    search_fields = ('subject', 'description', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'resolved_at')

@admin.register(ChatInteraction)
class ChatInteractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'intent', 'confidence_score', 'escalated', 'created_at')
    list_filter = ('escalated', 'intent')
    search_fields = ('user_message', 'system_response', 'user__email')
    readonly_fields = ('created_at',)

@admin.register(CSATRating)
class CSATRatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('feedback', 'user__email')
    readonly_fields = ('created_at',)
