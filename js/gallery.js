// ============================================================
// GALLERY
// ============================================================
function updateGallery() {
  const u = LANGS[lang].ui;
  const grid = document.getElementById('stickersGrid');
  const total = Math.max(12, progress.stickers.length + 4);
  grid.innerHTML = '';
  for (let i=0; i<total; i++) {
    const slot = document.createElement('div');
    slot.className = 'sticker-slot' + (i >= progress.stickers.length ? ' empty' : '');
    if (i < progress.stickers.length) {
      const s = progress.stickers[i];
      slot.textContent = s.emoji;
      const dateEl = document.createElement('div');
      dateEl.className = 'sticker-date';
      dateEl.textContent = s.date.slice(5); // MM-DD
      slot.appendChild(dateEl);
    }
    grid.appendChild(slot);
  }

  // Prize
  const count = progress.stickers.length;
  const need = Math.max(0, 3 - count);
  document.getElementById('prizeNeed').textContent = need;
  document.getElementById('prizeLocked').style.display = need > 0 ? '' : 'none';
  document.getElementById('btnGetStory').style.display = need <= 0 ? '' : 'none';
}
