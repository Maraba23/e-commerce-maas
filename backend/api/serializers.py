from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)
        profile = Profile.objects.get(user=self.user)
        data['role'] = profile.role

        return data
