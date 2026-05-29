/* ============================================================
   LEOMAX Strategy OS — Auth helpers
   Token lives in localStorage. Worker handles validation.
   ============================================================ */

(function (window) {
  'use strict';

  // === CONFIGURATION ==========================================
  // After deploying the Strategy OS worker, replace this URL with
  // the worker's deployed URL (e.g. https://leomax-strategy-os.
  // <subdomain>.workers.dev or a custom domain like api.leomax.com).
  const API_BASE = 'https://leomax-strategy-os.anas-msd-ramsees.workers.dev';

  const TOKEN_KEY = 'leomax_strategy_token';
  const USER_KEY = 'leomax_strategy_user';

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
  function setToken(t) {
    try { localStorage.setItem(TOKEN_KEY, t); } catch {}
  }
  function clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }
  function getCachedUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  }
  function setCachedUser(u) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {}
  }

  async function api(path, opts) {
    opts = opts || {};
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      opts.headers || {}
    );
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API_BASE + path, {
      method: opts.method || 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    let data;
    try { data = await res.json(); } catch { data = { error: 'Bad response' }; }

    if (!res.ok) {
      const err = new Error(data.error || 'Request failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function signup(payload) {
    const res = await api('/auth/signup', { method: 'POST', body: payload });
    if (res.token) setToken(res.token);
    if (res.user) setCachedUser(res.user);
    return res;
  }

  async function login(email, password) {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (res.token) setToken(res.token);
    if (res.user) setCachedUser(res.user);
    return res;
  }

  async function logout() {
    try { await api('/auth/logout', { method: 'POST' }); } catch {}
    clearToken();
  }

  async function me() {
    const res = await api('/auth/me');
    if (res.user) setCachedUser(res.user);
    return res.user;
  }

  async function saveData(data) {
    return api('/user/data', { method: 'POST', body: data });
  }

  async function getData() {
    const res = await api('/user/data');
    return res.data || {};
  }

  function isLoggedIn() {
    return Boolean(getToken());
  }

  function requireAuth(redirectTo) {
    if (!isLoggedIn()) {
      window.location.replace(redirectTo || 'login.html');
      return false;
    }
    return true;
  }

  function requireGuest(redirectTo) {
    if (isLoggedIn()) {
      window.location.replace(redirectTo || 'dashboard.html');
      return false;
    }
    return true;
  }

  window.LMAuth = {
    API_BASE,
    getToken, clearToken, getCachedUser, setCachedUser,
    signup, login, logout, me,
    saveData, getData,
    isLoggedIn, requireAuth, requireGuest,
  };
})(window);
