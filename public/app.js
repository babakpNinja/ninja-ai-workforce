'use strict';
// Waitlist form
const form = document.getElementById('wl-form');
const msg = document.getElementById('wl-msg');
if (form) form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('wl-email').value.trim();
  const company = document.getElementById('wl-company').value.trim();
  msg.className = 'wl-msg'; msg.textContent = '';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    msg.className = 'wl-msg err'; msg.textContent = 'Please enter a valid email.'; return;
  }
  const btn = form.querySelector('button'); const old = btn.textContent;
  btn.disabled = true; btn.textContent = 'Joining…';
  try {
    const r = await fetch('/api/waitlist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, company }) });
    const d = await r.json();
    if (d.ok) { msg.className='wl-msg ok'; msg.textContent="🎉 You're on the list — we'll email your early-access invite."; form.reset(); }
    else { msg.className='wl-msg err'; msg.textContent = d.error || 'Something went wrong.'; }
  } catch (err) {
    msg.className='wl-msg err'; msg.textContent='Network error — please try again.';
  } finally { btn.disabled=false; btn.textContent=old; }
});

// Reveal on scroll (progressive enhancement — content is visible by default)
(function(){
  var els = Array.prototype.slice.call(document.querySelectorAll('.sec-head,.cmp-card,.team-card,.cap,.uc,.chat,.ent-in,.stat'));
  if(!els.length) return;
  document.documentElement.classList.add('rv-on');      // only now do we hide-then-animate
  els.forEach(function(el){ el.setAttribute('data-rv',''); });
  var reveal=function(el){ el.classList.add('rv-in'); };
  if(!('IntersectionObserver' in window)){ els.forEach(reveal); return; }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ reveal(en.target); io.unobserve(en.target); } });
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){ io.observe(el); });
  // failsafe: never leave anything hidden
  setTimeout(function(){ els.forEach(reveal); }, 1600);
})();
