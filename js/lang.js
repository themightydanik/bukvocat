// ============================================================
// LANGUAGE
// ============================================================
function setLang(l) {
  lang = l;
  try { localStorage.setItem('bukvocat_lang', l); } catch(e){}
  document.querySelectorAll('.lang-btn').forEach(b => {
    const id = b.id || '';
    b.classList.toggle('active',
      b.textContent.includes(l==='ru'?'RU':l==='uk'?'UA':l==='en'?'GB':'') ||
      b.getAttribute('onclick')?.includes(`'${l}'`)
    );
  });
  updateAllUI();
}

function updateAllUI() {
  const u = LANGS[lang].ui;
  // Profile screen
  setTxt('profileTitle', u.profileTitle);
  setTxt('profileSubtitle', u.profileSub);
  setTxt('labelName', u.labelName); setTxt('labelAge', u.labelAge);
  setTxt('labelBirthday', u.labelBirthday); setTxt('labelCity', u.labelCity + ' ');
  document.getElementById('btnStartProfile').textContent = u.go;
  // Menu
  setTxt('menuSectionGames', u.menuGames);
  setTxt('navHome', u.navHome); setTxt('navGallery', u.navGallery); setTxt('navSettings', u.navSettings);
  setTxt('gcardName0', u.gameNames[0]); setTxt('gcardName1', u.gameNames[1]);
  setTxt('gcardName2', u.gameNames[2]); setTxt('gcardName3', u.gameNames[3]);
  setTxt('dailyLabel', u.dailyLabel);
  // Gallery
  setTxt('galleryTitle', u.galleryTitle);
  setTxt('prizeTitle', u.prizeTitle); setTxt('prizeDesc', u.prizeDesc);
  document.getElementById('btnGetStory').textContent = u.getStory;
  // Story
  setTxt('storyScreenTitle', u.storyTitle);
  setTxt('storyLoadingText', u.loadingText);
  setTxt('btnReadStory', u.readAloud); setTxt('btnNewStory', u.newStory);
  // Settings
  setTxt('settingsTitle', u.settingsTitle); setTxt('settingsProfileTitle', u.settingsProfile);
  setTxt('settingsLangTitle', u.settingsLang);
  setTxt('sLabelName', u.sLabelName); setTxt('sLabelAge', u.sLabelAge);
  setTxt('sLabelBirthday', u.sLabelBirthday); setTxt('sLabelCity', u.sLabelCity);
  setTxt('sLabelApi', u.sLabelApi); setTxt('apiKeyNote', u.apiNote);
  setTxt('btnSaveSettings', u.save); setTxt('btnSaveApi', u.saveKey);
  setTxt('btnResetText', u.reset);
  // Game
  setTxt('taskLabel', LANGS[lang].task);
  updateBestScores();
  updateDailyUI();
  updateLangBtns();

  // Subject screen nav labels (sync with menu nav)
  const sNavMap = [['sNavHome','navHome'],['sNavGallery','navGallery'],['sNavSettings','navSettings']];
  sNavMap.forEach(([sid, mid]) => {
    const mel = document.getElementById(mid);
    const sel = document.getElementById(sid);
    if (mel && sel) sel.textContent = mel.textContent;
  });
}

function setTxt(id, txt) { const el=document.getElementById(id); if(el) el.textContent=txt; }

function updateLangBtns() {
  ['ru','uk','en'].forEach(l => {
    ['','m','s'].forEach(prefix => {
      const el = document.getElementById(`${prefix}lang-${l}`);
      if (el) el.classList.toggle('active', l === lang);
    });
    document.querySelectorAll(`.lang-btn`).forEach(b => {
      if (b.getAttribute('onclick') === `setLang('${l}')`) b.classList.toggle('active', l === lang);
    });
  });
}
