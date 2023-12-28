import { loadSample, loadSampleFromInput } from "./sampleLoader.js";

document.addEventListener("DOMContentLoaded", function (event) {
  const audioCtx = window.audioCtx; // use the global audio context
  var recCompr = window.globalCompr;

  var recording = false;
  var keyStarts = {}; // int (keycode) to int (time)
  var notesInRecording = [];
  const keysToOscs = {};
  const keysToGains = {};
  var loopIntervalId;

  // DEBUG
  // var notesInRecording = [
  //   { instrument: "osc", keyVal: "83", start: 0, end: 1 },
  //   { instrument: "osc", keyVal: "83", start: 4, end: 5 },
  //   // { instrument: "osc", keyVal: "68", start: 1, end: 1.5 },
  //   // { instrument: "osc", keyVal: "68", start: 2, end: 2.5 },
  // ];

  const keyValToFreq = window.keyValToFreq;
  const keyValToMidi = window.keyValToMidi;

  const modeSelector = document.getElementById("mode");
  var activeInstrument = modeSelector.value;
  document.getElementById("rec-btn").addEventListener("click", toggleRec);
  document.addEventListener("keydown", recordKeyStroke);
  document.addEventListener("keyup", endKeyStroke);
  document
    .getElementById("play-rec")
    .addEventListener("click", playPauseRecording);

  function toggleRec() {
    if (!recording) {
      // wipe the recording state clean before starting again
      notesInRecording = [];
      document.getElementById("rec-cir").classList.add("rec-active");
    } else {
      // if the recording was already on, then we have a recording state
      notesInRecording.push({
        instrument: activeInstrument,
        keyVal: null,
        end: audioCtx.currentTime,
      });
      console.log(notesInRecording);
      document.getElementById("rec-cir").classList.remove("rec-active");
    }
    recording = !recording;
    console.log("toggle rec:", recording);
  }

  function recordKeyStroke(e) {
    activeInstrument = modeSelector.value;
    // fires repeatedly as long as you hold the key
    const key = (e.detail || e.which).toString();
    if (recording && keyValToFreq[key] && !keyStarts[key]) {
      keyStarts[key] = audioCtx.currentTime;
    }
  }

  function endKeyStroke(e) {
    // console.log("note ending");
    // only fires once per key up, if a key has already been pressed down
    const key = (e.detail || e.which).toString();
    if (keyStarts[key] && keyValToFreq[key] && recording) {
      // console.log("start", keyStarts[key], "end", audioCtx.currentTime);
      notesInRecording.push({
        instrument: activeInstrument,
        keyVal: key,
        start: keyStarts[key],
        end: audioCtx.currentTime,
      });
      // remove key from keyStarts, we have wrapped up this keypress
      keyStarts[key] = null;
    }
  }
  function playPauseRecording() {
    // loops the recording, or if there's already a loop, stop it.
    if (loopIntervalId) {
      console.log("ending recording.");
      clearInterval(loopIntervalId);
      loopIntervalId = null;
    } else if (!recording && notesInRecording) {
      notesInRecording.sort((a, b) => a.start - b.start); // sort by the start time (first played notes are first played)
      console.log("playing recording:", notesInRecording);
      loopRecording();
    }
  }

  async function playNote(key, startTime, duration, volume, instrument) {
    // plays a note for a recording.
    var sample;

    // load the sample if necessary
    if (instrument === "piano" || instrument === "harpsichord") {
      sample = await loadSample("keyboard_settings/" + instrument + "_c4.wav");
    } else if (instrument === "custom") {
      const input = document.getElementById("sample-audio");
      if (input.files.length > 0) {
        const sampleFile = input.files[0];
        console.log(sampleFile.name);
      }
      sample = await loadSampleFromInput(sampleFile);
    }

    switch (instrument) {
      case "osc":
        if (!(keysToOscs[key] instanceof OscillatorNode) || !keysToOscs[key]) {
          keysToOscs[key] = audioCtx.createOscillator();
          keysToOscs[key].frequency.value = keyValToFreq[key]; // Set frequency
          keysToOscs[key].start();
        }
        break;
      case "piano":
        keysToOscs[key] = audioCtx.createBufferSource();
        keysToOscs[key].buffer = sample;
        keysToOscs[key].playbackRate.value =
          2 ** ((keyValToMidi[key] - 60) / 12);
        keysToOscs[key].start(startTime);

        break;
      case "harpsichord":
        // if (!(keysToOscs[key] instanceof AudioBufferSourceNode)) {
        const harpsichordSample = await loadSample(
          "keyboard_settings/" + instrument + "_c4.wav"
        );
        const harpsichordSource = audioCtx.createBufferSource();
        harpsichordSource.buffer = harpsichordSample;
        harpsichordSource.playbackRate.value =
          2 ** ((keyValToMidi[key] - 60) / 12);
        keysToOscs[key] = harpsichordSource;
        harpsichordSource.start(startTime);
        // }
        break;
      default:
        console.error("invalid instrument");
        break;
    }

    if (!keysToGains[key]) {
      const newGain = audioCtx.createGain();
      newGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      keysToGains[key] = newGain;
    }

    keysToOscs[key].connect(keysToGains[key]);

    // Connect the gain node to the audio context's destination
    keysToGains[key].connect(recCompr).connect(audioCtx.destination);

    // Start and stop the oscillator at the specified times
    // now, schedule
    // console.log("playing freq", keysToOscs[key].frequency.value);

    keysToGains[key].gain.setTargetAtTime(volume, startTime, 0.01); // Set volume

    keysToGains[key].gain.setTargetAtTime(0, startTime + duration, 0.01);
  }

  function loopRecording() {
    const endTime = notesInRecording[notesInRecording.length - 1].end;

    console.log(endTime);

    const recordingDuration = endTime - notesInRecording[0].start;

    loopIntervalId = setInterval(function () {
      for (const noteInfo of notesInRecording) {
        // console.log("playiang note", noteInfo);
        if (noteInfo.keyVal) {
          const key = noteInfo.keyVal;
          playNote(
            key,
            audioCtx.currentTime + noteInfo.start - notesInRecording[0].start,
            noteInfo.end - noteInfo.start,
            0.1,
            noteInfo.instrument
          );
        }
      }
    }, recordingDuration * 1000);
  }
});
