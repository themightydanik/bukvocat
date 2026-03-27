// ============================================================
// INIT
// ============================================================
function init() {
  loadData();
  updateAllUI();

  // If no profile yet — show profile screen, else menu
  if (!profile.name) {
    showScreen('screen-profile');
  } else {
    goMenu();
  }
}

window.addEventListener('DOMContentLoaded', init);
