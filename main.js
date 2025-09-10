// ===== MAIN SITE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 IndusTech website loaded successfully!');

  // ===== MOBILE NAVIGATION =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      console.log('📱 Mobile menu toggled');
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const linkPage = link.getAttribute('href');

    if (
      (currentPage === 'index.html' || currentPage === '') &&
      linkPage === 'index.html'
    ) {
      link.classList.add('active');
    } else if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== SMOOTH SCROLLING FOR HOMEPAGE BUTTONS =====
  const smoothScrollButtons = document.querySelectorAll(
    '.btn-secondary[href^="#"]'
  );
  smoothScrollButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ===== ANIMATED CARD ENTRANCE (Homepage) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Apply animation to service cards and value cards
  const animatedCards = document.querySelectorAll(
    '.service-card, .value-card, .team-member'
  );
  animatedCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    cardObserver.observe(card);
  });

  // ===== NAVBAR BACKGROUND ON SCROLL =====
  let lastScrollTop = 0;
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.style.background = 'rgba(26, 26, 46, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = '#1a1a2e';
      navbar.style.backdropFilter = 'none';
    }

    lastScrollTop = scrollTop;
  });

  // ===== LOADING STATES FOR EXTERNAL LINKS =====
  const externalButtons = document.querySelectorAll(
    '.btn-primary:not([type="submit"])'
  );
  externalButtons.forEach((button) => {
    if (
      button.getAttribute('href') &&
      !button.getAttribute('href').startsWith('#')
    ) {
      button.addEventListener('click', function (e) {
        // For demo purposes - in real app, this would handle actual navigation
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.style.pointerEvents = 'none';

        setTimeout(() => {
          this.textContent = originalText;
          this.style.pointerEvents = 'auto';
        }, 1000);
      });
    }
  });

  // ===== PAGE-SPECIFIC FUNCTIONALITY =====

  // Homepage specific
  if (currentPage === 'index.html' || currentPage === '') {
    console.log('🏠 Homepage functionality loaded');

    // Add any homepage-specific JavaScript here
    const heroButtons = document.querySelectorAll('.hero-buttons .btn-primary');
    heroButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        // Demo interaction
        console.log('🎯 Hero CTA clicked:', this.textContent);
      });
    });
  }

  // About page specific
  if (currentPage === 'about.html') {
    console.log('👥 About page functionality loaded');

    // Animate statistics when they come into view
    const statItems = document.querySelectorAll('.stat-item h3');
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const finalValue = entry.target.textContent;
          const numericValue = parseInt(finalValue.replace(/\D/g, ''));
          const suffix = finalValue.replace(/\d/g, '');

          animateNumber(entry.target, 0, numericValue, suffix, 2000);
        }
      });
    }, observerOptions);

    statItems.forEach((stat) => {
      statObserver.observe(stat);
    });
  }

  // ===== UTILITY FUNCTIONS =====
  function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(start + (end - start) * progress);
      element.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }
});
