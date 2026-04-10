from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password'] # Remove 'username' from here
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # We use the email as the username since AbstractUser needs one
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password']
        )
        return user