from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Result
from quiz.models import Quiz


class ResultAPIView(APIView):

    def get(self, request, quiz_id):
        quiz = Quiz.objects.get(id=quiz_id)
        result = Result.objects.get(quiz=quiz)

        return Response({
            "score": result.score,
            "percentage": result.percentage,
            "level": result.level,
            "feedback": result.feedback
        })
