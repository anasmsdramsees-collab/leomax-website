/* ============================================================
   LEOMAX — Homepage Intake Chat
   ChatGPT-style general business assistant embedded in the hero.
   Detects topic → routes to the right advisor → opens their chat.
   ============================================================ */

(function () {
  'use strict';

  /* ── Advisor routing map ── */
  const ROUTES = [
    {
      slug: 'laith-darwish',
      name: 'Laith Darwish', role: 'AI & Technology Director',
      keys: ['ai','artificial intelligence','machine learning','automation','software','tech','digital transformation','data','chatbot','system','algorithm','tool','platform','erp','crm'],
      reply: `Technology decisions made at the wrong stage cost businesses far more than they save. Before recommending any tool or platform, the right question is: what process problem are you actually solving? Laith handles exactly this — AI integration, tech stack decisions, and digital operations for businesses at every stage.`
    },
    {
      slug: 'kamilia-fouad',
      name: 'Kamilia Fouad', role: 'Marketing & Brand Director',
      keys: ['marketing','brand','content','social media','awareness','positioning','identity','audience','campaign','ad','advertising','instagram','tiktok','seo','email','newsletter','creative','design','visual'],
      reply: `Most marketing problems are actually brand problems in disguise — unclear positioning, inconsistent message, or the wrong audience definition. Kamilia works at the intersection of brand strategy and execution, building marketing systems that produce consistent results rather than one-off wins.`
    },
    {
      slug: 'hani-masry',
      name: 'Hani El Masry', role: 'Chief Financial Officer',
      keys: ['finance','financial','cash flow','profit','revenue','cost','budget','accounting','tax','vat','burn rate','runway','p&l','balance sheet','forecast','cfo','money','capital','loan','debt','margin'],
      reply: `Financial clarity is not just about the numbers — it is about knowing what the numbers are telling you before your bank account does. Hani builds financial infrastructure: clean reporting, cash flow modeling, and the decision-making frameworks that keep businesses financially sound through growth.`
    },
    {
      slug: 'haya-kuwari',
      name: 'Haya Al Kuwari', role: 'Business Development Lead',
      keys: ['business development','bd','clients','new clients','pipeline','leads','prospecting','sales pipeline','market entry','b2b','deals','closing','rfp','tender','government','enterprise'],
      reply: `Business development is about building relationships that turn into consistent revenue, not chasing individual deals. Haya works with companies to build their BD infrastructure — the process, the pitch, and the pipeline management that makes new business predictable.`
    },
    {
      slug: 'rami-khalidi',
      name: 'Rami Al Khalidi', role: 'Operations Director',
      keys: ['operations','processes','efficiency','workflow','bottleneck','team','hr','hiring','structure','org','organization','productivity','sop','procedure','system','management','staff','employee','people'],
      reply: `Operational problems tend to compound quietly until they become expensive. Rami focuses on the structure underneath the business — clear processes, the right team structure, and systems that let companies scale without the chaos that usually comes with growth.`
    },
    {
      slug: 'rita-nasser',
      name: 'Rita Nasser', role: 'Head of Innovation',
      keys: ['innovation','new product','product development','r&d','research','prototype','disruption','idea','startup','pivot','launch','market fit','mvp','venture','incubation'],
      reply: `Innovation without a clear connection to the business model tends to produce interesting ideas that never ship. Rita works with businesses to structure their innovation process — from identifying the right problems to building products and services that actually reach the market.`
    },
    {
      slug: 'mashari-otaibi',
      name: 'Mashari Al Otaibi', role: 'Investment Director',
      keys: ['investment','funding','investor','equity','valuation','raise','series','seed','venture capital','vc','pitch','deck','due diligence','acquisition','m&a','shareholder','stake','return','roi'],
      reply: `Investor relationships are about building confidence — in the business model, the team, and the numbers. Mashari works with businesses preparing for investment rounds, acquisitions, or strategic partnerships, ensuring they present with the clarity and credibility that moves capital.`
    },
    {
      slug: 'elhanouf-harbi',
      name: 'Elhanouf Al Harbi', role: 'Sustainability Director',
      keys: ['sustainability','esg','environment','green','carbon','emission','csr','social responsibility','climate','renewable','waste','circular economy','reporting','gri','sdg','vision 2030','compliance'],
      reply: `Sustainability is moving from a voluntary commitment to a business requirement — driven by regulation, investor expectations, and competitive positioning. Elhanouf helps companies build ESG frameworks that are substantive rather than cosmetic, and that meet the standards that regulators and stakeholders are now demanding.`
    },
    {
      slug: 'mira-mansoori',
      name: 'Mira Al Mansoori', role: 'Partnerships Director',
      keys: ['partnership','alliance','collaboration','joint venture','agreement','mou','supplier','vendor','distribution','channel','strategic partner','network','ecosystem'],
      reply: `The right partnership can accelerate a business faster than almost any internal investment. Mira works on strategic alliance development — identifying the right partners, structuring agreements that benefit both sides, and managing the relationship so it stays productive.`
    },
    {
      slug: 'miral-hakimi',
      name: 'Miral Al Hakimi', role: 'Regional Expansion Lead',
      keys: ['expansion','new market','international','gcc','saudi','uae','qatar','kuwait','bahrain','oman','egypt','regional','market entry','cross border','license','entity','branch','franchise'],
      reply: `Entering a new market without proper groundwork produces the same outcome every time — initial traction that doesn\'t hold. Miral works with businesses on the full expansion picture: market assessment, legal and licensing requirements, local partnerships, and the go-to-market approach that actually fits the new environment.`
    },
    {
      slug: 'yasin-sherif',
      name: 'Yasin El Sherif', role: 'Supply Chain Director',
      keys: ['supply chain','logistics','procurement','inventory','warehouse','shipping','delivery','supplier','import','export','stock','fulfillment','3pl','sourcing','manufacturing'],
      reply: `Supply chain problems are often invisible until they become crises. Yasin works on building resilient, cost-efficient supply chain systems — from procurement strategy and supplier relationships to inventory models and logistics infrastructure.`
    },
    {
      slug: 'kaya-haddad',
      name: 'Kaya Haddad', role: 'Chief Strategy Officer',
      keys: ['strategy','strategic','planning','direction','vision','goal','objective','competitive','positioning','market share','growth strategy','roadmap','transformation','restructure','turnaround'],
      reply: `Strategy is not a document — it is the set of choices a business makes about where to compete and how to win. Kaya works with leadership teams to bring that clarity: where the business is now, where it needs to go, and what specifically needs to change to get there.`
    },
    {
      slug: 'valeria-moreno',
      name: 'Valeria Moreno', role: 'Executive Assistant to Dr. Anas Elimam',
      keys: ['dr anas','anas elimam','founder','ceo','meeting','appointment','schedule','call with anas','speak to founder','general','overall','everything'],
      reply: `If you need to reach Dr. Anas Elimam directly, Valeria manages his schedule and handles all executive requests. She can arrange a call or meeting based on availability and the nature of what you need to discuss.`
    },
    {
      slug: 'dr-anas',
      name: 'Dr. Anas Elimam', role: 'Founder & CEO',
      keys: ['leomax','what do you do','how do you work','your services','your approach','your team','overall','general','everything','start','where to start','don\'t know','not sure','help me'],
      reply: `LEOMAX builds and deploys complete business systems — growth, AI, marketing, content, and launch — directly inside the business, typically within 90 days. The starting point is always the same: an honest assessment of where the real constraints are, then building the infrastructure to remove them.`
    }
  ];

  /* ── Fallback for unrecognized topics ── */
  const FALLBACK = {
    slug: 'kaya-haddad',
    name: 'Kaya Haddad', role: 'Chief Strategy Officer',
    reply: `Every business challenge connects to a few core questions: what is the actual problem, what does solving it require, and what is the right order of operations. The best place to start is usually a structured conversation about where things stand. Our strategy team can help map that out.`
  };

  /* ── Route detection ── */
  function detectRoute(text) {
    const lower = text.toLowerCase();
    let best = null, bestScore = 0;
    for (const route of ROUTES) {
      const score = route.keys.filter(k => lower.includes(k)).length;
      if (score > bestScore) { bestScore = score; best = route; }
    }
    return best || FALLBACK;
  }

  /* ── Format text (newlines → <br>) ── */
  function fmt(t) { return t.replace(/\n/g, '<br>'); }

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
  #lm-intake{
    width:100%;max-width:620px;margin:32px auto 0;
    position:relative;z-index:2;
  }
  #lm-intake-bar{
    display:flex;align-items:center;gap:0;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(184,184,184,.18);
    border-radius:14px;overflow:hidden;
    transition:border-color .2s, box-shadow .2s;
  }
  #lm-intake-bar:focus-within{
    border-color:rgba(184,184,184,.42);
    box-shadow:0 0 0 3px rgba(184,184,184,.07);
  }
  #lm-intake-input{
    flex:1;background:transparent;border:none;color:#fff;
    padding:14px 18px;font-size:14px;outline:none;font-family:inherit;
    caret-color:#B8B8B8;
  }
  #lm-intake-input::placeholder{color:rgba(184,184,184,.35)}
  #lm-intake-btn{
    background:rgba(184,184,184,.1);border:none;border-left:1px solid rgba(184,184,184,.1);
    color:#B8B8B8;padding:0 18px;height:50px;cursor:pointer;
    font-size:16px;transition:.2s;flex-shrink:0;display:flex;align-items:center;
  }
  #lm-intake-btn:hover{background:rgba(184,184,184,.2);color:#fff}
  #lm-intake-hint{
    text-align:center;font-size:11px;color:rgba(184,184,184,.3);
    margin-top:10px;letter-spacing:.5px;
  }

  /* Conversation window */
  #lm-intake-conv{
    margin-top:16px;
    background:rgba(6,14,26,.92);
    border:1px solid rgba(184,184,184,.12);
    border-radius:16px;overflow:hidden;
    max-height:0;opacity:0;
    transition:max-height .45s cubic-bezier(.4,0,.2,1), opacity .3s ease;
  }
  #lm-intake-conv.open{max-height:480px;opacity:1}
  #lm-intake-msgs{
    padding:20px;display:flex;flex-direction:column;gap:14px;
    max-height:360px;overflow-y:auto;
    scrollbar-width:thin;scrollbar-color:rgba(184,184,184,.1) transparent;
  }
  .lm-in-row-user{display:flex;justify-content:flex-end}
  .lm-in-row-bot{display:flex;gap:10px;align-items:flex-end}
  .lm-in-bubble{
    font-size:13.5px;line-height:1.68;padding:11px 15px;word-break:break-word;max-width:86%;
  }
  .lm-in-bubble.user{
    background:rgba(27,49,84,.8);color:#E2E8F0;
    border-radius:18px 18px 4px 18px;
    border:1px solid rgba(100,150,220,.15);
  }
  .lm-in-bubble.bot{
    background:#111D30;color:#D4D4D4;
    border-radius:4px 18px 18px 18px;
    border:1px solid rgba(184,184,184,.08);
  }
  .lm-in-bubble.bot strong{color:#fff}
  .lm-in-icon{
    width:28px;height:28px;border-radius:50%;
    background:linear-gradient(135deg,#1B3154,#0C1E38);
    border:1px solid rgba(184,184,184,.15);
    display:flex;align-items:center;justify-content:center;
    font-size:11px;color:#B8B8B8;flex-shrink:0;font-weight:700;
  }
  .lm-in-typing{
    padding:11px 15px;background:#111D30;border:1px solid rgba(184,184,184,.08);
    border-radius:4px 18px 18px 18px;display:flex;gap:4px;align-items:center;
  }
  .lm-in-dot{
    width:5px;height:5px;background:#5B7FA6;border-radius:50%;
    animation:lm-in-bounce .85s infinite;
  }
  .lm-in-dot:nth-child(2){animation-delay:.14s}
  .lm-in-dot:nth-child(3){animation-delay:.28s}
  @keyframes lm-in-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}

  /* Advisor card */
  .lm-in-card{
    border-top:1px solid rgba(184,184,184,.08);
    padding:16px 20px;
    display:flex;align-items:center;gap:14px;
    background:rgba(10,20,36,.6);
  }
  .lm-in-card-avatar{
    width:40px;height:40px;border-radius:50%;object-fit:cover;
    object-position:top center;border:1px solid rgba(184,184,184,.18);flex-shrink:0;
  }
  .lm-in-card-info{flex:1;min-width:0}
  .lm-in-card-name{font-size:13px;font-weight:700;color:#fff}
  .lm-in-card-role{font-size:10.5px;color:#7B8FA6;margin-top:2px;letter-spacing:.3px}
  .lm-in-card-btn{
    flex-shrink:0;padding:9px 16px;
    background:#B8B8B8;color:#010B1C;border:none;border-radius:8px;
    font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
    cursor:pointer;font-family:inherit;transition:.18s;white-space:nowrap;
  }
  .lm-in-card-btn:hover{background:#fff}
  `;
  document.head.appendChild(style);

  /* ── HTML injection — placed before scroll-hint inside .hero ── */
  function inject() {
    const scrollHint = document.querySelector('.scroll-hint');
    if (!scrollHint) return;

    const wrap = document.createElement('div');
    wrap.id = 'lm-intake';
    wrap.innerHTML = `
      <div id="lm-intake-bar">
        <input id="lm-intake-input" type="text"
          placeholder="What business challenge are you working through?"
          autocomplete="off" />
        <button id="lm-intake-btn" aria-label="Send">&#10148;</button>
      </div>
      <p id="lm-intake-hint">Ask anything — growth, AI, finance, operations, expansion…</p>
      <div id="lm-intake-conv">
        <div id="lm-intake-msgs"></div>
      </div>
    `;
    scrollHint.parentNode.insertBefore(wrap, scrollHint);

    document.getElementById('lm-intake-btn').addEventListener('click', submit);
    document.getElementById('lm-intake-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });
  }

  /* ── State ── */
  let routed = false;

  /* ── Submit handler ── */
  function submit() {
    const input = document.getElementById('lm-intake-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    openConv();
    addUser(text);
    showTyping();

    setTimeout(() => {
      hideTyping();
      const route = detectRoute(text);
      addBot(route.reply);
      if (!routed) {
        routed = true;
        setTimeout(() => showAdvisorCard(route), 400);
      }
    }, 900 + Math.random() * 400);
  }

  /* ── UI helpers ── */
  function openConv() {
    document.getElementById('lm-intake-conv').classList.add('open');
  }
  function msgs() { return document.getElementById('lm-intake-msgs'); }
  function scroll() { const m = msgs(); m.scrollTop = m.scrollHeight; }

  function addUser(text) {
    const row = document.createElement('div');
    row.className = 'lm-in-row-user';
    row.innerHTML = `<div class="lm-in-bubble user">${esc(text)}</div>`;
    msgs().appendChild(row); scroll();
  }
  function addBot(text) {
    const row = document.createElement('div');
    row.className = 'lm-in-row-bot';
    row.innerHTML = `
      <div class="lm-in-icon">LM</div>
      <div class="lm-in-bubble bot">${fmt(text)}</div>`;
    msgs().appendChild(row); scroll();
  }
  function showTyping() {
    const row = document.createElement('div');
    row.id = 'lm-in-typing'; row.className = 'lm-in-row-bot';
    row.innerHTML = `
      <div class="lm-in-icon">LM</div>
      <div class="lm-in-typing">
        <div class="lm-in-dot"></div><div class="lm-in-dot"></div><div class="lm-in-dot"></div>
      </div>`;
    msgs().appendChild(row); scroll();
  }
  function hideTyping() {
    const el = document.getElementById('lm-in-typing');
    if (el) el.remove();
  }

  function showAdvisorCard(route) {
    const BASE = 'https://anasmsdramsees-collab.github.io/leomax-website/team/';
    const conv = document.getElementById('lm-intake-conv');
    const card = document.createElement('div');
    card.className = 'lm-in-card';
    card.innerHTML = `
      <img class="lm-in-card-avatar" src="${BASE}${route.slug}.png" alt="${route.name}">
      <div class="lm-in-card-info">
        <div class="lm-in-card-name">${route.name}</div>
        <div class="lm-in-card-role">${route.role}</div>
      </div>
      <button class="lm-in-card-btn" onclick="window.LMChat && window.LMChat.open('${route.slug}')">Chat now</button>
    `;
    conv.appendChild(card);
    scroll();
  }

  function esc(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
