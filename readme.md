### 说明

本项目为一个demo，实现了一个最基本的微博。支持注册，登入，登出，发送文字或者带图片的微博内容。微博内容的展示基本功能。

项目采用了Python3.5, django 2.0, pymysql, mysql 5.7, Jquery 3.2.1, vuejs 2.5。

首次运行时，需要在Mysql 5.7中创建tweet数据库和tweet用户，并进行授权。

然后切换到项目根目录，运行python manage.py makemigrations。运行无误后，运行python manage.py migrate完成数据库的迁移。

如果没有错误，最后运行python manage.py runserver, django会默认监听8000端口，在浏览器中输入127.0.0.1:8000即可进入登入页面。

演示效果：
![演示效果](https://github.com/leo0309/django-demo/blob/master/newdemo.gif)
