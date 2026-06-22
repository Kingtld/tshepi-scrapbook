/* ═══════════════════════════════════════════
   TSHEPI — Main Initialization
   Scroll Reveals, Audio Player, Progress, Nav
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── SCROLL REVEAL (IntersectionObserver) ─── */
  function initScrollReveal() {
    const pages = document.querySelectorAll('.page');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          updateProgress(entry.target.dataset.page || '');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    pages.forEach(page => observer.observe(page));
  }

  /* ─── PROGRESS BAR ─── */
  function updateProgress(pageName) {
    const label = document.getElementById('pageLabel');
    const fill = document.getElementById('progressFill');
    const wrapper = document.getElementById('pageProgress');
    if (label) label.textContent = pageName || '—';
    if (wrapper) wrapper.classList.add('visible');

    const pages = document.querySelectorAll('.page');
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let scrolled = window.scrollY;
    let pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    if (fill) fill.style.width = Math.min(pct, 100) + '%';
  }

  /* ─── AUDIO PLAYER ─── */
  function initAudioPlayer() {
    const toggle = document.getElementById('musicToggle');
    const player = document.getElementById('musicPlayer');
    const status = document.getElementById('musicStatus');
    const audio = document.getElementById('bgMusic');
    const info = document.getElementById('musicInfo');

    if (!toggle || !audio) return;

    toggle.addEventListener('click', function onClick() {
      if (audio.paused) {
        if (!audio.src || audio.src === window.location.href || audio.readyState === 0) {
          if (status) status.textContent = 'add .mp3 to Media/';
          return;
        }
        audio.play()
          .then(() => {
            this.classList.add('playing');
            if (status) status.textContent = 'playing';
          })
          .catch(() => {
            this.classList.remove('playing');
            if (status) status.textContent = 'file not found';
          });
      } else {
        audio.pause();
        this.classList.remove('playing');
        if (status) status.textContent = 'paused';
      }
    });

    audio.addEventListener('ended', () => {
      toggle.classList.remove('playing');
      if (status) status.textContent = 'done';
    });

    audio.addEventListener('error', () => {
      toggle.classList.remove('playing');
      if (status) status.textContent = 'file error';
    });

    if (player) player.classList.add('expanded');
    if (info) {
      const title = info.querySelector('.music-title');
      if (title) title.textContent = 'First Time — Teeks';
    }
    if (status) status.textContent = 'tap to play';
  }

  /* ─── AUDIO SETUP (for user to add file) ─── */
  function setAudioSource(src) {
    const audio = document.getElementById('bgMusic');
    if (audio) {
      audio.src = src;
      audio.load();
    }
  }

  /* ─── TYPEWRITER STORY ─── */
  function initStory() {
    const storyText = document.getElementById('storyText');
    const storySig = document.querySelector('.story-sig');

    const lines = [
      "We sat down to watch podcasts.",
      "",
      "That was the plan, anyway.",
      "",
      "But somewhere between the first episode and the sunrise,",
      "the podcasts became background noise.",
      "Because the real show was the conversation.",
      "",
      "It started with nothing —",
      "the kind of nothing that turns into everything.",
      "And before we knew it,",
      "the night had run through our words,",
      "through every laugh, every pause,",
      "every moment of quiet that said more than talking ever could.",
      "",
      "Next thing we knew, it was morning.",
      "",
      "And I didn't want it to end."
    ];

    const fullText = lines.join('\n');

    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (window.Interactions) {
            window.Interactions.typeWriter(storyText, fullText, 45, () => {
              if (storySig) storySig.classList.add('visible');
            });
          }
          storyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (storyText) storyObserver.observe(storyText);
  }

  /* ─── VIDEO LAZY LOAD ─── */
  function initVideo() {
    const video = document.querySelector('.meeting-video-bg');
    if (!video) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          videoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    videoObserver.observe(video);
  }

  /* ─── GALLERY SCATTER POSITIONING ─── */
  function positionGallery() {
    const items = document.querySelectorAll('.gallery-item');
    if (items.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const rotations = [-3, 4, -2, 1, 5, -4, 2];
    const offsets = isMobile
      ? [0, 0, 0, 0, 0, 0, 0]
      : [
          { x: -10, y: 0 },
          { x: 120, y: -20 },
          { x: -80, y: 30 },
          { x: 60, y: 40 },
          { x: -40, y: -10 },
          { x: 100, y: 20 },
          { x: 20, y: 50 }
        ];

    items.forEach((item, i) => {
      if (!isMobile) {
        const rot = rotations[i % rotations.length];
        item.dataset.rotate = rot;
        item.style.transform = `rotate(${rot}deg)`;
      }
    });
  }

  /* ─── FINALE ─── */
  function initFinale() {
    const finale = document.getElementById('finale');
    if (!finale) return;

    let hasTriggered = false;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          if (window.Confetti) {
            setTimeout(() => window.Confetti.start(), 500);
            setTimeout(() => window.Confetti.stop(), 8000);
          }
        }
      });
    }, { threshold: 0.3 });

    obs.observe(finale);
  }

  /* ─── MEMORY GAME ─── */
  function initMemoryGame() {
    const startBtn = document.getElementById('memoryStartBtn');
    const restartBtn = document.getElementById('memoryRestartBtn');
    const startEl = document.getElementById('memoryStart');
    const boardEl = document.getElementById('memoryBoard');
    const winEl = document.getElementById('memoryWin');
    const gridEl = document.getElementById('memoryGrid');
    const moveEl = document.getElementById('moveCount');
    const pairEl = document.getElementById('pairCount');
    const winSub = document.getElementById('winSub');

    const icons = ['\u{1F3A7}', '\u{1F319}', '\u{1F5E3}', '\u{1F305}'];
    const labels = ['Podcast', 'Night', 'Talk', 'Morning'];

    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let pairs = 0;
    let lock = false;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function buildBoard() {
      if (!gridEl) return;
      gridEl.innerHTML = '';
      cards = [];
      flippedCards = [];
      moves = 0;
      pairs = 0;

      icons.forEach((icon, idx) => {
        cards.push({ icon, label: labels[idx], id: idx, matched: false });
        cards.push({ icon, label: labels[idx], id: idx, matched: false });
      });
      shuffle(cards);

      cards.forEach((card, idx) => {
        const div = document.createElement('div');
        div.className = 'memory-card';
        div.dataset.idx = idx;
        div.dataset.id = card.id;
        div.addEventListener('click', () => flipCard(div, idx));
        gridEl.appendChild(div);
      });

      if (moveEl) moveEl.textContent = '0';
      if (pairEl) pairEl.textContent = '0';
    }

    function flipCard(el, idx) {
      if (lock) return;
      if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
      if (flippedCards.length >= 2) return;

      el.classList.add('flipped');
      el.textContent = cards[idx].icon;
      flippedCards.push(idx);

      if (flippedCards.length === 2) {
        lock = true;
        moves++;
        if (moveEl) moveEl.textContent = moves;
        checkMatch();
      }
    }

    function checkMatch() {
      const [a, b] = flippedCards;
      if (cards[a].id === cards[b].id) {
        const els = gridEl.querySelectorAll('.memory-card');
        els[a].classList.add('matched');
        els[b].classList.add('matched');
        cards[a].matched = true;
        cards[b].matched = true;
        pairs++;
        if (pairEl) pairEl.textContent = pairs;
        flippedCards = [];
        lock = false;

        if (pairs === icons.length) {
          setTimeout(() => showWin(), 500);
        }
      } else {
        setTimeout(() => {
          const els = gridEl.querySelectorAll('.memory-card');
          els[a].classList.remove('flipped');
          els[a].textContent = '';
          els[b].classList.remove('flipped');
          els[b].textContent = '';
          flippedCards = [];
          lock = false;
        }, 800);
      }
    }

    function showWin() {
      if (boardEl) boardEl.classList.add('hidden');
      if (winEl) winEl.classList.remove('hidden');
      if (winSub) {
        if (moves <= 5) {
          winSub.textContent = `You matched all memories in just ${moves} moves. Just like that night — effortless.`;
        } else if (moves <= 8) {
          winSub.textContent = `${moves} moves. Not bad for a night we can't forget.`;
        } else {
          winSub.textContent = `${moves} moves. Worth it. Just like every moment of that night.`;
        }
      }
    }

    function startGame() {
      if (startEl) startEl.classList.add('hidden');
      if (boardEl) boardEl.classList.remove('hidden');
      if (winEl) winEl.classList.add('hidden');
      buildBoard();
    }

    function resetGame() {
      if (startEl) startEl.classList.remove('hidden');
      if (boardEl) boardEl.classList.add('hidden');
      if (winEl) winEl.classList.add('hidden');
    }

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', resetGame);
  }

  /* ─── INIT ─── */
  function init() {
    initScrollReveal();
    initAudioPlayer();
    initVideo();

    if (window.Particles) window.Particles.init();
    if (window.Interactions) {
      window.Interactions.initFlipCards();
      window.Interactions.initDraggable();
      window.Interactions.initLightbox();
      window.Interactions.initEnvelope();
      window.Interactions.initCover();
    }
    if (window.Quiz) window.Quiz.init();

    initStory();
    positionGallery();
    initMemoryGame();
    initFinale();

    /* Set audio source — rename your file to "First Time - Teeks.mp3" and put it in Media/ */
    setAudioSource('Media/First Time - Teeks.mp3');

    /* Update progress on scroll */
    window.addEventListener('scroll', () => {
      updateProgress();
    }, { passive: true });

    /* resize gallery */
    window.addEventListener('resize', positionGallery);

    /* keyboard nav */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const current = document.querySelector('.page.visible:last-of-type');
        if (current) {
          const next = current.nextElementSibling;
          if (next && next.classList.contains('page')) {
            next.scrollIntoView({ behavior: 'smooth', block: 'start' });
            e.preventDefault();
          }
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const pages = document.querySelectorAll('.page.visible');
        const current = pages[pages.length - 1];
        if (current) {
          const prev = current.previousElementSibling;
          if (prev && prev.classList.contains('page')) {
            prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
            e.preventDefault();
          }
        }
      }
    });

    console.log('✦ Tshepi scrapbook loaded ✦');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
