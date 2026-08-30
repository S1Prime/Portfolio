/**
 * Vaishnav Venu — Portfolio Core Engine
 * Custom Glow Cursor, Interactive Neural Canvas, 3D Tilt, Theme Switcher & System HUD
 */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. CUSTOM CYBER GLOW CURSOR
    ========================================================= */
    const cursorDot = document.getElementById("cursorDot");
    const cursorFollower = document.getElementById("cursorFollower");

    if (cursorDot && cursorFollower && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot moves instantly
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Smooth follower easing with RAF
        function animateCursorFollower() {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;

            cursorFollower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
            requestAnimationFrame(animateCursorFollower);
        }
        animateCursorFollower();

        // Enlarge follower on interactive elements
        const interactiveTargets = document.querySelectorAll(
            'a, button, input, textarea, select, .project-card, .pillar-card, .channel-card, .timeline-card'
        );

        interactiveTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => {
                cursorFollower.classList.add("hover-active");
            });
            target.addEventListener("mouseleave", () => {
                cursorFollower.classList.remove("hover-active");
            });
        });

        document.addEventListener("mouseleave", () => {
            cursorDot.style.opacity = "0";
            cursorFollower.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursorDot.style.opacity = "1";
            cursorFollower.style.opacity = "1";
        });
    }

    /* =========================================================
       2. NEURAL PARTICLE CANVAS
    ========================================================= */
    const canvas = document.getElementById("bg-canvas");
    let ctx = null;
    let width = 0;
    let height = 0;
    let particles = [];
    let waves = [];

    const mouse = {
        x: null,
        y: null,
        radius: 160
    };

    if (canvas) {
        ctx = canvas.getContext("2d");

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        }

        function initParticles() {
            particles = [];
            const count = Math.min(85, Math.floor((width * height) / 16000));

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: Math.random() * 1.6 + 0.6,
                    baseAlpha: Math.random() * 0.5 + 0.3
                });
            }
        }

        function getThemeAccentRGB() {
            const style = getComputedStyle(document.documentElement);
            const accent = style.getPropertyValue("--accent").trim();

            if (accent.startsWith("#")) {
                let hex = accent.substring(1);
                if (hex.length === 3) {
                    hex = hex.split("").map(c => c + c).join("");
                }
                const num = parseInt(hex, 16);
                return {
                    r: (num >> 16) & 255,
                    g: (num >> 8) & 255,
                    b: num & 255
                };
            }
            return { r: 101, g: 247, b: 255 }; // Default Cyan
        }

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);
            const rgb = getThemeAccentRGB();

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                // Screen Wrap
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Mouse Repulsion / Attraction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.x += (dx / dist) * force * 1.5;
                        p.y += (dy / dist) * force * 1.5;
                    }
                }

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.baseAlpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw Shockwaves
            for (let i = waves.length - 1; i >= 0; i--) {
                const w = waves[i];
                w.radius += 3.5;
                w.alpha -= 0.02;

                if (w.alpha <= 0) {
                    waves.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${w.alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(renderCanvas);
        }

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });
        window.addEventListener("click", (e) => {
            waves.push({
                x: e.clientX,
                y: e.clientY,
                radius: 4,
                alpha: 0.7
            });
        });

        resizeCanvas();
        renderCanvas();
    }

    /* =========================================================
       3. TYPEWRITER SUBTITLE EFFECT
    ========================================================= */
    const typewriterEl = document.getElementById("typewriterText");
    if (typewriterEl) {
        const phrases = [
            "AI & Machine Learning",
            "Full-Stack Java & Python",
            "Algorithmic Problem Solving",
            "High-Performance Web Systems",
            "Neural Architecture Exploration"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = 40;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 1800; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing new phrase
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    /* =========================================================
       4. NAVIGATION & ACTIVE SCROLL SPY
    ========================================================= */
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinksContainer = document.getElementById("navLinks");

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background intensity
        if (navbar) {
            navbar.classList.toggle("scrolled", scrollY > 40);
        }

        // Scroll-to-top visibility
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle("show", scrollY > 400);
        }

        // Active link detection
        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinksContainer.classList.toggle("mobile-menu-open");
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navLinksContainer.classList.remove("mobile-menu-open");
            });
        });
    }

    /* =========================================================
       5. SCROLL REVEAL & STATS COUNTER ANIMATION
    ========================================================= */
    const revealElements = document.querySelectorAll(".reveal");
    const statCounters = document.querySelectorAll(".stat-counter");
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        statCounters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            const isPercent = counter.textContent.includes("%");
            const isPlus = counter.textContent.includes("+");
            let current = 0;
            const step = Math.max(1, Math.floor(target / 45));
            const duration = 1200;
            const interval = Math.floor(duration / (target / step));

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current + (isPercent ? "%" : isPlus ? "+" : "");
            }, interval);
        });
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    if (entry.target.classList.contains("hero-hud-card")) {
                        animateCounters();
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* =========================================================
       6. PROJECT FILTERING SYSTEM
    ========================================================= */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");

            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            projectCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.classList.remove("hide");
                    card.classList.add("show");
                } else {
                    card.classList.remove("show");
                    card.classList.add("hide");
                }
            });
        });
    });

    /* =========================================================
       7. 3D CARD TILT ON MOUSE MOVE
    ========================================================= */
    projectCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 900) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* =========================================================
       8. THEME SWITCHING SYSTEM
    ========================================================= */
    const themeDropdownBtn = document.getElementById("themeDropdownBtn");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-opt");

    function applyTheme(themeName) {
        document.documentElement.setAttribute("data-theme", themeName);
        localStorage.setItem("portfolio-theme", themeName);

        themeOptions.forEach((opt) => {
            opt.classList.toggle("active", opt.getAttribute("data-theme-val") === themeName);
        });
    }

    if (themeDropdownBtn && themeMenu) {
        themeDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            themeMenu.classList.remove("show");
        });

        themeOptions.forEach((opt) => {
            opt.addEventListener("click", () => {
                const themeVal = opt.getAttribute("data-theme-val");
                applyTheme(themeVal);
                themeMenu.classList.remove("show");
            });
        });
    }

    // Load Saved Theme
    const savedTheme = localStorage.getItem("portfolio-theme") || "arc";
    applyTheme(savedTheme);

    /* =========================================================
       9. CONTACT FORM VALIDATION & INTERACTIVE STATUS
    ========================================================= */
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const formSubmitBtn = document.getElementById("formSubmitBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("formName").value.trim();
            const email = document.getElementById("formEmail").value.trim();
            const message = document.getElementById("formMessage").value.trim();

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.innerHTML = `<span style="color: var(--error);">Please complete all required fields.</span>`;
                }
                return;
            }

            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `<span>Transmitting Message...</span>`;
            }

            if (formStatus) {
                formStatus.innerHTML = `<span style="color: var(--accent);">Transmitting payload to core mailbox...</span>`;
            }

            // Simulate immediate transmission with realistic UX
            setTimeout(() => {
                if (formStatus) {
                    formStatus.innerHTML = `<span style="color: var(--success);">✓ Message dispatched successfully! Vaishnav will review shortly.</span>`;
                }
                contactForm.reset();

                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `<span>Send Message</span> <span>↗</span>`;
                }

                setTimeout(() => {
                    if (formStatus) formStatus.innerHTML = "";
                }, 5000);
            }, 1000);
        });
    }

    /* =========================================================
       10. DYNAMIC YEAR
    ========================================================= */
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
