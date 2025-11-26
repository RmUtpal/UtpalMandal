/* -----------------------------------
   Smooth Scroll
----------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 50,
        behavior: "smooth"
      });
    }
  });
});

/* -----------------------------------
   Scroll Reveal on View
----------------------------------- */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* -----------------------------------
   (Optional)
   Add More Animations Here
   Example:
----------------------------------- */

// Fade in header when scrolling
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    document.querySelector("header").style.background = "rgba(255,255,255,0.9)";
    document.querySelector("header").style.backdropFilter = "blur(8px)";
  } else {
    document.querySelector("header").style.background = "transparent";
  }
});


