from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.contrib.auth import authenticate
import random
import string
from datetime import timedelta
from .models import *