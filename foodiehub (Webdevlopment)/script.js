/* =============================================
   FoodieHub – Main Script
   Handles: Cart, Dark Mode, Search, Filter,
            Slider, Scroll Animations, Forms
   ============================================= */

// ── Data: All Menu Items ──────────────────────
const MENU_ITEMS = [
  // Pizzas
  { id: 1, name: "Margherita Pizza",   emoji: "🍕", category: "pizza",   price: 199, orig: 249, desc: "Classic tomato base, mozzarella, fresh basil & oregano.",     rating: 4.5, veg: true,  badge: "Bestseller" },
  { id: 2, name: "Pepperoni Feast",    emoji: "🍕", category: "pizza",   price: 299, orig: 359, desc: "Loaded with spicy pepperoni, jalapeños & extra cheese.",       rating: 4.7, veg: false, badge: "Spicy 🌶" },
  { id: 3, name: "Paneer Tikka Pizza", emoji: "🍕", category: "pizza",   price: 249, orig: null, desc: "Indian-fusion with smoky paneer tikka & mint chutney drizzle.", rating: 4.6, veg: true,  badge: "Veg" },
  { id: 4, name: "Farm Fresh Veggie",  emoji: "🍕", category: "pizza",   price: 219, orig: 269, desc: "Colorful bell peppers, olives, corn & mushrooms on cheesy base.", rating: 4.3, veg: true,  badge: "Veg" },
  // Burgers
  { id: 5, name: "Classic Veg Burger", emoji: "🍔", category: "burgers", price: 129, orig: 159, desc: "Crispy potato patty, lettuce, onion & our secret sauce.",       rating: 4.4, veg: true,  badge: "Veg" },
  { id: 6, name: "Zinger Burger",      emoji: "🍔", category: "burgers", price: 169, orig: 199, desc: "Crunchy chicken fillet, coleslaw, jalapeños & spicy mayo.",     rating: 4.8, veg: false, badge: "Popular" },
  { id: 7, name: "Double Smash Burger",emoji: "🍔", category: "burgers", price: 249, orig: null, desc: "Two smashed beef patties, caramelized onions & American cheese.",rating: 4.9, veg: false, badge: "New 🔥" },
  { id: 8, name: "BBQ Paneer Burger",  emoji: "🍔", category: "burgers", price: 149, orig: 179, desc: "Grilled paneer, BBQ sauce, crispy onions & fresh lettuce.",     rating: 4.5, veg: true,  badge: "Veg" },
  // Drinks
  { id: 9,  name: "Cold Coffee",       emoji: "☕", category: "drinks",  price: 99,  orig: 129, desc: "Rich espresso blended with chilled milk, ice & a hint of caramel.", rating: 4.7, veg: true, badge: "Chilled" },
  { id: 10, name: "Mango Lassi",       emoji: "🥭", category: "drinks",  price: 79,  orig: null, desc: "Thick, creamy yogurt blended with fresh Alphonso mangoes.",     rating: 4.8, veg: true, badge: "Summer ☀️" },
  { id: 11, name: "Fresh Lime Soda",   emoji: "🍋", category: "drinks",  price: 59,  orig: 79,  desc: "Zingy lemon, chilled soda, black salt & mint. Super refreshing.", rating: 4.4, veg: true, badge: "Refreshing" },
  { id: 12, name: "Oreo Milkshake",    emoji: "🥤", category: "drinks",  price: 119, orig: 149, desc: "Creamy milkshake loaded with Oreo cookie crumble & whipped cream.", rating: 4.6, veg: true, badge: "Indulgent" },
  // Desserts
  { id: 13, name: "Chocolate Lava Cake", emoji: "🎂", category: "desserts", price: 149, orig: null, desc: "Warm chocolate cake with gooey molten center, served with ice cream.", rating: 4.9, veg: true,  badge: "Chef's Pick" },
  { id: 14, name: "Gulab Jamun",        emoji: "🍮", category: "desserts", price: 89,  orig: 109, desc: "Soft, syrup-soaked milk dumplings served warm with cardamom.",    rating: 4.7, veg: true,  badge: "Desi Fav" },
  { id: 15, name: "Vanilla Ice Cream",  emoji: "🍦", category: "desserts", price: 69,  orig: null, desc: "Three scoops of premium vanilla ice cream with chocolate sauce.",   rating: 4.5, veg: true,  badge: "Classic" },
  { id: 16, name: "Tiramisu",           emoji: "🍰", category: "desserts", price: 169, orig: 199, desc: "Italian classic with espresso-soaked ladyfingers and mascarpone.",   rating: 4.8, veg: true,  badge: "Premium" },
];

// ── State ──────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('fh_cart') || '[]');
let theme = localStorage.getItem('fh_theme') || 'light';

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(theme);
  setupNavbar();
  setupDarkModeToggle();
  setupCart();
  setupScrollReveal();
  updateCartBadge();

  // Page-specific init
  const page = document.body.dataset.page;
  if (page === 'home')    initHome();
  if (page === 'menu')    initMenu();
  if (page === 'contact') initContact();
});

// ── Theme ──────────────────────────────────────
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('darkModeBtn');
  if (btn) btn.innerHTML = t === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

function setupDarkModeToggle() {
  const btn = document.getElementById('darkModeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fh_theme', theme);
    applyTheme(theme);
    showToast(theme === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  });
}

// ── Navbar ─────────────────────────────────────
function setupNavbar() {
  // Scroll shadow
  const nav = document.querySelector('.navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
  // Active link
  const links = document.querySelectorAll('.nav-links a, .mobile-nav a');
  links.forEach(a => {
    if (a.href === location.href || a.getAttribute('href') === location.pathname.split('/').pop()) {
      a.classList.add('active');
    }
  });
  // Hamburger
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileNav');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !mob.contains(e.target)) {
        ham.classList.remove('open');
        mob.classList.remove('open');
      }
    });
  }
}

// ── Cart System ────────────────────────────────
function saveCart() { localStorage.setItem('fh_cart', JSON.stringify(cart)); }

function updateCartBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
    b.classList.toggle('visible', count > 0);
  });
}

function addToCart(itemId) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(`🛒 ${item.name} added to cart!`);
  // Visual feedback on button
  const btn = document.querySelector(`[data-add="${itemId}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add';
    }, 1500);
  }
}

function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function changeQty(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(itemId);
  else { saveCart(); updateCartBadge(); renderCartItems(); }
}

function renderCartItems() {
  const wrap = document.getElementById('cartItems');
  if (!wrap) return;
  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br>Add some delicious food!</p>
      </div>`;
    updateCartFooter();
    return;
  }
  wrap.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price * item.qty}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${item.id})" title="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>`).join('');
  updateCartFooter();
}

function updateCartFooter() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const tax      = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + tax;
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `₹${subtotal}`;
  if (el('cartDelivery')) el('cartDelivery').textContent = delivery > 0 ? `₹${delivery}` : 'FREE';
  if (el('cartTax'))      el('cartTax').textContent      = `₹${tax}`;
  if (el('cartTotal'))    el('cartTotal').textContent    = `₹${total}`;
}

function setupCart() {
  const openBtns = document.querySelectorAll('.open-cart');
  const panel    = document.getElementById('cartPanel');
  const overlay  = document.getElementById('cartOverlay');
  const closBtn  = document.getElementById('cartClose');

  openBtns.forEach(b => b.addEventListener('click', openCart));
  if (closBtn)  closBtn.addEventListener('click', closeCart);
  if (overlay)  overlay.addEventListener('click', closeCart);

  renderCartItems();

  // Place order
  const placeBtn = document.getElementById('placeOrder');
  if (placeBtn) placeBtn.addEventListener('click', placeOrder);

  // Close modal
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);
}

function openCart() {
  document.getElementById('cartPanel')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartPanel')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function placeOrder() {
  if (cart.length === 0) { showToast('🛒 Your cart is empty!'); return; }
  buildBill();
  closeCart();
  document.getElementById('orderModal')?.classList.add('open');
}

function buildBill() {
  const tbody = document.getElementById('billBody');
  if (!tbody) return;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 40;
  const tax      = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + tax;
  tbody.innerHTML = cart.map(i =>
    `<tr><td>${i.name}</td><td>×${i.qty}</td><td>₹${i.price * i.qty}</td></tr>`
  ).join('') + `
    <tr><td colspan="2">Delivery</td><td>₹${delivery}</td></tr>
    <tr><td colspan="2">GST (5%)</td><td>₹${tax}</td></tr>`;
  document.getElementById('billTotal').textContent = `₹${total}`;
  document.getElementById('orderNum').textContent  = '#FH' + Math.floor(10000 + Math.random() * 90000);
  // Clear cart after order
  cart = []; saveCart(); updateCartBadge(); renderCartItems();
}

function closeModal() {
  document.getElementById('orderModal')?.classList.remove('open');
}

// ── Home Page ──────────────────────────────────
function initHome() {
  initSlider();
  // Render featured items (first 8)
  const grid = document.getElementById('featuredGrid');
  if (grid) {
    const featured = MENU_ITEMS.filter((_, i) => i < 8);
    grid.innerHTML = featured.map(item => buildFoodCard(item)).join('');
  }
}

// ── Menu Page ──────────────────────────────────
let activeCategory = 'all';

function initMenu() {
  renderMenuItems();
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderMenuItems();
    });
  });
  // Search
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', renderMenuItems);
  }
}

function renderMenuItems() {
  const grid   = document.getElementById('menuGrid');
  const query  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  if (!grid) return;

  const filtered = MENU_ITEMS.filter(item => {
    const catOk  = activeCategory === 'all' || item.category === activeCategory;
    const nameOk = !query || item.name.toLowerCase().includes(query)
                           || item.desc.toLowerCase().includes(query);
    return catOk && nameOk;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>No items found for "<strong>${query}</strong>"</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => buildFoodCard(item)).join('');
}

// ── Food Card Builder ──────────────────────────
function buildFoodCard(item) {
  const bgColors = {
    pizza:   'linear-gradient(135deg,#FFF0E8,#FFD9C0)',
    burgers: 'linear-gradient(135deg,#FFF5E0,#FFEDC0)',
    drinks:  'linear-gradient(135deg,#E8F4FF,#C8E8FF)',
    desserts:'linear-gradient(135deg,#FCE8F0,#FCCBE0)',
  };
  const bg = bgColors[item.category] || '#FFF0E8';
  const badge = item.badge
    ? `<span class="food-card-badge ${item.veg ? 'veg' : ''}">${item.badge}</span>` : '';
  const origPrice = item.orig
    ? `<span>₹${item.orig}</span>` : '';
  return `
    <div class="food-card reveal">
      <div class="food-card-img" style="background:${bg}">
        ${badge}
        ${item.emoji}
      </div>
      <div class="food-card-body">
        <div class="food-card-rating">
          <span class="stars">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}</span>
          ${item.rating}
        </div>
        <div class="food-card-name">${item.name}</div>
        <div class="food-card-desc">${item.desc}</div>
        <div class="food-card-meta">
          <div class="food-card-price">₹${item.price} ${origPrice}</div>
          <button class="btn-add" data-add="${item.id}" onclick="addToCart(${item.id})">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>`;
}

// ── Image Slider ───────────────────────────────
function initSlider() {
  const track = document.getElementById('sliderTrack');
  const dots  = document.getElementById('sliderDots');
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  let current = 0;
  let autoSlide;

  // Build dots
  if (dots) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dots.appendChild(d);
    });
  }

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    const slideW = slides[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * slideW}px)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => goTo(current + 1), 3500);
  }

  document.getElementById('sliderPrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('sliderNext')?.addEventListener('click', () => goTo(current + 1));

  resetAuto();
  window.addEventListener('resize', () => goTo(current));
}

// ── Scroll Reveal ──────────────────────────────
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// ── Contact Form ───────────────────────────────
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
      showToast('✅ Message sent successfully!');
    }, 1200);
  });
}

// ── Toast Notification ─────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Re-run scroll reveal on dynamic content ────
const gridObserver = new MutationObserver(() => setupScrollReveal());
['featuredGrid', 'menuGrid'].forEach(id => {
  const el = document.getElementById(id);
  if (el) gridObserver.observe(el, { childList: true });
});
