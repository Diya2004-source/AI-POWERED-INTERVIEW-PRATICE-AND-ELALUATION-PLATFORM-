from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Question, Category
from .resources import QuestionResource


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin):
    resource_class = QuestionResource

    list_display = ('id', 'text', 'category', 'difficulty')
    search_fields = ('text',)
    list_filter = ('difficulty', 'category')