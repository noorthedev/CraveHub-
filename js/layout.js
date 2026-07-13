// ===================================================
//  CraveHub — Shared Layout (Header + Footer)
// ===================================================

function renderHeader() {
  const current = document.body.getAttribute('data-page') || 'home';

  const navItem = (page, href, label) =>
    `<a href="${href}" class="${current === page ? 'active' : ''}">${label}</a>`;

  document.getElementById('site-header').innerHTML = `
    <header class="site_header">
      <nav class="navbar">
        <a href="index.html" class="logo">
          <ion-icon name="restaurant"></ion-icon> CraveHub
        </a>

        <div class="nav_links" id="navLinks">
          ${navItem('home', 'index.html', 'Home')}
          ${navItem('menu', 'menu.html', 'Menu')}
          ${navItem('about', 'about.html', 'About')}
          ${navItem('gallery', 'gallery.html', 'Gallery')}
          ${navItem('reservation', 'reservation.html', 'Reservation')}
          ${navItem('track-order', 'track-order.html', 'Track Order')}
          ${navItem('contact', 'contact.html', 'Contact')}
        </div>

        <div class="nav_actions">
          <div class="search_box">
            <ion-icon name="search"></ion-icon>
            <input type="text" id="quickSearch" placeholder="Search food...">
          </div>
          <button class="icon_btn" id="themeToggleBtn" title="Toggle theme">
            <ion-icon name="moon"></ion-icon>
          </button>
          <button class="icon_btn" id="wishIconBtn" title="Wishlist">
            <ion-icon name="heart"></ion-icon>
            <span class="badge" id="wishBadge">0</span>
          </button>
          <button class="icon_btn" id="cartIconBtn" title="Cart">
            <ion-icon name="cart"></ion-icon>
            <span class="badge" id="cartBadge">0</span>
          </button>
          <button class="icon_btn" id="profileIconBtn" title="Account">
            <ion-icon name="person-circle"></ion-icon>
          </button>
          <button class="hamburger" id="hamburgerBtn">
            <ion-icon name="menu"></ion-icon>
          </button>
        </div>
      </nav>
    </header>
  `;

  // Hamburger toggle
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Quick search -> redirect to menu page with query
  const quickSearch = document.getElementById('quickSearch');
  quickSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && quickSearch.value.trim()) {
      window.location.href = `menu.html?q=${encodeURIComponent(quickSearch.value.trim())}`;
    }
  });

  // Profile icon -> login or profile page depending on session
  document.getElementById('profileIconBtn').addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('ch_user') || 'null');
    window.location.href = user ? 'profile.html' : 'login.html';
  });

  document.getElementById('wishIconBtn').addEventListener('click', openWishDrawer);
  document.getElementById('cartIconBtn').addEventListener('click', openCartDrawer);
}

function renderFooter() {
  const year = new Date().getFullYear();
  document.getElementById('site-footer').innerHTML = `
    <footer class="site_footer">
      <div class="footer_grid">
        <div>
          <h4 class="logo">CraveHub</h4>
          <p>Where every recipe is a family heirloom and every guest becomes part of ours. Buon appetito!</p>
          <div class="social_row">
            <ion-icon name="logo-facebook"></ion-icon>
            <ion-icon name="logo-instagram"></ion-icon>
            <ion-icon name="logo-twitter"></ion-icon>
            <ion-icon name="logo-whatsapp"></ion-icon>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="reservation.html">Reservation</a></li>
            <li><a href="track-order.html">Track Order</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><ion-icon name="location"></ion-icon> 12 Via Roma, Downtown</li>
            <li><ion-icon name="call"></ion-icon> +91 987654321</li>
            <li><ion-icon name="mail"></ion-icon> hello@cravehub.com</li>
          </ul>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p style="margin-bottom:12px;">Get offers & new dish alerts in your inbox.</p>
          <form id="newsletterForm" style="display:flex; gap:8px;">
            <input type="email" id="newsletterEmail" placeholder="Your email" required
              style="flex:1; padding:9px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:12px; outline:none;">
            <button type="submit" class="icon_btn" style="background:var(--gold); color:#17130a; border-radius:8px; padding:0 12px;">
              <ion-icon name="paper-plane"></ion-icon>
            </button>
          </form>
          <p id="newsletterStatus" style="font-size:11px; margin-top:8px; color:var(--gold);"></p>
        </div>
      </div>
      <div class="footer_bottom">
        &copy; ${year} CraveHub. All Rights Reserved.
      </div>
    </footer>
  `;

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

      const subs = JSON.parse(localStorage.getItem('ch_newsletter') || '[]');
      if (!subs.includes(email)) subs.push(email);
      localStorage.setItem('ch_newsletter', JSON.stringify(subs));

      if (typeof sendMailNotification === 'function') {
        sendMailNotification('Newsletter Signup', { from_name: 'Newsletter Subscriber', from_email: email, message: `New newsletter signup: ${email}` }).catch(() => {});
      }
      document.getElementById('newsletterStatus').textContent = 'Subscribed! Thanks for joining.';
      newsletterForm.reset();
    });
  }
}

// ---------------- WhatsApp + Live Chat (site-wide) ----------------
function renderFloatingWidgets() {
  if (document.getElementById('whatsappFloatBtn')) return;

  // WhatsApp — replace the phone number below with your own (country code, no + or spaces)
  const WHATSAPP_NUMBER = '911234567890';
  const wa = document.createElement('a');
  wa.id = 'whatsappFloatBtn';
  wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi CraveHub! I have a question about my order.')}`;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.title = 'Chat on WhatsApp';
  wa.style.cssText = `
    position:fixed; left:26px; bottom:30px; width:52px; height:52px;
    background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 20px rgba(0,0,0,0.3); z-index:450; font-size:28px; color:#fff;`;
  wa.innerHTML = '<ion-icon name="logo-whatsapp"></ion-icon>';
  document.body.appendChild(wa);

  // Live Chat — free widgets like Tawk.to or Crisp work without a backend.
  // Sign up free at https://www.tawk.to, then paste your own widget script
  // below in place of this placeholder to enable real live chat.
  // <script async src="https://embed.tawk.to/YOUR_WIDGET_ID/default"></script>
}

document.addEventListener('DOMContentLoaded', renderFloatingWidgets);

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  updateCartBadge();
  updateWishBadge();

  // Pre-fill quick search if a query param exists (used on menu.html)
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const searchInput = document.getElementById('quickSearch');
    if (searchInput) searchInput.value = q;
  }
});
