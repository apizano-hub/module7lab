/*
 * EmberAuth — a front-end-only demo of registration/login.
 *
 * IMPORTANT: this keeps users in a plain in-memory array. There is no
 * database and no browser storage (no localStorage/sessionStorage/cookies),
 * so every account and session resets the moment the page is reloaded.
 * That's intentional for this static, no-backend demo — see the note on
 * login.html and the README for what a real deployment needs instead
 * (a server-side auth provider, hashed passwords, HTTPS, etc).
 */
window.EmberAuth = (function () {
  const users = [
    { name: 'Jordan Reyes', email: 'jordan@example.com', password: 'demo1234' }
  ];
  let currentUser = null;

  function findUser(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  function register(name, email, password) {
    if (!name || !email || !password) return { ok: false, error: 'All fields are required.' };
    if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    if (findUser(email)) return { ok: false, error: 'An account with that email already exists.' };
    const user = { name, email, password };
    users.push(user);
    currentUser = user;
    return { ok: true, user };
  }

  function login(email, password) {
    const user = findUser(email);
    if (!user || user.password !== password) {
      return { ok: false, error: 'Email or password is incorrect.' };
    }
    currentUser = user;
    return { ok: true, user };
  }

  function logout() {
    currentUser = null;
  }

  function getCurrentUser() {
    return currentUser;
  }

  return { register, login, logout, getCurrentUser };
})();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const dashboard = document.getElementById('account-dashboard');
  const authCard = document.getElementById('auth-card');

  function showDashboard(user) {
    if (!dashboard) return;
    document.getElementById('dash-name').textContent = user.name;
    document.getElementById('dash-email').textContent = user.email;
    authCard.style.display = 'none';
    dashboard.style.display = 'block';
  }

  // If a session already exists in memory (e.g. navigated from another
  // in-page action during this load), reflect it immediately.
  const existing = window.EmberAuth.getCurrentUser();
  if (existing) showDashboard(existing);

  if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active'); registerTab.classList.remove('active');
      loginForm.style.display = 'block'; registerForm.style.display = 'none';
    });
    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active'); loginTab.classList.remove('active');
      registerForm.style.display = 'block'; loginForm.style.display = 'none';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      const result = window.EmberAuth.login(email, password);
      if (result.ok) {
        errorEl.style.display = 'none';
        showDashboard(result.user);
        renderGreeting();
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const errorEl = document.getElementById('register-error');
      const result = window.EmberAuth.register(name, email, password);
      if (result.ok) {
        errorEl.style.display = 'none';
        showDashboard(result.user);
        renderGreeting();
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.EmberAuth.logout();
      dashboard.style.display = 'none';
      authCard.style.display = 'block';
      renderGreeting();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('contact-success').style.display = 'block';
      contactForm.reset();
    });
  }
});
