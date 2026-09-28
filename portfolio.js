/**
 * Vaishnav Venu — Portfolio Core Engine
 * Custom Glow Cursor, Interactive Neural Canvas, 3D Tilt, Theme Switcher,
 * Live Code Sandbox, AI Voice Briefing, Gamified Achievements & Architecture Inspector.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. SYNTHESIZED WEB AUDIO & SOUND EFFECTS ENGINE
    ========================================================= */
    let soundEnabled = true;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playAudioTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context fallback
        }
    }

    function playAchievementSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    playAudioTone(freq, 'triangle', 0.12, 0.08);
                }, idx * 80);
            });
        } catch (e) {}
    }

    const soundToggleBtn = document.getElementById("btnSoundToggle");
    const soundIcon = document.getElementById("soundIcon");

    if (soundToggleBtn && soundIcon) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
            soundToggleBtn.style.opacity = soundEnabled ? "1" : "0.5";
            if (soundEnabled) playAudioTone(880, 'sine', 0.1, 0.05);
        });
    }

    const CLICKABLE_SELECTOR = 'a, button, input, textarea, select, .project-card, .cert-card, .cert-image-wrap, .btn-cert-view, .btn-cert-link, .pillar-card, .channel-card, .timeline-card, .tech-chip, .tag-pill, .hud-stat-box, .profile-avatar-wrap, .btn-inspect-modal, .filter-btn, .theme-opt, .scroll-top-btn, .btn-tech-action, .btn-scan-trigger, .btn-hud-toggle, .btn-tech-spec-toggle, .btn-run-sim, .spec-pill, .btn-copy-email, [role="button"]';

    function spawnCyberRipple(e, target) {
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2.2;

        const ripple = document.createElement("span");
        ripple.className = "cyber-ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        const computed = window.getComputedStyle(target);
        if (computed.position === 'static') {
            target.style.position = 'relative';
        }
        if (computed.overflow !== 'hidden' && !target.classList.contains('theme-dropdown')) {
            target.style.overflow = 'hidden';
        }

        target.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 650);
    }

    function spawnSparks(x, y) {
        const sparkCount = 6;
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement("span");
            spark.className = "click-spark";
            const angle = (i / sparkCount) * (Math.PI * 2) + (Math.random() - 0.5) * 0.4;
            const distance = Math.random() * 45 + 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            spark.style.setProperty("--spark-tx", `${tx}px`);
            spark.style.setProperty("--spark-ty", `${ty}px`);
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;

            document.body.appendChild(spark);
            setTimeout(() => {
                spark.remove();
            }, 550);
        }
    }

    // Attach subtle audio feedback on hover across all clickable targets
    document.querySelectorAll(CLICKABLE_SELECTOR).forEach(el => {
        el.addEventListener("mouseenter", () => {
            playAudioTone(440, 'sine', 0.025, 0.015);
        });
    });

    // Delegated click handler for ripples, sparks, and specialized audio
    document.addEventListener("click", (e) => {
        const target = e.target.closest(CLICKABLE_SELECTOR);
        if (!target) return;

        // Specialized audio feedback
        if (target.classList.contains("tech-chip")) {
            playAudioTone(820, 'triangle', 0.06, 0.04);
        } else if (target.classList.contains("hud-stat-box")) {
            playAudioTone(580, 'sine', 0.06, 0.04);
            setTimeout(() => playAudioTone(880, 'sine', 0.08, 0.04), 60);
        } else if (target.classList.contains("profile-avatar-wrap")) {
            playAchievementSound();
        } else if (target.classList.contains("filter-btn")) {
            playAudioTone(540, 'sine', 0.06, 0.035);
        } else if (target.classList.contains("btn-scan-trigger")) {
            playAudioTone(380, 'sine', 0.12, 0.06);
            setTimeout(() => playAudioTone(760, 'triangle', 0.15, 0.08), 80);
        } else if (target.classList.contains("btn-hud-toggle")) {
            playAudioTone(640, 'sine', 0.08, 0.05);
            setTimeout(() => playAudioTone(920, 'sine', 0.09, 0.04), 50);
        } else if (target.classList.contains("btn-tech-spec-toggle")) {
            playAudioTone(740, 'triangle', 0.07, 0.045);
        } else if (target.classList.contains("btn-run-sim")) {
            playAudioTone(520, 'sine', 0.08, 0.05);
            setTimeout(() => playAudioTone(1040, 'triangle', 0.12, 0.07), 70);
        } else if (target.classList.contains("theme-opt")) {
            playAudioTone(720, 'sine', 0.07, 0.04);
        } else {
            playAudioTone(660, 'sine', 0.05, 0.03);
        }

        spawnCyberRipple(e, target);
        spawnSparks(e.clientX, e.clientY);
    });

    // Special avatar & HUD stats click animations
    const avatarWrap = document.querySelector(".profile-avatar-wrap");
    if (avatarWrap) {
        let avatarSpins = 0;
        avatarWrap.addEventListener("click", () => {
            avatarSpins++;
            avatarWrap.style.transform = `scale(1.15) rotate(${avatarSpins % 2 === 0 ? 10 : -10}deg)`;
            setTimeout(() => {
                avatarWrap.style.transform = "";
            }, 300);
            showToast("Neural Core Active", "System clock frequency overclocked to maximum!");
        });
    }

    document.querySelectorAll(".hud-stat-box").forEach(box => {
        box.addEventListener("click", () => {
            const counter = box.querySelector(".stat-counter");
            if (counter) {
                counter.style.transform = "scale(1.22)";
                counter.style.color = "var(--accent)";
                counter.style.transition = "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease";
                setTimeout(() => {
                    counter.style.transform = "";
                    counter.style.color = "";
                }, 300);
            }
        });
    });

    /* =========================================================
       2. GAMIFIED ACHIEVEMENT SYSTEM
    ========================================================= */
    const achievements = {
        explorer: { id: "explorer", title: "System Explorer 🏆", desc: "Explored academic and engineering sections.", unlocked: false },
        voice: { id: "voice", title: "Voice Command Active 🎙️", desc: "Triggered AI Voice Briefing.", unlocked: false },
        theme: { id: "theme", title: "Theme Architect 🎨", desc: "Customized portfolio color theme.", unlocked: false },
        inspector: { id: "inspector", title: "Tech Inspector 🔍", desc: "Inspected project architecture details.", unlocked: false },
        hackathon: { id: "hackathon", title: "Hackathon Competitor ⚡", desc: "Inspected competitive hackathon credentials.", unlocked: false }
    };

    let unlockedCount = 0;
    const toast = document.getElementById("achievementToast");
    const toastTitle = document.getElementById("toastTitle");
    const toastDesc = document.getElementById("toastDesc");
    const scoreEl = document.getElementById("achievementScore");

    const achievementsModal = document.getElementById("achievementsModal");
    const btnCloseAchievementsModal = document.getElementById("btnCloseAchievementsModal");
    const btnClaimAchievementsClose = document.getElementById("btnClaimAchievementsClose");
    const btnResetAchievements = document.getElementById("btnResetAchievements");
    const achievementsList = document.getElementById("achievementsList");
    const achievementsProgressText = document.getElementById("achievementsProgressText");
    const achievementsProgressPct = document.getElementById("achievementsProgressPct");
    const achievementsProgressFill = document.getElementById("achievementsProgressFill");

    function renderAchievementsModal() {
        if (!achievementsList) return;
        const total = Object.keys(achievements).length;
        const pct = Math.round((unlockedCount / total) * 100);

        if (achievementsProgressText) achievementsProgressText.textContent = `Unlocked ${unlockedCount} of ${total} Badges`;
        if (achievementsProgressPct) achievementsProgressPct.textContent = `${pct}%`;
        if (achievementsProgressFill) achievementsProgressFill.style.width = `${pct}%`;

        achievementsList.innerHTML = Object.values(achievements).map(a => `
            <div class="achievement-item-row ${a.unlocked ? 'unlocked' : ''}">
                <div class="achievement-row-icon">${a.unlocked ? '✓' : '🔒'}</div>
                <div class="achievement-row-info">
                    <div class="achievement-row-title">${a.title}</div>
                    <div class="achievement-row-desc">${a.desc}</div>
                </div>
                <span class="achievement-row-status">${a.unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
        `).join("");
    }

    function openAchievementsModal() {
        if (!achievementsModal) return;
        renderAchievementsModal();
        achievementsModal.classList.remove("closing");
        achievementsModal.classList.add("active");
        playAudioTone(587.33, 'triangle', 0.1, 0.05);
        setTimeout(() => playAudioTone(880, 'sine', 0.14, 0.05), 80);
    }

    function closeAchievementsModal() {
        if (!achievementsModal || !achievementsModal.classList.contains("active")) return;
        achievementsModal.classList.add("closing");
        playAudioTone(440, 'sine', 0.1, 0.04);
        setTimeout(() => {
            achievementsModal.classList.remove("active");
            achievementsModal.classList.remove("closing");
        }, 320);
    }

    function loadAchievements() {
        const saved = JSON.parse(localStorage.getItem("portfolio-achievements") || "{}");
        unlockedCount = 0;
        Object.keys(achievements).forEach(key => {
            if (saved[key]) {
                achievements[key].unlocked = true;
                unlockedCount++;
            }
        });
        updateScoreBadge();
    }

    function updateScoreBadge() {
        if (scoreEl) scoreEl.textContent = `${unlockedCount}/5`;
    }

    function unlockAchievement(key) {
        if (!achievements[key] || achievements[key].unlocked) return;

        achievements[key].unlocked = true;
        unlockedCount++;
        
        const saved = JSON.parse(localStorage.getItem("portfolio-achievements") || "{}");
        saved[key] = true;
        localStorage.setItem("portfolio-achievements", JSON.stringify(saved));

        updateScoreBadge();
        showToast(achievements[key].title, achievements[key].desc);
        playAchievementSound();
        renderAchievementsModal();
    }

    function showToast(title, desc) {
        if (!toast || !toastTitle || !toastDesc) return;
        toastTitle.textContent = title;
        toastDesc.textContent = desc;

        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }

    loadAchievements();

    const btnAchievements = document.getElementById("btnAchievements");
    if (btnAchievements) {
        btnAchievements.addEventListener("click", () => {
            openAchievementsModal();
        });
    }

    if (btnCloseAchievementsModal) {
        btnCloseAchievementsModal.addEventListener("click", closeAchievementsModal);
    }

    if (btnClaimAchievementsClose) {
        btnClaimAchievementsClose.addEventListener("click", closeAchievementsModal);
    }

    if (achievementsModal) {
        achievementsModal.addEventListener("click", (e) => {
            if (e.target === achievementsModal) closeAchievementsModal();
        });
    }

    if (btnResetAchievements) {
        btnResetAchievements.addEventListener("click", () => {
            localStorage.removeItem("portfolio-achievements");
            Object.keys(achievements).forEach(k => achievements[k].unlocked = false);
            unlockedCount = 0;
            updateScoreBadge();
            renderAchievementsModal();
            playAudioTone(300, 'sine', 0.15, 0.04);
            showToast("Achievements Reset", "Cleared unlocked badges.");
        });
    }

    /* =========================================================
       3. CUSTOM CYBER GLOW CURSOR
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
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateCursorFollower() {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;
            cursorFollower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
            requestAnimationFrame(animateCursorFollower);
        }
        animateCursorFollower();

        const interactiveTargets = document.querySelectorAll(CLICKABLE_SELECTOR);

        interactiveTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => cursorFollower.classList.add("hover-active"));
            target.addEventListener("mouseleave", () => cursorFollower.classList.remove("hover-active"));
        });

        window.addEventListener("mousedown", () => {
            cursorDot.classList.add("cursor-clicked");
            cursorFollower.classList.add("cursor-clicked");
        });

        window.addEventListener("mouseup", () => {
            cursorDot.classList.remove("cursor-clicked");
            cursorFollower.classList.remove("cursor-clicked");
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
       4. NEURAL PARTICLE CANVAS
    ========================================================= */
    const canvas = document.getElementById("bg-canvas");
    let ctx = null;
    let width = 0;
    let height = 0;
    let particles = [];

    const mouse = { x: null, y: null, radius: 160 };

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
            return { r: 101, g: 247, b: 255 };
        }

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);
            const rgb = getThemeAccentRGB();

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

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

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.baseAlpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.22;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderCanvas);
        }

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        resizeCanvas();
        renderCanvas();
    }

    /* =========================================================
       5. TYPEWRITER HERO ANIMATION
    ========================================================= */
    const typewriterEl = document.getElementById("typewriterText");
    const phrases = [
        "Artificial Intelligence & Machine Learning",
        "Full-Stack Systems Architecture",
        "Algorithmic Problem Solving",
        "Python & Java Backend Engineering",
        "Open-Source AI Explorations"
    ];

    if (typewriterEl) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                charIndex--;
                typewriterEl.textContent = currentPhrase.substring(0, charIndex);
            } else {
                charIndex++;
                typewriterEl.textContent = currentPhrase.substring(0, charIndex);
            }

            let typeSpeed = isDeleting ? 30 : 60;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 800);
    }

    /* =========================================================
       6. AI VOICE BRIEFING ENGINE (SPEECH SYNTHESIS)
    ========================================================= */
    const btnVoice = document.getElementById("btnVoiceBriefing");
    let isSpeaking = false;

    if (btnVoice && 'speechSynthesis' in window) {
        btnVoice.addEventListener("click", () => {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                isSpeaking = false;
                btnVoice.classList.remove("speaking");
                btnVoice.innerHTML = `<span>🎙️ AI Voice Briefing</span>`;
                return;
            }

            const speechText = "Welcome to Vaishnav Venu's Neural Command Center. Vaishnav is a Computer Science and Artificial Intelligence Engineering student at Amrita Vishwa Vidyapeetham, specializing in machine learning, full-stack systems, and high-performance algorithms.";

            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang.includes("en"));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => {
                isSpeaking = true;
                btnVoice.classList.add("speaking");
                btnVoice.innerHTML = `<span>⏹️ Stop Voice</span>`;
                unlockAchievement("voice");
            };

            utterance.onend = () => {
                isSpeaking = false;
                btnVoice.classList.remove("speaking");
                btnVoice.innerHTML = `<span>🎙️ AI Voice Briefing</span>`;
            };

            window.speechSynthesis.speak(utterance);
        });
    }


    /* =========================================================
       8. PROJECT ARCHITECTURE INSPECTOR MODAL
    ========================================================= */
    const projectDetails = {
        calculator: {
            title: "Desktop Arithmetic System",
            badge: "PYTHON CORE",
            url: "https://github.com/S1Prime/Calculator",
            arch: "Engineered in Python with custom string expression tokenization, operator precedence evaluation (Shunting-yard algorithm), and decimal precision formatting.",
            highlights: [
                "Custom infix to postfix expression parsing engine",
                "Error boundary handling for division by zero and invalid syntax",
                "Modular UI component separation for GUI expansion"
            ],
            code: `def evaluate_expression(expr):\n    tokens = tokenize(expr)\n    postfix = shunting_yard(tokens)\n    return compute_postfix(postfix)`
        },
        budget: {
            title: "Personal Budget Tracker",
            badge: "PYTHON DATA",
            url: "https://github.com/S1Prime/Personal-Budget-Tracker",
            arch: "Built with Python data persistence logic to record, filter, and summarize incoming cashflows, recurring expenses, and financial goals.",
            highlights: [
                "JSON / CSV data serialization for expense records",
                "Categorical expenditure breakdown analytics",
                "Budget threshold alert flags and cashflow forecasting"
            ],
            code: `class BudgetTracker:\n    def add_expense(self, category, amount):\n        self.records.append({'cat': category, 'amt': amount})\n        self.save_to_storage()`
        },
        quiz: {
            title: "Online Quiz Management System",
            badge: "JAVA ENTERPRISE",
            url: "https://online-quiz-cqaw.onrender.com",
            arch: "Full-stack enterprise application built using Java Servlets, JDBC persistence layer, and SQL schemas for online testing.",
            highlights: [
                "Servlet session state authentication and encrypted parameters",
                "JDBC connection pool architecture for high concurrency",
                "Automated statistics computation and candidate report generation"
            ],
            code: `Class.forName("com.mysql.cj.jdbc.Driver");\nConnection conn = DriverManager.getConnection(DB_URL, USER, PASS);\nPreparedStatement ps = conn.prepareStatement("SELECT * FROM exams WHERE id=?");`
        },
        hoteldbms: {
            title: "Hotel Management System DBMS",
            badge: "DBMS / SQL",
            url: "https://s1prime.github.io/Hotel-Management-System-DBMS/",
            arch: "Designed relational SQL database tables, foreign key constraints, primary key indexing, and transaction workflows for hotel management operations.",
            highlights: [
                "SQL table normalization (3NF) for room and guest records",
                "Automated bill generation and checkout transaction procedures",
                "Web frontend interface integrated with relational DBMS endpoints"
            ],
            code: `CREATE TABLE Rooms (room_id INT PRIMARY KEY, room_type VARCHAR(50), status VARCHAR(20));\nSELECT * FROM Bookings WHERE check_in_date <= CURRENT_DATE();`
        },
        taskmanager: {
            title: "Student Task Manager",
            badge: "WEB APPLICATION",
            url: "https://s1prime.github.io/Student-Task-Manager/",
            arch: "Academic workflow app built with Vanilla JavaScript, LocalStorage persistence, and CSS Glassmorphism to manage deadlines.",
            highlights: [
                "LocalStorage JSON state sync for offline access",
                "Urgent task priority sorting & deadline countdowns",
                "Responsive glassmorphic UI with zero framework overhead"
            ],
            code: `const tasks = JSON.parse(localStorage.getItem('student-tasks') || '[]');\ntasks.push({ title, deadline, priority });\nlocalStorage.setItem('student-tasks', JSON.stringify(tasks));`
        },
        webcalc: {
            title: "Modern Calculator Web Engine",
            badge: "FRONTEND ENGINE",
            url: "https://s1prime.github.io/Calculator-Using-Frontend/",
            arch: "Interactive web calculator featuring real-time expression evaluation, CSS variable dynamic theme switching, and keyboard event hooks.",
            highlights: [
                "Full keyboard event listener bindings (0-9, +, -, *, /, Enter)",
                "Local history persistence for previous calculations",
                "CSS Custom Properties theme engine"
            ],
            code: `window.addEventListener('keydown', (e) => {\n    if (e.key >= '0' && e.key <= '9') appendInput(e.key);\n    else if (e.key === 'Enter') calculateResult();\n});`
        },
        matlab: {
            title: "MATLAB Analytical Workspace",
            badge: "COMPUTATIONAL",
            url: "https://github.com/S1Prime/Matlab",
            arch: "Numerical mathematics workspace built in MATLAB executing linear algebra matrix operations, system solvers, and spatial 2D/3D plots.",
            highlights: [
                "Eigenvalue and eigenvector decomposition scripts",
                "Numerical matrix transformation and linear regression",
                "Automated 2D/3D surface vector visualization"
            ],
            code: `% MATLAB Matrix Transformation\nA = [2, 1; 1, 3];\n[V, D] = eig(A);\nplot(V(:,1), V(:,2), '-o');`
        }
    };

    const projectModal = document.getElementById("projectModal");
    const btnCloseModal = document.getElementById("btnCloseModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBadge = document.getElementById("modalBadge");
    const modalArchDesc = document.getElementById("modalArchDesc");
    const modalHighlights = document.getElementById("modalHighlights");
    const modalCodeSnippet = document.getElementById("modalCodeSnippet");
    const modalRepoLink = document.getElementById("modalRepoLink");
    const btnRunModalSim = document.getElementById("btnRunModalSim");
    const simTerminal = document.getElementById("simTerminal");

    let currentInspectedProject = "calculator";
    let isSimulating = false;

    const projectSimulations = {
        calculator: [
            { type: "info", text: "Initializing Expression Tokenizer & Shunting-Yard AST Parser..." },
            { type: "info", text: "Compiling math grammar: (144.5 * 3.14) + (2^8 - 18.25)" },
            { type: "perf", text: "Constructed Postfix Queue in 0.42ms. 0 syntax anomalies." },
            { type: "ok", text: "Evaluation Result: 691.480000 · Stack cleared cleanly." },
            { type: "done", text: "EXECUTION COMPLETE // Peak RSS: 14.2 MB · 100% PASS" }
        ],
        budget: [
            { type: "info", text: "Mounting Personal Budget Disk Serializer & Hash Store..." },
            { type: "info", text: "Parsing JSON transaction records (248 items processed)..." },
            { type: "perf", text: "Aggregated categorical breakdown & cashflow velocity in 1.8ms." },
            { type: "ok", text: "Net Balance: +₹48,250.00 · Budget adherence: 94.2%." },
            { type: "done", text: "EXECUTION COMPLETE // Encrypted I/O flush · 100% PASS" }
        ],
        quiz: [
            { type: "info", text: "Spinning up Tomcat JVM Servlet worker thread pool (128 threads)..." },
            { type: "info", text: "JDBC Pool acquired 16 persistent database sockets." },
            { type: "perf", text: "Executed 500 mock question queries in 8.6ms. 0 dropped packets." },
            { type: "ok", text: "Auto-graded 45 examinees · Candidate scores committed to DB." },
            { type: "done", text: "EXECUTION COMPLETE // JVM Heap: 42.0 MB · 100% PASS" }
        ],
        hoteldbms: [
            { type: "info", text: "Connecting to MySQL 8.0 InnoDB Storage Engine via JDBC..." },
            { type: "info", text: "Verifying 3NF foreign key constraints across Rooms & Bookings." },
            { type: "perf", text: "Optimized B-Tree clustered index scan executed in 3.4ms." },
            { type: "ok", text: "BEGIN TRANSACTION; INSERT Booking; UPDATE Rooms; COMMIT; -> OK." },
            { type: "done", text: "EXECUTION COMPLETE // ACID Serializable verified · 100% PASS" }
        ],
        taskmanager: [
            { type: "info", text: "Initializing V8 LocalStorage State Store & Priority Pipeline..." },
            { type: "info", text: "Fetched 36 academic assignments and exam countdowns." },
            { type: "perf", text: "O(N log N) urgency heuristic sort computed in 0.35ms." },
            { type: "ok", text: "Synchronized with LocalStorage event-driven observer." },
            { type: "done", text: "EXECUTION COMPLETE // 60 FPS locked · 1.8 MB Heap · 100% PASS" }
        ],
        webcalc: [
            { type: "info", text: "Binding Global Keyboard Listeners & CSS Theme Engine..." },
            { type: "info", text: "Captured input buffer: ['9', '*', '4', '+', '12']" },
            { type: "perf", text: "Instantaneous dispatch to V8 Math engine in 0.16ms." },
            { type: "ok", text: "History buffer appended with computed answer: 48." },
            { type: "done", text: "EXECUTION COMPLETE // Theme reactive: 0 latency · 100% PASS" }
        ],
        matlab: [
            { type: "info", text: "Allocating 1000x1000 double-precision matrix in MATLAB RAM..." },
            { type: "info", text: "Invoking BLAS / LAPACK QR decomposition library..." },
            { type: "perf", text: "Computed all eigenvalues and eigenvectors in 14.8ms." },
            { type: "ok", text: "Rendered 3D parametric eigen-space vector surface plot." },
            { type: "done", text: "EXECUTION COMPLETE // 64-bit IEEE 754 precision · 100% PASS" }
        ]
    };

    function resetSimulationTerminal() {
        if (!simTerminal) return;
        simTerminal.innerHTML = `<div class="sim-line sim-ready"><span class="sim-prompt">&gt;</span> Ready for execution. Click "Execute Simulation" to test node pipeline.</div>`;
        if (btnRunModalSim) {
            btnRunModalSim.disabled = false;
            btnRunModalSim.innerHTML = `<span class="pulse-radar-dot"></span> <span>▶ Execute Simulation</span>`;
        }
        isSimulating = false;
    }

    if (btnRunModalSim) {
        btnRunModalSim.addEventListener("click", () => {
            if (isSimulating || !simTerminal) return;
            isSimulating = true;
            btnRunModalSim.disabled = true;
            btnRunModalSim.innerHTML = `<span class="pulse-radar-dot"></span> <span>Running Pipeline...</span>`;

            simTerminal.innerHTML = "";
            const lines = projectSimulations[currentInspectedProject] || projectSimulations.calculator;

            lines.forEach((item, index) => {
                setTimeout(() => {
                    const now = new Date();
                    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900 + 100))}`;
                    const lineEl = document.createElement("div");
                    lineEl.className = "sim-line";
                    lineEl.innerHTML = `<span class="sim-prompt">&gt;</span> <span style="color: var(--dim); font-size: 0.74rem;">[${timeStr}]</span> <span class="sim-tag ${item.type}">[${item.type.toUpperCase()}]</span> <span>${item.text}</span>`;
                    simTerminal.appendChild(lineEl);
                    simTerminal.scrollTop = simTerminal.scrollHeight;

                    // Sci-fi audio blip per line
                    playAudioTone(440 + index * 90, 'sine', 0.05, 0.03);

                    if (index === lines.length - 1) {
                        isSimulating = false;
                        btnRunModalSim.disabled = false;
                        btnRunModalSim.innerHTML = `<span>✓ Pipeline Verified</span>`;
                        playAudioTone(880, 'triangle', 0.12, 0.06);
                        setTimeout(() => playAudioTone(1174.66, 'triangle', 0.18, 0.08), 90);
                    }
                }, index * 420);
            });
        });
    }

    function closeProjectModal() {
        if (!projectModal || !projectModal.classList.contains("active")) return;
        projectModal.classList.add("closing");
        playAudioTone(420, 'sine', 0.08, 0.04);
        setTimeout(() => playAudioTone(260, 'sine', 0.12, 0.03), 60);
        setTimeout(() => {
            projectModal.classList.remove("active");
            projectModal.classList.remove("closing");
        }, 320);
    }

    function openProjectModal(id) {
        const data = projectDetails[id];
        if (!data || !projectModal) return;

        currentInspectedProject = id;
        resetSimulationTerminal();

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalBadge) modalBadge.textContent = data.badge;
        if (modalArchDesc) modalArchDesc.textContent = data.arch;
        if (modalCodeSnippet) modalCodeSnippet.textContent = data.code;
        if (modalRepoLink && data.url) {
            modalRepoLink.href = data.url;
        }

        if (modalHighlights) {
            modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join("");
        }

        projectModal.classList.remove("closing");
        projectModal.classList.add("active");
        playAudioTone(520, 'triangle', 0.1, 0.05);
        setTimeout(() => playAudioTone(780, 'sine', 0.12, 0.05), 60);
        setTimeout(() => playAudioTone(1040, 'triangle', 0.14, 0.04), 120);
        unlockAchievement("inspector");
    }

    document.querySelectorAll(".btn-inspect-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const id = btn.getAttribute("data-inspect");
            openProjectModal(id);
        });
    });

    if (btnCloseModal && projectModal) {
        btnCloseModal.addEventListener("click", closeProjectModal);
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    /* =========================================================
       8B. HACKATHON CERTIFICATE LIGHTBOX MODAL
    ========================================================= */
    const certDetails = {
        adobe: {
            title: "Adobe University Hackathon 2026",
            badge: "ADOBE × UNSTOP",
            img: "cert-adobe-hackathon.png",
            download: "cert-adobe-hackathon.png",
            external: "https://unstop.com/certificate-preview/d5bc9ab8-6e46-455f-85d8-e611a830b107?utm_campaign=site-emails&utm_medium=d2c-automated&utm_source=wow-look-at-your-certificate-adobe-university-hackathon-2026",
            desc: "Round 1 Online Assessment (MCQ + Coding) · Verified on Unstop"
        },
        amrita: {
            title: "Amrita University Amritapuri Campus Hackathon",
            badge: "AMRITA UNIVERSITY",
            img: "cert-amrita-hackathon.png",
            download: "vaishnav-venu-amrita-university-amritapuri-campus-certificate (1).pdf",
            external: "vaishnav-venu-amrita-university-amritapuri-campus-certificate (1).pdf",
            desc: "Team 'ByteDex' · Endorsed by Nitrostack (CEO Abhishek Pandit) & Wekan (CEO Pablo Jiménez Godoy)"
        }
    };

    const certModal = document.getElementById("certModal");
    const btnCloseCertModal = document.getElementById("btnCloseCertModal");
    const certModalTitle = document.getElementById("certModalTitle");
    const certModalBadge = document.getElementById("certModalBadge");
    const certModalImage = document.getElementById("certModalImage");
    const certModalDesc = document.getElementById("certModalDesc");
    const certModalDownload = document.getElementById("certModalDownload");
    const certModalExternal = document.getElementById("certModalExternal");

    function closeCertModal() {
        if (!certModal || !certModal.classList.contains("active")) return;
        certModal.classList.add("closing");
        playAudioTone(400, 'sine', 0.08, 0.04);
        setTimeout(() => playAudioTone(240, 'sine', 0.12, 0.03), 60);
        setTimeout(() => {
            certModal.classList.remove("active");
            certModal.classList.remove("closing");
        }, 320);
    }

    function openCertModal(key) {
        const data = certDetails[key];
        if (!data || !certModal) return;

        if (certModalTitle) certModalTitle.textContent = data.title;
        if (certModalBadge) certModalBadge.textContent = data.badge;
        if (certModalImage) {
            certModalImage.src = data.img;
            certModalImage.alt = data.title;
        }
        if (certModalDesc) certModalDesc.textContent = data.desc;
        if (certModalDownload) certModalDownload.href = data.download;
        if (certModalExternal) certModalExternal.href = data.external;

        certModal.classList.remove("closing");
        certModal.classList.add("active");
        playAudioTone(580, 'triangle', 0.1, 0.05);
        setTimeout(() => playAudioTone(880, 'sine', 0.12, 0.05), 60);
        setTimeout(() => playAudioTone(1160, 'triangle', 0.14, 0.04), 120);
        unlockAchievement("hackathon");
        unlockAchievement("inspector");
    }

    document.querySelectorAll(".btn-cert-view").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const key = btn.getAttribute("data-cert");
            openCertModal(key);
        });
    });

    document.querySelectorAll(".cert-image-wrap").forEach(wrap => {
        wrap.addEventListener("click", () => {
            const card = wrap.closest(".cert-card");
            const key = card?.getAttribute("data-cert-id");
            if (key) openCertModal(key);
        });
    });

    if (btnCloseCertModal && certModal) {
        btnCloseCertModal.addEventListener("click", closeCertModal);
        certModal.addEventListener("click", (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }

    // Keyboard escape closes all modals with smooth exit animation
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeProjectModal();
            closeCertModal();
            closeAchievementsModal();
        }
    });

    /* =========================================================
       9. SCROLL REVEAL & NAVIGATION TRACKING
    ========================================================= */
    const navLinks = document.querySelectorAll("#navLinks a");
    const sections = document.querySelectorAll("section[id]");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinksContainer = document.getElementById("navLinks");

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle("show", scrollY > 450);
        }

        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId === "education" || currentSectionId === "sandbox" || currentSectionId === "projects" || currentSectionId === "certifications") {
            unlockAchievement("explorer");
        }

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
       10. SCROLL REVEAL & STATS COUNTER ANIMATION
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
       11. PROJECT FILTERING SYSTEM & TECH HUD TRIGGERS
    ========================================================= */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const btnDiagnosticScan = document.getElementById("btnDiagnosticScan");
    const scanStatusBanner = document.getElementById("scanStatusBanner");
    const scanSubText = document.getElementById("scanSubText");
    const scanMetrics = document.getElementById("scanMetrics");
    const btnHudToggle = document.getElementById("btnHudToggle");
    let hudModeActive = false;

    // Filter Repositories
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

    // In-card Individual Telemetry Drawer Toggle
    document.querySelectorAll(".btn-tech-spec-toggle").forEach((toggleBtn) => {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const card = toggleBtn.closest(".project-card");
            if (!card) return;
            const drawer = card.querySelector(".card-telemetry-drawer");
            if (!drawer) return;

            const isOpen = drawer.classList.contains("open");
            drawer.classList.toggle("open", !isOpen);
            toggleBtn.textContent = !isOpen ? "⚡ Hide Specs" : "⚡ Specs";
            toggleBtn.style.background = !isOpen ? "var(--accent)" : "";
            toggleBtn.style.color = !isOpen ? "#001017" : "";
            playAudioTone(!isOpen ? 780 : 520, 'triangle', 0.08, 0.04);
        });
    });

    // In-card Individual Hackathon Telemetry Drawer Toggle
    document.querySelectorAll(".btn-cert-spec-toggle").forEach((toggleBtn) => {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const card = toggleBtn.closest(".cert-card");
            if (!card) return;
            const drawer = card.querySelector(".cert-telemetry-drawer");
            if (!drawer) return;

            const isOpen = drawer.classList.contains("open");
            drawer.classList.toggle("open", !isOpen);
            toggleBtn.innerHTML = !isOpen ? `<span>⚡ Collapse</span>` : `<span>⚡ Breakdown</span>`;
            toggleBtn.style.background = !isOpen ? "var(--accent)" : "";
            toggleBtn.style.color = !isOpen ? "#001017" : "";
            playAudioTone(!isOpen ? 740 : 490, 'triangle', 0.08, 0.04);
            if (!isOpen) unlockAchievement("hackathon");
        });
    });

    // HUD Telemetry Matrix View (Toggle All Drawers Simultaneously)
    if (btnHudToggle) {
        btnHudToggle.addEventListener("click", () => {
            hudModeActive = !hudModeActive;
            btnHudToggle.classList.toggle("active", hudModeActive);
            btnHudToggle.innerHTML = hudModeActive 
                ? `<span>🔬 Overview Mode</span>` 
                : `<span>🔬 Telemetry Matrix</span>`;

            document.querySelectorAll(".card-telemetry-drawer").forEach((drawer) => {
                drawer.classList.toggle("open", hudModeActive);
            });

            document.querySelectorAll(".btn-tech-spec-toggle").forEach((toggleBtn) => {
                toggleBtn.textContent = hudModeActive ? "⚡ Hide Specs" : "⚡ Specs";
                toggleBtn.style.background = hudModeActive ? "var(--accent)" : "";
                toggleBtn.style.color = hudModeActive ? "#001017" : "";
            });

            playAudioTone(hudModeActive ? 840 : 480, 'sine', 0.1, 0.05);
        });
    }

    // Diagnostic Holographic Scan Trigger
    let isScanning = false;
    if (btnDiagnosticScan) {
        btnDiagnosticScan.addEventListener("click", () => {
            if (isScanning) return;
            isScanning = true;
            btnDiagnosticScan.disabled = true;

            if (scanStatusBanner) {
                scanStatusBanner.classList.add("active");
                if (scanSubText) scanSubText.textContent = "Probing node integrity & algorithmic latency across all 7 repositories...";
                if (scanMetrics) scanMetrics.textContent = "0/7 NODES";
            }

            // Radar sweep tone sequence
            playAudioTone(380, 'sine', 0.2, 0.06);
            setTimeout(() => playAudioTone(520, 'triangle', 0.2, 0.07), 100);
            setTimeout(() => playAudioTone(740, 'sine', 0.2, 0.08), 200);

            const visibleCards = Array.from(projectCards).filter(c => !c.classList.contains("hide"));
            let completed = 0;

            visibleCards.forEach((card, idx) => {
                setTimeout(() => {
                    card.classList.add("scanning-active");
                    playAudioTone(520 + idx * 75, 'triangle', 0.08, 0.04);

                    setTimeout(() => {
                        card.classList.remove("scanning-active");
                        completed++;
                        if (scanMetrics) scanMetrics.textContent = `${completed}/${visibleCards.length} NODES`;

                        if (completed === visibleCards.length) {
                            if (scanSubText) {
                                scanSubText.innerHTML = `<span style="color: var(--success); font-weight: 700;">✓ SCAN COMPLETE: 7 of 7 Repositories Online · 0 Latency Anomalies · Memory Health 100%</span>`;
                            }
                            if (scanMetrics) {
                                scanMetrics.textContent = "VERIFIED 100%";
                            }
                            playAchievementSound();
                            btnDiagnosticScan.disabled = false;
                            isScanning = false;

                            setTimeout(() => {
                                if (scanStatusBanner) scanStatusBanner.classList.remove("active");
                            }, 5500);
                        }
                    }, 500);
                }, idx * 240);
            });
        });
    }

    /* =========================================================
       12. 3D CARD TILT WITH HOLOGRAPHIC SPECULAR TRACKING
    ========================================================= */
    projectCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 900) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            card.style.setProperty("--mouse-x", `${pctX}%`);
            card.style.setProperty("--mouse-y", `${pctY}%`);

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* =========================================================
       13. THEME SWITCHING SYSTEM
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

        unlockAchievement("theme");
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

    const savedTheme = localStorage.getItem("portfolio-theme") || "arc";
    applyTheme(savedTheme);

    /* =========================================================
       14. CONTACT FORM VALIDATION & INTERACTIVE STATUS
    ========================================================= */
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const formSubmitBtn = document.getElementById("formSubmitBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("formName").value.trim();
            const email = document.getElementById("formEmail").value.trim();
            const subject = document.getElementById("formSubject")?.value.trim() || "Project Inquiry";
            const message = document.getElementById("formMessage").value.trim();

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.innerHTML = `<span style="color: var(--error);">Please complete all required fields.</span>`;
                }
                return;
            }

            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `<span>Opening Mail Client...</span>`;
            }

            if (formStatus) {
                formStatus.innerHTML = `<span style="color: var(--accent);">Routing to vaishnavvenu2007@gmail.com...</span>`;
            }

            // Construct mailto link with encoded parameters
            const mailtoUrl = `mailto:vaishnavvenu2007@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Vaishnav Venu Engineering Portfolio`)}`;

            setTimeout(() => {
                // Open default email client
                window.location.href = mailtoUrl;

                if (formStatus) {
                    formStatus.innerHTML = `<span style="color: var(--success);">✓ Opened email draft to <strong>vaishnavvenu2007@gmail.com</strong>! Click Send in your mail app.</span>`;
                }

                playAchievementSound();
                contactForm.reset();

                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `<span>Send via Email Client</span> <span>✉</span>`;
                }

                setTimeout(() => {
                    if (formStatus) formStatus.innerHTML = "";
                }, 8000);
            }, 600);
        });
    }

    // Direct Email Address Clipboard Copy Button
    const btnCopyEmail = document.getElementById("btnCopyEmail");
    const copyEmailText = document.getElementById("copyEmailText");
    const copyEmailIcon = document.getElementById("copyEmailIcon");

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const emailAddr = "vaishnavvenu2007@gmail.com";
            navigator.clipboard.writeText(emailAddr).then(() => {
                if (copyEmailText) copyEmailText.textContent = "Copied!";
                if (copyEmailIcon) copyEmailIcon.textContent = "✓";
                btnCopyEmail.style.background = "var(--success)";
                btnCopyEmail.style.color = "#001017";
                btnCopyEmail.style.borderColor = "var(--success)";
                showToast("Email Copied", `${emailAddr} copied to clipboard!`);
                playAudioTone(880, 'triangle', 0.1, 0.05);

                setTimeout(() => {
                    if (copyEmailText) copyEmailText.textContent = "Copy";
                    if (copyEmailIcon) copyEmailIcon.textContent = "📋";
                    btnCopyEmail.style.background = "";
                    btnCopyEmail.style.color = "";
                    btnCopyEmail.style.borderColor = "";
                }, 2500);
            }).catch(() => {
                window.location.href = `mailto:${emailAddr}`;
            });
        });
    }

    /* =========================================================
       15. DYNAMIC YEAR
    ========================================================= */
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
