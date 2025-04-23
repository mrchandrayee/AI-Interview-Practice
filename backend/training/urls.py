from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainingLessonViewSet,
    TrainingSessionViewSet,
    TrainingProgressViewSet
)

router = DefaultRouter()
router.register(r'lessons', TrainingLessonViewSet, basename='lesson')
router.register(r'sessions', TrainingSessionViewSet, basename='session')
router.register(r'progress', TrainingProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
] 