from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import TrainingModule, TrainingSession, TrainingLesson, TrainingProgress
from .serializers import (
    TrainingModuleSerializer, TrainingSessionSerializer,
    TrainingSessionCreateSerializer, TrainingSessionUpdateSerializer,
    TrainingLessonSerializer, TrainingProgressSerializer
)
from .services import TrainingService
from django.shortcuts import get_object_or_404
from django.db import models

# Create your views here.

class TrainingModuleListView(generics.ListAPIView):

class TrainingLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for training lessons"""
    queryset = TrainingLesson.objects.all()
    serializer_class = TrainingLessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            return self.queryset.filter(difficulty=difficulty)
        return self.queryset

    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        """Start a new training session for a lesson"""
        lesson = self.get_object()
        session = TrainingSession.objects.create(
            user=request.user,
            lesson=lesson
        )
        return Response({
            'session_id': session.id,
            'lesson': TrainingLessonSerializer(lesson).data
        }, status=status.HTTP_201_CREATED)

class TrainingSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for training sessions"""
    serializer_class = TrainingSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingSession.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit_response(self, request, pk=None):
        """Submit a response for the current question"""
        session = self.get_object()
        response = request.data.get('response')
        audio_data = request.data.get('audio_data')

        if not response:
            return Response(
                {'error': 'Response is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = TrainingService()
        analysis = service.analyze_response(session.lesson, response, audio_data)
        next_content = service.get_next_content(session.lesson, analysis)

        # Update session
        session.responses.append({
            'question': session.current_question,
            'response': response,
            'analysis': analysis
        })
        session.current_question += 1
        session.save()

        return Response({
            'analysis': analysis,
            'next_content': next_content
        })

    @action(detail=True, methods=['post'])
    def ask_question(self, request, pk=None):
        """Ask a clarifying question"""
        session = self.get_object()
        question = request.data.get('question')

        if not question:
            return Response(
                {'error': 'Question is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = TrainingService()
        answer = service.get_question_answer(session.lesson, question)

        return Response({'answer': answer})

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pause the training session"""
        session = self.get_object()
        service = TrainingService()
        service.pause_session(session.id)
        return Response({'status': 'paused'})

    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume the training session"""
        session = self.get_object()
        service = TrainingService()
        service.resume_session(session.id)
        return Response({'status': 'resumed'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete the training session"""
        session = self.get_object()
        session.complete()

        # Update progress
        progress, _ = TrainingProgress.objects.get_or_create(
            user=request.user,
            lesson=session.lesson
        )
        progress.update_progress(session.score or 0)

        return Response({'status': 'completed'})

class TrainingProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for training progress"""
    serializer_class = TrainingProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingProgress.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get overview of user's training progress"""
        progress = self.get_queryset()
        total_lessons = TrainingLesson.objects.count()
        completed_lessons = progress.filter(mastered=True).count()
        average_score = progress.aggregate(avg_score=models.Avg('average_score'))['avg_score'] or 0

        return Response({
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'completion_percentage': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0,
            'average_score': average_score,
            'progress_by_difficulty': {
                'beginner': progress.filter(lesson__difficulty='beginner').count(),
                'intermediate': progress.filter(lesson__difficulty='intermediate').count(),
                'advanced': progress.filter(lesson__difficulty='advanced').count()
            }
        })