import re
from django.shortcuts import render, redirect
from django.http import JsonResponse,HttpResponse, HttpResponseRedirect
from .models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import Error
from django.views.decorators.http import require_POST, require_GET
from django.contrib import auth
from django.urls import reverse
# Create your views here.
@require_POST
def login(request):
    if isinstance(request.user,auth.models.AnonymousUser):
        usernameOrEmail = request.POST.get('user')
        try:
            if '@' in usernameOrEmail:
                user = User.objects.get(email=usernameOrEmail)
            else:
                user = User.objects.get(username=usernameOrEmail)
        except ObjectDoesNotExist:
            user = None
        
        userPassword = request.POST.get('password')
        #if user is not None and user.check_password(userPassword):
        auth_user = auth.authenticate(username=user.username,password=userPassword)
        if auth_user:
            #automatically add sessionID to represent user
            auth.login(request,auth_user)
            return HttpResponse(1)
        else:
            return HttpResponse(-1)
    else:
        return HttpResponse(1)
#authenticate password
def password_validate(password1, password2):
    if password1 != password2:
        return False
    password_re = re.compile(r'[a-zA-Z\d+]{6,}')
    return True if password_re.match(password1) else False

#authentiate username
def username_validate(username):
    try:
        User.objects.get(username=username)
        return False
    except ObjectDoesNotExist:
        return True

@require_POST
def register(request):
    if isinstance(request.user,auth.models.AnonymousUser):
        userName = request.POST.get('username')
        if not (userName and username_validate(userName)):
            return HttpResponse(-1)
        if len(request.POST) == 1:
            return HttpResponse(1)
        password = request.POST.get('password')
        if not password_validate(password,
            request.POST.get('password2')):
            return HttpResponse(-1)
        mail = request.POST.get('email')
        try:
            User.objects.create_user(username=userName,
            email=mail,password=password)
        except Error as e:
            print(e)
            return HttpResponse(-1)
        return HttpResponse(1)
    else:
        return HttpResponse(-1)

#logout
@require_GET
def logout(request):
    if not isinstance(request.user,auth.models.AnonymousUser):
        auth.logout(request)
    return redirect(reverse('index'))