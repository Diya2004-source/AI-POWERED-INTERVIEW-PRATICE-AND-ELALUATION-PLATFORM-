import csv
from django.core.management.base import BaseCommand
from questions.models import Question, Category


class Command(BaseCommand):
    help = "Import questions from CSV file"

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']

        created = 0

        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)

            print("CSV HEADERS:", reader.fieldnames)

            for row in reader:
                print("ROW:", row)   # 🔥 DEBUG OUTPUT

                try:
                    category = Category.objects.get(id=int(row['category']))

                    Question.objects.create(
                        text=row['text'],
                        category=category,
                        difficulty=row['difficulty'],
                        option1=row['option1'],
                        option2=row['option2'],
                        option3=row['option3'],
                        option4=row['option4'],
                        correct_answer=row['correct_answer']
                    )

                    created += 1

                except Exception as e:
                    print("FAILED ROW:", row)
                    print("ERROR:", str(e))

        print(f"\nTOTAL IMPORTED: {created}")