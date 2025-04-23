from rest_framework import serializers
from .models import SupportIntent, FAQ, SupportTicket, ChatInteraction, CSATRating

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'is_active']
        read_only_fields = ['id']

class SupportIntentSerializer(serializers.ModelSerializer):
    faqs = FAQSerializer(many=True, read_only=True)
    
    class Meta:
        model = SupportIntent
        fields = ['id', 'name', 'description', 'keywords', 'is_active', 'faqs']
        read_only_fields = ['id']

class SupportTicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_email', 'user_name', 'subject', 'description',
            'browser_info', 'last_url', 'session_id', 'console_log',
            'transcript_snippet', 'status', 'priority', 'source',
            'external_id', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'user_email', 'user_name', 'created_at', 'updated_at', 'resolved_at']

class SupportTicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            'subject', 'description', 'browser_info', 'last_url',
            'session_id', 'console_log', 'transcript_snippet', 'source'
        ]
    
    def create(self, validated_data):
        user = self.context['request'].user
        return SupportTicket.objects.create(user=user, **validated_data)

class ChatInteractionSerializer(serializers.ModelSerializer):
    intent_name = serializers.CharField(source='intent.name', read_only=True)
    
    class Meta:
        model = ChatInteraction
        fields = [
            'id', 'user', 'session_id', 'user_message', 'system_response',
            'intent', 'intent_name', 'confidence_score', 'escalated',
            'ticket', 'created_at'
        ]
        read_only_fields = ['id', 'intent_name', 'created_at']

class ChatMessageSerializer(serializers.Serializer):
    """Serializer for processing incoming chat messages"""
    message = serializers.CharField()
    session_id = serializers.CharField(required=False)
    url = serializers.URLField(required=False)
    browser_info = serializers.CharField(required=False)

class CSATRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSATRating
        fields = ['id', 'user', 'ticket', 'chat_interaction', 'rating', 'feedback', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        return CSATRating.objects.create(user=user, **validated_data)