from django.urls import path
from .views import StartQuizAPIView, SubmitQuizAPIView, QuizQuestionAPIView

urlpatterns = [
    path('start/', StartQuizAPIView.as_view()),
    path('questions/<int:quiz_id>/', QuizQuestionAPIView.as_view()),
    path('submit/', SubmitQuizAPIView.as_view()),
]