// function openComponent(comp, button) {
//     var i;
//     var x = document.getElementsByClassName("component");
//     for (i = 0; i < x.length; i++) {
//       x[i].style.display = "none";
//     }
//     document.getElementById(comp).style.display = "block";

//     var tabs = document.getElementsByClassName("nav-link");
//     for (i = 0; i < tabs.length; i++) {
//       tabs[i].classList.remove("active");
//     }
//     button.classList.add("active");
// }

var activeComponent = "piano"; // Initial active component

function openComponent(comp, button) {
    var i;
    var x = document.getElementsByClassName("component");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    if (comp === "drums") {
      document.getElementById(comp).style.display = "flex";
      document.getElementById(comp).style.flexDirection = "row";
      document.getElementById(comp).style.flexWrap = "wrap";  // Allow drum pads to wrap into new rows
      document.getElementById(comp).style.justifyContent = "space-between";
    }
    else {
        document.getElementById(comp).style.display = "block";
    }

    var tabs = document.getElementsByClassName("nav-link");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    button.classList.add("active");

    // Update the active component
    activeComponent = comp;
}
