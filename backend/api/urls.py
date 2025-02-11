from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('check-token/', check_token, name='check_token'),
]
