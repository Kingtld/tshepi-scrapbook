/* ═══════════════════════════════════════════
   TSHEPI — Interactive Quiz
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const questions = [
    {
      q: "What did we do together that night?",
      opts: ["Went for a walk", "Watched podcasts", "Went to a party", "Cooked dinner"],
      ans: 1
    },
    {
      q: "How did the night end?",
      opts: ["We fell asleep early", "We went out", "We talked until sunrise", "We said goodbye"],
      ans: 2
    },
    {
      q: "What's my thing?",
      opts: ["Big Heart", "Big Hands", "Big Dreams", "Big Voice"],
      ans: 1
    },
    {
      q: "What song would I play for you?",
      opts: ["Golden — Harry Styles", "Adore You — Harry Styles", "First Time — Teeks", "Better — Khalid"],
      ans: 2
    },
    {
      q: "What was the first thing I noticed?",
      opts: ["Your smile", "Your captivating eyes", "Your kind heart", "Your style"],
      ans: 1
    }
  ];

  let currentQ = 0;
  let score = 0;
  let answered = false;

  const container = document.getElementById('quizContainer');
  const startEl = document.getElementById('quizStart');
  const startBtn = document.getElementById('quizStartBtn');
  const gameEl = document.getElementById('quizGame');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const qCounter = document.getElementById('qCounter');
  const progressFill = document.getElementById('quizProgressFill');
  const resultEl = document.getElementById('quizResult');
  const resultIcon = document.getElementById('resultIcon');
  const resultScore = document.getElementById('resultScore');
  const resultMsg = document.getElementById('resultMsg');
  const restartBtn = document.getElementById('quizRestartBtn');

  function showQuestion(idx) {
    if (!questionEl || !optionsEl) return;
    answered = false;
    const q = questions[idx];
    questionEl.textContent = q.q;
    optionsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => selectAnswer(i, btn));
      optionsEl.appendChild(btn);
    });
    if (qCounter) qCounter.textContent = `${idx + 1} / ${questions.length}`;
    if (progressFill) progressFill.style.width = `${((idx + 1) / questions.length) * 100}%`;
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;
    const q = questions[currentQ];
    const allBtns = optionsEl.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);

    if (idx === q.ans) {
      btn.classList.add('correct');
      score++;
    } else {
      btn.classList.add('wrong');
      allBtns[q.ans].classList.add('correct');
    }

    setTimeout(() => {
      currentQ++;
      if (currentQ < questions.length) {
        showQuestion(currentQ);
      } else {
        showResult();
      }
    }, 1200);
  }

  function showResult() {
    if (gameEl) gameEl.classList.add('hidden');
    if (resultEl) resultEl.classList.remove('hidden');
    if (resultScore) resultScore.textContent = `${score} / ${questions.length}`;

    const pct = score / questions.length;
    let msg = '';
    let icon = '';

    if (pct === 1) {
      msg = "Perfect score. You really were paying attention that night, weren't you?";
      icon = '\u{1F389}';
    } else if (pct >= 0.8) {
      msg = "Almost perfect. Just like that night.";
      icon = '\u{1F31F}';
    } else if (pct >= 0.6) {
      msg = "Not bad. But maybe we need another all-nighter to refresh your memory?";
      icon = '\u{1F60F}';
    } else if (pct >= 0.4) {
      msg = "You were distracted by my captivating eyes, weren't you? Can't blame you.";
      icon = '\u{1F440}';
    } else {
      msg = "Looks like we need to do this again. I know just the podcasts.";
      icon = '\u{1F4FA}';
    }

    if (resultIcon) resultIcon.textContent = icon;
    if (resultMsg) resultMsg.textContent = msg;
  }

  function resetQuiz() {
    currentQ = 0;
    score = 0;
    answered = false;
    if (startEl) startEl.classList.remove('hidden');
    if (gameEl) gameEl.classList.add('hidden');
    if (resultEl) resultEl.classList.add('hidden');
  }

  function startQuiz() {
    if (startEl) startEl.classList.add('hidden');
    if (gameEl) gameEl.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
    currentQ = 0;
    score = 0;
    showQuestion(0);
  }

  function init() {
    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (restartBtn) restartBtn.addEventListener('click', resetQuiz);
  }

  window.Quiz = { init: init, startQuiz: startQuiz };

})();
