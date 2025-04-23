from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import User, ReferralReward
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    UserUpdateSerializer, ChangePasswordSerializer,
    ReferralRewardSerializer
)
from subscriptions.models import UserSubscription

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Wrong password."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"message": "Password updated successfully."}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReferralCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'referral_code': user.referral_code,
            'referral_link': f"{request.build_absolute_uri('/')}register?ref={user.referral_code}",
            'total_referrals': user.referrals.count(),
            'referral_credits': user.referral_credits
        })

class ApplyReferralCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Referral code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            referrer = User.objects.get(referral_code=code)
            if referrer == request.user:
                return Response(
                    {'error': 'Cannot use your own referral code'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create referral reward for both users
            ReferralReward.objects.create(
                user=request.user,
                reward_type='subscription_days',
                amount=7,
                description='7 days free subscription for using referral code'
            )

            ReferralReward.objects.create(
                user=referrer,
                reward_type='credits',
                amount=100,
                description='100 credits for referring a new user'
            )

            # Update referral credits
            referrer.referral_credits += 100
            referrer.save()

            return Response({
                'message': 'Referral code applied successfully',
                'rewards': ReferralRewardSerializer(
                    request.user.rewards.filter(is_claimed=False),
                    many=True
                ).data
            })

        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid referral code'},
                status=status.HTTP_400_BAD_REQUEST
            )

class ReferralRewardsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReferralRewardSerializer

    def get_queryset(self):
        return ReferralReward.objects.filter(user=self.request.user)

class ClaimRewardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, reward_id):
        try:
            reward = ReferralReward.objects.get(id=reward_id, user=request.user, is_claimed=False)
            
            if reward.reward_type == 'subscription_days':
                subscription = UserSubscription.objects.filter(
                    user=request.user,
                    is_active=True
                ).first()
                
                if subscription:
                    subscription.end_date += timedelta(days=reward.amount)
                    subscription.save()
                else:
                    UserSubscription.objects.create(
                        user=request.user,
                        plan_id=1,  # Free plan
                        start_date=timezone.now(),
                        end_date=timezone.now() + timedelta(days=reward.amount),
                        is_active=True
                    )
            
            elif reward.reward_type == 'credits':
                request.user.referral_credits += reward.amount
                request.user.save()
            
            reward.is_claimed = True
            reward.save()

            return Response({
                'message': 'Reward claimed successfully',
                'remaining_rewards': ReferralRewardSerializer(
                    request.user.rewards.filter(is_claimed=False),
                    many=True
                ).data
            })

        except ReferralReward.DoesNotExist:
            return Response(
                {'error': 'Invalid reward or already claimed'},
                status=status.HTTP_400_BAD_REQUEST
            )
