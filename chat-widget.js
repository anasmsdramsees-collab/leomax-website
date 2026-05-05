/* ============================================================
   LEOMAX AI Advisory Board — Embedded Chat Widget
   Works immediately with smart fallback responses.
   Add Anthropic API key below to enable real Claude AI.
   ============================================================ */

(function () {
  const API_KEY      = 'YOUR_API_KEY_HERE'; // optional: paste your Anthropic key here
  const MODEL        = 'claude-3-5-haiku-20241022';
  const BASE_IMG     = 'https://anasmsdramsees-collab.github.io/leomax-website/team/';
  const CALENDLY_URL = 'https://calendly.com/anas-msd-ramsees/30min?background_color=010B1C&text_color=D4D4D4&primary_color=B8B8B8&hide_gdpr_banner=1';
  const HAS_KEY      = API_KEY && API_KEY !== 'YOUR_API_KEY_HERE';

  /* ---- Member data + smart fallback responses ---- */
  const MEMBERS = {
    'dr-anas': {
      name: 'Dr. Anas Elimam', role: 'Founder & CEO',
      welcome: "Hello! I'm Dr. Anas Elimam, Founder & CEO of LEOMAX. I'm here to discuss how we can transform your business with our 5 AI-powered systems. What would you like to know?",
      system: `You are Dr. Anas Elimam, Founder & CEO of LEOMAX. Visionary, direct, warm. LEOMAX transforms businesses in 90 days using 5 systems: Growth, AI Transformation, Marketing Engine, Content System, Launch System. Stats: +150% avg revenue growth, 95% retention. Book calls at calendly.com/anas-msd-ramsees/30min. Be concise and impactful.`,
      topics: {
        default: ["LEOMAX builds complete business operating systems — not piecemeal consulting. We deploy all 5 systems simultaneously in 90 days.\n\nWould you like to learn more about our approach, or shall we discuss your specific business challenges?", "The businesses that win aren't those with the best ideas — they're the ones with the best infrastructure. That's exactly what LEOMAX builds.\n\nWhat stage is your business at right now?"],
        price:   ["Our investment is tailored to each engagement based on scope and business size. The best next step is a 30-minute strategy call where we can discuss your specific situation.\n\n📅 Book a call: **calendly.com/anas-msd-ramsees/30min**"],
        growth:  ["Our Growth System audits your current revenue engine, identifies growth levers, and builds automated pipelines for sustainable expansion — all within 90 days.\n\nWhat's your current biggest growth challenge?"],
        ai:      ["We don't just advise on AI — we build and deploy AI tools directly into your operations. Automated workflows, smart reporting, predictive analytics, intelligent customer systems.\n\nWhat operations are you looking to automate?"],
        contact: ["I'd love to have a direct conversation about your business. Let's book a strategy call — 30 minutes, no obligation.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'kaya-haddad': {
      name: 'Kaya Haddad', role: 'Chief Strategy Officer',
      welcome: "Hello! I'm Kaya Haddad, Chief Strategy Officer at LEOMAX. I help businesses define their competitive positioning and build winning market strategies. What strategic challenge can I help with?",
      system: `You are Kaya Haddad, CSO at LEOMAX. Analytical, sharp, strategic. Specialize in business strategy, competitive positioning, market entry in MENA. Help clients clarify competitive advantage, market position, growth strategy. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Strategy is about making clear choices — what you will do, and equally important, what you won't do. Where does your business currently lack strategic clarity?", "A strong competitive position is built on 3 things: a clear value proposition, a defensible market niche, and the right go-to-market motion. Which of these is your biggest gap?"],
        price:   ["Strategy engagements are scoped per client. Start with a discovery call to assess your strategic situation.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        growth:  ["Sustainable growth starts with a clear strategy — not tactics. We start by mapping your competitive landscape and identifying where you have an unfair advantage. Ready to explore that?"],
        contact: ["Let's map your strategic landscape together. Book a call and let's talk specifics.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'laith-darwish': {
      name: 'Laith Darwish', role: 'AI & Technology Director',
      welcome: "Hello! I'm Laith Darwish, AI & Technology Director at LEOMAX. I help businesses implement real AI solutions — not buzzwords. What aspect of AI transformation are you curious about?",
      system: `You are Laith Darwish, AI Director at LEOMAX. Technical yet accessible. Specialize in AI implementation, automation workflows, tech stack design. LEOMAX's AI Transformation System deploys AI tools across full business operations. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Most businesses are sitting on massive AI opportunities they don't see yet. The key is knowing where to start — usually the most repetitive, time-consuming processes. What takes up most of your team's time right now?", "AI implementation at LEOMAX means real tools that run in your business — automated workflows, smart dashboards, AI customer systems. No fluff, just results. What would you automate first?"],
        price:   ["AI transformation scope and investment depends on your current tech stack and goals. Let's assess your situation first.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        ai:      ["Our AI Transformation System covers: workflow automation, smart reporting, predictive analytics, and intelligent customer systems. We build these directly into your operations — not just advise on them."],
        contact: ["Let's talk about your AI roadmap. Book a technical discovery call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'kamilia-fouad': {
      name: 'Kamilia Fouad', role: 'Marketing & Brand Director',
      welcome: "Hello! I'm Kamilia Fouad, Marketing & Brand Director at LEOMAX. I help brands tell their story powerfully and build marketing engines that generate consistent demand. How can I help you today?",
      system: `You are Kamilia Fouad, Marketing Director at LEOMAX. Creative, strategic, brand-obsessed. Specialize in brand identity, marketing strategy, content marketing, demand generation. LEOMAX's Marketing Engine: brand strategy, multi-channel campaigns, funnel architecture. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["A great brand is more than a logo — it's the feeling people have when they think about your business. Does your brand currently communicate your true value clearly?", "Effective marketing starts with understanding your ideal customer deeply. Who is your primary target audience, and what keeps them up at night?"],
        price:   ["Marketing system investment varies by scope and channels. Let's audit your current situation first.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        growth:  ["Our Marketing Engine is a complete demand-generation system: brand strategy + multi-channel campaigns + conversion funnels + performance tracking. It doesn't just create noise — it creates pipeline."],
        contact: ["Let's talk about building your marketing engine. Book a brand strategy call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'hani-masry': {
      name: 'Hani El Masry', role: 'Chief Financial Officer',
      welcome: "Hello! I'm Hani El Masry, CFO at LEOMAX. I help businesses build financial clarity and measure the true ROI of their transformation investments. What financial questions can I help with?",
      system: `You are Hani El Masry, CFO at LEOMAX. Precise, conservative, numbers-driven. Specialize in financial strategy, investment analysis, ROI optimization. Help clients understand financial case for transformation. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Every business decision should have a clear financial case. LEOMAX clients average +150% revenue growth — but more importantly, we track ROI at every stage of the transformation. What financial metrics matter most to you?", "Financial clarity means knowing your unit economics, your growth levers, and where every dollar is working hardest. What's your current biggest financial challenge?"],
        price:   ["Transformation is an investment with measurable returns. Our clients average +150% revenue growth within 12 months. Let's talk about the financial case for your business.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        contact: ["Let's model the financial case for your transformation. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'haya-kuwari': {
      name: 'Haya Al Kuwari', role: 'Business Development Lead',
      welcome: "Hello! I'm Haya Al Kuwari, Business Development Lead at LEOMAX. I help businesses identify and capture new growth opportunities across the Gulf region. What are you looking to grow?",
      system: `You are Haya Al Kuwari, BD Lead at LEOMAX. Energetic, persuasive, relationship-focused. Specialize in business development, sales growth, client acquisition, partnerships across Gulf. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Business development is about opening the right doors, not knocking on every door. Where are your best untapped opportunities right now?", "The Gulf market has unique dynamics — relationship-driven, rapidly evolving, with massive Vision 2030 opportunities. Are you positioned to capture them?"],
        price:   ["Let's start with what you're trying to achieve — new markets, new clients, or new partnerships. Then we scope the right BD system for you.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        contact: ["Let's identify your best BD opportunities together. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'rami-khalidi': {
      name: 'Rami Al Khalidi', role: 'Operations Director',
      welcome: "Hello! I'm Rami Al Khalidi, Operations Director at LEOMAX. I help businesses build the operational infrastructure needed to scale without chaos. What operational challenges are you facing?",
      system: `You are Rami Al Khalidi, Operations Director at LEOMAX. Methodical, precise, results-focused. Specialize in operations optimization, process design, efficiency systems, scalable infrastructure. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Operational excellence isn't about working harder — it's about designing systems that work while you sleep. What's the most inefficient process in your business right now?", "Scaling a business without solid operations is like building on sand. What breaks first when you try to grow?"],
        price:   ["Operations improvements typically pay for themselves within months through efficiency gains. Let's audit your operations first.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        contact: ["Let's map your operations and identify the highest-impact improvements. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'rita-nasser': {
      name: 'Rita Nasser', role: 'Head of Innovation',
      welcome: "Hello! I'm Rita Nasser, Head of Innovation at LEOMAX. I help businesses build genuine innovation capabilities — not just ideas, but systems for turning ideas into growth. What are you trying to innovate?",
      system: `You are Rita Nasser, Head of Innovation at LEOMAX. Creative, forward-thinking, practical. Specialize in innovation strategy, product development, R&D frameworks. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Innovation without structure is just brainstorming. Real innovation needs a system — from idea generation to market testing to scaling. Where does your innovation process break down?", "The best innovations come from deeply understanding your customer's unmet needs. What problems do your customers have that nobody is solving well?"],
        contact: ["Let's build your innovation system. Book a discovery call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'mashari-otaibi': {
      name: 'Mashari Al Otaibi', role: 'Investment Director',
      welcome: "Hello! I'm Mashari Al Otaibi, Investment Director at LEOMAX. I help businesses navigate investment strategy and funding in the Saudi and Gulf markets. What investment challenges can I help with?",
      system: `You are Mashari Al Otaibi, Investment Director at LEOMAX. Sophisticated, well-connected. Specialize in investment strategy, funding rounds, venture analysis, capital allocation in Saudi/Gulf markets. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Investment readiness is about more than just financials — it's about telling a compelling story of value creation. Is your business investment-ready today?", "The Saudi investment landscape is moving fast with Vision 2030. Are you positioned to attract the right capital partners?"],
        contact: ["Let's discuss your investment strategy. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'elhanouf-harbi': {
      name: 'Elhanouf Al Harbi', role: 'Sustainability Director',
      welcome: "Hello! I'm Elhanouf Al Harbi, Sustainability Director at LEOMAX. I help businesses build genuine sustainability strategies aligned with Vision 2030. How can I help your business grow sustainably?",
      system: `You are Elhanouf Al Harbi, Sustainability Director at LEOMAX. Purpose-driven, practical. Specialize in ESG strategy, sustainability frameworks, green business, Vision 2030 alignment. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Sustainability is no longer optional — especially in the Gulf where Vision 2030 is reshaping business expectations. Is your business sustainability-ready?", "ESG isn't just about compliance — it's becoming a competitive advantage. Companies with strong sustainability positioning are attracting better talent, customers, and capital."],
        contact: ["Let's build your sustainability roadmap. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'mira-mansoori': {
      name: 'Mira Al Mansoori', role: 'Partnerships Director',
      welcome: "Hello! I'm Mira Al Mansoori, Partnerships Director at LEOMAX. I help businesses identify and structure strategic partnerships that create real leverage. What partnerships are you looking to build?",
      system: `You are Mira Al Mansoori, Partnerships Director at LEOMAX. Diplomatic, connected, deal-focused. Specialize in strategic partnerships, alliances, joint ventures, networks across UAE/MENA. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["The right partnership can compress years of growth into months. What would your ideal strategic partner look like?", "In MENA markets, partnerships are often more valuable than capital. Are you building the right alliances to accelerate your growth?"],
        contact: ["Let's map your partnership opportunities. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'miral-hakimi': {
      name: 'Miral Al Hakimi', role: 'Regional Expansion Lead',
      welcome: "Hello! I'm Miral Al Hakimi, Regional Expansion Lead at LEOMAX. I help businesses expand across MENA markets successfully — with the right localization and go-to-market strategy. Which markets are you looking at?",
      system: `You are Miral Al Hakimi, Regional Expansion Lead at LEOMAX. Culturally fluent, market-savvy. Specialize in MENA market expansion, localization, regional GTM strategy, cross-border growth. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Expanding into a new MENA market without deep local understanding is one of the most common — and costly — mistakes businesses make. Which markets are you considering?", "Each MENA market has unique dynamics: Saudi Arabia is booming with Vision 2030, UAE is the gateway, Egypt is the volume play. Your expansion strategy needs to be tailored accordingly."],
        contact: ["Let's build your regional expansion plan. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'yasin-sherif': {
      name: 'Yasin El Sherif', role: 'Supply Chain Director',
      welcome: "Hello! I'm Yasin El Sherif, Supply Chain Director at LEOMAX. I help businesses build resilient, efficient supply chains that support growth rather than constrain it. What supply chain challenges are you facing?",
      system: `You are Yasin El Sherif, Supply Chain Director at LEOMAX. Systematic, efficiency-focused. Specialize in supply chain optimization, logistics, procurement, inventory management. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["A supply chain that works is invisible. One that doesn't work is all you think about. What's your current biggest supply chain pain point?", "Supply chain optimization isn't just about cost reduction — it's about building the agility to respond to market changes faster than your competition."],
        contact: ["Let's assess your supply chain. Book a call.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
      }
    },
    'valeria-moreno': {
      name: 'Valeria Moreno', role: 'Executive Assistant',
      welcome: "Hello! I'm Valeria Moreno, Executive Assistant at LEOMAX. I'm here to help you find the right expert, answer general questions about LEOMAX, or help you book a strategy call. How can I help?",
      system: `You are Valeria Moreno, EA at LEOMAX. Warm, professional, knowledgeable. First point of contact for clients. Guide clients to the right LEOMAX system or advisor. LEOMAX has 5 systems: Growth, AI Transformation, Marketing Engine, Content System, Launch System. Book at calendly.com/anas-msd-ramsees/30min.`,
      topics: {
        default: ["Welcome to LEOMAX! We specialize in AI-powered business transformation across 5 complete systems. To best help you, could you tell me a bit about your business and what you're looking to achieve?", "LEOMAX works with serious businesses across the MENA region who are ready to build something that lasts. What brings you here today?"],
        price:   ["Our engagements are tailored to each client's needs and scope. The best way to understand the investment is through a 30-minute discovery call with Dr. Anas directly.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        contact: ["I'd be happy to connect you with the right team member or set up a strategy call with Dr. Anas.\n\n📅 **calendly.com/anas-msd-ramsees/30min**"],
        systems: ["LEOMAX offers 5 AI-powered systems:\n\n**01 Growth System** — Revenue growth & automated pipelines\n**02 AI Transformation** — AI tools across your operations\n**03 Marketing Engine** — Brand, campaigns & demand generation\n**04 Content System** — Content strategy & distribution\n**05 Launch System** — From zero to operational in 90 days\n\nWhich system interests you most?"],
      }
    }
  };

  /* ---- Smart keyword matching for fallback ---- */
  function getSmartReply(member, userMsg) {
    const m = userMsg.toLowerCase();
    const t = member.topics;
    if (/price|cost|how much|pricing|invest|fee|كم|سعر|تكلف/.test(m)) return pick(t.price || t.contact);
    if (/ai|artificial|automation|automate|ذكاء|اتمتة/.test(m)) return pick(t.ai || t.default);
    if (/grow|revenue|sale|market|نمو|مبيعات|إيراد/.test(m)) return pick(t.growth || t.default);
    if (/contact|book|call|meeting|schedule|حجز|اتصل|موعد/.test(m)) return pick(t.contact || t.default);
    if (/system|service|what do|offer|نظام|خدم/.test(m)) return pick(t.systems || t.default);
    return pick(t.default);
  }

  function pick(arr) {
    if (!arr) return null;
    if (typeof arr === 'string') return arr;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---- Calendly ---- */
  function loadCalendly(cb) {
    if (window.Calendly) { cb(); return; }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.onload = cb;
    document.head.appendChild(js);
  }

  function openCalendlyPopup() {
    loadCalendly(() => Calendly.initPopupWidget({ url: CALENDLY_URL }));
    return false;
  }

  /* ---- CSS ---- */
  const css = `
  #lm-chat-overlay{position:fixed;inset:0;background:rgba(1,11,28,.7);z-index:9998;display:none;backdrop-filter:blur(4px)}
  #lm-chat-overlay.open{display:block}
  #lm-chat-panel{
    position:fixed;top:0;right:-480px;width:460px;max-width:100vw;height:100vh;
    background:#010B1C;border-left:1px solid rgba(184,184,184,.15);
    z-index:9999;display:flex;flex-direction:column;transition:right .35s cubic-bezier(.4,0,.2,1);
  }
  #lm-chat-panel.open{right:0}
  #lm-chat-header{
    display:flex;align-items:center;gap:14px;padding:20px 20px 18px;
    border-bottom:1px solid rgba(184,184,184,.12);background:#060F1F;flex-shrink:0;
  }
  #lm-chat-avatar{width:48px;height:48px;object-fit:cover;object-position:top;border:1px solid rgba(184,184,184,.2);flex-shrink:0}
  #lm-chat-name{font-size:15px;font-weight:800;color:#fff;margin-bottom:2px}
  #lm-chat-role{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8B8B8}
  #lm-chat-close{
    margin-left:auto;width:34px;height:34px;background:rgba(184,184,184,.08);
    border:1px solid rgba(184,184,184,.2);color:#B8B8B8;font-size:16px;
    cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.2s;
  }
  #lm-chat-close:hover{background:rgba(184,184,184,.2);color:#fff}
  #lm-chat-messages{
    flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;
    scrollbar-width:thin;scrollbar-color:rgba(184,184,184,.15) transparent;
  }
  .lm-msg{max-width:88%;line-height:1.65;font-size:14px;padding:12px 16px;word-break:break-word}
  .lm-msg.user{align-self:flex-end;background:#0D1E35;color:#D4D4D4;border:1px solid rgba(184,184,184,.12)}
  .lm-msg.bot{align-self:flex-start;background:#060F1F;color:#D4D4D4;border:1px solid rgba(184,184,184,.1)}
  .lm-msg.bot strong{color:#fff}
  .lm-typing{align-self:flex-start;padding:12px 16px;background:#060F1F;border:1px solid rgba(184,184,184,.1);display:flex;gap:5px;align-items:center}
  .lm-dot{width:6px;height:6px;background:#B8B8B8;border-radius:50%;animation:lm-bounce .9s infinite}
  .lm-dot:nth-child(2){animation-delay:.15s}
  .lm-dot:nth-child(3){animation-delay:.3s}
  @keyframes lm-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
  #lm-chat-footer{padding:16px 20px;border-top:1px solid rgba(184,184,184,.1);background:#010B1C;flex-shrink:0}
  #lm-chat-form{display:flex;gap:10px}
  #lm-chat-input{
    flex:1;background:#0D1E35;border:1px solid rgba(184,184,184,.15);color:#fff;
    padding:12px 16px;font-size:14px;outline:none;font-family:inherit;resize:none;height:48px;transition:border-color .2s;
  }
  #lm-chat-input:focus{border-color:rgba(184,184,184,.4)}
  #lm-chat-input::placeholder{color:rgba(184,184,184,.35)}
  #lm-chat-send{
    background:#B8B8B8;color:#010B1C;border:none;width:48px;height:48px;
    cursor:pointer;font-size:16px;flex-shrink:0;transition:.2s;display:flex;align-items:center;justify-content:center;
  }
  #lm-chat-send:hover{background:#fff}
  #lm-chat-send:disabled{opacity:.4;cursor:not-allowed}
  #lm-chat-book{
    display:block;width:100%;text-align:center;margin-top:10px;padding:9px;
    font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
    color:#010B1C;background:#B8B8B8;border:none;cursor:pointer;transition:.2s;font-family:inherit;
  }
  #lm-chat-book:hover{background:#fff}
  @media(max-width:500px){#lm-chat-panel{width:100vw}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- HTML ---- */
  const overlay = document.createElement('div');
  overlay.id = 'lm-chat-overlay';
  overlay.onclick = () => closeChat();

  const panel = document.createElement('div');
  panel.id = 'lm-chat-panel';
  panel.innerHTML = `
    <div id="lm-chat-header">
      <img id="lm-chat-avatar" src="" alt="">
      <div>
        <div id="lm-chat-name"></div>
        <div id="lm-chat-role"></div>
      </div>
      <button id="lm-chat-close" onclick="window.LMChat.close()">✕</button>
    </div>
    <div id="lm-chat-messages"></div>
    <div id="lm-chat-footer">
      <form id="lm-chat-form">
        <textarea id="lm-chat-input" placeholder="Ask a question..." rows="1"></textarea>
        <button type="submit" id="lm-chat-send">➤</button>
      </form>
      <button id="lm-chat-book" onclick="window.LMChat.book()">📅 Book a Strategy Call</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  /* ---- State ---- */
  let currentMember = null;
  let history = [];
  let isLoading = false;

  /* ---- Public API ---- */
  window.LMChat = {
    open: function (slug) {
      const m = MEMBERS[slug];
      if (!m) return;
      currentMember = m;
      history = [];
      document.getElementById('lm-chat-avatar').src = BASE_IMG + slug + '.png';
      document.getElementById('lm-chat-name').textContent = m.name;
      document.getElementById('lm-chat-role').textContent = m.role;
      const msgs = document.getElementById('lm-chat-messages');
      msgs.innerHTML = '';
      addMessage('bot', m.welcome);
      overlay.classList.add('open');
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('lm-chat-input').focus(), 380);
    },
    close: function () { closeChat(); },
    book:  function () { openCalendlyPopup(); }
  };

  function closeChat() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---- Messages ---- */
  function addMessage(type, html) {
    const msgs = document.getElementById('lm-chat-messages');
    const div = document.createElement('div');
    div.className = 'lm-msg ' + type;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const msgs = document.getElementById('lm-chat-messages');
    const div = document.createElement('div');
    div.className = 'lm-typing'; div.id = 'lm-typing';
    div.innerHTML = '<div class="lm-dot"></div><div class="lm-dot"></div><div class="lm-dot"></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('lm-typing');
    if (t) t.remove();
  }

  /* ---- Send ---- */
  document.getElementById('lm-chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const input = document.getElementById('lm-chat-input');
    const text = input.value.trim();
    if (!text || isLoading || !currentMember) return;
    input.value = '';
    addMessage('user', escHtml(text));
    history.push({ role: 'user', content: text });
    isLoading = true;
    document.getElementById('lm-chat-send').disabled = true;
    showTyping();

    if (HAS_KEY) {
      // Real Claude API
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 512,
            system: currentMember.system,
            messages: history
          })
        });
        const data = await res.json();
        hideTyping();
        if (data.content && data.content[0]) {
          const reply = data.content[0].text;
          history.push({ role: 'assistant', content: reply });
          addMessage('bot', formatReply(reply));
        } else {
          fallbackReply(text);
        }
      } catch (err) {
        hideTyping();
        fallbackReply(text);
      }
    } else {
      // Smart fallback — no API key needed
      await delay(900 + Math.random() * 600);
      hideTyping();
      const reply = getSmartReply(currentMember, text);
      if (reply) {
        history.push({ role: 'assistant', content: reply });
        addMessage('bot', formatReply(reply));
      }
    }

    isLoading = false;
    document.getElementById('lm-chat-send').disabled = false;
  });

  function fallbackReply(text) {
    const reply = getSmartReply(currentMember, text);
    if (reply) addMessage('bot', formatReply(reply));
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ---- Keyboard ---- */
  document.getElementById('lm-chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('lm-chat-form').dispatchEvent(new Event('submit'));
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeChat();
  });

  /* ---- Helpers ---- */
  function escHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }
  function formatReply(t) {
    return t
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>');
  }
})();
