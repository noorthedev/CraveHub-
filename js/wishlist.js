// ===================================================
//  CraveHub — Wishlist
//  Storage key: ch_wishlist -> [id, id, ...]
// ===================================================

function getWishlist() {
  return JSON.parse(localStorage.getItem('ch_wishlist') || '[]');
}
function saveWishlist(list) {
  localStorage.setItem('ch_wishlist', JSON.stringify(list));
  updateWishBadge();
  renderWishDrawer();
  document.querySelectorAll('.wish_toggle').forEach(btn => {
    const id = btn.getAttribute('data-id');
    btn.classList.toggle('active', list.includes(id));
  });
}

function isWishlisted(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx > -1) list.splice(idx, 1);
  else list.push(id);
  saveWishlist(list);
}

function updateWishBadge() {
  const badge = document.getElementById('wishBadge');
  if (badge) badge.textContent = getWishlist().length;
}

// ------------- Drawer markup -------------
function ensureWishDrawer() {
  if (document.getElementById('wishDrawer')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="drawer_overlay" id="wishOverlay"></div>
    <div class="drawer" id="wishDrawer">
      <div class="drawer_head">
        <h3>Your Favorites</h3>
        <button class="drawer_close" id="wishCloseBtn">&times;</button>
      </div>
      <div class="drawer_body" id="wishDrawerBody"></div>
    </div>
  `;
  document.body.appendChild(div);
  document.getElementById('wishCloseBtn').addEventListener('click', closeWishDrawer);
  document.getElementById('wishOverlay').addEventListener('click', closeWishDrawer);
}

function openWishDrawer() {
  ensureWishDrawer();
  renderWishDrawer();
  document.getElementById('wishDrawer').classList.add('open');
  document.getElementById('wishOverlay').classList.add('open');
}
function closeWishDrawer() {
  document.getElementById('wishDrawer').classList.remove('open');
  document.getElementById('wishOverlay').classList.remove('open');
}

function renderWishDrawer() {
  ensureWishDrawer();
  const list = getWishlist();
  const body = document.getElementById('wishDrawerBody');

  if (list.length === 0) {
    body.innerHTML = `
      <div class="empty_state">
        <ion-icon name="heart-outline"></ion-icon>
        <p>No favorites yet.<br>Tap the heart on any dish!</p>
      </div>`;
    return;
  }

  body.innerHTML = list.map(id => {
    const item = getMenuItemById(id);
    if (!item) return '';
    return `
      <div class="wish_item">
        <img src="${item.image}" alt="${item.name}">
        <div class="wish_item_info">
          <h4>${item.name}</h4>
          <div class="cart_item_price">$${item.price.toFixed(2)}</div>
        </div>
        <button class="icon_btn" onclick="addToCart('${item.id}'); toggleWishlist('${item.id}')" title="Move to cart">
          <ion-icon name="cart"></ion-icon>
        </button>
      </div>`;
  }).join('');
}
