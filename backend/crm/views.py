from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import UserSegment, UserSegmentMembership, UserLifecycleStage, UserEngagementScore
from .services import HubSpotService, AdAttributionService
from .serializers import (
    UserSegmentSerializer,
    UserSegmentMembershipSerializer,
    UserLifecycleStageSerializer,
    UserEngagementScoreSerializer
)

class UserSegmentViewSet(viewsets.ModelViewSet):
    queryset = UserSegment.objects.all()
    serializer_class = UserSegmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def user_segments(self, request):
        """Get segments for the current user"""
        memberships = UserSegmentMembership.objects.filter(
            user=request.user,
            left_at__isnull=True
        )
        serializer = UserSegmentMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

class UserLifecycleViewSet(viewsets.ModelViewSet):
    queryset = UserLifecycleStage.objects.all()
    serializer_class = UserLifecycleStageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def current_stage(self, request):
        """Get current lifecycle stage for the user"""
        current_stage = self.get_queryset().filter(left_at__isnull=True).first()
        if current_stage:
            serializer = self.get_serializer(current_stage)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.hubspot = HubSpotService()
        self.ad_attribution = AdAttributionService()

    @action(detail=False, methods=['post'])
    def track_event(self, request):
        """Track an event in HubSpot and other analytics platforms"""
        event_name = request.data.get('eventName')
        properties = request.data.get('properties', {})

        try:
            # Track in HubSpot
            self.hubspot.track_event(
                event_name,
                request.user.email,
                properties
            )

            # Track conversion if applicable
            if event_name == 'purchase':
                self.ad_attribution.track_conversion(
                    event_name,
                    request.user.email,
                    properties.get('value')
                )

            return Response({'status': 'success'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def engagement_score(self, request):
        """Get user engagement score"""
        try:
            score, created = UserEngagementScore.objects.get_or_create(
                user=request.user
            )
            if created or (timezone.now() - score.last_calculated).days >= 1:
                score.calculate_score()
            serializer = UserEngagementScoreSerializer(score)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def attribution(self, request):
        """Get ad attribution data for the user"""
        try:
            utm_params = self.ad_attribution.parse_utm_parameters(request)
            return Response(utm_params)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 