from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
# Create your models here.
#create user model
class User(AbstractUser):
    """
    Users within the Django authentication system are represented by this
    model.

    Username, password and email are required. Other fields are optional.
    """
    #replace the email attribute of the base Abstractuser
    email = models.EmailField(_('email address'), unique=True, blank=False)

    def __str__(self):
        return self.username
    
