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


/* ─── Siri-style dynamic fluid waves ────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let mouse = { x: null, y: null, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
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
  }

  let waveData = [
    {
      phase: 0,
      amplitude: 35,
      frequency: 0.003,
      speed: 0.015,
      offset: 0,
      alpha: 0.15
    },
    {
      phase: Math.PI * 0.4,
      amplitude: 45,
      frequency: 0.002,
      speed: -0.01,
      offset: 20,
      alpha: 0.1
    },
    {
      phase: Math.PI * 0.8,
      amplitude: 25,
      frequency: 0.005,
      speed: 0.02,
      offset: -20,
      alpha: 0.12
    },
    {
      phase: Math.PI * 1.2,
      amplitude: 30,
      frequency: 0.004,
      speed: -0.015,
      offset: 10,
      alpha: 0.08
    }
  ];

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

  function drawWaves() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const accent = getAccentColor();
    const rgb = hexToRgb(accent);
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const theme = document.documentElement.getAttribute('data-theme');
    ctx.globalCompositeOperation = (theme === 'light') ? 'multiply' : 'screen';

    waveData.forEach((wave, idx) => {
      wave.phase += wave.speed;
      
      ctx.beginPath();
      
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      grad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.alpha})`);
      grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      
      ctx.fillStyle = grad;

      for (let x = 0; x <= width; x += 10) {
        let y = height * 0.72 + wave.offset;
        let waveAmp = wave.amplitude;
        let mouseInfluence = 0;
        
        if (mouse.active && mouse.x !== null) {
          const distToMouse = Math.abs(x - mouse.x);
          if (distToMouse < 250) {
            const factor = (250 - distToMouse) / 250;
            waveAmp += factor * 22;
            mouseInfluence = factor * Math.sin((x - mouse.x) * 0.05) * 12;
          }
        }

        const sineVal = Math.sin(x * wave.frequency + wave.phase) * Math.cos(x * 0.001 + wave.phase * 0.5);
        y += sineVal * waveAmp + mouseInfluence;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(drawWaves);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawWaves();
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
