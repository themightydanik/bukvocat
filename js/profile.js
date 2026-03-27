// ============================================================
// PROFILE
// ============================================================
function saveProfile() {
  const name = document.getElementById('inputName').value.trim();
  if (!name) { document.getElementById('inputName').focus(); return; }
  profile.name = name;
  profile.age = parseInt(document.getElementById('inputAge').value) || 5;
  profile.birthday = document.getElementById('inputBirthday').value || '';
  profile.city = document.getElementById('inputCity').value.trim();
  saveProfileData();
  goMenu();
}

function saveSettingsProfile() {
  profile.name = document.getElementById('sInputName').value.trim() || profile.name;
  profile.age = parseInt(document.getElementById('sInputAge').value) || profile.age;
  profile.birthday = document.getElementById('sInputBirthday').value || profile.birthday;
  profile.city = document.getElementById('sInputCity').value.trim();
  saveProfileData();
  updateMenuHeader();
  soundWin();
}

function saveApiKey() {
  apiKey = document.getElementById('sInputApi').value.trim();
  try { localStorage.setItem('bukvocat_apikey', apiKey); } catch(e){}
  soundWin();
}

function resetProgress() {
  if (!confirm('Сбросить весь прогресс?')) return;
  progress = { stickers:[], dailyScores:{}, bestScores:{}, streak:0, lastPlayDate:'' };
  saveProgress();
  updateMenuHeader();
  updateDailyUI();
  updateGallery();
}
