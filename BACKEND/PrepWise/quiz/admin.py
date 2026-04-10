from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Question, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin):
    list_display = ('id', 'text', 'category', 'difficulty')
    search_fields = ('text',)
    list_filter = ('difficulty', 'category')