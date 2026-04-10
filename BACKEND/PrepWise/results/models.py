from django.db import models
from quiz.models import Quiz

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    percentage = models.FloatField()
    level = models.CharField(max_length=50)
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for Quiz {self.quiz.id}"
    
