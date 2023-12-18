# Crafting a WebAudio DJ Kit - A Journey into Computational Sound

The integration of audio capabilities has opened up exciting possibilities for creating immersive and interactive user experiences. Our mission was to develop a user-friendly, feature-rich "DJ kit" in WebAudio, blending a polished frontend with multiple backend functionalities. This blog post will delve into the design choices, implementation details, and the road traveled so far in our computational sound project.

All the functionalities were implemented using WebAudio, leveraging its powerful features to generate and manipulate audio in real-time. From simulating instruments to recording and playback, the WebAudio proved to be a versatile tool for our project.

The frontend was carefully thought through to prioritize user experience. The piano and drum simulator, with dynamic lighting, not only mimics real-world instruments but also enhances the interactive aspect of the DJ kit. We tried to make the user experience as fun and intuitive as possible!

## Project Vision and Objectives
Our vision was to empower users to craft multipart compositions effortlessly, enabling them to switch between instrument modes such as piano, harp, uploading samples, drum kits, and more. The primary goal was to facilitate the creation, modification, and layering of musical parts similar to professional tools like GarageBand. Recognizing the potential complexity of audio tools, we made a conscious decision to prioritize usability without compromising on features.

## Proposed Features
The initial feature set outlined our ambition to create a comprehensive DJ kit. Some of the proposed features included:

- Instrument Modes: Switching between keystroke-driven instrument modes, with presets simulating real instruments through filtering or synthesis, a drum kit, and potentially a piano.

- Customizable Oscillators: Allowing users to modify the oscillation of recorded parts through synthesis, filtering, and other parameters.

- Recording and Playback: Enabling users to record and repeat parts seamlessly, providing a foundational element for creating complex compositions.

- Microphone Input: Integrating voice recording and the ability to overlay recorded voice over compositions.

- Fine-grained Control: Individually controlling audio parameters for each part, including filters, playback speed, pitch, gain, and ADSR (Attack, Decay, Sustain, Release) settings.

## Progress So Far
1. Piano Keyboard and Drum Simulator
Our journey began with the implementation of a piano keyboard and drum simulator. The keyboard lights up dynamically as users press corresponding keys, providing a visual and auditory feedback loop.

2. Voice and Audio Recording
We successfully implemented voice recording, allowing users to capture their voice, listen to the recording, and even download it for further use as a .wav file. Additionally, audio recording capabilities were integrated, enabling users to play the piano and drum and record their compositions.

## The Drum Kit Component
### Event-driven Drumming
Our drum kit component is built on the backbone of event-driven programming. We utilize JavaScript event listeners to capture both keydown and keyup events, translating them into drum beats. The playSound function fires on keydown, triggering the playback of the associated audio clip. Conversely, the stopSound function activates on keyup, halting the sound when a key is released.

```
document.addEventListener('keydown', playSound);
document.addEventListener('keyup', stopSound);
```

### Drum Pad Interaction
Each drum pad on our virtual drum kit responds visually to user interaction. When a key is pressed, the corresponding drum pad becomes "active," providing visual feedback to the user. This is achieved by adding and removing the "active" class using JavaScript.

```
if (drumPad) {
    drumPad.classList.add("active");
}
// ...
if (drumPad){
    drumPad.classList.remove("active");
}
```

### Smooth Audio Playback Control
To ensure seamless audio playback, we employ the end event listener on each audio element. When a drum sound finishes playing, this event triggers, allowing us to reset the playback time and stop the audio if the key is not being held.

```
audioElement.addEventListener('ended', () => {
    // ...
});
```

### The Drum Kit in Action
Our drum component boasts a set of virtual drum pads, each associated with a unique key on the keyboard. Users can trigger drum sounds by pressing the corresponding keys, and the visual feedback adds an immersive touch to the experience.

```
<div class="drum-pad drum" id="hi-hat" data-key="Q">
    <!-- ... -->
    <audio class="clip" id="Q" src="https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"></audio>
</div>
```

## The Piano Component

### Initialization and Configuration
The piano component kicks off with the initialization of essential variables, including the piano compressor, audio context, and parameters defining the attack, decay, sustain, and release (ADSR) times. These foundational elements set the stage for crafting a dynamic and responsive piano experience.

```
const pianoCompr = window.globalCompr;
const audioCtx = window.audioCtx;
const activeOscs = {};
const activeGains = {};
const asdrTimes = {
    attack: 0.1,
    release: 0.2,
};
```

### User Interaction and Mode Selection
The code responds to user interactions, such as pressing keys on the piano keyboard. It detects the active state of the piano component, the selected mode (oscillator, piano, harpsichord, or custom), and updates the visibility of the sample upload feature accordingly. 

Implementing so many shapes with a normal-looking alignment seemed really complicated with only CSS shapes/style tags seemed daunting, and we knew there was a better way. Although we have never used Figma, we decided to learn for this project for the sake of the piano.  The piano itself is an SVG, each path (key) with a distinct ID, that is programmatically filled on keyUps/keyDowns. The CSS involved with getting the piano to respond to key presses was unexpectedly complicated and ate up a lot of time, but we are happy with the result!

```
pianoIsActive = document.getElementById("piano-tab").classList.contains("active");
var modeSelector = document.getElementById("mode");
var mode = modeSelector.value;
modeSelector.addEventListener("change", showSampleUpload);
```

### Audio Initialization and Oscillator Sounds
The initAudio function initializes the audio context and dynamics compressor, ensuring that the piano sounds are crisp and well-controlled. The playNote function dynamically generates piano sounds based on user input, with options for oscillators, sample-based piano, harpsichord, and custom audio sampling.

```
function initAudio() {
    pianoCompr = audioCtx.createDynamicsCompressor();
    pianoCompr.release.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
    pianoCompr.attack.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
}
```

### Loading and Playing Samples
The piano component incorporates versatility through sample-based playback. Whether simulating a piano, harpsichord, or allowing users to upload custom audio samples, the code seamlessly handles loading and playing diverse sounds. The playSample function takes care of adjusting playback rates based on MIDI note differences, allowing for pitch variation. 

```
function loadSample(url) {
    return fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => audioCtx.decodeAudioData(buffer));
}

function loadSampleFromInput(file) {
    return file.arrayBuffer().then((buffer) => audioCtx.decodeAudioData(buffer));
}
```

## The Voice Recording Component

### Initialization and Event Handling
The code commences by initializing essential variables, such as the state of voice recording, an array to store voice audio chunks, and a MediaRecorder object for handling audio data. Event listeners are set up to toggle voice recording, play the recorded voice, and initiate the download process.

### Toggling Voice Recording
The toggleVoiceRec function handles the toggle mechanism for voice recording. It starts or stops the recording based on the current state, updating the visual indicator accordingly.

```
function toggleVoiceRec() {
  if (!voiceRecording) {
    startVoiceRecording();
    document.getElementById("microphone").classList.add("rec-voice-active");
  } else {
    stopVoiceRecording();
    document
      .getElementById("microphone")
      .classList.remove("rec-voice-active");
  }
  voiceRecording = !voiceRecording;
  console.log("toggle rec:", voiceRecording);
}
```

### Starting Voice Recording
When the user initiates voice recording, the startVoiceRecording function requests access to the microphone, sets up a MediaRecorder, and defines the event handlers for data availability and recording stop.

```
navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      voiceMediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          voiceAudioChunks.push(event.data);
        }
      };
      voiceMediaRecorder.onstop = function () {
        const voiceAudioBlob = new Blob(voiceAudioChunks, {
          type: "audio/wav",
        });
        voiceAudioElement.src = URL.createObjectURL(voiceAudioBlob);
      };
      voiceMediaRecorder.start();
    })
```

### Stopping and Playing Voice Recording
The stopVoiceRecording function stops the MediaRecorder and displays a download link for the recorded voice. The playVoiceRecording function plays the recorded voice and provides visual feedback by adding a "play-active" class during playback.

### Downloading the Recording
The downloadRecording function generates a download link for the recorded voice, allowing users to save the audio recording.

```
function downloadRecording() {
  const downloadLink = document.createElement("a");
  downloadLink.href = voiceAudioElement.src;
  downloadLink.download = "audio_recording.wav";
  downloadLink.click();
}
```

## The Recording Component

### Initialization and Event Handling
The code begins by initializing essential variables, including the audio context and compressor, as well as the state of recording and the starting times of keystrokes. We had to make the AudioContext and DynamicsCompressor global variables tied to the window. Event listeners are set up to toggle recording, record keystrokes, and play back the recorded sequence.

### Toggling Recording
Similar to the voice recording, toggleRec function for recording instruments manages the toggle mechanism for recording. It initializes or finalizes the recording state and updates the visual indicator accordingly.

### Recording Keystrokes
The recordKeyStroke and endKeyStroke functions handle the recording of keystrokes, capturing the start and end times of played notes. Then, the playRecording function orchestrates the playback of the recorded musical sequence. It sorts the recorded notes by start time and iterates through them, playing the corresponding notes on the selected instrument. Right now the only instrument that recording is possible for is the oscillator, but with some reworking we could expand it.

```
function recordKeyStroke(e) {
  const key = (e.detail || e.which).toString();
  if (recording && keyValToFreq[key] && !keyStarts[key]) {
    keyStarts[key] = audioCtx.currentTime;
  }
}

function endKeyStroke(e) {
  const key = (e.detail || e.which).toString();
  if (keyStarts[key] && keyValToFreq[key] && recording) {
    notesInRecording.push({
      instrument: activeInstrument,
      keyVal: key,
      start: keyStarts[key],
      end: audioCtx.currentTime,
    });
    keyStarts[key] = null;
  }
}
```
