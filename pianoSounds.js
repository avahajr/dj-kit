var audioCtx;
var dynCompr;
const activeOscs = {};
const activeGains = {};
var recording = false; // to implement later
const asdrTimes = {
  attack: 0.1,
  release: 0.2,
};
// numKeysPressed = 0;

document.addEventListener("DOMContentLoaded", function (event) {
  const keyMap = {
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
    186: 783.991, // ";" g5
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
    186: "g5", // ";" g5
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

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    dynCompr = audioCtx.createDynamicsCompressor();
    dynCompr.release.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
    dynCompr.attack.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
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
    newGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    activeGains[key] = newGain;

    newOsc.start();
    newOsc.connect(newGain).connect(dynCompr).connect(audioCtx.destination);
  }

  function keyDown(e) {
    // console.log("keyDown");
    const key = (e.detail || e.which).toString();
    console.log(key);
    if (keyMap[key] && !activeOscs[key]) {
      playNote(key);
      document.getElementById(keysToNotes[key]).style.fill = "#8180ff";
    }
    // numKeysPressed += 1;
    // console.log(audioCtx);
  }

  function keyUp(e) {
    const key = (e.detail || e.which).toString();
    if (keyMap[key] && activeOscs[key]) {
      setTimeout(
        activeGains[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.015),
        1
      );
      delete activeOscs[key];
      delete activeGains[key];

      keyFill = document.getElementById(keysToNotes[key]);
      // console.log(keyFill.classNawme);
      keyFill.style.fill =
        keyFill.className.baseVal === "white-key" ? "#ffffff" : "#000000";
    }
    // numKeysPressed -= 1;
  }
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
});
