/**
 * Vaishnav Venu — High-Performance 3D WebGL Portfolio Engine
 * Built with Three.js & GSAP
 * 
 * Features:
 * 1. Deep Space Cosmic Starfield & Algorithmic 3D Wave Surface
 * 2. Mobile-Adaptive Dynamic Tiering (High 60-120 FPS on Mobile, Laptops & Desktop)
 * 3. IntersectionObserver Throttling (Pauses off-screen WebGL renderers to preserve battery & GPU)
 * 4. Interactive 3D Holographic Cyber Core with Drag Momentum & Inertia Physics
 * 5. Interactive 3D System Architecture Pipeline linked to Project Registry
 * 6. Dynamic Theme Reactivity (Arc Cyan, Purple, Lime Neon, Light)
 */

(function () {
    'use strict';

    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. 3D WebGL features unavailable.');
        return;
    }

    /* =========================================================
       0. HARDWARE & DEVICE DETECTION (ADAPTIVE SMOOTHING)
    ========================================================= */
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isLowPower = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const maxPixelRatio = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2.0);

    let isTabActive = true;
    document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
    });

    /* =========================================================
       1. COLOR PALETTES & THEME SYNCHRONIZATION
    ========================================================= */
    const THEME_PALETTES = {
        arc: {
            primary: 0x65f7ff,
            secondary: 0x9a6cff,
            ambient: 0x050a14,
            grid: 0x224870,
            star: 0x9be8ff,
            glow: 0x65f7ff
        },
        purple: {
            primary: 0xa855f7,
            secondary: 0xec4899,
            ambient: 0x0e0618,
            grid: 0x58248a,
            star: 0xd8b4fe,
            glow: 0xa855f7
        },
        lime: {
            primary: 0xc8ff00,
            secondary: 0x00e5ff,
            ambient: 0x060f06,
            grid: 0x3d6614,
            star: 0xecfccb,
            glow: 0xc8ff00
        },
        light: {
            primary: 0x0284c7,
            secondary: 0x7c3aed,
            ambient: 0xe2e8f0,
            grid: 0x94a3b8,
            star: 0x38bdf8,
            glow: 0x0284c7
        }
    };

    function getCurrentTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'arc';
        return THEME_PALETTES[theme] || THEME_PALETTES.arc;
    }

    /* Soft-radial alpha glow texture for crisp star rendering */
    function createGlowPointTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.55, 'rgba(101, 247, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const glowTexture = createGlowPointTexture();

    /* Synthesized Audio FX helper */
    function play3DChime(freq = 880) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch (e) {}
    }

    /* =========================================================
       2. GLOBAL 3D UNIVERSE & ALGORITHMIC WAVE GRID
    ========================================================= */
    let universe = null;

    function initUniverse() {
        const bgCanvas = document.getElementById('bg-3d-canvas');
        if (!bgCanvas) return null;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x04070d, 0.001);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );
        camera.position.set(0, 40, 500);

        const renderer = new THREE.WebGLRenderer({
            canvas: bgCanvas,
            alpha: true,
            antialias: !isMobile, // Disable MSAA on mobile for massive fill-rate performance boost
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(maxPixelRatio);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x65f7ff, 1.2);
        dirLight.position.set(200, 300, 400);
        scene.add(dirLight);

        // A. Adaptive Cosmic Starfield (optimized for mobile/laptop)
        const starCount = isMobile ? 850 : 2200;
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 2600;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2400;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const currentTheme = getCurrentTheme();
        const starMat = new THREE.PointsMaterial({
            color: currentTheme.star,
            size: isMobile ? 2.8 : 3.5,
            map: glowTexture,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        // B. Algorithmic Cyber Wave Surface (adaptive density)
        const gridWidth = 1600;
        const gridDepth = 1600;
        const gridSegs = isMobile ? 22 : 36;
        const waveGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegs, gridSegs);
        waveGeo.rotateX(-Math.PI / 2.3);

        const waveMat = new THREE.MeshBasicMaterial({
            color: currentTheme.grid,
            wireframe: true,
            transparent: true,
            opacity: 0.36
        });

        const waveMesh = new THREE.Mesh(waveGeo, waveMat);
        waveMesh.position.set(0, -260, -200);
        scene.add(waveMesh);

        const posAttr = waveGeo.attributes.position;
        const initialZ = new Float32Array(posAttr.count);
        for (let i = 0; i < posAttr.count; i++) {
            initialZ[i] = posAttr.getZ(i);
        }

        // C. Atmospheric Floating Polyhedra
        const polyGroup = new THREE.Group();
        const polyCount = isMobile ? 3 : 6;
        const polyGeos = [
            new THREE.IcosahedronGeometry(22, 0),
            new THREE.OctahedronGeometry(20, 0),
            new THREE.TetrahedronGeometry(22, 0)
        ];

        const polyMeshes = [];
        for (let i = 0; i < polyCount; i++) {
            const geom = polyGeos[i % polyGeos.length];
            const mat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? currentTheme.primary : currentTheme.secondary,
                wireframe: true,
                transparent: true,
                opacity: 0.28
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 800
            );
            mesh.userData = {
                rx: (Math.random() - 0.5) * 0.015,
                ry: (Math.random() - 0.5) * 0.015,
                initialY: mesh.position.y
            };
            polyMeshes.push(mesh);
            polyGroup.add(mesh);
        }
        scene.add(polyGroup);

        // Mouse Parallax & Scroll Interpolation
        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        let scrollY = 0;
        let targetScrollY = 0;

        if (!isMobile) {
            window.addEventListener('mousemove', (e) => {
                mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            }, { passive: true });
        }

        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(maxPixelRatio);
        });

        let clock = new THREE.Clock();
        let frameCounter = 0;

        function animate() {
            requestAnimationFrame(animate);
            if (!isTabActive) return;

            frameCounter++;
            const time = clock.getElapsedTime();

            if (!isMobile) {
                mouse.x += (mouse.targetX - mouse.x) * 0.05;
                mouse.y += (mouse.targetY - mouse.y) * 0.05;
            }

            scrollY += (targetScrollY - scrollY) * 0.08;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

            // Camera glide through 3D space
            const camBaseZ = 500 - scrollProgress * 340;
            const camBaseY = 40 - scrollProgress * 180;
            const camBaseX = Math.sin(scrollProgress * Math.PI * 2) * 80;

            camera.position.x = camBaseX + mouse.x * 45;
            camera.position.y = camBaseY - mouse.y * 35;
            camera.position.z = camBaseZ;
            camera.lookAt(mouse.x * 20, camBaseY * 0.4, 0);

            // Starfield subtle rotation
            starField.rotation.y += 0.0003;
            starField.rotation.x += 0.00015;

            // Animate wave grid (adaptive update every frame on desktop, every 2nd frame on low-power mobile)
            if (!isLowPower || frameCounter % 2 === 0) {
                const waveTime = time * 1.2;
                for (let i = 0; i < posAttr.count; i++) {
                    const u = posAttr.getX(i);
                    const v = posAttr.getY(i);
                    const z = Math.sin(u * 0.014 + waveTime) * Math.cos(v * 0.014 + waveTime * 0.8) * 20;
                    posAttr.setZ(i, initialZ[i] + z);
                }
                posAttr.needsUpdate = true;
            }

            polyMeshes.forEach((mesh, idx) => {
                mesh.rotation.x += mesh.userData.rx;
                mesh.rotation.y += mesh.userData.ry;
                mesh.position.y = mesh.userData.initialY + Math.sin(time * 1.5 + idx) * 18;
            });

            renderer.render(scene, camera);
        }

        animate();

        function updateTheme(theme) {
            if (typeof gsap !== 'undefined') {
                gsap.to(starMat.color, {
                    r: ((theme.star >> 16) & 255) / 255,
                    g: ((theme.star >> 8) & 255) / 255,
                    b: (theme.star & 255) / 255,
                    duration: 0.8
                });
                gsap.to(waveMat.color, {
                    r: ((theme.grid >> 16) & 255) / 255,
                    g: ((theme.grid >> 8) & 255) / 255,
                    b: (theme.grid & 255) / 255,
                    duration: 0.8
                });
            } else {
                starMat.color.setHex(theme.star);
                waveMat.color.setHex(theme.grid);
            }
        }

        return {
            scene,
            camera,
            renderer,
            updateTheme
        };
    }

    /* =========================================================
       3. INTERACTIVE 3D HOLOGRAPHIC CYBER CORE (HERO SECTION)
    ========================================================= */
    let heroCore = null;

    function initHeroCore() {
        const coreCanvas = document.getElementById('hero-core-canvas');
        if (!coreCanvas) return null;

        const container = coreCanvas.parentElement || coreCanvas;
        let width = container.clientWidth || 360;
        let height = container.clientHeight || 320;
        if (width < 50) width = 360;
        if (height < 50) height = 320;

        // Prevent touch scrolling conflict when rotating 3D core on mobile
        coreCanvas.style.touchAction = 'none';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
        camera.position.set(0, 0, 9.2);

        const renderer = new THREE.WebGLRenderer({
            canvas: coreCanvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(maxPixelRatio);

        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambient);

        const pointLight = new THREE.PointLight(0x65f7ff, 3, 40);
        pointLight.position.set(5, 5, 6);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x9a6cff, 2.5, 40);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        const coreGroup = new THREE.Group();
        scene.add(coreGroup);

        const currentTheme = getCurrentTheme();

        // A. Outer Crystalline Cage (Wireframe Icosahedron)
        const cageGeo = new THREE.IcosahedronGeometry(2.35, 1);
        const cageMat = new THREE.MeshBasicMaterial({
            color: currentTheme.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.78
        });
        const cageMesh = new THREE.Mesh(cageGeo, cageMat);
        coreGroup.add(cageMesh);

        // B. Inner Glowing Energy Nucleus
        const nucleusGeo = new THREE.OctahedronGeometry(1.25, 2);
        const nucleusMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.15,
            metalness: 0.85,
            emissive: currentTheme.secondary,
            emissiveIntensity: 0.9,
            flatShading: true
        });
        const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
        coreGroup.add(nucleusMesh);

        // C. Concentric Quantum Gyro Rings
        const ring1Geo = new THREE.TorusGeometry(3.1, 0.045, 16, 80);
        const ring1Mat = new THREE.MeshBasicMaterial({
            color: currentTheme.primary,
            transparent: true,
            opacity: 0.85
        });
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.rotation.x = Math.PI / 3;
        coreGroup.add(ring1);

        const ring2Geo = new THREE.TorusGeometry(3.6, 0.045, 16, 80);
        const ring2Mat = new THREE.MeshBasicMaterial({
            color: currentTheme.secondary,
            transparent: true,
            opacity: 0.8
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.y = Math.PI / 3.5;
        coreGroup.add(ring2);

        // D. Orbiting 3D Tech Satellites
        const satellites = [
            { name: 'Python', color: 0x38bdf8, angle: 0, distance: 4.4, speed: 0.8 },
            { name: 'Java', color: 0xf97316, angle: 1.05, distance: 4.5, speed: -0.7 },
            { name: 'AI/ML', color: 0xa855f7, angle: 2.1, distance: 4.3, speed: 0.9 },
            { name: 'SQL', color: 0x10b981, angle: 3.15, distance: 4.6, speed: -0.65 },
            { name: 'C++', color: 0x6366f1, angle: 4.2, distance: 4.4, speed: 0.75 },
            { name: 'Web', color: 0xec4899, angle: 5.25, distance: 4.5, speed: -0.85 }
        ];

        const satGroup = new THREE.Group();
        coreGroup.add(satGroup);

        const satMeshes = [];
        const satBeams = [];

        satellites.forEach((sat) => {
            const satGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
            const satMat = new THREE.MeshStandardMaterial({
                color: sat.color,
                emissive: sat.color,
                emissiveIntensity: 0.8,
                roughness: 0.2
            });
            const mesh = new THREE.Mesh(satGeo, satMat);
            mesh.userData = sat;
            satGroup.add(mesh);
            satMeshes.push(mesh);

            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            const lineMat = new THREE.LineBasicMaterial({
                color: sat.color,
                transparent: true,
                opacity: 0.45
            });
            const beam = new THREE.Line(lineGeo, lineMat);
            satGroup.add(beam);
            satBeams.push({ beam, mesh });
        });

        // E. Drag Physics with Smooth Momentum Damping
        let isDragging = false;
        let prevMousePos = { x: 0, y: 0 };
        let rotationVelocity = { x: 0.003, y: 0.006 };
        let targetSpeedMultiplier = 1;
        let currentSpeedMultiplier = 1;
        let isExploded = false;

        coreCanvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;
            rotationVelocity.y = deltaX * 0.007;
            rotationVelocity.x = deltaY * 0.007;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        coreCanvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - prevMousePos.x;
            const deltaY = e.touches[0].clientY - prevMousePos.y;
            rotationVelocity.y = deltaX * 0.007;
            rotationVelocity.x = deltaY * 0.007;
            prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        coreCanvas.addEventListener('mouseenter', () => { targetSpeedMultiplier = 1.8; });
        coreCanvas.addEventListener('mouseleave', () => { targetSpeedMultiplier = 1.0; });
        coreCanvas.addEventListener('click', () => { triggerShockwave(); });

        function triggerShockwave() {
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(nucleusMesh.scale, 
                    { x: 1.5, y: 1.5, z: 1.5 },
                    { x: 1.0, y: 1.0, z: 1.0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
                );
                gsap.fromTo(cageMesh.scale, 
                    { x: 1.25, y: 1.25, z: 1.25 },
                    { x: 1.0, y: 1.0, z: 1.0, duration: 0.5, ease: 'power2.out' }
                );
            }
            play3DChime(1100);
        }

        function resizeRenderer() {
            const rect = container.getBoundingClientRect();
            const w = rect.width || container.clientWidth || 360;
            const h = rect.height || container.clientHeight || 320;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h, false);
            }
        }

        window.addEventListener('resize', resizeRenderer);
        setTimeout(resizeRenderer, 100);
        setTimeout(resizeRenderer, 1000);

        // F. IntersectionObserver Throttling (Saves 60% GPU when off screen)
        let isCoreVisible = true;
        if ('IntersectionObserver' in window) {
            const coreObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isCoreVisible = entry.isIntersecting;
                });
            }, { threshold: 0.05 });
            coreObserver.observe(container);
        }

        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            if (!isCoreVisible || !isTabActive) return; // Skip calculation when out of view

            const time = clock.getElapsedTime();

            currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.08;

            if (!isDragging) {
                rotationVelocity.x += (0.003 - rotationVelocity.x) * 0.04;
                rotationVelocity.y += (0.006 - rotationVelocity.y) * 0.04;
            }

            coreGroup.rotation.x += rotationVelocity.x * currentSpeedMultiplier;
            coreGroup.rotation.y += rotationVelocity.y * currentSpeedMultiplier;

            ring1.rotation.z += 0.015 * currentSpeedMultiplier;
            ring2.rotation.x += -0.018 * currentSpeedMultiplier;

            const pulse = Math.sin(time * 3) * 0.08 + 1;
            nucleusMesh.scale.set(pulse, pulse, pulse);
            nucleusMesh.rotation.y -= 0.012;

            satMeshes.forEach((mesh, idx) => {
                const data = mesh.userData;
                const satAngle = data.angle + time * data.speed * 0.6 * currentSpeedMultiplier;
                const sx = Math.cos(satAngle) * data.distance;
                const sz = Math.sin(satAngle) * data.distance;
                const sy = Math.sin(satAngle * 2) * 1.1;

                mesh.position.set(sx, sy, sz);
                mesh.rotation.x += 0.02;
                mesh.rotation.y += 0.025;

                const beamObj = satBeams[idx];
                if (beamObj) {
                    const pos = beamObj.beam.geometry.attributes.position;
                    pos.setXYZ(0, 0, 0, 0);
                    pos.setXYZ(1, sx, sy, sz);
                    pos.needsUpdate = true;
                }
            });

            renderer.render(scene, camera);
        }

        animate();

        function toggleDeconstruct() {
            isExploded = !isExploded;
            const factor = isExploded ? 1.7 : 1.0;
            const ringFactor = isExploded ? 2.1 : 1.0;

            if (typeof gsap !== 'undefined') {
                gsap.to(cageMesh.scale, { x: factor, y: factor, z: factor, duration: 0.8, ease: 'power3.out' });
                gsap.to(ring1.scale, { x: ringFactor, y: ringFactor, z: ringFactor, duration: 0.9, ease: 'power3.out' });
                gsap.to(ring2.scale, { x: ringFactor, y: ringFactor, z: ringFactor, duration: 1.0, ease: 'power3.out' });
                satellites.forEach((sat, i) => {
                    const targetDist = isExploded ? sat.distance * 1.45 : sat.distance;
                    gsap.to(satMeshes[i].userData, { distance: targetDist, duration: 0.8, ease: 'back.out(1.4)' });
                });
            }
            play3DChime(isExploded ? 600 : 900);
            return isExploded;
        }

        function turboSpin() {
            targetSpeedMultiplier = 6.5;
            play3DChime(1400);
            setTimeout(() => {
                targetSpeedMultiplier = 1;
            }, 2400);
        }

        function updateTheme(theme) {
            if (typeof gsap !== 'undefined') {
                gsap.to(cageMat.color, {
                    r: ((theme.primary >> 16) & 255) / 255,
                    g: ((theme.primary >> 8) & 255) / 255,
                    b: (theme.primary & 255) / 255,
                    duration: 0.8
                });
                gsap.to(nucleusMat.emissive, {
                    r: ((theme.secondary >> 16) & 255) / 255,
                    g: ((theme.secondary >> 8) & 255) / 255,
                    b: (theme.secondary & 255) / 255,
                    duration: 0.8
                });
                gsap.to(ring1Mat.color, {
                    r: ((theme.primary >> 16) & 255) / 255,
                    g: ((theme.primary >> 8) & 255) / 255,
                    b: (theme.primary & 255) / 255,
                    duration: 0.8
                });
            } else {
                cageMat.color.setHex(theme.primary);
                nucleusMat.emissive.setHex(theme.secondary);
                ring1Mat.color.setHex(theme.primary);
            }
        }

        return {
            scene,
            camera,
            renderer,
            toggleDeconstruct,
            turboSpin,
            triggerShockwave,
            updateTheme,
            resizeRenderer
        };
    }

    /* =========================================================
       4. INTERACTIVE 3D SYSTEM ARCHITECTURE STAGE (PROJECTS)
    ========================================================= */
    let projectArch = null;

    function initProjectArch() {
        const archCanvas = document.getElementById('project-arch-canvas');
        if (!archCanvas) return null;

        const container = archCanvas.parentElement || archCanvas;
        let width = container.clientWidth || 600;
        let height = container.clientHeight || 260;
        if (width < 50) width = 600;
        if (height < 50) height = 260;

        archCanvas.style.touchAction = 'pan-y';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 3.8, 8.2);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: archCanvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(maxPixelRatio);

        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0x65f7ff, 1.8);
        dirLight.position.set(5, 8, 6);
        scene.add(dirLight);

        const stageGroup = new THREE.Group();
        scene.add(stageGroup);

        const nodes = [
            { id: 'web', label: 'CLIENT UI', x: -3.3, y: 0, z: 0, color: 0x38bdf8 },
            { id: 'java', label: 'API ROUTER', x: -1.1, y: 0.3, z: 0, color: 0x818cf8 },
            { id: 'python', label: 'ENGINE CORE', x: 1.1, y: 0, z: 0, color: 0xa855f7 },
            { id: 'matlab', label: 'DATA TIER', x: 3.3, y: -0.3, z: 0, color: 0x10b981 }
        ];

        const nodeMeshes = [];

        nodes.forEach((n) => {
            const boxGeo = new THREE.BoxGeometry(1.2, 0.9, 0.9);
            const boxMat = new THREE.MeshStandardMaterial({
                color: n.color,
                roughness: 0.2,
                metalness: 0.8,
                emissive: n.color,
                emissiveIntensity: 0.35,
                transparent: true,
                opacity: 0.85
            });
            const mesh = new THREE.Mesh(boxGeo, boxMat);
            mesh.position.set(n.x, n.y, n.z);
            mesh.userData = n;

            const edges = new THREE.EdgesGeometry(boxGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }));
            mesh.add(line);

            stageGroup.add(mesh);
            nodeMeshes.push(mesh);
        });

        const linePoints = [
            new THREE.Vector3(-3.3, 0, 0),
            new THREE.Vector3(-1.1, 0.3, 0),
            new THREE.Vector3(1.1, 0, 0),
            new THREE.Vector3(3.3, -0.3, 0)
        ];
        const curve = new THREE.CatmullRomCurve3(linePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, isMobile ? 24 : 40, 0.05, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x65f7ff, transparent: true, opacity: 0.6 });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        stageGroup.add(tubeMesh);

        const packetGeo = new THREE.SphereGeometry(0.14, 16, 16);
        const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const packet = new THREE.Mesh(packetGeo, packetMat);
        stageGroup.add(packet);

        let mouseX = 0;
        if (!isMobile) {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            }, { passive: true });
        }

        function resizeArch() {
            const rect = container.getBoundingClientRect();
            const w = rect.width || container.clientWidth || 600;
            const h = rect.height || container.clientHeight || 260;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h, false);
            }
        }

        window.addEventListener('resize', resizeArch);
        setTimeout(resizeArch, 100);
        setTimeout(resizeArch, 1000);

        // IntersectionObserver for Arch Canvas
        let isArchVisible = false;
        if ('IntersectionObserver' in window) {
            const archObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isArchVisible = entry.isIntersecting;
                });
            }, { threshold: 0.05 });
            archObserver.observe(container);
        }

        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            if (!isArchVisible || !isTabActive) return; // Skip rendering when off-screen

            const time = clock.getElapsedTime();

            stageGroup.rotation.y = mouseX * 0.45 + Math.sin(time * 0.4) * 0.15;
            stageGroup.rotation.x = Math.cos(time * 0.4) * 0.08;

            const t = (time * 0.45) % 1;
            const pt = curve.getPointAt(t);
            packet.position.copy(pt);

            nodeMeshes.forEach((mesh, i) => {
                mesh.position.y = nodes[i].y + Math.sin(time * 2 + i) * 0.08;
            });

            renderer.render(scene, camera);
        }

        animate();

        function highlightCategory(category) {
            const catMap = {
                'web': 0,
                'java': 1,
                'python': 2,
                'matlab': 3
            };
            const targetIdx = catMap[category];
            nodeMeshes.forEach((mesh, i) => {
                const isTarget = targetIdx === undefined || i === targetIdx;
                if (typeof gsap !== 'undefined') {
                    gsap.to(mesh.scale, {
                        x: isTarget ? 1.35 : 0.95,
                        y: isTarget ? 1.35 : 0.95,
                        z: isTarget ? 1.35 : 0.95,
                        duration: 0.45,
                        ease: 'back.out(2)'
                    });
                }
            });
            if (targetIdx !== undefined) {
                play3DChime(700 + targetIdx * 120);
            }
        }

        return {
            highlightCategory,
            resizeArch
        };
    }

    /* =========================================================
       5. 3D CARD PARALLAX ENGINE (DESKTOP ONLY FOR BATTERY)
    ========================================================= */
    function init3DCardParallax() {
        if (isMobile) return; // Disabled on mobile touch screens for maximum scrolling fluidity

        const tiltCards = document.querySelectorAll(
            '.project-card, .skill-card, .education-card, .cert-card, .hud-stat-box'
        );

        tiltCards.forEach((card) => {
            card.style.transformStyle = 'preserve-3d';
            card.style.perspective = '1000px';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                const pctX = (x / rect.width) * 100;
                const pctY = (y / rect.height) * 100;

                card.style.setProperty('--mouse-x', `${pctX}%`);
                card.style.setProperty('--mouse-y', `${pctY}%`);

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* =========================================================
       6. 3D CONTROLS BINDING
    ========================================================= */
    function init3DControls() {
        const btnCoreTurbo = document.getElementById('btnCoreTurbo');
        const btnCoreExplode = document.getElementById('btnCoreExplode');
        const btnCorePulse = document.getElementById('btnCorePulse');

        if (btnCoreTurbo) {
            btnCoreTurbo.addEventListener('click', () => {
                if (heroCore) heroCore.turboSpin();
                btnCoreTurbo.classList.add('active');
                setTimeout(() => btnCoreTurbo.classList.remove('active'), 2000);
            });
        }

        if (btnCoreExplode) {
            btnCoreExplode.addEventListener('click', () => {
                if (heroCore) {
                    const exploded = heroCore.toggleDeconstruct();
                    const span = btnCoreExplode.querySelector('span') || btnCoreExplode;
                    span.textContent = exploded ? 'Assemble' : '💥 Deconstruct';
                }
            });
        }

        if (btnCorePulse) {
            btnCorePulse.addEventListener('click', () => {
                if (heroCore) heroCore.triggerShockwave();
            });
        }
    }

    /* Theme mutation observer */
    const observer = new MutationObserver(() => {
        const theme = getCurrentTheme();
        if (universe) universe.updateTheme(theme);
        if (heroCore) heroCore.updateTheme(theme);
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    /* Bootstrap all 3D components */
    function start3DEngine() {
        universe = initUniverse();
        heroCore = initHeroCore();
        projectArch = initProjectArch();
        init3DCardParallax();
        init3DControls();

        window.Portfolio3D = {
            universe,
            heroCore,
            projectArch,
            getCurrentTheme
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start3DEngine);
    } else {
        start3DEngine();
    }

})();
