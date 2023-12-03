document.addEventListener("DOMContentLoaded", function (event) {
  var audioCtx: AudioContext;
  var dynCompr: DynamicsCompressorNode;
  const activeOscs = {};
  const activeGains = {};
  var recording = false;
  const asdrTimes = {
    attack: 0.1,
    release: 0.1,
  };

  const keyMap = {
    9: 261.625565300598634, // "TAB" c4
    capslock: 293.66476791740756, // "CAPSLOCK" d4
    65: 293.66476791740756, // "A" e4
    83: 329.627556912869929, // "S" f4
    68: 391.995435981749294, // "D" g4
    70: 440.0, // "F" a4
    71: 493.883301256124111, // "G" b4
    72: 523.251, // "H" c5
    74: 587.33, // "J" d5
    75: 659.255, // "K" e5
    76: 698.456, // "L" f5
    59: 783.991, // ";" g5
    39: 880.0, // "'" a5
    10: 987.767, // return ("\n") b5
    92: 1046.5, // "\" c5
  };

  function initAudio(): void {
    audioCtx = new window.AudioContext();
    dynCompr = audioCtx.createDynamicsCompressor();
    dynCompr.release.setValueAtTime(asdrTimes["release"], audioCtx.currentTime);
    dynCompr.attack.setValueAtTime(asdrTimes["attack"], audioCtx.currentTime);
  }

  function playNote(key: string): void {
    if (!audioCtx) {
      initAudio();
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

  function keyDown(e: KeyboardEvent): void {
    const key = e.detail.toString();
    if (keyMap[key] && !activeOscs[key]) {
      document.getElementById;
      playNote(key);
    }
  }

  function keyUp(e: KeyboardEvent): void {
    const key = e.detail.toString();
    if (keyMap[key] && activeOscs[key]) {
      activeOscs[key].stop();
    }
  }

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
});
