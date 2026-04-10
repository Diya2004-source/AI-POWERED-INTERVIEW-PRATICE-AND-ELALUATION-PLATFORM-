from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Quiz, QuizQuestion, UserAnswer


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'quiz', 'question')


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'quiz', 'question', 'selected_answer', 'is_correct')
    list_filter = ('is_correct',)