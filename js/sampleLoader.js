function loadSample(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioCtx.decodeAudioData(buffer));
}
function loadSampleFromInput(file) {
  return file.arrayBuffer().then((buffer) => audioCtx.decodeAudioData(buffer));
}

export { loadSample, loadSampleFromInput };
