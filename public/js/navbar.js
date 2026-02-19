document.addEventListener("DOMContentLoaded", function () {

  const navbar = document.querySelector(".custom-navbar");

  if (!navbar) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

});
