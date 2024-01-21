let mediaRecorder;
let audioChunks = [];

document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
document.getElementById('downloadButton').addEventListener('click', downloadAudio);
document.getElementById('userDataForm').addEventListener('submit', submitForm);

async function startRecording() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayer').src = audioUrl;

        const formData = new FormData(document.getElementById('userDataForm'));
        formData.append('audioData', audioBlob, 'audio.wav');

        document.getElementById('audioData').value = JSON.stringify({
            size: audioBlob.size,
            type: audioBlob.type,
            lastModified: audioBlob.lastModified,
        });

        audioChunks = [];
    };

    mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }

    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
}

function downloadAudio() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = 'audio.wav';

    // Append the link to the DOM (this step is crucial)
    document.body.appendChild(downloadLink);

    // Trigger the click event
    downloadLink.click();

    // Remove the link from the DOM
    document.body.removeChild(downloadLink);
}


function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('userDataForm'));

    fetch('/upload-data/', {
        method: 'POST',
        body: prepareFormData(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Data submitted successfully!');
        } else {
            console.error('Failed to submit data:', data.errors);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function prepareFormData(formData) {
    const newFormData = new FormData();

    // Iterate over the original form data
    for (const pair of formData.entries()) {
        // If it's the audio data, append it with the correct field name
        if (pair[0] === 'audioData') {
            newFormData.append('audio', pair[1], 'audio.wav');
        } else {
            // For other form fields, append them as they are
            newFormData.append(pair[0], pair[1]);
        }
    }

    return newFormData;
}
