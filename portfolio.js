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
let currentTheme = 'arc';

(function () {
  const themeSelect = document.getElementById('theme-select');
  if (!themeSelect) return;

  // Switch Theme function
  function applyTheme(theme) {
    currentTheme = theme;
    
    // Apply data-theme attribute to html
    if (theme === 'arc') {
      document.documentElement.setAttribute('data-theme', 'arc');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Sync select dropdown element value
    themeSelect.value = theme;

    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);
  }

  // Expose globally for CLI
  window.applyPortfolioTheme = applyTheme;

  // Listen for dropdown select changes
  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  // Initialize from LocalStorage
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('arc');
  }
})();


/* ─── Neural Network Canvas with Dynamic Interactive Waves ──────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  let shockwaves = [];
  const mouse = { x: null, y: null, radius: 180 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Shockwave burst on click
  window.addEventListener('click', (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      maxRadius: 160,
      alpha: 1
    });
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

  function getAccentColorHsl() {
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim();
    
    if (accent.startsWith('#')) {
      return hexToRgb(accent);
    }
    return { r: 0, g: 240, b: 255 };
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  class Particle {
    constructor(x, y, vx, vy, size) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
      this.baseSize = size;
    }

    draw(rgb) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
      ctx.fill();
    }

    update() {
      if (this.x > window.innerWidth || this.x < 0) this.vx = -this.vx;
      if (this.y > window.innerHeight || this.y < 0) this.vy = -this.vy;

      // Mouse repulsion & magnetic attraction physics
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 2.0;
          const directionY = forceDirectionY * force * 2.0;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Expand particle size when passing through active shockwave
      shockwaves.forEach(sw => {
        let dx = sw.x - this.x;
        let dy = sw.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - sw.radius) < 25) {
          this.size = this.baseSize * 2.2;
        } else {
          this.size = Math.max(this.baseSize, this.size * 0.95);
        }
      });

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  function initParticles() {
    particles = [];
    let numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    if (numberOfParticles > 60) numberOfParticles = 60;
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.8) + 0.6;
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let vx = (Math.random() - 0.5) * 0.5;
      let vy = (Math.random() - 0.5) * 0.5;
      particles.push(new Particle(x, y, vx, vy, size));
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const rgb = getAccentColorHsl();

    // Draw shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 4;
      sw.alpha -= 0.025;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sw.alpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(rgb);

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          let opacity = 1 - (distance / 130);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.45})`;
          ctx.lineWidth = 1.0;
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
        if (distance < 160) {
          let opacity = 1 - (distance / 160);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.75})`;
          ctx.lineWidth = 1.4;
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
    'AI & Neural Computing Focus',
    'Java & Python Backend Developer',
    'Full-Stack Web Engineering',
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
      typingSpeed = 25; // fast deletion
    } else {
      charIndex++;
      typingSpeed = 60; // standard typing
    }

    subtitleEl.textContent = currentTitle.substring(0, charIndex);

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingSpeed = 2200; // hold full phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 350; // pause before next typing loop
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
})();


/* ─── Stats Dashboard Animated Counter ─────────────────────────────────── */
(function () {
  const counterElements = document.querySelectorAll('.counter-num');
  if (counterElements.length === 0) return;

  let animated = false;

  function runCounters() {
    if (animated) return;
    const statsSection = document.querySelector('.stats-dashboard');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animated = true;
      counterElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const speed = Math.ceil(target / 40);
        
        const timer = setInterval(() => {
          count += speed;
          if (count >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = count;
          }
        }, 30);
      });
    }
  }

  window.addEventListener('scroll', runCounters, { passive: true });
  runCounters();
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
  const cards = document.querySelectorAll('.card-item, .tool-item, .contact-icon-card, .highlight-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;
      
      card.style.setProperty('--glow-x', `${px * 100}%`);
      card.style.setProperty('--glow-y', `${py * 100}%`);
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
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        card.classList.remove('fade-in');
        card.classList.add('hide');

        if (filterVal === 'all' || category === filterVal) {
          setTimeout(() => {
            card.classList.remove('hide');
            card.classList.add('fade-in');
          }, 20);
        }
      });
    });
  });
})();


/* ─── Interactive Sci-Fi CLI Terminal Modal ────────────────────────────── */
(function () {
  const triggerBtn = document.getElementById('cli-trigger-btn');
  const modal = document.getElementById('cli-modal');
  const closeBtn = document.getElementById('cli-close-btn');
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  const chipBtns = document.querySelectorAll('.cli-command-chips button');

  if (!modal || !cliInput || !cliOutput) return;

  function toggleModal(open) {
    if (open) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      cliInput.focus();
    } else {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (triggerBtn) triggerBtn.addEventListener('click', () => toggleModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));

  // Keyboard shortcut Ctrl + K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const isActive = modal.classList.contains('active');
      toggleModal(!isActive);
    } else if (e.key === 'Escape' && modal.classList.contains('active')) {
      toggleModal(false);
    }
  });

  // Handle CLI input commands
  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = cliInput.value.trim();
      if (cmd) {
        processCommand(cmd);
        cliInput.value = '';
      }
    }
  });

  // Handle Chip buttons
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      processCommand(cmd);
    });
  });

  function appendOutput(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = isCommand ? 'cli-line command-entered' : 'cli-line response';
    if (isCommand) {
      line.innerHTML = `<span style="color:var(--accent); font-weight:bold;">vaishnav@core:~$</span> ${escapeHtml(text)}`;
    } else {
      line.innerHTML = text;
    }
    cliOutput.appendChild(line);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function processCommand(rawCmd) {
    appendOutput(rawCmd, true);
    const parts = rawCmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const arg = parts[1];

    switch (command) {
      case 'help':
        appendOutput(`
          <div><strong>SYSTEM COMMAND REGISTRY:</strong></div>
          <div><strong style="color:var(--accent)">about</strong>     - View background &amp; engineering core</div>
          <div><strong style="color:var(--accent)">skills</strong>    - List technical stack &amp; languages</div>
          <div><strong style="color:var(--accent)">projects</strong>  - Display repository highlights</div>
          <div><strong style="color:var(--accent)">contact</strong>   - Display direct communication channels</div>
          <div><strong style="color:var(--accent)">theme</strong>     - Switch theme (usage: theme arc|midnight|light)</div>
          <div><strong style="color:var(--accent)">time</strong>      - Output active server time</div>
          <div><strong style="color:var(--accent)">clear</strong>     - Clear terminal buffer</div>
        `);
        break;

      case 'about':
        appendOutput(`
          <div><strong>VAISHNAV VENU</strong> // CS &amp; AI Engineering Student at Amrita Vishwa Vidyapeetham. Focused on AI algorithms, Java JDBC enterprise backends, and full-stack web software.</div>
        `);
        break;

      case 'skills':
        appendOutput(`
          <div><strong>PRIMARY TECH MATRIX:</strong></div>
          <div>• Languages: Python 3.x, Java Standard Edition, JavaScript (ES6+), C/C++</div>
          <div>• Web &amp; Backend: HTML5, CSS Glassmorphism, SQL &amp; JDBC API</div>
          <div>• AI &amp; Math: Open-Source Models, MATLAB Matrix Algebra, Data Structures</div>
        `);
        break;

      case 'projects':
        appendOutput(`
          <div><strong>FEATURED REPOSITORIES:</strong></div>
          <div>1. Desktop Arithmetic System [Python]</div>
          <div>2. Personal Budget Tracker [Python]</div>
          <div>3. Online Quiz Management System [Java / SQL Servlets]</div>
          <div>4. Student Task Manager [HTML5 / JS]</div>
          <div>5. Modern Web Calculator Engine [JavaScript]</div>
          <div>6. MATLAB Analytical Workspace [MATLAB]</div>
        `);
        break;

      case 'contact':
        appendOutput(`
          <div><strong>DIRECT CHANNELS:</strong></div>
          <div>• Email: vaishnavvenu2007@gmail.com</div>
          <div>• GitHub: https://github.com/S1Prime</div>
          <div>• LinkedIn: https://www.linkedin.com/in/vaishnav-venu-079a2a383/</div>
        `);
        break;

      case 'theme':
        if (['arc', 'midnight', 'light'].includes(arg)) {
          if (window.applyPortfolioTheme) window.applyPortfolioTheme(arg);
          appendOutput(`<div style="color:var(--accent)">Theme successfully set to: <strong>${arg}</strong></div>`);
        } else {
          appendOutput(`<div>Usage: theme [arc | midnight | light]</div>`);
        }
        break;

      case 'time':
        appendOutput(`<div>CURRENT SYSTEM TIME: ${new Date().toLocaleString()}</div>`);
        break;

      case 'clear':
        cliOutput.innerHTML = '';
        break;

      case 'sudo':
        appendOutput(`<div style="color:#ef4444">Permission denied: You already have maximum root access to this portfolio.</div>`);
        break;

      default:
        appendOutput(`<div>Command not recognized: '<span style="color:#ef4444">${escapeHtml(rawCmd)}</span>'. Type <strong style="color:var(--accent)">'help'</strong> for commands.</div>`);
        break;
    }
  }
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

    statusMsg.className = 'form-status-msg';
    statusMsg.textContent = '';
    statusMsg.style.display = 'none';

    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const messageEl = document.getElementById('contact-message');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all the input fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    setLoadingState(true);

    setTimeout(() => {
      setLoadingState(false);
      showStatus('⚡ Message transmitted successfully! Vaishnav will get back to you shortly.', 'success');
      form.reset();

      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.textContent = '';
      }, 5000);
    }, 1600);
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      btnSubmit.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'TRANSMITTING...';
      form.querySelectorAll('input, textarea').forEach(input => input.disabled = true);
    } else {
      btnSubmit.disabled = false;
      spinner.style.display = 'none';
      btnText.textContent = '⚡ TRANSMIT MESSAGE';
      form.querySelectorAll('input, textarea').forEach(input => input.disabled = false);
    }
  }

  function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.style.display = 'block';
  }
})();
