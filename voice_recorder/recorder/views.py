from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AudioData

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def upload_data(request):
    if request.method == 'POST':
        # name = request.POST.get('name')
        age = request.POST.get('age')
        location = request.POST.get('location')
        edu = request.POST.get('edu')
        audio_data = request.FILES.get('audioData')




        #newly added
        # audio_data = request.FILES.get('audioData')
        # size = request.POST.get('size')
        # file_type = request.POST.get('type')
        # last_modified = request.POST.get('lastModified')

        # Save data to the database
        audio_instance = AudioData(
            # name=name,
            age=age,
            location=location,
            edu=edu,
            audio=audio_data

            #newly added
            # audio = audio_data,
            # size=size,
            # type=file_type,
            # last_modified=last_modified
        )
        audio_instance.save()

        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'errors': 'Invalid request'})
