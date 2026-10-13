/* Sections from the Student Wellbeing Portal (helpie.skpp111.edu.my): emotion cards, spelling game,
 * memory game, activities and Share Your Story. Words come from PORTAL (portal-content.js) or, for text the
 * portal wrote inline, from S below, copied as written. */
'use strict';
window.H = window.H || {};

(() => {
  const { esc, t, L } = H;
  const EMOTIONS = PORTAL.emotions;
  const byKey = key => EMOTIONS.find(e => e.emotion === key);
  const name = e => (H.lang() === 'bm' ? e.bm : e.en);
  const altName = e => (H.lang() === 'bm' ? e.en : e.bm);
  const meaning = e => (H.lang() === 'bm' ? e.shortMeaningBM : e.shortMeaningEN);
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // "🎭 Perasaan / Feelings" -> { emoji: "🎭", text: "Perasaan / Feelings" }
  const splitEmoji = s => { const m = s.match(/^(\P{L}+?)\s+(.*)$/u); return m ? { emoji: m[1], text: m[2] } : { emoji: '', text: s }; };

  // Text the portal wrote inline in its page code rather than in its translation table.
  const S = {
    subtitle: { bm: 'Teroka emosi melalui permainan dan aktiviti yang menyeronokkan!', en: 'Explore emotions through fun games and activities!' },
    shareTitle: { bm: '📖 Kongsi Cerita Anda', en: '📖 Share Your Story' },
    step1: { bm: 'Langkah 1: Pilih emosi yang anda rasa', en: 'Step 1: Choose the emotion you felt' },
    step2: { bm: 'Langkah 2: Beritahu kami tentang diri anda', en: 'Step 2: Tell us about yourself' },
    nameLabel: { bm: '👤 Nama Anda (Pilihan):', en: '👤 Your Name (Optional):' },
    namePh: { bm: 'Masukkan nama anda', en: 'Enter your name' },
    classLabel: { bm: '🏫 Kelas: *', en: '🏫 Class: *' },
    classPh: { bm: 'Pilih kelas anda', en: 'Select your class' },
    back: { bm: '← Kembali', en: '← Back' },
    next: { bm: 'Teruskan →', en: 'Continue →' },
    step3: { bm: 'Langkah 3: Tulis atau jana cerita anda', en: 'Step 3: Write or generate your story' },
    aiTitle: { bm: 'Jana Cerita AI', en: 'AI Story Generator' },
    aiDesc: { bm: 'Biarkan AI bantu anda menulis cerita', en: 'Let AI help you write a story' },
    aiBusy: { bm: '⏳ Menjana cerita...', en: '⏳ Generating story...' },
    writeTitle: { bm: 'Tulis Sendiri', en: 'Write Yourself' },
    writeDesc: { bm: 'Tulis cerita anda sendiri dari awal', en: 'Write your own story from scratch' },
    titleLabel: { bm: '📌 Tajuk Cerita: *', en: '📌 Story Title: *' },
    titlePh: { bm: 'Contoh: Hari Saya Menang Pertandingan', en: 'Example: The Day I Won the Competition' },
    storyLabel: { bm: '📝 Cerita Anda: *', en: '📝 Your Story: *' },
    chars: { bm: 'aksara', en: 'characters' },
    support: { bm: '🆘 Saya perlukan bantuan lanjut', en: '🆘 I need additional support' },
    parent: { bm: 'Ibu Bapa', en: 'Parents' },
    counselor: { bm: 'Kaunselor', en: 'Counselor' },
    teacher: { bm: 'Guru Kelas', en: 'Class Teacher' },
    changeMethod: { bm: '← Tukar Kaedah', en: '← Change Method' },
    review: { bm: 'Semak Cerita →', en: 'Review Story →' },
    reviewTitle: { bm: 'Semak Cerita Anda', en: 'Review Your Story' },
    step4: { bm: 'Langkah 4: Pastikan semua maklumat betul sebelum hantar', en: 'Step 4: Make sure all information is correct before submitting' },
    nameK: { bm: 'Nama:', en: 'Name:' },
    classK: { bm: 'Kelas:', en: 'Class:' },
    emotionK: { bm: 'Emosi:', en: 'Emotion:' },
    supportK: { bm: 'Bantuan:', en: 'Support:' },
    editStory: { bm: '✍️ Edit Cerita', en: '✍️ Edit Story' },
    submit: { bm: '📥 Hantar Cerita', en: '📥 Submit Story' },
    doneTitle: { bm: 'Cerita Berjaya Dihantar!', en: 'Story Successfully Submitted!' },
    doneSub: { bm: 'Terima kasih kerana berkongsi perasaan anda!', en: 'Thank you for sharing your feelings!' },
    keepRef: { bm: 'Simpan nombor ini untuk rujukan masa depan', en: 'Save this number for future reference' },
    yourStoryK: { bm: 'Cerita Anda:', en: 'Your Story:' },
    editAfter: { bm: '✏️ Edit Cerita', en: '✏️ Edit Story' },
    another: { bm: '📖 Kongsi Cerita Lain', en: '📖 Share Another Story' },
    backHome: { bm: '🏠 Kembali ke Laman Utama', en: '🏠 Back to Home' },
    notAlone: { bm: '💚 Anda tidak bersendirian', en: '💚 You are not alone' },
    notAloneText: { bm: 'Pentadbir sekolah akan menyemak cerita anda dan memberikan sokongan yang diperlukan.', en: 'School administrators will review your story and provide the support you need.' },
    editTitleK: { bm: 'Tajuk:', en: 'Title:' },
    editStoryK: { bm: 'Cerita:', en: 'Story:' },
    cancel: { bm: 'Batal', en: 'Cancel' },
    save: { bm: '💾 Simpan', en: '💾 Save' },
    saved: { bm: '✅ Cerita berjaya dikemaskini!', en: '✅ Story successfully updated!' },
    saveFailed: { bm: '❌ Gagal mengemas kini cerita', en: '❌ Failed to update story' },
    fillAll: { bm: '⚠️ Sila isi semua ruangan!', en: '⚠️ Please fill all fields!' },
    someStudent: { bm: 'seorang pelajar', en: 'a student' },
    generatedTitle: { bm: e => `Hari Saya Berasa ${e.bm}`, en: e => `The Day I Felt ${e.en}` },
    madeFace: { bm: e => `${t('greatJob')} ${e.bm}! ${e.emoji}`, en: e => `${t('greatJob')} ${e.en} face! ${e.emoji}` },
  };
  H.PORTAL_SUBTITLE = S.subtitle;

  /* ---------- score (shown on the cards and games pages, kept for this browser tab) ---------- */

  let score = { total: 0, stars: 0 };
  try { score = JSON.parse(sessionStorage.getItem('helpie-score')) || score; } catch {}
  const addScore = (points, stars) => {
    score.total += points; score.stars += stars;
    try { sessionStorage.setItem('helpie-score', JSON.stringify(score)); } catch {}
  };
  const scoreBar = () => `
    <div class="scorebar card" aria-label="${esc(t('totalScore'))}">
      <div><span>${t('totalScore')}</span><b>🏆 ${score.total}</b></div>
      <div><span>${t('starsEarned')}</span><b>⭐ ${score.stars}</b></div>
    </div>`;

  const head = (key, lead, icon) => {
    const { emoji, text } = splitEmoji(typeof key === 'string' ? t(key) : L(key));
    return H.pageHead({ icon: `<span class="emoji" aria-hidden="true">${icon || emoji}</span>`, eyebrow: H.t(H.GROUP_LABEL.learn), title: esc(text), lead });
  };

  const record = fields => H.api.createRecord({ refNo: H.refNumber(), name: null, class: null, status: 'Activity', ...fields });

  /* ---------- emotion cards ---------- */

  let deck = shuffle(EMOTIONS);

  const emotionsPage = {
    slug: 'emotions', group: 'learn', accent: 'purple', icon: { emoji: '🎭' }, track: 'Emotion Cards',
    title: () => t('emotionCards'), kind: { bm: 'Kad · 12 emosi', en: 'Cards · 12 emotions' },
    render: () => `
      ${head('feelingsTitle', esc(t('clickEmotion')))}
      ${scoreBar()}
      <div class="toolbar"><button class="btn primary" type="button" data-act="shuffle">${t('shuffleCards')}</button></div>
      <div class="emo-grid">
        ${deck.map(e => `
          <button class="emo-card" type="button" data-emotion="${e.emotion}" style="--emo:${e.color}">
            <span class="emo-face" aria-hidden="true">${e.emoji}</span>
            <span class="emo-name">${esc(name(e))}</span>
            <span class="emo-alt">(${esc(altName(e))})</span>
          </button>`).join('')}
      </div>`,
    mount(root) {
      root.addEventListener('click', e => {
        if (e.target.closest('[data-act=shuffle]')) {
          deck = shuffle(EMOTIONS);
          H.toast(t('cardsShuffled'));
          H.rerender();
          return;
        }
        const card = e.target.closest('[data-emotion]');
        if (card) openEmotion(byKey(card.dataset.emotion));
      });
    },
  };

  function openEmotion(e) {
    const d = H.openModal(`
      <div class="emo-modal" style="--emo:${e.color}">
        <div class="emo-modal-face" aria-hidden="true">${e.emoji}</div>
        <h2>${esc(name(e))}</h2>
        <p class="emo-alt">(${esc(altName(e))})</p>
        <p class="emo-meaning">${esc(meaning(e))}</p>
        <button class="btn primary" type="button" data-face>${t('canMakeFace')}</button>
      </div>`, 'modal-small');
    d.querySelector('[data-face]').addEventListener('click', () => {
      H.closeModal();
      record({ emotionEmoji: e.emoji, emotionLabel: e.emotion, keywords: 'Emotion Recognition', title: 'Emotion Face Activity', story: 'Student recognized and made a ' + e.emotion + ' face', activityType: 'Emotion Face' });
      H.confetti();
      H.toast(L(S.madeFace)(e));
      addScore(10, 1);
      H.rerender();
    }, { once: true });
  }

  /* ---------- spelling game ---------- */

  const sp = { card: null, input: '', attempts: 3, difficulty: 'easy', stars: 0 };
  const nextWord = () => { sp.card = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]; sp.input = ''; sp.attempts = 3; };
  const answer = () => name(sp.card).toLowerCase();

  const spellingPage = {
    slug: 'spelling', group: 'learn', accent: 'green', icon: { emoji: '📝' }, track: 'Spelling Game',
    title: () => t('spellingGame'), kind: { bm: 'Permainan · 3 cubaan', en: 'Game · 3 attempts' },
    render() {
      if (!sp.card) nextWord();
      const word = answer();
      return `
        ${head('spellingTitle', esc(t('typeEmotion')))}
        ${scoreBar()}
        <div class="card stats">
          <div><span>${t('starsCollected')}</span><b>⭐ ${sp.stars}</b></div>
          <div><span>${t('attemptsLeft')}</span><b>${'❤️'.repeat(sp.attempts)}${'🤍'.repeat(3 - sp.attempts)}</b></div>
          <div>
            <span id="diff-label">${t('difficulty')}</span>
            <div class="segmented" role="group" aria-labelledby="diff-label">
              ${['easy', 'medium'].map(l => `<button type="button" data-diff="${l}" aria-pressed="${sp.difficulty === l}">${t(l)}</button>`).join('')}
            </div>
          </div>
        </div>
        <form class="card spell" autocomplete="off">
          <div class="spell-face" style="--emo:${sp.card.color}" aria-hidden="true">${sp.card.emoji}</div>
          <label class="spell-prompt" for="spell-input">${t('typeEmotion')}</label>
          <p class="spell-blanks" aria-hidden="true">${[...word].map(c => (c === ' ' ? '&nbsp;' : '_')).join(' ')}</p>
          <p class="spell-hint">${t('hint')}: ${word.length} ${t('letters')}${sp.difficulty === 'easy' ? `, ${t('startsWith')} “${word[0].toUpperCase()}”` : ''}</p>
          <input id="spell-input" class="spell-input" value="${esc(sp.input)}" placeholder="${esc(t('typeHere'))}" autocapitalize="off" spellcheck="false" enterkeyhint="done">
          <div class="btn-row center">
            <button class="btn primary" type="submit">${t('checkAnswer')}</button>
            <button class="btn secondary" type="button" data-act="skip">${t('skip')}</button>
          </div>
        </form>`;
    },
    mount(root) {
      const input = root.querySelector('#spell-input');
      input.addEventListener('input', () => (sp.input = input.value));
      // Keep typing after Check / Skip, but don't pop up a phone keyboard on first arrival.
      if (H.rerendering) input.focus({ preventScroll: true });
      root.addEventListener('click', e => {
        const d = e.target.closest('[data-diff]');
        if (d) {
          sp.difficulty = d.dataset.diff;
          H.toast(`${t('difficultySet')} ${t(sp.difficulty)}!`);
          H.rerender(true);
        }
        if (e.target.closest('[data-act=skip]')) {
          nextWord();
          H.toast(t('skipped'));
          H.rerender(true);
        }
      });
      root.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        checkSpelling();
      });
    },
  };

  function checkSpelling() {
    const guess = sp.input.trim().toLowerCase();
    const word = answer();
    if (!guess) return;
    if (guess === word) {
      record({ emotionEmoji: sp.card.emoji, emotionLabel: word, keywords: 'Spelling Correct', title: 'Spelling Game - Correct Answer', story: 'Student correctly spelled "' + word + '"', activityType: 'Spelling Game' });
      H.toast(`${t('correct')} “${word}”!`);
      sp.stars += 1;
      H.starBurst();
      nextWord();
    } else if (--sp.attempts > 0) {
      const hint = `${t('hint')}: ${word.length} ${t('letters')}` + (sp.difficulty === 'easy' ? `, ${t('startsWith')} “${word[0].toUpperCase()}”` : '');
      H.toast(`${t('tryAgain')} ${hint}`, 'warning');
    } else {
      H.toast(`${t('outOfAttempts')} “${word}”.`, 'error');
      nextWord();
    }
    H.rerender(true);
  }

  /* ---------- memory game ---------- */

  const mem = { cards: [], open: [], matched: 0, moves: 0, time: 0, timer: null, difficulty: 'normal', started: false };
  const pairsFor = d => (d === 'easy' ? 6 : 8);

  function newMemoryGame() {
    clearInterval(mem.timer);
    const picked = shuffle(EMOTIONS).slice(0, pairsFor(mem.difficulty));
    mem.cards = shuffle(picked.flatMap(e => [{ e, state: '' }, { e, state: '' }]));
    Object.assign(mem, { open: [], matched: 0, moves: 0, time: 0, timer: null, started: false });
  }

  const memoryPage = {
    slug: 'memory', group: 'learn', accent: 'blue', icon: { emoji: '🧠' }, track: 'Memory Game',
    title: () => t('memoryMatch'), kind: { bm: 'Permainan · 6 atau 8 pasangan', en: 'Game · 6 or 8 pairs' },
    render() {
      if (!mem.cards.length) newMemoryGame();
      return `
        ${head('memoryTitle', esc(t('findPairs')))}
        ${scoreBar()}
        <div class="card stats">
          <div><span>${t('moves')}</span><b data-stat="moves">${mem.moves}</b></div>
          <div><span>${t('matches')}</span><b data-stat="matches">${mem.matched}/${pairsFor(mem.difficulty)}</b></div>
          <div><span>${t('time')}</span><b data-stat="time">${mem.time}s</b></div>
        </div>
        <div class="toolbar">
          <div class="segmented" role="group">
            ${['easy', 'normal'].map(l => `<button type="button" data-mdiff="${l}" aria-pressed="${mem.difficulty === l}">${t(l + 'Mode')}</button>`).join('')}
          </div>
          <button class="btn secondary small" type="button" data-act="restart">${t('restart')}</button>
        </div>
        <div class="mem-grid ${mem.difficulty}">
          ${mem.cards.map((c, i) => `
            <button class="mem-card ${c.state}" type="button" data-i="${i}" style="--emo:${c.e.color}" aria-label="${c.state ? esc(name(c.e)) : '?'}">
              <span class="mem-inner">
                <span class="mem-front" aria-hidden="true">❓</span>
                <span class="mem-back" aria-hidden="true">${c.e.emoji}</span>
              </span>
            </button>`).join('')}
        </div>`;
    },
    mount(root) {
      root.addEventListener('click', e => {
        const d = e.target.closest('[data-mdiff]');
        if (d || e.target.closest('[data-act=restart]')) {
          if (d) mem.difficulty = d.dataset.mdiff;
          newMemoryGame();
          H.toast(t('memoryReset'));
          H.rerender(true);
          return;
        }
        const card = e.target.closest('[data-i]');
        if (card) flip(root, +card.dataset.i);
      });
    },
    leave: () => clearInterval(mem.timer),
  };

  function paintMemory(root) {
    root.querySelectorAll('.mem-card').forEach((el, i) => {
      const c = mem.cards[i];
      el.className = `mem-card ${c.state}`;
      el.setAttribute('aria-label', c.state ? name(c.e) : '?');
    });
    root.querySelector('[data-stat=moves]').textContent = mem.moves;
    root.querySelector('[data-stat=matches]').textContent = `${mem.matched}/${pairsFor(mem.difficulty)}`;
  }

  function flip(root, i) {
    const c = mem.cards[i];
    if (mem.open.length >= 2 || c.state) return;
    if (!mem.started) {
      mem.started = true;
      mem.timer = setInterval(() => {
        mem.time += 1;
        const el = document.querySelector('[data-stat=time]');
        if (el) el.textContent = mem.time + 's';
      }, 1000);
    }
    c.state = 'flipped';
    mem.open.push(i);
    if (mem.open.length === 2) {
      mem.moves += 1;
      const [a, b] = mem.open.map(n => mem.cards[n]);
      if (a.e.id === b.e.id) {
        a.state = b.state = 'matched';
        mem.open = [];
        mem.matched += 1;
        H.toast(t('matchFound'));
        if (mem.matched === pairsFor(mem.difficulty)) {
          clearInterval(mem.timer);
          record({ emotionEmoji: '🧠', emotionLabel: 'Memory Game Win', keywords: 'Memory Match Complete', title: 'Memory Game - Completed', story: 'Student completed memory game in ' + mem.time + 's with ' + mem.moves + ' moves', activityType: 'Memory Game' });
          H.toast(`${t('youWon')} ${mem.time}s, ${t('moves')}: ${mem.moves}`);
          H.confetti();
        }
      } else {
        setTimeout(() => {
          a.state = b.state = '';
          mem.open = [];
          paintMemory(root);
        }, 900);
      }
    }
    paintMemory(root);
  }

  /* ---------- activities (the portal's four activities, with the HELPIE app's printed-card rules) ---------- */

  const ACTIVITIES = [
    { key: 'makingFaces', icon: '😊', title: { bm: 'Membuat Muka', en: 'Making Faces' }, desc: 'makingFacesDesc', to: 'emotions' },
    { key: 'guessEmotion', icon: '🤔', title: { bm: 'Teka Emosi', en: 'Guess the Emotion' }, desc: 'guessEmotionDesc', to: 'emotions' },
    { key: 'storyGame', icon: '📖', title: { bm: 'Permainan Cerita Perasaan Saya', en: 'The Way I Feel Story Game' }, desc: 'storyGameDesc', to: 'story' },
    { key: 'matchingEmotions', icon: '🧩', title: { bm: 'Padankan Emosi', en: 'Matching Emotions' }, desc: 'matchingEmotionsDesc', to: 'memory' },
  ];

  const activitiesPage = {
    slug: 'activities', group: 'learn', accent: 'coral', icon: { emoji: '🎮' }, track: 'Activities Page',
    title: () => t('activities'), kind: { bm: '4 aktiviti · kad bercetak', en: '4 activities · printable cards' },
    render: () => `
      ${head('activitiesTitle', esc(t('funActivities')))}
      <ol class="act-list">
        ${ACTIVITIES.map((a, n) => {
          const printed = H.CARD_GAME.activities[a.key];
          return `
          <li class="card act">
            <div class="act-main">
              <span class="act-icon" aria-hidden="true">${a.icon}</span>
              <div>
                <h2><span class="num">${n + 1}</span>${esc(L(a.title))}</h2>
                <p>${esc(t(a.desc))}</p>
              </div>
              <a class="btn primary" href="#/${a.to}">${t('startActivity')}</a>
            </div>
            <details class="act-printed">
              <summary>${t('printedCards')}: <i>${esc(printed.title.replace(/^\d+\.\s*/, ''))}</i></summary>
              <div class="act-printed-body">
                <button class="plate shot" type="button" data-zoom="${printed.img}" aria-label="${H.t('enlarge')}">${H.img(printed.img, '', true)}</button>
                <p lang="en">${printed.text}</p>
              </div>
            </details>
          </li>`;
        }).join('')}
      </ol>
      <h2 class="section-label spaced">${H.CARD_GAME.title}</h2>
      ${H.CARD_GAME.feature()}
      ${H.quotes(H.CARD_GAME.quotes)}`,
  };

  /* ---------- share your story ---------- */

  const blankStory = () => ({ step: 1, emotion: null, name: '', cls: '', title: '', text: '', needsSupport: false, supportType: '', method: false, generating: false, submitted: null });
  let st = blankStory();
  let classList = null; // null = not loaded yet, [] = could not be loaded

  const SUPPORT = [
    { key: 'parent', icon: '👪', label: 'Parents' },
    { key: 'counselor', icon: '🧑‍⚕️', label: 'Counselor' },
    { key: 'teacher', icon: '👨‍🏫', label: 'Teacher' },
  ];

  const stepper = () => `
    <ol class="stepper" aria-label="${esc(L(S.shareTitle))}">
      ${[1, 2, 3, 4].map(n => `<li class="${n < st.step || st.submitted ? 'done' : n === st.step ? 'now' : ''}" ${n === st.step && !st.submitted ? 'aria-current="step"' : ''}>${n}</li>`).join('')}
    </ol>`;

  const emotionBadge = e => `
    <div class="story-emotion" style="--emo:${e.color}">
      <span aria-hidden="true">${e.emoji}</span><b>${esc(name(e))}</b>
    </div>`;

  function storyBody() {
    const e = st.emotion && byKey(st.emotion);
    if (st.submitted) {
      const r = st.submitted;
      return `
        <div class="card story-done">
          <div class="big-emoji" aria-hidden="true">🎉</div>
          <h2>${L(S.doneTitle)}</h2>
          <p class="lead">${L(S.doneSub)}</p>
          <p class="demo-note">${H.t('demoSaved')}</p>
          <div class="ref-box">
            <span>${t('referenceNumber')}</span>
            <b>${esc(r.refNo)}</b>
            <small>${L(S.keepRef)}</small>
          </div>
          <div class="story-preview">
            <p class="field-label">${L(S.yourStoryK)}</p>
            <h3>${esc(r.title)}</h3>
            <p class="prewrap">${esc(r.story)}</p>
            <button class="btn secondary wide" type="button" data-act="edit-sent">${L(S.editAfter)}</button>
          </div>
          <div class="btn-row">
            <button class="btn primary" type="button" data-act="another">${L(S.another)}</button>
            <a class="btn secondary" href="#/">${L(S.backHome)}</a>
          </div>
        </div>
        <div class="card note good">
          <p><b>${L(S.notAlone)}</b></p>
          <p>${L(S.notAloneText)}</p>
        </div>`;
    }
    if (st.step === 1) {
      return `
        <p class="step-label">${L(S.step1)}</p>
        <div class="emo-grid">
          ${EMOTIONS.map(x => `
            <button class="emo-card" type="button" data-pick="${x.emotion}" style="--emo:${x.color}">
              <span class="emo-face" aria-hidden="true">${x.emoji}</span>
              <span class="emo-name">${esc(name(x))}</span>
            </button>`).join('')}
        </div>`;
    }
    if (st.step === 2) {
      const classField = classList === null
        ? `<select id="story-class" disabled><option>…</option></select>`
        : classList.length
          ? `<select id="story-class" required>
              <option value="">${L(S.classPh)}</option>
              ${classList.map(c => `<option ${st.cls === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
            </select>`
          : `<input id="story-class" value="${esc(st.cls)}" placeholder="${esc(H.t('classTyped'))}" required>
             <small class="field-help">${H.t('classFallback')}</small>`;
      return `
        ${emotionBadge(e)}
        <p class="step-label">${L(S.step2)}</p>
        <div class="card form">
          <label class="field"><span class="field-label">${L(S.nameLabel)}</span>
            <input id="story-name" value="${esc(st.name)}" placeholder="${esc(L(S.namePh))}" autocomplete="name"></label>
          <label class="field"><span class="field-label">${L(S.classLabel)}</span>${classField}</label>
          <div class="btn-row">
            <button class="btn secondary" type="button" data-step="1">${L(S.back)}</button>
            <button class="btn primary" type="button" data-act="to3" ${st.cls.trim() ? '' : 'disabled'}>${L(S.next)}</button>
          </div>
        </div>`;
    }
    if (st.step === 3) {
      if (!st.method) {
        return `
          ${emotionBadge(e)}
          <p class="step-label">${L(S.step3)}</p>
          <div class="grid-2 method">
            <button class="card method-card ai" type="button" data-act="generate" ${st.generating ? 'disabled' : ''}>
              <span class="big-emoji" aria-hidden="true">🤖</span>
              <b>${L(S.aiTitle)}</b>
              <span>${st.generating ? L(S.aiBusy) : L(S.aiDesc)}</span>
            </button>
            <button class="card method-card" type="button" data-act="write">
              <span class="big-emoji" aria-hidden="true">✍️</span>
              <b>${L(S.writeTitle)}</b>
              <span>${L(S.writeDesc)}</span>
            </button>
          </div>
          <div class="btn-row"><button class="btn secondary" type="button" data-step="2">${L(S.back)}</button></div>`;
      }
      return `
        ${emotionBadge(e)}
        <p class="step-label">${L(S.step3)}</p>
        <div class="card form">
          <label class="field"><span class="field-label">${L(S.titleLabel)}</span>
            <input id="story-title" value="${esc(st.title)}" placeholder="${esc(L(S.titlePh))}"></label>
          <label class="field"><span class="field-label">${L(S.storyLabel)}</span>
            <textarea id="story-text" rows="7">${esc(st.text)}</textarea>
            <small class="field-help"><span id="char-count">${st.text.length}</span> ${L(S.chars)}</small></label>
          <div class="support ${st.needsSupport ? 'on' : ''}">
            <label class="check"><input type="checkbox" id="support" ${st.needsSupport ? 'checked' : ''}><span>${L(S.support)}</span></label>
            ${st.needsSupport ? `
              <div class="segmented wide" role="group">
                ${SUPPORT.map(s => `<button type="button" data-support="${s.key}" aria-pressed="${st.supportType === s.key}">${s.icon} ${L(S[s.key])}</button>`).join('')}
              </div>` : ''}
          </div>
          <div class="btn-row">
            <button class="btn secondary" type="button" data-act="change-method">${L(S.changeMethod)}</button>
            <button class="btn primary" type="button" data-act="to4" ${st.title.trim() && st.text.trim() ? '' : 'disabled'}>${L(S.review)}</button>
          </div>
        </div>`;
    }
    // Step 4: review
    const support = SUPPORT.find(s => s.key === st.supportType);
    return `
      ${emotionBadge(e)}
      <p class="step-label">${L(S.step4)}</p>
      <div class="card review">
        <h2>${L(S.reviewTitle)}</h2>
        <dl class="facts">
          <div><dt>${L(S.nameK)}</dt><dd>${esc(st.name || 'Anonymous')}</dd></div>
          <div><dt>${L(S.classK)}</dt><dd>${esc(st.cls)}</dd></div>
          <div><dt>${L(S.emotionK)}</dt><dd>${e.emoji} ${esc(name(e))}</dd></div>
          ${st.needsSupport && support ? `<div><dt>${L(S.supportK)}</dt><dd>${support.icon} ${L(S[support.key])}</dd></div>` : ''}
        </dl>
        <h3>${esc(st.title)}</h3>
        <p class="prewrap story-box">${esc(st.text)}</p>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-step="3">${L(S.editStory)}</button>
          <button class="btn primary go" type="button" data-act="submit">${L(S.submit)}</button>
        </div>
      </div>
      <div class="card note">
        <p><b>${t('privacy')}</b> ${t('privacyText')}</p>
      </div>`;
  }

  const storyPage = {
    slug: 'story', group: 'help', accent: 'purple', icon: { emoji: '📖' }, track: 'Share Story Page',
    title: () => t('shareStories'), kind: { bm: '4 langkah · ' + PORTAL.translations.bm.safePrivate, en: '4 steps · ' + PORTAL.translations.en.safePrivate },
    render: () => `
      ${H.pageHead({ icon: '<span class="emoji" aria-hidden="true">📖</span>', eyebrow: H.t(H.GROUP_LABEL.help), title: esc(splitEmoji(L(S.shareTitle)).text), lead: esc(t('tellUsStory')) })}
      ${stepper()}
      <div class="story">${storyBody()}</div>`,
    mount(root) {
      // Staff may have changed the class list since the last visit.
      H.api.classes().then(list => {
        const changed = JSON.stringify(list) !== JSON.stringify(classList);
        classList = list;
        if (changed && st.step === 2 && !st.submitted && location.hash === '#/story') H.rerender(true);
      });
      const go = step => { st.step = step; H.rerender(false); };
      root.addEventListener('input', e => {
        if (e.target.id === 'story-name') st.name = e.target.value;
        if (e.target.id === 'story-class') { st.cls = e.target.value; root.querySelector('[data-act=to3]').disabled = !st.cls.trim(); }
        if (e.target.id === 'story-title' || e.target.id === 'story-text') {
          st.title = root.querySelector('#story-title').value;
          st.text = root.querySelector('#story-text').value;
          root.querySelector('#char-count').textContent = st.text.length;
          root.querySelector('[data-act=to4]').disabled = !st.title.trim() || !st.text.trim();
        }
      });
      root.addEventListener('change', e => {
        if (e.target.id === 'story-class') { st.cls = e.target.value; root.querySelector('[data-act=to3]').disabled = !st.cls.trim(); }
        if (e.target.id === 'support') {
          st.needsSupport = e.target.checked;
          if (!st.needsSupport) st.supportType = '';
          H.rerender(true);
        }
      });
      root.addEventListener('click', async e => {
        const pick = e.target.closest('[data-pick]');
        if (pick) { st.emotion = pick.dataset.pick; go(2); return; }
        const step = e.target.closest('[data-step]');
        if (step) { go(+step.dataset.step); return; }
        const sup = e.target.closest('[data-support]');
        if (sup) { st.supportType = sup.dataset.support; H.rerender(true); return; }
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'to3' && st.cls.trim()) go(3);
        if (act === 'write') { st.method = true; st.text = ''; H.rerender(false); }
        if (act === 'change-method') { Object.assign(st, { method: false, text: '', title: '' }); H.rerender(false); }
        if (act === 'generate') generateStory();
        if (act === 'to4') {
          if (st.needsSupport && !st.supportType) { H.toast(H.t('chooseSupport'), 'warning'); return; }
          go(4);
        }
        if (act === 'submit') submitStory(e.target.closest('button'));
        if (act === 'another') { st = blankStory(); H.rerender(false); }
        if (act === 'edit-sent') editSentStory();
      });
    },
  };

  function generateStory() {
    // The portal's "AI" writer picks one of two prepared stories for the chosen feeling.
    st.generating = true;
    H.rerender(true);
    setTimeout(() => {
      const e = byKey(st.emotion);
      const options = (PORTAL.storyTemplates[st.emotion] || PORTAL.storyTemplates.happy)[H.lang()];
      st.text = options[Math.floor(Math.random() * options.length)]
        .replaceAll('{name}', st.name || L(S.someStudent))
        .replaceAll('{class}', st.cls);
      st.title = L(S.generatedTitle)(e);
      st.generating = false;
      st.method = true;
      H.rerender(false);
    }, 700);
  }

  async function submitStory(btn) {
    if (!st.emotion || !st.cls.trim() || !st.title.trim() || !st.text.trim()) {
      H.toast(t('fillAllFields'), 'warning');
      return;
    }
    const e = byKey(st.emotion);
    const support = SUPPORT.find(s => s.key === st.supportType);
    const rec = {
      refNo: H.refNumber(),
      name: st.name.trim() || 'Anonymous',
      class: st.cls.trim(),
      emotionEmoji: e.emoji,
      emotionLabel: e.emotion,
      keywords: st.title + (st.needsSupport && support ? ` | SUPPORT: ${support.label}` : ''),
      title: st.title,
      story: st.text,
      status: st.needsSupport ? 'Follow-up' : 'New',
      activityType: 'Story',
    };
    btn.disabled = true;
    btn.textContent = t('submitting');
    const res = await H.api.createRecord(rec);
    if (res.ok) {
      st.submitted = res.record;
      H.confetti();
      H.rerender(false);
    } else {
      H.toast(res.error ? `❌ ${res.error}` : t('failedSubmit'), 'error');
      btn.disabled = false;
      btn.textContent = L(S.submit);
    }
  }

  function editSentStory() {
    const r = st.submitted;
    const d = H.openModal(`
      <form class="form edit-form">
        <h2 class="block-title">${L(S.editAfter)}</h2>
        <label class="field"><span class="field-label">${L(S.editTitleK)}</span><input name="title" value="${esc(r.title)}"></label>
        <label class="field"><span class="field-label">${L(S.editStoryK)}</span><textarea name="story" rows="9">${esc(r.story)}</textarea></label>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-close>${L(S.cancel)}</button>
          <button class="btn primary" type="submit">${L(S.save)}</button>
        </div>
      </form>`);
    d.querySelector('form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const title = ev.target.title.value.trim();
      const story = ev.target.story.value.trim();
      if (!title || !story) { H.toast(L(S.fillAll), 'warning'); return; }
      const res = await H.api.updateRecord({ ...r, title, story });
      if (res.ok) {
        st.submitted = { ...r, title, story };
        H.closeModal();
        H.toast(L(S.saved));
        H.rerender(true);
      } else {
        H.toast(L(S.saveFailed), 'error');
      }
    });
  }

  H.PORTAL_PAGES = { emotionsPage, spellingPage, memoryPage, activitiesPage, storyPage };
})();
