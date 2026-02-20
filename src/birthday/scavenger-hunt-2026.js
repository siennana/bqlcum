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
      }
    });
  }

  // When Challenge 3 is completed, show final dialog
  const challenge3Btn = document.getElementById('challenge3Btn');
  if (challenge3Btn) {
    challenge3Btn.addEventListener('click', () => {
      try {
        alert('Final Clue: call Willie');
      } catch (e) {
        console.log('Final Clue: call Willie');
      }
    });
  }
});
