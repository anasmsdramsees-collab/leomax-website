/* ============================================================
   LEOMAX — Apple-style global navigation
   - Injects a shared <nav> on every page that loads this script
   - Mega-menu dropdowns (Systems, Services, Resources, Company)
   - Mobile: hamburger -> full-screen overlay
   - Hides any pre-existing <nav> so we don't double-up
   ============================================================ */
(function () {
  'use strict';

  /* ─── Menu definition ─────────────────────────────────── */
  const MENU = [
    {
      label: 'Systems',
      href: 'systems.html',
      sections: [
        {
          title: 'The Lineup',
          items: [
            { name: 'Growth System',       desc: 'From stagnant to scaling.',     href: 'system-01-growth.html' },
            { name: 'AI Transformation',   desc: 'Turn intelligence into edge.',  href: 'system-02-ai.html' },
            { name: 'Marketing Engine',    desc: 'Create demand. Build authority.', href: 'system-03-marketing.html' },
            { name: 'Content System',      desc: 'Your voice. Amplified.',        href: 'system-04-content.html' },
            { name: 'Launch System',       desc: 'Idea to revenue. 90 days.',      href: 'system-05-launch.html' },
            { name: 'Strategy OS',         desc: 'Decisions, engineered.',         href: 'strategy-os.html', flag: 'Flagship' },
          ]
        },
        {
          title: 'Explore',
          items: [
            { name: 'See all systems',     desc: 'Lineup, compare table, pricing.', href: 'systems.html' },
            { name: 'Services & pricing',  desc: 'Every engagement, every tier.',    href: 'services-pricing.html' },
          ]
        }
      ]
    },
    {
      label: 'Services',
      href: 'services-pricing.html',
      sections: [
        {
          title: 'Engagements',
          items: [
            { name: 'BD & Enterprise Access', desc: 'Open doors to Saudi enterprise.',  href: 'bd-services.html' },
            { name: 'Investor Layer',         desc: 'Readiness for founders, intel for offices.', href: 'investor-services.html' },
            { name: 'Strategy OS',            desc: 'The subscriptional dashboard.',     href: 'strategy-os.html' },
            { name: 'The Brief',              desc: 'Vertical intelligence every Sunday.', href: 'brief.html' },
          ]
        },
        {
          title: 'Entry',
          items: [
            { name: 'Free Account Brief',     desc: 'One Saudi target, 24h delivery.',   href: 'account-brief.html' },
            { name: 'See sample brief',       desc: 'Before you commit, see the depth.', href: 'sample-account-brief.html' },
            { name: 'Full pricing',           desc: 'All tiers in one page.',            href: 'services-pricing.html' },
          ]
        }
      ]
    },
    {
      label: 'Resources',
      href: 'blog.html',
      sections: [
        {
          title: 'Read',
          items: [
            { name: 'Blog',                   desc: 'Field notes from LEOMAX.',         href: 'blog.html' },
            { name: 'The Brief',              desc: 'Subscriptional weekly intelligence.', href: 'brief.html' },
            { name: 'Frameworks',             desc: 'Six core playbooks, free.',         href: 'company-process.html' },
          ]
        },
        {
          title: 'Watch & listen',
          items: [
            { name: 'Podcast',                desc: 'Conversations with operators.',     href: 'podcast.html' },
            { name: 'Case studies',           desc: 'Real engagements, real numbers.',   href: 'company-case-studies.html' },
            { name: 'Sample readiness',       desc: 'See an investor-ready memo.',       href: 'sample-readiness.html' },
          ]
        }
      ]
    },
    {
      label: 'Company',
      href: 'company-about.html',
      sections: [
        {
          title: 'About',
          items: [
            { name: 'About LEOMAX',           desc: 'Why we exist.',                     href: 'company-about.html' },
            { name: 'Dr. Anas Elimam',        desc: 'Founder profile.',                  href: 'anas-elimam.html' },
            { name: 'Anas at LEOMAX',         desc: 'The founder role.',                 href: 'company-founder.html' },
            { name: 'Process',                desc: 'How we engage.',                    href: 'company-process.html' },
            { name: 'Team',                   desc: 'The operators behind LEOMAX.',      href: 'team.html' },
          ]
        },
        {
          title: 'Get in touch',
          items: [
            { name: 'Contact',                desc: 'Email, WhatsApp, address.',         href: 'company-contact.html' },
            { name: 'Book a call',            desc: '30 minutes with Anas.',             href: 'https://calendly.com/leomaxglobalsa/30min' },
          ]
        }
      ]
    }
  ];

  /* ─── Account links (right side) ──────────────────────── */
  const ACCOUNT = [
    { name: 'Log in',   href: 'login.html' },
    { name: 'Sign up',  href: 'signup.html' },
  ];

  /* ─── Styles ──────────────────────────────────────────── */
  const STYLE = `
  .lm-nav-host, .lm-nav-host *, .lm-nav-host *::before, .lm-nav-host *::after { box-sizing: border-box; }
  .lm-nav-host { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif; }
  .lm-nav { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 9000; background: rgba(29,29,31,.72) !important; backdrop-filter: saturate(180%) blur(20px) !important; -webkit-backdrop-filter: saturate(180%) blur(20px) !important; border-bottom: none !important; padding: 0 !important; min-height: 0 !important; }
  .lm-nav-bar { display: flex !important; align-items: center !important; justify-content: space-between !important; max-width: 1200px !important; margin: 0 auto !important; padding: 0 28px !important; height: 44px !important; }
  .lm-nav-logo { display: flex !important; align-items: center !important; text-decoration: none !important; flex-shrink: 0 !important; }
  .lm-nav-logo img { height: 24px !important; width: auto !important; max-height: 24px !important; min-height: 24px !important; display: block !important; filter: brightness(0) invert(1) !important; opacity: .9 !important; }
  .lm-nav-links { display: flex !important; gap: 0 !important; list-style: none !important; margin: 0 !important; padding: 0 !important; align-items: center !important; }
  .lm-nav-links li { list-style: none !important; }
  .lm-nav-link { color: #f5f5f7 !important; text-decoration: none !important; font-size: 12px !important; font-weight: 400 !important; padding: 0 10px !important; border-radius: 0 !important; transition: opacity .15s !important; letter-spacing: -.01em !important; cursor: pointer !important; display: inline-block !important; text-transform: none !important; opacity: .8 !important; line-height: 44px !important; }
  .lm-nav-link:hover, .lm-nav-link.is-open { background: transparent !important; color: #f5f5f7 !important; opacity: 1 !important; }
  .lm-nav-account { display: flex !important; gap: 0 !important; align-items: center !important; flex-shrink: 0 !important; }
  .lm-nav-account a { color: #f5f5f7 !important; text-decoration: none !important; font-size: 12px !important; font-weight: 400 !important; padding: 0 10px !important; border-radius: 0 !important; letter-spacing: -.01em !important; text-transform: none !important; opacity: .8 !important; line-height: 44px !important; }
  .lm-nav-account a:hover { background: transparent !important; color: #f5f5f7 !important; opacity: 1 !important; }
  .lm-nav-cta { background: #0071e3 !important; color: #FFFFFF !important; text-decoration: none !important; font-size: 12px !important; font-weight: 400 !important; padding: 6px 14px !important; border-radius: 980px !important; transition: background .2s !important; letter-spacing: -.005em !important; margin-left: 10px !important; text-transform: none !important; line-height: 1 !important; opacity: 1 !important; }
  .lm-nav-cta:hover { background: #0077ed !important; color: #FFFFFF !important; opacity: 1 !important; }

  /* Dropdown panel — Apple dark glass. display:none as defensive default
     so even if position:fixed gets stripped by a parent rule the content
     stays hidden until JS adds .is-open. */
  .lm-dropdown { display: none !important; position: fixed !important; top: 44px !important; left: 0 !important; right: 0 !important; background: rgba(29,29,31,.92) !important; backdrop-filter: saturate(180%) blur(24px) !important; -webkit-backdrop-filter: saturate(180%) blur(24px) !important; border-bottom: none !important; transform: translateY(-8px) !important; opacity: 0 !important; pointer-events: none !important; transition: opacity .25s ease, transform .25s ease !important; z-index: 8999 !important; visibility: hidden !important; }
  .lm-dropdown.is-open { display: block !important; opacity: 1 !important; transform: translateY(0) !important; pointer-events: auto !important; visibility: visible !important; }
  .lm-dropdown-inner { max-width: 1200px !important; margin: 0 auto !important; padding: 32px 28px 36px !important; display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 64px !important; }
  .lm-dropdown-col h4 { font-size: 12px !important; font-weight: 500 !important; letter-spacing: -.005em !important; text-transform: none !important; color: #86868b !important; margin: 0 0 14px 0 !important; }
  .lm-dropdown-list { list-style: none !important; margin: 0 !important; padding: 0 !important; display: flex !important; flex-direction: column !important; gap: 2px !important; }
  .lm-dropdown-list li { list-style: none !important; }
  .lm-dropdown-item { display: block !important; padding: 6px 0 !important; text-decoration: none !important; color: #f5f5f7 !important; transition: opacity .15s !important; position: relative !important; }
  .lm-dropdown-item:hover { opacity: .65 !important; transform: none !important; }
  .lm-dropdown-name { display: flex !important; align-items: center !important; gap: 10px !important; font-size: 24px !important; font-weight: 500 !important; letter-spacing: -.018em !important; line-height: 1.2 !important; color: #f5f5f7 !important; }
  .lm-dropdown-flag { font-size: 10px !important; font-weight: 500 !important; letter-spacing: -.005em !important; text-transform: none !important; color: #2997ff !important; background: rgba(41,151,255,.15) !important; padding: 3px 8px !important; border-radius: 980px !important; }
  .lm-dropdown-desc { font-size: 12px !important; color: #86868b !important; margin-top: 2px !important; letter-spacing: -.005em !important; }

  /* Backdrop */
  .lm-backdrop { display: none !important; position: fixed !important; inset: 0 !important; background: rgba(0,0,0,.15) !important; z-index: 8998 !important; opacity: 0 !important; pointer-events: none !important; transition: opacity .25s ease !important; visibility: hidden !important; }
  .lm-backdrop.is-open { display: block !important; opacity: 1 !important; pointer-events: auto !important; visibility: visible !important; }

  /* Mobile hamburger */
  .lm-burger { display: none; background: transparent !important; border: none !important; padding: 8px !important; cursor: pointer !important; color: #f5f5f7 !important; }
  .lm-burger span { display: block !important; width: 18px !important; height: 1.5px !important; background: #f5f5f7 !important; margin: 4px 0 !important; transition: transform .25s, opacity .15s !important; }
  .lm-burger.is-open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .lm-burger.is-open span:nth-child(2) { opacity: 0; }
  .lm-burger.is-open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  /* Spacer so page content doesn't slip under fixed nav */
  .lm-nav-spacer { height: 44px; width: 100%; }

  /* Mobile (<= 900px) - Apple-style accordion drawer */
  @media (max-width: 900px) {
    .lm-nav-links, .lm-nav-account a { display: none; }
    .lm-nav-account a.lm-nav-cta { display: none; }
    .lm-burger { display: block; }
    .lm-nav-bar { padding: 0 20px; }
    .lm-mobile {
      display: none !important;
      position: fixed !important; top: 44px !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      background: rgba(29,29,31,.97) !important;
      backdrop-filter: saturate(180%) blur(24px) !important;
      -webkit-backdrop-filter: saturate(180%) blur(24px) !important;
      z-index: 8997 !important;
      transform: translateY(-100%) !important;
      transition: transform .35s cubic-bezier(.22,.61,.36,1) !important;
      overflow-y: auto !important; -webkit-overflow-scrolling: touch !important;
      padding: 8px 0 120px !important;
      visibility: hidden !important;
    }
    .lm-mobile.is-open { display: block !important; transform: translateY(0) !important; visibility: visible !important; }
    .lm-mobile-section {
      border-bottom: 1px solid rgba(255,255,255,.08) !important;
      overflow: hidden !important;
    }
    .lm-mobile-section-head {
      width: 100% !important; background: transparent !important; border: none !important;
      display: flex !important; align-items: center !important; justify-content: space-between !important;
      padding: 22px 24px !important; cursor: pointer !important; text-align: left !important;
      color: #f5f5f7 !important; font-size: 19px !important; font-weight: 500 !important;
      letter-spacing: -.018em !important; font-family: inherit !important;
      transition: opacity .15s !important;
    }
    .lm-mobile-section-head:active { opacity: .6 !important; }
    .lm-mobile-section-head .lm-chevron {
      width: 18px !important; height: 18px !important; transition: transform .3s cubic-bezier(.22,.61,.36,1) !important;
      stroke: #86868b !important; flex-shrink: 0 !important;
    }
    .lm-mobile-section.is-expanded .lm-chevron { transform: rotate(90deg) !important; stroke: #f5f5f7 !important; }
    .lm-mobile-section-body {
      max-height: 0 !important; transition: max-height .35s cubic-bezier(.22,.61,.36,1) !important;
      overflow: hidden !important;
    }
    .lm-mobile-section.is-expanded .lm-mobile-section-body { max-height: 800px !important; }
    .lm-mobile-section-body-inner { padding: 0 24px 16px !important; }
    .lm-mobile-subhead {
      font-size: 12px !important; font-weight: 500 !important; letter-spacing: -.005em !important;
      text-transform: none !important; color: #86868b !important; margin: 12px 0 6px !important;
    }
    .lm-mobile-item {
      display: block !important; padding: 14px 0 !important; text-decoration: none !important;
      color: #f5f5f7 !important; border-bottom: 1px solid rgba(255,255,255,.05) !important;
      transition: opacity .15s !important;
    }
    .lm-mobile-item:last-child { border-bottom: none !important; }
    .lm-mobile-item:active { opacity: .55 !important; }
    .lm-mobile-item-name {
      display: flex !important; align-items: center !important; gap: 8px !important;
      font-size: 16px !important; font-weight: 500 !important; letter-spacing: -.012em !important; line-height: 1.25 !important;
      color: #f5f5f7 !important;
    }
    .lm-mobile-item-flag {
      font-size: 10px !important; font-weight: 500 !important; letter-spacing: -.005em !important; text-transform: none !important;
      color: #2997ff !important; background: rgba(41,151,255,.15) !important; padding: 3px 7px !important; border-radius: 980px !important;
    }
    .lm-mobile-item-desc {
      font-size: 13px !important; color: #86868b !important;
      margin-top: 3px !important; letter-spacing: -.005em !important; line-height: 1.4 !important;
    }
    .lm-mobile-cta-wrap {
      padding: 24px !important;
      position: sticky !important; bottom: 0 !important;
      background: linear-gradient(180deg, rgba(29,29,31,0) 0%, rgba(29,29,31,.97) 40%) !important;
      pointer-events: none !important;
    }
    .lm-mobile-cta {
      display: block !important; pointer-events: auto !important;
      background: #0071e3 !important; color: #FFFFFF !important;
      text-decoration: none !important; text-align: center !important;
      padding: 14px !important; border-radius: 980px !important;
      font-size: 17px !important; font-weight: 400 !important; letter-spacing: -.005em !important;
      transition: background .2s !important;
    }
    .lm-mobile-cta:hover, .lm-mobile-cta:active { background: #0077ed !important; opacity: 1 !important; }
  }
  `;

  /* ─── Render ──────────────────────────────────────────── */
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'html') e.innerHTML = attrs[k];
        else if (k.startsWith('data-')) e.setAttribute(k, attrs[k]);
        else if (k === 'onclick' || k === 'onmouseenter' || k === 'onmouseleave') e[k] = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return e;
  }

  // Force-hidden inline styles - can't be overridden by any external CSS.
  const HIDDEN_STYLE = 'display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;position:fixed !important;top:-9999px !important;left:-9999px !important;';

  function buildDropdown(menu, idx) {
    const cols = menu.sections.map(section => {
      const items = section.items.map(it => {
        const flag = it.flag
          ? el('span', { class: 'lm-dropdown-flag' }, it.flag)
          : null;
        const name = el('div', { class: 'lm-dropdown-name' }, [it.name, flag]);
        const desc = it.desc ? el('div', { class: 'lm-dropdown-desc' }, it.desc) : null;
        const item = el('a', { class: 'lm-dropdown-item', href: it.href }, [name, desc]);
        return el('li', null, item);
      });
      return el('div', { class: 'lm-dropdown-col' }, [
        el('h4', null, section.title),
        el('ul', { class: 'lm-dropdown-list' }, items)
      ]);
    });
    const dropdown = el('div', { class: 'lm-dropdown', 'data-idx': idx, style: HIDDEN_STYLE }, [
      el('div', { class: 'lm-dropdown-inner' }, cols)
    ]);
    return dropdown;
  }

  function chevronSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'lm-chevron');
    svg.setAttribute('viewBox', '0 0 18 18');
    svg.setAttribute('fill', 'none');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M6 4l5 5-5 5');
    p.setAttribute('stroke-width', '1.6');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('stroke', 'currentColor');
    svg.appendChild(p);
    return svg;
  }

  function buildMobile() {
    const sections = MENU.map(menu => {
      // Body: rendered sub-sections with sub-headers + items
      const bodyChildren = [];
      menu.sections.forEach(section => {
        bodyChildren.push(el('div', { class: 'lm-mobile-subhead' }, section.title));
        section.items.forEach(it => {
          const flag = it.flag
            ? el('span', { class: 'lm-mobile-item-flag' }, it.flag)
            : null;
          const nameRow = el('div', { class: 'lm-mobile-item-name' }, [it.name, flag]);
          const desc = it.desc ? el('div', { class: 'lm-mobile-item-desc' }, it.desc) : null;
          bodyChildren.push(el('a', { class: 'lm-mobile-item', href: it.href }, [nameRow, desc]));
        });
      });
      const body = el('div', { class: 'lm-mobile-section-body' },
        el('div', { class: 'lm-mobile-section-body-inner' }, bodyChildren)
      );

      const head = el('button', { class: 'lm-mobile-section-head', type: 'button' }, [
        document.createTextNode(menu.label),
        chevronSvg()
      ]);

      const sec = el('div', { class: 'lm-mobile-section' }, [head, body]);
      head.addEventListener('click', () => {
        const open = sec.classList.toggle('is-expanded');
        // Close others (Apple-like single-open accordion)
        if (open) {
          document.querySelectorAll('.lm-mobile-section').forEach(s => {
            if (s !== sec) s.classList.remove('is-expanded');
          });
        }
      });
      return sec;
    });

    // Account section (last)
    const accountBody = [];
    ACCOUNT.forEach(a => {
      accountBody.push(el('a', { class: 'lm-mobile-item', href: a.href },
        el('div', { class: 'lm-mobile-item-name' }, a.name)));
    });
    const accountBodyWrap = el('div', { class: 'lm-mobile-section-body' },
      el('div', { class: 'lm-mobile-section-body-inner' }, accountBody)
    );
    const accountHead = el('button', { class: 'lm-mobile-section-head', type: 'button' }, [
      document.createTextNode('Account'),
      chevronSvg()
    ]);
    const accountSec = el('div', { class: 'lm-mobile-section' }, [accountHead, accountBodyWrap]);
    accountHead.addEventListener('click', () => {
      const open = accountSec.classList.toggle('is-expanded');
      if (open) {
        document.querySelectorAll('.lm-mobile-section').forEach(s => {
          if (s !== accountSec) s.classList.remove('is-expanded');
        });
      }
    });
    sections.push(accountSec);

    // Pinned sticky CTA at the bottom
    const cta = el('div', { class: 'lm-mobile-cta-wrap' },
      el('a', { class: 'lm-mobile-cta', href: 'company-contact.html' }, 'Book a Call')
    );

    return el('div', { class: 'lm-mobile' }, [...sections, cta]);
  }

  function init() {
    // Remove any pre-existing <nav> from the page so we don't double-stack.
    document.querySelectorAll('body > nav, body > header > nav').forEach(n => n.remove());

    // Inject styles
    if (!document.getElementById('lm-nav-style')) {
      const s = document.createElement('style');
      s.id = 'lm-nav-style';
      s.textContent = STYLE;
      document.head.appendChild(s);
    }

    // Host wrapper so our CSS scoping is safe
    const host = el('div', { class: 'lm-nav-host' });

    // Top bar
    const links = el('ul', { class: 'lm-nav-links' });
    MENU.forEach((m, i) => {
      const a = el('a', { class: 'lm-nav-link', href: m.href, 'data-idx': i }, m.label);
      links.appendChild(el('li', null, a));
    });

    const account = el('div', { class: 'lm-nav-account' }, [
      ...ACCOUNT.map(a => el('a', { href: a.href }, a.name)),
      el('a', { class: 'lm-nav-cta', href: 'company-contact.html' }, 'Book a Call')
    ]);

    const burger = el('button', {
      class: 'lm-burger',
      'aria-label': 'Menu',
      'aria-expanded': 'false'
    }, [el('span'), el('span'), el('span')]);

    const bar = el('div', { class: 'lm-nav-bar' }, [
      el('a', { class: 'lm-nav-logo', href: 'LEOMAX_Website_Design.html' },
        el('img', { src: 'logo.png', alt: 'LEOMAX' })),
      links,
      account,
      burger
    ]);

    const nav = el('nav', { class: 'lm-nav' }, bar);
    host.appendChild(nav);

    // Dropdowns
    const dropdowns = MENU.map((m, i) => buildDropdown(m, i));
    dropdowns.forEach(d => host.appendChild(d));

    // Backdrop — force-hidden inline so nothing can override
    const backdrop = el('div', { class: 'lm-backdrop', style: HIDDEN_STYLE });
    host.appendChild(backdrop);

    // Mobile drawer — force-hidden inline
    const mobile = buildMobile();
    mobile.setAttribute('style', HIDDEN_STYLE);
    host.appendChild(mobile);

    // Spacer to push content below fixed nav
    const spacer = el('div', { class: 'lm-nav-spacer' });

    document.body.insertBefore(host, document.body.firstChild);
    document.body.insertBefore(spacer, host.nextSibling);

    /* ─── Behaviour ─────────────────────────────────────── */
    let openIdx = -1;
    let closeTimer = null;

    const VISIBLE_DROPDOWN = 'display:block !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;position:fixed !important;top:44px !important;left:0 !important;right:0 !important;';
    const VISIBLE_BACKDROP = 'display:block !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;position:fixed !important;inset:0 !important;';

    function openDropdown(idx) {
      clearTimeout(closeTimer);
      if (openIdx === idx) return;
      closeAll(true);
      openIdx = idx;
      dropdowns[idx].setAttribute('style', VISIBLE_DROPDOWN);
      dropdowns[idx].classList.add('is-open');
      backdrop.setAttribute('style', VISIBLE_BACKDROP);
      backdrop.classList.add('is-open');
      const link = links.querySelector('[data-idx="' + idx + '"]');
      if (link) link.classList.add('is-open');
    }

    function closeAll(immediate) {
      const fn = () => {
        dropdowns.forEach(d => {
          d.classList.remove('is-open');
          d.setAttribute('style', HIDDEN_STYLE);
        });
        backdrop.classList.remove('is-open');
        backdrop.setAttribute('style', HIDDEN_STYLE);
        links.querySelectorAll('.lm-nav-link').forEach(l => l.classList.remove('is-open'));
        openIdx = -1;
      };
      if (immediate) fn();
      else closeTimer = setTimeout(fn, 120);
    }

    // Hover open + intent-to-close delay (Apple-like)
    links.querySelectorAll('.lm-nav-link').forEach(link => {
      const idx = parseInt(link.getAttribute('data-idx'), 10);
      link.addEventListener('mouseenter', () => openDropdown(idx));
      link.addEventListener('mouseleave', () => closeAll(false));
      link.addEventListener('focus', () => openDropdown(idx));
    });
    dropdowns.forEach(d => {
      d.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      d.addEventListener('mouseleave', () => closeAll(false));
    });

    backdrop.addEventListener('click', () => closeAll(true));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll(true);
    });

    const VISIBLE_MOBILE = 'display:block !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;position:fixed !important;top:44px !important;left:0 !important;right:0 !important;bottom:0 !important;overflow-y:auto !important;';

    // Mobile burger
    burger.addEventListener('click', () => {
      const open = !mobile.classList.contains('is-open');
      if (open) {
        mobile.setAttribute('style', VISIBLE_MOBILE);
        mobile.classList.add('is-open');
      } else {
        mobile.setAttribute('style', HIDDEN_STYLE);
        mobile.classList.remove('is-open');
      }
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close mobile on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('is-open');
        mobile.setAttribute('style', HIDDEN_STYLE);
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
