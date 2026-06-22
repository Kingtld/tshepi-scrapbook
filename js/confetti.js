/* ═══════════════════════════════════════════
   TSHEPI — Confetti Finale
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  let ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let isRunning = false;

  const colors = ['#D4A5A5', '#C9A96E', '#A8C5B0', '#C48B8B', '#DFC98A', '#E8A0A0', '#F5F0E8'];
  const shapes = ['circle', 'rect', 'triangle'];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      w: 6 + Math.random() * 8,
      h: 6 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 5,
      rot: Math.random() * 360,
      rotSpeed: -5 + Math.random() * 10,
      opacity: 0.8 + Math.random() * 0.2,
      swing: 0,
      swingSpeed: 0.01 + Math.random() * 0.03
    };
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rect':
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -p.h / 2);
        ctx.lineTo(-p.w / 2, p.h / 2);
        ctx.lineTo(p.w / 2, p.h / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < 150 && Math.random() < 0.3) {
      particles.push(createParticle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx + Math.sin(p.swing) * 0.5;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.swing += p.swingSpeed;
      p.vy += 0.02;

      if (p.y > canvas.height + 20) {
        particles.splice(i, 1);
      } else {
        drawParticle(p);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    resize();
    particles = [];
    animate();
  }

  function stop() {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    particles = [];
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', () => {
    if (isRunning) resize();
  });

  window.Confetti = { start: start, stop: stop };

})();
