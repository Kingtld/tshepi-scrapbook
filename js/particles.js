/* ═══════════════════════════════════════════
   TSHEPI — Floating Hearts & Cursor Trail
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── FLOATING HEARTS ─── */
  const heartsContainer = document.getElementById('heartsContainer');
  let heartInterval;

  function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '\u2665';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (10 + Math.random() * 18) + 'px';
    heart.style.opacity = 0.15 + Math.random() * 0.25;
    heart.style.animationDuration = (12 + Math.random() * 18) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 30000);
  }

  function startHearts() {
    if (heartInterval) return;
    createHeart();
    heartInterval = setInterval(createHeart, 3000);
  }

  function stopHearts() {
    if (heartInterval) {
      clearInterval(heartInterval);
      heartInterval = null;
    }
  }

  /* ─── CURSOR TRAIL ─── */
  const trailContainer = document.getElementById('cursorTrail');
  let lastTrail = 0;

  function onMouseMove(e) {
    const now = Date.now();
    if (now - lastTrail < 40) return;
    lastTrail = now;

    const dot = document.createElement('span');
    dot.className = 'trail-dot';
    dot.style.left = (e.clientX - 4) + 'px';
    dot.style.top = (e.clientY - 4) + 'px';
    trailContainer.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
  }

  /* ─── TOUCH TRAIL ─── */
  function onTouchMove(e) {
    const touch = e.touches[0];
    if (!touch) return;
    const now = Date.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;
    const dot = document.createElement('span');
    dot.className = 'trail-dot';
    dot.style.left = (touch.clientX - 4) + 'px';
    dot.style.top = (touch.clientY - 4) + 'px';
    trailContainer.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }

  /* ─── INIT ─── */
  function init() {
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    startHearts();
  }

  /* expose for main.js */
  window.Particles = {
    init: init,
    startHearts: startHearts,
    stopHearts: stopHearts
  };

})();
