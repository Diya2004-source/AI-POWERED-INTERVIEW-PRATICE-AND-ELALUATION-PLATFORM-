from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from results.models import Result
from .models import Quiz, QuizQuestion, UserAnswer
from questions.models import Question
from accounts.models import User


# START QUIZ
class StartQuizAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.data.get('user')

        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, id=user_id)

        quiz = Quiz.objects.create(user=user)

        questions = Question.objects.all()[:5]

        quiz_questions = [
            QuizQuestion(quiz=quiz, question=q)
            for q in questions
        ]

        QuizQuestion.objects.bulk_create(quiz_questions)

        return Response(
            {"quiz_id": quiz.id},
            status=status.HTTP_201_CREATED
        )


# GET QUIZ QUESTIONS
class QuizQuestionAPIView(APIView):
    def get(self, request, quiz_id):

        quiz_questions = QuizQuestion.objects.filter(quiz_id=quiz_id)

        if not quiz_questions.exists():
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        result = []
        for qq in quiz_questions:
            q = qq.question
            result.append({
                "id": q.id,
                "text": q.text,
                "option1": q.option1,
                "option2": q.option2,
                "option3": q.option3,
                "option4": q.option4
            })

        return Response(result, status=status.HTTP_200_OK)


# SUBMIT QUIZ 
class SubmitQuizAPIView(APIView):

    def post(self, request):
        quiz_id = request.data.get('quiz_id')
        answers = request.data.get('answers', [])

        # VALIDATION
        if not quiz_id:
            return Response(
                {"error": "quiz_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not answers:
            return Response(
                {"error": "answers cannot be empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        quiz = get_object_or_404(Quiz, id=quiz_id)

        score = 0
        total = len(answers)

        user_answers_to_create = []

        # LOOP (SAFE + OPTIMIZED)
        for ans in answers:
            question_id = ans.get('question_id')
            selected_answer = ans.get('selected_answer')

            if not question_id or selected_answer is None:
                continue  # skip invalid entries safely

            question = get_object_or_404(Question, id=question_id)

            is_correct = (question.correct_answer == selected_answer)

            if is_correct:
                score += 1

            user_answers_to_create.append(
                UserAnswer(
                    quiz=quiz,
                    question=question,
                    selected_answer=selected_answer,
                    is_correct=is_correct
                )
            )

        UserAnswer.objects.bulk_create(user_answers_to_create)

        # CALCULATIONS
        percentage = (score / total) * 100 if total > 0 else 0

        if percentage < 40:
            level = "Beginner"
            feedback = "You need to focus on basics"
        elif percentage <= 70:
            level = "Intermediate"
            feedback = "You have some understanding but need improvement"
        else:
            level = "Advanced"
            feedback = "Strong understanding of concepts"

        # SAVE RESULT
        Result.objects.create(
            quiz=quiz,
            score=score,
            percentage=percentage,
            level=level,
            feedback=feedback
        )

        # RESPONSE
        return Response(
            {
                "score": score,
                "total": total,
                "percentage": percentage,
                "level": level,
                "feedback": feedback
            },
            status=status.HTTP_200_OK
        )