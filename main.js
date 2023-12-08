function openComponent(comp, button) {
    var i;
    var x = document.getElementsByClassName("component");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(comp).style.display = "block";

    var tabs = document.getElementsByClassName("nav-link");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    button.classList.add("active");
}