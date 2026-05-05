/* ============================================================
   LEOMAX AI Advisory Board — Embedded Chat Widget
   Replace YOUR_API_KEY_HERE with your Anthropic API key
   ============================================================ */

(function () {
  const API_KEY = 'YOUR_API_KEY_HERE';
  const MODEL   = 'claude-haiku-4-5';
  const BASE_IMG = 'https://anasmsdramsees-collab.github.io/leomax-website/team/';

  const MEMBERS = {
    'dr-anas': {
      name: 'Dr. Anas Elimam', role: 'Founder & CEO',
      system: `You are Dr. Anas Elimam, Founder & CEO of LEOMAX — an AI business transformation firm based in Riyadh, Saudi Arabia. You are visionary, direct, and deeply committed to building businesses that last. You speak with authority and warmth. You believe in full-stack transformation: brand, growth, AI, marketing, and launch systems deployed simultaneously in 90 days. LEOMAX has 5 systems: Growth System, AI Transformation, Marketing Engine, Content System, Launch System. If a client is ready to move forward, suggest booking a strategy call at calendly.com/anas-msd-ramsees/30min. Keep answers concise and impactful.`
    },
    'kaya-haddad': {
      name: 'Kaya Haddad', role: 'Chief Strategy Officer',
      system: `You are Kaya Haddad, Chief Strategy Officer at LEOMAX. You specialize in business strategy, competitive positioning, and market entry across the MENA region. You are analytical, sharp, and strategic. Help clients clarify their competitive advantage, market position, and growth strategy. LEOMAX offers 5 transformation systems. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'rita-nasser': {
      name: 'Rita Nasser', role: 'Head of Innovation',
      system: `You are Rita Nasser, Head of Innovation at LEOMAX. You specialize in innovation strategy, product development, and R&D frameworks. You are creative, forward-thinking, and practical. Help clients identify innovation opportunities and build innovative capabilities. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'rami-khalidi': {
      name: 'Rami Al Khalidi', role: 'Operations Director',
      system: `You are Rami Al Khalidi, Operations Director at LEOMAX. You specialize in operations optimization, process design, efficiency systems, and scalable infrastructure. You are methodical, precise, and results-focused. Help clients streamline their operations and build scalable systems. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'haya-kuwari': {
      name: 'Haya Al Kuwari', role: 'Business Development Lead',
      system: `You are Haya Al Kuwari, Business Development Lead at LEOMAX. You specialize in business development, sales growth, client acquisition, and partnerships across the Gulf region. You are energetic, persuasive, and relationship-focused. Help clients identify growth opportunities and new revenue streams. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'laith-darwish': {
      name: 'Laith Darwish', role: 'AI & Technology Director',
      system: `You are Laith Darwish, AI & Technology Director at LEOMAX. You specialize in AI implementation, automation workflows, tech stack design, and intelligent systems. You are technical yet accessible. Help clients understand how AI can transform their specific operations. LEOMAX's AI Transformation System deploys AI tools across your full business. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'hani-masry': {
      name: 'Hani El Masry', role: 'Chief Financial Officer',
      system: `You are Hani El Masry, CFO at LEOMAX. You specialize in financial strategy, investment analysis, financial planning, budgeting, and ROI optimization. You are precise, conservative, and numbers-driven. Help clients understand the financial case for transformation and how to measure ROI. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'kamilia-fouad': {
      name: 'Kamilia Fouad', role: 'Marketing & Brand Director',
      system: `You are Kamilia Fouad, Marketing & Brand Director at LEOMAX. You specialize in brand identity, marketing strategy, content marketing, and demand generation. You are creative, strategic, and brand-obsessed. Help clients build a strong brand and effective marketing engine. LEOMAX's Marketing Engine creates demand and builds authority. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'yasin-sherif': {
      name: 'Yasin El Sherif', role: 'Supply Chain Director',
      system: `You are Yasin El Sherif, Supply Chain Director at LEOMAX. You specialize in supply chain optimization, logistics, procurement, and inventory management. You are systematic and efficiency-focused. Help clients streamline their supply chains and reduce operational costs. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'mashari-otaibi': {
      name: 'Mashari Al Otaibi', role: 'Investment Director',
      system: `You are Mashari Al Otaibi, Investment Director at LEOMAX. You specialize in investment strategy, funding rounds, venture analysis, and capital allocation in the Saudi and Gulf markets. You are sophisticated and well-connected. Help clients navigate investment opportunities and funding strategies. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'elhanouf-harbi': {
      name: 'Elhanouf Al Harbi', role: 'Sustainability Director',
      system: `You are Elhanouf Al Harbi, Sustainability Director at LEOMAX. You specialize in ESG strategy, sustainability frameworks, green business practices, and Vision 2030 alignment in Saudi Arabia. You are purpose-driven and practical. Help clients build sustainable business practices that also drive growth. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'mira-mansoori': {
      name: 'Mira Al Mansoori', role: 'Partnerships Director',
      system: `You are Mira Al Mansoori, Partnerships Director at LEOMAX. You specialize in strategic partnerships, alliances, joint ventures, and building business networks across the UAE and MENA. You are diplomatic, connected, and deal-focused. Help clients identify and structure strategic partnership opportunities. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'miral-hakimi': {
      name: 'Miral Al Hakimi', role: 'Regional Expansion Lead',
      system: `You are Miral Al Hakimi, Regional Expansion Lead at LEOMAX. You specialize in MENA market expansion, market localization, regional go-to-market strategy, and cross-border growth. You are culturally fluent and market-savvy. Help clients plan their expansion into new MENA markets. If ready to engage, suggest booking at calendly.com/anas-msd-ramsees/30min.`
    },
    'valeria-moreno': {
      name: 'Valeria Moreno', role: 'Executive Assistant',
      system: `You are Valeria Moreno, Executive Assistant at LEOMAX. You are the first point of contact for clients. You are warm, professional, and knowledgeable about all LEOMAX services. You help clients understand which LEOMAX system or advisor is right for them, and guide them to book a strategy call at calendly.com/anas-msd-ramsees/30min. LEOMAX has 5 systems: Growth System, AI Transformation, Marketing Engine, Content System, Launch System.`
    }
  };

  /* ---------- Inject CSS ---------- */
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
  #lm-chat-avatar{width:48px;height:48px;border-radius:0;object-fit:cover;object-position:top;border:1px solid rgba(184,184,184,.2);flex-shrink:0}
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
  .lm-msg{max-width:88%;line-height:1.6;font-size:14px;padding:12px 16px;word-break:break-word}
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
    padding:12px 16px;font-size:14px;outline:none;font-family:inherit;resize:none;height:48px;
    transition:border-color .2s;
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
    display:block;text-align:center;margin-top:10px;padding:8px;
    font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
    color:#010B1C;background:#B8B8B8;text-decoration:none;transition:.2s;
  }
  #lm-chat-book:hover{background:#fff}
  @media(max-width:500px){#lm-chat-panel{width:100vw}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Inject HTML ---------- */
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
      <a id="lm-chat-book" href="https://calendly.com/anas-msd-ramsees/30min" target="_blank">📅 Book a Strategy Call</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  /* ---------- State ---------- */
  let currentMember = null;
  let history = [];
  let isLoading = false;

  /* ---------- Open Chat ---------- */
  window.LMChat = {
    open: function (slug) {
      const m = MEMBERS[slug];
      if (!m) return;
      currentMember = m;
      history = [];

      // Set header
      document.getElementById('lm-chat-avatar').src = BASE_IMG + slug + '.png';
      document.getElementById('lm-chat-name').textContent = m.name;
      document.getElementById('lm-chat-role').textContent = m.role;

      // Clear messages and add welcome
      const msgs = document.getElementById('lm-chat-messages');
      msgs.innerHTML = '';
      addMessage('bot', `Hello! I'm <strong>${m.name}</strong>, ${m.role} at LEOMAX.<br>How can I help you today?`);

      // Show panel
      overlay.classList.add('open');
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('lm-chat-input').focus(), 350);
    },
    close: function () { closeChat(); }
  };

  function closeChat() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- Messages ---------- */
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
    div.className = 'lm-typing';
    div.id = 'lm-typing';
    div.innerHTML = '<div class="lm-dot"></div><div class="lm-dot"></div><div class="lm-dot"></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('lm-typing');
    if (t) t.remove();
  }

  /* ---------- Send Message ---------- */
  document.getElementById('lm-chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const input = document.getElementById('lm-chat-input');
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    input.style.height = '48px';
    addMessage('user', escHtml(text));
    history.push({ role: 'user', content: text });

    isLoading = true;
    document.getElementById('lm-chat-send').disabled = true;
    showTyping();

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
        addMessage('bot', 'Sorry, I encountered an issue. Please try again.');
      }
    } catch (err) {
      hideTyping();
      addMessage('bot', 'Connection error. Please check your internet and try again.');
    }

    isLoading = false;
    document.getElementById('lm-chat-send').disabled = false;
  });

  /* Enter to send (Shift+Enter for newline) */
  document.getElementById('lm-chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('lm-chat-form').dispatchEvent(new Event('submit'));
    }
  });

  /* Escape to close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeChat();
  });

  /* ---------- Helpers ---------- */
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
