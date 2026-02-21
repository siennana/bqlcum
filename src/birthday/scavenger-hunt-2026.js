document.addEventListener('DOMContentLoaded', function() {
  // Phase 2: single-char passcode inputs
  const pass2Inputs = Array.from(document.querySelectorAll('.pass2-input'));
  const pass2Btn = document.getElementById('pass2Btn');
  const correct = ['s','h','i','n','e'];

  pass2Inputs.forEach((el, idx) => {
    // ensure no browser autofill
    el.autocomplete = 'off';

    // on input: keep single character, uppercase, and auto-advance
    el.addEventListener('input', (e) => {
      let v = e.target.value || '';
      if (v.length > 1) v = v.slice(-1);
      v = v.toUpperCase();
      e.target.value = v;
      if (v && idx < pass2Inputs.length - 1) {
        pass2Inputs[idx + 1].focus();
        pass2Inputs[idx + 1].select && pass2Inputs[idx + 1].select();
      }
    });

    // key handling for navigation and backspace
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (el.value === '' && idx > 0) {
          // move focus to previous and clear it
          pass2Inputs[idx - 1].focus();
          pass2Inputs[idx - 1].value = '';
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        pass2Inputs[idx - 1].focus();
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && idx < pass2Inputs.length - 1) {
        pass2Inputs[idx + 1].focus();
        e.preventDefault();
      }
    });

    // handle paste across inputs
    el.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\s+/g,'').slice(0, pass2Inputs.length - idx);
      for (let i = 0; i < paste.length; i++) {
        if (idx + i < pass2Inputs.length) {
          pass2Inputs[idx + i].value = paste[i].toUpperCase();
        }
      }
      const nextIndex = Math.min(pass2Inputs.length - 1, idx + paste.length);
      pass2Inputs[nextIndex].focus();
    });

    // focus selects content for convenience
    el.addEventListener('focus', () => {
      el.select && el.select();
    });
  });

  function checkPass2() {
    const val = pass2Inputs.map(i => (i.value || '').toLowerCase()).join('');
    console.log(val);
    return val === correct.join('');
  }

  if (pass2Btn) {
    pass2Btn.addEventListener('click', function() {
      if (checkPass2()) {
        console.log('Passcode correct');
        doPass2Action();
      } else {
        pass2Inputs.forEach(i => { i.value = ''; });
        pass2Inputs[0] && pass2Inputs[0].focus();
      }
    });
  }

  function doPass2Action() {
    // mark inputs as correct: keep characters and highlight
    pass2Inputs.forEach(i => {
      i.classList.add('correct');
      i.disabled = true;
    });
    // reveal only Challenge 1 body; leave others locked
    const c1 = document.querySelector('.challenge-1');
    if (c1) {
      const def = c1.querySelector('.default');
      const body = c1.querySelector('.body');
      if (def) def.style.display = 'none';
      if (body) body.style.display = 'flex';
    }
    console.log('Passcode correct — inputs locked, highlighted, and challenges revealed');
  }

  // When Challenge 1 is completed, reveal Challenge 2
  const challenge1Btn = document.getElementById('challenge1Btn');
  if (challenge1Btn) {
    challenge1Btn.addEventListener('click', () => {
      const c2 = document.querySelector('.challenge-2');
      if (c2) {
        const def = c2.querySelector('.default');
        const body = c2.querySelector('.body');
        if (def) def.style.display = 'none';
        if (body) body.style.display = 'flex';
      }
    });
  }

  // When Challenge 2 is completed, reveal Challenge 3
  const challenge2Btn = document.getElementById('challenge2Btn');
  if (challenge2Btn) {
    challenge2Btn.addEventListener('click', () => {
      const c3 = document.querySelector('.challenge-3');
      if (c3) {
        const def = c3.querySelector('.default');
        const body = c3.querySelector('.body');
        if (def) def.style.display = 'none';
        if (body) body.style.display = 'flex';
        // clear any existing values in the C3 inputs (except Ben)
        c3Inputs.forEach((inp, idx) => { if (idx > 0) inp.value = ''; });
      }
    });
  }

  // Challenge 2 timer: start button and countdown (with milliseconds)
  const challenge2StartBtn = document.getElementById('challenge2StartBtn');
  const challenge2TimerEl = document.getElementById('challenge2Timer');
  let challenge2Interval = null;
  // milliseconds remaining (5 minutes = 300000 ms)
  let challenge2RemainingMs = 300000;

  function formatTimeMs(ms) {
    if (ms <= 0) return '00:00.00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10); // two-digit centiseconds
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    const c = centis.toString().padStart(2, '0');
    return `${m}:${s}.${c}`;
  }

  // initialize display
  if (challenge2TimerEl) challenge2TimerEl.textContent = formatTimeMs(challenge2RemainingMs);

  if (challenge2StartBtn) {
    challenge2StartBtn.addEventListener('click', () => {
      if (challenge2Interval) return; // already running
      // reset and start
      challenge2RemainingMs = 300000;
      if (challenge2TimerEl) challenge2TimerEl.textContent = formatTimeMs(challenge2RemainingMs);
      challenge2StartBtn.disabled = true;
      challenge2Interval = setInterval(() => {
        challenge2RemainingMs -= 100; // decrement by 100ms
        if (challenge2RemainingMs <= 0) {
          clearInterval(challenge2Interval);
          challenge2Interval = null;
          if (challenge2TimerEl) challenge2TimerEl.textContent = 'times up!';
          challenge2StartBtn.disabled = false;
          return;
        }
        if (challenge2TimerEl) challenge2TimerEl.textContent = formatTimeMs(challenge2RemainingMs);
      }, 100);
    });
  }

  // When Challenge 3 is completed, reveal Challenge 4
  const challenge3Btn = document.getElementById('challenge3Btn');
  if (challenge3Btn) {
    challenge3Btn.addEventListener('click', () => {
      const c4 = document.querySelector('.challenge-4');
      if (c4) {
        const def = c4.querySelector('.default');
        const body = c4.querySelector('.body');
        if (def) def.style.display = 'none';
        if (body) body.style.display = 'flex';
      }
    });
  }

  // When Challenge 4 is completed, show final dialog
  const challenge4Btn = document.getElementById('challenge4Btn');
  if (challenge4Btn) {
    challenge4Btn.addEventListener('click', () => {
      try {
        alert('Call Willie');
      } catch (e) {
        console.log('Call Willie');
      }
    });
  }

  // Challenge 3: randomize names into the four textboxes (first textbox fixed to Ben)
  const names = ['srinath','sienna','jasmine','alex','koushik','brad','uri','eli', 'Andrew'];
  const rules = ['shoot every shot behind the back', 'shoot every shot with a bridge', 'cannot play with a regular pool stick'];
  const c3Inputs = [
    document.getElementById('c3-0'),
    document.getElementById('c3-1'),
    document.getElementById('c3-2'),
    document.getElementById('c3-3')
  ].filter(Boolean);
  const c3Rule1 = document.getElementById('c3-rule-1');
  const c3Rule2 = document.getElementById('c3-rule-2');

  // ensure first box is Ben and readonly
  if (c3Inputs[0]) {
    c3Inputs[0].value = 'Ben';
    c3Inputs[0].readOnly = true;
  }
  // ensure other C3 boxes are blank until randomized
  for (let i = 1; i < c3Inputs.length; i++) {
    if (c3Inputs[i]) c3Inputs[i].value = '';
  }

  const randomBtn = document.getElementById('challenge3RandomBtn');
  function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      // pick unique names for inputs 1..3
      const pool = names.slice();
      shuffleArray(pool);
      // take first 3 names
      const picks = pool.slice(0, 3);
      // assign to c3-1, c3-2, c3-3
      for (let i = 1; i < c3Inputs.length; i++) {
        if (c3Inputs[i]) {
          c3Inputs[i].value = picks[i - 1] || '';
        }
      }
      // randomize rules (no duplicates) into rule boxes
      const rulePool = rules.slice();
      shuffleArray(rulePool);
      if (c3Rule1) c3Rule1.value = rulePool[0] || '';
      if (c3Rule2) c3Rule2.value = rulePool[1] || '';
    });
  }

  // ensure rule boxes are blank until randomized
  if (c3Rule1) c3Rule1.value = '';
  if (c3Rule2) c3Rule2.value = '';
});
