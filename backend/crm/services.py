from django.conf import settings
import requests
from typing import Dict, Any
from datetime import datetime

class HubSpotService:
    BASE_URL = 'https://api.hubapi.com'
    
    def __init__(self):
        self.api_key = settings.HUBSPOT_API_KEY
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

    def create_or_update_contact(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a contact in HubSpot"""
        url = f"{self.BASE_URL}/crm/v3/objects/contacts"
        
        # Map user data to HubSpot properties
        properties = {
            'email': user_data.get('email'),
            'firstname': user_data.get('first_name'),
            'lastname': user_data.get('last_name'),
            'phone': user_data.get('phone_number'),
            'linkedin': user_data.get('linkedin_url'),
            'subscription_tier': user_data.get('subscription_tier'),
            'last_login_date': datetime.now().isoformat(),
            'total_interviews': str(user_data.get('total_interviews', 0)),
            'total_training_hours': str(user_data.get('total_training_hours', 0))
        }
        
        response = requests.post(
            url,
            headers=self.headers,
            json={'properties': properties}
        )
        response.raise_for_status()
        return response.json()

    def track_event(self, event_name: str, user_id: str, properties: Dict[str, Any] = None) -> None:
        """Track a custom event in HubSpot"""
        url = f"{self.BASE_URL}/events/v3/send"
        
        event_data = {
            'email': user_id,
            'eventName': event_name,
            'properties': properties or {},
            'occurredAt': datetime.now().isoformat()
        }
        
        response = requests.post(
            url,
            headers=self.headers,
            json=event_data
        )
        response.raise_for_status()

    def get_contact_properties(self, user_id: str) -> Dict[str, Any]:
        """Get contact properties from HubSpot"""
        url = f"{self.BASE_URL}/crm/v3/objects/contacts/{user_id}/properties"
        
        response = requests.get(
            url,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

class AdAttributionService:
    def __init__(self):
        self.facebook_pixel_id = settings.FACEBOOK_PIXEL_ID
        self.google_analytics_id = settings.GOOGLE_ANALYTICS_ID

    def track_conversion(self, event_name: str, user_id: str, value: float = None) -> None:
        """Track conversion events for both Facebook and Google Analytics"""
        # Facebook Pixel event
        if self.facebook_pixel_id:
            self._track_facebook_event(event_name, user_id, value)
        
        # Google Analytics event
        if self.google_analytics_id:
            self._track_google_event(event_name, user_id, value)

    def _track_facebook_event(self, event_name: str, user_id: str, value: float = None) -> None:
        """Track Facebook Pixel event"""
        # Implementation for Facebook Pixel tracking
        pass

    def _track_google_event(self, event_name: str, user_id: str, value: float = None) -> None:
        """Track Google Analytics event"""
        # Implementation for Google Analytics tracking
        pass

    def parse_utm_parameters(self, request) -> Dict[str, str]:
        """Parse UTM parameters from request"""
        utm_params = {}
        for param in ['source', 'medium', 'campaign', 'term', 'content']:
            value = request.GET.get(f'utm_{param}')
            if value:
                utm_params[f'utm_{param}'] = value
        return utm_params 