from django.utils import timezone
from .models import Badge, Title, UserProgress, UserBadge, UserActivity

class BadgeService:
    @staticmethod
    def check_and_award_badges(user_progress):
        """Check and award badges based on user progress"""
        badges = Badge.objects.all()
        for badge in badges:
            if not UserBadge.objects.filter(
                user_progress=user_progress,
                badge=badge
            ).exists():
                if BadgeService._check_badge_criteria(user_progress, badge):
                    BadgeService._award_badge(user_progress, badge)

    @staticmethod
    def _check_badge_criteria(user_progress, badge):
        """Check if user meets badge criteria"""
        criteria = badge.criteria
        if criteria.get('type') == 'interview_count':
            return user_progress.total_interviews >= criteria.get('count', 0)
        elif criteria.get('type') == 'streak':
            return user_progress.current_streak_days >= criteria.get('days', 0)
        elif criteria.get('type') == 'score':
            return user_progress.average_interview_score >= criteria.get('score', 0)
        return False

    @staticmethod
    def _award_badge(user_progress, badge):
        """Award badge to user"""
        user_badge = UserBadge.objects.create(
            user_progress=user_progress,
            badge=badge
        )
        UserActivity.objects.create(
            user=user_progress.user,
            activity_type='badge',
            description=f"Earned badge: {badge.name}",
            metadata={'badge_id': badge.id}
        )

class TitleService:
    @staticmethod
    def check_and_update_title(user_progress):
        """Check and update user title based on progress"""
        titles = Title.objects.order_by('level')
        for title in titles:
            if TitleService._check_title_criteria(user_progress, title):
                if not user_progress.current_title or title.level > user_progress.current_title.level:
                    TitleService._update_title(user_progress, title)
                    break

    @staticmethod
    def _check_title_criteria(user_progress, title):
        """Check if user meets title criteria"""
        criteria = title.criteria
        if criteria.get('type') == 'interview_score':
            return user_progress.average_interview_score >= criteria.get('score', 0)
        elif criteria.get('type') == 'training_hours':
            return user_progress.total_training_hours >= criteria.get('hours', 0)
        return False

    @staticmethod
    def _update_title(user_progress, title):
        """Update user's title"""
        user_progress.current_title = title
        user_progress.save()
        UserActivity.objects.create(
            user=user_progress.user,
            activity_type='title',
            description=f"Earned title: {title.name}",
            metadata={'title_id': title.id}
        )

class CSATService:
    @staticmethod
    def check_and_prompt_csat(user_progress):
        """Check if user should be prompted for CSAT and create prompt if needed"""
        if user_progress.should_prompt_csat():
            user_progress.last_csat_prompt = timezone.now()
            user_progress.save()
            return True
        return False 