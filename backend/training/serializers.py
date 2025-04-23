from rest_framework import serializers
from .models import TrainingModule, TrainingSession, TrainingLesson, TrainingProgress

class TrainingLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingLesson
        fields = [
            'id', 'topic', 'content', 'questions', 'duration',
            'objectives', 'difficulty', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class TrainingModuleSerializer(serializers.ModelSerializer):
    lessons = TrainingLessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = TrainingModule
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class TrainingSessionSerializer(serializers.ModelSerializer):
    lesson = TrainingLessonSerializer(read_only=True)
    
    class Meta:
        model = TrainingSession
        fields = [
            'id', 'user', 'lesson', 'start_time', 'end_time',
            'is_completed', 'is_paused', 'current_question',
            'responses', 'score', 'feedback', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'user', 'start_time', 'end_time', 'is_completed',
            'is_paused', 'current_question', 'responses', 'score',
            'feedback', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TrainingSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = ('module', 'total_lessons')
        read_only_fields = ('user', 'created_at', 'last_accessed', 'completed_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TrainingSessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = ('current_lesson', 'progress_percentage', 'is_completed', 'completed_at')
        read_only_fields = ('user', 'module', 'total_lessons', 'created_at', 'last_accessed')

class TrainingProgressSerializer(serializers.ModelSerializer):
    lesson = TrainingLessonSerializer(read_only=True)
    
    class Meta:
        model = TrainingProgress
        fields = [
            'id', 'user', 'lesson', 'completion_count',
            'average_score', 'last_completed', 'mastered',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'user', 'completion_count', 'average_score',
            'last_completed', 'mastered', 'created_at', 'updated_at'
        ] 