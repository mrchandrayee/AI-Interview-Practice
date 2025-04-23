from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('faqs', views.FAQViewSet, basename='faq')
router.register('tickets', views.SupportTicketViewSet, basename='ticket')
router.register('csat', views.CSATRatingViewSet, basename='csat')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', views.ChatViewSet.as_view(), name='chat'),
    path('report-problem/', views.ProblemReportView.as_view(), name='report-problem'),
]