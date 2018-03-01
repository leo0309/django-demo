from django.db import models
from backend.user.models import User
import uuid
# Create your models here.
class blog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField('blog_content',null=False)
    create_date = models.DateTimeField(auto_now=True)
    img = models.FileField(upload_to='img')
    creator = models.ForeignKey(User,on_delete=models.CASCADE,related_name='creator_blog')

    def __str__(self):
        msg = self.content if len(self.content)<10 else str(self.content)[0:11]+'...'
        return '{msg} created by {creator} at {create_date} '.format(
            msg=msg,creator=self.creator,create_date=self.create_date
        )

class comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment_content = models.TextField('comment_content',null=False)
    create_date = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User,on_delete=models.CASCADE, related_name='creator_comment')
    comment_ref = models.ForeignKey(blog,on_delete=models.CASCADE)
    comment_reply = models.ForeignKey('self',on_delete=models.CASCADE)
    def __str__(self):
        msg = self.comment_content if len(self.comment_content)<10 else str(self.comment_content)[0:11]+'...'
        return '{msg} created by {creator} at {create_date} '.format(
            msg=msg,creator=self.creator,create_date=self.create_date
        )