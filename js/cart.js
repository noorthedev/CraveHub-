// ===================================================
//  CraveHub — Shopping Cart
//  Storage key: ch_cart -> [{id, qty}, ...]
// ===================================================

function getCart() {
  return JSON.parse(localStorage.getItem('ch_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('ch_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  flashAddedToCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(c => c.id !== id));
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(c => c.id !== id));
  } else {
    saveCart(cart);
  }
}

function getCartTotal() {
  return getCart().reduce((sum, c) => {
    const item = getMenuItemById(c.id);
    return sum + (item ? item.price * c.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

function flashAddedToCart() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => (badge.style.transform = 'scale(1)'), 200);
}

// ------------- Drawer markup -------------
function ensureCartDrawer() {
  if (document.getElementById('cartDrawer')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="drawer_overlay" id="cartOverlay"></div>
    <div class="drawer" id="cartDrawer">
      <div class="drawer_head">
        <h3>Your Cart</h3>
        <button class="drawer_close" id="cartCloseBtn">&times;</button>
      </div>
      <div class="drawer_body" id="cartDrawerBody"></div>
      <div class="drawer_footer" id="cartDrawerFooter"></div>
    </div>
  `;
  document.body.appendChild(div);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);
}

function openCartDrawer() {
  ensureCartDrawer();
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function renderCartDrawer() {
  ensureCartDrawer();
  const cart = getCart();
  const body = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="empty_state">
        <ion-icon name="cart-outline"></ion-icon>
        <p>Your cart is empty.<br>Add something delicious!</p>
      </div>`;
    footer.innerHTML = `<a href="menu.html" class="btn" style="width:100%; justify-content:center;">Browse Menu</a>`;
    return;
  }

  body.innerHTML = cart.map(c => {
    const item = getMenuItemById(c.id);
    if (!item) return '';
    return `
      <div class="cart_item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart_item_info">
          <h4>${item.name}</h4>
          <div class="cart_item_price">$${(item.price * c.qty).toFixed(2)}</div>
          <div class="qty_control">
            <button onclick="changeQty('${item.id}', -1)">−</button>
            <span>${c.qty}</span>
            <button onclick="changeQty('${item.id}', 1)">+</button>
          </div>
          <span class="remove_item" onclick="removeFromCart('${item.id}')">Remove</span>
        </div>
      </div>`;
  }).join('');

  footer.innerHTML = `
    <div class="cart_total_row">
      <span>Total</span>
      <span>$${getCartTotal().toFixed(2)}</span>
    </div>
    <a href="checkout.html" class="btn" style="width:100%; justify-content:center;">Checkout</a>
  `;
}
