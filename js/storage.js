// ============================================================
// STORAGE
// ============================================================
function loadData() {
  try {
    const p = localStorage.getItem('bukvocat_profile');
    if (p) profile = {...profile, ...JSON.parse(p)};
    const pr = localStorage.getItem('bukvocat_progress');
    if (pr) progress = {...progress, ...JSON.parse(pr)};
    const k = localStorage.getItem('bukvocat_apikey');
    if (k) apiKey = k;
    const l = localStorage.getItem('bukvocat_lang');
    if (l) lang = l;
  } catch(e){}
}
function saveProgress() {
  try { localStorage.setItem('bukvocat_progress', JSON.stringify(progress)); } catch(e){}
}
function saveProfileData() {
  try { localStorage.setItem('bukvocat_profile', JSON.stringify(profile)); } catch(e){}
}
