// Modal functions
function openModal() {
  document.getElementById('paymentModal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('paymentModal').style.display = 'none';
}
function copyNumber() {
  const num = document.getElementById('easypaisaNumber').innerText;
  navigator.clipboard.writeText(num);
  alert('Number copied: ' + num);
}

// Scroll reveal
function revealOnScroll() {
  const sections = document.querySelectorAll('section');
  const triggerBottom = window.innerHeight * 0.85;

  sections.forEach(sec => {
    const boxTop = sec.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      sec.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Dynamic multi-color theme
function randomColor() {
  return 'hsl(' + Math.floor(Math.random()*360) + ', 70%, 50%)';
}
document.body.addEventListener('mousemove', function() {
  document.body.style.background = randomColor();
});
window.addEventListener('load', function() {
  document.body.style.background = randomColor();
});
