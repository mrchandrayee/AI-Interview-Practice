from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import UserProgress, UserActivity, UserFeedback
from .serializers import (
    UserProgressSerializer, UserActivitySerializer,
    UserFeedbackSerializer, UserFeedbackCreateSerializer
)

# Create your views here.

class UserProgressView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProgressSerializer

    def get_object(self):
        obj, created = UserProgress.objects.get_or_create(user=self.request.user)
        return obj

class UserActivityListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserActivitySerializer

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserActivityDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserActivitySerializer

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)

class UserFeedbackListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserFeedbackCreateSerializer
        return UserFeedbackSerializer

    def get_queryset(self):
        return UserFeedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserFeedbackDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserFeedbackSerializer

    def get_queryset(self):
        return UserFeedback.objects.filter(user=self.request.user)
