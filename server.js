'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'data');
try { fs.mkdirSync(DATA, { recursive: true }); } catch (e) {}
const WAITLIST = path.join(DATA, 'waitlist.jsonl');

app.use(express.json());
// no aggressive caching during active iteration; html always revalidated
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true, maxAge: 0,
  setHeaders: (res, p) => { if (p.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); }
}));

// --- Waitlist capture (v1: append to file + log; pipe to CRM/Sheet once connected) ---
app.post('/api/waitlist', (req, res) => {
  const email = (req.body && req.body.email || '').trim().toLowerCase();
  const company = (req.body && req.body.company || '').trim();
  const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!ok) return res.status(400).json({ ok: false, error: 'Please enter a valid email.' });
  const rec = { email, company, ts: new Date().toISOString(), ua: req.headers['user-agent'] || '' };
  try { fs.appendFileSync(WAITLIST, JSON.stringify(rec) + '\n'); } catch (e) {}
  console.log('[waitlist]', JSON.stringify(rec)); // visible in Railway logs
  res.json({ ok: true });
});

// Simple count (for internal peek)
app.get('/api/waitlist/count', (req, res) => {
  let n = 0;
  try { n = fs.readFileSync(WAITLIST, 'utf8').split('\n').filter(Boolean).length; } catch (e) {}
  res.json({ ok: true, count: n });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log('Ninja AI Workforce site on ' + PORT));
