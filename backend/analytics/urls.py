from django.urls import path
from .views import (
    UserProgressView, UserActivityListView, UserActivityDetailView,
    UserFeedbackListView, UserFeedbackDetailView
)

app_name = 'analytics'

urlpatterns = [
    # User Progress URLs
    path('progress/', UserProgressView.as_view(), name='progress'),
    
    # User Activity URLs
    path('activities/', UserActivityListView.as_view(), name='activity-list'),
    path('activities/<int:pk>/', UserActivityDetailView.as_view(), name='activity-detail'),
    
    # User Feedback URLs
    path('feedback/', UserFeedbackListView.as_view(), name='feedback-list'),
    path('feedback/<int:pk>/', UserFeedbackDetailView.as_view(), name='feedback-detail'),
] 