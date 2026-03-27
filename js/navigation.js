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

// ============================================================
// MENU UI
// ============================================================
function todayKey() { return new Date().toISOString().slice(0,10); }

function updateMenuHeader() {
  const u = LANGS[lang].ui;
  const greeting = profile.name ? `${profile.name}!` : '!';
  document.getElementById('menuGreeting').textContent = greeting;

  const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  const now = new Date();
  document.getElementById('menuDate').textContent = now.toLocaleDateString(LANGS[lang].lang, {weekday:'long', day:'numeric', month:'long'});

  // Check birthday
  if (profile.birthday) {
    const bd = new Date(profile.birthday);
    if (bd.getDate() === now.getDate() && bd.getMonth() === now.getMonth()) {
      document.getElementById('menuGreeting').textContent = `🎂 ${profile.name || ''}!`;
    }
  }

  // Streak
  updateStreak();
  document.getElementById('streakBadge').textContent = `🔥 ${progress.streak}`;

  const bestL = progress.bestScores?.letter;
  document.getElementById('gcardBest0').textContent = u.gameBestPre + (bestL !== undefined ? `${bestL}/${TOTAL}` : '—');
}

function updateStreak() {
  const today = todayKey();
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if (progress.lastPlayDate === today) return; // already counted today
  if (progress.lastPlayDate === yesterday) {
    // streak continues — will be updated when game is played
  } else if (progress.lastPlayDate && progress.lastPlayDate !== yesterday) {
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
  const u = LANGS[lang].ui;
  const bestL = progress.bestScores?.letter;
  const bestS = progress.bestScores?.syllable;
  document.getElementById('gcardBest0').textContent = u.gameBestPre + (bestL !== undefined ? `${bestL}/${TOTAL}` : '—');
  const el1 = document.getElementById('gcardBest1');
  if (el1) el1.textContent = u.gameBestPre + (bestS !== undefined ? `${bestS}/${TOTAL}` : '—');
}
