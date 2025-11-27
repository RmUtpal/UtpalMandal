/* =============================
   GSAP ANIMATIONS (Blue/Purple)
============================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     FLOATING BLOBS (Smooth)
  ============================== */
  gsap.to(".blob.blue", {
    x: 40, y: -20,
    duration: 16, repeat: -1,
    yoyo: true, ease: "sine.inOut"
  });

  gsap.to(".blob.purple", {
    x: -35, y: 25,
    duration: 18, repeat: -1,
    yoyo: true, ease: "sine.inOut"
  });

  /* =============================
     HERO ANIMATIONS
  ============================== */
  gsap.from(".hero h1", {
    y: 30, opacity: 0,
    duration: 1.2, ease: "power3.out"
  });

  gsap.from(".hero .lead", {
    y: 30, opacity: 0,
    duration: 1.1, delay: 0.2,
    ease: "power3.out"
  });

  gsap.from(".btn", {
    opacity: 0, y: 20,
    delay: 0.3, stagger: 0.15,
    duration: 1, ease: "power3.out"
  });

  gsap.from(".headshot img", {
    scale: 0.82, opacity: 0,
    delay: 0.35,
    duration: 1.3,
    ease: "power3.out"
  });

  /* =============================
     SCROLL REVEAL (AOS-style)
  ============================== */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach(el => revealObs.observe(el));

  /* =============================
     PARTICLES (Soft & Clean)
  ============================== */
  const canvas = document.getElementById("vpa-canvas");
  const ctx = canvas.getContext("2d");

  let w, h;
  const particles = [];
  const particleCount = 45;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor(){
      this.x = Math.random()*w;
      this.y = Math.random()*h;
      this.vx = (Math.random()-0.5)*0.35;
      this.vy = (Math.random()-0.5)*0.35;
      this.size = 1.4;
    }
    move(){
      this.x += this.vx;
      this.y += this.vy;
      if(this.x<0 || this.x>w) this.vx*=-1;
      if(this.y<0 || this.y>h) this.vy*=-1;
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,0.7)";
      ctx.fill();
    }
  }

  for(let i=0;i<particleCount;i++){
    particles.push(new Particle());
  }

  function animate(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{p.move();p.draw();});
    requestAnimationFrame(animate);
  }
  animate();
});
