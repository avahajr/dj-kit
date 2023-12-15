
var voiceAudioElement;

document.addEventListener("DOMContentLoaded", function () {
    let voiceRecording = false;
    let voiceAudioChunks = [];
    let voiceMediaRecorder;
    voiceAudioElement = new Audio();

    document.getElementById("voice-rec-btn").addEventListener("click", toggleVoiceRec);
    // document.getElementById("voice-rec-btn").addEventListener("click", startVoiceRecording);
    document.getElementById("voice-play-btn").addEventListener("click", playVoiceRecording);

    function toggleVoiceRec() {
        if (!voiceRecording) {
            startVoiceRecording();
            document.getElementById("microphone").classList.add("rec-voice-active");
        } else {
            stopVoiceRecording();
            document.getElementById("microphone").classList.remove("rec-voice-active");
        }
        voiceRecording = !voiceRecording;
        console.log("toggle rec:", voiceRecording);
    }

    function startVoiceRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                voiceMediaRecorder = new MediaRecorder(stream);
                voiceMediaRecorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        voiceAudioChunks.push(event.data);
                    }
                };
                voiceMediaRecorder.onstop = function () {
                    const voiceAudioBlob = new Blob(voiceAudioChunks, { type: 'audio/wav' });
                    voiceAudioElement.src = URL.createObjectURL(voiceAudioBlob);
                };
                voiceMediaRecorder.start();
                console.log("Started recording.");
            })
            .catch(function (err) {
                console.error('Error accessing microphone: ', err);
            });
    }

    function stopVoiceRecording() {
        if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
            voiceMediaRecorder.stop();
            console.log("Stopped recording.");
            document.getElementById("download-link").style.display = "inline";
        }
    }

    function playVoiceRecording() {
        if (voiceAudioElement.src) {
            voiceAudioElement.play();
            
            // Add "play-active" class to the element with id "play"
            document.getElementById("play").classList.add("play-active");
            
            // Listen for the "pause" and "ended" events to remove the "play-active" class
            voiceAudioElement.addEventListener("pause", function () {
                document.getElementById("play").classList.remove("play-active");
            });
    
            voiceAudioElement.addEventListener("ended", function () {
                document.getElementById("play").classList.remove("play-active");
            });
        } else {
            console.log("No voice recording available.");
        }
    }

    
});

function downloadRecording() {
    // Add your logic to generate and download the recording

    // Example: Create a Blob with dummy data for testing
    const dummyData = 'Dummy audio data'; // Replace with your actual audio data
    const blob = new Blob([dummyData], { type: 'audio/wav' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = voiceAudioElement.src;
    downloadLink.download = 'audio_recording.wav';

    // Trigger the click event to download
    downloadLink.click();
    console.log("Downloaded recording.");
}
