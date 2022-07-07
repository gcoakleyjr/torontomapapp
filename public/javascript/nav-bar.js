let scrollPosition = window.scrollY;
const navbar = document.querySelector(".nav-bar-custom");

window.addEventListener("scroll", function () {
    scrollPosition = window.scrollY;
  
    if (scrollPosition >= 100) {
        navbar.classList.add("navbar--fixed");
    } else {
        navbar.classList.remove("navbar--fixed");
    }
});