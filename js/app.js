// ===================================================
//  CraveHub — App Shell
//  Loader, scroll-to-top, shared food-card renderer,
//  interactive star ratings.
// ===================================================

// ---------------- Loader ----------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 400);
  }
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60 });
});

// ---------------- Scroll to top ----------------
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

// ---------------- Ratings (stored per-item in localStorage) ----------------
function getRatingOverride(id) {
  const ratings = JSON.parse(localStorage.getItem('ch_ratings') || '{}');
  return ratings[id];
}
function setRatingOverride(id, value) {
  const ratings = JSON.parse(localStorage.getItem('ch_ratings') || '{}');
  ratings[id] = value;
  localStorage.setItem('ch_ratings', JSON.stringify(ratings));
}
function renderStars(id, baseRating) {
  const current = getRatingOverride(id) || baseRating;
  const rounded = Math.round(current);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<ion-icon data-star="${i}" name="${i <= rounded ? 'star' : 'star-outline'}"></ion-icon>`;
  }
  return html;
}

// ---------------- Shared Food Card ----------------
function renderFoodCard(item) {
  const wished = typeof isWishlisted === 'function' && isWishlisted(item.id);
  return `
    <div class="food_card" data-aos="fade-up" data-id="${item.id}" data-name="${item.name.toLowerCase()}" data-category="${item.category}">
      <div class="food_img">
        <img src="${item.image}" alt="${item.name}">
        <button class="wish_toggle ${wished ? 'active' : ''}" data-id="${item.id}" title="Add to favorites">
          <ion-icon name="${wished ? 'heart' : 'heart-outline'}"></ion-icon>
        </button>
      </div>
      <div class="food_details">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="stars" data-id="${item.id}" data-rating="${item.rating}">${renderStars(item.id, item.rating)}</div>
        <div class="food_bottom">
          <span class="food_price">$${item.price.toFixed(2)}</span>
          <button class="add_cart_btn" data-id="${item.id}" title="Add to cart"><ion-icon name="add"></ion-icon></button>
        </div>
      </div>
    </div>`;
}

function wireFoodCardEvents() {
  // Add to cart
  document.querySelectorAll('.add_cart_btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id')));
  });
  // Wishlist toggle
  document.querySelectorAll('.wish_toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      toggleWishlist(id);
      const active = btn.classList.contains('active');
      btn.querySelector('ion-icon').setAttribute('name', active ? 'heart-outline' : 'heart');
    });
  });
  // Star ratings — click to rate
  document.querySelectorAll('.stars').forEach(starsEl => {
    const id = starsEl.getAttribute('data-id');
    starsEl.querySelectorAll('ion-icon').forEach(star => {
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = parseInt(star.getAttribute('data-star'), 10);
        setRatingOverride(id, val);
        starsEl.innerHTML = renderStars(id, parseFloat(starsEl.getAttribute('data-rating')));
        wireSingleStarGroup(starsEl);
      });
    });
  });
}
function wireSingleStarGroup(starsEl) {
  const id = starsEl.getAttribute('data-id');
  starsEl.querySelectorAll('ion-icon').forEach(star => {
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = parseInt(star.getAttribute('data-star'), 10);
      setRatingOverride(id, val);
      starsEl.innerHTML = renderStars(id, parseFloat(starsEl.getAttribute('data-rating')));
      wireSingleStarGroup(starsEl);
    });
  });
}
