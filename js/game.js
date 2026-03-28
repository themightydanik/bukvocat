// ============================================================
// GAME LOGIC
// ============================================================
const MATH_TYPES = ['count', 'compare'];
const COUNT_EMOJIS = ['🐱','🐶','🐸','🦋','⭐','🍎','🚗','🌸','🌟','🎈'];

function startGame(type) {
  currentGameType = type;
  window.speechSynthesis.cancel();
  questions = buildQuestions(type);
  current = 0; gameScore = 0; answered = false;
  document.getElementById('gameScore').textContent = '0';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('resultScreen').classList.remove('show');
  document.getElementById('gameArea').style.display = '';
  document.getElementById('nextBtn').classList.remove('show');

  const L = LANGS[lang];
  const u = L.ui;
  const isMath = MATH_TYPES.includes(type);

  // Show/hide sound card vs math card
  document.getElementById('soundCard').style.display = isMath ? 'none' : '';
  document.getElementById('mathCard').style.display  = isMath ? ''     : 'none';

  // Speech bubble & task label
  let prompt = L.prompt, task = L.task;
  if (type === 'syllable') { prompt = L.promptSyllable; task = L.taskSyllable; }
  if (type === 'count')    { prompt = u.promptCount;    task = u.taskCount; }
  if (type === 'compare')  { prompt = u.promptCompare;  task = u.taskCompare; }

  document.getElementById('speechBubble').textContent = prompt;
  document.getElementById('taskLabel').textContent = task;
  document.getElementById('soundCardLabel').textContent = type === 'syllable' ? '🔊 ' + (L.repeatBtn||'') : '🔊';
  document.getElementById('btnBackMenu').textContent = L.backMenu;

  showScreen('screen-game');
  showQuestion();
}

function buildQuestions(type) {
  const L = LANGS[lang];

  if (type === 'count') {
    const result = [];
    for (let i = 0; i < TOTAL; i++) {
      const num = Math.floor(Math.random() * 9) + 1;
      const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
      const wrongNums = [];
      while (wrongNums.length < 3) {
        const w = Math.floor(Math.random() * 9) + 1;
        if (w !== num && !wrongNums.includes(w)) wrongNums.push(w);
      }
      const options = [...wrongNums, num]
        .sort(() => Math.random() - 0.5)
        .map(n => ({ spoken: String(n), display: String(n) }));
      result.push({ spoken: String(num), display: emoji.repeat(num), emoji, num, options, isMath: true });
    }
    return result;
  }

  if (type === 'compare') {
    const result = [];
    for (let i = 0; i < TOTAL; i++) {
      let a, b;
      do {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
      } while (a === b);
      const answer = a < b ? '<' : '>';
      const options = [
        { spoken: '<', display: '<' },
        { spoken: '>', display: '>' },
        { spoken: '=', display: '=' },
      ].sort(() => Math.random() - 0.5);
      result.push({ spoken: answer, leftNum: a, rightNum: b, options, isMath: true, isCompare: true });
    }
    return result;
  }

  if (type === 'syllable') {
    const pairs = L.syllables.map((s,i) => ({spoken: s, display: L.syllablesDisplay[i]}));
    const shuffled = [...pairs].sort(()=>Math.random()-0.5).slice(0, TOTAL);
    return shuffled.map(item => {
      const wrong = pairs.filter(p=>p.spoken!==item.spoken).sort(()=>Math.random()-0.5).slice(0,3);
      const options = [...wrong, item].sort(()=>Math.random()-0.5);
      return { ...item, options };
    });
  }

  // letter mode
  const pairs = L.letters.map((l,i) => ({spoken:l, display:L.lettersDisplay[i]}));
  const shuffled = [...pairs].sort(()=>Math.random()-0.5).slice(0,TOTAL);
  return shuffled.map(item => {
    const wrong = pairs.filter(p=>p.spoken!==item.spoken).sort(()=>Math.random()-0.5).slice(0,3);
    const options = [...wrong, item].sort(()=>Math.random()-0.5);
    return { ...item, options };
  });
}

function showQuestion() {
  if (current >= TOTAL) { finishGame(); return; }
  answered = false;
  const q = questions[current];
  const L = LANGS[lang];
  const u = L.ui;

  document.getElementById('qCounter').textContent = `${current+1}/${TOTAL}`;
  document.getElementById('progressFill').style.width = `${(current/TOTAL)*100}%`;
  document.getElementById('nextBtn').classList.remove('show');

  // Update math card content
  if (q.isMath) {
    if (q.isCompare) {
      document.getElementById('mathCardContent').innerHTML =
        `<span class="math-num">${q.leftNum}</span><span class="math-blank">?</span><span class="math-num">${q.rightNum}</span>`;
      document.getElementById('answersGrid').className = 'answers-grid answers-grid-3';
    } else {
      document.getElementById('mathCardContent').innerHTML =
        `<div class="math-objects">${q.display}</div>`;
      document.getElementById('answersGrid').className = 'answers-grid';
    }
    // Update bubble
    document.getElementById('speechBubble').textContent =
      q.isCompare ? u.promptCompare : u.promptCount;
  } else {
    document.getElementById('answersGrid').className = 'answers-grid';
    document.getElementById('soundCard').classList.remove('playing');
    // Update bubble
    document.getElementById('speechBubble').textContent =
      currentGameType === 'syllable' ? L.promptSyllable : L.prompt;
  }

  // Build answer buttons
  const grid = document.getElementById('answersGrid');
  grid.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt.display;

    if (q.isCompare) btn.style.fontSize = '52px';
    else if (q.isMath) btn.style.fontSize = '38px';
    else btn.style.fontSize = currentGameType === 'syllable' ? '36px' : '50px';

    btn.onclick = () => { soundTap(); checkAnswer(btn, opt.spoken, q.spoken); };
    grid.appendChild(btn);
  });

  // Speak for letter/syllable only
  if (!q.isMath) {
    setTimeout(() => speakPromptThenItem(), 400);
  }
}

function checkAnswer(btn, chosen, correct) {
  if (answered) return;
  answered = true;
  const allBtns = document.querySelectorAll('.answer-btn');
  allBtns.forEach(b => b.style.pointerEvents='none');

  if (chosen === correct) {
    btn.classList.add('correct');
    gameScore++;
    document.getElementById('gameScore').textContent = gameScore;
    soundWin(); triggerCatMood('happy');
    spawnConfetti(); spawnStars(btn);
    const msg = LANGS[lang].correct[Math.floor(Math.random()*LANGS[lang].correct.length)];
    document.getElementById('speechBubble').textContent = msg;
    speakEval(msg);
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.textContent === questions[current].options.find(o=>o.spoken===correct)?.display)
        b.classList.add('correct');
    });
    soundLose(); triggerCatMood('sad');
    const msg = LANGS[lang].wrong[Math.floor(Math.random()*LANGS[lang].wrong.length)];
    document.getElementById('speechBubble').textContent = msg;
    speakEval(msg);
  }

  setTimeout(() => {
    document.getElementById('nextBtn').classList.add('show');
    document.getElementById('nextBtn').textContent = LANGS[lang].next;
    allBtns.forEach(b => b.style.pointerEvents='');
  }, 1800);
}

function nextQuestion() {
  window.speechSynthesis.cancel();
  current++;
  document.getElementById('catSvg').className = 'cat-svg';
  showQuestion();
}

function finishGame() {
  window.speechSynthesis.cancel();
  document.getElementById('gameArea').style.display='none';
  const rs = document.getElementById('resultScreen');
  rs.classList.add('show');

  const pct = gameScore/TOTAL;
  document.getElementById('resultEmoji').textContent = pct>=0.875?'🏆':pct>=0.5?'🌟':'💪';
  document.getElementById('resultTitle').textContent = LANGS[lang].result;
  document.getElementById('resultScoreText').textContent = `⭐ ${gameScore} / ${TOTAL}`;
  document.getElementById('btnBackMenu').textContent = LANGS[lang].backMenu;

  // Update best score
  if (!progress.bestScores) progress.bestScores = {};
  if (progress.bestScores[currentGameType] === undefined || gameScore > progress.bestScores[currentGameType]) {
    progress.bestScores[currentGameType] = gameScore;
  }

  // Daily sticker + XP logic
  const today = todayKey();
  const todayCount = progress.stickers.filter(s=>s.date===today).length;
  const earned = document.getElementById('stickerEarned');

  if (todayCount < 3 && pct >= 0.5) {
    const emoji = STICKER_EMOJIS[progress.stickers.length % STICKER_EMOJIS.length];
    progress.stickers.push({ date:today, emoji, game: currentGameType, score:gameScore });

    if (progress.lastPlayDate !== today) {
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      progress.streak = progress.lastPlayDate === yesterday ? (progress.streak||0)+1 : 1;
      progress.lastPlayDate = today;
    }

    const xpEarned = gameScore * XP_PER_CORRECT;
    progress.xp = (progress.xp || 0) + xpEarned;
    if (!progress.subjectXP) progress.subjectXP = { reading: 0, math: 0, languages: 0 };
    const subjKey = currentSubject || 'reading';
    if (progress.subjectXP[subjKey] === undefined) progress.subjectXP[subjKey] = 0;
    progress.subjectXP[subjKey] += xpEarned;

    saveProgress();
    earned.style.display='flex';
    document.getElementById('stickerEarnedIcon').textContent = emoji;
    document.getElementById('stickerEarnedText').textContent = LANGS[lang].stickerMsg;
    earned.className = 'sticker-earned';
    soundWin();
    spawnConfetti();
  } else {
    earned.style.display='none';
    saveProgress();
  }
}
