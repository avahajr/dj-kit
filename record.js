document.addEventListener("DOMContentLoaded", function (event) {
  const audioCtx = window.audioCtx; // use the global audio context
  var recCompr = window.globalCompr;

  var activeInstrument = "osc";
  var recording = false;
  var keyStarts = {}; // int (keycode) to int (time)
  var notesInRecording = [];
  const keysToOscs = {};
  const keysToGains = {};
  var loopStartTime;
  var loopInterval;

  // DEBUG
  // var notesInRecording = [
  //   { instrument: "osc", keyVal: "83", start: 0, end: 1 },
  //   { instrument: "osc", keyVal: "83", start: 4, end: 5 },
  //   // { instrument: "osc", keyVal: "68", start: 1, end: 1.5 },
  //   // { instrument: "osc", keyVal: "68", start: 2, end: 2.5 },
  // ];

  const keyValToFreq = window.keyValToFreq;

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
      console.log(notesInRecording);
      // loopRecording();
      document.getElementById("rec-cir").classList.remove("rec-active");
    }
    recording = !recording;
    console.log("toggle rec:", recording);
  }

  function recordKeyStroke(e) {
    // console.log("keystroke");
    // fires repeatedly as long as you hold the key
    const key = (e.detail || e.which).toString();
    if (recording && keyValToFreq[key] && !keyStarts[key]) {
      keyStarts[key] = audioCtx.currentTime;
      // console.log(keyStarts);
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
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }
    const startTime = audioCtx.currentTime; // recording start time
    if (!recording && notesInRecording) {
      notesInRecording.sort((a, b) => a.start - b.start); // sort by the start time (first played notes are first played)
      console.log("playing recording:", notesInRecording);
      loopStartTime = startTime;
      loopRecording();
    }
  }
  function playNote(key, startTime, duration, volume) {
    // plays a note for a recording.
    if (!keysToOscs[key] || !keysToGains[key]) {
      keysToOscs[key] = audioCtx.createOscillator();
      keysToOscs[key].frequency.setValueAtTime(keyValToFreq[key], startTime); // Set frequency

      // Create a GainNode for this oscillator
      keysToGains[key] = audioCtx.createGain();

      // Connect the oscillator to its gain node
      keysToOscs[key].connect(keysToGains[key]);

      // Connect the gain node to the audio context's destination
      keysToGains[key].connect(recCompr).connect(audioCtx.destination);

      // Start and stop the oscillator at the specified times
      keysToOscs[key].start(startTime);
    }
    // now, schedule
    keysToGains[key].gain.setTargetAtTime(volume, startTime, 0.01); // Set volume

    keysToGains[key].gain.setTargetAtTime(0, startTime + duration, 0.01);
  }

  function loopRecording() {
    const endTime = notesInRecording[notesInRecording.length - 1].end;
    const loopDuration = endTime - loopStartTime;

    loopInterval = setInterval(function () {
      for (const noteInfo of notesInRecording) {
        // console.log("playing note", noteInfo);
        if (noteInfo.instrument === "osc") {
          const key = noteInfo.keyVal;
          playNote(
            key,
            loopStartTime + noteInfo.start - notesInRecording[0].start,
            noteInfo.end - noteInfo.start,
            0.1
          );
        }
      }
    }, loopDuration * 1000);
  }
});
