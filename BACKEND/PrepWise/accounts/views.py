from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer


# REGISTER
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        if User.objects.filter(email=data.get('email')).exists():
            return Response({"error": "Email already exists"}, status=400)

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "message": "User Registered Successfully",
                "user_id": user.id
            }, status=201)

        return Response(serializer.errors, status=400)


# LOGIN
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if not user.check_password(password):
            return Response({"error": "Invalid password"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }, status=200)