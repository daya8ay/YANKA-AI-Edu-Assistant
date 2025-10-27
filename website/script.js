// Navbar hide/reappear on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    navbar.classList.remove('scroll-up');
    return;
  }

  if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
    navbar.classList.remove('scroll-up');
    navbar.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
    navbar.classList.remove('scroll-down');
    navbar.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

// Language Modal Functionality
const langBtn = document.getElementById("langBtn");
const languageModal = document.getElementById("languageModal");
const closeBtn = document.querySelector(".close-btn");

langBtn.addEventListener("click", () => {
  languageModal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  languageModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === languageModal) {
    languageModal.style.display = "none";
  }
});
