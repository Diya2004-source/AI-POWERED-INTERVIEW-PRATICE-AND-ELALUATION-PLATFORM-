from django.urls import path
from .views import CategoryAPIView, QuestionListAPIView, QuestionCreateAPIView

urlpatterns = [
    path('categories/', CategoryAPIView.as_view()),
    path('', QuestionListAPIView.as_view()),  # /api/questions/
    path('create/', QuestionCreateAPIView.as_view()),
]