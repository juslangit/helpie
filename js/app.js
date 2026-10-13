/* HELPIE web app: home screen, menu, page switching, language, theme and offline support.
 * Content comes from two sources, both kept word for word:
 *   - the HELPIE 2024 Android app (js/apk.js)
 *   - the Student Wellbeing Portal at helpie.skpp111.edu.my, its newer version (js/portal.js, js/portal-content.js) */
'use strict';

(() => {
  const { esc, t, L } = H;
  const P = H.PORTAL_PAGES;
  const apk = slug => H.APK_PAGES.find(p => p.slug === slug);

  H.GROUP_LABEL = { learn: 'groupLearn', check: 'groupCheck', help: 'groupHelp' };
  const GROUPS = ['learn', 'check', 'help'];

  // Menu order. Portal sections come first in each group because the portal is the newer version.
  const PAGES = [
    P.emotionsPage, P.spellingPage, P.memoryPage, P.activitiesPage, apk('feelings-game'),
    apk('stress-measurement'), apk('health-survey'),
    P.storyPage, apk('chat-assistance'), apk('therapist-consultation'), apk('stress-support'),
  ];
  // Old addresses that now live on another page.
  const ALIASES = { 'emotion-cards': 'activities' };
  // Every address the app answers to: the menu sections plus the staff page.
  const ROUTES = [...PAGES, H.STAFF_PAGE];

  const titleOf = p => (typeof p.title === 'function' ? p.title() : p.title);

  /* ---------- home ---------- */

  const tile = p => `
    <a class="card tile" href="#/${p.slug}" data-accent="${p.accent}">
      <span class="plate">${H.iconHtml(p.icon)}</span>
      <span class="tile-text">
        <span class="tile-title">${esc(titleOf(p))}</span>
        <span class="tile-kind">${esc(L(p.kind))}</span>
      </span>
      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
    </a>`;

  function homeView() {
    return `
      <section class="hero">
        <div class="hero-photo" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-logos">
            <span class="logo-chip">${H.img('school-logo', 'Sekolah Kebangsaan Putrajaya Presint 11 (1)')}</span>
            <span class="logo-chip wide">${H.img('unesco', 'UNESCO Associated Schools Network · World’s Best School Prizes')}</span>
          </div>
          <p class="hero-kicker">${esc(t('portalSubtitle'))}</p>
          <h1>${esc(t('portalTitle'))}</h1>
          <p class="hero-text">${esc(t('welcomeText'))}</p>
          <div class="hero-actions">
            <a class="btn hero-cta" href="#/emotions">${esc(t('enterPortal'))}</a>
            <span class="hero-chip">🔒 ${esc(t('safePrivate'))}</span>
          </div>
        </div>
      </section>
      ${GROUPS.map(g => `
        <section class="block">
          <h2 class="section-label">${H.t(H.GROUP_LABEL[g])}</h2>
          ${g === 'learn' ? `<p class="section-lead">${esc(L(H.PORTAL_SUBTITLE))}</p>` : ''}
          <div class="tiles">${PAGES.filter(p => p.group === g).map(tile).join('')}</div>
        </section>`).join('')}
      <section class="block">
        <h2 class="section-label">${H.t('aboutHelpie')}</h2>
        <div class="card about" lang="en">
          <span class="about-logo">${H.img('logo', 'HELPIE logo: Happy life with HELPIE')}</span>
          <div>
            <h3><span>${H.INTRO.title}</span> ${H.INTRO.subtitle}</h3>
            <p>${H.INTRO.text}</p>
          </div>
        </div>
      </section>
      ${H.quotes(H.QUOTE_KEYS)}`;
  }

  /* ---------- menu ---------- */

  const main = document.getElementById('main');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menu-btn');
  const wide = matchMedia('(min-width: 1024px)');

  function buildNav() {
    const item = (href, label, iconHtml, accent) => `
      <a class="nav-item" href="${href}" ${accent ? `data-accent="${accent}"` : ''}>
        <span class="plate">${iconHtml}</span>
        <span>${esc(label)}</span>
      </a>`;
    const home = '<span class="home-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg></span>';
    document.getElementById('nav').innerHTML =
      item('#/', t('home'), home) +
      GROUPS.map(g => `
        <p class="nav-group">${H.t(H.GROUP_LABEL[g])}</p>
        ${PAGES.filter(p => p.group === g).map(p => item(`#/${p.slug}`, titleOf(p), H.iconHtml(p.icon), p.accent)).join('')}`).join('');
    markCurrent();
  }

  function markCurrent() {
    const here = '#/' + (current ? current.slug : '');
    document.querySelectorAll('.nav-item, #staff-link').forEach(a => {
      if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    // On narrow screens the closed drawer is off-screen, so keep it out of the tab order.
    sidebar.inert = !open && !wide.matches;
    if (open) (sidebar.querySelector('.nav-item[aria-current]') || sidebar.querySelector('a')).focus();
  }
  wide.addEventListener('change', () => setMenu(false));

  /* ---------- pages ---------- */

  let current = null;

  function draw() {
    const p = current;
    main.innerHTML = p
      ? `<div class="page" data-accent="${p.accent}">
           <a class="back" href="#/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>${esc(t('home'))}</a>
           ${p.render(p)}
         </div>`
      : `<div class="page home">${homeView()}</div>`;
    p?.mount?.(main.firstElementChild);
    document.title = p ? `${titleOf(p)} · HELPIE` : `HELPIE · ${t('portalTitle')}`;
  }

  // Redraw the current page after its state changed, keeping the scroll position.
  H.rerender = (inPlace = true) => {
    const y = scrollY;
    H.rerendering = inPlace;
    draw();
    H.rerendering = false;
    if (inPlace) scrollTo(0, y);
    else { scrollTo(0, 0); main.focus({ preventScroll: true }); }
  };

  function route() {
    let slug = location.hash.replace(/^#\/?/, '');
    if (ALIASES[slug]) { location.replace('#/' + ALIASES[slug]); return; }
    const next = ROUTES.find(p => p.slug === slug) || null;
    current?.leave?.();
    current = next;
    draw();
    markCurrent();
    setMenu(false);
    scrollTo(0, 0);
    // Move focus to the new content for keyboard and screen reader users, except on the first load.
    if (route.ran) main.focus({ preventScroll: true });
    route.ran = true;
    if (next?.track) H.api.track(next.track);
  }

  /* ---------- picture viewer ---------- */

  document.addEventListener('click', e => {
    const z = e.target.closest('[data-zoom]');
    if (!z) return;
    const alt = z.dataset.alt || '';
    H.openModal(`<img class="zoomed" src="img/${z.dataset.zoom}.webp" alt="${esc(alt)}">${alt ? `<p class="zoom-caption">${esc(alt)}</p>` : ''}`, 'modal-image');
  });

  /* ---------- language and theme ---------- */

  function applyLanguage() {
    const lang = H.lang();
    document.documentElement.lang = lang === 'bm' ? 'ms' : 'en';
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.querySelectorAll('.lang-toggle').forEach(b => {
      b.textContent = lang === 'bm' ? 'EN' : 'BM';
      b.setAttribute('aria-label', H.t('switchLang'));
    });
    document.querySelector('.skip').textContent = H.t('skipLink');
    menuBtn.setAttribute('aria-label', H.t('openMenu'));
    document.querySelector('.brand-sub').textContent = t('portalTitle');
    document.querySelector('#install-btn span').textContent = H.t('install');
    document.querySelector('#staff-link span').textContent = H.t('staff');
    syncThemeLabels();
    buildNav();
  }

  function setLanguage(lang) {
    if (lang === H.lang()) return;
    H.setLang(lang);
    applyLanguage();
    draw();
  }
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
  document.querySelectorAll('.lang-toggle').forEach(b => b.addEventListener('click', () => setLanguage(H.lang() === 'bm' ? 'en' : 'bm')));

  const currentTheme = () => document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function syncThemeLabels() {
    const dark = currentTheme() === 'dark';
    document.querySelectorAll('.theme-label').forEach(l => (l.textContent = H.t(dark ? 'lightMode' : 'darkMode')));
    document.querySelectorAll('.theme-btn').forEach(b => b.setAttribute('aria-label', H.t(dark ? 'lightMode' : 'darkMode')));
  }
  document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('helpie-theme', next); } catch {}
    syncThemeLabels();
  }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeLabels);

  /* ---------- add to home screen (when the browser offers it) ---------- */

  let installPrompt;
  const installBtn = document.getElementById('install-btn');
  addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
  });

  /* ---------- start ---------- */

  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  scrim.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
  });
  addEventListener('hashchange', route);

  applyLanguage();
  route();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    // When a new version of the app takes over, reload once so visitors never run a mix of old and new files.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
