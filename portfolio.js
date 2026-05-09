
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.8, 2.2),
      dx: rand(-0.25, 0.25),
      dy: rand(-0.3, -0.05),
      alpha: rand(0.2, 0.7),
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function drawLine(a, b, dist) {
    const opacity = (1 - dist / 140) * 0.25;
    ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -10) { Object.assign(p, createParticle(), { y: H + 10 }); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${p.alpha})`;
      ctx.fill();

      // connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 140) drawLine(p, q, dist);
      }
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  loop();
})();
(function () {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(s => observer.observe(s));
})();
(function () {
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('main section[id]');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
(function () {
  const el = document.getElementById('typed-subtitle');
  if (!el) return;

  const phrases = [
    'Computer Science & Engineering Student',
    'AI Enthusiast',
    'Open-Source Explorer',
    'Problem Solver',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    el.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);

    if (!deleting && ci > phrase.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      ci = 0;
      setTimeout(tick, 400);
      return;
    }
    setTimeout(tick, deleting ? 40 : 65);
  }

  tick();
})();
(function () {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
(function () {
  document.querySelectorAll('.card-item, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
