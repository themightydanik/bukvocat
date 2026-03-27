// ============================================================
// ANIMATIONS
// ============================================================
function triggerCatMood(mood) {
  const c = document.getElementById('catSvg');
  c.className = 'cat-svg ' + mood;
  setTimeout(() => c.className = 'cat-svg', 900);
}
function spawnConfetti() {
  const colors=['#FF6B35','#4ECDC4','#FFE66D','#A855F7','#22C55E','#FF6B8A'];
  for(let i=0;i<28;i++){
    const el=document.createElement('div'); el.className='confetti-piece';
    el.style.left=Math.random()*100+'vw'; el.style.top='-20px';
    el.style.background=colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDuration=(0.8+Math.random()*1.2)+'s';
    el.style.animationDelay=(Math.random()*0.5)+'s';
    el.style.borderRadius=Math.random()>0.5?'50%':'3px';
    document.body.appendChild(el); setTimeout(()=>el.remove(),2500);
  }
}
function spawnStars(btn) {
  const r=btn.getBoundingClientRect();
  ['⭐','🌟','✨'].forEach((s,i)=>{
    const el=document.createElement('div'); el.className='star-pop';
    el.textContent=s;
    el.style.left=(r.left+r.width/2-14+(i-1)*30)+'px';
    el.style.top=r.top+'px';
    el.style.animationDelay=i*0.1+'s';
    document.body.appendChild(el); setTimeout(()=>el.remove(),1200);
  });
}
