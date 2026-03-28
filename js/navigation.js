// ============================================================
// NAVIGATION
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active','slide-in'); });
  const el = document.getElementById(id);
  el.classList.add('active','slide-in');
  el.scrollTop = 0;
}

function goMenu() {
  window.speechSynthesis.cancel();
  updateMenuHeader();
  updateDailyUI();
  updateBestScores();
  showScreen('screen-menu');
}

function goGallery() {
  updateGallery();
  showScreen('screen-gallery');
}

function goSettings() {
  document.getElementById('sInputName').value = profile.name;
  document.getElementById('sInputAge').value = profile.age;
  document.getElementById('sInputBirthday').value = profile.birthday;
  document.getElementById('sInputCity').value = profile.city;
  document.getElementById('sInputApi').value = apiKey;
  showScreen('screen-settings');
}

function goStory() {
  showScreen('screen-story');
  generateStory();
}

function goSubject(key) {
  currentSubject = key;
  const subj = SUBJECTS.find(s => s.key === key);
  const u = LANGS[lang].ui;

  // Title
  const titleMap = { reading: u.subjectReading, math: u.subjectMath, languages: u.subjectLanguages };
  document.getElementById('subjectScreenTitle').textContent = titleMap[key] || key;

  // Subject XP bar
  const sxp = (progress.subjectXP || {})[key] || 0;
  const slv = getLevel(sxp);
  document.getElementById('subjectHeaderEmoji').textContent = subj.emoji;
  document.getElementById('subjectLevelName').textContent = slv.emoji + ' ' + slv.name;
  document.getElementById('subjectXPText').textContent = `${sxp} XP · ${u.levelLabel} ${slv.num}`;
  document.getElementById('subjectBarFill').style.width = slv.pct + '%';
  document.getElementById('subjectBarFill').style.background =
    `linear-gradient(90deg, ${subj.color}, ${subj.dark})`;

  // Build games grid
  const grid = document.getElementById('subjectGamesGrid');
  grid.innerHTML = '';
  subj.games.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card' + (g.locked ? ' locked' : '');
    if (!g.locked) card.onclick = () => startGame(g.type);

    const best = progress.bestScores?.[g.type];
    const bestTxt = g.locked
      ? u.comingSoon || '🔒'
      : (best !== undefined ? `${u.gameBestPre}${best}/${TOTAL}` : '—');

    card.innerHTML = `
      <div class="game-emoji">${g.emoji}</div>
      <div class="game-name">${u.subjectGameNames?.[g.type] || g.type}</div>
      <div class="game-best">${bestTxt}</div>
      ${g.locked ? '<div class="game-lock">🔒</div>' : ''}
    `;
    grid.appendChild(card);
  });

  // Sync bottom nav labels
  const navIds = [['sNavHome','navHome'],['sNavGallery','navGallery'],['sNavSettings','navSettings']];
  navIds.forEach(([sid, mid]) => {
    const mel = document.getElementById(mid);
    const sel = document.getElementById(sid);
    if (mel && sel) sel.textContent = mel.textContent;
  });

  showScreen('screen-subject');
}

// ============================================================
// MENU UI
// ============================================================
function todayKey() { return new Date().toISOString().slice(0,10); }

function updateMenuHeader() {
  const u = LANGS[lang].ui;
  const greeting = profile.name ? `${profile.name}!` : '!';
  document.getElementById('menuGreeting').textContent = greeting;
  const now = new Date();
  document.getElementById('menuDate').textContent = now.toLocaleDateString(
    LANGS[lang].lang, {weekday:'long', day:'numeric', month:'long'}
  );

  // Birthday check
  if (profile.birthday) {
    const bd = new Date(profile.birthday);
    if (bd.getDate() === now.getDate() && bd.getMonth() === now.getMonth()) {
      document.getElementById('menuGreeting').textContent = `🎂 ${profile.name || ''}!`;
    }
  }

  // Streak
  updateStreak();
  document.getElementById('streakBadge').textContent = `🔥 ${progress.streak}`;

  // Global level
  const xp = progress.xp || 0;
  const lv = getLevel(xp);
  document.getElementById('levelEmoji').textContent = lv.emoji;
  document.getElementById('levelName').textContent = lv.name;
  document.getElementById('levelNum').textContent = `${u.levelLabel} ${lv.num}`;
  document.getElementById('levelXP').textContent = `${xp} XP`;
  document.getElementById('levelBarFill').style.width = lv.pct + '%';

  // Subject cards
  const grid = document.getElementById('subjectsGrid');
  grid.innerHTML = '';
  SUBJECTS.forEach(s => {
    const sxp = (progress.subjectXP || {})[s.key] || 0;
    const slv = getLevel(sxp);
    const name = { reading: u.subjectReading, math: u.subjectMath, languages: u.subjectLanguages }[s.key] || s.key;
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.setProperty('--subj-color', s.color);
    card.style.setProperty('--subj-dark', s.dark);
    card.onclick = () => goSubject(s.key);
    card.innerHTML = `
      <div class="subject-emoji">${s.emoji}</div>
      <div class="subject-name">${name}</div>
      <div class="subject-xp-bar">
        <div class="subject-xp-fill" style="width:${slv.pct}%;background:${s.color}"></div>
      </div>
      <div class="subject-xp-label">${sxp} XP</div>
    `;
    grid.appendChild(card);
  });
}

function updateStreak() {
  const today = todayKey();
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if (progress.lastPlayDate === today) return;
  if (progress.lastPlayDate && progress.lastPlayDate !== yesterday) {
    progress.streak = 0;
  }
}

function updateDailyUI() {
  const u = LANGS[lang].ui;
  const today = todayKey();
  const todayStickers = progress.stickers.filter(s => s.date === today).length;
  for (let i=0;i<3;i++) {
    const star = document.getElementById(`dstar${i}`);
    if (star) star.classList.toggle('earned', i < todayStickers);
  }
  const sub = document.getElementById('dailySub');
  if (sub) sub.textContent = todayStickers >= 3 ? u.dailyDone : u.dailySub;
}

function updateBestScores() {
  // Best scores are now shown inside subject screen dynamically — no-op here
}
