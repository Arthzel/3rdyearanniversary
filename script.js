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

// ── Scroll Reveal — bidirectional ─────────
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-fade, .reveal-zoom, .reveal-side-left, .reveal-side-right'
);

// Hero elements are locked visible once shown — never reverse them
const heroRevealEls = new Set(document.querySelectorAll('#hero .reveal-up, #hero .reveal-fade'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('visible');
      el.classList.remove('exit');
    } else if (!heroRevealEls.has(el)) {
      // Only reverse if element has already been seen (was visible)
      if (el.classList.contains('visible')) {
        el.classList.remove('visible');
        el.classList.add('exit');
        // After transition completes, remove exit so it can animate back in
        setTimeout(() => el.classList.remove('exit'), 900);
      }
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

// ── Particles Canvas — dreamy density ─────
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas ? canvas.getContext('2d') : null;
let particles = [];
const PARTICLE_COUNT = window.innerWidth < 600 ? 200 : 400;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const TYPES = ['heart', 'sparkle', 'bokeh', 'star', 'petal', 'dust', 'ring'];
function mkParticle(spreadY) {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const w = canvas ? canvas.width  : 1920;
  const h = canvas ? canvas.height : 1080;
  return {
    x:       Math.random() * w,
    y:       spreadY !== undefined ? Math.random() * spreadY : h + Math.random() * h,
    size:    Math.random() * 7 + 1.2,
    speedY:  -(Math.random() * 0.55 + 0.08),
    speedX:  (Math.random() - 0.5) * 0.45,
    alpha:   0,
    maxAlpha: Math.random() * 0.6 + 0.1,
    drift:   Math.random() * Math.PI * 2,
    driftS:  Math.random() * 0.014 + 0.003,
    rot:     Math.random() * Math.PI * 2,
    rotS:    (Math.random() - 0.5) * 0.022,
    hue:     Math.random() < 0.38 ? 0 : (Math.random() < 0.45 ? 220 : (Math.random() < 0.5 ? 40 : 340)),
    life:    0,
    maxLife: Math.random() * 320 + 180,
    type
  };
}

// Spread initial particles across full visible height
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = mkParticle(canvas ? canvas.height * 2.5 : 2700);
  p.alpha = Math.random() * 0.5; // start mid-visible so page doesn't look empty
  particles.push(p);
}

function drawHeart(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `hsl(${hue}, 85%, 68%)`;
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
  ctx.strokeStyle = `hsl(${hue}, 80%, 85%)`;
  ctx.lineWidth   = 0.9;
  for (let a = 0; a < 4; a++) {
    const angle = (a / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * size * 1.5, cy + Math.sin(angle) * size * 1.5);
    ctx.stroke();
  }
  ctx.fillStyle = `hsl(${hue}, 95%, 94%)`;
  ctx.globalAlpha = alpha * 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStar(cx, cy, size, alpha, hue, rot) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `hsl(${hue}, 78%, 80%)`;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outer = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const inner = outer + Math.PI / 5;
    if (i === 0) ctx.moveTo(Math.cos(outer) * size, Math.sin(outer) * size);
    else ctx.lineTo(Math.cos(outer) * size, Math.sin(outer) * size);
    ctx.lineTo(Math.cos(inner) * size * 0.42, Math.sin(inner) * size * 0.42);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPetal(cx, cy, size, alpha, hue, rot) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.7;
  ctx.fillStyle = `hsl(${hue}, 65%, 80%)`;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.7, size * 0.38, size * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBokeh(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.38;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.5);
  grad.addColorStop(0, `hsl(${hue}, 75%, 82%)`);
  grad.addColorStop(1, `hsla(${hue}, 75%, 82%, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDust(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillStyle = `hsl(${hue}, 60%, 88%)`;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRing(cx, cy, size, alpha, hue) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.45;
  ctx.strokeStyle = `hsl(${hue}, 70%, 80%)`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function animateParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.drift += p.driftS;
    p.rot   += p.rotS || 0;
    p.x     += p.speedX + Math.sin(p.drift) * 0.55;
    p.y     += p.speedY;
    p.life  += 1;

    // Fade in for first 40 frames, fade out for last 40
    const fadeLen = 40;
    if (p.life < fadeLen) {
      p.alpha = (p.life / fadeLen) * p.maxAlpha;
    } else if (p.life > p.maxLife - fadeLen) {
      p.alpha = ((p.maxLife - p.life) / fadeLen) * p.maxAlpha;
    } else {
      p.alpha = p.maxAlpha;
    }

    // Recycle when off screen or life expired
    if (p.y < -30 || p.life >= p.maxLife) {
      particles[i] = mkParticle();
    }

    if (p.type === 'heart')   drawHeart(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'sparkle') drawSparkle(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'bokeh')   drawBokeh(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'star')    drawStar(p.x, p.y, p.size, p.alpha, p.hue, p.rot);
    if (p.type === 'petal')   drawPetal(p.x, p.y, p.size, p.alpha, p.hue, p.rot);
    if (p.type === 'dust')    drawDust(p.x, p.y, p.size, p.alpha, p.hue);
    if (p.type === 'ring')    drawRing(p.x, p.y, p.size, p.alpha, p.hue);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── MUSIC START SIGN ──────────────────────
const musicStartSign = document.getElementById('music-start-sign');
const musicBtn       = document.getElementById('music-btn');
const playIcon       = musicBtn.querySelector('.play-icon');
const pauseIcon      = musicBtn.querySelector('.pause-icon');

const music = new Audio('assets/music.mp3');
music.loop    = true;
music.preload = 'auto';
music.volume  = 0.35; // BG music lower so voice can be louder

let isPlaying = false;

// Clicking the sign starts music and swaps to the small button
musicStartSign.addEventListener('click', async () => {
  try {
    await music.play();
    isPlaying = true;
    musicStartSign.classList.add('dismissed');
    setTimeout(() => { musicStartSign.style.display = 'none'; }, 500);
    musicBtn.classList.remove('hidden-initially');
    musicBtn.classList.add('visible-now', 'playing');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  } catch (err) {
    console.log('Audio blocked:', err);
  }
});

// Small button toggles BG music
musicBtn.addEventListener('click', async () => {
  try {
    if (!isPlaying) {
      await music.play();
      isPlaying = true;
      musicBtn.classList.add('playing');
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } else {
      music.pause();
      isPlaying = false;
      musicBtn.classList.remove('playing');
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  } catch (err) {
    console.log('Audio blocked:', err);
  }
});

// ── VOICE MESSAGE ──────────────────────────
const voiceBtn     = document.getElementById('voice-btn');
const voiceStopBtn = document.getElementById('voice-stop-btn');
const vmCaption    = document.getElementById('vm-caption');
const vbWaves      = document.getElementById('vb-waves');
const vbLabel      = document.getElementById('vb-label');
const voiceAudio   = new Audio('assets/vm.mp3');
voiceAudio.volume  = 1.0;

const BG_NORMAL = 0.35;
const BG_DUCKED = 0.35 * Math.pow(10, -8 / 20); // -8 dB ≈ 0.139

// Voice states: 'idle' | 'playing' | 'paused'
let voiceState = 'idle';
let duckInterval = null;

// ── Smooth volume fade helper ──
function fadeMusicVolume(targetVol, durationMs) {
  if (duckInterval) clearInterval(duckInterval);
  const steps    = 20;
  const interval = durationMs / steps;
  const startVol = music.volume;
  const step     = (targetVol - startVol) / steps;
  let t = 0;
  duckInterval = setInterval(() => {
    music.volume = parseFloat(Math.min(BG_NORMAL, Math.max(0, music.volume + step)).toFixed(4));
    if (++t >= steps) {
      music.volume = targetVol;
      clearInterval(duckInterval);
      duckInterval = null;
    }
  }, interval);
}

// ── Apply UI for each state ──
function applyVoiceUI(state) {
  const playIcon  = voiceBtn ? voiceBtn.querySelector('.play-icon')  : null;
  const pauseIcon = voiceBtn ? voiceBtn.querySelector('.pause-icon') : null;
  const stopIcon  = voiceBtn ? voiceBtn.querySelector('.stop-icon')  : null;

  if (state === 'idle') {
    voiceBtn  && voiceBtn.classList.remove('playing', 'paused');
    vbWaves   && vbWaves.classList.remove('playing');
    voiceStopBtn && voiceStopBtn.classList.add('hidden');
    if (playIcon)  playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (stopIcon)  stopIcon.classList.add('hidden');
    if (vbLabel)   vbLabel.textContent = 'play';
    if (vmCaption) { vmCaption.textContent = 'my voice, just for you'; vmCaption.classList.remove('playing-state'); }

  } else if (state === 'playing') {
    voiceBtn  && voiceBtn.classList.add('playing');
    voiceBtn  && voiceBtn.classList.remove('paused');
    vbWaves   && vbWaves.classList.add('playing');
    voiceStopBtn && voiceStopBtn.classList.remove('hidden');
    if (playIcon)  playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (stopIcon)  stopIcon.classList.add('hidden');
    if (vbLabel)   vbLabel.textContent = 'pause';
    if (vmCaption) { vmCaption.textContent = 'playing… ♥'; vmCaption.classList.add('playing-state'); }

  } else if (state === 'paused') {
    voiceBtn  && voiceBtn.classList.remove('playing');
    voiceBtn  && voiceBtn.classList.add('paused');
    vbWaves   && vbWaves.classList.remove('playing');
    voiceStopBtn && voiceStopBtn.classList.remove('hidden');
    if (playIcon)  playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (stopIcon)  stopIcon.classList.add('hidden');
    if (vbLabel)   vbLabel.textContent = 'resume';
    if (vmCaption) { vmCaption.textContent = 'paused — tap to resume ♥'; vmCaption.classList.add('playing-state'); }
  }
}

// ── Full stop: resets audio & restores bg music ──
function voiceFullStop() {
  voiceAudio.pause();
  voiceAudio.currentTime = 0;
  voiceState = 'idle';
  applyVoiceUI('idle');
  // Restore bg music volume (only matters if music is playing)
  fadeMusicVolume(BG_NORMAL, 400);
}

// ── Main play button: play → pause → play (toggle) ──
voiceBtn && voiceBtn.addEventListener('click', async () => {
  try {
    if (voiceState === 'idle') {
      // Start playing — duck bg music only if it's running
      if (isPlaying) fadeMusicVolume(BG_DUCKED, 300);
      await voiceAudio.play();
      voiceState = 'playing';
      applyVoiceUI('playing');

    } else if (voiceState === 'playing') {
      // Pause — immediately restore bg music volume
      voiceAudio.pause();
      voiceState = 'paused';
      applyVoiceUI('paused');
      fadeMusicVolume(BG_NORMAL, 300);

    } else if (voiceState === 'paused') {
      // Resume — duck bg music again
      if (isPlaying) fadeMusicVolume(BG_DUCKED, 300);
      await voiceAudio.play();
      voiceState = 'playing';
      applyVoiceUI('playing');
    }
  } catch (err) {
    console.log('Voice audio error:', err);
  }
});

// ── Stop button: full reset ──
voiceStopBtn && voiceStopBtn.addEventListener('click', () => {
  voiceFullStop();
});

// ── Natural end: treat like stop ──
voiceAudio.addEventListener('ended', () => {
  voiceState = 'idle';
  applyVoiceUI('idle');
  fadeMusicVolume(BG_NORMAL, 400);
});

// ── If user scrolls away mid-play, pause and restore ──
const voiceSection = document.querySelector('.voice-msg-section');
if (voiceSection) {
  const volRestoreObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && voiceState === 'playing') {
        voiceAudio.pause();
        voiceState = 'paused';
        applyVoiceUI('paused');
        fadeMusicVolume(BG_NORMAL, 300);
      }
    });
  }, { threshold: 0 });
  volRestoreObs.observe(voiceSection);
}

// ── Letter Modal ───────────────────────────
const LETTERS = {
  1: {
    stamp: 'JUNE 2023',
    to:    'To my dearest love,',
    body: `
    <p>What the heck, Isang taon.

    Through out this journey with you, It was like riding a roller coaster, So many breaks up and so so many lets get back together. I now im not the best BF but sometimes i wonder if im doing good enough for you, but for it to last a year, i know i am and you are too. It's not about how long we go, Its about how strong we become, being bf and gf is different from being magasawa, in a sense in which bf and gf is about building our relationship, Making it strong, building up trust, making things comfortable for both of us kase were different baby, we grew up in different environment so we need to support, Trust, Love and respect each other if we want to stay together. I may not show it sometimes but i do Respect you, Your house is a challenge itself and you deserve more, better, and great treatment. For now, all i can give is My full loyalty, My Full Love, My Full Trust, My Full Support and Everything I can do. Cause I Love You So Much and Without You, I can't even begin to imagine life. You are one of the reasons i am doing my Good at everything i want to do, I strive my dreams for all you that supports and love me. Sorry if I have to spend a little less with you now,But I know, when were married, we got a family, we have money, In the future, You'll have me, Everyday, Every moment And Every Time we're together, Happy.


    Happy Anniversary Baby, I lovee youu so much</p>

    `,
    sig: 'All my love ♥'
  },
  2: {
    stamp: 'JUNE 2024',
    to:    'To the one who fills my days,',
    body: `
      <p>Hi mahal, I know you said not to write something but it’s not
    going to be an anniversary without doing something special, you
    know I haven’t been the best boyfriend to you, I realized that
    kadamo ko mga bagay na kaipohan mabisay, I’m in denial, self
    centered, and prideful. There are things that I hate about myself.
    There are things that I know you hate about me. Love, I know I’ve
    hurt you so many times by now, I said so much when we argue, I
    did a lot of things to make you mad. I wish I haven’t than that
    things. You know, I hate my past, I really do. You know that love.
    But if I had the opportunity to go back in time and redo the
    things I made, I would change every time I did something that
    made you cry.
    You are my everything Cristine. And I Wish that you would see
    that as I see it. I’m not romantic, I’m not rich, I’m not good
    looking, I’m not even hygienic. But I Would do everything just to
    make you happy. Lain man in halata niyan, but I promise you,
    Once I can stand both of our feets, you’ll be the happiest girl on
    earth, you’ll be proud of me, you’ll be proud that you chose me,
    you’ll be happy with me
    Happy 2 Anniversary
    nd
    With all my love, now and forever,
    Arthzel xx
    Its never about the money for me, for me money is a fucker that ruins
    life, Im not doing everything im doing now for the money, I want it so
    that our future solid, our families future is solid.
    Love, you made me see the world differently, maski magaway kita pira
    kabeses gano man kadako it wont changed the fact that I fell in love with
    you and I will always love you. Cheating makes me sick same way alcohol
    does.
    Magbati ka matanos love, I WILL NEVER CHEAT, I CHOOSE YOU
    BECAUSE I LOVE YOU AND YOU HAVE A GOOD HEART, I SEE
    SOMETHING THAT NOBODY DOES, I SEE OUR FUTURE AND I’M
    GONNA DO EVERYTHING I CAN SO THAT OUR FUTURE WON’T
    FAIL. I WANNA BE WITH YOU LOVELOVE, CRISTINE JERSEY YOU
    ARE MY WORLD, MY GIRLFRIEND, MY PARTNER, THE ONE WHO
    KNOWS ME, THE ONE THAT CARES, THE ONE THAT
    UNDERSTANDS ME, THE ONE FOR ME BABY. NO ONE CAN EVER
    REPLACE YOU, THE KINDNESS, YOU SHOW ME TELLS ME ENOUGH
    THAT YOU WILL ALWAYS BE THERE FOR ME. AND I WILLLLLLLL
    ALWAYYYSSSS BE THERE FOR YOUUUUUU!
    I can’t offer much, as a matter a fact, I can’t offer anything niyan… but I
    want you to believe me when I say this mahal. I was LOYAL, I am
    LOYAL, and I will always be LOYAL.</p>
    `,
    sig: 'Forever yours ♥'
  },
  3: {
    stamp: 'JUNE 2026',
    to:    'To my person, always,',
    body: `
      <p>3 years in the making hahahahahah, Hi love, Happpppyyy Anniversary.
Its been a wild journey for both of us mahal. Kdamo nanaman san pag subok na inagihan ta.
You became part of The Publication, Won your First Writing competion,
Wowed your instructors, gabos kami pina wow mo. How far youve comed the the Tintin I knew.
Nagbabatog palang kita aram ko na na you have something with you na lain mo pa na luluwas.
And im so happy and proud to be part of that moment. You grewww so much, kadako san pinagbago mo,
but not in a Bad Way, Mas nag tibay ka, Mas nag kusog ka, Nadudurog ka pangani sin kaklase mo pag
urit ka hahahaha r.i.p Paul.</p>

      <p>Pero Seryuso Babe, As your NUMBER ONE Supporter. I am so fucking proud of what youve accomplished.
I know there still some part of you na feeling mo lain pa, kulang pa, di mo kaya.
Pero let me tell you babe. Ikaw na niyan ang inkikita san tawo.
You didn't just earn the respects of ur classmates, but also your instructors.
You are very very talented, i hope that your insurities would fade away someday, sana
mapalitan ina sin kalayo, that fire to always do better than what you did.
I hope that you always do your best in everything that you do.
Im always here to support you my love. I hope na makita mo ang mga bagay na nakikita ko saimo.</p>

      <p>
Anyways my Prettyyyyy Babyyyyy.... HAPPPPPPPYYY 3 YEARSSSSSSSS!!!!

More Anniversaries to comeee, More Achievements to grab, and moreee success to manifest.

Tandaan mo po mahal, Im 100% yours, cause ur 100% mine rawr hahahaha.

Happpy Annivesary po mahlllll!</p>
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
    if (typeof closeLightbox === 'function') closeLightbox();
  }
});

// ── Gallery — Pinterest Masonry Horizontal Scroll ─
// Each item has a natural aspect ratio so cards vary in height just like Pinterest.
// aspect: width/height ratio of the actual image/video (portrait < 1, landscape > 1, square = 1)
// Update these to match your real files. Videos use assets/videoN.mp4.
// ── Gallery — Square Grid Marquee ──────────
const GALLERY_ITEMS = [
  { url:'assets/1.png',  label:'Concert',         type:'image' },
  { url:'assets/2.png',  label:'Agoho',    type:'image' },
  { url:'assets/3.png',  label:'Piknik',         type:'image' },
  { url:'assets/4.png',  label:'DAMDAMDAM',       type:'image' },
  { url:'assets/5.png',  label:'Mall2x',           type:'image' },
  { url:'assets/6.png',  label:'Sunset Lamp Kuno',        type:'image' },
  { url:'assets/7.png',  label:'Graduation',         type:'image' },
  { url:'assets/8.png',  label:'sibinilibin',          type:'image' },
  { url:'assets/9.png',  label:'nanghiram pa camera',         type:'image' },
  { url:'assets/10.png', label:'Kaganda san baby ko',             type:'image' },
  { url:'assets/11.png', label:'Nasa Pier nanaman, maano kamo dyan?',        type:'image' },
  { url:'assets/12.png', label:'Hi cy, Hi angel',             type:'image' },
  { url:'assets/13.png', label:'Uyy Kasal?',        type:'image' },
  { url:'assets/14.png', label:'RedBox',        type:'image' },
  { url:'assets/15.png', label:'Gabi',   type:'image' },
  { url:'assets/16.png', label:'HALUC',              type:'image' },
  { url:'assets/17.png', label:'First Picture',           type:'image' },
  { url:'assets/18.png', label:'Mahulog, ayy nahulog na',          type:'image' },
  { url:'assets/19.png', label:'AYIEEEEEEE',              type:'image' },
  { url:'assets/20.png', label:'Kalbo amp',       type:'image' },
  { url:'assets/21.png', label:'My Baby',           type:'image' },
  { url:'assets/22.png', label:'You & Me',             type:'image' },
  { url:'assets/23.png', label:'Me & You',        type:'image' },
  { url:'assets/24.png', label:'Special Days',         type:'image' },
  { url:'assets/25.png', label:'GOOOO LOVE!!!!!!!',           type:'image' },
  { url:'assets/26.png', label:'Dimple',          type:'image' },
  { url:'assets/27.png', label:'Complex',      type:'image' },
  { url:'assets/28.png', label:'Mga Matatalino',         type:'image' },
  { url:'assets/29.png', label:'FOODS',   type:'image' },
  { url:'assets/30.png', label:'Favorite Food',            type:'image' },
  { url:'assets/31.png', label:'Food Again',            type:'image' },
  { url:'assets/32.png', label:'New Phone Selfie',    type:'image' },
  { url:'assets/33.png', label:'My Baby and My Baby',    type:'image' },
  { url:'assets/34.png', label:'Tingin sa mata',        type:'image' },
  { url:'assets/35.png', label:'Kiss',       type:'image' },
  { url:'assets/36.png', label:'Cutieee Pic',          type:'image' },
  { url:'assets/37.png', label:'Hole',          type:'image' },
  { url:'assets/38.png', label:'Night Walk Ulet hehe',          type:'image' },
  { url:'assets/39.png', label:'May Pizza Dyan',      type:'image' },
  { url:'assets/40.png', label:'San Juan Tamad Bridge',     type:'image' },
  { url:'assets/41.png', label:'iyaq',         type:'image' },
  { url:'assets/42.png', label:'wakie',             type:'image' },
  { url:'assets/43.png', label:'My Teacher Wife',            type:'image' },
  { url:'assets/44.png', label:'Fav Pic hehe',         type:'image' },
  { url:'assets/45.png', label:'uyy development.',    type:'image' },
  { url:'assets/46.png', label:'Love this pic',  type:'image' },
  { url:'assets/47.png', label:'I love you',              type:'image' },
  { url:'assets/48.png', label:'Baby',               type:'image' },
  { url:'assets/49.png', label:'Fasionista',             type:'image' },
  { url:'assets/50.png', label:'Graduation Eats',         type:'image' },
  { url:'assets/51.png', label:'Graduation',              type:'image' },
  { url:'assets/52.png', label:'Lakwatsa',         type:'image' },
  { url:'assets/53.png', label:'Lambing',       type:'image' },
  { url:'assets/54.png', label:'Laughing Again',       type:'image' },
  { url:'assets/55.png', label:'The Good Stuff',       type:'image' },
  { url:'assets/56.png', label:'Just Because',         type:'image' },
  { url:'assets/57.png', label:'Movie Date',           type:'image' },
  { url:'assets/58.png', label:'Vintage',         type:'image' },
  { url:'assets/59.png', label:'MWA MWA',             type:'image' },
  { url:'assets/60.png', label:'Our Story',            type:'image' },
  { url:'assets/video1.mp4', label:'A Moment in Motion', type:'video', poster:'assets/video1-thumb.jpg' },
  { url:'assets/video2.mp4', label:'Us on Film',          type:'video', poster:'assets/video2-thumb.jpg' },
];

const scrollTrack = document.getElementById('gallery-scroll-track');

if (scrollTrack) {
  const TILE_W   = window.innerWidth < 700 ? 130 : 190;
  const ROWS     = 3;
  const NUM_COLS = Math.ceil(GALLERY_ITEMS.length / ROWS);
  const GAP      = 6;

  function createTile(item, globalIdx) {
    const card = document.createElement('div');
    card.className = 'pin-card';
    card.dataset.index = globalIdx;

    // number badge
    const num = document.createElement('div');
    num.className = 'pin-num';
    num.textContent = String(globalIdx + 1).padStart(2, '0');
    card.appendChild(num);

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.url;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.autoplay = true;
      if (item.poster) vid.poster = item.poster;
      vid.addEventListener('loadeddata', () => { card.classList.add('loaded'); vid.play(); });
      card.appendChild(vid);

      const badge = document.createElement('div');
      badge.className = 'pin-video-badge';
      badge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>VIDEO`;
      card.appendChild(badge);
    } else {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.label;
      img.loading = 'lazy';
      img.addEventListener('load', () => card.classList.add('loaded'));
      card.appendChild(img);
    }

    const ov = document.createElement('div');
    ov.className = 'pin-overlay';
    ov.innerHTML = `<span>${item.label}</span>`;
    card.appendChild(ov);

    card.addEventListener('click', () => openLightbox(globalIdx));
    return card;
  }

  function buildSet() {
    const frag = document.createDocumentFragment();
    // distribute items into columns of ROWS tiles each
    for (let c = 0; c < NUM_COLS; c++) {
      const col = document.createElement('div');
      col.className = 'pin-col';
      for (let r = 0; r < ROWS; r++) {
        const idx = c * ROWS + r;
        if (idx >= GALLERY_ITEMS.length) break;
        col.appendChild(createTile(GALLERY_ITEMS[idx], idx));
      }
      frag.appendChild(col);
    }
    return frag;
  }

  scrollTrack.appendChild(buildSet());
  scrollTrack.appendChild(buildSet()); // duplicate for seamless loop

  function updateDuration() {
    const totalW = NUM_COLS * (TILE_W + GAP);
    const speed  = 55;
    scrollTrack.style.animationDuration = Math.round(totalW / speed) + 's';
  }
  setTimeout(updateDuration, 300);
  window.addEventListener('resize', updateDuration, { passive: true });
}

// ── Lightbox ──────────────────────────────
let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbVideo  = document.getElementById('lb-video');
const lbCap    = document.getElementById('lb-caption');
const lbClose  = document.getElementById('lb-close');
const lbPrev   = document.getElementById('lb-prev');
const lbNext   = document.getElementById('lb-next');

function openLightbox(index) {
  lbIndex = ((index % GALLERY_ITEMS.length) + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  renderLightbox();
  lightbox.classList.add('open');
  lightbox.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const item = GALLERY_ITEMS[lbIndex];
  if (item.type === 'video') {
    lbImg.style.display = 'none';
    lbVideo.classList.add('active');
    lbVideo.src = item.url;
    if (item.poster) lbVideo.poster = item.poster;
    lbVideo.load();
  } else {
    lbVideo.classList.remove('active');
    lbVideo.pause(); lbVideo.src = '';
    lbImg.style.display = 'block';
    lbImg.style.opacity = '0';
    lbImg.src = item.url;
    lbImg.alt = item.label;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
  }
  if (lbCap) lbCap.textContent = item.label;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lbVideo.pause(); lbVideo.src = '';
}

function lbStep(dir) {
  lbIndex = (lbIndex + dir + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  renderLightbox();
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click',  () => lbStep(-1));
if (lbNext)  lbNext.addEventListener('click',  () => lbStep(1));
lightbox && lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
  if (e.key === 'Escape')     closeLightbox();
});

let lbTouchStart = 0;
lightbox && lightbox.addEventListener('touchstart', e => {
  lbTouchStart = e.touches[0].clientX;
}, { passive: true });
lightbox && lightbox.addEventListener('touchend', e => {
  const diff = lbTouchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) lbStep(diff > 0 ? 1 : -1);
}, { passive: true });