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


/* ─── Neural Network Particle Background ────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

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

  function getAccentColor() {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return accent || '#64ffda';
  }

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 100, g: 255, b: 218 };
  }

  class Particle {
    constructor(x, y, vx, vy, size) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
    }
    draw(rgb) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.fill();
    }
    update() {
      if (this.x > window.innerWidth || this.x < 0) this.vx = -this.vx;
      if (this.y > window.innerHeight || this.y < 0) this.vy = -this.vy;

      // Mouse interaction (particles avoid the mouse slightly, creating a cool effect)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  function initParticles() {
    particles = [];
    let numberOfParticles = (window.innerWidth * window.innerHeight) / 10000;
    if (numberOfParticles > 120) numberOfParticles = 120; // Cap to ensure performance
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.5) + 0.5;
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let vx = (Math.random() - 0.5) * 1.2;
      let vy = (Math.random() - 0.5) * 1.2;
      particles.push(new Particle(x, y, vx, vy, size));
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const accent = getAccentColor();
    const rgb = hexToRgb(accent);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(rgb);

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let opacity = 1 - (distance / 110);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 140) {
          let opacity = 1 - (distance / 140);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(drawNetwork);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawNetwork();
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


/* ─── 3D Card Hover Parallax Tilt & Sheen Reflect ─────────────────────── */
(function () {
  const cards = document.querySelectorAll('.card-item, .contact-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // relative mouse coordinate X inside card
      const y = e.clientY - rect.top;  // relative mouse coordinate Y inside card
      
      // Calculate normalized offset ratios (-0.5 to 0.5)
      const px = x / rect.width;
      const py = y / rect.height;
      
      // Compute tilt angles (max 18 degrees tilt)
      const tiltX = (0.5 - py) * 18;
      const tiltY = (px - 0.5) * 18;
      
      // Set custom CSS variables on target element in real time
      card.style.setProperty('--tilt-x', `${tiltX}deg`);
      card.style.setProperty('--tilt-y', `${tiltY}deg`);
      card.style.setProperty('--glow-x', `${px * 100}%`);
      card.style.setProperty('--glow-y', `${py * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset on mouse leave
      card.style.setProperty('--tilt-x', `0deg`);
      card.style.setProperty('--tilt-y', `0deg`);
      card.style.setProperty('--glow-x', `50%`);
      card.style.setProperty('--glow-y', `50%`);
    });
  });
})();
