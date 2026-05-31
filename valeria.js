/* ============================================================
   LEOMAX — Valeria Moreno
   Open-conversation AI consultant · persistent across pages
   ============================================================
   Behavior: ChatGPT-style open conversation.
             No canned routing. No flattery filters. No "QA monitored" tone.
             Answers ANY question — business, tech, life — substantively.

   API: Groq (free, browser CORS) using Llama 3.3 70B Versatile.
        Replace GROQ_KEY below with your real key from console.groq.com.
        Migration path: route through Netlify Function for Claude + key security.

   Storage: localStorage key 'leomax_valeria_v1' — chat persists across pages.
   ============================================================ */

(function () {
  'use strict';

  /* ─── CONFIG ──────────────────────────────────────────── */
  // Cloudflare Worker endpoint — routes to Claude (primary) + GPT-4o-mini (fallback)
  // Deploy worker from /chat-worker/ folder, then paste the URL here.
  var CHAT_WORKER_URL = 'https://leomax-valeria-chat.anas-msd-ramsees.workers.dev';
  var HAS_AI = CHAT_WORKER_URL && CHAT_WORKER_URL !== 'PASTE_YOUR_WORKER_URL_HERE';

  var AVATAR_URL = 'team/valeria-moreno.jpg';
  var STORAGE_KEY = 'leomax_valeria_v1';
  var MAX_HISTORY = 30; // keep last 30 turns in context

  /* ─── SYSTEM PROMPT ───────────────────────────────────── */
  var SYSTEM = [
    "You are Valeria Moreno — a senior business strategist at LEOMAX and Dr. Anas Elimam's right hand. You're the AI consultant on the LEOMAX website.",
    "",
    "Personality: Mexican-born, based in Riyadh for 8 years. Fluent in Arabic, English, and Spanish. 12 years of business development experience across MENA and LatAm. Direct, warm, sharp. You have real opinions and you share them. You disagree when you have a reason. You don't hedge.",
    "",
    "Behavior: Have an open, substantive conversation — like ChatGPT or Claude. Answer any question — business, technology, finance, strategy, even general life questions. Don't be a gatekeeper. Don't auto-route people to advisors. Don't end every message with a question. Let conversations breathe.",
    "",
    "Tone: Professional and warm. No 'as an AI language model' disclaimers. No 'I'm sorry but I can't help with that' unless the request is genuinely harmful. No emojis. No 'QA monitoring' talk. You're a real consultant with a real perspective.",
    "",
    "Language: Respond in the same language the user writes in. Arabic input → Arabic response (use natural Saudi/Gulf-friendly Arabic). English input → English response. Bilingual is fine if they mix.",
    "",
    "When discussing LEOMAX specifically, you know:",
    "- Founder: Dr. Anas Elimam, based in Riyadh, Saudi Arabia",
    "- Four pillars:",
    "  1. Strategy & Implementation: Diagnostic (SAR 1,500), Single System (SAR 6,500), Transformation (SAR 22,000), Advisory Retainer (SAR 5,000/mo)",
    "  2. BD & Enterprise Access: Free Account Brief, Account Access Sprint (SAR 15,000 / 4 weeks), BD-as-a-Service (SAR 7,500/mo + 8% commission)",
    "  3. Investor Layer: Investment Readiness Sprint (SAR 18,000), Investor Memo Subscription for Family Offices (SAR 12,000/mo)",
    "  4. Strategy OS: Vertical SaaS coming Q3 2026 — tiers SAR 2,500 / 5,500 / 12,000 per month",
    "- Recent case study: MADAR Logistics — built from idea to revenue in 90 days. End-to-end engagement covering market study, brand, profile, website, 6 operational integrations.",
    "",
    "ACTION TOKENS — when the conversation naturally calls for it, you can emit ONE action token at the very end of your message (on its own line, after all your text). The UI will render this as a button the user can click. Available tokens:",
    "",
    "  [[CALL]] — book a 30-min discovery call with Dr. Anas via Calendly. Use when they're ready to talk to a human about a specific engagement.",
    "  [[BRIEF]] — request a free Account Brief on any Saudi company. Use when they mention a specific target company they want to reach or research.",
    "  [[WHATSAPP]] — quick WhatsApp contact with Anas. Use when they want a fast, informal channel.",
    "  [[ADVISOR:slug]] — hand off to a specialist on the LEOMAX Advisory Board. Use when their question is deeply domain-specific and a specialist intake would help more than open chat. Available slugs:",
    "    - kaya-haddad (Chief Strategy Officer — strategy, positioning, restructuring)",
    "    - laith-darwish (AI & Tech Director — AI integration, automation, ERP/CRM)",
    "    - hani-masry (CFO — cash flow, unit economics, financial modeling)",
    "    - kamilia-fouad (Marketing & Brand — campaigns, positioning, content, SEO)",
    "    - rami-khalidi (Operations — SOPs, hiring, org design)",
    "    - haya-kuwari (Business Development — B2B, pipeline, enterprise deals)",
    "    - mashari-otaibi (Investment Director — funding, valuation, M&A)",
    "    - elhanouf-harbi (Sustainability — ESG, Vision 2030, green frameworks)",
    "    - miral-hakimi (Regional Expansion — GCC entry, licensing, cross-border)",
    "    - yasin-sherif (Supply Chain — logistics, procurement, fulfillment)",
    "    - rita-nasser (Innovation — R&D, MVP, product development)",
    "    - mira-mansoori (Partnerships — JVs, MOUs, distribution)",
    "    - dr-anas (Founder & CEO — multi-domain, complex transformations)",
    "",
    "Token rules:",
    "  - ONLY emit a token when it genuinely helps the user, not on every message",
    "  - NEVER emit a token on the first reply — get context first",
    "  - Emit AT MOST one token per response",
    "  - Place it on its own line at the very end, no other text after it",
    "  - The user can ignore the button. Don't pressure or ask 'did you click?'",
    "",
    "Don't push these. Talk first. Help. Build the relationship. Routing happens later, naturally."
  ].join('\n');

  /* ─── REPORTING ────────────────────────────────────────
     Sends a transcript snapshot to Anas via Web3Forms when:
     - Conversation reaches 3+ exchanges (meaningful intent), OR
     - User clicks an action button (high intent)
     Once per session — sessionStorage flag prevents duplicates.
  */
  var REPORT_KEY = 'leomax_valeria_reported';
  var WEB3FORMS_KEY = '8cbff62d-1c1b-4bea-affb-7947492e14be';

  function alreadyReported() {
    try { return sessionStorage.getItem(REPORT_KEY) === '1'; } catch (e) { return false; }
  }
  function markReported() {
    try { sessionStorage.setItem(REPORT_KEY, '1'); } catch (e) {}
  }
  function buildTranscript(msgs, actionClicked) {
    var lines = [];
    lines.push('=== VALERIA CONVERSATION SUMMARY ===');
    lines.push('Page: ' + location.href);
    lines.push('Date: ' + new Date().toString());
    lines.push('Language: ' + (msgs.some(function (m) { return isArabic(m.content); }) ? 'Arabic / mixed' : 'English'));
    lines.push('Turns: ' + msgs.length);
    if (actionClicked) lines.push('Action clicked: ' + actionClicked);
    lines.push('User agent: ' + navigator.userAgent.slice(0, 100));
    lines.push('');
    lines.push('--- TRANSCRIPT ---');
    msgs.forEach(function (m) {
      var who = m.role === 'user' ? 'VISITOR' : 'VALERIA';
      lines.push('');
      lines.push('[' + who + ']');
      lines.push(m.content);
    });
    return lines.join('\n');
  }
  function getSessionId() {
    try {
      var sid = sessionStorage.getItem('leomax_valeria_sid');
      if (!sid) {
        sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        sessionStorage.setItem('leomax_valeria_sid', sid);
      }
      return sid;
    } catch (e) { return 'anon-' + Date.now(); }
  }

  function maybeSendReport(actionClicked) {
    if (!messages || messages.length < 4) return; // need at least 2 turns each side
    if (alreadyReported() && !actionClicked) return;

    var firstUserMsg = '';
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') { firstUserMsg = messages[i].content.slice(0, 60); break; }
    }
    var subject = '🎯 LEOMAX Chat' + (actionClicked ? ' [' + actionClicked + ']' : '') + ' — ' + firstUserMsg;
    var language = messages.some(function (m) { return isArabic(m.content); }) ? 'Arabic / mixed' : 'English';

    // 1. Email notification via Web3Forms (instant inbox alert)
    var formData = new FormData();
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', subject);
    formData.append('from_name', 'Valeria AI Chat');
    formData.append('message', buildTranscript(messages, actionClicked));
    formData.append('page_url', location.href);
    formData.append('action_clicked', actionClicked || 'none');
    formData.append('turns', String(messages.length));
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      .then(function () { markReported(); })
      .catch(function () {});

    // 2. Persistent log to worker KV (for the admin dashboard)
    if (HAS_AI && CHAT_WORKER_URL) {
      fetch(CHAT_WORKER_URL.replace(/\/$/, '') + '/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages,
          page: location.href,
          language: language,
          action: actionClicked || null,
          sessionId: getSessionId()
        })
      }).catch(function () {});
    }
  }

  /* ─── STORAGE ─────────────────────────────────────────── */
  function loadMessages() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveMessages(msgs) {
    try {
      var trimmed = msgs.slice(-MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {}
  }
  function clearMessages() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* ─── LANGUAGE DETECTION ──────────────────────────────── */
  function isArabic(text) {
    return /[\u0600-\u06FF]/.test(text || '');
  }

  /* ─── STYLE INJECTION ─────────────────────────────────── */
  var STYLE = `
    .vm-btn{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;background:#010B1C;border:2px solid #B8B8B8;cursor:pointer;box-shadow:0 8px 32px rgba(1,11,28,.35);z-index:9998;overflow:hidden;transition:transform .2s,box-shadow .2s;padding:0}
    .vm-btn:hover{transform:scale(1.05);box-shadow:0 12px 40px rgba(0,0,0,.3)}
    .vm-btn img{width:100%;height:100%;object-fit:cover;display:block}
    .vm-btn .vm-pulse{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:#10b981;border:2px solid #010B1C;border-radius:50%;animation:vm-pulse 2s infinite}
    @keyframes vm-pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .vm-tip{position:fixed;bottom:32px;right:100px;background:#010B1C;color:#fff;padding:10px 16px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;border-radius:10px 10px 2px 10px;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:9997;opacity:0;transform:translateX(10px);transition:opacity .3s,transform .3s;pointer-events:none;max-width:240px}
    .vm-tip.show{opacity:1;transform:translateX(0)}
    .vm-tip::after{content:'';position:absolute;right:-8px;bottom:8px;border:8px solid transparent;border-left-color:#010B1C;border-right:0}

    .vm-panel{position:fixed;bottom:24px;right:24px;width:400px;height:620px;max-height:calc(100vh - 48px);background:#fff;border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,.25);z-index:9999;display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;transform:scale(.95) translateY(20px);opacity:0;pointer-events:none;transition:transform .25s,opacity .25s;border:1px solid rgba(0,0,0,.2)}
    .vm-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}

    .vm-head{background:#010B1C;color:#fff;padding:18px 18px;display:flex;align-items:center;gap:14px;border-bottom:1px solid rgba(0,0,0,.2)}
    .vm-head .vm-av{width:48px;height:48px;border-radius:50%;border:2px solid #B8B8B8;overflow:hidden;flex-shrink:0;position:relative}
    .vm-head .vm-av img{width:100%;height:100%;object-fit:cover;display:block}
    .vm-head .vm-av .dot{position:absolute;bottom:0;right:0;width:12px;height:12px;background:#10b981;border:2px solid #010B1C;border-radius:50%}
    .vm-head .vm-meta{flex:1;min-width:0}
    .vm-head .vm-name{font-size:15px;font-weight:700;color:#fff;letter-spacing:.2px;line-height:1.2}
    .vm-head .vm-role{font-size:11px;color:#8fa8be;letter-spacing:1px;text-transform:uppercase;margin-top:3px}
    .vm-head .vm-controls{display:flex;gap:6px}
    .vm-head .vm-ctrl{width:30px;height:30px;background:rgba(255,255,255,.05);border:none;color:#8fa8be;cursor:pointer;border-radius:8px;font-size:14px;display:flex;align-items:center;justify-content:center;transition:background .15s}
    .vm-head .vm-ctrl:hover{background:rgba(255,255,255,.12);color:#fff}

    .vm-body{flex:1;overflow-y:auto;padding:20px 18px;background:#F4F7FB;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
    .vm-body::-webkit-scrollbar{width:6px}
    .vm-body::-webkit-scrollbar-thumb{background:#c8d3de;border-radius:3px}

    .vm-msg{max-width:85%;font-size:14px;line-height:1.65;animation:vm-in .25s ease-out}
    @keyframes vm-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .vm-msg.you{align-self:flex-end;background:#010B1C;color:#fff;padding:11px 14px;border-radius:14px 14px 2px 14px}
    .vm-msg.her{align-self:flex-start;color:#010B1C}
    .vm-msg.her .vm-bubble{background:#fff;padding:12px 15px;border-radius:14px 14px 14px 2px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid #E5EAF0}
    .vm-msg.her .vm-who{font-size:10px;color:#8fa8be;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;margin-left:2px;font-weight:600}
    .vm-msg.rtl{direction:rtl;text-align:right}
    .vm-msg p{margin:0 0 8px}
    .vm-msg p:last-child{margin-bottom:0}
    .vm-msg a{color:#B8B8B8;text-decoration:underline}
    .vm-msg code{background:rgba(1,11,28,.06);padding:1px 5px;border-radius:3px;font-size:12.5px}
    .vm-msg pre{background:#010B1C;color:#D4D4D4;padding:10px 12px;border-radius:8px;overflow-x:auto;font-size:12px;margin:8px 0}
    .vm-msg ul,.vm-msg ol{margin:6px 0 6px 18px;padding:0}
    .vm-msg li{margin-bottom:4px}
    .vm-msg strong{font-weight:700}

    .vm-typing{display:flex;gap:4px;padding:14px 16px;background:#fff;border-radius:14px 14px 14px 2px;align-self:flex-start;border:1px solid #E5EAF0;max-width:80px}
    .vm-typing span{width:7px;height:7px;background:#8fa8be;border-radius:50%;animation:vm-bounce 1.2s infinite}
    .vm-typing span:nth-child(2){animation-delay:.2s}
    .vm-typing span:nth-child(3){animation-delay:.4s}
    @keyframes vm-bounce{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}

    .vm-quick{display:flex;gap:7px;padding:0 18px 14px;background:#F4F7FB;flex-wrap:wrap}
    .vm-quick button{background:#fff;border:1px solid #DDE4ED;color:#010B1C;padding:8px 13px;font-size:12px;border-radius:18px;cursor:pointer;font-family:inherit;transition:all .15s;font-weight:500}
    .vm-quick button:hover{border-color:#B8B8B8;color:#B8B8B8}

    /* Action button (rendered when Valeria emits a token) */
    .vm-action{display:flex;align-items:center;gap:10px;background:#010B1C;color:#fff;border:none;padding:11px 16px;font-size:13px;border-radius:12px;cursor:pointer;font-family:inherit;font-weight:600;text-decoration:none;margin-top:10px;transition:transform .15s,box-shadow .15s}
    .vm-action:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(1,11,28,.25)}
    .vm-action .vm-action-icon{font-size:15px;line-height:1}
    .vm-action .vm-action-meta{font-size:10px;letter-spacing:1px;text-transform:uppercase;opacity:.7;display:block;margin-top:2px}
    .vm-action.green{background:#10b981}
    .vm-action.green:hover{box-shadow:0 4px 12px rgba(16,185,129,.35)}
    .vm-msg.rtl .vm-action{flex-direction:row-reverse}

    .vm-foot{padding:14px 18px;background:#fff;border-top:1px solid #E5EAF0;display:flex;gap:10px;align-items:flex-end}
    .vm-input{flex:1;border:1px solid #DDE4ED;border-radius:12px;padding:11px 14px;font-size:14px;font-family:inherit;resize:none;outline:none;min-height:44px;max-height:120px;line-height:1.45;color:#010B1C;background:#F4F7FB;transition:border-color .15s}
    .vm-input:focus{border-color:#B8B8B8;background:#fff}
    .vm-send{background:#010B1C;color:#fff;border:none;width:44px;height:44px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
    .vm-send:hover:not(:disabled){background:#B8B8B8}
    .vm-send:disabled{background:#8fa8be;cursor:not-allowed}
    .vm-send svg{width:18px;height:18px}

    .vm-footnote{font-size:10px;color:#8fa8be;text-align:center;padding:6px 14px 10px;background:#fff;letter-spacing:.3px}

    @media(max-width:520px){
      .vm-panel{bottom:0;right:0;left:0;width:100%;height:100%;max-height:100vh;border-radius:0}
      .vm-btn{bottom:18px;right:18px;width:58px;height:58px}
      .vm-tip{display:none}
    }
  `;

  /* ─── DOM BUILD ───────────────────────────────────────── */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    if (children) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function injectStyle() {
    if (document.getElementById('vm-style')) return;
    var s = document.createElement('style');
    s.id = 'vm-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  /* ─── MARKDOWN-LITE ───────────────────────────────────── */
  function format(text) {
    if (!text) return '';
    return text
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/```([\s\S]*?)```/g, function (_, code) { return '<pre>' + code.trim() + '</pre>'; })
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w])\*([^*\n]+)\*([^\w]|$)/g, '$1<em>$2</em>$3')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }

  /* ─── UI REFS ─────────────────────────────────────────── */
  var btn, panel, body, input, sendBtn, tip;
  var messages = loadMessages();
  var sending = false;
  var tipTimer = null;

  /* ─── RENDER MESSAGES ─────────────────────────────────── */
  function renderHistory() {
    if (!body) return;
    body.innerHTML = '';
    if (messages.length === 0) {
      renderGreeting();
      return;
    }
    messages.forEach(function (m) { renderMessage(m.role, m.content); });
    scrollBottom();
  }

  function renderGreeting() {
    var greeting = {
      role: 'assistant',
      content: "Hi — I'm Valeria. I work with Dr. Anas at LEOMAX. Tell me what you're working on — business, market entry, raising capital, anything else on your mind. مرحباً، أنا فاليريا. اشتغل مع د. أنس في ليوماكس. تكلم معاي عن أي شيء."
    };
    renderMessage('assistant', greeting.content);
    renderQuick();
  }

  function renderQuick() {
    var quick = el('div', { class: 'vm-quick' }, [
      el('button', { onclick: function () { sendQuick("I'm exploring how to enter the Saudi market"); } }, 'Enter Saudi market'),
      el('button', { onclick: function () { sendQuick("How does LEOMAX work?"); } }, 'How LEOMAX works'),
      el('button', { onclick: function () { sendQuick("أريد أعرف الفرق بين خدماتكم"); } }, 'الفرق بين الخدمات'),
      el('button', { onclick: function () { sendQuick("Can I get a free account brief?"); } }, 'Free Account Brief')
    ]);
    body.appendChild(quick);
  }

  function renderMessage(role, content) {
    var rtl = isArabic(content);
    if (role === 'user') {
      var msg = el('div', { class: 'vm-msg you' + (rtl ? ' rtl' : ''), html: format(content) });
      body.appendChild(msg);
    } else {
      // Extract action token if present (assistant messages only)
      var parsed = extractAction(content);
      var wrap = el('div', { class: 'vm-msg her' + (rtl ? ' rtl' : '') });
      wrap.appendChild(el('div', { class: 'vm-who' }, 'Valeria'));
      wrap.appendChild(el('div', { class: 'vm-bubble', html: format(parsed.text) }));
      if (parsed.action) {
        wrap.appendChild(buildActionButton(parsed.action, rtl));
      }
      body.appendChild(wrap);
    }
    scrollBottom();
  }

  /* ─── ACTION TOKEN PARSING ────────────────────────────── */
  // Matches [[CALL]], [[BRIEF]], [[WHATSAPP]], [[ADVISOR:slug]] anywhere in the text
  var ACTION_RE = /\[\[(CALL|BRIEF|WHATSAPP|ADVISOR:[a-z0-9-]+)\]\]/i;
  function extractAction(text) {
    if (!text) return { text: '', action: null };
    var match = text.match(ACTION_RE);
    if (!match) return { text: text, action: null };
    var token = match[1].toUpperCase();
    var cleaned = text.replace(ACTION_RE, '').replace(/\n{3,}/g, '\n\n').trim();
    return { text: cleaned, action: token };
  }

  // Map of advisor slugs to display names/roles
  var ADVISORS = {
    'kaya-haddad':    { name: 'Kaya Haddad',       role: 'Chief Strategy Officer' },
    'laith-darwish':  { name: 'Laith Darwish',     role: 'AI & Tech Director' },
    'hani-masry':     { name: 'Hani El Masry',     role: 'CFO' },
    'kamilia-fouad':  { name: 'Kamilia Fouad',     role: 'Marketing &amp; Brand' },
    'rami-khalidi':   { name: 'Rami Al Khalidi',   role: 'Operations Director' },
    'haya-kuwari':    { name: 'Haya Al Kuwari',    role: 'Business Development' },
    'mashari-otaibi': { name: 'Mashari Al Otaibi', role: 'Investment Director' },
    'elhanouf-harbi': { name: 'Elhanouf Al Harbi', role: 'Sustainability Director' },
    'miral-hakimi':   { name: 'Miral Al Hakimi',   role: 'Regional Expansion' },
    'yasin-sherif':   { name: 'Yasin El Sherif',   role: 'Supply Chain' },
    'rita-nasser':    { name: 'Rita Nasser',       role: 'Head of Innovation' },
    'mira-mansoori':  { name: 'Mira Al Mansoori',  role: 'Partnerships Director' },
    'dr-anas':        { name: 'Dr. Anas Elimam',   role: 'Founder &amp; CEO' }
  };

  function buildActionButton(action, rtl) {
    var ar = rtl;
    var btn;
    if (action === 'CALL') {
      btn = el('a', {
        class: 'vm-action',
        href: 'https://calendly.com/leomaxglobalsa/30min',
        target: '_blank',
        rel: 'noopener'
      });
      btn.innerHTML = '<span class="vm-action-icon">📅</span><span><span class="vm-action-meta">' +
        (ar ? 'احجز مكالمة' : 'BOOK A CALL') + '</span>' +
        (ar ? '٣٠ دقيقة مع د. أنس' : '30 minutes with Dr. Anas') + '</span>';
    } else if (action === 'BRIEF') {
      btn = el('a', { class: 'vm-action', href: 'account-brief.html' });
      btn.innerHTML = '<span class="vm-action-icon">📋</span><span><span class="vm-action-meta">' +
        (ar ? 'تقرير مجاني' : 'FREE BRIEF') + '</span>' +
        (ar ? 'احصل على Account Brief مجاناً' : 'Get an Account Brief on any KSA company') + '</span>';
    } else if (action === 'WHATSAPP') {
      btn = el('a', {
        class: 'vm-action green',
        href: 'https://wa.me/966500000000',
        target: '_blank',
        rel: 'noopener'
      });
      btn.innerHTML = '<span class="vm-action-icon">💬</span><span><span class="vm-action-meta">WHATSAPP</span>' +
        (ar ? 'كلّم أنس مباشرة' : 'Message Anas directly') + '</span>';
    } else if (action.indexOf('ADVISOR:') === 0) {
      var slug = action.slice('ADVISOR:'.length).toLowerCase();
      var advisor = ADVISORS[slug];
      if (!advisor) {
        // Unknown slug — fallback to general advisory board
        btn = el('a', { class: 'vm-action', href: 'advisory-board.html' });
        btn.innerHTML = '<span class="vm-action-icon">🎯</span><span><span class="vm-action-meta">' +
          (ar ? 'مستشار متخصص' : 'SPECIALIST') + '</span>' +
          (ar ? 'تكلّم مع Advisory Board' : 'Talk to the Advisory Board') + '</span>';
      } else {
        btn = el('a', { class: 'vm-action', href: 'advisory-board.html#' + slug });
        btn.innerHTML = '<span class="vm-action-icon">🎯</span><span><span class="vm-action-meta">' +
          (ar ? 'تكلّم مع ' + advisor.name : 'TALK TO ' + advisor.name.toUpperCase()) + '</span>' +
          advisor.role + '</span>';
      }
    } else {
      // Unknown action — render nothing
      return document.createElement('span');
    }
    // Send a high-intent report when the user clicks any action button
    btn.addEventListener('click', function () {
      maybeSendReport(action);
    });
    return btn;
  }

  function showTyping() {
    var t = el('div', { class: 'vm-typing', id: 'vm-typing' }, [el('span'), el('span'), el('span')]);
    body.appendChild(t);
    scrollBottom();
  }
  function hideTyping() {
    var t = document.getElementById('vm-typing');
    if (t) t.remove();
  }
  function scrollBottom() {
    requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
  }

  /* ─── AI CALL ─────────────────────────────────────────── */
  function callAI(history, onDone, onError) {
    if (!HAS_AI) {
      // Demo fallback — until the worker URL is set
      setTimeout(function () {
        onDone("I'm running in preview mode right now — the chat worker URL hasn't been connected yet. Once it's set in valeria.js, I'll answer everything substantively using Claude + GPT.\n\nأنا في وضع المعاينة دلوقتي — لسه ما اتربط الـ worker. بمجرد ما يتربط، هكون قادرة أجاوب على أي سؤال بعمق باستخدام Claude و GPT.");
      }, 700);
      return;
    }
    var body = {
      system: SYSTEM,
      messages: history
    };
    fetch(CHAT_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (r) { if (!r.ok) throw new Error('Worker ' + r.status); return r.json(); })
      .then(function (data) {
        if (data.error) throw new Error(data.error);
        onDone(data.reply || "Sorry — I didn't catch that. Try again?");
      })
      .catch(function (e) {
        onError(e);
      });
  }

  /* ─── SEND ────────────────────────────────────────────── */
  function send(text) {
    if (!text || !text.trim() || sending) return;
    sending = true;
    sendBtn.disabled = true;

    // Remove quick chips if present
    var q = body.querySelector('.vm-quick');
    if (q) q.remove();

    messages.push({ role: 'user', content: text });
    renderMessage('user', text);
    input.value = '';
    input.style.height = 'auto';

    showTyping();

    callAI(messages, function (reply) {
      hideTyping();
      messages.push({ role: 'assistant', content: reply });
      saveMessages(messages);
      renderMessage('assistant', reply);
      sending = false;
      sendBtn.disabled = false;
      // Send report email to Anas after meaningful exchange
      maybeSendReport(null);
    }, function (e) {
      hideTyping();
      var msg = "Something blocked the connection just now — could be the API key or network. Try again in a moment.\n\nحصل خطأ في الاتصال — يمكن المفتاح أو الشبكة. جرب مرة ثانية بعد ثانية.";
      messages.push({ role: 'assistant', content: msg });
      saveMessages(messages);
      renderMessage('assistant', msg);
      sending = false;
      sendBtn.disabled = false;
    });
  }

  function sendQuick(text) {
    input.value = text;
    send(text);
  }

  /* ─── OPEN/CLOSE ──────────────────────────────────────── */
  function open() {
    panel.classList.add('open');
    btn.style.display = 'none';
    if (tip) tip.classList.remove('show');
    setTimeout(function () { input.focus(); }, 250);
  }
  function close() {
    panel.classList.remove('open');
    btn.style.display = 'block';
  }
  function reset() {
    if (!confirm('Start a new conversation? Current chat will be cleared.')) return;
    messages = [];
    clearMessages();
    renderHistory();
  }

  /* ─── BUILD ───────────────────────────────────────────── */
  function build() {
    injectStyle();

    // Floating button
    btn = el('button', { class: 'vm-btn', 'aria-label': 'Chat with Valeria', onclick: open }, [
      el('img', { src: AVATAR_URL, alt: 'Valeria Moreno' }),
      el('span', { class: 'vm-pulse' })
    ]);
    document.body.appendChild(btn);

    // Greeting tip
    tip = el('div', { class: 'vm-tip' }, "Hi — I'm Valeria. Have a question? Tap me.");
    document.body.appendChild(tip);
    tipTimer = setTimeout(function () {
      if (panel && !panel.classList.contains('open')) tip.classList.add('show');
      setTimeout(function () { tip.classList.remove('show'); }, 6000);
    }, 3500);

    // Panel
    var headAv = el('div', { class: 'vm-av' }, [
      el('img', { src: AVATAR_URL, alt: 'Valeria' }),
      el('span', { class: 'dot' })
    ]);
    var headMeta = el('div', { class: 'vm-meta' }, [
      el('div', { class: 'vm-name' }, 'Valeria Moreno'),
      el('div', { class: 'vm-role' }, 'AI Consultant · Online')
    ]);
    var resetBtn = el('button', { class: 'vm-ctrl', title: 'New conversation', onclick: reset, html: '↻' });
    var closeBtn = el('button', { class: 'vm-ctrl', title: 'Close', onclick: close, html: '×' });
    var controls = el('div', { class: 'vm-controls' }, [resetBtn, closeBtn]);
    var head = el('div', { class: 'vm-head' }, [headAv, headMeta, controls]);

    body = el('div', { class: 'vm-body' });

    input = el('textarea', {
      class: 'vm-input',
      placeholder: 'Ask anything — business, strategy, life. اسأل أي شيء.',
      rows: 1,
      oninput: function (e) {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px';
      },
      onkeydown: function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send(input.value);
        }
      }
    });

    sendBtn = el('button', {
      class: 'vm-send',
      title: 'Send',
      onclick: function () { send(input.value); },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
    });

    var foot = el('div', { class: 'vm-foot' }, [input, sendBtn]);
    var footnote = el('div', { class: 'vm-footnote' }, HAS_AI ? 'Powered by AI · LEOMAX' : 'Preview mode · AI key not configured');

    panel = el('div', { class: 'vm-panel' }, [head, body, foot, footnote]);
    document.body.appendChild(panel);

    renderHistory();
  }

  /* ─── INIT ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  /* ─── PUBLIC API ──────────────────────────────────────── */
  window.LeomaxValeria = {
    open: function () { if (panel) open(); },
    close: function () { if (panel) close(); },
    reset: function () { messages = []; clearMessages(); renderHistory(); },
    send: function (text) { if (panel) { open(); setTimeout(function () { send(text); }, 350); } }
  };

})();
