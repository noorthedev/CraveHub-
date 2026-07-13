// ===================================================
//  CraveHub — Theme Switcher (Dark / Light)
//  NOTE: initial theme is applied instantly by a tiny
//  inline script in <head> of every page (no flash).
//  This file only wires up the toggle button.
// ===================================================

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ch_theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark'
      ? '<ion-icon name="moon"></ion-icon>'
      : '<ion-icon name="sunny"></ion-icon>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const current = localStorage.getItem('ch_theme') || 'dark';
  applyTheme(current);

  // Small delay so the button exists after header injection
  setTimeout(() => {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      applyTheme(current);
      btn.addEventListener('click', () => {
        const now = document.documentElement.getAttribute('data-theme');
        applyTheme(now === 'dark' ? 'light' : 'dark');
      });
    }
  }, 0);
});
