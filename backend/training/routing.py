from django.urls import re_path
from .consumers import TrainingConsumer

websocket_urlpatterns = [
    re_path(
        r'ws/training/session/(?P<session_id>[^/]+)/$',
        TrainingConsumer.as_asgi()
    ),
] 