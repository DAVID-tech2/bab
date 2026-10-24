/* ============================================
   BABALANDA FOUNDATION — Main JavaScript
   Vanilla JS — no frameworks
   ============================================ */

(function () {
  'use strict';

  /* ---------- Mobile Navigation ---------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    var overlay = document.querySelector('.nav-overlay');
    if (!toggle || !links) return;

    function closeNav() {
      toggle.classList.remove('active');
      links.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      if (overlay) overlay.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (overlay) overlay.addEventListener('click', closeNav);

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Sticky Navbar ---------- */
  function initStickyNav() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scroll = window.pageYOffset;
      navbar.classList.toggle('navbar--scrolled', scroll > 40);
      lastScroll = scroll;
    }, { passive: true });
  }

  /* ---------- Active Nav State ---------- */
  function initActiveNav() {
    var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (link) {
      var page = link.getAttribute('data-page').toLowerCase();
      if (page === current || (current === '' && page === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Smooth Scroll for anchor links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.navbar');
          var offset = navHeight ? navHeight.offsetHeight : 0;
          var pos = target.getBoundingClientRect().top + window.pageYOffset - offset - 16;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Scroll Reveal Animations ---------- */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated Counters ----------
   * Easily edit counter values in HTML:
   *   <span class="counter" data-target="5000" data-suffix="+">0</span>
   */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * (target - start) + start);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.pageYOffset > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Lazy Loading fallback ---------- */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!imgs.length) return;
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(function (img) { if (img.dataset.src) img.src = img.dataset.src; });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(function (img) { observer.observe(img); });
  }

  /* ---------- Gallery Filtering ---------- */
  function initGalleryFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    var items = document.querySelectorAll('[data-category]');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        items.forEach(function (item) {
          var cats = (item.getAttribute('data-category') || '').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          if (show) {
            item.classList.remove('hidden');
            item.style.animation = 'none';
            void item.offsetWidth;
            item.style.animation = '';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- Gallery Lightbox ---------- */
  function initLightbox() {
    var triggers = document.querySelectorAll('[data-lightbox]');
    if (!triggers.length) return;

    var overlay = document.querySelector('.lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML =
        '<button class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-btn lightbox-prev" aria-label="Previous">&#8249;</button>' +
        '<img src="" alt="" />' +
        '<button class="lightbox-btn lightbox-next" aria-label="Next">&#8250;</button>' +
        '<p class="lightbox-caption"></p>';
      document.body.appendChild(overlay);
    }

    var img = overlay.querySelector('img');
    var caption = overlay.querySelector('.lightbox-caption');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');
    var currentIndex = 0;
    var gallery = Array.prototype.slice.call(triggers);

    function show(index) {
      currentIndex = (index + gallery.length) % gallery.length;
      var el = gallery[currentIndex];
      img.src = el.getAttribute('data-lightbox') || el.querySelector('img').src;
      img.alt = el.querySelector('img') ? el.querySelector('img').alt : '';
      caption.textContent = el.getAttribute('data-caption') || '';
    }

    function open(index) {
      show(index);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    gallery.forEach(function (el, i) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); show(currentIndex - 1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); show(currentIndex + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  /* ---------- News Modal ---------- */
  function initNewsModal() {
    var triggers = document.querySelectorAll('[data-news]');
    if (!triggers.length) return;

    var overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = '<div class="modal"><button class="modal-close" aria-label="Close">&times;</button><div class="modal-content"></div></div>';
      document.body.appendChild(overlay);
    }

    var modal = overlay.querySelector('.modal');
    var content = overlay.querySelector('.modal-content');
    var closeBtn = overlay.querySelector('.modal-close');

    function open(html) {
      content.innerHTML = html;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      modal.scrollTop = 0;
    }
    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    triggers.forEach(function (el) {
      el.addEventListener('click', function () {
        var html = el.getAttribute('data-news-content') || '';
        open(html);
      });
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  /* ---------- Contact Form Validation ---------- */
  function initFormValidation() {
    var form = document.querySelector('#contactForm');
    if (!form) return;
    var successMsg = form.querySelector('.form-success');

    function showError(input, msg) {
      input.classList.add('error');
      var err = input.parentElement.querySelector('.form-error');
      if (err) { err.textContent = msg; err.classList.add('show'); }
    }
    function clearError(input) {
      input.classList.remove('error');
      var err = input.parentElement.querySelector('.form-error');
      if (err) err.classList.remove('show');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll('[data-validate]');

      fields.forEach(function (field) {
        clearError(field);
        var val = field.value.trim();
        var type = field.getAttribute('data-validate');

        if (type === 'required' && !val) {
          showError(field, 'This field is required.');
          valid = false;
        } else if (type === 'email' && val) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showError(field, 'Please enter a valid email address.');
            valid = false;
          }
        } else if (type === 'phone' && val) {
          if (!/^[0-9+\s()-]{7,20}$/.test(val)) {
            showError(field, 'Please enter a valid phone number.');
            valid = false;
          }
        }
      });

      if (valid) {
        if (successMsg) successMsg.classList.add('show');
        form.reset();
        setTimeout(function () {
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }
    });

    form.querySelectorAll('[data-validate]').forEach(function (field) {
      field.addEventListener('input', function () { clearError(field); });
    });
  }

  /* ---------- Dynamic Data (Projects, News) ---------- */
  var Pexels = {
    // Image URLs for placeholders — easily replaced with real photos
    hero: 'https://images.pexels.com/photos/37079375/pexels-photo-37079375.jpeg?auto=compress&cs=tinysrgb&w=1600',
    leadership: 'https://images.pexels.com/photos/37357477/pexels-photo-37357477.jpeg?auto=compress&cs=tinysrgb&w=800',
    aboutLeader: 'https://images.pexels.com/photos/38670854/pexels-photo-38670854.jpeg?auto=compress&cs=tinysrgb&w=800',
    community1: 'https://images.pexels.com/photos/28102680/pexels-photo-28102680.jpeg?auto=compress&cs=tinysrgb&w=940',
    community2: 'https://images.pexels.com/photos/28100865/pexels-photo-28100865.jpeg?auto=compress&cs=tinysrgb&w=940',
    event1: 'https://images.pexels.com/photos/34735511/pexels-photo-34735511.jpeg?auto=compress&cs=tinysrgb&w=940'
  };

  /* ===== PROJECT DATA — edit these values =====
   * Add, remove, or modify projects here.
   * Categories: community, education, youth, women, health, livelihoods
   */
  var projectsData = [
    {
      id: 'p1',
      title: 'Clean Water Access Initiative',
      location: 'Busoga Sub-region',
      date: '2025',
      category: 'community',
      image: 'https://images.pexels.com/photos/28101461/pexels-photo-28101461.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'A community-focused project aimed at improving access to clean and safe water sources for rural households.',
      impact: 'Placeholder — communities to be served',
      status: 'Ongoing'
    },
    {
      id: 'p2',
      title: 'Youth Skills Training Programme',
      location: 'Jinja District',
      date: '2025',
      category: 'youth',
      image: 'https://images.pexels.com/photos/16850257/pexels-photo-16850257.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'Equipping young people with practical vocational skills in carpentry, tailoring, and technology.',
      impact: 'Placeholder — youth to be trained',
      status: 'Ongoing'
    },
    {
      id: 'p3',
      title: 'Women Livelihoods Support',
      location: 'Iganga District',
      date: '2025',
      category: 'women',
      image: 'https://images.pexels.com/photos/3894376/pexels-photo-3894376.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'Supporting women entrepreneurs with skills, resources, and networks to strengthen household livelihoods.',
      impact: 'Placeholder — women to be supported',
      status: 'Ongoing'
    },
    {
      id: 'p4',
      title: 'School Support Initiative',
      location: 'Kamuli District',
      date: '2025',
      category: 'education',
      image: 'https://images.pexels.com/photos/26855714/pexels-photo-26855714.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'Supporting schools with learning materials, infrastructure improvements, and educational resources.',
      impact: 'Placeholder — students to benefit',
      status: 'Ongoing'
    },
    {
      id: 'p5',
      title: 'Community Health Outreach',
      location: 'Luuka District',
      date: '2025',
      category: 'health',
      image: 'https://images.pexels.com/photos/8248293/pexels-photo-8248293.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'Bringing essential health services and awareness programmes to underserved rural communities.',
      impact: 'Placeholder — people to be reached',
      status: 'Ongoing'
    },
    {
      id: 'p6',
      title: 'Sustainable Agriculture Project',
      location: 'Mayuge District',
      date: '2025',
      category: 'livelihoods',
      image: 'https://images.pexels.com/photos/39079996/pexels-photo-39079996.jpeg?auto=compress&cs=tinysrgb&w=940',
      description: 'Promoting sustainable farming practices and supporting smallholder farmers with training and inputs.',
      impact: 'Placeholder — farmers to be supported',
      status: 'Ongoing'
    }
  ];

  /* ===== NEWS DATA — edit these values =====
   * Categories: community, education, youth, women, development, foundation
   */
  var newsData = [
    {
      id: 'n1',
      title: 'Foundation Launches Community Engagement Drive',
      date: '2025',
      category: 'Community',
      catKey: 'community',
      image: 'https://images.pexels.com/photos/28102680/pexels-photo-28102680.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'The Foundation has begun a new round of community engagement activities across the Busoga sub-region.',
      content: '<p>The Babalanda Foundation has launched a new community engagement drive aimed at understanding the needs of communities across the Busoga sub-region. The initiative will see Foundation teams visit various districts to meet with local leaders and community members.</p><p>[INSERT OFFICIAL NEWS CONTENT]</p>'
    },
    {
      id: 'n2',
      title: 'Supporting Education in Rural Schools',
      date: '2025',
      category: 'Education',
      catKey: 'education',
      image: 'https://images.pexels.com/photos/26855714/pexels-photo-26855714.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'The Foundation continues to support learning opportunities for children in underserved communities.',
      content: '<p>As part of its education programme, the Foundation is working to support rural schools with learning materials and resources. [INSERT OFFICIAL NEWS CONTENT]</p>'
    },
    {
      id: 'n3',
      title: 'Youth Empowerment Workshop Held',
      date: '2025',
      category: 'Youth',
      catKey: 'youth',
      image: 'https://images.pexels.com/photos/33920035/pexels-photo-33920035.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'A skills development workshop brought together young people from across the district.',
      content: '<p>The Foundation organised a youth empowerment workshop focused on skills development and mentorship. [INSERT OFFICIAL NEWS CONTENT]</p>'
    },
    {
      id: 'n4',
      title: 'Women\'s Livelihoods Programme Expands',
      date: '2025',
      category: 'Women',
      catKey: 'women',
      image: 'https://images.pexels.com/photos/3894376/pexels-photo-3894376.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'The women empowerment programme reaches more communities with livelihood support.',
      content: '<p>The Foundation\'s women empowerment programme is expanding to reach more communities. [INSERT OFFICIAL NEWS CONTENT]</p>'
    },
    {
      id: 'n5',
      title: 'Community Development Initiative Announced',
      date: '2025',
      category: 'Development',
      catKey: 'development',
      image: 'https://images.pexels.com/photos/28100865/pexels-photo-28100865.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'A new community development initiative has been announced to improve local infrastructure.',
      content: '<p>A new community development initiative has been announced. [INSERT OFFICIAL NEWS CONTENT]</p>'
    },
    {
      id: 'n6',
      title: 'Foundation Strengthens Partnerships',
      date: '2025',
      category: 'Foundation News',
      catKey: 'foundation',
      image: 'https://images.pexels.com/photos/6646880/pexels-photo-6646880.jpeg?auto=compress&cs=tinysrgb&w=940',
      summary: 'The Foundation continues to build relationships with community partners and stakeholders.',
      content: '<p>The Foundation is building partnerships with community organisations and stakeholders. [INSERT OFFICIAL NEWS CONTENT]</p>'
    }
  ];

  /* ===== GALLERY DATA — edit these values ===== */
  var galleryData = [
    { src: 'https://images.pexels.com/photos/37079375/pexels-photo-37079375.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Hon. Milly Babalanda', category: 'leadership', caption: 'Hon. Babirye Milly Babalanda', size: '' },
    { src: 'https://images.pexels.com/photos/28102680/pexels-photo-28102680.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Community gathering in Uganda', category: 'community', caption: 'Community gathering', size: 'wide' },
    { src: 'https://images.pexels.com/photos/16850257/pexels-photo-16850257.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Youth skills training', category: 'youth', caption: 'Youth skills training', size: '' },
    { src: 'https://images.pexels.com/photos/3894376/pexels-photo-3894376.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Women empowerment group', category: 'women', caption: 'Women empowerment', size: '' },
    { src: 'https://images.pexels.com/photos/26855714/pexels-photo-26855714.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Children at school', category: 'education', caption: 'Education support', size: '' },
    { src: 'https://images.pexels.com/photos/28101461/pexels-photo-28101461.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Clean water project', category: 'projects', caption: 'Clean water access', size: '' },
    { src: 'https://images.pexels.com/photos/34735511/pexels-photo-34735511.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Cultural event celebration', category: 'events', caption: 'Community celebration', size: 'wide' },
    { src: 'https://images.pexels.com/photos/38670854/pexels-photo-38670854.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Hon. Milly Babalanda portrait', category: 'leadership', caption: 'Leadership portrait', size: '' },
    { src: 'https://images.pexels.com/photos/28100865/pexels-photo-28100865.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Community development gathering', category: 'community', caption: 'Community engagement', size: '' },
    { src: 'https://images.pexels.com/photos/33920035/pexels-photo-33920035.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Youth technology training', category: 'youth', caption: 'Youth technology training', size: '' },
    { src: 'https://images.pexels.com/photos/35239606/pexels-photo-35239606.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Women working together', category: 'women', caption: 'Women\'s livelihoods', size: '' },
    { src: 'https://images.pexels.com/photos/18449719/pexels-photo-18449719.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'School children smiling', category: 'education', caption: 'School children', size: '' },
    { src: 'https://images.pexels.com/photos/8248293/pexels-photo-8248293.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Health outreach', category: 'projects', caption: 'Health outreach', size: '' },
    { src: 'https://images.pexels.com/photos/28928756/pexels-photo-28928756.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Cultural drumming event', category: 'events', caption: 'Cultural event', size: '' },
    { src: 'https://images.pexels.com/photos/37357477/pexels-photo-37357477.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Hon. Milly Babalanda', category: 'leadership', caption: 'Leadership', size: '' },
    { src: 'https://images.pexels.com/photos/39079996/pexels-photo-39079996.jpeg?auto=compress&cs=tinysrgb&w=940', alt: 'Agriculture livelihoods', category: 'projects', caption: 'Sustainable agriculture', size: '' }
  ];

  /* ---------- Render Projects ---------- */
  function renderProjects() {
    var container = document.querySelector('#projectsGrid');
    if (!container) return;
    var html = projectsData.map(function (p) {
      return (
        '<div class="project-card reveal" data-category="' + p.category + '">' +
          '<div class="card-img"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy" /></div>' +
          '<div class="card-body">' +
            '<div class="meta">' +
              '<span>&#128205; ' + p.location + '</span>' +
              '<span>&#128197; ' + p.date + '</span>' +
            '</div>' +
            '<h3>' + p.title + '</h3>' +
            '<p class="desc">' + p.description + '</p>' +
            '<span class="impact-tag">' + p.impact + '</span><br />' +
            '<a href="#" class="view-link">View Project &#8594;</a>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    container.innerHTML = html;
    container.insertAdjacentHTML('afterbegin',
      '<div class="filter-bar">' +
        '<button class="filter-btn active" data-filter="all">All Projects</button>' +
        '<button class="filter-btn" data-filter="community">Community</button>' +
        '<button class="filter-btn" data-filter="education">Education</button>' +
        '<button class="filter-btn" data-filter="youth">Youth</button>' +
        '<button class="filter-btn" data-filter="women">Women</button>' +
        '<button class="filter-btn" data-filter="health">Health</button>' +
        '<button class="filter-btn" data-filter="livelihoods">Livelihoods</button>' +
      '</div>'
    );
  }

  /* ---------- Render News ---------- */
  function renderNews() {
    var container = document.querySelector('#newsGrid');
    if (!container) return;
    var html = newsData.map(function (n) {
      var fullContent =
        '<img class="modal-img" src="' + n.image + '" alt="' + n.title + '" />' +
        '<div class="modal-body">' +
          '<span class="news-cat">' + n.category + '</span>' +
          '<h2>' + n.title + '</h2>' +
          '<p class="news-date">' + n.date + '</p>' +
          n.content +
        '</div>';
      return (
        '<div class="news-card reveal" data-news data-news-content=\'' + fullContent.replace(/'/g, '&#39;') + '\'>' +
          '<div class="card-img"><img src="' + n.image + '" alt="' + n.title + '" loading="lazy" /></div>' +
          '<div class="card-body">' +
            '<div class="news-meta">' +
              '<span class="news-cat">' + n.category + '</span>' +
              '<span class="news-date">' + n.date + '</span>' +
            '</div>' +
            '<h3>' + n.title + '</h3>' +
            '<p class="desc">' + n.summary + '</p>' +
            '<span class="read-more">Read More &#8594;</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    container.innerHTML = html;
  }

  /* ---------- Render Gallery ---------- */
  function renderGallery() {
    var container = document.querySelector('#galleryGrid');
    if (!container) return;
    var html = galleryData.map(function (g) {
      var sizeClass = g.size === 'wide' ? ' gallery-item--wide' : (g.size === 'tall' ? ' gallery-item--tall' : '');
      return (
        '<div class="gallery-item' + sizeClass + '" data-category="' + g.category + '" data-lightbox="' + g.src + '" data-caption="' + g.caption + '">' +
          '<img src="' + g.src + '" alt="' + g.alt + '" loading="lazy" />' +
        '</div>'
      );
    }).join('');
    container.innerHTML = html;
  }

  /* ---------- Render Featured Projects (Home page) ---------- */
  function renderFeaturedProjects() {
    var container = document.querySelector('#featuredProjects');
    if (!container) return;
    var featured = projectsData.slice(0, 3);
    var html = featured.map(function (p) {
      return (
        '<div class="project-card reveal">' +
          '<div class="card-img"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy" /></div>' +
          '<div class="card-body">' +
            '<div class="meta"><span>&#128205; ' + p.location + '</span></div>' +
            '<h3>' + p.title + '</h3>' +
            '<p class="desc">' + p.description + '</p>' +
            '<a href="projects.html" class="view-link">View Project &#8594;</a>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    container.innerHTML = html;
  }

  /* ---------- Render Featured News (Home page) ---------- */
  function renderFeaturedNews() {
    var container = document.querySelector('#featuredNews');
    if (!container) return;
    var featured = newsData.slice(0, 3);
    var html = featured.map(function (n) {
      var fullContent =
        '<img class="modal-img" src="' + n.image + '" alt="' + n.title + '" />' +
        '<div class="modal-body">' +
          '<span class="news-cat">' + n.category + '</span>' +
          '<h2>' + n.title + '</h2>' +
          '<p class="news-date">' + n.date + '</p>' +
          n.content +
        '</div>';
      return (
        '<div class="news-card reveal" data-news data-news-content=\'' + fullContent.replace(/'/g, '&#39;') + '\'>' +
          '<div class="card-img"><img src="' + n.image + '" alt="' + n.title + '" loading="lazy" /></div>' +
          '<div class="card-body">' +
            '<div class="news-meta">' +
              '<span class="news-cat">' + n.category + '</span>' +
              '<span class="news-date">' + n.date + '</span>' +
            '</div>' +
            '<h3>' + n.title + '</h3>' +
            '<p class="desc">' + n.summary + '</p>' +
            '<span class="read-more">Read More &#8594;</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    container.innerHTML = html;
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initMobileNav();
    initStickyNav();
    initSmoothScroll();
    renderProjects();
    renderNews();
    renderGallery();
    renderFeaturedProjects();
    renderFeaturedNews();
    initReveal();
    initCounters();
    initBackToTop();
    initLazyLoad();
    initGalleryFilter();
    initLightbox();
    initNewsModal();
    initFormValidation();
  });
})();
