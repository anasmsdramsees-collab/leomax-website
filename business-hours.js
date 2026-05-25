/* ============================================================
   LEOMAX — Business Hours Status Indicator
   ============================================================
   KSA working schedule (Asia/Riyadh, GMT+3):
   - Sun-Thu, 08:00 - 17:00 → GREEN  (open / online)
   - Sun-Thu, after 17:00   → YELLOW (after-hours / async)
   - Friday / Saturday      → RED    (weekend / closed)

   Updates every status dot (.vm-pulse, .vm-head .vm-av .dot, etc.)
   Adds a hover tooltip with full schedule + current status.
   ============================================================ */

(function () {
  'use strict';

  function getKsaTime() {
    // Asia/Riyadh = GMT+3, no DST
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Riyadh',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    var parts = fmt.formatToParts(new Date());
    var p = {};
    parts.forEach(function (x) { p[x.type] = x.value; });
    // weekday short: Sun, Mon, Tue, Wed, Thu, Fri, Sat
    var weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var dayIdx = weekdays.indexOf(p.weekday);
    var hour = parseInt(p.hour, 10);
    var minute = parseInt(p.minute, 10);
    return { day: p.weekday, dayIdx: dayIdx, hour: hour, minute: minute };
  }

  function getStatus() {
    var t = getKsaTime();
    // Friday (5) or Saturday (6) → weekend
    if (t.dayIdx === 5 || t.dayIdx === 6) {
      return {
        color: '#ef4444',
        label: 'Weekend',
        text: 'Currently closed for the weekend.',
        sub: 'We reopen Sunday at 8:00 AM (KSA time).',
        animate: false
      };
    }
    // Sunday-Thursday
    if (t.hour >= 8 && t.hour < 17) {
      return {
        color: '#10b981',
        label: 'Online',
        text: 'Open now — we\'re online.',
        sub: 'Working hours: Sun-Thu · 8:00 AM - 5:00 PM (KSA).',
        animate: true
      };
    }
    // Outside working hours weekday
    return {
      color: '#f59e0b',
      label: 'After hours',
      text: 'After hours — we\'ll reply tomorrow.',
      sub: 'Working hours: Sun-Thu · 8:00 AM - 5:00 PM (KSA).',
      animate: false
    };
  }

  function injectStyle() {
    if (document.getElementById('bh-style')) return;
    var s = document.createElement('style');
    s.id = 'bh-style';
    s.textContent = '\n      /* Status dot — colored by JS via inline style */\n      .vm-pulse, .vm-head .vm-av .dot,\n      .status-dot, .lm-status-dot {\n        cursor: help;\n      }\n      .vm-pulse[data-bh="weekend"], .vm-head .vm-av .dot[data-bh="weekend"] {\n        animation: none !important;\n      }\n      .vm-pulse[data-bh="after"], .vm-head .vm-av .dot[data-bh="after"] {\n        animation: none !important;\n      }\n      /* Hover tooltip */\n      .bh-tooltip {\n        position: fixed;\n        z-index: 99999;\n        background: #1d1d1f;\n        color: #f5f5f7;\n        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;\n        font-size: 13px;\n        padding: 12px 16px;\n        border-radius: 12px;\n        box-shadow: 0 8px 24px rgba(0,0,0,.25);\n        pointer-events: none;\n        opacity: 0;\n        transition: opacity .15s, transform .15s;\n        transform: translateY(4px);\n        max-width: 280px;\n        line-height: 1.5;\n      }\n      .bh-tooltip.show {\n        opacity: 1;\n        transform: translateY(0);\n      }\n      .bh-tooltip .label {\n        display: inline-block;\n        font-size: 10px;\n        letter-spacing: .5px;\n        text-transform: uppercase;\n        font-weight: 600;\n        padding: 2px 8px;\n        border-radius: 980px;\n        margin-bottom: 8px;\n      }\n      .bh-tooltip .label.green { background: rgba(16,185,129,.15); color: #34d399; }\n      .bh-tooltip .label.yellow { background: rgba(245,158,11,.15); color: #fbbf24; }\n      .bh-tooltip .label.red { background: rgba(239,68,68,.15); color: #f87171; }\n      .bh-tooltip .main { color: #fff; font-weight: 500; margin-bottom: 4px; }\n      .bh-tooltip .sub { color: #a1a1a6; font-size: 12px; }\n    ';
    document.head.appendChild(s);
  }

  function applyStatus() {
    var status = getStatus();
    var labelClass = status.color === '#10b981' ? 'green' : (status.color === '#f59e0b' ? 'yellow' : 'red');
    var bhKey = status.color === '#10b981' ? 'open' : (status.color === '#f59e0b' ? 'after' : 'weekend');

    // All status dots on the site
    var selectors = [
      '.vm-pulse',          // Valeria floating button
      '.vm-head .vm-av .dot', // Valeria chat header
      '.status-dot',         // generic
      '.lm-status-dot'       // generic
    ];

    selectors.forEach(function (sel) {
      var dots = document.querySelectorAll(sel);
      dots.forEach(function (dot) {
        dot.style.background = status.color;
        dot.setAttribute('data-bh', bhKey);
        attachTooltip(dot, status, labelClass);
      });
    });
  }

  var tooltipEl = null;

  function getTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'bh-tooltip';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function attachTooltip(el, status, labelClass) {
    if (el.dataset.bhAttached === '1') return;
    el.dataset.bhAttached = '1';

    function show(e) {
      var tt = getTooltip();
      tt.innerHTML =
        '<span class="label ' + labelClass + '">' + status.label + '</span><br>' +
        '<div class="main">' + status.text + '</div>' +
        '<div class="sub">' + status.sub + '</div>';
      var rect = el.getBoundingClientRect();
      // Position above the dot, centered-ish
      tt.style.left = Math.min(rect.left, window.innerWidth - 300) + 'px';
      tt.style.top = (rect.top - 90) + 'px';
      tt.classList.add('show');
    }
    function hide() {
      if (tooltipEl) tooltipEl.classList.remove('show');
    }

    // Use parent (.vm-btn) as the hover target if the dot is too tiny
    var hoverTarget = el.closest('.vm-btn') || el.closest('.vm-av') || el;
    hoverTarget.addEventListener('mouseenter', show);
    hoverTarget.addEventListener('mouseleave', hide);
    hoverTarget.addEventListener('focus', show);
    hoverTarget.addEventListener('blur', hide);
    // Touch: tap to toggle
    hoverTarget.addEventListener('touchstart', function (e) {
      var tt = getTooltip();
      if (tt.classList.contains('show')) {
        hide();
      } else {
        show(e);
        setTimeout(hide, 4000);
      }
    }, { passive: true });
  }

  function init() {
    injectStyle();
    applyStatus();
    // Re-evaluate every minute (in case user keeps tab open past 5 PM)
    setInterval(applyStatus, 60 * 1000);
    // Also re-apply when new dots appear (Valeria pop-up opens later)
    var obs = new MutationObserver(function () { applyStatus(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
