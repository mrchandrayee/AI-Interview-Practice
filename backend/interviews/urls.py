from django.urls import path
from .views import (
    InterviewListView, InterviewDetailView, InterviewUpdateView,
    InterviewAssessmentCreateView, InterviewAssessmentDetailView
)

app_name = 'interviews'

urlpatterns = [
    path('', InterviewListView.as_view(), name='interview-list'),
    path('<int:pk>/', InterviewDetailView.as_view(), name='interview-detail'),
    path('<int:pk>/update/', InterviewUpdateView.as_view(), name='interview-update'),
    path('<int:interview_id>/assessment/', InterviewAssessmentCreateView.as_view(), name='assessment-create'),
    path('assessment/<int:pk>/', InterviewAssessmentDetailView.as_view(), name='assessment-detail'),
] 