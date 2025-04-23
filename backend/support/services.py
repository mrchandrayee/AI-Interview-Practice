import json
import uuid
import requests
import logging
from typing import Dict, Any, List, Optional, Tuple
from django.conf import settings
from .models import SupportIntent, FAQ, SupportTicket, ChatInteraction

logger = logging.getLogger(__name__)

class SupportService:
    """Service for handling customer support interactions"""
    
    def __init__(self):
        # Initialize API keys and settings
        self.openai_api_key = settings.OPENAI_API_KEY
        self.helpdesk_api_key = getattr(settings, 'HELPDESK_API_KEY', None)
        self.helpdesk_domain = getattr(settings, 'HELPDESK_DOMAIN', None)
        self.helpdesk_email = getattr(settings, 'HELPDESK_EMAIL', None)
        self.confidence_threshold = 0.6  # Threshold for escalation
    
    async def process_chat_message(self, user, message: str, session_id: str = None, 
                                  url: str = None, browser_info: str = None) -> Dict[str, Any]:
        """Process an incoming chat message and return a response"""
        # Generate or use existing session ID
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Detect intent and get response
        intent, confidence, response, should_escalate = await self._detect_intent(message)
        
        # Record the interaction
        chat_interaction = ChatInteraction.objects.create(
            user=user,
            session_id=session_id,
            user_message=message,
            system_response=response,
            intent=intent,
            confidence_score=confidence,
            escalated=should_escalate
        )
        
        # Create a ticket if escalation is needed
        ticket = None
        if should_escalate:
            ticket = await self.create_ticket(
                user=user, 
                subject=f"Chat Escalation: {message[:50]}...",
                description=f"Chat escalated due to low confidence ({confidence*100:.1f}%).\n\nUser message: {message}",
                browser_info=browser_info,
                last_url=url,
                session_id=session_id,
                source='chat'
            )
            chat_interaction.ticket = ticket
            chat_interaction.save()
            
            # Add ticket information to response
            response += f"\n\nI've created a support ticket (#{ticket.id}) for you. Our team will get back to you soon."
            if self.helpdesk_email:
                response += f" You can also reach us directly at {self.helpdesk_email}."
        
        return {
            'session_id': session_id,
            'response': response,
            'intent_detected': intent.name if intent else None,
            'confidence': confidence,
            'escalated': should_escalate,
            'ticket_id': ticket.id if ticket else None
        }
    
    async def _detect_intent(self, message: str) -> Tuple[Optional[SupportIntent], float, str, bool]:
        """Detect the intent of a message using NLP and keyword matching"""
        # First try keyword matching
        intents = SupportIntent.objects.filter(is_active=True)
        for intent in intents:
            for keyword in intent.keywords:
                if keyword.lower() in message.lower():
                    # Get FAQs for this intent
                    faqs = FAQ.objects.filter(intent=intent, is_active=True)
                    if faqs.exists():
                        faq = faqs.first()
                        response = faq.answer
                        return intent, 0.85, response, False
        
        # If no keyword match, use OpenAI to determine intent
        try:
            # Call OpenAI API to analyze message
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Prepare the system prompt with available intents
            intent_names = [intent.name for intent in intents]
            prompt = f"""
            Analyze the following user message and classify it into one of these intents: {', '.join(intent_names)}.
            If you're not confident, respond with "unknown".
            
            Also determine if this should be handled by a human support agent.
            
            Format your response as JSON with these fields:
            - intent: the classified intent or "unknown"
            - confidence: 0-1 score of your confidence
            - needs_human: true/false
            - response: brief helpful response to the user
            """
            
            payload = {
                'model': 'gpt-4',
                'messages': [
                    {'role': 'system', 'content': prompt},
                    {'role': 'user', 'content': message}
                ],
                'response_format': {'type': 'json_object'}
            }
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            # Parse the response
            response_data = response.json()
            ai_content = json.loads(response_data['choices'][0]['message']['content'])
            
            intent_name = ai_content.get('intent')
            confidence = ai_content.get('confidence', 0.0)
            needs_human = ai_content.get('needs_human', False)
            response_text = ai_content.get('response', 'I\'m not sure how to help with that. Let me connect you with our support team.')
            
            # Get or create the intent
            intent = None
            if intent_name and intent_name != "unknown":
                intent = intents.filter(name=intent_name).first()
            
            # Determine if we should escalate
            should_escalate = needs_human or confidence < self.confidence_threshold
            
            return intent, confidence, response_text, should_escalate
            
        except Exception as e:
            logger.error(f"Error detecting intent: {e}")
            return None, 0.0, "I'm having trouble understanding. Let me connect you with our support team.", True
    
    async def create_ticket(self, user, subject, description, browser_info=None, 
                           last_url=None, session_id=None, console_log=None, 
                           transcript_snippet=None, source='chat') -> SupportTicket:
        """Create a support ticket in both local DB and external helpdesk system"""
        # Create local ticket
        ticket = SupportTicket.objects.create(
            user=user,
            subject=subject,
            description=description,
            browser_info=browser_info or '',
            last_url=last_url or '',
            session_id=session_id or '',
            console_log=console_log or '',
            transcript_snippet=transcript_snippet or '',
            source=source
        )
        
        # Create ticket in external helpdesk system if configured
        if self.helpdesk_api_key and self.helpdesk_domain:
            try:
                # Format for popular helpdesk APIs like Freshdesk/HelpScout
                ticket_data = {
                    'subject': subject,
                    'description': description,
                    'email': user.email,
                    'name': user.get_full_name() or user.email,
                    'status': 'new',
                    'priority': 'medium',
                    'custom_fields': {
                        'browser_info': browser_info or '',
                        'last_url': last_url or '',
                        'session_id': session_id or '',
                        'internal_ticket_id': str(ticket.id),
                    }
                }
                
                # Replace with appropriate API endpoint and format for your helpdesk system
                response = requests.post(
                    f"https://{self.helpdesk_domain}/api/v2/tickets",
                    headers={
                        'Authorization': f'Basic {self.helpdesk_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json=ticket_data
                )
                
                if response.status_code in (200, 201):
                    external_id = response.json().get('id')
                    if external_id:
                        ticket.external_id = str(external_id)
                        ticket.save(update_fields=['external_id'])
                
            except Exception as e:
                logger.error(f"Error creating external helpdesk ticket: {e}")
        
        return ticket
    
    async def report_problem(self, user, session_id, transcript_snippet, console_log):
        """Create a ticket from a problem report button"""
        return await self.create_ticket(
            user=user,
            subject="Problem Report",
            description="User reported a problem during a session",
            session_id=session_id,
            transcript_snippet=transcript_snippet,
            console_log=console_log,
            source='report'
        )
    
    async def get_daily_ticket_count(self) -> int:
        """Get count of tickets created today"""
        from django.utils import timezone
        import datetime
        
        today = timezone.now().date()
        return SupportTicket.objects.filter(
            created_at__date=today
        ).count()