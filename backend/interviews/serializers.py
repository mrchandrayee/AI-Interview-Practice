from rest_framework import serializers
from .models import Interview, InterviewAssessment

class InterviewAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewAssessment
        fields = '__all__'
        read_only_fields = ('created_at',)

class InterviewSerializer(serializers.ModelSerializer):
    assessment = InterviewAssessmentSerializer(read_only=True)
    
    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'completed_at', 'is_completed')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class InterviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ('job_description', 'interviewer_type', 'interviewer_voice', 'duration_minutes')
        read_only_fields = ('user', 'created_at', 'completed_at', 'is_completed')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class InterviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ('transcript', 'recording_url', 'is_completed', 'completed_at')
        read_only_fields = ('user', 'created_at', 'job_description', 'interviewer_type', 
                          'interviewer_voice', 'duration_minutes') 