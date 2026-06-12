/**
* Template Name: Bethany - v4.7.0
* Template URL: https://bootstrapmade.com/bethany-free-onepage-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Hero Background Carousel
   */
  window.addEventListener('load', () => {
    const slides = select('.hero-slide', true);
    const indicators = select('.hero-indicators .indicator', true);
    const prevBtn = select('.hero-control.prev');
    const nextBtn = select('.hero-control.next');

    if (!slides.length) return;

    let currentIndex = 0;
    let isTransitioning = false;
    let autoPlayInterval;

    function showSlide(index, direction) {
      if (isTransitioning || index === currentIndex) return;
      isTransitioning = true;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[index];

      // Update indicators active state
      indicators.forEach((ind, i) => {
        if (i === index) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });

      // Slide Transitions
      if (direction === 'next') {
        nextSlide.classList.add('transitioning');
        currentSlide.classList.add('transitioning');
        
        nextSlide.classList.add('active');
        currentSlide.classList.remove('active');
        currentSlide.classList.add('slide-left');
      } else {
        nextSlide.classList.add('prep-left');
        nextSlide.offsetHeight; // Force reflow

        nextSlide.classList.add('transitioning');
        currentSlide.classList.add('transitioning');

        nextSlide.classList.remove('prep-left');
        nextSlide.classList.add('active');
        currentSlide.classList.remove('active');
        currentSlide.classList.add('slide-right');
      }

      currentIndex = index;

      setTimeout(() => {
        slides.forEach(slide => {
          slide.classList.remove('transitioning', 'slide-left', 'slide-right', 'prep-left');
        });
        isTransitioning = false;
      }, 800); // 0.8s transition duration
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex, 'next');
      }, 15000); // 15s delay
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex, 'prev');
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex, 'next');
        startAutoPlay();
      });
    }

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        if (i === currentIndex) return;
        let direction = i > currentIndex ? 'next' : 'prev';
        showSlide(i, direction);
        startAutoPlay();
      });
    });

    startAutoPlay();
  });

  /**
   * Reviews Widget Carousel
   */
  window.addEventListener('load', () => {
    const reviewsWidget = select('#reviews-widget');
    if (!reviewsWidget) return;

    const reviews = [
      {
        name: "Nina Jones",
        stars: 5,
        message: "Excellent care provided for my mother in law.",
        image: "/assets/img/profiles/ninajones.jpg",
        prop: "/assets/img/props/vinea-care-jenga.png"
      },
      {
        name: "Thomas Howe",
        stars: 5,
        message: "Provided brilliant end of life care for a terminally ill loved one. Lovely people that were understanding and friendly and their presence really helped us. Cannot recommend them more.",
        image: "/assets/img/profiles/thomashowe.jpg",
        prop: "/assets/img/props/vinea-care-shopping.png"
      },
      {
        name: "Janet White",
        stars: 5,
        message: "Exceptional care from every member of staff. Highly recommend.",
        image: "/assets/img/profiles/janetwhite.jpg",
        prop: "/assets/img/props/vinea-care-baseball.png"
      }
    ];

    let slidesHTML = '';
    let indicatorsHTML = '';

    reviews.forEach((review, index) => {
      let activeClass = index === 0 ? 'active' : '';
      let starsHtml = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
      
      slidesHTML += `
        <div class="review-slide ${activeClass}" data-index="${index}">
          <div class="review-card">
            <div class="review-header">
              <img class="profile-image" src="${review.image}" alt="${review.name}">
              <div class="review-meta">
                <h4>${review.name}</h4>
                <div class="stars">${starsHtml}</div>
              </div>
            </div>
            <p class="message">"${review.message}"</p>
          </div>
          <img class="prop-image" src="${review.prop}" alt="Prop">
        </div>
      `;
      
      indicatorsHTML += `<span class="indicator ${activeClass}" data-index="${index}"></span>`;
    });

    reviewsWidget.innerHTML = `
      <div class="reviews-nurse">
        <img src="/assets/img/props/vinea-care-nurse.png" alt="Nurse">
      </div>
      <div class="reviews-carousel">
        ${slidesHTML}
      </div>
      <div class="review-indicators">
        ${indicatorsHTML}
      </div>
    `;

    const slides = select('.review-slide', true);
    const indicators = select('#reviews-widget .indicator', true);
    let currentIndex = 0;
    let isTransitioning = false;
    let autoPlayInterval;

    function showReviewSlide(index) {
      if (isTransitioning || index === currentIndex) return;
      isTransitioning = true;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[index];

      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
      });

      currentSlide.style.opacity = '0';

      setTimeout(() => {
        currentSlide.classList.remove('active');
        currentSlide.style.visibility = 'hidden';

        nextSlide.style.opacity = '0';
        nextSlide.style.visibility = 'visible';
        nextSlide.classList.add('active');
        
        // trigger reflow
        nextSlide.offsetHeight;
        
        nextSlide.style.opacity = '1';
        currentIndex = index;

        setTimeout(() => {
          isTransitioning = false;
        }, 800);
      }, 800);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showReviewSlide(nextIndex);
      }, 15000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    }

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        if (i === currentIndex) return;
        showReviewSlide(i);
        startAutoPlay();
      });
    });

    startAutoPlay();
  });

})()