from django.shortcuts import render,render_to_response
from django.views.generic import View
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from backend.user.models import User
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AnonymousUser
from .models import blog
from django.db.utils import Error
from django.conf import settings
from django.db import transaction
from django.core import serializers 
import os
import time
# Create your views here.
class homeView(View):
    #进入个人或者别人的主页
    def get(self,request,ownername):
        user = request.user
        if isinstance(user,AnonymousUser):
            user = None
        try:
            owner = User.objects.get(username=ownername)
        except ObjectDoesNotExist:
            owner = None
        return render(request,'home.html',{
            'owner':owner,
            'user':user,
        })

class tweetView(View):
    #发表tweet
    def post(self,request):
        if not isinstance(request.user, AnonymousUser):
            tweetcontent = request.POST.get('tweetText')
            tweetImg = request.POST.get('tweetImg')            
            tweetFile = request.FILES.get('tweetfiles')
            try:
                if tweetImg is "":
                    tweetblog = blog(content=tweetcontent,creator=request.user)
                else:    
                    fname, fename = os.path.splitext(tweetImg)
                    print(fname,' ',fename)
                    fname = request.user.username + '_'+str(time.time())+str(fename)
                    file_path = os.path.join(settings.BASE_DIR,"media\\",fname)
                    with open(file_path,'wb') as f:
                        for chunk in tweetFile.chunks():
                            f.write(chunk)
                    tweetblog = blog(content=tweetcontent,creator=request.user,img = str(fname))
                tweetblog.save()
                tweetblog.refresh_from_db()
                tweetblog = serializers.serialize('json', [tweetblog])
                return JsonResponse(tweetblog[1:-1],safe=False)               
            except Error as e:
                print(e)
                transaction.rollback()
                return HttpResponse(-1)
        
    #获取blog
    def get(self,request):
        ownername = request.GET.get('ownername')
        limit = request.GET.get('limit')
        offset = request.GET.get('offset')
        try:
            owner = User.objects.get(username=ownername)
            blogs = blog.objects.filter(creator=owner).order_by('-create_date')[int(offset):int(limit)]
            if blogs:
                blogs = list(blogs)
                blogs = serializers.serialize('json',blogs)
                return JsonResponse(blogs,safe=False)
        except Error as e:
            print(e)
            return HttpResponse(-1)
        return HttpResponse(-1)


