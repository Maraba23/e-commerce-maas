from imports import *

@api_view(['POST'])
def register(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'status': 'error', 'message': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'status': 'error', 'message': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    profile = Profile.objects.create(user=user, username=username, email=email)

    return Response({'status': 'success', 'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_view(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        profile = Profile.objects.get(user=user)
        token_str = ''.join(random.choices(string.ascii_letters + string.digits, k=128))

        token = AuthToken.objects.create(
            user=profile,
            token=token_str,
            duration=timedelta(days=1),
        )

        return Response({'status': 'success', 'token': token.token}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def check_token(request):
    token_str = request.data.get('token')

    if token_str is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = AuthToken.objects.get(token=token_str)
    except AuthToken.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    if token.date + token.duration < now():
        token.delete()
        return Response({'status': 'error', 'message': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)

    json_return = {
        "email": token.user.email,
        "username": token.user.username,
        "role": token.user.role,
    }

    return Response({'status': 'success', 'data': json_return}, status=status.HTTP_200_OK)
