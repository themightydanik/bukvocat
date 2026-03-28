// ============================================================
// GAME LOGIC
// ============================================================
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
  document.getElementById('speechBubble').textContent = type === 'syllable' ? L.promptSyllable : L.prompt;
  document.getElementById('taskLabel').textContent = type === 'syllable' ? L.taskSyllable : L.task;
  document.getElementById('soundCardLabel').textContent = type === 'syllable' ? '🔊 ' + (L.repeatBtn||'') : '🔊';
  document.getElementById('btnBackMenu').textContent = L.backMenu;
  showScreen('screen-game');
  showQuestion();
}

function buildQuestions(type) {
  const L = LANGS[lang];
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
  document.getElementById('qCounter').textContent = `${current+1}/${TOTAL}`;
  document.getElementById('progressFill').style.width = `${(current/TOTAL)*100}%`;
  document.getElementById('speechBubble').textContent = currentGameType === 'syllable' ? L.promptSyllable : L.prompt;
  document.getElementById('taskLabel').textContent = currentGameType === 'syllable' ? L.taskSyllable : L.task;

  // Reset sound card
  const soundCard = document.getElementById('soundCard');
  soundCard.classList.remove('playing');

  const grid = document.getElementById('answersGrid');
  grid.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt.display;
    btn.style.fontSize = currentGameType === 'syllable' ? '36px' : '50px';
    btn.onclick = () => { soundTap(); checkAnswer(btn, opt.spoken, q.spoken); };
    grid.appendChild(btn);
  });
  document.getElementById('nextBtn').classList.remove('show');
  setTimeout(() => speakPromptThenItem(), 400);
}

// TTS helpers

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
    allBtns.forEach(b => { if(b.textContent === questions[current].options.find(o=>o.spoken===correct)?.display) b.classList.add('correct'); });
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
  const key = currentGameType; // 'letter' or 'syllable'
  if (progress.bestScores[key] === undefined || gameScore > progress.bestScores[key]) {
    progress.bestScores[key] = gameScore;
  }

  // Daily sticker logic
  const today = todayKey();
  const todayCount = progress.stickers.filter(s=>s.date===today).length;
  const earned = document.getElementById('stickerEarned');
  if (todayCount < 3 && pct >= 0.5) {
    const emoji = STICKER_EMOJIS[progress.stickers.length % STICKER_EMOJIS.length];
    progress.stickers.push({ date:today, emoji, game: currentGameType, score:gameScore });

    // Update streak
    if (progress.lastPlayDate !== today) {
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      progress.streak = progress.lastPlayDate === yesterday ? (progress.streak||0)+1 : 1;
      progress.lastPlayDate = today;
    }

    // Award XP
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
