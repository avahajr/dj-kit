
var recording = false; // to implement later

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("rec-btn").addEventListener("click", toggleRec);
  
    function toggleRec() {
      if (!recording) {
        document.getElementById("rec-cir").classList.add("rec-active");
      } else {
        document.getElementById("rec-cir").classList.remove("rec-active");
      }
      recording = !recording;
      console.log("toggle rec:", recording);
    }
  
});

