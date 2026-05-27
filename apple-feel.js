/* ============================================================
   LEOMAX — Apple Feel
   Smooth scroll, fade-in on view, sticky nav state, hover lift.
   Single file, lazy-loaded, no dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ─── Inject animation CSS ──────────────────────────── */
  var STYLE = `
    /* Smooth scroll across the site */
    html { scroll-behavior: smooth; }

    /* Fade-up on view — every section, card, image */
    .af-fade {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .8s cubic-bezier(.22,.61,.36,1),
                  transform .8s cubic-bezier(.22,.61,.36,1);
      will-change: opacity, transform;
    }
    .af-fade.af-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Staggered grid items */
    .af-fade.af-delay-1 { transition-delay: .08s; }
    .af-fade.af-delay-2 { transition-delay: .16s; }
    .af-fade.af-delay-3 { transition-delay: .24s; }
    .af-fade.af-delay-4 { transition-delay: .32s; }
    .af-fade.af-delay-5 { transition-delay: .4s; }

    /* Hero parallax — subtle */
    .hero h1, .hero-lion-wrap, .hero-tagline, .hero-desc, .hero-btns {
      transition: transform .12s ease-out;
    }

    /* Nav becomes more opaque + has shadow on scroll */
    nav {
      transition: background .25s ease, backdrop-filter .25s ease, box-shadow .25s ease, border-color .25s ease;
    }
    nav.af-scrolled {
      background: rgba(255,255,255,.92) !important;
      box-shadow: 0 1px 0 rgba(0,0,0,.04) !important;
    }

    /* Universal hover lift on interactive cards */
    a, button, .price-card, .pillar-card, .advisor-card,
    .who-card, .fo-card, .widget-card, .problem-card,
    .trust-item, .faq-item, .member-card, .case-card, .blog-card {
      transition: transform .25s cubic-bezier(.22,.61,.36,1),
                  box-shadow .25s cubic-bezier(.22,.61,.36,1),
                  border-color .25s ease,
                  background .25s ease,
                  color .15s ease;
    }

    /* Inline link hover — Apple-style underline-slide */
    .vm-msg a, .footer-col a, .sec-desc a, p a {
      position: relative;
      text-decoration: none;
      background-image: linear-gradient(currentColor, currentColor);
      background-size: 0% 1px;
      background-repeat: no-repeat;
      background-position: 0 100%;
      transition: background-size .25s ease;
    }
    .vm-msg a:hover, .footer-col a:hover, .sec-desc a:hover, p a:hover {
      background-size: 100% 1px;
    }

    /* Buttons get subtle press-down */
    button:active, .btn-primary:active, .nav-cta:active,
    .submit-btn:active, .cta-outline:active {
      transform: scale(.97) !important;
    }

    /* Smooth scroll for anchor links accounting for sticky nav */
    section, [id] { scroll-margin-top: 80px; }

    /* Image fade-in on load — DISABLED (was hiding images when load event missed) */
    img {
      opacity: 1;
    }

    /* Custom scrollbar — Apple-clean */
    ::-webkit-scrollbar { width: 12px; height: 12px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,.18);
      border-radius: 980px;
      border: 3px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.28); background-clip: content-box; border: 3px solid transparent; }

    /* Selection color */
    ::selection { background: #1d1d1f; color: #FFFFFF; }
    ::-moz-selection { background: #1d1d1f; color: #FFFFFF; }

    /* Reduced motion respected */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
      html { scroll-behavior: auto; }
    }
  `;
  function injectStyle() {
    if (document.getElementById('af-style')) return;
    var s = document.createElement('style');
    s.id = 'af-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  /* ─── Mark elements for fade-in ─────────────────────── */
  var FADE_SELECTORS = [
    // 'section', '.section', — removed to prevent whole-section invisibility
    '.price-card', '.pillar-card', '.advisor-card',
    '.who-card', '.fo-card', '.widget-card', '.problem-card',
    '.trust-item', '.faq-item', '.member-card', '.case-card',
    '.process-step', '.how-card', '.process-bar-item',
    '.stat', '.readiness-card', '.timeline-row'
  ];
  function applyFadeClasses() {
    var elements = document.querySelectorAll(FADE_SELECTORS.join(','));
    elements.forEach(function (el) {
      // Skip the hero — we want it visible immediately
      if (el.classList.contains('hero')) return;
      el.classList.add('af-fade');
    });

    // Stagger grid children
    var grids = document.querySelectorAll('.pricing-grid, .advisor-grid, .two-pillars, .problem-grid, .who-grid, .widget-grid, .trust-grid, .fo-grid, .readiness-grid, .process-grid, .stats');
    grids.forEach(function (grid) {
      var children = grid.children;
      for (var i = 0; i < Math.min(children.length, 5); i++) {
        children[i].classList.add('af-fade', 'af-delay-' + (i + 1));
      }
    });
  }

  /* ─── Intersection Observer for fade-in ─────────────── */
  function setupObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback — just show everything
      document.querySelectorAll('.af-fade').forEach(function (el) {
        el.classList.add('af-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('af-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });
    document.querySelectorAll('.af-fade').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── Nav scroll state ──────────────────────────────── */
  function setupNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 20) nav.classList.add('af-scrolled');
      else nav.classList.remove('af-scrolled');
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ─── Image fade-in on load ─────────────────────────── */
  function setupImageFade() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('af-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('af-loaded'); });
        img.addEventListener('error', function () { img.classList.add('af-loaded'); });
      }
    });
  }

  /* ─── Hero parallax — subtle 1D scroll offset ───────── */
  function setupHeroParallax() {
    var heroElements = document.querySelectorAll('.hero h1, .hero-lion-wrap, .hero-tagline, .hero-desc, .hero-btns');
    if (heroElements.length === 0) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      if (y > window.innerHeight) {
        ticking = false;
        return;
      }
      heroElements.forEach(function (el, i) {
        var offset = -y * (0.06 + i * 0.02);
        el.style.transform = 'translateY(' + offset + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking && window.scrollY < window.innerHeight) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Calendly in-page popup widget ─────────────────── */
  var CALENDLY_URL = 'https://calendly.com/leomaxglobalsa/30min';
  function setupCalendlyPopup() {
    // Inject Calendly widget CSS once
    if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(l);
    }
    // Inject Calendly widget JS once
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.head.appendChild(s);
    }
    // Intercept all clicks on Calendly anchors site-wide (event delegation)
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('calendly.com/leomaxglobalsa') === -1) return;
      e.preventDefault();
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        // Calendly script not yet loaded — wait briefly then retry
        var waited = 0;
        var poll = setInterval(function () {
          waited += 100;
          if (window.Calendly && window.Calendly.initPopupWidget) {
            clearInterval(poll);
            window.Calendly.initPopupWidget({ url: CALENDLY_URL });
          } else if (waited > 3000) {
            clearInterval(poll);
            // Fallback to opening URL if script never loads
            window.open(CALENDLY_URL, '_blank');
          }
        }, 100);
      }
    }, true);
    // Also strip target="_blank" so right-click/middle-click still works as link
    function stripTargets() {
      document.querySelectorAll('a[href*="calendly.com/leomaxglobalsa"]').forEach(function (a) {
        if (a.getAttribute('target') === '_blank') a.removeAttribute('target');
      });
    }
    stripTargets();
    // Re-strip after dynamic chat-injected links
    var mo = new MutationObserver(stripTargets);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ─── INIT ──────────────────────────────────────────── */
  function init() {
    injectStyle();
    applyFadeClasses();
    setupObserver();
    setupNavScroll();
    setupImageFade();
    setupCalendlyPopup();
    // Parallax is nice but can feel laggy on low-end devices — only on desktop
    if (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches) {
      setupHeroParallax();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
