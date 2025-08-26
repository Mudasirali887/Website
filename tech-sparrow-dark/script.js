// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// Sample products to populate grid (replace with real data if available)
const sampleProducts = Array.from({length:8}).map((_,i)=>({
  id: i+1,
  title: `Product ${i+1}`,
  price: 2499 + i*500,
  img: `https://picsum.photos/seed/ts${i}/600/400`
}));
const grid = document.getElementById('grid');

function renderProducts(list){
  grid.innerHTML = list.map(p=>`
    <div class="card reveal">
      <img class="card-img" src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px">
          <div>
            <div style="font-weight:600">${p.title}</div>
            <div class="price">PKR ${p.price.toLocaleString()}</div>
          </div>
          <button class="btn primary" data-add="${p.id}">Add</button>
        </div>
      </div>
    </div>
  `).join('');
  observeReveals();
}
renderProducts(sampleProducts);

// Intersection Observer for reveal animations
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('in');
  });
},{threshold:.12});
function observeReveals(){
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
}
observeReveals();

// Payment modal logic
const cartBtn = document.getElementById('cartBtn');
const paymentModal = document.getElementById('paymentModal');
const closePayment = document.getElementById('closePayment');
const cancelPay = document.getElementById('cancelPay');
const markPaid = document.getElementById('markPaid');
const payMsg = document.getElementById('payMsg');
const easypaisaBox = document.getElementById('easypaisaBox');
const otherBox = document.getElementById('otherBox');
const copyEP = document.getElementById('copyEP');

function openPayment(){ paymentModal.classList.add('open'); payMsg.textContent=''; }
function closePaymentModal(){ paymentModal.classList.remove('open'); }

cartBtn.addEventListener('click', openPayment);
closePayment.addEventListener('click', closePaymentModal);
cancelPay.addEventListener('click', closePaymentModal);

document.querySelectorAll('input[name="pay"]').forEach(r=>{
  r.addEventListener('change', (e)=>{
    if(e.target.value==='easypaisa'){ easypaisaBox.style.display='block'; otherBox.style.display='none'; }
    else { easypaisaBox.style.display='none'; otherBox.style.display='block'; }
  });
});

copyEP.addEventListener('click', ()=>{
  const raw = '03183276922';
  if(navigator.clipboard){
    navigator.clipboard.writeText(raw).then(()=> payMsg.textContent = 'Easypaisa number copied to clipboard.');
  } else {
    payMsg.textContent = 'Please copy manually: ' + raw;
  }
});

markPaid.addEventListener('click', ()=>{
  payMsg.textContent = 'Thank you! We will verify your Easypaisa payment shortly.';
  setTimeout(()=> closePaymentModal(), 1200);
});

// Footer clickable refresh
document.getElementById('footerLogoText').addEventListener('click', ()=> window.location.reload());
document.getElementById('footerQuality').addEventListener('click', ()=> window.location.reload());

// Hide hero-bg in case external CSS tries to show it
document.querySelectorAll('.hero-bg').forEach(el=> el.style.display='none');

// Contact form handling (demo)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  document.getElementById('formMsg').textContent = 'Thanks! We will get back to you at the earliest.';
  e.target.reset();
});

// Optional small sticky shadow on topbar
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', ()=>{
  const sc = window.scrollY;
  topbar.style.boxShadow = sc>6 ? '0 6px 16px rgba(0,0,0,.06)' : 'none';
});
