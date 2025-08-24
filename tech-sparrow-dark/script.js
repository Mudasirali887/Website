
const fmt = new Intl.NumberFormat('en-PK', {style:'currency', currency:'PKR', maximumFractionDigits:0});
const topbar = document.querySelector('.topbar');
const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('ts:cart')||'[]');

fetch('products.json').then(r=>r.json()).then(data=>{
  PRODUCTS = data.map(d=>({...d, created: Date.now() - Math.floor(Math.random()*1e9)}));
  initFilters();
  render();
});

function initFilters(){
  const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p=>p.category)))];
  categorySelect.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  searchInput.addEventListener('input', render);
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
}

function render(){
  const q = (searchInput.value||'').trim().toLowerCase();
  const cat = categorySelect.value || 'All';
  let list = PRODUCTS.filter(p =>
    (cat==='All' || p.category===cat) &&
    (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
  const s = sortSelect.value;
  if(s==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(s==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(s==='newest') list.sort((a,b)=>b.created-a.created);

  grid.innerHTML = list.map(p => `
    <div class="card product-card">
      <img src="${p.image}" alt="${p.title}">
      ${p.badge ? `<div class="pill" style="display:inline-block;margin-top:8px;">${p.badge}</div>` : ''}
      <div class="title">${p.title}</div>
      <p class="desc">${p.desc}</p>
      <div class="meta">
        <span class="price">${fmt.format(p.price)}</span>
        <span class="stock">Stock: ${p.stock}</span>
      </div>
      <div style="display:flex;gap:10px;margin-top:10px">
        <button class="btn primary" onclick="addToCart('${p.id}')">Add to Cart</button>
        <button class="btn ghost" onclick="alert('Product details page can be added later.')">Details</button>
      </div>
    </div>
  `).join('');

  updateCartBadge();
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const ex = CART.find(x=>x.id===id);
  if(ex){ ex.qty = Math.min(10, ex.qty + 1); }
  else { CART.push({id:p.id, title:p.title, price:p.price, image:p.image, qty:1}); }
  persistCart();
  updateCartBadge();
  openCart();
}

function updateCartBadge(){
  const count = CART.reduce((a,b)=>a+b.qty,0);
  cartCount.textContent = count;
}

function persistCart(){
  localStorage.setItem('ts:cart', JSON.stringify(CART));
  renderCart();
}

function renderCart(){
  if(!cartItems) return;
  if(CART.length===0){
    cartItems.innerHTML = '<p class="muted">Your cart is empty.</p>';
    subtotalEl.textContent = fmt.format(0);
    return;
  }
  cartItems.innerHTML = CART.map(item=>`
    <div class="cart-row">
      <img src="${item.image}" alt="">
      <div>
        <div class="strong">${item.title}</div>
        <div class="muted small">${fmt.format(item.price)}</div>
        <div class="qty">
          <button class="icon-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <input type="number" min="1" max="10" value="${item.qty}" onchange="setQty('${item.id}', this.value)"/>
          <button class="icon-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="icon-btn" onclick="removeItem('${item.id}')">✕</button>
    </div>
  `).join('');
  const subtotal = CART.reduce((s,i)=>s + i.price*i.qty, 0);
  subtotalEl.textContent = fmt.format(subtotal);
}

function openCart(){ cartDrawer.classList.add('open'); renderCart(); }
function closeDrawer(){ cartDrawer.classList.remove('open'); }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeDrawer);
cartDrawer.addEventListener('click', (e)=>{ if(e.target===cartDrawer) closeDrawer(); });
checkoutBtn.addEventListener('click', ()=>{
  alert('Checkout flow can be connected to COD/Stripe/JazzCash later.');
});

function changeQty(id, delta){
  const it = CART.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, Math.min(10, it.qty + delta));
  persistCart();
}
function setQty(id, val){
  const it = CART.find(i=>i.id===id);
  if(!it) return;
  const q = Math.max(1, Math.min(10, parseInt(val || '1',10)));
  it.qty = q;
  persistCart();
}
function removeItem(id){
  CART = CART.filter(i=>i.id!==id);
  persistCart();
  updateCartBadge();
}

// Topbar shadow on scroll
window.addEventListener('scroll', () => {
  const on = window.scrollY > 12;
  topbar.setAttribute('data-shadow', on ? 'true' : 'false');
});
