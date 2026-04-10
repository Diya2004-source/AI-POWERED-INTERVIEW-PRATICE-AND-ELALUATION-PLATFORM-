from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def save(self, *args, **kwargs):
        self.name = self.name.strip().lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy','Easy'),
        ('medium','Medium'),
        ('hard','Hard'),
    ]
    text = models.TextField()
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=10,choices=DIFFICULTY_CHOICES)

    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]
    
    