from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # AbstractUser already has 'password' and 'username' fields.
    # We can add 'name' or just use the built-in 'first_name'/'last_name'.
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    # Use email for login instead of username (optional but common)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']