/* Shared building blocks: language, HTML helpers, toasts, confetti and the pop-up dialog. */
'use strict';
window.H = window.H || {};

(() => {
  // Interface words that are not part of either source's content (menu groups, buttons the old designs did not have).
  const UI = {
    bm: {
      groupLearn: 'Emosi & permainan', groupCheck: 'Semak diri', groupHelp: 'Kongsi & dapatkan bantuan',
      darkMode: 'Mod gelap', lightMode: 'Mod cerah', install: 'Tambah ke skrin utama', staff: 'Log masuk staf',
      quotes: 'Kata-kata semangat', aboutHelpie: 'Tentang HELPIE', skipLink: 'Langkau ke kandungan',
      openMenu: 'Buka menu', close: 'Tutup', enlarge: 'Besarkan gambar', opens: 'buka', switchLang: 'Tukar bahasa',
      printedCards: 'Main dengan kad bercetak', englishOnly: 'Kandungan halaman ini dalam Bahasa Inggeris.',
      demoSaved: 'Demo: cerita ini disimpan dalam pelayar peranti ini sahaja, dan boleh dibaca oleh staf yang log masuk pada peranti yang sama.',
      classFallback: 'Belum ada senarai kelas. Taip kelas anda.', classTyped: 'Contoh: 4 Bestari',
      chooseSupport: '⚠️ Pilih siapa yang anda mahu bantu anda.', serverError: '❌ Ralat sambungan ke pelayan',
      formNotConnected: 'Borang ini belum disambungkan, jadi tiada apa yang dihantar. Sila guna butang Consult Therapist di atas.',
      formFill: 'Sila isi semua ruangan dan tandakan kotak persetujuan.',
    },
    en: {
      groupLearn: 'Emotions & games', groupCheck: 'Check yourself', groupHelp: 'Share & get help',
      darkMode: 'Dark mode', lightMode: 'Light mode', install: 'Add to home screen', staff: 'Staff login',
      quotes: 'Quotes', aboutHelpie: 'About HELPIE', skipLink: 'Skip to content',
      openMenu: 'Open menu', close: 'Close', enlarge: 'Enlarge picture', opens: 'opens', switchLang: 'Switch language',
      printedCards: 'Play with printed cards', englishOnly: '',
      demoSaved: 'Demo: this story is saved in this device’s browser only, where staff who log in on the same device can read it.',
      classFallback: 'There is no class list yet. Type your class.', classTyped: 'Example: 4 Bestari',
      chooseSupport: '⚠️ Choose who you would like support from.', serverError: '❌ Could not reach the server',
      formNotConnected: 'This form is not connected yet, so nothing was sent. Please use Consult Therapist above.',
      formFill: 'Please fill in every field and tick the box to agree.',
    },
  };

  let lang = 'bm';
  try { const saved = localStorage.getItem('helpie-lang'); if (saved === 'bm' || saved === 'en') lang = saved; } catch {}

  H.lang = () => lang;
  H.setLang = l => { lang = l; try { localStorage.setItem('helpie-lang', l); } catch {} };
  // t(): the portal's own words first, then interface words.
  H.t = key => PORTAL.translations[lang][key] ?? UI[lang][key] ?? UI.en[key] ?? key;
  // L(): pick the current language from a {bm, en} pair; plain strings are returned as they are.
  H.L = v => (v && typeof v === 'object' && 'en' in v ? v[lang] : v);

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  H.esc = esc;
  H.img = (name, alt = '', lazy = false) =>
    `<img src="img/${name}.webp" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
  H.host = url => new URL(url).hostname.replace(/^www\./, '');
  H.extIcon = '<svg class="ext" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  // The HELPIE app wrote headings and buttons in capitals; show them in title case (same words, calmer to read).
  H.titleCase = s => s !== s.toUpperCase() ? s : s.replace(/\w\S*/g, w => (/^(OF|TO)$/.test(w) ? w.toLowerCase() : w[0] + w.slice(1).toLowerCase()));

  H.extButton = (label, href, style) =>
    `<a class="btn ${style}" href="${esc(href)}" target="_blank" rel="noopener">${label}${H.extIcon}<span class="sr">(${H.t('opens')} ${H.host(href)})</span></a>`;

  H.pageHead = ({ icon, eyebrow, title, lead }) => `
    <header class="page-head">
      <span class="plate page-icon">${icon}</span>
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        ${lead ? `<p class="page-lead">${lead}</p>` : ''}
      </div>
    </header>`;

  H.iconHtml = icon => icon.emoji ? `<span class="emoji" aria-hidden="true">${icon.emoji}</span>` : H.img(icon.img, '');

  /* ---------- toasts ---------- */

  const toasts = document.createElement('div');
  toasts.className = 'toasts';
  toasts.setAttribute('role', 'status');
  toasts.setAttribute('aria-live', 'polite');
  document.addEventListener('DOMContentLoaded', () => document.body.append(toasts));
  H.toast = (message, type = 'success') => {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toasts.append(el);
    setTimeout(() => el.classList.add('out'), 3200);
    setTimeout(() => el.remove(), 3600);
  };

  /* ---------- celebration ---------- */

  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  H.confetti = () => {
    if (calm()) return;
    const colours = ['#FFD700', '#FF69B4', '#9333EA', '#10B981', '#F59E0B', '#4890C8'];
    for (let i = 0; i < 36; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colours[i % colours.length];
      c.style.animationDelay = Math.random() * 0.4 + 's';
      c.style.setProperty('--drift', (Math.random() - 0.5) * 160 + 'px');
      document.body.append(c);
      setTimeout(() => c.remove(), 2200);
    }
  };
  H.starBurst = () => {
    if (calm()) return;
    const s = document.createElement('div');
    s.className = 'star-pop';
    s.textContent = '⭐';
    document.body.append(s);
    setTimeout(() => s.remove(), 1300);
  };

  /* ---------- dialog ---------- */

  let dialog;
  H.openModal = (html, className = '') => {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.addEventListener('click', e => {
        if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
      });
      document.body.append(dialog);
    }
    dialog.className = `modal ${className}`;
    dialog.innerHTML = `
      <button class="icon-btn modal-close" data-close aria-label="${H.t('close')}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>${html}`;
    dialog.showModal();
    return dialog;
  };
  H.closeModal = () => dialog?.close();

  // In-app yes/no question. Resolves true only when the person presses the confirm button.
  H.confirm = (message, yesLabel, danger = false) => new Promise(resolve => {
    const d = H.openModal(`
      <div class="confirm">
        <p>${esc(message)}</p>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-close>${lang === 'bm' ? 'Batal' : 'Cancel'}</button>
          <button class="btn ${danger ? 'danger' : 'primary'}" type="button" data-yes>${esc(yesLabel || 'OK')}</button>
        </div>
      </div>`, 'modal-small');
    let answer = false;
    d.querySelector('[data-yes]').addEventListener('click', () => { answer = true; d.close(); });
    d.addEventListener('close', () => resolve(answer), { once: true });
  });
})();
