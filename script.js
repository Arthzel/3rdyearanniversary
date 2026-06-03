/* ═══════════════════════════════════════════
   ANNIVERSARY WEBSITE — script.js
   Enhanced & Modernized
═══════════════════════════════════════════ */

// ── Preloader ──────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    // Trigger hero entrance after preloader
    setTimeout(() => {
      const titleLines = document.querySelectorAll('.hero-title .line1, .hero-title .line2, .hero-title .line3');
      titleLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('visible'), 300 + i * 180);
      });
      const heroReveal = document.querySelectorAll('#hero .reveal-up:not(.hero-title)');
      heroReveal.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 600 + i * 140);
      });
    }, 200);
  }, 1300);
});

// ── Scroll Progress ────────────────────────
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  scrollBar.style.width = progress + '%';
}, { passive: true });

// ── Custom Cursor ──────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function lerpTrail() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(lerpTrail);
  }
  lerpTrail();

  const hoverTargets = 'a, button, .memory-card, .reason-item, .mosaic-item, .gallery-item, .letter-open-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorTrail.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorTrail.classList.remove('hovered');
    });
  });
}

// ── Scroll Reveal ──────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-fade, .reveal-zoom, .reveal-side-left, .reveal-side-right'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Counter Animation ──────────────────────
const counterEls     = document.querySelectorAll('.counter-num[data-target]');
const counterSection = document.querySelector('.counter-section');
let countersStarted  = false;

if (counterSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counterEls.forEach(el => {
          if (el.dataset.infinite) return;
          const target   = parseInt(el.dataset.target);
          const duration = 2200;
          const start    = performance.now();
          function tick(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(ease * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(counterSection);
}

// ── Live Anniversary Counter ───────────────
const START_DATE = new Date('2023-06-04T00:00:00');

function updateLiveCounter() {
  const now   = new Date();
  let   diff  = now - START_DATE; // ms

  const totalSecs  = Math.floor(diff / 1000);
  const totalMins  = Math.floor(totalSecs / 60);
  const totalHours = Math.floor(totalMins / 60);
  const totalDays  = Math.floor(totalHours / 24);

  const years  = Math.floor(totalDays / 365.25);
  const months = Math.floor((totalDays % 365.25) / 30.44);
  const days   = Math.floor((totalDays % 365.25) % 30.44);
  const hours  = totalHours % 24;
  const mins   = totalMins % 60;
  const secs   = totalSecs % 60;

  const pad = n => String(n).padStart(2, '0');

  const el = id => document.getElementById(id);
  if (el('lc-years'))  el('lc-years').textContent  = years;
  if (el('lc-months')) el('lc-months').textContent = months;
  if (el('lc-days'))   el('lc-days').textContent   = days;
  if (el('lc-hours'))  el('lc-hours').textContent  = pad(hours);
  if (el('lc-mins'))   el('lc-mins').textContent   = pad(mins);
  if (el('lc-secs'))   el('lc-secs').textContent   = pad(secs);
}

updateLiveCounter();
setInterval(updateLiveCounter, 1000);

// ── Parallax Hero ──────────────────────────
const splats = document.querySelectorAll('.splat');
const hands  = document.querySelectorAll('.hand');
let ticking  = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      splats.forEach((s, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        s.style.transform = `translateY(${sy * 0.14 * dir}px)`;
      });
      hands.forEach((h, i) => {
        const dir = i % 2 === 0 ? 0.18 : -0.18;
        h.style.transform = `translateY(calc(-50% + ${sy * dir}px))`;
      });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ── Reasons stagger ────────────────────────
const reasons = document.querySelectorAll('.reason-item');
reasons.forEach((r, i) => {
  r.style.animationDelay = `${i * 0.35}s`;
});

// ── Magnetic buttons ──────────────────────
document.querySelectorAll('.letter-open-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
    const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
    btn.style.transform = `translateY(-6px) scale(1.03) translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── Particles Canvas ──────────────────────
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas ? canvas.getContext('2d') : null;
let particles = [];
const PARTICLE_COUNT = window.innerWidth < 600 ? 30 : 60;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const TYPES = ['heart', 'sparkle', 'bokeh'];
function mkParticle() {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  return {
    x:      Math.random() * (canvas ? canvas.width  : 1920),
    y:      Math.random() * (canvas ? canvas.height : 1080) + (canvas ? canvas.height : 1080),
    size:   Math.random() * 4 + 2,
    speedY: -(Math.random() * 0.6 + 0.2),
    speedX: (Math.random() - 0.5) * 0.3,
    alpha:  Math.random() * 0.5 + 0.1,
    drift:  Math.random() * Math.PI * 2,
    driftS: Math.random() * 0.01 + 0.005,
    hue:    Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? 220 : 40),
    type
  };
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = mkParticle();
  p.y = Math.random() * (canvas ? canvas.height : 1080);
  particles.push(p);
}

function drawHeart(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
  ctx.translate(cx, cy);
  ctx.scale(size * 0.12, size * 0.12);
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.bezierCurveTo(-5, -8, -10, -3, -10, 2);
  ctx.bezierCurveTo(-10, 6, -5, 10, 0, 14);
  ctx.bezierCurveTo(5, 10, 10, 6, 10, 2);
  ctx.bezierCurveTo(10, -3, 5, -8, 0, -3);
  ctx.fill();
  ctx.restore();
}

function drawSparkle(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `hsl(${hue}, 70%, 75%)`;
  ctx.lineWidth   = 0.8;
  for (let a = 0; a < 4; a++) {
    const angle = (a / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * size * 1.2, cy + Math.sin(angle) * size * 1.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBokeh(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.4;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2);
  grad.addColorStop(0, `hsl(${hue}, 70%, 80%)`);
  grad.addColorStop(1, `hsla(${hue}, 70%, 80%, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animateParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.drift += p.driftS;
    p.x     += p.speedX + Math.sin(p.drift) * 0.3;
    p.y     += p.speedY;

    if (p.y < -20) {
      particles[i] = mkParticle();
    }

    if (p.type === 'heart')    drawHeart(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'sparkle')  drawSparkle(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'bokeh')    drawBokeh(p.x, p.y, p.size, p.alpha, p.hue);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Music Button (Spotify) ────────────────
const SPOTIFY_ID   = '1lORkxEMmsCZqhoxcmk3A3'; // paste your track ID here
const SPOTIFY_TYPE = 'track'; // 'track' or 'playlist'

// Hidden Spotify iframe
const spContainer = document.createElement('div');
spContainer.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;';
spContainer.innerHTML = `
  <iframe
    id="spotify-iframe"
    src="https://open.spotify.com/embed/${SPOTIFY_TYPE}/${SPOTIFY_ID}?utm_source=generator&theme=0"
    width="300"
    height="80"
    frameborder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy">
  </iframe>
`;
document.body.appendChild(spContainer);

const musicBtn  = document.getElementById('music-btn');
const playIcon  = musicBtn.querySelector('.play-icon');
const pauseIcon = musicBtn.querySelector('.pause-icon');
let   isPlaying = false;

// Spotify embed controller
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById('spotify-iframe');
  const options = { uri: `spotify:${SPOTIFY_TYPE}:${SPOTIFY_ID}` };

  IFrameAPI.createController(element, options, (EmbedController) => {
    window.spotifyController = EmbedController;

    // Keep button in sync if track ends or pauses externally
    EmbedController.addListener('playback_update', e => {
      if (e.data.isPaused && isPlaying) {
        isPlaying = false;
        musicBtn.classList.remove('playing');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    });
  });
};

// Load Spotify IFrame API
const spScript  = document.createElement('script');
spScript.src    = 'https://open.spotify.com/embed/iframe-api/v1';
spScript.async  = true;
document.head.appendChild(spScript);

musicBtn.addEventListener('click', () => {
  if (!window.spotifyController) return;

  if (!isPlaying) {
    window.spotifyController.resume();
    isPlaying = true;
    musicBtn.classList.add('playing');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  } else {
    window.spotifyController.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }
});

// ── Letter Modal ───────────────────────────
const LETTERS = {
  1: {
    stamp: 'JUNE 2023',
    to:    'To my dearest love,',
    body: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.</p>
    `,
    sig: 'All my love ♥'
  },
  2: {
    stamp: 'JUNE 2024',
    to:    'To the one who fills my days,',
    body: `
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.</p>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
      <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis eligendi optio.</p>
    `,
    sig: 'Forever yours ♥'
  },
  3: {
    stamp: 'JUNE 2026',
    to:    'To my person, always,',
    body: `
      <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.</p>
      <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Three years, and every day I choose you.</p>
      <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
    `,
    sig: 'I love you ♥'
  }
};

const modal      = document.getElementById('letter-modal');
const modalClose = document.getElementById('modal-close');
const modalTo    = document.getElementById('modal-to');
const modalBody  = document.getElementById('modal-body');
const modalSig   = document.getElementById('modal-sig');
const modalStamp = document.getElementById('modal-stamp');

document.querySelectorAll('.letter-open-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const letter = LETTERS[btn.dataset.letter];
    if (!letter) return;
    modalStamp.textContent = letter.stamp;
    modalTo.textContent    = letter.to;
    modalBody.innerHTML    = letter.body;
    modalSig.textContent   = letter.sig;
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeLightbox();
  }
});

// ── Gallery Setup ──────────────────────────
const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=500&q=80', label: 'First Walks',     w: 320, h: 240 },
  { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80', label: 'Endless Laughter', w: 280, h: 240 },
  { url: 'https://images.unsplash.com/photo-1480562085804-9b149c25ef47?w=400&q=80', label: 'Little Dates',    w: 240, h: 240 },
  { url: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=500&q=80', label: 'Golden Sunsets',    w: 360, h: 240 },
  { url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&q=80', label: 'Adventures',      w: 340, h: 240 },
  { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80', label: 'Quiet Moments',   w: 300, h: 240 },
  { url: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=500&q=80', label: 'Celebrations',      w: 320, h: 240 },
  { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80', label: 'City Lights',     w: 280, h: 240 },
  { url: 'https://images.unsplash.com/photo-1533778477265-4a4fe478e3e1?w=400&q=80', label: 'Hand in Hand',    w: 240, h: 240 },
  { url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80', label: 'In Bloom',        w: 260, h: 240 },
  { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&q=80', label: 'Beach Sunsets',   w: 360, h: 240 },
  { url: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=400&q=80', label: 'Together',        w: 300, h: 240 },
];

const track = document.getElementById('gallery-track');
if (track) {
  // Build double set for seamless loop
  const full = [...GALLERY_IMAGES, ...GALLERY_IMAGES];
  full.forEach((img, idx) => {
    const realIdx = idx % GALLERY_IMAGES.length;
    const item    = document.createElement('div');
    item.className = 'gallery-item';
    item.style.cssText = `width: ${img.w}px; height: ${img.h}px;`;
    item.dataset.index = realIdx;
    item.innerHTML = `
      <img src="${img.url}" alt="${img.label}" loading="lazy" />
      <div class="gallery-item-overlay"><span>${img.label}</span></div>
    `;
    item.addEventListener('click', () => openLightbox(realIdx));
    track.appendChild(item);
  });
}

// ── Lightbox ───────────────────────────────
let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbClose  = document.getElementById('lb-close');
const lbPrev   = document.getElementById('lb-prev');
const lbNext   = document.getElementById('lb-next');

function openLightbox(index) {
  lbIndex = ((index % GALLERY_IMAGES.length) + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  lbImg.src = GALLERY_IMAGES[lbIndex].url.replace('w=500', 'w=1200');
  lbImg.alt = GALLERY_IMAGES[lbIndex].label;
  lightbox.classList.add('open');
  lightbox.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function lbStep(dir) {
  lbIndex = (lbIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = GALLERY_IMAGES[lbIndex].url.replace('w=500', 'w=1200');
    lbImg.alt = GALLERY_IMAGES[lbIndex].label;
    lbImg.style.opacity = '1';
  }, 180);
}

if (lbClose)  lbClose.addEventListener('click',  closeLightbox);
if (lbPrev)   lbPrev.addEventListener('click',   () => lbStep(-1));
if (lbNext)   lbNext.addEventListener('click',   () => lbStep(1));
lightbox && lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
});

// Touch swipe for lightbox
let lbTouchStart = 0;
lightbox && lightbox.addEventListener('touchstart', e => {
  lbTouchStart = e.touches[0].clientX;
}, { passive: true });
lightbox && lightbox.addEventListener('touchend', e => {
  const diff = lbTouchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) lbStep(diff > 0 ? 1 : -1);
}, { passive: true });