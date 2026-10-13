/* Staff login and dashboard. HELPIE's own login: the first visit creates a staff account, later visits log in.
 * Accounts and data live in this browser (see api.js). The dashboard is rebuilt from the Student Wellbeing
 * Portal's admin dashboard: same statistics, filters, story actions, CSV export and class management. */
'use strict';
window.H = window.H || {};

(() => {
  const { esc, t, L } = H;

  const A = {
    // From the portal's dashboard code
    manageClasses: { bm: 'Urus Kelas', en: 'Manage Classes' },
    addClass: { bm: 'Tambah Kelas', en: 'Add Class' },
    updateClass: { bm: 'Kemaskini Kelas', en: 'Update Class' },
    className: { bm: 'Nama Kelas', en: 'Class Name' },
    level: { bm: 'Darjah:', en: 'Class Level:' },
    classNameK: { bm: 'Nama Kelas:', en: 'Class Name:' },
    classPh: { bm: 'Contoh: BAKAWALI', en: 'Example: BAKAWALI' },
    cancel: { bm: 'Batal', en: 'Cancel' },
    save: { bm: 'Simpan', en: 'Save' },
    badClass: { bm: 'Sila masukkan nama kelas mengikut format', en: 'Please enter a valid class name' },
    saved: { bm: 'Berjaya disimpan', en: 'Saved successfully' },
    confirmClass: { bm: 'Pasti mahu memadam kelas ini?', en: 'Are you sure you want to delete this class?' },
    classDeleted: { bm: 'Kelas dipadam', en: 'Class deleted' },
    showing: { bm: 'Papar', en: 'Showing' },
    of: { bm: 'daripada', en: 'of' },
    prev: { bm: '« Sebelum', en: '« Prev' },
    next: { bm: 'Seterus »', en: 'Next »' },
    activityDetails: { bm: 'Butiran Aktiviti', en: 'Activity Details' },
    needsSupport: { bm: 'Perlukan Bantuan', en: 'Needs Support' },
    Parents: { bm: '👨‍👩‍👧 Ibu Bapa', en: '👨‍👩‍👧 Parents' },
    Counselor: { bm: '🧑‍⚕️ Kaunselor', en: '🧑‍⚕️ Counselor' },
    Teacher: { bm: '👨‍🏫 Guru Kelas', en: '👨‍🏫 Class Teacher' },
    confirmLogout: { bm: 'Adakah anda nak keluar?', en: 'Do you want to logout?' },
    emotionCards: { bm: 'Kad Emosi', en: 'Emotion Cards' },

    // HELPIE's own login
    welcomeTitle: { bm: 'Ruang Staf HELPIE', en: 'HELPIE Staff Area' },
    welcomeText: {
      bm: 'Guru dan kaunselor boleh membaca cerita pelajar, menandakan cerita yang perlu disusuli, dan melihat statistik aktiviti.',
      en: 'Teachers and counselors can read students’ stories, mark the ones that need follow-up, and see activity statistics.',
    },
    setupTitle: { bm: 'Cipta akaun staf pertama', en: 'Create the first staff account' },
    setupText: { bm: 'Belum ada akaun staf pada peranti ini. Akaun pertama yang dicipta boleh menambah akaun lain.', en: 'There is no staff account on this device yet. The first account can add others.' },
    confirmPassword: { bm: 'Sahkan Kata Laluan:', en: 'Confirm Password:' },
    createAccount: { bm: 'Cipta Akaun', en: 'Create Account' },
    nameRule: { bm: 'Nama pengguna perlu sekurang-kurangnya 3 aksara.', en: 'The username needs at least 3 characters.' },
    passRule: { bm: 'Kata laluan perlu sekurang-kurangnya 8 aksara.', en: 'The password needs at least 8 characters.' },
    passMismatch: { bm: 'Kata laluan tidak sepadan.', en: 'The passwords do not match.' },
    nameTaken: { bm: 'Nama pengguna ini sudah digunakan.', en: 'This username is already taken.' },
    lockedOut: { bm: n => `Terlalu banyak cubaan. Cuba lagi dalam ${n} saat.`, en: n => `Too many attempts. Try again in ${n} seconds.` },
    showPass: { bm: 'Tunjuk kata laluan', en: 'Show password' },
    forgot: { bm: 'Lupa kata laluan?', en: 'Forgot your password?' },
    forgotText: {
      bm: 'Ini versi demo, jadi tiada e-mel untuk set semula. Anda boleh memadam semua data demo pada peranti ini dan bermula semula.',
      en: 'This is a demo version, so there is no reset email. You can erase all demo data on this device and start again.',
    },
    resetAll: { bm: 'Padam semua data demo', en: 'Erase all demo data' },
    resetAllConfirm: {
      bm: 'Padam semua akaun staf, cerita, log aktiviti dan kelas pada peranti ini? Tindakan ini tidak boleh dibatalkan.',
      en: 'Erase every staff account, story, activity log and class on this device? This cannot be undone.',
    },
    resetDone: { bm: 'Semua data demo dipadam', en: 'All demo data erased' },
    hello: { bm: 'Hai', en: 'Hi' },
    demoInfo: {
      bm: 'Demo: akaun dan data disimpan dalam pelayar peranti ini sahaja. Cerita yang dihantar pada peranti ini akan muncul di sini.',
      en: 'Demo: accounts and data are kept in this device’s browser only. Stories sent on this device appear here.',
    },
    empty: { bm: 'Belum ada rekod. Hantar cerita atau main permainan, atau tambah data contoh untuk mencuba papan pemuka.', en: 'No records yet. Send a story or play a game, or add sample data to try the dashboard.' },
    addSample: { bm: 'Tambah data contoh', en: 'Add sample data' },
    sampleAdded: { bm: 'Data contoh ditambah', en: 'Sample data added' },
    clearData: { bm: 'Padam semua rekod & kelas', en: 'Erase all records & classes' },
    clearConfirm: { bm: 'Padam semua cerita, log aktiviti dan kelas? Akaun staf tidak dipadam.', en: 'Erase all stories, activity logs and classes? Staff accounts are kept.' },
    cleared: { bm: 'Rekod dan kelas dipadam', en: 'Records and classes erased' },
    tools: { bm: 'Alat demo', en: 'Demo tools' },
    staffAccounts: { bm: 'Akaun Staf', en: 'Staff Accounts' },
    addStaff: { bm: 'Tambah Staf', en: 'Add Staff' },
    created: { bm: 'Dicipta', en: 'Created' },
    you: { bm: '(anda)', en: '(you)' },
    staffAdded: { bm: 'Akaun staf ditambah', en: 'Staff account added' },
    confirmStaff: { bm: u => `Padam akaun ${u}?`, en: u => `Delete the account ${u}?` },
    staffDeleted: { bm: 'Akaun dipadam', en: 'Account deleted' },
    changePass: { bm: 'Tukar Kata Laluan', en: 'Change Password' },
    currentPass: { bm: 'Kata Laluan Semasa:', en: 'Current Password:' },
    newPass: { bm: 'Kata Laluan Baharu:', en: 'New Password:' },
    wrongCurrent: { bm: 'Kata laluan semasa salah.', en: 'The current password is wrong.' },
    passChanged: { bm: 'Kata laluan ditukar', en: 'Password changed' },
    confirmDelete: { bm: 'Padam rekod ini? Tindakan ini tidak boleh dibatalkan.', en: 'Delete this record? This cannot be undone.' },
  };

  const PAGE_SIZE = 10;
  const ACTIVITY_TYPES = ['Story', 'Spelling Game', 'Memory Game', 'Activities Page', 'Emotion Cards', 'Share Story Page'];
  const STATUS_CLASS = { New: 'new', Reviewed: 'reviewed', 'Follow-up': 'follow', Activity: 'activity' };
  const FILTERS = { q: '', fActivity: '', fEmotion: '', fClass: '', fStatus: '', page: 1 };

  const S = { user: null, records: [], classes: [], ...FILTERS };
  try { S.user = sessionStorage.getItem('helpie-staff'); } catch {}
  const setUser = u => { S.user = u; try { u ? sessionStorage.setItem('helpie-staff', u) : sessionStorage.removeItem('helpie-staff'); } catch {} };

  // Wrong-password lockout: 5 tries, then 30 seconds.
  let failures = 0, lockedUntil = 0;

  async function reload() {
    S.records = await H.api.records();
    S.classes = await H.api.classList();
  }

  /* ---------- login and first-time setup ---------- */

  const passField = (name, label, autocomplete) => `
    <label class="field"><span class="field-label">${label}</span>
      <span class="pass-wrap">
        <input name="${name}" type="password" autocomplete="${autocomplete}" required>
        <button type="button" class="icon-btn" data-act="show-pass" aria-label="${L(A.showPass)}" aria-pressed="false">👁️</button>
      </span></label>`;

  function loginView() {
    const setup = !H.api.hasStaff();
    return `
      <div class="auth">
        <div class="auth-side">
          <span class="auth-logo">${H.img('logo', 'HELPIE')}</span>
          <h2>${L(A.welcomeTitle)}</h2>
          <p>${L(A.welcomeText)}</p>
          <ul class="auth-points">
            <li>📖 ${esc(t('shareStories'))}</li>
            <li>📊 ${esc(t('activityStats').replace(/^\P{L}+/u, ''))}</li>
            <li>🔒 ${esc(t('safePrivate'))}</li>
          </ul>
        </div>
        <form class="auth-form form" id="${setup ? 'staff-setup' : 'staff-login'}" novalidate>
          <h2>${setup ? L(A.setupTitle) : t('adminLogin')}</h2>
          ${setup ? `<p class="auth-hint">${L(A.setupText)}</p>` : ''}
          <label class="field"><span class="field-label">${t('username')}</span>
            <input name="username" autocomplete="username" placeholder="${esc(t('enterUsername'))}" required></label>
          ${passField('password', t('password'), setup ? 'new-password' : 'current-password')}
          ${setup ? passField('password2', L(A.confirmPassword), 'new-password') + `<p class="field-help">${L(A.passRule)}</p>` : ''}
          <p class="form-msg" role="alert"></p>
          <button class="btn primary wide" type="submit">${setup ? L(A.createAccount) : t('login')}</button>
          ${setup ? '' : `
            <details class="forgot">
              <summary>${L(A.forgot)}</summary>
              <p>${L(A.forgotText)}</p>
              <button class="btn danger small" type="button" data-act="reset-all">${L(A.resetAll)}</button>
            </details>`}
        </form>
      </div>`;
  }

  async function submitAuth(form) {
    const msg = form.querySelector('.form-msg');
    const say = text => { msg.className = 'form-msg error'; msg.textContent = text; };
    const username = form.username.value.trim();
    const password = form.password.value;
    const btn = form.querySelector('[type=submit]');

    if (form.id === 'staff-setup') {
      if (username.length < 3) return say(L(A.nameRule));
      if (password.length < 8) return say(L(A.passRule));
      if (password !== form.password2.value) return say(L(A.passMismatch));
      btn.disabled = true;
      const res = await H.api.createStaff(username, password);
      btn.disabled = false;
      if (!res.ok) return say(L(A.nameTaken));
      setUser(username);
      await reload();
      return H.rerender(false);
    }

    const wait = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (wait > 0) return say(L(A.lockedOut)(wait));
    if (!username || !password) return say(t('fillAllFields'));
    btn.disabled = true;
    const res = await H.api.login(username, password);
    btn.disabled = false;
    if (res.ok) {
      failures = 0;
      setUser(res.username);
      await reload();
      return H.rerender(false);
    }
    form.password.value = '';
    form.password.focus();
    if (++failures >= 5) { failures = 0; lockedUntil = Date.now() + 30000; return say(L(A.lockedOut)(30)); }
    say(t('invalidCredentials'));
  }

  /* ---------- dashboard ---------- */

  function filtered() {
    const q = S.q.toLowerCase();
    return S.records.filter(r =>
      (!q || [r.name, r.title, r.story, r.refNo].some(v => String(v ?? '').toLowerCase().includes(q))) &&
      (!S.fEmotion || r.emotionLabel === S.fEmotion) &&
      (!S.fClass || r.class === S.fClass) &&
      (!S.fStatus || r.status === S.fStatus) &&
      (!S.fActivity || r.activityType === S.fActivity));
  }

  const tileStat = (n, label, cls) => `<div class="stat ${cls}"><b>${n}</b><span>${label}</span></div>`;
  // Record times are stored in UTC ("YYYY-MM-DD HH:MM:SS"), like the portal's.
  const when = v => new Date(String(v).replace(' ', 'T') + 'Z');

  function dashboardView() {
    const all = S.records;
    const stories = all.filter(r => r.status !== 'Activity');
    const acts = all.filter(r => r.status === 'Activity');
    const count = type => acts.filter(a => a.activityType === type).length;
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    S.page = Math.min(Math.max(1, S.page), pages);
    const shown = list.slice((S.page - 1) * PAGE_SIZE, S.page * PAGE_SIZE);
    const classNames = [...new Set([...S.classes.map(c => c.class_name), ...stories.map(s => s.class).filter(Boolean)])];
    const opt = (v, label, cur) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(label)}</option>`;
    const staff = H.api.staffList();

    return `
      <p class="demo-note">${L(A.demoInfo)}</p>
      <section class="block">
        <h2 class="section-label">${t('activityStats')}</h2>
        <div class="stat-grid six">
          ${tileStat(acts.length, t('totalActivities'), 'g1')}
          ${tileStat(new Set(acts.map(a => a.sessionId)).size, t('uniqueStudents'), 'g2')}
          ${tileStat(count('Spelling Game'), t('spellingPlays'), 'g3')}
          ${tileStat(count('Memory Game'), t('memoryPlays'), 'g4')}
          ${tileStat(count('Activities Page'), t('activitiesPlays'), 'g5')}
          ${tileStat(count('Emotion Cards'), L(A.emotionCards), 'g6')}
        </div>
        <div class="stat-grid four">
          ${tileStat(stories.length, t('totalStories'), 'plain purple')}
          ${tileStat(stories.filter(s => s.status === 'New').length, t('new'), 'plain amber')}
          ${tileStat(stories.filter(s => s.status === 'Reviewed').length, t('reviewed'), 'plain green')}
          ${tileStat(stories.filter(s => s.status === 'Follow-up').length, t('followUp'), 'plain red')}
        </div>
      </section>

      <section class="block card pad">
        <h2 class="block-title small">${t('searchFilter')}</h2>
        <div class="filters">
          <input type="search" data-f="q" value="${esc(S.q)}" placeholder="${esc(t('searchStories'))}" aria-label="${esc(t('searchStories'))}">
          <select data-f="fActivity" aria-label="${esc(t('activityType'))}">${opt('', t('allActivities'), S.fActivity)}${ACTIVITY_TYPES.map(a => opt(a, a, S.fActivity)).join('')}</select>
          <select data-f="fEmotion" aria-label="${esc(t('emotion'))}">${opt('', t('allEmotions'), S.fEmotion)}${PORTAL.emotions.map(e => opt(e.emotion, `${e.emoji} ${e.emotion}`, S.fEmotion)).join('')}</select>
          <select data-f="fClass" aria-label="${esc(t('class'))}">${opt('', t('allClasses'), S.fClass)}${classNames.map(c => opt(c, c, S.fClass)).join('')}</select>
          <select data-f="fStatus" aria-label="${esc(t('status'))}">${opt('', t('allStatus'), S.fStatus)}${opt('New', t('new'), S.fStatus)}${opt('Reviewed', t('reviewed'), S.fStatus)}${opt('Follow-up', t('followUp'), S.fStatus)}${opt('Activity', 'Activity', S.fStatus)}</select>
          <button class="btn secondary small" type="button" data-act="clear">${t('clear')}</button>
        </div>
      </section>

      <section class="block">
        <div class="row-between">
          <h2 class="block-title small">${t('activityLog')} (${list.length})</h2>
          <button class="btn primary small go" type="button" data-act="csv" ${all.length ? '' : 'disabled'}>${t('exportCSV')}</button>
        </div>
        ${all.length === 0 ? `
          <div class="card center-note">
            <p>${L(A.empty)}</p>
            <button class="btn primary" type="button" data-act="sample">${L(A.addSample)}</button>
          </div>` : list.length === 0 ? `<div class="card center-note"><p>${t('noStories')}</p></div>` : `
        <div class="card table-card">
          <div class="table-wrap">
            <table class="data rows">
              <thead><tr>
                <th>${t('dateTime')}</th><th>${t('refNo')}</th><th>Type</th><th>${t('name')}</th><th>${esc(t('class').replace(/[:*\s]+$/, ''))}</th>
                <th>${t('emotion')}</th><th>${t('title')}</th><th>${t('status')}</th><th>${t('action')}</th>
              </tr></thead>
              <tbody>
                ${shown.map(r => {
                  const d = when(r.datetime);
                  return `
                  <tr data-ref="${esc(r.refNo)}" tabindex="0">
                    <td class="nowrap">${esc(d.toLocaleDateString())}<br><small>${esc(d.toLocaleTimeString())}</small></td>
                    <td class="strong nowrap">${esc(r.refNo)}</td>
                    <td>${r.status === 'Activity' ? 'Activity' : 'Story'}</td>
                    <td>${esc(r.name)}</td>
                    <td class="nowrap">${esc(r.class)}</td>
                    <td class="nowrap">${esc(r.emotionEmoji)} ${esc(r.emotionLabel)}</td>
                    <td class="clip">${esc(r.title)}</td>
                    <td><span class="badge ${STATUS_CLASS[r.status] || ''}">${esc(r.status)}</span></td>
                    <td><button class="btn small primary" type="button" data-view="${esc(r.refNo)}">${t('view')}</button></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="pager">
            <span>${L(A.showing)} ${(S.page - 1) * PAGE_SIZE + 1} - ${Math.min(S.page * PAGE_SIZE, list.length)} ${L(A.of)} ${list.length}</span>
            <div class="btn-row">
              <button class="btn small secondary" type="button" data-page="-1" ${S.page <= 1 ? 'disabled' : ''}>${L(A.prev)}</button>
              <button class="btn small secondary" type="button" data-page="1" ${S.page >= pages ? 'disabled' : ''}>${L(A.next)}</button>
            </div>
          </div>
        </div>`}
      </section>

      <div class="admin-cols">
        <section class="block card pad">
          <div class="row-between">
            <h2 class="block-title small">${L(A.manageClasses)}</h2>
            <button class="btn primary small go" type="button" data-act="add-class">+ ${L(A.addClass)}</button>
          </div>
          <div class="table-wrap short">
            <table class="data">
              <thead><tr><th>ID</th><th>${L(A.className)}</th><th>Action</th></tr></thead>
              <tbody>
                ${S.classes.map(c => `
                  <tr>
                    <td>${esc(c.id)}</td><td>${esc(c.class_name)}</td>
                    <td class="actions">
                      <button class="btn small secondary" type="button" data-edit-class="${esc(c.id)}">✏️ Edit</button>
                      <button class="btn small danger" type="button" data-del-class="${esc(c.id)}" aria-label="${esc(t('delete'))} ${esc(c.class_name)}">🗑️</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="block card pad">
          <div class="row-between">
            <h2 class="block-title small">${L(A.staffAccounts)}</h2>
            <button class="btn primary small go" type="button" data-act="add-staff">+ ${L(A.addStaff)}</button>
          </div>
          <div class="table-wrap short">
            <table class="data">
              <thead><tr><th>${t('username').replace(/:$/, '')}</th><th>${L(A.created)}</th><th>Action</th></tr></thead>
              <tbody>
                ${staff.map(s => `
                  <tr>
                    <td class="strong">${esc(s.username)} ${s.username === S.user ? `<small>${L(A.you)}</small>` : ''}</td>
                    <td class="nowrap">${esc(when(s.created).toLocaleDateString())}</td>
                    <td class="actions">
                      ${s.username === S.user
                        ? `<button class="btn small secondary" type="button" data-act="change-pass">🔑 ${L(A.changePass)}</button>`
                        : `<button class="btn small danger" type="button" data-del-staff="${esc(s.username)}" aria-label="${esc(t('delete'))} ${esc(s.username)}">🗑️</button>`}
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="block card pad tools">
        <h2 class="block-title small">${L(A.tools)}</h2>
        <div class="btn-row">
          <button class="btn secondary small" type="button" data-act="sample">${L(A.addSample)}</button>
          <button class="btn danger small" type="button" data-act="clear-data" ${all.length || S.classes.length ? '' : 'disabled'}>${L(A.clearData)}</button>
        </div>
      </section>`;
  }

  /* ---------- dialogs ---------- */

  function openRecord(refNo) {
    const r = S.records.find(x => x.refNo === refNo);
    if (!r) return;
    const isActivity = r.status === 'Activity';
    const support = (String(r.keywords || '').match(/SUPPORT: (\w+)/) || [])[1];
    const fact = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
    const bare = s => s.replace(/\s*\*\s*$/, '');
    const dlg = H.openModal(`
      <div class="record">
        <h2 class="block-title">${isActivity ? L(A.activityDetails) : t('storyDetails')}</h2>
        ${support && A[support] ? `<div class="support-flag"><b>🆘 ${L(A.needsSupport)}</b><span>${L(A[support])}</span></div>` : ''}
        <dl class="facts">
          ${fact(t('refNo') + ':', `<span class="strong accent">${esc(r.refNo)}</span>`)}
          ${fact(t('dateTime') + ':', esc(when(r.datetime).toLocaleString()))}
          ${isActivity
            ? fact(t('activityType') + ':', esc(r.activityType)) + fact('Session ID:', `<small>${esc(r.sessionId)}</small>`)
            : fact(t('studentName'), esc(r.name)) + fact(bare(t('class')), esc(r.class)) + fact(t('emotion') + ':', `${esc(r.emotionEmoji)} ${esc(r.emotionLabel)}`) + fact(t('status') + ':', esc(r.status))}
        </dl>
        ${isActivity ? '' : `
          <p class="field-label">${t('title')}:</p>
          <h3>${esc(r.title)}</h3>
          <p class="field-label">${bare(t('yourStory'))}</p>
          <p class="prewrap story-box">${esc(r.story)}</p>`}
        <div class="btn-row">
          ${isActivity ? '' : `
            <button class="btn go" type="button" data-status="Reviewed">${t('markReviewed')}</button>
            <button class="btn warn" type="button" data-status="Follow-up">${t('markFollowUp')}</button>`}
          <button class="btn danger" type="button" data-delete>${t('delete')}</button>
        </div>
      </div>`);
    dlg.querySelectorAll('[data-status]').forEach(b => b.addEventListener('click', async () => {
      H.closeModal();
      const res = await H.api.updateRecord({ ...r, status: b.dataset.status });
      H.toast(res.ok ? `${t('statusUpdated')} ${b.dataset.status}` : t('failedUpdate'), res.ok ? 'success' : 'error');
      await reload();
      H.rerender(true);
    }));
    dlg.querySelector('[data-delete]').addEventListener('click', async () => {
      if (!(await H.confirm(L(A.confirmDelete), t('delete'), true))) return;
      await H.api.deleteRecord(refNo);
      H.toast(t('storyDeleted'));
      await reload();
      H.rerender(true);
    });
  }

  function openClass(id) {
    const old = id ? S.classes.find(c => String(c.id) === String(id)) : null;
    let year = '1', nameDefault = '';
    if (old) {
      const parts = old.class_name.split(' ');
      if (parts.length > 1 && !isNaN(parts[0])) { year = parts[0]; nameDefault = parts.slice(1).join(' '); }
      else nameDefault = old.class_name;
    }
    const dlg = H.openModal(`
      <form class="form" novalidate>
        <h2 class="block-title">${L(id ? A.updateClass : A.addClass)}</h2>
        <label class="field"><span class="field-label">${L(A.level)}</span>
          <select name="year">${[1, 2, 3, 4, 5, 6].map(n => `<option ${String(n) === year ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label class="field"><span class="field-label">${L(A.classNameK)}</span>
          <input name="cname" value="${esc(nameDefault)}" placeholder="${esc(L(A.classPh))}" class="upper"></label>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-close>${L(A.cancel)}</button>
          <button class="btn primary go" type="submit">${L(A.save)}</button>
        </div>
      </form>`, 'modal-small');
    dlg.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const cname = e.target.cname.value.trim().toUpperCase();
      if (!cname) { H.toast(L(A.badClass), 'warning'); return; }
      const res = await H.api.saveClass(old ? old.id : null, `${e.target.year.value} ${cname}`);
      if (!res.ok) { H.toast(res.error, 'error'); return; }
      H.closeModal();
      H.toast(L(A.saved));
      await reload();
      H.rerender(true);
    });
  }

  function openAddStaff() {
    const dlg = H.openModal(`
      <form class="form" novalidate>
        <h2 class="block-title">${L(A.addStaff)}</h2>
        <label class="field"><span class="field-label">${t('username')}</span><input name="username" autocomplete="off"></label>
        ${passField('password', t('password'), 'new-password')}
        <p class="field-help">${L(A.passRule)}</p>
        <p class="form-msg" role="alert"></p>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-close>${L(A.cancel)}</button>
          <button class="btn primary go" type="submit">${L(A.save)}</button>
        </div>
      </form>`, 'modal-small');
    wirePassToggles(dlg);
    dlg.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const f = e.target, msg = f.querySelector('.form-msg');
      const say = text => { msg.className = 'form-msg error'; msg.textContent = text; };
      if (f.username.value.trim().length < 3) return say(L(A.nameRule));
      if (f.password.value.length < 8) return say(L(A.passRule));
      const res = await H.api.createStaff(f.username.value.trim(), f.password.value);
      if (!res.ok) return say(L(A.nameTaken));
      H.closeModal();
      H.toast(L(A.staffAdded));
      H.rerender(true);
    });
  }

  function openChangePassword() {
    const dlg = H.openModal(`
      <form class="form" novalidate>
        <h2 class="block-title">${L(A.changePass)}</h2>
        ${passField('current', L(A.currentPass), 'current-password')}
        ${passField('next', L(A.newPass), 'new-password')}
        ${passField('next2', L(A.confirmPassword), 'new-password')}
        <p class="field-help">${L(A.passRule)}</p>
        <p class="form-msg" role="alert"></p>
        <div class="btn-row">
          <button class="btn secondary" type="button" data-close>${L(A.cancel)}</button>
          <button class="btn primary go" type="submit">${L(A.save)}</button>
        </div>
      </form>`, 'modal-small');
    wirePassToggles(dlg);
    dlg.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const f = e.target, msg = f.querySelector('.form-msg');
      const say = text => { msg.className = 'form-msg error'; msg.textContent = text; };
      if (f.next.value.length < 8) return say(L(A.passRule));
      if (f.next.value !== f.next2.value) return say(L(A.passMismatch));
      const res = await H.api.changePassword(S.user, f.current.value, f.next.value);
      if (!res.ok) return say(L(A.wrongCurrent));
      H.closeModal();
      H.toast(L(A.passChanged));
    });
  }

  function exportCsv() {
    const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = S.records.map(r => [
      when(r.datetime).toLocaleString(), r.refNo, r.status === 'Activity' ? 'Activity' : 'Story',
      r.name, r.class, `${r.emotionEmoji} ${r.emotionLabel}`, r.title, r.story, r.status, r.sessionId || '',
    ].map(cell).join(','));
    const csv = ['Date/Time,Ref No,Type,Name,Class,Emotion,Title,Story,Status,Session ID', ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `swp_data_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    H.toast(t('csvExported'));
  }

  function wirePassToggles(root) {
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-act=show-pass]');
      if (!b) return;
      const input = b.previousElementSibling;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-pressed', String(show));
      b.textContent = show ? '🔒' : '👁️';
    });
  }

  /* ---------- page ---------- */

  H.STAFF_PAGE = {
    slug: 'staff', group: 'staff', accent: 'purple', icon: { emoji: '👤' },
    title: () => (S.user ? t('adminDashboard') : t('adminLogin')),
    render() {
      // A session for an account that no longer exists ends here.
      if (S.user && !H.api.staffList().some(s => s.username === S.user)) setUser(null);
      // The login card carries its own heading.
      if (!S.user) return `<h1 class="sr">${t('adminLogin')}</h1>${loginView()}`;
      return `
        <header class="page-head staff-head">
          <span class="plate page-icon"><span class="emoji" aria-hidden="true">${S.user ? '📊' : '🔒'}</span></span>
          <div>
            <p class="eyebrow">${S.user ? `${L(A.hello)}, ${esc(S.user)}` : H.t('staff')}</p>
            <h1>${S.user ? t('adminDashboard') : t('adminLogin')}</h1>
          </div>
          ${S.user ? `<button class="btn secondary small logout" type="button" data-act="logout">${t('logout')}</button>` : ''}
        </header>
        ${S.user ? dashboardView() : loginView()}`;
    },
    async mount(root) {
      wirePassToggles(root);
      root.querySelector('.auth-form')?.addEventListener('submit', e => { e.preventDefault(); submitAuth(e.target); });

      root.addEventListener('input', e => {
        const f = e.target.dataset.f;
        if (!f) return;
        S[f] = e.target.value;
        S.page = 1;
        if (f === 'q') {
          const pos = e.target.selectionStart;
          H.rerender(true);
          const box = document.querySelector('[data-f=q]');
          box.focus();
          box.setSelectionRange(pos, pos);
        } else H.rerender(true);
      });

      root.addEventListener('click', async e => {
        const el = e.target.closest('button, tr[data-ref]');
        if (!el) return;
        const act = el.dataset.act;
        if (act === 'logout' && await H.confirm(L(A.confirmLogout), t('logout'))) {
          setUser(null);
          Object.assign(S, FILTERS, { records: [], classes: [] });
          location.hash = '#/';
        }
        if (act === 'reset-all' && await H.confirm(L(A.resetAllConfirm), L(A.resetAll), true)) {
          H.api.clearData(true);
          H.toast(L(A.resetDone));
          H.rerender(false);
        }
        if (act === 'sample') { H.api.addSampleData(sampleData()); await reload(); H.toast(L(A.sampleAdded)); H.rerender(true); }
        if (act === 'clear-data' && await H.confirm(L(A.clearConfirm), L(A.clearData), true)) {
          H.api.clearData(false);
          Object.assign(S, FILTERS);
          await reload();
          H.toast(L(A.cleared));
          H.rerender(true);
        }
        if (act === 'clear') { Object.assign(S, FILTERS); H.rerender(true); }
        if (act === 'csv') exportCsv();
        if (act === 'add-class') openClass(null);
        if (act === 'add-staff') openAddStaff();
        if (act === 'change-pass') openChangePassword();
        if (el.dataset.editClass) openClass(el.dataset.editClass);
        if (el.dataset.delClass && await H.confirm(L(A.confirmClass), t('delete'), true)) {
          await H.api.deleteClass(Number(el.dataset.delClass));
          H.toast(L(A.classDeleted));
          await reload();
          H.rerender(true);
        }
        if (el.dataset.delStaff && await H.confirm(L(A.confirmStaff)(el.dataset.delStaff), t('delete'), true)) {
          await H.api.deleteStaff(el.dataset.delStaff);
          H.toast(L(A.staffDeleted));
          H.rerender(true);
        }
        if (el.dataset.page) { S.page += Number(el.dataset.page); H.rerender(true); }
        if (el.dataset.view) openRecord(el.dataset.view);
        else if (el.dataset.ref) openRecord(el.dataset.ref);
      });
      root.addEventListener('keydown', e => {
        const row = e.target.closest?.('tr[data-ref]');
        if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openRecord(row.dataset.ref); }
      });

      // Pick up stories sent since the dashboard was last drawn (e.g. in another tab).
      if (S.user) {
        const before = JSON.stringify([S.records.length, S.classes]);
        await reload();
        if (JSON.stringify([S.records.length, S.classes]) !== before) H.rerender(true);
      }
    },
  };

  /* ---------- sample data ---------- */

  function sampleData() {
    const classes = ['1 BAKAWALI', '2 CEMPAKA', '3 DAHLIA', '4 KENANGA', '5 MELUR', '6 ORKID'];
    const names = ['Aina', 'Hakim', 'Mei Ling', 'Kumaran', 'Sofia', 'Anonymous'];
    const stories = [
      ['happy', 'Hari Sukan', 'Hari ini saya menang lumba lari dan kawan-kawan bersorak untuk saya.', 'New', ''],
      ['sad', 'Kucing saya hilang', 'Kucing saya tidak balik ke rumah sejak semalam. Saya rindu dia.', 'Follow-up', 'Counselor'],
      ['worried', 'Ujian Matematik', 'Saya risau tentang ujian minggu depan kerana saya tidak faham pecahan.', 'Reviewed', ''],
      ['angry', 'Bergaduh dengan kawan', 'Kawan saya ambil pensel saya tanpa minta izin.', 'New', 'Teacher'],
      ['proud', 'Pertandingan bercerita', 'Saya dapat tempat kedua dalam pertandingan bercerita!', 'Reviewed', ''],
      ['scared', 'Bunyi guruh', 'Malam tadi ada ribut dan saya takut tidur seorang.', 'Follow-up', 'Parents'],
    ];
    const now = Date.now();
    const sql = ms => new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
    const tag = Math.random().toString(36).slice(2, 6).toUpperCase();
    const records = stories.map(([emo, title, story, status, support], i) => {
      const e = PORTAL.emotions.find(x => x.emotion === emo);
      return {
        refNo: `SWP-CONTOH-${tag}-${i + 1}`, datetime: sql(now - i * 7.2e6), name: names[i], class: classes[i],
        emotionEmoji: e.emoji, emotionLabel: emo, keywords: title + (support ? ` | SUPPORT: ${support}` : ''), title, story, status,
        activityType: 'Story', sessionId: `SESSION-CONTOH-${i % 4}`,
      };
    });
    const types = ['Spelling Game', 'Memory Game', 'Activities Page', 'Emotion Cards', 'Share Story Page'];
    for (let i = 0; i < 18; i++) {
      const type = types[i % types.length];
      records.push({
        refNo: `ACT-CONTOH-${tag}-${i}`, datetime: sql(now - i * 3.1e6), name: 'Activity Log', class: '', emotionEmoji: '📊', emotionLabel: type,
        keywords: type, title: type + ' Activity', story: 'Student accessed ' + type + ' activity', status: 'Activity',
        activityType: type, sessionId: `SESSION-CONTOH-${i % 7}`,
      });
    }
    return { records, classes };
  }
})();
