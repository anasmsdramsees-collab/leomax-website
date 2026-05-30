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
            { name: 'Anas Elimam',            desc: 'Founder.',                          href: 'company-founder.html' },
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
  .lm-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 9000; background: rgba(1,11,28,.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,.06); }
  .lm-nav-bar { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 0 28px; height: 56px; }
  .lm-nav-logo { display: flex; align-items: center; text-decoration: none; }
  .lm-nav-logo img { height: 28px; width: auto; display: block; }
  .lm-nav-links { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; align-items: center; }
  .lm-nav-link { color: rgba(255,255,255,.9); text-decoration: none; font-size: 13px; font-weight: 400; padding: 8px 14px; border-radius: 980px; transition: background .2s, color .2s; letter-spacing: -.01em; cursor: pointer; display: inline-block; }
  .lm-nav-link:hover, .lm-nav-link.is-open { background: rgba(255,255,255,.08); color: #FFFFFF; }
  .lm-nav-account { display: flex; gap: 4px; align-items: center; }
  .lm-nav-account a { color: rgba(255,255,255,.85); text-decoration: none; font-size: 12px; padding: 7px 12px; border-radius: 980px; letter-spacing: -.005em; }
  .lm-nav-account a:hover { background: rgba(255,255,255,.08); color: #FFFFFF; }
  .lm-nav-cta { background: #FFFFFF; color: #010B1C; text-decoration: none; font-size: 12px; font-weight: 500; padding: 8px 16px; border-radius: 980px; transition: background .2s, transform .15s; letter-spacing: -.005em; margin-left: 6px; }
  .lm-nav-cta:hover { background: #E8EDF3; }

  /* Dropdown panel */
  .lm-dropdown { position: fixed; top: 56px; left: 0; right: 0; background: rgba(1,11,28,.96); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,.08); transform: translateY(-8px); opacity: 0; pointer-events: none; transition: opacity .25s ease, transform .25s ease; z-index: 8999; }
  .lm-dropdown.is-open { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .lm-dropdown-inner { max-width: 1200px; margin: 0 auto; padding: 32px 28px 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
  .lm-dropdown-col h4 { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #7B95B0; margin: 0 0 18px 0; }
  .lm-dropdown-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  .lm-dropdown-item { display: block; padding: 8px 0; text-decoration: none; color: #FFFFFF; transition: opacity .15s, transform .2s ease; position: relative; }
  .lm-dropdown-item:hover { opacity: .75; transform: translateX(2px); }
  .lm-dropdown-name { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 500; letter-spacing: -.015em; line-height: 1.2; }
  .lm-dropdown-flag { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #9DB5CF; background: rgba(157,181,207,.12); padding: 3px 7px; border-radius: 980px; }
  .lm-dropdown-desc { font-size: 13px; color: rgba(255,255,255,.55); margin-top: 2px; letter-spacing: -.005em; }

  /* Backdrop (catches outside clicks on desktop) */
  .lm-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 8998; opacity: 0; pointer-events: none; transition: opacity .25s ease; }
  .lm-backdrop.is-open { opacity: 1; pointer-events: auto; }

  /* Mobile hamburger */
  .lm-burger { display: none; background: transparent; border: none; padding: 8px; cursor: pointer; color: #FFFFFF; }
  .lm-burger span { display: block; width: 18px; height: 1.5px; background: #FFFFFF; margin: 4px 0; transition: transform .25s, opacity .15s; }
  .lm-burger.is-open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .lm-burger.is-open span:nth-child(2) { opacity: 0; }
  .lm-burger.is-open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  /* Spacer so page content doesn't slip under fixed nav */
  .lm-nav-spacer { height: 56px; width: 100%; }

  /* Mobile (<= 900px) - Apple-style accordion drawer */
  @media (max-width: 900px) {
    .lm-nav-links, .lm-nav-account a { display: none; }
    .lm-nav-account a.lm-nav-cta { display: none; }
    .lm-burger { display: block; }
    .lm-nav-bar { padding: 0 20px; }
    .lm-mobile {
      position: fixed; top: 56px; left: 0; right: 0; bottom: 0;
      background: #010B1C; z-index: 8997;
      transform: translateY(-100%);
      transition: transform .35s cubic-bezier(.22,.61,.36,1);
      overflow-y: auto; -webkit-overflow-scrolling: touch;
      padding: 8px 0 120px;
    }
    .lm-mobile.is-open { transform: translateY(0); }
    .lm-mobile-section {
      border-bottom: 1px solid rgba(255,255,255,.06);
      overflow: hidden;
    }
    .lm-mobile-section-head {
      width: 100%; background: transparent; border: none;
      display: flex; align-items: center; justify-content: space-between;
      padding: 22px 24px; cursor: pointer; text-align: left;
      color: #FFFFFF; font-size: 19px; font-weight: 500;
      letter-spacing: -.018em; font-family: inherit;
      transition: opacity .15s;
    }
    .lm-mobile-section-head:active { opacity: .6; }
    .lm-mobile-section-head .lm-chevron {
      width: 18px; height: 18px; transition: transform .3s cubic-bezier(.22,.61,.36,1);
      stroke: #7B95B0; flex-shrink: 0;
    }
    .lm-mobile-section.is-expanded .lm-chevron { transform: rotate(90deg); stroke: #FFFFFF; }
    .lm-mobile-section-body {
      max-height: 0; transition: max-height .35s cubic-bezier(.22,.61,.36,1);
      overflow: hidden;
    }
    .lm-mobile-section.is-expanded .lm-mobile-section-body { max-height: 800px; }
    .lm-mobile-section-body-inner { padding: 0 24px 16px; }
    .lm-mobile-subhead {
      font-size: 10px; font-weight: 600; letter-spacing: .18em;
      text-transform: uppercase; color: #7B95B0; margin: 12px 0 6px;
    }
    .lm-mobile-item {
      display: block; padding: 14px 0; text-decoration: none;
      color: #FFFFFF; border-bottom: 1px solid rgba(255,255,255,.04);
      transition: opacity .15s;
    }
    .lm-mobile-item:last-child { border-bottom: none; }
    .lm-mobile-item:active { opacity: .55; }
    .lm-mobile-item-name {
      display: flex; align-items: center; gap: 8px;
      font-size: 16px; font-weight: 500; letter-spacing: -.012em; line-height: 1.25;
    }
    .lm-mobile-item-flag {
      font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
      color: #9DB5CF; background: rgba(157,181,207,.14); padding: 3px 7px; border-radius: 980px;
    }
    .lm-mobile-item-desc {
      font-size: 13px; color: rgba(255,255,255,.5);
      margin-top: 3px; letter-spacing: -.005em; line-height: 1.4;
    }
    .lm-mobile-cta-wrap {
      padding: 24px;
      position: sticky; bottom: 0;
      background: linear-gradient(180deg, rgba(1,11,28,0) 0%, #010B1C 40%);
      pointer-events: none;
    }
    .lm-mobile-cta {
      display: block; pointer-events: auto;
      background: #FFFFFF; color: #010B1C;
      text-decoration: none; text-align: center;
      padding: 16px; border-radius: 980px;
      font-size: 15px; font-weight: 500; letter-spacing: -.005em;
      transition: opacity .15s;
    }
    .lm-mobile-cta:active { opacity: .8; }
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
    return el('div', { class: 'lm-dropdown', 'data-idx': idx }, [
      el('div', { class: 'lm-dropdown-inner' }, cols)
    ]);
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

    // Backdrop
    const backdrop = el('div', { class: 'lm-backdrop' });
    host.appendChild(backdrop);

    // Mobile drawer
    const mobile = buildMobile();
    host.appendChild(mobile);

    // Spacer to push content below fixed nav
    const spacer = el('div', { class: 'lm-nav-spacer' });

    document.body.insertBefore(host, document.body.firstChild);
    document.body.insertBefore(spacer, host.nextSibling);

    /* ─── Behaviour ─────────────────────────────────────── */
    let openIdx = -1;
    let closeTimer = null;

    function openDropdown(idx) {
      clearTimeout(closeTimer);
      if (openIdx === idx) return;
      closeAll(true);
      openIdx = idx;
      dropdowns[idx].classList.add('is-open');
      backdrop.classList.add('is-open');
      const link = links.querySelector('[data-idx="' + idx + '"]');
      if (link) link.classList.add('is-open');
    }

    function closeAll(immediate) {
      const fn = () => {
        dropdowns.forEach(d => d.classList.remove('is-open'));
        backdrop.classList.remove('is-open');
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

    // Mobile burger
    burger.addEventListener('click', () => {
      const open = !mobile.classList.contains('is-open');
      mobile.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close mobile on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('is-open');
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
