# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from django.contrib.auth.hashers import check_password

# from rest_framework_simplejwt.tokens import RefreshToken

# from .models import User
# from .serializers import UserSerializer


# #  REGISTER API
# class RegisterAPIView(APIView):
#     def post(self, request):
#         data = request.data

#         # Check if email already exists
#         if User.objects.filter(email=data.get('email')).exists():
#             return Response(
#                 {"error": "Email already exists"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         serializer = UserSerializer(data=data)

#         if serializer.is_valid():
#             user = serializer.save()

#             #  Hash password
#             user.set_password(data.get('password'))
#             user.save()

#             return Response(
#                 {
#                     "message": "User Registered Successfully",
#                     "user_id": user.id
#                 },
#                 status=status.HTTP_201_CREATED
#             )

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# #  LOGIN API (JWT TOKEN BASED)
# class LoginAPIView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         if not email or not password:
#             return Response(
#                 {"error": "Please provide both email and password"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Check user exists
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response(
#                 {"error": "User not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # Check password manually
#         if not check_password(password, user.password):
#             return Response(
#                 {"error": "Invalid password"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         #  GENERATE JWT TOKEN
#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "message": "Login successful",
#                 "access_token": str(refresh.access_token),
#                 "refresh_token": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "name": user.name,
#                     "email": user.email
#                 }
#             },
#             status=status.HTTP_200_OK
#         )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # Added for public access
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer

# REGISTER API
class RegisterAPIView(APIView):
    # This allows anyone to create an account without needing a token first
    permission_classes = [AllowAny] 

    def post(self, request):
        data = request.data

        # Check if email already exists
        if User.objects.filter(email=data.get('email')).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()

            # Hash password properly
            user.set_password(data.get('password'))
            user.save()

            return Response(
                {
                    "message": "User Registered Successfully",
                    "user_id": user.id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN API (JWT TOKEN BASED)
class LoginAPIView(APIView):
    # This allows users to hit the login endpoint without being authenticated
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check password manually
        if not check_password(password, user.password):
            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # GENERATE JWT TOKEN
        refresh = RefreshToken.for_user(user)

        # The response structure below matches the updated login.js logic
        return Response(
            {
                "message": "Login successful",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            },
            status=status.HTTP_200_OK
        )