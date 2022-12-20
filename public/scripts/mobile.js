const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open');

}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
