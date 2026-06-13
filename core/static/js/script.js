/* ═══════════════════════════════════════════════════
   THE CINEMATIC ACADEMY — Motion.dev Version
   ═══════════════════════════════════════════════════ */

const { animate, scroll, inView, stagger } = Motion;

/* Custom easing approximating GSAP "cinematic" */
const EASE_CINEMATIC = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const show = params.get('show');
    if (show === 'login') openCheckout('Academy Membership', 199);
    if (show === 'payment') openCheckout('Academy Membership', 199);
  });
/* ══════════════════════════════════
   1. PRELOADER
══════════════════════════════════ */

(function initPreloader() {
  const canvas = document.getElementById('preloaderCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const fill = document.getElementById('progressFill');
  const numEl = document.getElementById('progressNum');
  let progress = 0;
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  function drawPreloaderBG() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.7
    );
    grad.addColorStop(0, 'rgba(108,63,255,0.06)');
    grad.addColorStop(1, 'rgba(9,9,15,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animFrame = requestAnimationFrame(drawPreloaderBG);
  }
  drawPreloaderBG();

  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(completePreloader, 400);
    }
    fill.style.width = progress + '%';
    numEl.textContent = Math.floor(progress);
  }, 60);

  function completePreloader() {
    cancelAnimationFrame(animFrame);
    const pre = document.getElementById('preloader');
    animate(pre, { opacity: 0 }, {
      duration: 0.8, easing: 'ease-in-out',
      onComplete: () => {
        pre.classList.add('done');
        document.body.style.overflow = '';
        initHeroAnimation();
        initScrollAnimations();
      }
    });
  }

  document.body.style.overflow = 'hidden';
})();

/* ══════════════════════════════════
   3. GLOBAL LIGHT STREAKS CANVAS
══════════════════════════════════ */
(function initLightStreaks() {
  const canvas = document.getElementById('lightStreaksCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const streaks = Array.from({ length: 6 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    length: Math.random() * 200 + 80,
    speed: Math.random() * 0.5 + 0.2,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.4 + 0.05,
    width: Math.random() * 1.5 + 0.3,
    color: Math.random() > 0.5 ? '108,63,255' : '0,201,167',
    progress: Math.random()
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    streaks.forEach(s => {
      s.progress += s.speed * 0.003;
      if (s.progress > 1) {
        s.progress = 0;
        s.x = Math.random() * canvas.width;
        s.y = -100;
      }
      const alpha = s.progress < 0.1 ? s.progress / 0.1 : s.progress > 0.85 ? (1 - s.progress) / 0.15 : 1;
      const ex = s.x + Math.cos(s.angle) * s.length * s.progress * 3;
      const ey = s.y + Math.sin(s.angle) * s.length * s.progress * 3 + (canvas.height * s.progress * 0.15);
      const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
      grad.addColorStop(0, `rgba(${s.color},0)`);
      grad.addColorStop(0.5, `rgba(${s.color},${s.opacity * alpha})`);
      grad.addColorStop(1, `rgba(${s.color},0)`);
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.moveTo(s.x, s.y + canvas.height * s.progress * 0.15);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════
   4. HERO PARTICLES
══════════════════════════════════ */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.5 - 0.1,
    radius: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.6 ? '108,63,255' : Math.random() > 0.5 ? '0,201,167' : '212,168,67',
    life: Math.random()
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.003;
      if (p.y < -10 || p.life > 1) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
        p.life = 0;
        p.alpha = Math.random() * 0.5 + 0.1;
      }
      const fade = p.life < 0.1 ? p.life / 0.1 : p.life > 0.85 ? (1 - p.life) / 0.15 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha * fade})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   5. CTA PARTICLES
══════════════════════════════════ */
function initCtaParticles() {
  const canvas = document.getElementById('ctaParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const pts = Array.from({ length: 20 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.4 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,63,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   6. HERO ANIMATION (Motion.dev)
══════════════════════════════════ */
function initHeroAnimation() {
  initHeroParticles();
  initCtaParticles();

  const dur = (d) => ({ duration: d, easing: EASE_CINEMATIC });

  // Cinematic bars
  animate('#cinTop', { height: 0 }, { duration: 1.4, easing: EASE_CINEMATIC });
  animate('#cinBottom', { height: 0 }, { duration: 1.4, easing: EASE_CINEMATIC });

  // Staggered hero text
  const heroEls = ['#heroEyebrow', '#hl1', '#hl2', '#hl3', '#heroSub', '#heroCtas', '#heroStats'];
  heroEls.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    animate(el, { opacity: 1, transform: 'translateY(0px)' }, {
      duration: 0.9, delay: 0.3 + i * 0.12, easing: EASE_CINEMATIC
    });
  });

  // Floating card
  const floatCard = document.querySelector('#heroFloatingCard');
  if (floatCard) {
    floatCard.style.opacity = '0';
    floatCard.style.transform = 'translateX(60px)';
    animate(floatCard, { opacity: 1, transform: 'translateX(0px)' }, {
      duration: 1, delay: 1.1, easing: EASE_CINEMATIC
    });
    // Floating bob
    function bobFloat() {
      animate(floatCard, { transform: ['translateY(0px)', 'translateY(-12px)', 'translateY(0px)'] }, {
        duration: 3, easing: 'ease-in-out',
        onComplete: bobFloat
      });
    }
    setTimeout(bobFloat, 2000);
  }

  // Scroll indicator
  const scrollInd = document.querySelector('#scrollIndicator');
  if (scrollInd) {
    scrollInd.style.opacity = '0';
    animate(scrollInd, { opacity: 1 }, { duration: 0.6, delay: 1.6, easing: EASE_CINEMATIC });
  }

  // Light leak movement (looping via keyframes)
  const lightLeak = document.querySelector('#heroLightLeak');
  if (lightLeak) {
    animate(lightLeak,
      { transform: ['translate(0px, 0px)', 'translate(40px, -30px)', 'translate(0px, 0px)'] },
      { duration: 8, easing: 'ease-in-out', repeat: Infinity }
    );
  }

  // Hero bg parallax via scroll
  const bgImg = document.querySelector('#heroBgImg');
  if (bgImg) {
    scroll(
      animate(bgImg, { transform: 'translateY(200px) ' }, { easing: 'linear' }),
      { target: document.querySelector('.hero'), offset: ['start start', 'end start'] }
    );
  }

  // Hero stat counters
  document.querySelectorAll('.hstat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    inView(el, () => {
      let start = null;
      const duration = 2500;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ep = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.ceil(ep * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    }, { margin: '-10%' });
  });
}

/* ══════════════════════════════════
   7. SCROLL ANIMATIONS (Motion.dev)
══════════════════════════════════ */
function initScrollAnimations() {

  function revealEl(selector, fromY, fromX, delay) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = `translate(${fromX || 0}px, ${fromY || 50}px)`;
      inView(el, () => {
        // Guard: only animate once — inView fires again on re-enter without this
        if (el.dataset.revealed) return;
        el.dataset.revealed = '1';
        animate(el,
          { opacity: 1, transform: 'translate(0px, 0px)' },
          { duration: 0.9, delay: (delay || 0) + i * 0.1, easing: EASE_CINEMATIC }
        );
      }, { margin: '-5%' });
    });
  }

  revealEl('#programsHeader', 50);
  revealEl('#filterTabs .ftab', 30, 0, 0);
  revealEl('.prog-card', 60);
  revealEl('#whyVisuals', 0, -60);
  revealEl('#whyText > *', 40);
  revealEl('.inst-card', 60, 0, 0);
  revealEl('.testimonials-section .section-header', 40);
  revealEl('.cta-content > *', 50);
  revealEl('.footer-brand, .footer-col', 40);
  revealEl('.mh-inner > *', 40);
  revealEl('.ep-bundle', 50);
  revealEl('.ep-solo-card', 40);
  revealEl('.module-card', 50);
  revealEl('.dv-card', 50);
  revealEl('.csb-stat', 30);

  // Badge pop animations
  document.querySelectorAll('.wv-badge').forEach((badge, i) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0)';
    inView(badge, () => {
      animate(badge,
        { opacity: 1, transform: 'scale(1)' },
        { duration: 0.6, delay: 0.4 + i * 0.15, easing: EASE_BACK }
      );
      // Float badge
      const offsets = [-8, 10, -6];
      function floatBadge() {
        animate(badge,
          { transform: [`translateY(0px)`, `translateY(${offsets[i % 3]}px)`, `translateY(0px)`] },
          { duration: 1.5 + i * 0.4, easing: 'ease-in-out', onComplete: floatBadge }
        );
      }
      setTimeout(floatBadge, 800 + i * 200);
    }, { margin: '-10%' });
  });

  // Why section parallax
  const wvMain = document.querySelector('.wv-main');
  const wvSec = document.querySelector('.wv-secondary');
  const whySec = document.querySelector('.why-section');
  if (wvMain && whySec) {
    scroll(
      animate(wvMain, { transform: ['translateY(0px)', 'translateY(-30px)'] }, { easing: 'linear' }),
      { target: whySec, offset: ['start end', 'end start'] }
    );
  }
  if (wvSec && whySec) {
    scroll(
      animate(wvSec, { transform: ['translateY(0px)', 'translateY(30px)'] }, { easing: 'linear' }),
      { target: whySec, offset: ['start end', 'end start'] }
    );
  }
}

/* ══════════════════════════════════
   8. NAVBAR
══════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('navProgress');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    navbar.classList.toggle('scrolled', scrolled > 50);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (scrolled / docH * 100) + '%';
    document.getElementById('backToTop').classList.toggle('show', scrolled > 500);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu-content a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ══════════════════════════════════
   9. SMOOTH SCROLL
══════════════════════════════════ */
function scrollToo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const h = a.getAttribute('href');
    if (h === '#') return;
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ══════════════════════════════════
   10. VIDEO MODAL
══════════════════════════════════ */
(function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const openBtn = document.getElementById('watchTrailerBtn');
  const closeBtn = document.getElementById('vmClose');
  const overlay = document.getElementById('vmOverlay');
  const timeline = document.getElementById('vmTimeline');
  const playIcon = document.getElementById('vmPlayIcon');
  const playPauseBtn = document.getElementById('vmPlayPause');
  const vmEnrollBtn = document.getElementById('vmEnrollBtn');

  const scenes = document.querySelectorAll('.vm-scene');
  const chapters = document.querySelectorAll('.vm-chapter');
  let isPlaying = false;
  let progressValue = 0;
  let progressInterval;
  let sceneIndex = 0;
  let sceneInterval;

  scenes.forEach(s => {
    s.style.backgroundImage = `url('${s.getAttribute('data-img')}')`;
  });

  const trailerCanvas = document.getElementById('trailerCanvas');
  const tCtx = trailerCanvas.getContext('2d');

  function resizeTrailerCanvas() {
    trailerCanvas.width = trailerCanvas.offsetWidth || 640;
    trailerCanvas.height = trailerCanvas.offsetHeight || 360;
  }

  function drawTrailerEffect() {
    resizeTrailerCanvas();
    const w = trailerCanvas.width, h = trailerCanvas.height;
    const now = Date.now() * 0.001;
    tCtx.fillStyle = 'rgba(0,0,0,0.3)';
    tCtx.fillRect(0, 0, w, h);
    tCtx.strokeStyle = 'rgba(108,63,255,0.08)';
    tCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      tCtx.beginPath(); tCtx.moveTo(x, 0); tCtx.lineTo(x, h); tCtx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      tCtx.beginPath(); tCtx.moveTo(0, y); tCtx.lineTo(w, y); tCtx.stroke();
    }
    const sweepX = (Math.sin(now * 0.5) * 0.5 + 0.5) * w;
    const sweepGrad = tCtx.createLinearGradient(sweepX - 100, 0, sweepX + 100, 0);
    sweepGrad.addColorStop(0, 'rgba(108,63,255,0)');
    sweepGrad.addColorStop(0.5, 'rgba(108,63,255,0.12)');
    sweepGrad.addColorStop(1, 'rgba(108,63,255,0)');
    tCtx.fillStyle = sweepGrad;
    tCtx.fillRect(0, 0, w, h);
    if (isPlaying) requestAnimationFrame(drawTrailerEffect);
  }
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    resizeTrailerCanvas();
    startPlayback();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    stopPlayback();
  }

  function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    drawTrailerEffect();
    progressInterval = setInterval(() => {
      progressValue += 0.4;
      if (progressValue >= 100) { progressValue = 0; sceneIndex = 0; }
      timeline.style.width = progressValue + '%';
    }, 80);
    sceneInterval = setInterval(() => {
      scenes[sceneIndex].classList.remove('active');
      sceneIndex = (sceneIndex + 1) % scenes.length;
      scenes[sceneIndex].classList.add('active');
      const chapIdx = Math.floor(progressValue / 20) % chapters.length;
      chapters.forEach((c, i) => c.classList.toggle('active', i === chapIdx));
    }, 3000);
  }

  function stopPlayback() {
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    clearInterval(progressInterval);
    clearInterval(sceneInterval);
  }

  playPauseBtn.addEventListener('click', () => { isPlaying ? stopPlayback() : startPlayback(); });
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  if (vmEnrollBtn) {
    vmEnrollBtn.addEventListener('click', () => {
      closeModal();
      openCheckout('Advanced Cinematography', 20);
    });
  }

  chapters.forEach((ch, i) => {
    ch.addEventListener('click', () => {
      progressValue = i * 20;
      timeline.style.width = progressValue + '%';
      chapters.forEach(c => c.classList.remove('active'));
      ch.classList.add('active');
    });
  });
})();

/* ══════════════════════════════════
   11. FILTER TABS
══════════════════════════════════ */
(function initFilter() {
  const tabs = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('.prog-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96) translateY(8px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.94)';
          setTimeout(() => { card.style.display = 'none'; }, 260);
        }
      });
    });
  });
})();

/* ══════════════════════════════════
   12. WISHLIST (Motion.dev)
══════════════════════════════════ */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('wishlisted');
    const icon = this.querySelector('i');
    icon.className = this.classList.contains('wishlisted') ? 'fas fa-heart' : 'far fa-heart';
    icon.style.color = this.classList.contains('wishlisted') ? '#ff4757' : '';
    animate(this, { transform: ['scale(0.7)', 'scale(1)'] }, {
      duration: 0.5, easing: EASE_BACK
    });
  });
});

/* ══════════════════════════════════
   13. TESTIMONIALS SLIDER
   — Always 1 card visible on ALL screen sizes
   — CSS transition drives movement (no Motion on track = no flicker)
══════════════════════════════════ */
(function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const total = cards.length;
  let current = 0;
  let autoplay;
  let isAnimating = false;

  // Force each card to be full-width of the wrapper
  function sizeCards() {
    const w = track.parentElement.offsetWidth;
    cards.forEach(c => {
      c.style.minWidth = w + 'px';
      c.style.width = w + 'px';
    });
    // Immediately snap to current position without transition
    track.style.transition = 'none';
    track.style.transform = `translateX(${-current * (track.parentElement.offsetWidth + 0)}px)`;
    // Re-enable transition after paint
    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'td' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.td').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(idx) {
    if (isAnimating) return;
    isAnimating = true;
    current = ((idx % total) + total) % total;
    const slideW = track.parentElement.offsetWidth;
    track.style.transform = `translateX(${-current * slideW}px)`;
    updateDots();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() { autoplay = setInterval(next, 4500); }
  function resetAuto() { clearInterval(autoplay); startAuto(); }

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  // On resize: re-size cards and re-snap (no slide animation)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeCards, 100);
  });

  // Init
  sizeCards();
  buildDots();
  startAuto();
})();

/* ══════════════════════════════════
   14. ENROLLMENT CHECKOUT (Motion.dev)
══════════════════════════════════ */
(function initCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  if (!overlay) return;

  let currentStep = 1;
  let selectedPrice = 20;
  let selectedCourseName = 'Selected Course';
  let selectedCourseId = null;
  let discountApplied = false;
  const COUPON = 'CINEMATIC20';

  function isUserLoggedIn() {
    return window.IS_LOGGED_IN === true || window.IS_LOGGED_IN === 'true';
  }

  window.openCheckout = function (courseName, price, courseId = null) {
    selectedCourseName = courseName || 'Selected Course';
    selectedPrice = parseFloat(price) || 20;
    selectedCourseId = courseId !== undefined ? courseId : null;
    currentStep = 1;
    discountApplied = false;

    const couponInput = document.getElementById('couponInput');
    const couponMsg = document.getElementById('couponMsg');
    const discountRow = document.getElementById('osDiscountRow');
    if (couponInput) couponInput.value = '';
    if (couponMsg) couponMsg.textContent = '';
    if (discountRow) discountRow.style.display = 'none';

    updateCheckoutInfo();
    updatePriceDisplay();

    const isLoggedIn = isUserLoggedIn();
    const initialStep = isLoggedIn ? 3 : 1;
    goToStep(initialStep);

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (initialStep === 3) {
      setTimeout(initPayPalButton, 80);
    }

    const modal = document.querySelector('.checkout-modal');
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.88) translateY(30px)';
    animate(modal, { opacity: 1, transform: 'scale(1) translateY(0px)' }, {
      duration: 0.6, easing: EASE_CINEMATIC,
    });
  };

  function updateCheckoutInfo() {
  const info = document.getElementById('checkoutCourseInfo');
  if (info) {
    // FIX: Different display for Academy Membership vs Courses
    if (selectedCourseName === 'Academy Membership') {
      info.innerHTML = `
        <div class="cci-badge"><i class="fas fa-user-plus"></i> JOIN THE ACADEMY</div>
        <div class="cci-title">${selectedCourseName}</div>
        <div class="cci-price" style="color: #00c9a7; font-size: 1.2rem;">Create Your Free Account</div>
      `;
    } else {
      info.innerHTML = `
        <div class="cci-badge"><i class="fas fa-film"></i> THE CINEMATIC ACADEMY</div>
        <div class="cci-title">${selectedCourseName}</div>
        <div class="cci-price">$${selectedPrice.toFixed(2)}<span>one-time</span></div>
      `;
    }
  }
  const successName = document.getElementById('successCourseName');
  if (successName) successName.textContent = selectedCourseName;
}

  function getCheckoutTotal() {
    const discount = discountApplied ? selectedPrice * 0.2 : 0;
    return selectedPrice - discount;
  }

  function updatePriceDisplay() {
  const total = getCheckoutTotal();
  const coursePrice = document.getElementById('osCoursePrice');
  const discountEl = document.getElementById('osDiscount');
  const totalEl = document.getElementById('osTotal');
  const payBtnText = document.getElementById('payBtnText');
  const discountRow = document.getElementById('osDiscountRow');

  // FIX: Hide price breakdown for Academy Membership (signup flow)
  if (selectedCourseName === 'Academy Membership') {
    if (coursePrice) coursePrice.textContent = 'Free to Join';
    if (discountEl) discountEl.textContent = '';
    if (totalEl) totalEl.textContent = '$0.00';
    if (payBtnText) payBtnText.textContent = 'COMPLETE REGISTRATION';
    if (discountRow) discountRow.style.display = 'none';
  } else {
    // Original price display logic for actual courses
    if (coursePrice) coursePrice.textContent = `$${selectedPrice.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${(selectedPrice - total).toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (payBtnText) payBtnText.textContent = `COMPLETE ENROLLMENT — $${total.toFixed(2)}`;
    if (discountRow) discountRow.style.display = discountApplied ? 'flex' : 'none';
  }
}

  window.goToStep = function goToStep(n) {
    currentStep = n;
    document.querySelectorAll('.checkout-step-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`step${n}`);
    if (target) target.classList.add('active');
    document.querySelectorAll('.cs-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
      s.classList.toggle('done', i + 1 < n);
    });

    if (n === 3) {
      setTimeout(initPayPalButton, 120);
    }
  }

  function closeCheckout() {
    const modal = document.querySelector('.checkout-modal');
    animate(modal, { opacity: 0, transform: 'scale(0.9) translateY(20px)' }, {
      duration: 0.4, easing: 'ease-in',
      onComplete: () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  const closeBtn = document.getElementById('checkoutClose');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckout);
  const closeRightBtn = document.getElementById('checkoutCloseRight');
  if (closeRightBtn) closeRightBtn.addEventListener('click', closeCheckout);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCheckout(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCheckout();
  });

  const step1Form = document.getElementById('step1Form');
  if (step1Form) step1Form.addEventListener('submit', e => { e.preventDefault(); goToStep(2); });

  const step2Next = document.getElementById('step2Next');
  if (step2Next) step2Next.addEventListener('click', () => goToStep(3));

  document.querySelectorAll('.plan-select-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.plan-select-btn').forEach(b => {
        b.classList.remove('selected-plan');
        b.textContent = 'SELECT';
      });
      this.classList.add('selected-plan');
      this.textContent = 'SELECTED ✓';
      const plan = this.closest('.plan-card')?.getAttribute('data-plan');
      const prices = { monthly: 29, annual: 199, lifetime: 499 };
      if (plan && prices[plan]) { selectedPrice = prices[plan]; updatePriceDisplay(); }
    });
  });

  const cfEye = document.getElementById('cfEye');
  if (cfEye) {
    cfEye.addEventListener('click', function () {
      const input = document.getElementById('coPassInput');
      const icon = document.getElementById('cfEyeIcon');
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      if (icon) icon.className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
  }

  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = v.match(/.{1,4}/g)?.join(' ') || v;
      const icon = document.getElementById('cardTypeIcon');
      if (!icon) return;
      if (v.startsWith('4')) icon.innerHTML = '<i class="fab fa-cc-visa" style="color:#1a1f71;font-size:1.4rem"></i>';
      else if (v.startsWith('5')) icon.innerHTML = '<i class="fab fa-cc-mastercard" style="color:#eb001b;font-size:1.4rem"></i>';
      else if (v.startsWith('3')) icon.innerHTML = '<i class="fab fa-cc-amex" style="color:#2557d6;font-size:1.4rem"></i>';
      else icon.innerHTML = '<i class="fas fa-credit-card" style="color:#8a5fff;font-size:1.4rem"></i>';
    });
  }

  const expiryInput = document.getElementById('expiryInput');
  if (expiryInput) {
    expiryInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
      this.value = v;
    });
  }

  document.querySelectorAll('.pm-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pm-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const applyCoupon = document.getElementById('applyCoupon');
  if (applyCoupon) {
    applyCoupon.addEventListener('click', () => {
      const couponInput = document.getElementById('couponInput');
      const couponMsg = document.getElementById('couponMsg');
      if (!couponInput || !couponMsg) return;
      const val = couponInput.value.trim().toUpperCase();
      if (val === COUPON && !discountApplied) {
        discountApplied = true;
        couponMsg.textContent = '✓ 20% discount applied!';
        couponMsg.style.color = '#00c9a7';
        updatePriceDisplay();
      } else if (discountApplied) {
        couponMsg.textContent = 'Coupon already applied.';
        couponMsg.style.color = '#d4a843';
      } else {
        couponMsg.textContent = 'Invalid coupon code.';
        couponMsg.style.color = '#ff4757';
      }
    });
  }

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', e => {
      e.preventDefault();
      const payBtn = document.getElementById('payBtn');
      const payBtnText = document.getElementById('payBtnText');
      if (payBtn) {
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';
      }
      setTimeout(() => {
        goToStep(4);
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.innerHTML = `<i class="fas fa-lock"></i><span id="payBtnText">COMPLETE ENROLLMENT</span><div class="pay-btn-shimmer"></div>`;
        }
        launchConfetti();
      }, 2000);
    });
  }

  const successClose = document.getElementById('successClose');
  if (successClose) successClose.addEventListener('click', closeCheckout);

  window.initPayPalButton = function () {
    const container = document.getElementById('paypal-button-container');
    if (!container || container.dataset.rendered === 'true' || container.dataset.rendered === 'loading') return;
    if (container.children.length > 0) container.innerHTML = '';
    container.dataset.rendered = 'loading';

    const buttons = paypal.Buttons({
      createOrder: async () => {
        const payload = { amount: getCheckoutTotal().toFixed(2) };
        if (selectedCourseId) payload.course_id = selectedCourseId;

        const res = await fetch('/payments/create-order/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data.order_id;
      },

      onApprove: async (data) => {
        const res = await fetch('/payments/capture-order/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify({ order_id: data.orderID, course_id: selectedCourseId }),
        });
        const result = await res.json();
        if (result.success) {
          window.location.href = '/dashboard/';
        } else {
          alert('Payment could not be completed. Please try again.');
        }
      },

      onError: (err) => {
        console.error('PayPal error:', err);
        alert('Something went wrong with PayPal. Please try again.');
      }
    });

    buttons.render('#paypal-button-container')
      .then(() => {
        container.dataset.rendered = 'true';
        console.log('PayPal button rendered successfully');
      })
      .catch(err => {
        console.error('PayPal render failed:', err);
        container.dataset.rendered = '';
      });
  };

  document.querySelectorAll('.enroll-btn, .btn-enroll-checkout, .pc-enroll-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.disabled || this.classList.contains('purchased')) return;
      const courseName = this.getAttribute('data-course')
        || this.closest('.course-card, .program-card, .prog-card')?.querySelector('h3')?.textContent
        || 'Cinematic Academy Course';
      const rawPrice = this.getAttribute('data-price')
        || this.closest('.course-card')?.querySelector('.course-price')?.textContent
        || '299';
      const coursePrice = parseFloat(rawPrice.toString().replace(/[^0-9.]/g, '')) || 299;
      const courseId = this.getAttribute('data-course-id');
      window.openCheckout(courseName, coursePrice, courseId ? parseInt(courseId, 10) : null);
    });
  });
})();

/* ══════════════════════════════════
   CONFETTI (Motion.dev)
══════════════════════════════════ */
function launchConfetti() {
  const colors = ['#6c3fff', '#8a5fff', '#d4a843', '#00c9a7', '#ffffff', '#a855f7'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      const isRect = Math.random() > 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 6;
      confetti.style.cssText = `
        position:fixed;left:${Math.random() * 100}vw;top:-20px;
        width:${isRect ? size : size/2}px;height:${size}px;
        background:${color};border-radius:${isRect ? '2px' : '50%'};
        z-index:99999;pointer-events:none;opacity:1;
      `;
      document.body.appendChild(confetti);
      animate(confetti, {
        transform: [`translateY(0px) translateX(0px) rotate(0deg)`,
          `translateY(${window.innerHeight + 50}px) translateX(${(Math.random() - 0.5) * 300}px) rotate(${Math.random() * 720 - 360}deg)`],
        opacity: [1, 0]
      }, {
        duration: Math.random() * 2 + 1.5, easing: 'ease-in',
        onComplete: () => confetti.remove()
      });
    }, i * 25);
  }
}

/* ══════════════════════════════════
   DOM CONTENT LOADED EXTRAS
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('navJoinBtn')?.addEventListener('click', () => {
    window.openCheckout('Academy Membership', 0);
  });
  document.querySelector('.mobile-join-btn')?.addEventListener('click', () => {
    window.openCheckout('Academy Membership', 0);
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
  });

  /* Typewriter */
  function initTypewriter() {
    const el = document.querySelector('.typewriter-text');
    if (!el) return;
    const phrases = ['MASTER CINEMATOGRAPHY','PERFECT YOUR EDITING','DIRECT YOUR VISION','WRITE YOUR STORY','ILLUMINATE THE SCENE'];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
      const cur = phrases[phraseIndex];
      if (!isDeleting) {
        el.textContent = cur.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === cur.length) { isDeleting = true; setTimeout(type, 1800); return; }
      } else {
        el.textContent = cur.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
      }
      setTimeout(type, isDeleting ? 40 : 80);
    }
    type();
  }
  initTypewriter();

  /* Stat counters */
  document.querySelectorAll('.stat-number').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(el.getAttribute('data-count'));
          const start = performance.now();
          const duration = 2500;
          function update(now) {
            const p = Math.min((now - start) / duration, 1);
            const ep = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(ep * target).toLocaleString();
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  /* Course Overview stat counters (.csb-num with data-count) */
  document.querySelectorAll('.csb-num[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const start = performance.now();
          const duration = 2000;
          function update(now) {
            const p = Math.min((now - start) / duration, 1);
            const ep = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(ep * target) + suffix;
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  /* Footer link hover (Motion.dev) */
  document.querySelectorAll('.footer-col a').forEach(link => {
    link.addEventListener('mouseenter', function () {
      animate(this, { transform: 'translateX(5px)' }, { duration: 0.2, easing: 'ease-out' });
    });
    link.addEventListener('mouseleave', function () {
      animate(this, { transform: 'translateX(0px)' }, { duration: 0.3, easing: 'ease-out' });
    });
  });

  /* Spots pulse (CSS-based, no GSAP needed) */
  // handled by CSS animation in style.css

  /* Dynamic gradient on CTA — use CSS animation instead of rAF loop (CPU fix) */
  // Replaced the requestAnimationFrame loop with a CSS @keyframes animation
  // applied via a class — see style.css .cta-overlay-animated
  const ctaOverlay = document.querySelector('.cta-section .cta-overlay');
  if (ctaOverlay) ctaOverlay.classList.add('cta-overlay-animated');

  /* Magnetic buttons (Motion.dev) */
  document.querySelectorAll('.btn-explore, .btn-join, .btn-join-cta, .btn-view-all').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 16;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height * 16;
      animate(this, { transform: `translate(${x}px, ${y}px)` }, { duration: 0.3, easing: 'ease-out' });
    });
    btn.addEventListener('mouseleave', function () {
      animate(this, { transform: 'translate(0px, 0px)' }, {
        duration: 0.5, easing: [0.34, 1.56, 0.64, 1]
      });
    });
  });

  /* Cursor trail — CSS-driven via custom property, NO rAF loop (CPU fix)
     Uses mousemove throttled with pointer-events CSS trick */
  if (window.innerWidth > 1024 && window.matchMedia('(pointer: fine)').matches) {
    const trailDot = document.createElement('div');
    trailDot.id = 'cursorTrail';
    trailDot.style.cssText = `position:fixed;width:12px;height:12px;
      background:radial-gradient(circle,rgba(108,63,255,0.7),transparent 70%);
      border-radius:50%;pointer-events:none;z-index:9996;
      transform:translate(-50%,-50%);transition:left 0.08s linear,top 0.08s linear;`;
    document.body.appendChild(trailDot);
    let ticking = false;
    document.addEventListener('mousemove', e => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          trailDot.style.left = e.clientX + 'px';
          trailDot.style.top = e.clientY + 'px';
          ticking = false;
        });
      }
    });
  }

  /* Tilt effect (Motion.dev) */
  document.querySelectorAll('.program-card, .course-card, .instructor-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 8;
      animate(this, {
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }, { duration: 0.3, easing: 'ease-out' });
    });
    card.addEventListener('mouseleave', function () {
      animate(this, { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' }, {
        duration: 0.6, easing: EASE_BACK
      });
    });
  });

  /* Lazy load */
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.style.opacity = '0';
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          animate(img, { opacity: 1 }, { duration: 0.5, easing: 'ease' });
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '50px' }).observe(img);
  });

  /* ── Pricing toggle ── */
  const pricingBtns = document.querySelectorAll('.ep-toggle-btn');
  pricingBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      pricingBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const mode = this.getAttribute('data-pricing');
      document.querySelectorAll('.ep-price').forEach(el => {
        const val = el.getAttribute(`data-${mode}`);
        if (val) {
          animate(el, { opacity: 0, transform: 'translateY(-8px)' }, { duration: 0.15 }).then(() => {
            el.textContent = val;
            animate(el, { opacity: 1, transform: 'translateY(0px)' }, { duration: 0.25, easing: EASE_CINEMATIC });
          });
        }
      });
    });
  });

  /* ── Module cards: video autoplay on hover ── 
     Video uses poster= as static image when paused. On hover: play. On leave: pause + reset. */
  document.querySelectorAll('.module-card').forEach(card => {
    const video = card.querySelector('.mc-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
       // Force browser to show the poster again
      video.load();
    });
  });

  /* ── Newsletter ── */
  const newsletterBtn = document.getElementById('newsletterBtn');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
      const email = document.getElementById('footerEmail')?.value;
      if (!email || !email.includes('@')) return;
      document.getElementById('newsletterSuccess')?.classList.add('show');
    });
  }

  /* ── CTA join btn ── */
  document.getElementById('ctaJoinBtn')?.addEventListener('click', () => {
    window.openCheckout('Academy Membership', 0);
  });

});
// Helper to read CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}




