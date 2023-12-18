document.addEventListener("DOMContentLoaded", function (event) {
  const pianoCompr = window.globalCompr;
  const audioCtx = window.audioCtx;
  const activeOscs = {};
  const activeGains = {};

  var pianoIsActive;
  pianoIsActive = document
    .getElementById("piano-tab")
    .classList.contains("active");
  var isRecording = document
    .getElementById("rec-cir")
    .classList.contains("rec-active");
  // console.log("recording state:", isRecording);
  if (pianoIsActive) {
    var modeSelector = document.getElementById("mode");
    var mode = modeSelector.value; // lets us change the instrument. Options: Osc, piano, harpischord, custom
    modeSelector.addEventListener("change", showSampleUpload);
    const keyValToFreq = window.keyValToFreq;

    const keysToNotes = window.keysToNotes;

    const keyValToMidi = window.keyValToMidi;

    function showSampleUpload() {
      mode = modeSelector.value;
      console.log("changed to", mode);
      if (mode === "custom") {
        document.getElementById("sample-audio").style.visibility = "visible";
      } else {
        document.getElementById("sample-audio").style.visibility = "hidden";
      }
    }
    function initAudio() {
      pianoCompr = audioCtx.createDynamicsCompressor();
      pianoCompr.release.setValueAtTime(
        asdrTimes.release,
        audioCtx.currentTime
      );
      pianoCompr.attack.setValueAtTime(asdrTimes.release, audioCtx.currentTime);
    }

    function playNote(key) {
      // updating the piano activity is only necessary
      // every time we press a key
      pianoIsActive = document
        .getElementById("piano-tab")
        .classList.contains("active");
      isRecording = document
        .getElementById("rec-cir")
        .classList.contains("rec-active");
      if (pianoIsActive) {
        if (!pianoCompr) {
          initAudio();
        }
        // keyStarts[key] = audioCtx.currentTime;
        if (mode === "osc") {
          const newOsc = audioCtx.createOscillator();
          newOsc.frequency.setValueAtTime(
            keyValToFreq[key],
            audioCtx.currentTime
          );
          activeOscs[key] = newOsc;

          const newGain = audioCtx.createGain();
          newGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          activeGains[key] = newGain;

          newOsc.start();
          newOsc
            .connect(newGain)
            .connect(pianoCompr)
            .connect(audioCtx.destination);
          document.getElementById(keysToNotes[key]).style.fill = "#8180ff";
        } else {
          // we are in sample mode
          if (mode !== "custom") {
            // piano, harpsichord
            loadSample("keyboard_settings/" + mode + "_c4.wav").then((sample) =>
              playSample(sample, 60, keyValToMidi[key], key)
            );
            document.getElementById(keysToNotes[key]).style.fill = "#8180ff";
          } else {
            // custom audio sampling
            var input = document.getElementById("sample-audio");

            if (input.files.length > 0) {
              var sampleFile = input.files[0];
              console.log(sampleFile.name);

              loadSampleFromInput(sampleFile).then((sample) =>
                playSample(sample, 60, keyValToMidi[key], key)
              );
              document.getElementById(keysToNotes[key]).style.fill = "#8180ff";
            }
          }
        }
      }
    }
    function loadSample(url) {
      return fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => audioCtx.decodeAudioData(buffer));
    }
    function loadSampleFromInput(file) {
      return file
        .arrayBuffer()
        .then((buffer) => audioCtx.decodeAudioData(buffer));
    }

    function playSample(sample, sampleMidiNote, midiNoteToPlay, key) {
      const source = audioCtx.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = 2 ** ((midiNoteToPlay - sampleMidiNote) / 12);
      const newGain = audioCtx.createGain();
      newGain.gain.value = 0.1;
      source.connect(newGain).connect(pianoCompr).connect(audioCtx.destination);
      source.start(0);
      activeGains[key] = newGain;
      activeOscs[key] = source;
    }

    function freqToMidi(freq) {
      return (12 * Math.log(freq / 220.0)) / Math.log(2.0) + 57;
    }

    function keyDown(e) {
      // console.log("keyDown");
      const key = (e.detail || e.which).toString();
      // console.log(key);
      if (keyValToFreq[key] && !activeOscs[key]) {
        playNote(key);
      }
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
  }
});
