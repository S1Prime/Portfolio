/* ─── Active nav link on scroll ──────────────────────────────────────────── */
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


/* ─── Scroll-to-top button ───────────────────────────────────────────────── */
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


/* ─── Premium Theme Switcher & Storage ───────────────────────────────────── */
(function () {
  const menuBtn = document.getElementById('theme-menu-btn');
  const dropdown = document.getElementById('theme-dropdown');
  const themeOpts = document.querySelectorAll('.theme-opt');

  if (!menuBtn || !dropdown) return;

  // Toggle dropdown on button click
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== menuBtn) {
      dropdown.classList.remove('show');
    }
  });

  // Switch Theme function
  function applyTheme(theme) {
    // Apply data-theme attribute to html
    if (theme === 'space') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Set active option in dropdown
    themeOpts.forEach(opt => {
      const active = opt.getAttribute('data-theme') === theme;
      opt.classList.toggle('active', active);
    });

    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);
  }

  // Handle option click
  themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme');
      applyTheme(theme);
      dropdown.classList.remove('show');
    });
  });

  // Initialize from LocalStorage
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }
})();


/* ─── Interactive Constellation Particle Background ────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  // Track mouse
  const mouse = {
    x: null,
    y: null,
    radius: 120, // repulsion radius
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Sharp rendering for Retina/High-DPI screens
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    initParticles();
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 1;
      this.originalVx = this.vx;
      this.originalVy = this.vy;
    }

    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    update() {
      // Repulsion from mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Apply repulsion force
          this.vx += Math.cos(angle) * force * 0.25;
          this.vy += Math.sin(angle) * force * 0.25;
        }
      }

      // Physics deceleration back to original speed
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.vx += (this.originalVx - this.vx) * 0.05;
      this.vy += (this.originalVy - this.vy) * 0.05;

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around or bounce edges
      const margin = 10;
      if (this.x < -margin) this.x = window.innerWidth + margin;
      else if (this.x > window.innerWidth + margin) this.x = -margin;
      
      if (this.y < -margin) this.y = window.innerHeight + margin;
      else if (this.y > window.innerHeight + margin) this.y = -margin;
    }
  }

  function initParticles() {
    particles = [];
    // Number of particles proportional to screen size
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 9500);
    const count = Math.min(Math.max(particleCount, 40), 120); // bounds

    for (let i = 0; i < count; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      particles.push(new Particle(x, y));
    }
  }

  function getAccentColor() {
    // Get computed styles of document element to get dynamic active theme accent color
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return accent || '#64ffda';
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const accent = getAccentColor();

    // Draw and connect particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw(accent);

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          const alpha = ((110 - dist) / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1.0; // reset
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
})();


/* ─── Header Subtitle Typing Animation ──────────────────────────────────── */
(function () {
  const subtitleEl = document.getElementById('typing-subtitle');
  if (!subtitleEl) return;

  const titles = [
    'Computer Science Student & Engineer',
    'Artificial Intelligence Enthusiast',
    'Problem Solver & Web Developer',
    'Open-Source AI Model Explorer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      charIndex--;
      typingSpeed = 35; // faster deletion
    } else {
      charIndex++;
      typingSpeed = 70; // standard typing speed
    }

    subtitleEl.textContent = currentTitle.substring(0, charIndex);

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingSpeed = 2200; // pause at full text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 400; // pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
})();


/* ─── Scroll Reveal Observer ────────────────────────────────────────────── */
(function () {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();
