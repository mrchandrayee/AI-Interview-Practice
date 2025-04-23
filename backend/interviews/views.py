from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Interview, InterviewAssessment
from .serializers import (
    InterviewSerializer, InterviewCreateSerializer,
    InterviewUpdateSerializer, InterviewAssessmentSerializer
)
from .services import AssessmentService
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json

# Create your views here.

class InterviewListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InterviewCreateSerializer
        return InterviewSerializer

    def get_queryset(self):
        return Interview.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterviewSerializer

    def get_queryset(self):
        return Interview.objects.filter(user=self.request.user)

class InterviewUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterviewUpdateSerializer

    def get_queryset(self):
        return Interview.objects.filter(user=self.request.user)

class InterviewAssessmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterviewAssessmentSerializer

    def perform_create(self, serializer):
        interview = Interview.objects.get(id=self.kwargs['interview_id'])
        if interview.user != self.request.user:
            raise permissions.PermissionDenied("You don't have permission to create assessment for this interview.")
        serializer.save(interview=interview)

class InterviewAssessmentDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterviewAssessmentSerializer

    def get_queryset(self):
        return InterviewAssessment.objects.filter(interview__user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
async def generate_assessment(request, interview_id):
    """Generate assessment for a completed interview."""
    try:
        interview = await Interview.objects.aget(id=interview_id, user=request.user)
        if not interview:
            return Response(
                {'error': 'Interview not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if interview.status != 'completed':
            return Response(
                {'error': 'Interview must be completed to generate assessment'},
                status=status.HTTP_400_BAD_REQUEST
            )

        assessment_service = AssessmentService()
        transcript = await interview.transcript.all().values()
        assessment = await assessment_service.generate_assessment(interview, list(transcript))

        # Save assessment to database
        await InterviewAssessment.objects.acreate(
            interview=interview,
            domain_expertise_score=assessment['domainExpertise'],
            communication_score=assessment['communication'],
            culture_fit_score=assessment['cultureFit'],
            problem_solving_score=assessment['problemSolving'],
            self_awareness_score=assessment['selfAwareness'],
            overall_score=assessment['overallScore'],
            strengths=json.dumps(assessment['strengths']),
            areas_for_improvement=json.dumps(assessment['improvementAreas']),
            recommendations=json.dumps(assessment['recommendations'])
        )

        return Response(assessment)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def download_assessment_pdf(request, interview_id):
    """Download assessment report as PDF."""
    try:
        interview = await Interview.objects.aget(id=interview_id, user=request.user)
        if not interview:
            return Response(
                {'error': 'Interview not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        assessment = await InterviewAssessment.objects.aget(interview=interview)
        assessment_data = {
            'domainExpertise': assessment.domain_expertise_score,
            'communication': assessment.communication_score,
            'cultureFit': assessment.culture_fit_score,
            'problemSolving': assessment.problem_solving_score,
            'selfAwareness': assessment.self_awareness_score,
            'overallScore': assessment.overall_score,
            'feedback': assessment.feedback,
            'strengths': json.loads(assessment.strengths),
            'improvementAreas': json.loads(assessment.areas_for_improvement),
            'recommendations': json.loads(assessment.recommendations)
        }

        assessment_service = AssessmentService()
        pdf_content = await assessment_service.generate_pdf_report(assessment_data, interview)

        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="interview_assessment_{interview_id}.pdf"'
        return response

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
