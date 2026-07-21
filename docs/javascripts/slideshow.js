document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".slideshow").forEach(function (el) {
    var slides = el.querySelectorAll(".slide");
    var current = 0;

    function show(n) {
      slides[current].classList.remove("active");
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("active");
      el.querySelector(".slide-counter").textContent =
        (current + 1) + " / " + slides.length;
    }

    el.querySelector(".slide-prev").addEventListener("click", function () { show(current - 1); });
    el.querySelector(".slide-next").addEventListener("click", function () { show(current + 1); });
    show(0);
  });
});
