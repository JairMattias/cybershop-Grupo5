// ===== PRODUCTOS =====
const PRODUCTS = [
  // ANTIVIRUS
  { id: 1,  name: 'Antivirus Pro',        cat: 'antivirus', price: 25,  icon: '🛡️', desc: 'Protección en tiempo real contra malware, ransomware y spyware.' },
  { id: 2,  name: 'Antivirus Total 360',  cat: 'antivirus', price: 45,  icon: '🔰', desc: 'Suite completa con firewall integrado y análisis heurístico avanzado.' },
  { id: 3,  name: 'Endpoint Defender',    cat: 'antivirus', price: 80,  icon: '🦾', desc: 'Protección empresarial para múltiples dispositivos en red.' },
  // VPN
  { id: 4,  name: 'VPN Secure',           cat: 'vpn',       price: 40,  icon: '🔒', desc: 'Cifrado AES-256 con servidores en 60 países. Sin registros.' },
  { id: 5,  name: 'VPN Ninja',            cat: 'vpn',       price: 30,  icon: '🥷', desc: 'Ultra-rápido, ideal para streaming y gaming protegido.' },
  { id: 6,  name: 'VPN Corporate',        cat: 'vpn',       price: 120, icon: '🏢', desc: 'Tunneling empresarial con IPs dedicadas y soporte 24/7.' },
  // CONTRASEÑAS
  { id: 7,  name: 'Password Manager',     cat: 'passwords', price: 15,  icon: '🗝️', desc: 'Genera y almacena contraseñas únicas con bóveda cifrada.' },
  { id: 8,  name: 'PassVault Pro',        cat: 'passwords', price: 29,  icon: '🔑', desc: 'Sincronización multi-dispositivo con autenticación biométrica.' },
  { id: 9,  name: 'SecureKeys Family',    cat: 'passwords', price: 55,  icon: '👨‍👩‍👧', desc: 'Gestión para hasta 6 usuarios con carpetas compartidas.' },
  // FIREWALL
  { id: 10, name: 'Firewall Guard',       cat: 'firewall',  price: 60,  icon: '🧱', desc: 'Bloqueo de tráfico malicioso con reglas personalizables.' },
  { id: 11, name: 'NetProtect Ultra',     cat: 'firewall',  price: 95,  icon: '🌐', desc: 'Inspección profunda de paquetes y protección DDoS.' },
  { id: 12, name: 'ZeroTrust Shield',     cat: 'firewall',  price: 150, icon: '🏛️', desc: 'Arquitectura Zero Trust para redes corporativas complejas.' },
  // MONITOREO
  { id: 13, name: 'Dark Web Monitor',     cat: 'monitor',   price: 20,  icon: '🕵️', desc: 'Alertas en tiempo real si tus datos aparecen en la dark web.' },
  { id: 14, name: 'Breach Detector',      cat: 'monitor',   price: 35,  icon: '🚨', desc: 'Escaneo continuo de filtraciones de credenciales y datos.' },
  { id: 15, name: 'CyberScan 360',        cat: 'monitor',   price: 75,  icon: '📡', desc: 'Análisis completo de vulnerabilidades en todos tus dispositivos.' },
];

// ===== ESTADO =====
let cart = [];
let activeFilter = 'all';
let activeSort   = 'default';

// ===== ELEMENTOS DOM =====
const productosDiv   = document.getElementById('productos');
const carritoDiv     = document.getElementById('carrito');
const cartFooter     = document.getElementById('cartFooter');
const cartCountEl    = document.getElementById('cartCount');
const cartTotalEl    = document.getElementById('cartTotal');
const cartPanel      = document.getElementById('cartPanel');
const productCountEl = document.getElementById('productCount');
const toast          = document.getElementById('toast');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('currentUser');
  if (!user) { window.location.href = 'login.html'; return; }

  document.getElementById('navUser').textContent = `👤 ${user}`;

  // Filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.cat;
      renderProductos();
    });
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProductos();
  });

  // Cart toggle (mobile)
  document.getElementById('cartToggle').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });
  document.getElementById('cartClose').addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  renderProductos();
  renderCarrito();
});

// ===== RENDER PRODUCTOS =====
function renderProductos() {
  let list = activeFilter === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.cat === activeFilter);

  if (activeSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (activeSort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));

  productCountEl.textContent = list.length;

  if (!list.length) {
    productosDiv.innerHTML = '<div class="no-results">No hay productos en esta categoría.</div>';
    return;
  }

  productosDiv.innerHTML = list.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.04}s">
      <div class="product-icon">${p.icon}</div>
      <div class="product-body">
        <p class="product-cat">${catLabel(p.cat)}</p>
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price}</span>
          <button class="btn-add" data-id="${p.id}">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('');

  productosDiv.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = PRODUCTS.find(p => p.id === Number(btn.dataset.id));
      if (!product) return;
      cart.push({ ...product, uid: Date.now() + Math.random() });
      renderCarrito();
      showToast(`✅ ${product.name} agregado`);
      if (window.innerWidth <= 900) cartPanel.classList.add('open');
    });
  });
}

// ===== RENDER CARRITO =====
function renderCarrito() {
  cartCountEl.textContent = cart.length;

  if (!cart.length) {
    carritoDiv.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        Tu carrito está vacío.<br>Agrega productos para comenzar.
      </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  cartTotalEl.textContent = `$${total}`;
  cartFooter.style.display = 'block';

  carritoDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-icon">${item.icon}</span>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
      </div>
      <button class="btn-remove" data-uid="${item.uid}" title="Eliminar">✕</button>
    </div>
  `).join('');

  carritoDiv.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = Number(btn.dataset.uid);
      cart = cart.filter(i => i.uid !== uid);
      renderCarrito();
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

// ===== CHECKOUT =====
function checkout() {
  if (!cart.length) return;
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const count = cart.length;
  cart = [];
  renderCarrito();
  cartPanel.classList.remove('open');

  document.getElementById('modalMsg').textContent =
    `Compraste ${count} producto${count > 1 ? 's' : ''} por un total de $${total}. ¡Gracias por elegir CyberShop!`;
  document.getElementById('successModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== HELPERS =====
function catLabel(cat) {
  const map = { antivirus: 'Antivirus', vpn: 'VPN', passwords: 'Contraseñas', firewall: 'Firewall', monitor: 'Monitoreo' };
  return map[cat] || cat;
}