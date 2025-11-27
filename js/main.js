/* =============================
   GSAP + SMOOTH NEON EFFECTS
============================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     FLOATING BLOBS MOTION
  ============================== */
  gsap.to(".vpa-shape.s1", {
    x: 40,
    y: -30,
    duration: 10,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  gsap.to(".vpa-shape.s2", {
    x: -25,
    y: 20,
    duration: 12,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  gsap.to(".vpa-shape.s3", {
    x: 30,
    y: -20,
    duration: 14,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });


  /* =============================
     HERO ANIMATION
  ============================== */
  gsap.from(".hero h1", {
    y: 30,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
  });

  gsap.from(".hero .lead", {
    y: 30,
    opacity: 0,
    delay: 0.2,
    duration: 1.1,
    ease: "power3.out",
  });

  gsap.from(".btn", {
    y: 20,
    opacity: 0,
    delay: 0.35,
    stagger: 0.12,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".headshot img", {
    scale: 0.8,
    opacity: 0,
    delay: 0.45,
    duration: 1.2,
    ease: "power3.out",
  });


  /* =============================
     SCROLL REVEAL
  ============================== */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach((el) => revealObs.observe(el));


  /* =============================
     PARTICLE BACKGROUND
     (Softer + Exact VWA Style)
  ============================== */
  const canvas = document.getElementById("vpa-canvas");
  const ctx = canvas.getContext("2d");

  let w, h;
  const particles = [];
  const particleCount = 55; // softer

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = 1.6;
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);

    for (let p of particles) {
      p.move();
      p.draw();
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

});
