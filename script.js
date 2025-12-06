const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearSpan = document.querySelector('#year');
const exploreButtons = document.querySelectorAll('.explore');
const enrollButtons = document.querySelectorAll('.enroll');
const contactForm = document.querySelector('.contact-form');
const authButtons = document.querySelectorAll('.auth-links button');
const signedInBadge = document.querySelector('[data-status="signed-in"]');
const signupModal = document.querySelector('#auth-modal');
const loginModal = document.querySelector('#login-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const navbar = document.querySelector('.navbar');

let signedUser = JSON.parse(localStorage.getItem('iit-user')) || null;



// Form Submission
const scriptURL = 'https://script.google.com/macros/s/AKfycby3DdeLJ6fbv2dv_a2YdJOZpafNdKfcdzdpIysjdyv_O3YqbOb4Y8P_yj9gRdVZvOOf/exec';

const form = document.forms['contact-form1'];

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Send form in background (no waiting)
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .catch(error => console.error('Error!', error.message));

    // Instant alert
    alert("Thank you! Form is submitted");

    // Instant reload
    window.location.reload();
  });
}


const updateAuthState = () => {
  const loginBtn = document.querySelector('button[data-action="login"]');
  const logoutBtn = document.querySelector('button[data-action="logout"]');
  const signupBtn = document.querySelector('button[data-action="signup"]');

  if (signedUser) {
    signedInBadge.innerHTML = `<i class="bi bi-person-circle"></i> ${signedUser.name}`;
    signedInBadge.classList.remove('hide');
    logoutBtn.classList.remove('hide');
    loginBtn.classList.add('hide');
    signupBtn.classList.add('hide');
  } else {
    signedInBadge.classList.add('hide');
    logoutBtn.classList.add('hide');
    loginBtn.classList.remove('hide');
    signupBtn.classList.remove('hide');
  }
};

// New Carousel Implementation
"use strict";

let autoPlayInterval;

// Function to move to next slide
function moveNext() {
  let items = document.querySelectorAll(".item");
  if (items.length > 0) {
    document.querySelector(".slide").appendChild(items[0]);
  }
}

// Function to move to previous slide
function movePrev() {
  let items = document.querySelectorAll(".item");
  if (items.length > 0) {
    document.querySelector(".slide").prepend(items[items.length - 1]);
  }
}

// Function to reset auto-play timer
function resetAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
  autoPlayInterval = setInterval(moveNext, 2000);
}

// Initialize carousel
function initCarousel() {
  let next = document.querySelector(".next");
  let prev = document.querySelector(".prev");
  const slide = document.querySelector(".slide");

  if (!next || !prev || !slide) return;

  // Auto-play carousel with 2000ms (2 seconds) interval
  autoPlayInterval = setInterval(moveNext, 3000);

  // Next button click
  next.addEventListener("click", function () {
    moveNext();
    resetAutoPlay();
  });

  // Previous button click
  prev.addEventListener("click", function () {
    movePrev();
    resetAutoPlay();
  });

  // Touch/Swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left - next
      moveNext();
      resetAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right - previous
      movePrev();
      resetAutoPlay();
    }
  }

  slide.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slide.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

const toggleNav = () => {
  if (!navPanel) return;
  const isOpen = navPanel.classList.toggle('open');
  navToggle?.classList.toggle('active', isOpen);
};

const closeNav = () => {
  if (!navPanel) return;
  navPanel.classList.remove('open');
  navToggle?.classList.remove('active');
};

navToggle?.addEventListener('click', toggleNav);

// Add event listeners for mobile dropdowns
document.addEventListener('click', (e) => {
  // Handle explore dropdown toggle on mobile
  if (e.target.closest('.explore-toggle')) {
    const dropdown = e.target.closest('.explore-dropdown');
    if (window.innerWidth <= 960 && dropdown) {
      dropdown.classList.toggle('active');
      e.stopPropagation();
    }
  }
  
  // Handle menu item dropdown toggle on mobile
  if (e.target.closest('.menu-item.has-child')) {
    const menuItem = e.target.closest('.menu-item.has-child');
    if (window.innerWidth <= 960 && menuItem) {
      menuItem.classList.toggle('active');
      e.stopPropagation();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    closeNav();
  }
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (window.innerWidth <= 960) {
      closeNav();
    }
  });
});

document.addEventListener('click', (event) => {
  if (window.innerWidth > 960) return;
  if (!navPanel?.classList.contains('open')) return;
  if (
    !navPanel.contains(event.target) &&
    !navToggle?.contains(event.target)
  ) {
    closeNav();
  }
});


exploreButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const topic = btn.dataset.topic;
    mailTo(`Explore More - ${topic}`, `Hello IIT,

I would like to explore more about ${topic}. Please share the next steps.

Thanks,
`);
  });
});

enrollButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const course = e.currentTarget.closest('.course').dataset.course;
    mailTo(`Course Enrollment - ${course}`, `Hello IIT,

I want to enroll in the course "${course}".
Name:
Email:
Preferred start date:

Regards,
`);
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const body = `Hello IIT,

New inquiry from the website:
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Message: ${formData.get('message')}
`;
  mailTo('Website Inquiry', body);
  contactForm.reset();
});

authButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const action = button.dataset.action;
    console.log('Button clicked:', action);
    console.log('Signup modal:', signupModal);
    console.log('Login modal:', loginModal);
    
    if (action === 'signup') {
      openSignup();
    } else if (action === 'login') {
      openLogin();
    } else if (action === 'logout') {
      signedUser = null;
      localStorage.removeItem('iit-user');
      updateAuthState();
    }
  });
});

const openSignup = () => {
  console.log('openSignup called');
  if (!signupModal) {
    console.error('Signup modal not found!');
    alert('Signup modal not found. Please refresh the page.');
    return;
  }
  try {
    const form = signupModal.querySelector('form');
    signupModal.showModal();
    form.onsubmit = async (e) => {
      e.preventDefault();
      const elements = form.elements;
      const fullName = elements['fullName']?.value.trim() || '';
      const email = elements['email']?.value.trim() || '';
      const password = elements['password']?.value.trim() || '';
      if (!fullName || !email) {
        alert('Please fill in all required fields');
        return;
      }
      // Store user data
      signedUser = { name: fullName, email: email };
      localStorage.setItem('iit-user', JSON.stringify(signedUser));
      alert('Registered successfully!');
      signupModal.close();
      updateAuthState();
    };
  } catch (error) {
    console.error('Error opening signup modal:', error);
    alert('Error opening signup form: ' + error.message);
  }
};

const openLogin = () => {
  console.log('openLogin called');
  if (!loginModal) {
    console.error('Login modal not found!');
    alert('Login modal not found. Please refresh the page.');
    return;
  }
  try {
    const form = loginModal.querySelector('form');
    loginModal.showModal();
    form.onsubmit = (e) => {
      e.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();
      if (!username || !password) {
        alert('Please enter username and password');
        return;
      }
      signedUser = { name: username, email: `${username}@example.com` };
      localStorage.setItem('iit-user', JSON.stringify(signedUser));
      alert('Logged in successfully!');
      loginModal.close();
      updateAuthState();
    };
  } catch (error) {
    console.error('Error opening login modal:', error);
    alert('Error opening login form: ' + error.message);
  }
};

signupModal?.addEventListener('close', () => {
  const form = signupModal.querySelector('form');
  form.reset();
});

loginModal?.addEventListener('close', () => {
  const form = loginModal.querySelector('form');
  form.reset();
});

closeModalButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.close;
    if (target === 'auth') {
      signupModal.close();
    } else if (target === 'login') {
      loginModal.close();
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// MOU Image Slider Functionality
function initMouImageSlider() {
  const mouSlider = document.getElementById('mouImageSlider');
  const mouPrevBtn = document.querySelector('.mou-prev');
  const mouNextBtn = document.querySelector('.mou-next');
  
  if (!mouSlider || !mouPrevBtn || !mouNextBtn) return;
  
  let currentIndex = 0;
  const slides = mouSlider.querySelectorAll('.mou-slide-item');
  const slideWidth = slides[0]?.offsetWidth + 32; // 32px for gap
  
  const scrollToSlide = (index) => {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    mouSlider.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  };
  
  mouPrevBtn.addEventListener('click', () => {
    scrollToSlide(currentIndex - 1);
  });
  
  mouNextBtn.addEventListener('click', () => {
    scrollToSlide(currentIndex + 1);
  });
  
  // Auto-scroll functionality
  let autoScrollInterval;
  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      scrollToSlide(currentIndex);
    }, 3500);
  };
  
  // Pause on hover
  mouSlider.addEventListener('mouseenter', () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
  });
  
  mouSlider.addEventListener('mouseleave', () => {
    startAutoScroll();
  });
  
  // Initialize auto-scroll
  startAutoScroll();
  
  // Update current index on scroll
  mouSlider.addEventListener('scroll', () => {
    currentIndex = Math.round(mouSlider.scrollLeft / slideWidth);
  });
}

// Observe cards for animation
document.addEventListener('DOMContentLoaded', () => {
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  updateAuthState();
  initCarousel();
  initMouImageSlider();
  
  // Add animation to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
});

function sendMail(){
  let params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
 }
 emailjs.send('service_jo4w2ju', 'template_3txqg3m', params)
 .then(function(response) {
  console.log('SUCCESS!', response.status, response.text);
 }, function(error) {
  console.log('FAILED...', error);
 });
}



// Testimonials Slider Functionality
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoPlayTestimonial;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i]?.classList.remove('active');
    });
    
    if (slides[index]) {
      slides[index].classList.add('active');
      dots[index]?.classList.add('active');
    }
    currentSlide = index;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const startAutoPlay = () => {
    autoPlayTestimonial = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTestimonial) {
      clearInterval(autoPlayTestimonial);
    }
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  // Start auto-play
  if (slides.length > 0) {
    startAutoPlay();
  }

  // Pause on hover
  const testimonialContainer = document.querySelector('.testimonials-container');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', stopAutoPlay);
    testimonialContainer.addEventListener('mouseleave', startAutoPlay);
  }
}

// Initialize testimonials slider on page load
document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
});
