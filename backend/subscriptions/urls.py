from django.urls import path
from .views import (
    SubscriptionPlanListView, UserSubscriptionListView,
    UserSubscriptionDetailView, CreateCheckoutSessionView,
    PaymentListView, PaymentDetailView
)

app_name = 'subscriptions'

urlpatterns = [
    # Subscription Plan URLs
    path('plans/', SubscriptionPlanListView.as_view(), name='plan-list'),
    
    # User Subscription URLs
    path('my-subscriptions/', UserSubscriptionListView.as_view(), name='subscription-list'),
    path('my-subscriptions/<int:pk>/', UserSubscriptionDetailView.as_view(), name='subscription-detail'),
    
    # Payment URLs
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
] 