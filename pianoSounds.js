var audioCtx;
var dynCompr;
const activeOscs = {};
const activeGains = {};
var recording = false; // to implement later
const asdrTimes = {
  attack: 0.1,
  release: 0.2,
};
var mode = "piano"; // lets us change the instrument. Options: Osc, piano, harpischord, custom
var sample; // variable for the custom sample

document.addEventListener("DOMContentLoaded", function (event) {
  const keyValToFreq = {
    16: 261.625565300598634, // "LSHIFT" c4
    20: 293.66476791740756, // "CAPSLOCK" d4`
    65: 329.627556912869929, // "A" e4
    83: 349.23, // "S" f4
    68: 391.995435981749294, // "D" g4
    70: 440.0, // "F" a4
    71: 493.883301256124111, // "G" b4
    72: 523.251, // "H" c5
    74: 587.33, // "J" d5
    75: 659.255, // "K" e5
    76: 698.456, // "L" f5
    59: 783.991, // ";" g5
    222: 880.0, // "'" a5
    13: 987.767, // return b5
    220: 1046.5, // "\" c5
    // black keys
    81: 277.18, // q
    87: 311.13, // w
    69: 369.99, // e
    82: 415.3, // r
    84: 466.16, // t
    85: 554.37, // y
    73: 622.25, // ju
    79: 739.99, // i
    80: 830.61, // o
    219: 932.33, // [
  };

  const keysToNotes = {
    16: "c4", // c4
    20: "d4", // "CAPSLOCK" d4
    65: "e4", // "A" e4
    83: "f4", // "S" f4
    68: "g4", // "D" g4
    70: "a4", // "F" a4
    71: "b4", // "G" b4
    72: "c5", // "H" c4
    74: "d5", // "J" d5
    75: "e5", // "K" e5
    76: "f5", // "L" f5
    59: "g5", // ";" g5
    222: "a5", // "'" a5
    13: "b5", // return b5
    220: "c6", // "\" c6
    // black keys:
    81: "c_sharp4", // q
    87: "d_sharp4", // w
    69: "f_sharp4", // e
    82: "g_sharp4", // r
    84: "a_sharp4", // t
    85: "c_sharp5", // u
    73: "d_sharp5", // i
    79: "f_sharp5", // o
    80: "g_sharp5", // p
    219: "a_sharp5", // [
  };

  const keyValToMidi = {
    16: 60, // "LSHIFT" c4
    20: 62, // "CAPSLOCK" d4`
    65: 64, // "A" e4
    83: 65, // "S" f4
    68: 67, // "D" g4
    70: 69, // "F" a4
    71: 71, // "G" b4
    72: 72, // "H" c5
    74: 74, // "J" d5
    75: 76, // "K" e5
    76: 77, // "L" f5
    59: 79, // ";" g5
    222: 81, // "'" a5
    13: 83, // return b5
    220: 84, // "\" c6
    // black keys
    81: 61, // q
    87: 63, // w
    69: 66, // e
    82: 68, // r
    84: 70, // t
    85: 73, // y
    73: 75, // u
    79: 78, // i
    80: 80, // o
    219: 82, // [
  };

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    dynCompr = audioCtx.createDynamicsCompressor();
    dynCompr.release.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
    dynCompr.attack.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
  }

  function playNote(key) {
    // sample = document.getElementById("audio-sample").value;

    if (!audioCtx) {
      initAudio();
      // console.log("init audio");
    }
    if (mode === "osc") {
      const newOsc = audioCtx.createOscillator();
      newOsc.frequency.setValueAtTime(keyValToFreq[key], audioCtx.currentTime);
      activeOscs[key] = newOsc;

      const newGain = audioCtx.createGain();
      newGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      activeGains[key] = newGain;

      newOsc.start();
      newOsc.connect(newGain).connect(dynCompr).connect(audioCtx.destination);
    } else {
      // we are in sample mode
      if (mode !== "custom") {
        // console.log(mode);
        // piano, harpsichord
        loadSample("keyboard_settings/" + mode + "_c4.wav").then((sample) =>
          playSample(sample, 60, keyValToMidi[key], key)
        );
      } else {
        // custom audio sampling
        sample = document.getElementById("audio-sample").value;
      }
    }
  }
  function loadSample(url) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioCtx.decodeAudioData(buffer));
  }

  function playSample(sample, sampleMidiNote, midiNoteToPlay, key) {
    const source = audioCtx.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = 2 ** ((midiNoteToPlay - sampleMidiNote) / 12);
    const newGain = audioCtx.createGain();
    newGain.gain.value = 0.1;
    source.connect(newGain).connect(dynCompr).connect(audioCtx.destination);
    source.start(0);
    activeGains[key] = newGain;
    activeOscs[key] = source;
  }

  function keyDown(e) {
    // console.log("keyDown");
    const key = (e.detail || e.which).toString();
    console.log(key);
    if (keyValToFreq[key] && !activeOscs[key]) {
      playNote(key);
      document.getElementById(keysToNotes[key]).style.fill = "#8180ff";
    }
    // numKeysPressed += 1;
    // console.log(audioCtx);
  }

  function keyUp(e) {
    const key = (e.detail || e.which).toString();
    if (keyValToFreq[key] && activeOscs[key]) {
      activeGains[key].gain.setTargetAtTime(
        0,
        audioCtx.currentTime,
        mode === "piano" || mode === "harpsichord" ? 0.15 : 0.015
      );
      setTimeout(function () {
        delete activeOscs[key];
        delete activeGains[key];
      }, 1);

      keyFill = document.getElementById(keysToNotes[key]);
      keyFill.style.fill =
        keyFill.className.baseVal === "white-key" ? "#ffffff" : "#000000";
    }
  }
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
});
