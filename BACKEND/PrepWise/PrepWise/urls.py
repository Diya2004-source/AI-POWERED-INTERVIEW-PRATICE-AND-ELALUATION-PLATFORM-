from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/accounts/', include('accounts.urls')),
    path('api/questions/', include('questions.urls')),
    path('api/quiz/', include('quiz.urls')),        
    path('api/results/', include('results.urls')),  

    path('api/token/refresh/', TokenRefreshView.as_view()),  # JWT
]