from django.shortcuts import render
from rest_framework import views, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import SupportIntent, FAQ, SupportTicket, ChatInteraction, CSATRating
from .serializers import (
    SupportIntentSerializer, FAQSerializer, SupportTicketSerializer,
    SupportTicketCreateSerializer, ChatInteractionSerializer, 
    ChatMessageSerializer, CSATRatingSerializer
)
from .services import SupportService

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for displaying FAQs"""
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category', 'is_active']
    
    def get_queryset(self):
        return FAQ.objects.filter(is_active=True)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Group FAQs by category"""
        categories = {}
        for faq in self.get_queryset():
            if faq.category not in categories:
                categories[faq.category] = []
            categories[faq.category].append(FAQSerializer(faq).data)
        
        return Response(categories)

class SupportTicketViewSet(viewsets.ModelViewSet):
    """ViewSet for support tickets"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SupportTicketCreateSerializer
        return SupportTicketSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark a ticket as resolved"""
        ticket = self.get_object()
        ticket.resolve()
        return Response({'status': 'ticket resolved'})

class ChatViewSet(views.APIView):
    """API for chat interactions"""
    permission_classes = [permissions.IsAuthenticated]
    
    async def post(self, request):
        """Process a chat message and return a response"""
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            service = SupportService()
            response = await service.process_chat_message(
                user=request.user,
                message=serializer.validated_data['message'],
                session_id=serializer.validated_data.get('session_id'),
                url=serializer.validated_data.get('url'),
                browser_info=serializer.validated_data.get('browser_info')
            )
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProblemReportView(views.APIView):
    """API for problem reporting"""
    permission_classes = [permissions.IsAuthenticated]
    
    async def post(self, request):
        """Create a ticket from a problem report"""
        service = SupportService()
        ticket = await service.report_problem(
            user=request.user,
            session_id=request.data.get('session_id', ''),
            transcript_snippet=request.data.get('transcript_snippet', ''),
            console_log=request.data.get('console_log', '')
        )
        return Response({
            'status': 'problem reported',
            'ticket_id': ticket.id
        })

class CSATRatingViewSet(viewsets.ModelViewSet):
    """ViewSet for CSAT ratings"""
    serializer_class = CSATRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return CSATRating.objects.all()
        return CSATRating.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
