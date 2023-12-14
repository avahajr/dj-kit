var keyState = {};

function playSound(event) {
    const key = event.key.toUpperCase();
    
    // Check if the active component is "drums" and key is not already pressed
    if (activeComponent === "drums" && !keyState[key]) {
        keyState[key] = true;
        const audioElement = document.getElementById(key);
        const drumPad = document.querySelector(`.drum-pad[data-key="${key}"]`);

        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play();
        }
        if (drumPad) {
            drumPad.classList.add("active");
        }
    }
}

function stopSound(event) {
    const key = event.key.toUpperCase();

    // Check if the active component is "drums"
    if (activeComponent === "drums") {
        keyState[key] = false;
        const drumPad = document.querySelector(`.drum-pad[data-key="${key}"]`);
        const audioElement = document.getElementById(key);
        if (drumPad){
            drumPad.classList.remove("active");
        }
    }
}

// Add event listeners for the 'ended' event to stop the audio playback and reset the time
document.querySelectorAll('.clip').forEach(audioElement => {
    audioElement.addEventListener('ended', () => {
        const key = audioElement.id.toUpperCase();
        
        // Check if the active component is "drums" and key is not pressed
        if (activeComponent === "drums" && !keyState[key]) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    });
});

// Add event listeners for keyboard events
document.addEventListener('keydown', playSound);
document.addEventListener('keyup', stopSound);
