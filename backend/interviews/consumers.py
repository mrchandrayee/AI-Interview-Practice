import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Interview
from .services import InterviewService

class InterviewConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.interview_id = None
        self.interview = None
        self.user = None
        self.interview_service = InterviewService()
        self.is_processing = False
        self.current_response = None

    async def connect(self):
        self.interview_id = self.scope['url_route']['kwargs']['interview_id']
        self.user = self.scope['user']

        if isinstance(self.user, AnonymousUser):
            await self.close()
            return

        try:
            self.interview = await self.get_interview()
            if not self.interview:
                await self.close()
                return

            await self.channel_layer.group_add(
                f'interview_{self.interview_id}',
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            await self.close()

    async def disconnect(self, close_code):
        if self.interview_id:
            await self.channel_layer.group_discard(
                f'interview_{self.interview_id}',
                self.channel_name
            )

    @database_sync_to_async
    def get_interview(self):
        try:
            return Interview.objects.get(
                id=self.interview_id,
                user=self.user,
                is_completed=False
            )
        except Interview.DoesNotExist:
            return None

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')

            if message_type == 'user_message':
                await self.handle_user_message(data)
            elif message_type == 'interrupt':
                await self.handle_interruption()
            elif message_type == 'resume':
                await self.handle_resume()
        except json.JSONDecodeError:
            await self.send_error('Invalid message format')
        except Exception as e:
            await self.send_error(str(e))

    async def handle_user_message(self, data):
        if self.is_processing:
            await self.send_error('Already processing a response')
            return

        self.is_processing = True
        try:
            # Get AI response
            response = await self.interview_service.get_ai_response(
                self.interview,
                data['content']
            )

            # Send text response
            await self.send(text_data=json.dumps({
                'type': 'ai_response',
                'content': response['text']
            }))

            # Generate and send audio
            audio_data = await self.interview_service.generate_audio(
                response['text'],
                self.interview.interviewer_voice
            )
            await self.send(text_data=json.dumps({
                'type': 'audio',
                'audio': audio_data
            }))

            # Mark response as complete
            await self.send(text_data=json.dumps({
                'type': 'ai_done'
            }))

        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')
        finally:
            self.is_processing = False
            self.current_response = None

    async def handle_interruption(self):
        if self.is_processing:
            self.is_processing = False
            await self.interview_service.cancel_current_response()
            await self.send(text_data=json.dumps({
                'type': 'interrupted'
            }))

    async def handle_resume(self):
        if self.current_response:
            await self.send(text_data=json.dumps({
                'type': 'ai_response',
                'content': self.current_response
            }))
            self.is_processing = True

    async def send_error(self, message):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': message
        })) 