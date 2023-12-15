
var activeComponent = "piano"; 

function openComponent(comp, button) {
    var i;
    var x = document.getElementsByClassName("component");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    if (comp === "drums") {
      document.getElementById(comp).style.display = "flex";
      document.getElementById(comp).style.flexDirection = "row";
      document.getElementById(comp).style.flexWrap = "wrap"; 
      // document.getElementById(comp).style.flexBasis = "50%";
      // document.getElementById(comp).style.justifyContent = "space-between";

      const componentWidthPercentage = 20;
      const components = document.getElementById(comp).getElementsByClassName("drum-pad");

      for (let i = 0; i < components.length; i++) {
        components[i].style.width = `${componentWidthPercentage}%`;
      }

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

