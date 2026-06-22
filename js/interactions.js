/* ═══════════════════════════════════════════
   TSHEPI — Interactive Elements
   Typewriter, Drag, Flip Cards, Envelope, Lightbox
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── TYPEWRITER ─── */
  function typeWriter(el, text, speed, callback) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('done');
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      } else {
        el.classList.add('done');
        if (callback) callback();
      }
    }
    tick();
  }

  /* ─── FLIP CARDS ─── */
  function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', function () {
        this.classList.toggle('flipped');
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.classList.toggle('flipped');
        }
      });
    });
  }

  /* ─── DRAGGABLE POLAROIDS ─── */
  function initDraggable() {
    let dragEl = null;
    let startX, startY, origX, origY, offsetX, offsetY;
    let isDragging = false;

    document.querySelectorAll('.gallery-item, .meeting-polaroid').forEach(el => {
      el.addEventListener('mousedown', startDrag);
      el.addEventListener('touchstart', startDragTouch, { passive: false });
    });

    function startDrag(e) {
      if (e.target.closest('.lightbox')) return;
      dragEl = this;
      isDragging = false;
      const rect = dragEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      origX = dragEl.offsetLeft || 0;
      origY = dragEl.offsetTop || 0;

      if (!dragEl.style.position || dragEl.style.position === 'static') {
        dragEl.style.position = 'relative';
      }
      if (dragEl.style.position === 'relative') {
        origX = 0; origY = 0;
      }

      dragEl.style.zIndex = 100;
      dragEl.style.transition = 'none';
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', endDrag);
    }

    function startDragTouch(e) {
      if (e.target.closest('.lightbox')) return;
      const touch = e.touches[0];
      dragEl = this;
      isDragging = false;
      startX = touch.clientX;
      startY = touch.clientY;
      dragEl.style.zIndex = 100;
      dragEl.style.transition = 'none';
      document.addEventListener('touchmove', onDragTouch, { passive: false });
      document.addEventListener('touchend', endDragTouch);
    }

    function onDrag(e) {
      isDragging = true;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      dragEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${dragEl.dataset.rotate || 0}deg)`;
    }

    function onDragTouch(e) {
      e.preventDefault();
      const touch = e.touches[0];
      isDragging = true;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      dragEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${dragEl.dataset.rotate || 0}deg)`;
    }

    function endDrag() {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      dragEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      dragEl.style.zIndex = '';
      if (!isDragging) {
        handleClick(dragEl);
      }
      dragEl = null;
    }

    function endDragTouch() {
      document.removeEventListener('touchmove', onDragTouch);
      document.removeEventListener('touchend', endDragTouch);
      dragEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      dragEl.style.zIndex = '';
      if (!isDragging) {
        handleClick(dragEl);
      }
      dragEl = null;
    }

    function handleClick(el) {
      if (el && el.classList.contains('gallery-item')) {
        openLightbox(el);
      }
    }
  }

  /* ─── LIGHTBOX ─── */
  function openLightbox(el) {
    const img = el.querySelector('img');
    const caption = el.querySelector('.polaroid-caption');
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCaption');
    if (!lb || !lbImg) return;
    lbImg.src = img ? img.src : '';
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = caption ? caption.textContent : '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initLightbox() {
    const closeBtn = document.getElementById('lightboxClose');
    const lb = document.getElementById('lightbox');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lb) lb.addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ─── ENVELOPE ─── */
  function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const hint = document.getElementById('envHint');
    const paper = document.getElementById('letterPaper');
    const letterBody = document.getElementById('letterBody');
    if (!envelope) return;

    const letterText = [
      "We sat down to watch podcasts,",
      "and somewhere between the first episode and the sunrise,",
      "I realized I wasn't watching anything at all.",
      "",
      "I was just lost in you.",
      "",
      "The night ran through our conversation —",
      "through every laugh, every pause,",
      "every moment of silence that said more than words ever could.",
      "",
      "And then it was morning.",
      "",
      "I don't know what this is yet.",
      "But I know it's real.",
      "And I know I want to see where it goes",
      "when the sun comes up again."
    ];

    let isOpen = false;

    envelope.addEventListener('click', function () {
      if (isOpen) return;
      isOpen = true;
      this.classList.add('open');
      if (hint) hint.classList.add('hidden');
      setTimeout(() => {
        if (paper) paper.classList.add('open');
        setTimeout(() => {
          if (letterBody) {
            let lineIdx = 0;
            function writeLine() {
              if (lineIdx < letterText.length) {
                letterBody.textContent += (lineIdx > 0 ? '\n' : '') + letterText[lineIdx];
                lineIdx++;
                setTimeout(writeLine, 80);
              } else {
                letterBody.classList.add('done');
              }
            }
            writeLine();
          }
        }, 600);
      }, 800);
    });
  }

  /* ─── COVER OPEN ─── */
  function initCover() {
    const btn = document.getElementById('openBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        const next = document.getElementById('meeting');
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ─── EXPOSE ─── */
  window.Interactions = {
    typeWriter: typeWriter,
    initFlipCards: initFlipCards,
    initDraggable: initDraggable,
    initLightbox: initLightbox,
    initEnvelope: initEnvelope,
    initCover: initCover
  };

})();
