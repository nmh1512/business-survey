// @ts-nocheck
const STORAGE_KEYS = {
  progress: 'docorp_progress_v1',
  history: 'docorp_history_v1',
  session: 'docorp_session_v1',
  adminToken: 'docorp_admin_token_v1',
};

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

export const Storage = {
  getProgress: () => safeParse(localStorage.getItem(STORAGE_KEYS.progress), null),
  setProgress: (v) => localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(v)),
  clearProgress: () => localStorage.removeItem(STORAGE_KEYS.progress),
  getHistory: () => safeParse(localStorage.getItem(STORAGE_KEYS.history), []),
  addHistory: (entry) => {
    const cur = Storage.getHistory();
    cur.push(entry);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(cur));
  },
  clearHistory: () => localStorage.removeItem(STORAGE_KEYS.history),
  getSessionId: () => {
    const existing = localStorage.getItem(STORAGE_KEYS.session);
    if (existing) return existing;
    const next = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : `docorp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(STORAGE_KEYS.session, next);
    return next;
  },
  getAdminToken: () => localStorage.getItem(STORAGE_KEYS.adminToken),
  setAdminToken: (token) => localStorage.setItem(STORAGE_KEYS.adminToken, token),
  clearAdminToken: () => localStorage.removeItem(STORAGE_KEYS.adminToken),
};
