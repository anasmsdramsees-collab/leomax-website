/* ============================================================
   LEOMAX — Scroll Motion System
   Smooth entrance animations triggered by scroll
   ============================================================ */

(function () {
  'use strict';

  /* ---- CSS ---- */
  const css = `
    /* Base hidden state */
    .lm-fade        { opacity:0; transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
    .lm-up          { opacity:0; transform:translateY(40px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
    .lm-left        { opacity:0; transform:translateX(-40px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
    .lm-right       { opacity:0; transform:translateX(40px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
    .lm-scale       { opacity:0; transform:scale(.93); transition:opacity .6s cubic-bezier(.4,0,.2,1), transform .6s cubic-bezier(.4,0,.2,1); }
    .lm-line        { transform:scaleX(0); transform-origin:left; transition:transform .9s cubic-bezier(.4,0,.2,1); }

    /* Visible state */
    .lm-visible     { opacity:1 !important; transform:none !important; }
    .lm-line.lm-visible { transform:scaleX(1) !important; }

    /* Stagger delays */
    .lm-d1  { transition-delay:.1s !important; }
    .lm-d2  { transition-delay:.18s !important; }
    .lm-d3  { transition-delay:.26s !important; }
    .lm-d4  { transition-delay:.34s !important; }
    .lm-d5  { transition-delay:.42s !important; }
    .lm-d6  { transition-delay:.50s !important; }
    .lm-d7  { transition-delay:.58s !important; }
    .lm-d8  { transition-delay:.66s !important; }
    .lm-d9  { transition-delay:.74s !important; }
    .lm-d10 { transition-delay:.82s !important; }
    .lm-d11 { transition-delay:.90s !important; }
    .lm-d12 { transition-delay:.98s !important; }
    .lm-d13 { transition-delay:1.06s !important; }
    .lm-d14 { transition-delay:1.14s !important; }

    /* Hero word split */
    .lm-word { display:inline-block; overflow:hidden; }
    .lm-word span {
      display:inline-block;
      opacity:0; transform:translateY(100%);
      transition:opacity .6s cubic-bezier(.4,0,.2,1), transform .6s cubic-bezier(.4,0,.2,1);
    }
    .lm-word.lm-visible span { opacity:1; transform:translateY(0); }

    /* Counter */
    .lm-counter { display:inline-block; }

    /* Shimmer on hero logo */
    @keyframes lm-shimmer {
      0%   { filter:drop-shadow(0 0 0px rgba(184,184,184,0)); }
      50%  { filter:drop-shadow(0 0 24px rgba(184,184,184,.3)); }
      100% { filter:drop-shadow(0 0 0px rgba(184,184,184,0)); }
    }
    .lm-shimmer { animation: lm-shimmer 3s ease-in-out infinite; }

    /* Reduce motion */
    @media(prefers-reduced-motion:reduce){
      .lm-fade,.lm-up,.lm-left,.lm-right,.lm-scale,.lm-line,
      .lm-word span { transition:none !important; opacity:1 !important; transform:none !important; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- Intersection Observer ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('lm-visible');
        // Trigger counter if applicable
        const c = entry.target.querySelector('[data-count]');
        if (c) animateCounter(c);
        if (entry.target.hasAttribute('data-count')) animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* ---- Auto-annotate elements ---- */
  function annotate() {

    /* Hero logo — shimmer */
    const heroLion = document.querySelector('.hero-lion-wrap');
    if (heroLion) heroLion.classList.add('lm-shimmer');

    /* Hero title */
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
      heroH1.classList.add('lm-up');
      observe(heroH1);
    }

    /* Hero elements */
    selectAll('.hero-badge,.hero-by,.hero-divider,.hero-tagline,.hero-desc').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Hero buttons */
    selectAll('.hero-btns .btn-white,.hero-btns .btn-outline').forEach((el,i) => {
      el.classList.add('lm-scale', `lm-d${i+1}`);
      observe(el);
    });

    /* Stats */
    selectAll('.stat').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      // Find the number and mark for counter
      const num = el.querySelector('.stat-v');
      if (num) {
        const raw = num.textContent.trim();
        const match = raw.match(/([+]?)(\d+)([%]?)/);
        if (match) {
          num.setAttribute('data-count', raw);
          num.setAttribute('data-raw', raw);
          num.textContent = match[1] + '0' + match[3];
        }
      }
      observe(el);
    });

    /* Section tags & titles */
    selectAll('.sec-tag,.sec-title,.sec-desc,.section-title').forEach(el => {
      el.classList.add('lm-up');
      observe(el);
    });

    /* Section dividers */
    selectAll('.sec-divider,.hero-divider').forEach(el => {
      el.classList.add('lm-line');
      observe(el);
    });

    /* About boxes */
    selectAll('.about-box').forEach((el,i) => {
      el.classList.add(i === 0 ? 'lm-left' : 'lm-right');
      observe(el);
    });

    /* About text children */
    selectAll('.about > div:not(.about-box)').forEach(el => {
      el.classList.add('lm-left');
      observe(el);
    });

    /* Pillars */
    selectAll('.pillar').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* System cards */
    selectAll('.sys-card').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Process steps */
    selectAll('.proc-step').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Founder card */
    selectAll('.founder-card').forEach(el => {
      el.classList.add('lm-scale');
      observe(el);
    });
    selectAll('.founder-quote,.quote-mark,.founder-sig').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Story chapters */
    selectAll('.story-chapter').forEach((el,i) => {
      el.classList.add('lm-left', `lm-d${Math.min(i,4)+1}`);
      observe(el);
    });

    /* Team section header */
    selectAll('#team h2, #team p').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Team & member cards — stagger */
    const teamCards = document.querySelectorAll('#teamGrid > div, .team-grid .member-card, #boardGrid > div');
    teamCards.forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${(i % 8) + 1}`);
      observe(el);
    });

    /* Clients row */
    const clientsRow = document.querySelector('.clients-row');
    if (clientsRow) {
      clientsRow.classList.add('lm-fade');
      observe(clientsRow);
    }
    selectAll('.client-name').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* CTA section */
    selectAll('.cta-section h2,.cta-section p,.cta-section a,.cta-section button').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });

    /* Footer brand */
    selectAll('.footer-brand,.footer-tagline,.footer-contact').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+1}`);
      observe(el);
    });
    selectAll('.footer-col').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${i+2}`);
      observe(el);
    });

    /* Case study / generic cards */
    selectAll('.case-card, .card, .service-card').forEach((el,i) => {
      el.classList.add('lm-up', `lm-d${(i%6)+1}`);
      observe(el);
    });

    /* Generic sections */
    selectAll('section:not(.hero), .section').forEach(el => {
      if (!el.classList.contains('lm-up') && !el.classList.contains('lm-left')) {
        const children = el.querySelectorAll('h1,h2,h3,p');
        children.forEach((c,i) => {
          if (!c.closest('.lm-up') && !c.classList.contains('lm-up')) {
            c.classList.add('lm-up', `lm-d${Math.min(i,5)+1}`);
            observe(c);
          }
        });
      }
    });
  }

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const raw = el.getAttribute('data-raw') || el.textContent;
    const match = raw.match(/([+]?)(\d+)([%]?)/);
    if (!match) return;
    const prefix = match[1], target = parseInt(match[2]), suffix = match[3];
    const duration = 1400, start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Helpers ---- */
  function selectAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }
  function observe(el) {
    io.observe(el);
  }

  /* ---- Nav scroll effect ---- */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(1,11,27,.98)'
        : 'rgba(6,14,26,.95)';
      nav.style.borderBottomColor = window.scrollY > 60
        ? 'rgba(184,184,184,.2)'
        : 'rgba(184,184,184,.15)';
    }, { passive: true });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---- Init after DOM ready ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', annotate);
  } else {
    annotate();
  }

})();
