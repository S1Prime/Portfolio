/* ─── Active Nav Link on Scroll ──────────────────────────────────────────── */
(function () {
  const navLinks = document.querySelectorAll('#main-nav .nav-links a');
  const sections = document.querySelectorAll('main section[id]');

  function setActive() {
    let current = '';
    const scrollPos = window.scrollY + 140; // offset for sticky nav header
    
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        current = sec.id;
      }
    });

    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ─── Scroll-to-top Button ───────────────────────────────────────────────── */
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
let currentTheme = 'space';

(function () {
  const hubBtn = document.getElementById('theme-hub-btn');
  const dropdown = document.getElementById('theme-hub-dropdown');
  const themeOpts = document.querySelectorAll('.theme-hub-opt');

  if (!hubBtn || !dropdown) return;

  // Toggle dropdown on button click
  hubBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== hubBtn) {
      dropdown.classList.remove('show');
    }
  });

  // Switch Theme function
  function applyTheme(theme) {
    currentTheme = theme;
    
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
  const mouse = { x: null, y: null, radius: 160 };

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
    // Dynamically retrieve accent color computed by CSS variable
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return accent || '#64ffda';
  }

  function parseColor(colorString) {
    // Handles HSL values e.g. "hsl(166, 100%, 70%)"
    if (colorString.startsWith('hsl')) {
      const matches = colorString.match(/\d+/g);
      if (matches && matches.length >= 3) {
        return { h: parseInt(matches[0]), s: parseInt(matches[1]), l: parseInt(matches[2]) };
      }
    }
    // Fallback space theme teal color
    return { h: 166, s: 100, l: 70 };
  }

  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
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

      // Mouse repulsion physics
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.6;
          const directionY = forceDirectionY * force * 1.6;
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
    let numberOfParticles = (window.innerWidth * window.innerHeight) / 11000;
    if (numberOfParticles > 100) numberOfParticles = 100;
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.6) + 0.6;
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let vx = (Math.random() - 0.5) * 1.0;
      let vy = (Math.random() - 0.5) * 1.0;
      particles.push(new Particle(x, y, vx, vy, size));
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const accentColorStr = getAccentColor();
    const hsl = parseColor(accentColorStr);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(rgb);

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 115) {
          let opacity = 1 - (distance / 115);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.35})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Connect particles to mouse pointer
      if (mouse.x !== null && mouse.y !== null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 140) {
          let opacity = 1 - (distance / 140);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
          ctx.lineWidth = 1.1;
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
    'Computer Science Student',
    'AI & Machine Learning Enthusiast',
    'Problem Solver & Web Developer',
    'Open-Source AI Model Explorer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      charIndex--;
      typingSpeed = 30; // fast deletion
    } else {
      charIndex++;
      typingSpeed = 65; // standard typing
    }

    subtitleEl.textContent = currentTitle.substring(0, charIndex);

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingSpeed = 2000; // hold full phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 350; // pause before next typing loop
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
  const cards = document.querySelectorAll('.card-item, .tool-item, .contact-icon-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;
      
      // Tilt logic: maximum 15deg tilt
      const tiltX = (0.5 - py) * 15;
      const tiltY = (px - 0.5) * 15;
      
      card.style.setProperty('--tilt-x', `${tiltX}deg`);
      card.style.setProperty('--tilt-y', `${tiltY}deg`);
      card.style.setProperty('--glow-x', `${px * 100}%`);
      card.style.setProperty('--glow-y', `${py * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset properties on leave
      card.style.setProperty('--tilt-x', `0deg`);
      card.style.setProperty('--tilt-y', `0deg`);
      card.style.setProperty('--glow-x', `50%`);
      card.style.setProperty('--glow-y', `50%`);
    });
  });
})();



/* ─── Filterable Projects Grid ─────────────────────────────────────────── */
(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.cards-grid .card-item');

  if (filterTabs.length === 0 || projectCards.length === 0) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab styling
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide card first to trigger animation
        card.classList.remove('fade-in');
        card.classList.add('hide');

        if (filterVal === 'all' || category === filterVal) {
          // Wrap in a tiny timeout to allow display layout recalculation before fading in
          setTimeout(() => {
            card.classList.remove('hide');
            card.classList.add('fade-in');
          }, 20);
        }
      });
    });
  });
})();


/* ─── Interactive Contact Form Submission Lifecycle ─────────────────────── */
(function () {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  const btnSubmit = document.getElementById('btn-contact-submit');
  const btnText = document.getElementById('submit-btn-text');
  const spinner = document.getElementById('contact-spinner');
  const statusMsg = document.getElementById('contact-status-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset status message
    statusMsg.className = 'form-status-msg';
    statusMsg.textContent = '';
    statusMsg.style.display = 'none';

    // Retrieve input values
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const messageEl = document.getElementById('contact-message');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Simple validation checks
    if (!name || !email || !message) {
      showStatus('Please fill in all the input fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Set sending UI State
    setLoadingState(true);

    // Mock API request cycle (1.8 seconds)
    setTimeout(() => {
      setLoadingState(false);
      showStatus('Thanks! Your message has been sent successfully.', 'success');
      form.reset();

      // Clear success state after 4 seconds
      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.textContent = '';
      }, 4000);
    }, 1800);
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      btnSubmit.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'Sending...';
      form.querySelectorAll('input, textarea').forEach(input => input.disabled = true);
    } else {
      btnSubmit.disabled = false;
      spinner.style.display = 'none';
      btnText.textContent = 'Send Message';
      form.querySelectorAll('input, textarea').forEach(input => input.disabled = false);
    }
  }

  function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.style.display = 'block';
  }
})();
