document.addEventListener("DOMContentLoaded", function (event) {
  const audioCtx = window.audioCtx; // use the global audio context
  var recCompr = window.globalCompr;

  var activeInstrument = "osc";
  var recording = false;
  var keyStarts = {}; // int (keycode) to int (time)
  var notesInRecording = [];

  // DEBUG
  var notesInRecording = [
    { instrument: "osc", keyVal: "83", start: 0, end: 1 },
    { instrument: "osc", keyVal: "68", start: 4, end: 5 },
    // { instrument: "osc", keyVal: "68", start: 1, end: 1.5 },
    // { instrument: "osc", keyVal: "68", start: 2, end: 2.5 },
  ];

  const keyValToFreq = window.keyValToFreq;

  // const keysToNotes = window.keysToNotes;

  // const keyValToMidi = window.keyValToMidi;

  document.getElementById("rec-btn").addEventListener("click", toggleRec);
  document.addEventListener("keydown", recordKeyStroke);
  document.addEventListener("keyup", endKeyStroke);
  document.getElementById("play-rec").addEventListener("click", playRecording);

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
  function playRecording() {
    var keysToActiveOscs = {}; // local oscs to the recording {key: Osc}
    var keysToActiveGains = {}; // and their gainNodes {key: GainNode}
    let startTime = audioCtx.currentTime; // recording start time
    if (!recording) {
      notesInRecording.sort((a, b) => a.start - b.start); // sort by the start time (first played notes are first played)
      const offset = notesInRecording[0].start;
      console.log("playing recording:", notesInRecording);

      for (let i = 0; i < notesInRecording.length; i++) {
        let noteInfo = notesInRecording[i];

        // console.log("playing note", noteInfo);
        if (noteInfo.instrument === "osc") {
          let key = noteInfo.keyVal;

          if (!keysToActiveOscs[key]) {
            // this note hasn't been played yet in the rec, so create new osc/gains
            keysToActiveOscs[key] = audioCtx.createOscillator();
            keysToActiveGains[key] = audioCtx.createGain();
            keysToActiveOscs[key].frequency.setValueAtTime(
              keyValToFreq[key],
              startTime
            );
            keysToActiveOscs[key].start();
            console.log("create osc for key", key);
          }

          // In the case where there is a gap between notes, time elapsed needs to be updated
          keysToActiveGains[key].gain.setTargetAtTime(
            0.1,
            startTime + noteInfo.start - offset,
            0.01
          );

          keysToActiveOscs[key]
            .connect(keysToActiveGains[key])
            .connect(recCompr)
            .connect(audioCtx.destination);

          // update time elapsed to reflect that we "played" the note
          // timeElapsed += noteDuration;

          // now turn off the note after its duration
          keysToActiveGains[key].gain.setTargetAtTime(
            0,
            startTime + noteInfo.end - offset,
            0.01
          );
        }
      }
      // console.log(keysToActiveOscs);
    }
  }
});
