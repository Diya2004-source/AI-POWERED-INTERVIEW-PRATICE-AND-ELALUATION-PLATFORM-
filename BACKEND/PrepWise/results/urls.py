from django.urls import path
from .views import ResultAPIView

urlpatterns = [
    path('<int:quiz_id>/', ResultAPIView.as_view()),
]