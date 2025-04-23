from .models import TrainingSession, TrainingLesson
from django.conf import settings
import openai
import elevenlabs
import json
from typing import Dict, Any, Optional
import asyncio
from channels.db import database_sync_to_async

class TrainingService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        elevenlabs.set_api_key(settings.ELEVENLABS_API_KEY)

    async def analyze_response(self, lesson: TrainingLesson, response: str, audio_data: Optional[bytes] = None) -> Dict[str, Any]:
        """Analyze user's response using OpenAI"""
        prompt = f"""
        Analyze the following response to the training question:
        Question: {lesson.current_question}
        Response: {response}
        
        Provide analysis in JSON format with:
        - correctness (0-100)
        - key_points_missed (list)
        - suggestions (list)
        - confidence_score (0-100)
        """
        
        completion = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a training assistant analyzing responses."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)

    async def get_next_content(self, lesson: TrainingLesson, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Determine next content based on response analysis"""
        if analysis['correctness'] < 70:
            # If response is poor, provide remedial content
            return {
                'type': 'remedial',
                'content': await self.generate_remedial_content(lesson, analysis),
                'should_repeat': True
            }
        else:
            # Move to next question or section
            return {
                'type': 'next',
                'content': await self.get_next_question(lesson),
                'should_repeat': False
            }

    async def generate_remedial_content(self, lesson: TrainingLesson, analysis: Dict[str, Any]) -> str:
        """Generate remedial content based on analysis"""
        prompt = f"""
        Generate remedial content for the following:
        Topic: {lesson.topic}
        Missed points: {', '.join(analysis['key_points_missed'])}
        Current understanding: {analysis['correctness']}%
        
        Provide clear explanations and examples.
        """
        
        completion = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a training assistant providing remedial content."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return completion.choices[0].message.content

    async def get_next_question(self, lesson: TrainingLesson) -> str:
        """Get the next question in the lesson"""
        questions = lesson.questions
        current_index = lesson.current_question
        
        if current_index < len(questions):
            return questions[current_index]
        else:
            return "You have completed all questions in this lesson."

    async def get_question_answer(self, lesson: TrainingLesson, question: str) -> str:
        """Get answer to user's clarifying question"""
        prompt = f"""
        Answer the following question about the training topic:
        Topic: {lesson.topic}
        Question: {question}
        
        Provide a clear, concise answer.
        """
        
        completion = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a training assistant answering questions."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return completion.choices[0].message.content

    async def generate_voice_response(self, text: str) -> bytes:
        """Generate voice response using ElevenLabs"""
        audio = elevenlabs.generate(
            text=text,
            voice="Rachel",
            model="eleven_monolingual_v1"
        )
        return audio

    @database_sync_to_async
    def pause_session(self, session_id: str):
        """Pause the training session"""
        session = TrainingSession.objects.get(id=session_id)
        session.is_paused = True
        session.save()

    @database_sync_to_async
    def resume_session(self, session_id: str):
        """Resume the training session"""
        session = TrainingSession.objects.get(id=session_id)
        session.is_paused = False
        session.save()

    @database_sync_to_async
    def get_lesson_content(self, lesson: TrainingLesson) -> Dict[str, Any]:
        """Get formatted lesson content"""
        return {
            'topic': lesson.topic,
            'content': lesson.content,
            'questions': lesson.questions,
            'duration': lesson.duration,
            'objectives': lesson.objectives
        } 