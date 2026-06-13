from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from .models import UserProfile


class SocialAccountAdapter(DefaultSocialAccountAdapter):

    def save_user(self, request, sociallogin, form=None):
        """Called when a new user is created via social login."""
        user = super().save_user(request, sociallogin, form)
        # Create UserProfile for every new social login user
        UserProfile.objects.get_or_create(user=user)
        return user

    def pre_social_login(self, request, sociallogin):
        """
        Called before the social login is processed.
        Good place to connect an existing account that has the same email.
        """
        if sociallogin.is_existing:
            return
        try:
            from django.contrib.auth.models import User
            email = sociallogin.account.extra_data.get('email', '')
            if email:
                existing = User.objects.get(email=email)
                sociallogin.connect(request, existing)
        except User.DoesNotExist:
            pass