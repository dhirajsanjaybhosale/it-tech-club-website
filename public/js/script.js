document.addEventListener("DOMContentLoaded", function () {

  /* ================= NAVBAR SCROLL EFFECT ================= */
  const navbar = document.querySelector(".custom-navbar");

  const handleScroll = () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run once on page load


  /* ================= SCROLL REVEAL FOR EVENT CARDS ================= */
  const revealElements = document.querySelectorAll(".event-card");

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);


  /* ================= BUTTON RIPPLE EFFECT ================= */
  const buttons = document.querySelectorAll(".signup-btn, .btn-warning");

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {

      const circle = document.createElement("span");
      circle.classList.add("ripple");

      const rect = button.getBoundingClientRect();
      circle.style.left = e.clientX - rect.left + "px";
      circle.style.top = e.clientY - rect.top + "px";

      button.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

});
