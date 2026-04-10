from import_export import resources
from .models import Question, Category


class QuestionResource(resources.ModelResource):

    class Meta:
        model = Question

    def before_import_row(self, row, **kwargs):
        category_name = row.get('category')

        if category_name:
            category_name = category_name.strip().lower()

            category, created = Category.objects.get_or_create(
                name=category_name
            )

            row['category'] = category.id