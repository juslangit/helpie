/* Data for the demo: everything is kept in this browser (localStorage), with no server.
 * Stories, activity logs, classes and staff accounts live only on the device being used.
 * Records keep the same fields as the school portal, so a real server could be swapped in later. */
'use strict';
window.H = window.H || {};

(() => {
  const KEY = 'helpie-demo-db-v1';
  const blank = () => ({ records: [], classes: [], staff: [], nextClassId: 1 });

  let memory = null; // used when the browser blocks storage (private mode etc.)
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || blank(); } catch { return memory || blank(); }
  }
  function write(db) {
    memory = db;
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  }
  const update = fn => { const db = read(); const out = fn(db); write(db); return out; };
  const ok = (data = null) => Promise.resolve({ ok: true, data });
  const fail = error => Promise.resolve({ ok: false, error });

  let sessionId = null;
  try { sessionId = sessionStorage.getItem('evoSessionId'); } catch {}
  if (!sessionId) {
    sessionId = 'SESSION-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
    try { sessionStorage.setItem('evoSessionId', sessionId); } catch {}
  }
  const nowSql = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

  H.refNumber = () => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `SWP-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  };

  /* ---------- passwords: PBKDF2-SHA256 with a random salt, never stored as typed ---------- */

  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  async function hashPassword(password, saltHex) {
    const salt = saltHex ? Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16))) : crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 150000 }, key, 256);
    return { salt: hex(salt), hash: hex(bits) };
  }
  const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

  H.api = {
    /* ---------- records (stories and activity logs) ---------- */

    // Resolves to { ok, record } where record is exactly what was saved.
    async createRecord(fields) {
      const record = { datetime: nowSql(), sessionId, ...fields };
      update(db => db.records.unshift(record));
      return { ok: true, record };
    },
    updateRecord(record) {
      const found = update(db => {
        const i = db.records.findIndex(r => r.refNo === record.refNo);
        if (i >= 0) db.records[i] = { ...db.records[i], ...record };
        return i >= 0;
      });
      return found ? ok() : fail('Not found');
    },
    deleteRecord(refNo) {
      update(db => { db.records = db.records.filter(r => r.refNo !== refNo); });
      return ok();
    },
    // Staff only: the dashboard checks the session before calling this.
    records: () => Promise.resolve(read().records),
    track(activityType, extra = {}) {
      return H.api.createRecord({
        refNo: 'ACT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        name: 'Activity Log', class: '', emotionEmoji: '📊', emotionLabel: activityType, keywords: activityType,
        title: activityType + ' Activity', story: 'Student accessed ' + activityType + ' activity',
        status: 'Activity', activityType,
        ...extra,
      });
    },

    /* ---------- classes ---------- */

    classList: () => Promise.resolve(read().classes),
    classes: async () => read().classes.map(c => c.class_name),
    saveClass(id, className) {
      const clash = read().classes.some(c => c.class_name === className && c.id !== id);
      if (clash) return fail(H.lang() === 'bm' ? 'Kelas ini sudah ada' : 'This class already exists');
      update(db => {
        if (id) { const c = db.classes.find(x => x.id === id); if (c) c.class_name = className; }
        else db.classes.push({ id: db.nextClassId++, class_name: className });
        db.classes.sort((a, b) => a.class_name.localeCompare(b.class_name, undefined, { numeric: true }));
      });
      return ok();
    },
    deleteClass(id) {
      update(db => { db.classes = db.classes.filter(c => c.id !== id); });
      return ok();
    },

    /* ---------- staff accounts ---------- */

    hasStaff: () => read().staff.length > 0,
    staffList: () => read().staff.map(s => ({ username: s.username, created: s.created })),
    async createStaff(username, password) {
      if (read().staff.some(s => sameName(s.username, username))) return { ok: false, error: 'exists' };
      const { salt, hash } = await hashPassword(password);
      update(db => db.staff.push({ username: username.trim(), salt, hash, created: nowSql() }));
      return { ok: true };
    },
    async login(username, password) {
      const s = read().staff.find(x => sameName(x.username, username));
      // Hash even for unknown names so both cases take the same time.
      const { hash } = await hashPassword(password, s ? s.salt : '00'.repeat(16));
      return s && hash === s.hash ? { ok: true, username: s.username } : { ok: false };
    },
    async changePassword(username, current, next) {
      if (!(await H.api.login(username, current)).ok) return { ok: false, error: 'wrong' };
      const { salt, hash } = await hashPassword(next);
      update(db => Object.assign(db.staff.find(x => x.username === username), { salt, hash }));
      return { ok: true };
    },
    deleteStaff(username) {
      update(db => { db.staff = db.staff.filter(s => s.username !== username); });
      return ok();
    },

    /* ---------- demo helpers ---------- */

    addSampleData(sample) {
      update(db => {
        const have = new Set(db.classes.map(c => c.class_name));
        sample.classes.forEach(name => { if (!have.has(name)) db.classes.push({ id: db.nextClassId++, class_name: name }); });
        db.records = [...sample.records, ...db.records].sort((a, b) => String(b.datetime).localeCompare(String(a.datetime)));
      });
    },
    // Wipes stories, logs and classes; keeps staff accounts unless told otherwise.
    clearData(includeStaff = false) {
      update(db => { db.records = []; db.classes = []; db.nextClassId = 1; if (includeStaff) db.staff = []; });
    },
  };
})();
