var audioCtx;
var dynCompr;
const activeOscs = {};
const activeGains = {};
var recording = false; // to implement later
const asdrTimes = {
  attack: 0.1,
  release: 0.1,
};

document.addEventListener("DOMContentLoaded", function (event) {
  const keyMap = {
    9: 261.625565300598634, // "TAB" c4
    20: 293.66476791740756, // "CAPSLOCK" d4
    65: 293.66476791740756, // "A" e4
    83: 329.627556912869929, // "S" f4
    68: 391.995435981749294, // "D" g4
    70: 440.0, // "F" a4
    71: 493.883301256124111, // "G" b4
    72: 523.251, // "H" c5
    74: 587.33, // "J" d5
    75: 659.255, // "K" e5
    76: 698.456, // "L" f5
    186: 783.991, // ";" g5
    222: 880.0, // "'" a5
    13: 987.767, // return ("\n") b5
    220: 1046.5, // "\" c5
  };

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    dynCompr = audioCtx.createDynamicsCompressor();
    dynCompr.release.setValueAtTime(asdrTimes["release"], audioCtx.currentTime);
    dynCompr.attack.setValueAtTime(asdrTimes["attack"], audioCtx.currentTime);
  }

  function playNote(key) {
    if (!audioCtx) {
      initAudio();
      console.log("init audio");
    }
    const newOsc = audioCtx.createOscillator();
    newOsc.frequency.setValueAtTime(keyMap[key], audioCtx.currentTime);
    activeOscs[key] = newOsc;

    const newGain = audioCtx.createGain();
    newGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    activeGains[key] = newGain;

    newOsc.start();
    newOsc.connect(newGain).connect(dynCompr).connect(audioCtx.destination);
  }

  function keyDown(e) {
    console.log("keyDown");
    const key = (e.detail || e.which).toString();
    console.log(key);
    if (keyMap[key] && !activeOscs[key]) {
      playNote(key);
    }
    console.log(audioCtx);
  }

  function keyUp(e) {
    const key = (e.detail || e.which).toString();
    if (keyMap[key] && activeOscs[key]) {
      activeOscs[key].stop();
    }
  }
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
});
