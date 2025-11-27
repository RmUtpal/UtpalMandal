/* final main.js - injects GSAP if needed, creates particles and shapes dynamically, animates with GSAP */
/* Does NOT modify existing HTML structure; only adds decorative elements and animations. */

(function(){
  const VPA = {}; // namespace

  // inject GSAP and plugins if not present
  function loadScript(src){ return new Promise((res, rej) => { const s=document.createElement('script'); s.src=src; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }

  async function ensureGSAP(){
    if(window.gsap && window.gsap.registerPlugin && window.ScrollTrigger) return;
    try{
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js');
    }catch(e){
      console.warn('GSAP failed to load', e);
    }
  }

  // create canvas and shapes
  function createGraphics(){
    // canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'vpa-canvas';
    document.body.appendChild(canvas);
    VPA.canvas = canvas;
    VPA.ctx = canvas.getContext('2d');

    // shapes
    const s1 = document.createElement('div'); s1.className='vpa-shape s1';
    const s2 = document.createElement('div'); s2.className='vpa-shape s2';
    const s3 = document.createElement('div'); s3.className='vpa-shape s3';
    document.body.appendChild(s1); document.body.appendChild(s2); document.body.appendChild(s3);
    VPA.shapes = [s1,s2,s3];
  }

  // resize canvas
  function resizeCanvas(){
    const c = VPA.canvas; if(!c) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
    VPA.ctx && VPA.ctx.setTransform(dpr,0,0,dpr,0,0);
    VPA.w = window.innerWidth; VPA.h = window.innerHeight;
  }

  // particles system
  function initParticles(){
    VPA.particles = [];
    const area = Math.max(1, VPA.w * VPA.h);
    const count = Math.max(18, Math.floor(area / 90000)); // tuned for visual parity
    for(let i=0;i<count;i++){
      VPA.particles.push({
        x: Math.random()*VPA.w,
        y: Math.random()*VPA.h,
        vx: (Math.random()-0.5) * 0.4,
        vy: (Math.random()-0.5) * 0.4,
        r: 0.6 + Math.random()*2.6,
      });
    }
  }

  function drawParticles(){
    const ctx = VPA.ctx; if(!ctx) return;
    ctx.clearRect(0,0,VPA.w,VPA.h);
    // background subtle gradient glow (optional)
    // draw particles
    for(let p of VPA.particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = VPA.w + 10; if(p.x > VPA.w + 10) p.x = -10;
      if(p.y < -10) p.y = VPA.h + 10; if(p.y > VPA.h + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(196,255,255,0.04)'; // cyan tinted particles
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    // subtle connecting lines
    for(let i=0;i<VPA.particles.length;i++){
      for(let j=i+1;j<VPA.particles.length;j++){
        const a = VPA.particles[i], b = VPA.particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 120){
          const alpha = 0.018 * (1 - d/120);
          ctx.strokeStyle = 'rgba(196,255,255,'+alpha+')';
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    VPA.raf = requestAnimationFrame(drawParticles);
  }

  // animate shapes via GSAP
  function animateShapes(){
    if(!window.gsap) return;
    const [s1,s2,s3] = VPA.shapes;
    gsap.to(s1, { y: '+=40', x: '+=18', rotation: 6, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(s2, { y: '+=60', x: '-=30', rotation: -8, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay:1 });
    gsap.to(s3, { y: '-=40', x: '+=40', rotation: 4, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay:0.6 });
    // subtle opacity wobble
    gsap.to(VPA.shapes, { opacity: 0.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // hero and scroll animations
  function animateHeroAndScroll(){
    if(!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    // hero entrance
    gsap.from('.hero-card', { y: 28, opacity:0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.hero .lead, .badges', { y: 10, opacity:0, duration:0.7, stagger: 0.12, delay: 0.12 });
    gsap.from('.headshot img', { scale: 0.92, opacity:0, duration: 1.1, ease: 'elastic.out(1,0.6)' });
    // reveal sections
    document.querySelectorAll('.reveal').forEach((el, idx) => {
      gsap.fromTo(el, { y: 30, opacity: 0 }, {
        y:0, opacity:1, duration:0.85, ease:'power3.out', delay: idx*0.04,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
    // grid card stagger
    document.querySelectorAll('.grid').forEach(g => {
      const cards = g.querySelectorAll('.card');
      if(cards.length) gsap.from(cards, { y:20, opacity:0, stagger:0.12, duration:0.8, ease:'power3.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
    });
    // CTA pulse
    const cta = document.querySelector('.btn');
    if(cta) gsap.to(cta, { boxShadow: '0 16px 64px rgba(231,76,255,0.12)', duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // sticky header class toggle
  function setupHeader(){
    const header = document.querySelector('header');
    if(!header) return;
    window.addEventListener('scroll', () => {
      if(window.scrollY > 40) header.classList.add('sticky');
      else header.classList.remove('sticky');
    }, { passive: true });
  }

  // smooth anchors (uses gsap ScrollTo if available)
  function setupAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if(href.length > 1){
          e.preventDefault();
          const target = document.querySelector(href);
          if(target){
            if(window.gsap && gsap.to){
              gsap.to(window, { duration: 1, scrollTo: target, ease: 'power3.out' });
            } else {
              window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // initialize everything
  async function init(){
    // skip heavy decorations if user prefers reduced motion
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await ensureGSAP();
    createGraphics();
    resizeCanvas();
    initParticles();
    drawParticles();
    animateShapes();
    animateHeroAndScroll();
    setupHeader();
    setupAnchors();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });
  }

  // start
  document.addEventListener('DOMContentLoaded', init);
})();


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
