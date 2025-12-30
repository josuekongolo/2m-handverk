/**
 * 2M HÅNDVERK AS - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initContactForm();
  initLightbox();
  initProjectFilter();
});

/**
 * Header - Sticky shadow on scroll
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  updateHeader();

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
  const toggle = document.querySelector('.header__toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav__overlay');
  const links = document.querySelectorAll('.mobile-nav__link');

  if (!toggle || !mobileNav) return;

  function openNav() {
    toggle.classList.add('header__toggle--active');
    mobileNav.classList.add('mobile-nav--open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.classList.remove('header__toggle--active');
    mobileNav.classList.remove('mobile-nav--open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    if (mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  links.forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    }
  });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('fade-in-left')) {
          el.classList.add('fade-in-left--visible');
        } else if (el.classList.contains('fade-in-right')) {
          el.classList.add('fade-in-right--visible');
        } else {
          el.classList.add('fade-in--visible');
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  const fields = {
    name: {
      element: form.querySelector('#name'),
      validate: function(value) {
        return value.trim().length >= 2;
      },
      error: 'Vennligst oppgi ditt navn'
    },
    email: {
      element: form.querySelector('#email'),
      validate: function(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      error: 'Vennligst oppgi en gyldig e-postadresse'
    },
    phone: {
      element: form.querySelector('#phone'),
      validate: function(value) {
        return value.trim() === '' || /^[+]?[\d\s-]{8,}$/.test(value);
      },
      error: 'Vennligst oppgi et gyldig telefonnummer'
    },
    message: {
      element: form.querySelector('#message'),
      validate: function(value) {
        return value.trim().length >= 10;
      },
      error: 'Beskrivelsen må være minst 10 tegn'
    }
  };

  function validateField(field) {
    if (!field.element) return true;

    const value = field.element.value;
    const isValid = field.validate(value);
    const group = field.element.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    if (isValid) {
      if (group) group.classList.remove('form-group--error');
    } else {
      if (group) group.classList.add('form-group--error');
      if (errorEl) errorEl.textContent = field.error;
    }

    return isValid;
  }

  Object.values(fields).forEach(function(field) {
    if (field.element) {
      field.element.addEventListener('blur', function() {
        validateField(field);
      });

      field.element.addEventListener('input', function() {
        const group = field.element.closest('.form-group');
        if (group && group.classList.contains('form-group--error')) {
          validateField(field);
        }
      });
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach(function(field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sender...';
      btn.disabled = true;

      setTimeout(function() {
        btn.textContent = 'Sendt!';
        btn.style.backgroundColor = '#27ae60';

        setTimeout(function() {
          form.reset();
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 2000);
      }, 1500);
    }
  });
}

/**
 * Lightbox for Projects
 */
function initLightbox() {
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.querySelector('.lightbox');

  if (!projectCards.length || !lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  const contentImg = lightbox.querySelector('.lightbox__content img');
  const infoTitle = lightbox.querySelector('.lightbox__info-title');
  const infoType = lightbox.querySelector('.lightbox__info-type');

  let currentIndex = 0;
  const items = Array.from(projectCards);

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.project-card__title');
    const type = item.querySelector('.project-card__type');

    if (contentImg && img) {
      contentImg.src = img.src;
      contentImg.alt = img.alt;
    }
    if (infoTitle && title) {
      infoTitle.textContent = title.textContent;
    }
    if (infoType && type) {
      infoType.textContent = type.textContent;
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % items.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightboxContent();
  }

  projectCards.forEach(function(card, index) {
    card.addEventListener('click', function() {
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('lightbox--open')) return;

    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': prevImage(); break;
      case 'ArrowRight': nextImage(); break;
    }
  });
}

/**
 * Project Filter
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.projects-filter__btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) {
        b.classList.remove('projects-filter__btn--active');
      });
      btn.classList.add('projects-filter__btn--active');

      const filter = btn.dataset.filter;

      projectCards.forEach(function(card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(function() {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(function() {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
