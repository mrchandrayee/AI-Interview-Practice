import asyncio
import aiohttp
from django.conf import settings
from .models import Interview
from typing import List, Dict
import json
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.platypus.tables import getSampleStyleSheet

class InterviewService:
    def __init__(self):
        self.current_task = None
        self.elevenlabs_api_key = settings.ELEVENLABS_API_KEY
        self.openai_api_key = settings.OPENAI_API_KEY

    async def get_ai_response(self, interview: Interview, user_message: str) -> dict:
        """Get AI response based on interview context and user message."""
        try:
            async with aiohttp.ClientSession() as session:
                # Prepare the context for the AI
                context = {
                    'job_description': interview.job_description,
                    'interviewer_type': interview.interviewer_type,
                    'previous_messages': [],  # TODO: Add previous messages from transcript
                    'user_message': user_message
                }

                # Call OpenAI API
                async with session.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {self.openai_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-4',
                        'messages': [
                            {
                                'role': 'system',
                                'content': self._get_system_prompt(interview)
                            },
                            {
                                'role': 'user',
                                'content': user_message
                            }
                        ],
                        'temperature': 0.7,
                        'max_tokens': 500
                    }
                ) as response:
                    if response.status != 200:
                        raise Exception('Failed to get AI response')
                    
                    data = await response.json()
                    return {
                        'text': data['choices'][0]['message']['content']
                    }

        except Exception as e:
            raise Exception(f'Error getting AI response: {str(e)}')

    async def generate_audio(self, text: str, voice: str) -> bytes:
        """Generate audio from text using ElevenLabs API."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    'https://api.elevenlabs.io/v1/text-to-speech',
                    headers={
                        'xi-api-key': self.elevenlabs_api_key,
                        'Content-Type': 'application/json'
                    },
                    json={
                        'text': text,
                        'voice_id': self._get_voice_id(voice),
                        'model_id': 'eleven_monolingual_v1'
                    }
                ) as response:
                    if response.status != 200:
                        raise Exception('Failed to generate audio')
                    
                    return await response.read()

        except Exception as e:
            raise Exception(f'Error generating audio: {str(e)}')

    async def cancel_current_response(self):
        """Cancel the current AI response generation."""
        if self.current_task and not self.current_task.done():
            self.current_task.cancel()
            try:
                await self.current_task
            except asyncio.CancelledError:
                pass

    def _get_system_prompt(self, interview: Interview) -> str:
        """Generate system prompt based on interview configuration."""
        interviewer_type = interview.interviewer_type
        job_description = interview.job_description

        return f"""You are a {interviewer_type} interviewer conducting a technical interview.
        The job description is: {job_description}
        
        Your role is to:
        1. Ask relevant technical questions
        2. Evaluate the candidate's responses
        3. Provide constructive feedback
        4. Maintain a professional and engaging conversation
        
        Keep your responses concise and focused on the interview context."""

    def _get_voice_id(self, voice: str) -> str:
        """Get ElevenLabs voice ID based on selected voice."""
        voice_map = {
            'male': '21m00Tcm4TlvDq8ikWAM',  # Example voice ID
            'female': 'EXAVITQu4vr4xnSDxMaL'  # Example voice ID
        }
        return voice_map.get(voice, voice_map['male'])

class AssessmentService:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY

    async def generate_assessment(self, interview: Interview, transcript: List[Dict]) -> Dict:
        """Generate comprehensive assessment using GPT-4."""
        try:
            async with aiohttp.ClientSession() as session:
                # Prepare the context for assessment
                context = {
                    'job_description': interview.job_description,
                    'interviewer_type': interview.interviewer_type,
                    'transcript': transcript,
                    'candidate_resume': interview.resume_url
                }

                # Call OpenAI API for assessment
                async with session.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {self.openai_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-4',
                        'messages': [
                            {
                                'role': 'system',
                                'content': self._get_assessment_prompt(context)
                            }
                        ],
                        'temperature': 0.7,
                        'max_tokens': 2000
                    }
                ) as response:
                    if response.status != 200:
                        raise Exception('Failed to generate assessment')
                    
                    data = await response.json()
                    assessment = self._parse_assessment_response(data['choices'][0]['message']['content'])
                    return assessment

        except Exception as e:
            raise Exception(f'Error generating assessment: {str(e)}')

    def _get_assessment_prompt(self, context: Dict) -> str:
        """Generate system prompt for assessment."""
        return f"""You are an expert interview assessment AI. Analyze the following interview and provide a comprehensive assessment:

Job Description: {context['job_description']}
Interviewer Type: {context['interviewer_type']}
Candidate Resume: {context['candidate_resume']}

Interview Transcript:
{json.dumps(context['transcript'], indent=2)}

Provide an assessment with the following structure:
1. Scores (0-100) for:
   - Domain Expertise
   - Communication & Presence
   - Culture Fit
   - Problem Solving
   - Self-awareness & Authenticity
2. Overall Score (0-100)
3. Detailed feedback for each category
4. Key strengths
5. Areas for improvement
6. Specific recommendations

Format the response as a JSON object with these fields:
{{
    "domainExpertise": number,
    "communication": number,
    "cultureFit": number,
    "problemSolving": number,
    "selfAwareness": number,
    "overallScore": number,
    "feedback": string,
    "strengths": [string],
    "improvementAreas": [string],
    "recommendations": [string]
}}"""

    def _parse_assessment_response(self, response: str) -> Dict:
        """Parse the GPT response into a structured assessment."""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            raise Exception('Invalid assessment response format')

    async def generate_pdf_report(self, assessment: Dict, interview: Interview) -> bytes:
        """Generate PDF report from assessment data."""
        try:
            # Create PDF using reportlab
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            # Add header
            story.append(Paragraph("Interview Assessment Report", styles['Title']))
            story.append(Spacer(1, 12))

            # Add interview details
            story.append(Paragraph(f"Interview ID: {interview.id}", styles['Normal']))
            story.append(Paragraph(f"Date: {interview.created_at}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Add scores
            story.append(Paragraph("Assessment Scores", styles['Heading2']))
            scores = [
                ["Category", "Score"],
                ["Domain Expertise", f"{assessment['domainExpertise']}%"],
                ["Communication", f"{assessment['communication']}%"],
                ["Culture Fit", f"{assessment['cultureFit']}%"],
                ["Problem Solving", f"{assessment['problemSolving']}%"],
                ["Self-awareness", f"{assessment['selfAwareness']}%"],
                ["Overall Score", f"{assessment['overallScore']}%"]
            ]
            table = Table(scores)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 12),
                ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)
            story.append(Spacer(1, 12))

            # Add detailed feedback
            story.append(Paragraph("Detailed Feedback", styles['Heading2']))
            story.append(Paragraph(assessment['feedback'], styles['Normal']))
            story.append(Spacer(1, 12))

            # Add strengths
            story.append(Paragraph("Key Strengths", styles['Heading2']))
            for strength in assessment['strengths']:
                story.append(Paragraph(f"• {strength}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Add improvement areas
            story.append(Paragraph("Areas for Improvement", styles['Heading2']))
            for area in assessment['improvementAreas']:
                story.append(Paragraph(f"• {area}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Add recommendations
            story.append(Paragraph("Recommendations", styles['Heading2']))
            for rec in assessment['recommendations']:
                story.append(Paragraph(f"• {rec}", styles['Normal']))

            # Build PDF
            doc.build(story)
            return buffer.getvalue()

        except Exception as e:
            raise Exception(f'Error generating PDF report: {str(e)}') 