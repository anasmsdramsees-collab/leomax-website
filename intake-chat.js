/* ============================================================
   LEOMAX — Homepage Intake Chat v2
   Real AI conversation powered by Groq (free, browser CORS supported).
   Streams responses like ChatGPT. Routes to the right advisor
   naturally after understanding the visitor's situation.

   SETUP: Get a free key at console.groq.com (no credit card).
          Replace YOUR_GROQ_API_KEY_HERE below.
   ============================================================ */

(function () {
  'use strict';

  /* ─── CONFIG ──────────────────────────────────────────── */
  var GROQ_KEY   = 'YOUR_GROQ_API_KEY_HERE';
  var GROQ_MODEL = 'llama-3.3-70b-versatile';
  var GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
  var HAS_AI     = GROQ_KEY && GROQ_KEY !== 'YOUR_GROQ_API_KEY_HERE';

  var BASE_IMG = 'https://anasmsdramsees-collab.github.io/leomax-website/team/';

  /* ─── SYSTEM PROMPT ───────────────────────────────────── */
  var SYSTEM = 'You are a senior business consultant working the intake chat on the LEOMAX website. LEOMAX is a premium Saudi consulting firm that deploys complete business systems inside companies in 90 days — covering growth, AI, marketing, operations, and finance.\n\nYour job: have a genuine, intelligent business conversation. Be knowledgeable, direct, and warm. Listen carefully. Ask one focused follow-up question per turn. After 2 to 3 exchanges where you understand their situation well, naturally route them to the right LEOMAX advisor by placing [[ROUTE:slug]] at the very end of your response — nothing after it.\n\nLEOMAX Advisors (use these exact slugs):\n- kaya-haddad: Kaya Haddad, Chief Strategy Officer — strategy, competitive positioning, planning, market direction, restructuring\n- laith-darwish: Laith Darwish, AI & Technology Director — AI integration, automation, software, digital transformation, tech stack, ERP, CRM\n- hani-masry: Hani El Masry, Chief Financial Officer — finance, cash flow, budgeting, financial modeling, burn rate, unit economics\n- kamilia-fouad: Kamilia Fouad, Marketing & Brand Director — marketing, brand identity, campaigns, social media, content, positioning, SEO\n- rami-khalidi: Rami Al Khalidi, Operations Director — operations, processes, team structure, efficiency, SOPs, hiring, org design\n- haya-kuwari: Haya Al Kuwari, Business Development Lead — sales, pipeline, B2B, new clients, deal flow, lead generation\n- mashari-otaibi: Mashari Al Otaibi, Investment Director — funding, investors, valuation, pitch deck, capital raising, M&A\n- elhanouf-harbi: Elhanouf Al Harbi, Sustainability Director — ESG, sustainability reporting, compliance, Vision 2030, green frameworks\n- miral-hakimi: Miral Al Hakimi, Regional Expansion Lead — expansion, new markets, GCC entry, licensing, international, cross-border\n- yasin-sherif: Yasin El Sherif, Supply Chain Director — supply chain, logistics, procurement, inventory, sourcing, fulfillment\n- rita-nasser: Rita Nasser, Head of Innovation — innovation, new products, R&D, MVP, product development, market fit\n- mira-mansoori: Mira Al Mansoori, Partnerships Director — partnerships, alliances, joint ventures, MOU, distribution channels\n- dr-anas: Dr. Anas Elimam, Founder & CEO — overall LEOMAX approach, where to start, multiple areas at once, complex transformations\n\nStrict rules:\n1. Respond in the SAME language the user writes in. Arabic input gets Arabic response. English input gets English response.\n2. No emojis. Professional, direct, warm tone.\n3. Keep every response SHORT — 2 to 3 sentences maximum, then one question.\n4. Do not route on the first message. Understand the situation first across 1 to 2 exchanges.\n5. When ready to route, place [[ROUTE:slug]] at the very end of your message. Nothing after it.\n6. You are a LEOMAX consultant. Do not mention AI models, ChatGPT, Claude, or Groq.\n7. If they say hi or hello, welcome them briefly and ask what business challenge they are working on.\n8. You can answer any business question substantively.\n9. Never ask more than one question per turn.';

  /* ─── ADVISOR MAP ─────────────────────────────────────── */
  var ADVISORS = {
    'kaya-haddad':    { name: 'Kaya Haddad',       role: 'Chief Strategy Officer' },
    'laith-darwish':  { name: 'Laith Darwish',      role: 'AI & Technology Director' },
    'hani-masry':     { name: 'Hani El Masry',      role: 'Chief Financial Officer' },
    'kamilia-fouad':  { name: 'Kamilia Fouad',      role: 'Marketing & Brand Director' },
    'rami-khalidi':   { name: 'Rami Al Khalidi',    role: 'Operations Director' },
    'haya-kuwari':    { name: 'Haya Al Kuwari',     role: 'Business Development Lead' },
    'mashari-otaibi': { name: 'Mashari Al Otaibi',  role: 'Investment Director' },
    'elhanouf-harbi': { name: 'Elhanouf Al Harbi',  role: 'Sustainability Director' },
    'miral-hakimi':   { name: 'Miral Al Hakimi',    role: 'Regional Expansion Lead' },
    'yasin-sherif':   { name: 'Yasin El Sherif',    role: 'Supply Chain Director' },
    'rita-nasser':    { name: 'Rita Nasser',         role: 'Head of Innovation' },
    'mira-mansoori':  { name: 'Mira Al Mansoori',   role: 'Partnerships Director' },
    'dr-anas':        { name: 'Dr. Anas Elimam',    role: 'Founder & CEO' }
  };

  /* ─── SCRIPTED FALLBACK ROUTES (used when no API key) ─── */
  var ROUTES = [
    { slug: 'laith-darwish',
      keys: ['ai','artificial intelligence','machine learning','automation','software','tech','digital','data','chatbot','system','algorithm','tool','platform','erp','crm','digital transformation'],
      reply: 'Technology decisions made at the wrong stage cost businesses far more than they save. Before recommending any tool or platform, the right question is: what process problem are you actually solving? What does your current tech stack look like?' },
    { slug: 'kamilia-fouad',
      keys: ['marketing','brand','content','social media','awareness','positioning','identity','audience','campaign','ad','advertising','instagram','tiktok','seo','email','creative','design'],
      reply: 'Most marketing problems are brand problems in disguise — unclear positioning, inconsistent message, or the wrong audience definition. Where do you feel the biggest gap right now: brand clarity, channel execution, or knowing who you are targeting?' },
    { slug: 'hani-masry',
      keys: ['finance','financial','cash flow','profit','revenue','cost','budget','accounting','tax','vat','burn rate','runway','forecast','cfo','money','capital','loan','debt','margin'],
      reply: 'Financial clarity is not just about the numbers — it is about knowing what the numbers are telling you before your bank account does. Is the issue understanding your current financial position, or planning ahead for growth?' },
    { slug: 'haya-kuwari',
      keys: ['business development','clients','new clients','pipeline','leads','prospecting','sales pipeline','market entry','b2b','deals','closing','rfp','tender','enterprise'],
      reply: 'Business development is about building relationships that turn into consistent revenue, not chasing individual deals. How structured is your current pipeline — do you have a repeatable process for moving prospects forward?' },
    { slug: 'rami-khalidi',
      keys: ['operations','processes','efficiency','workflow','bottleneck','team','hr','hiring','structure','org','organization','productivity','sop','procedure','management','staff','employee'],
      reply: 'Operational problems tend to compound quietly until they become expensive. Where is the friction most visible right now — in team coordination, process consistency, or the time it takes to get things done?' },
    { slug: 'rita-nasser',
      keys: ['innovation','new product','product development','r&d','research','prototype','idea','startup','pivot','launch','market fit','mvp','venture'],
      reply: 'Innovation without a clear connection to the business model tends to produce interesting ideas that never ship. Are you in the ideation phase, trying to validate a concept, or trying to accelerate a product that already exists?' },
    { slug: 'mashari-otaibi',
      keys: ['investment','funding','investor','equity','valuation','raise','series','seed','venture capital','vc','pitch','deck','due diligence','acquisition','shareholder','stake','return','roi'],
      reply: 'Investor relationships are built on confidence — in the model, the team, and the numbers. Are you preparing for a first raise, a follow-on round, or exploring strategic acquisition?' },
    { slug: 'elhanouf-harbi',
      keys: ['sustainability','esg','environment','green','carbon','emission','csr','social responsibility','climate','renewable','waste','circular','reporting','gri','sdg','vision 2030','compliance'],
      reply: 'Sustainability is moving from a voluntary commitment to a business requirement — driven by regulation, investor expectations, and competitive positioning. Are you starting from scratch on ESG, or trying to improve existing reporting?' },
    { slug: 'mira-mansoori',
      keys: ['partnership','alliance','collaboration','joint venture','agreement','mou','supplier','vendor','distribution','channel','strategic partner','network','ecosystem'],
      reply: 'The right partnership can accelerate a business faster than almost any internal investment. What kind of partnership are you exploring — distribution, joint ventures, or strategic alliances?' },
    { slug: 'miral-hakimi',
      keys: ['expansion','new market','international','gcc','saudi','uae','qatar','kuwait','bahrain','oman','egypt','regional','market entry','cross border','license','entity','branch','franchise'],
      reply: 'Entering a new market without proper groundwork produces the same outcome every time — initial traction that does not hold. Which market are you targeting, and how much groundwork has already been done?' },
    { slug: 'yasin-sherif',
      keys: ['supply chain','logistics','procurement','inventory','warehouse','shipping','delivery','supplier','import','export','stock','fulfillment','sourcing','manufacturing'],
      reply: 'Supply chain problems are often invisible until they become crises. Is the issue on the procurement side, inventory management, or last-mile delivery and fulfillment?' },
    { slug: 'kaya-haddad',
      keys: ['strategy','strategic','planning','direction','vision','goal','objective','competitive','positioning','market share','growth strategy','roadmap','transformation','restructure','turnaround'],
      reply: 'Strategy is not a document — it is the set of choices a business makes about where to compete and how to win. What does the competitive landscape look like for you right now, and where do you feel the business is losing ground?' },
    { slug: 'dr-anas',
      keys: ['leomax','what do you do','how do you work','your services','your approach','your team','overall','general','everything','start','where to start','help me'],
      reply: 'LEOMAX builds and deploys complete business systems — growth, AI, marketing, content, and launch — directly inside the business, typically within 90 days. The starting point is always an honest assessment of where the real constraints are. What does the business look like today?' }
  ];

  var FALLBACK = {
    slug: 'kaya-haddad',
    reply: 'Every business challenge connects to a few core questions: what is the actual problem, what does solving it require, and what is the right order of operations. Can you tell me more about the situation — what are you trying to fix or build?'
  };

  function detectRoute(text) {
    var lower = text.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < ROUTES.length; i++) {
      var r = ROUTES[i];
      var score = r.keys.filter(function (k) { return lower.indexOf(k) !== -1; }).length;
      if (score > bestScore) { bestScore = score; best = r; }
    }
    return best || FALLBACK;
  }

  /* ─── CSS ─────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#lm-intake{width:100%;max-width:640px;margin:28px auto 0;position:relative;z-index:2}',

    '#lm-intake-bar{display:flex;align-items:flex-end;background:rgba(255,255,255,.04);border:1px solid rgba(184,184,184,.2);border-radius:16px;overflow:hidden;transition:border-color .2s,box-shadow .2s}',
    '#lm-intake-bar:focus-within{border-color:rgba(184,184,184,.45);box-shadow:0 0 0 3px rgba(184,184,184,.06)}',

    '#lm-intake-input{flex:1;background:transparent;border:none;color:#fff;padding:14px 18px;font-size:14px;outline:none;font-family:inherit;caret-color:#B8B8B8;resize:none;overflow-y:auto;line-height:1.55;min-height:50px;max-height:140px;scrollbar-width:thin;scrollbar-color:rgba(184,184,184,.12) transparent}',
    '#lm-intake-input::placeholder{color:rgba(184,184,184,.32)}',

    '#lm-intake-btn{background:transparent;border:none;border-left:1px solid rgba(184,184,184,.1);color:#B8B8B8;width:52px;min-height:50px;cursor:pointer;font-size:17px;transition:.18s;flex-shrink:0;display:flex;align-items:center;justify-content:center;align-self:stretch}',
    '#lm-intake-btn:hover:not(:disabled){background:rgba(184,184,184,.08);color:#fff}',
    '#lm-intake-btn:disabled{opacity:.35;cursor:default}',

    '#lm-intake-hint{text-align:center;font-size:11px;color:rgba(184,184,184,.25);margin-top:9px;letter-spacing:.5px}',

    '#lm-intake-conv{margin-top:12px;background:rgba(5,12,24,.96);border:1px solid rgba(184,184,184,.1);border-radius:16px;overflow:hidden;max-height:0;opacity:0;transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .28s ease}',
    '#lm-intake-conv.open{max-height:520px;opacity:1}',

    '#lm-intake-msgs{padding:18px 18px 14px;display:flex;flex-direction:column;gap:12px;max-height:370px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(184,184,184,.08) transparent}',

    '.lm-in-row-user{display:flex;justify-content:flex-end}',
    '.lm-in-row-bot{display:flex;gap:8px;align-items:flex-end}',

    '.lm-in-bubble{font-size:13.5px;line-height:1.72;padding:10px 14px;word-break:break-word;max-width:88%}',
    '.lm-in-bubble.user{background:rgba(27,49,84,.85);color:#DDE8F5;border-radius:18px 18px 4px 18px;border:1px solid rgba(100,150,220,.14)}',
    '.lm-in-bubble.bot{background:#0D1929;color:#C0D0E0;border-radius:4px 18px 18px 18px;border:1px solid rgba(184,184,184,.07)}',

    '.lm-cursor{display:inline-block;width:2px;height:13px;background:#5A8AB8;vertical-align:middle;margin-left:2px;animation:lm-blink .7s step-end infinite}',
    '@keyframes lm-blink{0%,100%{opacity:1}50%{opacity:0}}',

    '.lm-in-icon{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#162840,#0A1828);border:1px solid rgba(184,184,184,.14);display:flex;align-items:center;justify-content:center;font-size:9px;color:#5A7A9A;flex-shrink:0;font-weight:700;letter-spacing:.5px}',

    '.lm-in-typing-row{display:flex;gap:8px;align-items:flex-end}',
    '.lm-in-typing{padding:10px 14px;background:#0D1929;border:1px solid rgba(184,184,184,.07);border-radius:4px 18px 18px 18px;display:flex;gap:4px;align-items:center}',
    '.lm-in-dot{width:5px;height:5px;background:#2A4060;border-radius:50%;animation:lm-bounce .85s ease-in-out infinite}',
    '.lm-in-dot:nth-child(2){animation-delay:.14s}',
    '.lm-in-dot:nth-child(3){animation-delay:.28s}',
    '@keyframes lm-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',

    '.lm-in-divider{height:1px;background:rgba(184,184,184,.07)}',
    '.lm-in-card{padding:14px 18px;display:flex;align-items:center;gap:12px;background:rgba(10,18,34,.7)}',
    '.lm-in-card-avatar{width:38px;height:38px;border-radius:50%;object-fit:cover;object-position:top center;border:1px solid rgba(184,184,184,.16);flex-shrink:0}',
    '.lm-in-card-info{flex:1;min-width:0}',
    '.lm-in-card-name{font-size:13px;font-weight:700;color:#fff}',
    '.lm-in-card-role{font-size:10.5px;color:#4A6A88;margin-top:2px}',
    '.lm-in-card-btn{flex-shrink:0;padding:8px 16px;background:#B8B8B8;color:#010B1C;border:none;border-radius:8px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:.18s}',
    '.lm-in-card-btn:hover{background:#fff}'
  ].join('\n');
  document.head.appendChild(style);

  /* ─── INJECT HTML ─────────────────────────────────────── */
  function inject() {
    var scrollHint = document.querySelector('.scroll-hint');
    if (!scrollHint) return;

    var wrap = document.createElement('div');
    wrap.id = 'lm-intake';
    wrap.innerHTML =
      '<div id="lm-intake-bar">' +
        '<textarea id="lm-intake-input" placeholder="اسألني أي شيء في عملك\u2026 / Ask me anything about your business\u2026" rows="1" autocomplete="off" spellcheck="false"></textarea>' +
        '<button id="lm-intake-btn" aria-label="Send">&#10148;</button>' +
      '</div>' +
      '<p id="lm-intake-hint">Strategy \xb7 Finance \xb7 Marketing \xb7 AI \xb7 Operations \xb7 Growth</p>' +
      '<div id="lm-intake-conv"><div id="lm-intake-msgs"></div></div>';

    scrollHint.parentNode.insertBefore(wrap, scrollHint);

    document.getElementById('lm-intake-btn').addEventListener('click', submit);
    document.getElementById('lm-intake-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });
    document.getElementById('lm-intake-input').addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 140) + 'px';
    });
  }

  /* ─── STATE ───────────────────────────────────────────── */
  var conversation  = [];
  var routed        = false;
  var sending       = false;
  var scriptedTurn  = 0;
  var scriptedSlug  = null;

  /* ─── SUBMIT ──────────────────────────────────────────── */
  function submit() {
    if (sending) return;
    var inp  = document.getElementById('lm-intake-input');
    var text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    inp.style.height = '';

    openConv();
    addUser(text);
    conversation.push({ role: 'user', content: text });
    setBtnDisabled(true);
    sending = true;

    if (HAS_AI) {
      streamResponse();
    } else {
      scriptedResponse(text);
    }
  }

  /* ─── GROQ STREAMING ──────────────────────────────────── */
  function streamResponse() {
    var bubble = createBotBubble();
    var cursor = document.createElement('span');
    cursor.className = 'lm-cursor';
    bubble.appendChild(cursor);
    scroll();

    var fullText = '';
    var msgs = [{ role: 'system', content: SYSTEM }].concat(conversation);

    fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: msgs,
        stream: true,
        max_tokens: 300,
        temperature: 0.68
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var reader  = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer  = '';

      function pump() {
        return reader.read().then(function (result) {
          if (result.done) {
            finalise(bubble, cursor, fullText);
            return;
          }
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.indexOf('data: ') !== 0) continue;
            var data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              var parsed = JSON.parse(data);
              var token  = (parsed.choices[0].delta && parsed.choices[0].delta.content) || '';
              if (!token) continue;
              fullText += token;
              cursor.remove();
              bubble.innerHTML = fmt(esc(stripRoute(fullText)));
              bubble.appendChild(cursor);
              scroll();
            } catch (e) { /* malformed chunk, skip */ }
          }
          return pump();
        });
      }
      return pump();
    })
    .catch(function () {
      cursor.remove();
      bubble.innerHTML = 'Having trouble connecting right now. Please try again.';
      finishSend();
    });
  }

  function finalise(bubble, cursor, fullText) {
    cursor.remove();
    var clean = stripRoute(fullText).trim();
    bubble.innerHTML = fmt(esc(clean));
    scroll();
    conversation.push({ role: 'assistant', content: fullText });

    var match = fullText.match(/\[\[ROUTE:([a-z0-9-]+)\]\]/);
    if (match && !routed) {
      routed = true;
      var slug = match[1];
      setTimeout(function () { showAdvisorCard(slug); }, 380);
    }
    finishSend();
  }

  function stripRoute(text) {
    return text.replace(/\[\[ROUTE:[^\]]+\]\]/g, '');
  }

  /* ─── SCRIPTED FALLBACK ───────────────────────────────── */
  function scriptedResponse(text) {
    showTyping();
    var delay = 800 + Math.random() * 500;

    setTimeout(function () {
      hideTyping();
      var ar    = isArabic(text);
      var lower = text.toLowerCase();
      scriptedTurn++;

      if (scriptedTurn === 1 && /^(hi|hello|hey|سلام|مرحبا|اهلا|أهلاً|هلا|هلو|صباح|مساء|كيف)/.test(lower.trim())) {
        addBot(ar
          ? 'أهلاً بك. ما التحدي الذي تعمل على حله في شركتك الآن؟'
          : 'Welcome. What business challenge are you working through right now?');
        finishSend();
        return;
      }

      var route = detectRoute(text);
      scriptedSlug = route.slug;

      if (scriptedTurn === 1) {
        addBot(route.reply);
      } else if (!routed) {
        routed = true;
        addBot(ar
          ? 'بناءً على ما ذكرته، الشخص الأنسب في فريقنا لمناقشة هذا بعمق:'
          : 'Based on what you have shared, here is the right person on our team for this:');
        setTimeout(function () { showAdvisorCard(scriptedSlug || 'kaya-haddad'); }, 450);
      } else {
        addBot(ar
          ? 'هل هناك جانب آخر تريد مناقشته قبل أن نتواصل؟'
          : 'Is there anything else you want to cover before we connect you?');
      }
      finishSend();
    }, delay);
  }

  /* ─── UI HELPERS ──────────────────────────────────────── */
  function openConv() {
    document.getElementById('lm-intake-conv').classList.add('open');
  }

  function getMsgs() { return document.getElementById('lm-intake-msgs'); }

  function scroll() { var m = getMsgs(); m.scrollTop = m.scrollHeight; }

  function addUser(text) {
    var row = document.createElement('div');
    row.className = 'lm-in-row-user';
    var bub = document.createElement('div');
    bub.className = 'lm-in-bubble user';
    bub.innerHTML = fmt(esc(text));
    row.appendChild(bub);
    getMsgs().appendChild(row);
    scroll();
  }

  function createBotBubble() {
    var row  = document.createElement('div');
    row.className = 'lm-in-row-bot';
    var icon = document.createElement('div');
    icon.className = 'lm-in-icon';
    icon.textContent = 'LM';
    var bub = document.createElement('div');
    bub.className = 'lm-in-bubble bot';
    row.appendChild(icon);
    row.appendChild(bub);
    getMsgs().appendChild(row);
    scroll();
    return bub;
  }

  function addBot(text) {
    var bub = createBotBubble();
    bub.innerHTML = fmt(esc(text));
  }

  function showTyping() {
    var row = document.createElement('div');
    row.id  = 'lm-in-typing';
    row.className = 'lm-in-typing-row';
    row.innerHTML =
      '<div class="lm-in-icon">LM</div>' +
      '<div class="lm-in-typing">' +
        '<div class="lm-in-dot"></div>' +
        '<div class="lm-in-dot"></div>' +
        '<div class="lm-in-dot"></div>' +
      '</div>';
    getMsgs().appendChild(row);
    scroll();
  }

  function hideTyping() {
    var el = document.getElementById('lm-in-typing');
    if (el) el.remove();
  }

  function showAdvisorCard(slug) {
    var advisor = ADVISORS[slug] || ADVISORS['kaya-haddad'];
    var conv = document.getElementById('lm-intake-conv');
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="lm-in-divider"></div>' +
      '<div class="lm-in-card">' +
        '<img class="lm-in-card-avatar" src="' + BASE_IMG + slug + '.png" alt="' + esc(advisor.name) + '">' +
        '<div class="lm-in-card-info">' +
          '<div class="lm-in-card-name">' + esc(advisor.name) + '</div>' +
          '<div class="lm-in-card-role">' + esc(advisor.role) + '</div>' +
        '</div>' +
        '<button class="lm-in-card-btn" onclick="window.LMChat && window.LMChat.open(\'' + slug + '\')">Chat now</button>' +
      '</div>';
    conv.appendChild(wrap);
    conv.style.maxHeight = (conv.scrollHeight + 120) + 'px';
    scroll();
  }

  function setBtnDisabled(v) {
    var btn = document.getElementById('lm-intake-btn');
    if (btn) btn.disabled = v;
  }

  function finishSend() {
    sending = false;
    setBtnDisabled(false);
    var inp = document.getElementById('lm-intake-input');
    if (inp) inp.focus();
  }

  function isArabic(text) { return /[\u0600-\u06FF]/.test(text); }

  function fmt(t) { return String(t).replace(/\n/g, '<br>'); }

  function esc(t) {
    return String(t)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ─── INIT ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
