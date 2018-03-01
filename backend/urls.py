from django.urls import path, re_path
from .user.views import login, register, logout
from .blog.views import tweetView
urlpatterns = [
    path('login/',login,name='login'),
    path('register/',register,name='register'),
    path('logout/',logout, name='logout'),
    path('tweet/post/',tweetView.as_view(),name='tweetPost'),
    path('tweets/get/',tweetView.as_view(),name='tweetsGet')
]