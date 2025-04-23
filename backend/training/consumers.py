import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import TrainingSession, TrainingLesson
from .services import TrainingService
import asyncio

class TrainingConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.session_id = None
        self.service = TrainingService()
        self.current_lesson = None
        self.is_interrupted = False

    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        await self.channel_layer.group_add(
            f"training_{self.session_id}",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if self.session_id:
            await self.channel_layer.group_discard(
                f"training_{self.session_id}",
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')

            if message_type == 'start_lesson':
                await self.handle_start_lesson(data)
            elif message_type == 'user_response':
                await self.handle_user_response(data)
            elif message_type == 'interrupt':
                await self.handle_interrupt()
            elif message_type == 'resume':
                await self.handle_resume()
            elif message_type == 'question':
                await self.handle_question(data)

        except Exception as e:
            await self.send_error(str(e))

    async def handle_start_lesson(self, data):
        lesson_id = data.get('lesson_id')
        self.current_lesson = await self.get_lesson(lesson_id)
        
        # Start the lesson content
        await self.send_lesson_content()
        
        # Start voice interaction
        await self.start_voice_interaction()

    async def handle_user_response(self, data):
        if self.is_interrupted:
            return

        response = data.get('response')
        audio_data = data.get('audio_data')

        # Process user response
        analysis = await self.service.analyze_response(
            self.current_lesson,
            response,
            audio_data
        )

        # Get next content based on response
        next_content = await self.service.get_next_content(
            self.current_lesson,
            analysis
        )

        # Send response analysis and next content
        await self.send_response_analysis(analysis)
        await self.send_next_content(next_content)

    async def handle_interrupt(self):
        self.is_interrupted = True
        await self.service.pause_session(self.session_id)
        await self.send_interrupt_confirmation()

    async def handle_resume(self):
        self.is_interrupted = False
        await self.service.resume_session(self.session_id)
        await self.send_resume_confirmation()

    async def handle_question(self, data):
        question = data.get('question')
        answer = await self.service.get_question_answer(
            self.current_lesson,
            question
        )
        await self.send_question_answer(answer)

    @database_sync_to_async
    def get_lesson(self, lesson_id):
        return TrainingLesson.objects.get(id=lesson_id)

    async def send_lesson_content(self):
        content = await self.service.get_lesson_content(self.current_lesson)
        await self.send_json({
            'type': 'lesson_content',
            'content': content
        })

    async def send_response_analysis(self, analysis):
        await self.send_json({
            'type': 'response_analysis',
            'analysis': analysis
        })

    async def send_next_content(self, content):
        await self.send_json({
            'type': 'next_content',
            'content': content
        })

    async def send_interrupt_confirmation(self):
        await self.send_json({
            'type': 'interrupt_confirmation'
        })

    async def send_resume_confirmation(self):
        await self.send_json({
            'type': 'resume_confirmation'
        })

    async def send_question_answer(self, answer):
        await self.send_json({
            'type': 'question_answer',
            'answer': answer
        })

    async def send_error(self, error_message):
        await self.send_json({
            'type': 'error',
            'message': error_message
        })

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data)) 