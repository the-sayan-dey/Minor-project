from django.db import models

# Create your models here.


class AudioData(models.Model):
    # name = models.CharField(max_length=255)
    age = models.IntegerField()
    location = models.CharField(max_length=255)
    edu = models.CharField(max_length=255)
    audio = models.FileField(upload_to='audio_files/')


    # newly added
    # audio = models.FileField(upload_to='audio_files/')
    # size = models.IntegerField(default=0)
    # type = models.CharField(max_length=50, default=0)
    # last_modified = models.DateTimeField(auto_now=True)

