{/* <div class="component" id="drums">
<div class="drum-pad" id="kick">
  <p>Kick</p>
  <audio
    class="clip"
    id="Q"
    src="https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  ></audio>
</div>
<div class="drum-pad" id="snare">
  <p>Snare</p>
  <audio
    class="clip"
    id="W"
    src="https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
  ></audio>
</div>
<div class="drum-pad" id="hi-hat">
  <p>Hi-Hat</p>
  <audio
    class="clip"
    id="E"
    src="https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  ></audio>
</div>
<div class="drum-pad" id="tom-1">
  <p>Tom 1</p>
  <audio
    class="clip"
    id="A"
    src="https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  ></audio>
</div>
<div class="drum-pad" id="tom-2">
  <p>Tom 2</p>
  <audio
    class="clip"
    id="S"
    src="https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  ></audio>
</div>
<div class="drum-pad" id="tom-3">
  <p>Tom 3</p>
  <audio
    class="clip"
    id="D"
    src="https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  ></audio>
</div>
<div class="drum-pad" id="tom-4">
  <p>Tom 4</p>
  <audio
    class="clip"
    id="Z"
    src="https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  ></audio>
</div>
<div class="drum-pad" id="clap">
  <p>Clap</p>
  <audio
    class="clip"
    id="X"
    src="https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  ></audio>
</div>
</div> */}

document.addEventListener("keydown", function (event) {
    const key = event.key.toUpperCase();
    const drumPad = document.getElementById(key);
    if (drumPad) {
        drumPad.classList.add("active");
    }
});

document.addEventListener("keyup", function (event) {
    const key = event.key.toUpperCase();
    const drumPad = document.getElementById(key);
    if (drumPad) {
      drumPad.classList.remove("active");
    }
});

const drumContainer = document.createElement('div');
drumContainer.className = 'component';
drumContainer.id = 'drums';

const drumPad1 = createDrumPad('kick', 'Kick', 'Q', 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3');
const drumPad2 = createDrumPad('snare', 'Snare', 'W', 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3');
const drumPad3 = createDrumPad('hi-hat', 'Hi-Hat', 'E', 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3');
const drumPad4 = createDrumPad('tom-1', 'Tom 1', 'A', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3');
const drumPad5 = createDrumPad('tom-2', 'Tom 2', 'S', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3');
const drumPad6 = createDrumPad('tom-3', 'Tom 3', 'D', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3');
const drumPad7 = createDrumPad('tom-4', 'Tom 4', 'Z', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3');
const drumPad8 = createDrumPad('clap', 'Clap', 'X', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3');

drumContainer.appendChild(drumPad1);
drumContainer.appendChild(drumPad2);
drumContainer.appendChild(drumPad3);
drumContainer.appendChild(drumPad4);
drumContainer.appendChild(drumPad5);
drumContainer.appendChild(drumPad6);
drumContainer.appendChild(drumPad7);
drumContainer.appendChild(drumPad8);

function createDrumPad(id, label, key, src) {
    const drumPad = document.createElement('div');
    drumPad.className = 'drum-pad';
    drumPad.id = id;

    const labelElement = document.createElement('p');
    labelElement.textContent = label;
    drumPad.appendChild(labelElement);

    const audioElement = document.createElement('audio');
    audioElement.className = 'clip';
    audioElement.id = key;
    audioElement.src = src;
    drumPad.appendChild(audioElement);

    return drumPad;
}

// Append the drum container to the document body or any other desired element
document.body.appendChild(drumContainer);
