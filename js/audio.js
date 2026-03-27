// Audio
let audioCtx = null;
function getACtx() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function playTone(freq,type,dur,vol=0.4,delay=0) {
  try {
    const ctx=getACtx(), osc=ctx.createOscillator(), g=ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type=type; osc.frequency.setValueAtTime(freq,ctx.currentTime+delay);
    g.gain.setValueAtTime(vol,ctx.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+delay+dur);
    osc.start(ctx.currentTime+delay); osc.stop(ctx.currentTime+delay+dur+0.05);
  } catch(e){}
}
function soundTap()  { playTone(520,'sine',0.08,0.25); }
function soundWin()  { [523,659,784,1047].forEach((f,i)=>playTone(f,'sine',i===3?0.3:0.15,0.4+i*0.05,i*0.16)); }
function soundLose() { playTone(330,'sawtooth',0.15,0.3); playTone(220,'sawtooth',0.25,0.3,0.2); }

// TTS & Speech Recognition
function stripEmoji(s) {
  return s.replace(/[\u{1F000}-\u{1FFFF}]/gu,'').replace(/[\u{2600}-\u{27BF}]/gu,'').replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu,'').trim();
}
function speak(text, langCode, rate=0.9, pitch=1.1, onEnd=null) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang=langCode; u.rate=rate; u.pitch=pitch;
  if (onEnd) u.onend=onEnd;
  window.speechSynthesis.speak(u);
}

// Animate sound card while speaking
function animateSoundCard(durationMs) {
  const card = document.getElementById('soundCard');
  card.classList.add('playing');
  setTimeout(() => card.classList.remove('playing'), durationMs);
}

// Speak prompt → pause → item (letter or syllable)
function speakPromptThenItem() {
  const q = questions[current]; if (!q) return;
  const L = LANGS[lang];
  const prompt = stripEmoji(currentGameType === 'syllable' ? L.promptSyllable : L.prompt);
  animateSoundCard(2000);
  speak(prompt, L.lang, 0.88, 1.05, () => {
    setTimeout(() => speakCurrentItem(), 4500);
  });
}

// Speak just the current letter or syllable (also called on repeat tap)
function speakCurrentItem() {
  const q = questions[current]; if (!q) return;
  animateSoundCard(1200);
  const rate = currentGameType === 'syllable' ? 0.7 : 0.6;
  speak(q.spoken, LANGS[lang].lang, rate, 1.1);
}

// Called when tapping the sound card (repeat)
function repeatSound() {
  speakCurrentItem();
}

function speakEval(msg) {
  setTimeout(() => speak(stripEmoji(msg), LANGS[lang].lang, 0.85, 1.2), 900);
}
