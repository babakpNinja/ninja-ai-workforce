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
