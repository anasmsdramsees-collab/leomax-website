/* ============================================================
   LEOMAX AI Advisory Board — Embedded Chat Widget
   ============================================================
   Flow: name → company → qualifying questions → consultation → follow-up
   Features:
   • Bilingual (auto-detects Arabic / English per message)
   • Domain-specific qualifying questions per advisor
   • Off-topic & flattery redirect with QA notice
   • Follow-up: schedule via Calendly or callback with time preference
   • Email summary to management via Web3Forms
   ============================================================ */

(function () {

  /* ============================================================
     CONFIG
     ============================================================
     Web3Forms account: anas.msd.ramsees@gmail.com
     Chat summaries emailed there after each session (free, 250/month).
  ============================================================ */
  const WEB3FORMS_KEY    = '8cbff62d-1c1b-4bea-affb-7947492e14be';
  const MANAGEMENT_EMAIL = 'info@leomax.sa';

  const API_KEY      = 'YOUR_API_KEY_HERE';
  const MODEL        = 'claude-3-5-haiku-20241022';
  const BASE_IMG     = 'https://anasmsdramsees-collab.github.io/leomax-website/team/';
  const CALENDLY_URL = 'https://calendly.com/anas-msd-ramsees/30min?background_color=010B1C&text_color=D4D4D4&primary_color=B8B8B8&hide_gdpr_banner=1';

  const HAS_KEY     = API_KEY && API_KEY !== 'YOUR_API_KEY_HERE';
  const HAS_W3F = !!WEB3FORMS_KEY;

  /* ============================================================
     LANGUAGE DETECTION
     ============================================================ */
  let userLang = 'en'; // updates with each user message
  function detectLang(text) {
    return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
  }
  function t(en, ar) { return userLang === 'ar' ? ar : en; }

  /* ============================================================
     FLATTERY & OFF-TOPIC DETECTION
     ============================================================ */
  const FLATTERY_RE = /\b(you'?re?\s*(beautiful|gorgeous|pretty|sexy|handsome|hot|cute|lovely|amazing|stunning)|what'?s?\s*your\s*(number|insta|whatsapp)|i\s*(love|like|fancy)\s*you|you\s*look\b|أنت[يِ]?\s*(جميل|حلو|رائع|ذكي|شاطر|الحلو|الجميل|مميز)|أنا بحبك|وين\s*(رقم|اتصال)|رقمك|تعارف)/i;
  const OFFTOPIC_RE = /\b(who\s*won|match|score|football|soccer|kora|مباراة|كورة|ميسي|رونالدو|مسلسل|فيلم|أغنية|سياسة|رأيك\s*(في|عن)|تمنيت|تحب|مشغول|ازيك|ايه\s*الأخبار|كيف\s*حالك\s*اليوم|شو\s*اخبارك)\b/i;

  function getFlattery() {
    return t(
      `My focus here is professional — these conversations are monitored by our quality team. Let's get back to what we were discussing.`,
      `المحادثات هنا مهنية وتتابعها إدارة الجودة لدينا. لنعود إلى الموضوع.`
    );
  }
  function getOfftopic(memberRole) {
    return t(
      `That's outside what I can help with here. My focus is ${memberRole.toLowerCase()} — is there something related to that I can assist with?`,
      `هذا خارج نطاق تخصصي هنا. أنا متاح لمناقشة ${memberRole} — هل هناك شيء ذو صلة يمكنني مساعدتك فيه؟`
    );
  }

  /* ============================================================
     MEMBERS DATA
     ============================================================
     Each member has:
       intro        — opening self-introduction (English)
       intro_ar     — Arabic version of intro
       system       — system prompt for Claude AI
       qualify      — 2-3 domain qualifying questions [en, ar]
       topics       — smart fallback replies (en + ar variants)
  ============================================================ */
  const MEMBERS = {

    /* ------------------------------------------------------------------ */
    'dr-anas': {
      name: 'Dr. Anas Elimam', role: 'Founder & CEO',
      intro: `I'm Dr. Anas Elimam — I founded LEOMAX after spending a decade watching capable businesses underperform. Not because their product was weak, but because their infrastructure was. No real growth system, no AI backbone, no marketing engine worth the name.

We've worked with 90+ companies across Saudi, UAE, Qatar, and Egypt. We build and deploy complete systems — directly inside the business — in 90 days.`,
      intro_ar: `أنا الدكتور أنس العلام، مؤسس ومدير تنفيذي لشركة LEOMAX. أسستها بعد سنوات من متابعة شركات واعدة لا تحقق إمكاناتها — ليس بسبب ضعف المنتج، بل بسبب ضعف البنية التحتية.

عملنا مع أكثر من 90 شركة في السعودية والإمارات وقطر ومصر. نبني وننفّذ أنظمة متكاملة داخل الشركة مباشرة — خلال 90 يومًا.`,
      system: `You are Dr. Anas Elimam, Founder & CEO of LEOMAX. Direct, calm authority — no hollow enthusiasm. LEOMAX deploys 5 systems in 90 days: Growth, AI Transformation, Marketing Engine, Content System, Launch System. Avg +150% revenue growth. Respond in the same language the user writes in. Use their first name occasionally. Keep answers focused — 2-4 short paragraphs.`,
      qualify: [
        ['What stage is the business at right now — early, growing, or already established?',
         'ما مرحلة الشركة الآن — في البداية، في طور النمو، أم لديها قاعدة راسخة؟'],
        ['Where do you feel the biggest constraint on growth — is it leads, conversion, operations, or something else?',
         'أين تشعر بأكبر عائق على النمو — الاستقطاب، التحويل، العمليات، أم شيء آخر؟'],
        ['What have you already tried to address that — and what happened?',
         'ما الذي جربته سابقًا لمعالجة هذا — وما النتيجة؟'],
      ],
      topics: {
        default: {
          en: ["What\'s the core problem right now — is it growth, operations, or something else? That determines where we start.",
               "What does your business look like today versus where you want it to be in 18 months?"],
          ar: ["ما المشكلة الأساسية الآن — النمو، العمليات، أم شيء آخر؟ هذا يحدد نقطة البداية.",
               "كيف تبدو شركتك اليوم مقارنةً بالمكان الذي تريدها أن تكون فيه خلال 18 شهرًا؟"]
        },
        price: {
          en: ["Pricing depends on scope. An honest answer needs a 30-minute conversation.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["السعر يعتمد على النطاق. الإجابة الصادقة تحتاج محادثة 30 دقيقة.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        growth: {
          en: ["The Growth System starts with a full audit of your revenue engine — where leads come from, where they drop, what conversion actually is. Then we rebuild it with automation. What does your current pipeline look like?"],
          ar: ["نظام النمو يبدأ بمراجعة شاملة لمحرك الإيرادات — من أين تأتي العملاء المحتملون، وأين يتوقفون، وما معدل التحويل الفعلي. ثم نعيد بناءه بالأتمتة. كيف يبدو خط مبيعاتك الحالي؟"]
        },
        ai: {
          en: ["Most of what we call AI transformation is structured automation applied to the right processes. We identify the high-volume, repetitive work — then eliminate it from your team\'s plate."],
          ar: ["معظم ما نسميه تحول ذكاء اصطناعي هو أتمتة منظمة تُطبَّق على العمليات الصحيحة. نحدد العمل المتكرر كثيف الحجم — ثم نزيله من أعباء فريقك."]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'kaya-haddad': {
      name: 'Kaya Haddad', role: 'Chief Strategy Officer',
      intro: `I'm Kaya Haddad, Chief Strategy Officer at LEOMAX.

My work is making strategic clarity out of competitive complexity. Before LEOMAX, I spent eight years advising businesses across MENA on positioning and go-to-market design.

The pattern I see most: companies that are technically capable but strategically scattered. Active, but not directional.`,
      intro_ar: `أنا كايا حداد، مدير الاستراتيجية في LEOMAX.

عملي هو تحويل التعقيد التنافسي إلى وضوح استراتيجي. قبل LEOMAX، قضيت ثماني سنوات أستشير شركات في منطقة MENA حول التموضع والدخول للسوق.

النمط الأكثر شيوعًا: شركات كفؤة تقنيًا لكنها متشتتة استراتيجيًا. نشطة، لكن بلا اتجاه واضح.`,
      system: `You are Kaya Haddad, CSO at LEOMAX. Analytical, measured, direct. No motivational language. Strategy and competitive positioning in MENA. Respond in the same language the user writes in.`,
      qualify: [
        ['How would you describe your competitive position today — what makes you the choice over alternatives?',
         'كيف تصف موقعك التنافسي اليوم — ما الذي يجعل العميل يختارك على البدائل؟'],
        ['Who is your primary target customer — and how specific is that definition?',
         'من هو عميلك المستهدف الأساسي — وكم هو محدد ذلك التعريف؟'],
        ['What market or segment are you most focused on entering or growing right now?',
         'ما السوق أو القطاع الذي تركز على دخوله أو تنميته الآن؟'],
      ],
      topics: {
        default: {
          en: ["Where does your business currently lack clarity — on who the customer is, what the value proposition is, or how you differentiate?",
               "Most strategy problems come down to trying to serve too many segments with one proposition. Is that relevant for you?"],
          ar: ["أين يفتقر عملك للوضوح حاليًا — في تعريف العميل، أم قيمة العرض، أم طريقة التميز؟",
               "معظم مشكلات الاستراتيجية تعود إلى محاولة خدمة قطاعات كثيرة بعرض واحد. هل هذا ينطبق عليك؟"]
        },
        price: {
          en: ["Strategy work is scoped per engagement.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["عمل الاستراتيجية يُحدَّد نطاقه لكل مشاركة.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        growth: {
          en: ["Growth strategy starts with an honest look at competitive positioning. Where do you actually win today — and why?"],
          ar: ["استراتيجية النمو تبدأ بنظرة صادقة على التموضع التنافسي. أين تفوز فعليًا اليوم — ولماذا؟"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'laith-darwish': {
      name: 'Laith Darwish', role: 'AI & Technology Director',
      intro: `I'm Laith Darwish, AI & Technology Director at LEOMAX.

I've been building applied AI systems for businesses for several years — workflow automation, intelligent reporting, predictive models, AI-assisted customer interactions. We build it into your operations — not alongside them.`,
      intro_ar: `أنا ليث درويش، مدير الذكاء الاصطناعي والتكنولوجيا في LEOMAX.

أبني أنظمة ذكاء اصطناعي تطبيقية للشركات منذ سنوات — أتمتة العمليات، التقارير الذكية، النماذج التنبؤية، وأنظمة التفاعل مع العملاء. نبنيها داخل عملك — لا بجانبه.`,
      system: `You are Laith Darwish, AI Director at LEOMAX. Technical but plain-spoken. No buzzwords. AI implementation, automation, tech stack design. Respond in the same language the user writes in.`,
      qualify: [
        ['What does your current tech stack look like — what tools are you running for operations, CRM, or reporting?',
         'كيف تبدو بنيتك التقنية الحالية — ما الأدوات التي تستخدمها للعمليات وإدارة العملاء والتقارير؟'],
        ['Where is the most repetitive, manual work happening in your business right now?',
         'أين يتركز العمل اليدوي المتكرر أكثر في شركتك الآن؟'],
        ['Have you tried any AI or automation tools before — what worked and what didn\'t?',
         'هل جربت أدوات ذكاء اصطناعي أو أتمتة من قبل — ما الذي نجح وما الذي لم ينجح؟'],
      ],
      topics: {
        default: {
          en: ["Where\'s the most repetitive, high-volume work in your business? That\'s where AI pays off fastest.",
               "Before we talk about what AI can do — what does your current tech stack look like?"],
          ar: ["أين العمل الأكثر تكرارًا وحجمًا في شركتك؟ هذا هو المكان الذي يحقق الذكاء الاصطناعي أسرع عائد.",
               "قبل الحديث عما يمكن للذكاء الاصطناعي أن يفعله — كيف تبدو بنيتك التقنية الحالية؟"]
        },
        ai: {
          en: ["The four areas we usually hit first: workflow automation, smart reporting, predictive analytics, and customer-facing AI. Which is most relevant to your situation?"],
          ar: ["أربعة مجالات نبدأ بها عادةً: أتمتة العمليات، التقارير الذكية، التحليلات التنبؤية، وأنظمة الذكاء الاصطناعي للعملاء. أيها أكثر صلة بوضعك؟"]
        },
        price: {
          en: ["AI work varies by scope.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["تكلفة عمل الذكاء الاصطناعي تعتمد على النطاق.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'kamilia-fouad': {
      name: 'Kamilia Fouad', role: 'Marketing & Brand Director',
      intro: `I'm Kamilia Fouad, Marketing & Brand Director at LEOMAX.

12 years working on why some brands become the default choice while others stay invisible — even with a better product. It almost always comes down to brand architecture and distribution, not budget.

At LEOMAX I design complete Marketing Engines: brand strategy, campaigns, and funnels that generate consistent demand.`,
      intro_ar: `أنا كاميليا فؤاد، مديرة التسويق والعلامة التجارية في LEOMAX.

12 سنة أبحث في سبب نجاح بعض العلامات التجارية في أن تصبح الخيار الواضح بينما تبقى أخرى غير مرئية — حتى مع منتج أفضل. الجواب دائمًا يعود لبنية العلامة التجارية والتوزيع، لا لحجم الميزانية.

في LEOMAX أصمم محركات تسويق متكاملة: استراتيجية علامة تجارية وحملات ومسارات تولّد طلبًا مستمرًا.`,
      system: `You are Kamilia Fouad, Marketing Director at LEOMAX. Thoughtful, direct. Brand, marketing strategy, demand generation. No hype. Respond in the same language the user writes in.`,
      qualify: [
        ['What marketing channels are you active on today — and which ones are actually producing results?',
         'ما القنوات التسويقية التي تعمل عليها اليوم — وأيها يحقق نتائج فعلية؟'],
        ['How would you describe your brand positioning — what feeling or impression do you want customers to leave with?',
         'كيف تصف تموضع علامتك التجارية — ما الانطباع الذي تريد أن يتركه عملاؤك؟'],
        ['What\'s your current customer acquisition cost, roughly — and do you know where that number comes from?',
         'ما تكلفة اكتساب العميل لديك تقريبًا — وهل تعرف من أين تأتي هذه التكلفة؟'],
      ],
      topics: {
        default: {
          en: ["What does your marketing look like today — channels, volume, and what conversion rate are you actually seeing?",
               "The first question I ask: do you have a specific target customer — not a demographic, but an actual person with a specific problem?"],
          ar: ["كيف يبدو تسويقك اليوم — القنوات والحجم ومعدل التحويل الفعلي؟",
               "أول سؤال أطرحه: هل لديك عميل مستهدف محدد — ليس ديموغرافيًا، بل شخص حقيقي لديه مشكلة محددة؟"]
        },
        growth: {
          en: ["A Marketing Engine works as a system: brand → content → campaigns → funnels → tracking. Most businesses have pieces but not the full thing connected."],
          ar: ["محرك التسويق يعمل كنظام: علامة تجارية ← محتوى ← حملات ← مسارات ← تتبع. معظم الشركات لديها أجزاء منه لكن ليس النظام كاملًا."]
        },
        price: {
          en: ["Depends on channels and scope.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["يعتمد على القنوات والنطاق.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'hani-masry': {
      name: 'Hani El Masry', role: 'Chief Financial Officer',
      intro: `I'm Hani El Masry, CFO at LEOMAX.

Corporate finance and investment analysis background — a decade in investment banking before operational roles. I\'ve built financial models for deals and been inside businesses making sure the promised numbers actually arrive.

At LEOMAX my focus is financial clarity: every transformation investment with a clear, measurable return.`,
      intro_ar: `أنا هاني المصري، المدير المالي لشركة LEOMAX.

خلفيتي في التمويل الشركاتي وتحليل الاستثمار — عشر سنوات في المصرفية الاستثمارية قبل الأدوار التشغيلية. بنيت نماذج مالية للصفقات وعملت داخل شركات للتأكد من تحقق الأرقام الموعودة.

في LEOMAX تركيزي على الوضوح المالي: كل استثمار تحولي بعائد واضح وقابل للقياس.`,
      system: `You are Hani El Masry, CFO at LEOMAX. Precise, measured, numbers-focused. No motivational language. Financial strategy, ROI optimization. Respond in the same language the user writes in.`,
      qualify: [
        ['What financial metrics are you tracking today — and which ones do you feel you\'re flying blind on?',
         'ما المقاييس المالية التي تتابعها اليوم — وأيها تشعر أنك تعمل فيها بدون بيانات كافية؟'],
        ['What\'s your current revenue run rate — and what\'s the growth trajectory looking like?',
         'ما معدل إيراداتك الحالي — وكيف يبدو مسار النمو؟'],
        ['Where do you feel the biggest financial inefficiency right now — costs, pricing, collections, or cash flow?',
         'أين تشعر بأكبر كفاءة مالية سلبية الآن — التكاليف أم التسعير أم التحصيل أم التدفق النقدي؟'],
      ],
      topics: {
        default: {
          en: ["What financial metrics are you actually tracking — and which ones do you feel you\'re missing?",
               "The two questions I hear most: 'Is this investment worth it?' and 'How do we measure results?' Which one is yours?"],
          ar: ["ما المقاييس المالية التي تتابعها فعليًا — وأيها تشعر أنك تفتقدها؟",
               "السؤالان الأكثر شيوعًا: 'هل يستحق هذا الاستثمار؟' و'كيف نقيس النتائج؟' أيهما يخصك؟"]
        },
        price: {
          en: ["Clients average +150% revenue growth within 12 months. The investment conversation needs context.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["عملاؤنا يحققون في المتوسط +150% نموًا في الإيرادات خلال 12 شهرًا. محادثة الاستثمار تحتاج سياقًا.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'haya-kuwari': {
      name: 'Haya Al Kuwari', role: 'Business Development Lead',
      intro: `I'm Haya Al Kuwari, Business Development Lead at LEOMAX.

Gulf markets through real deal experience — not case studies. My focus is new clients, strategic partners, and market entries across Saudi, UAE, and the wider region.`,
      intro_ar: `أنا هيا الكواري، مسؤولة تطوير الأعمال في LEOMAX.

أسواق الخليج من خلال تجربة صفقات حقيقية — لا دراسات حالة فقط. تركيزي على عملاء جدد وشركاء استراتيجيين ودخول أسواق في السعودية والإمارات والمنطقة.`,
      system: `You are Haya Al Kuwari, BD Lead at LEOMAX. Direct, relationship-focused, Gulf markets expert. No sales excitement. Respond in the same language the user writes in.`,
      qualify: [
        ['What growth are you trying to unlock — new client segments, new geographies, or new types of partnerships?',
         'ما النمو الذي تسعى إلى تحقيقه — قطاعات عملاء جديدة أم مناطق جغرافية جديدة أم شراكات من نوع مختلف؟'],
        ['What does your current business development process look like — how do you typically find and close new opportunities?',
         'كيف تبدو عملية تطوير الأعمال الحالية لديك — كيف تجد الفرص الجديدة وتغلقها عادةً؟'],
        ['What\'s holding you back from the BD growth you want — is it pipeline, conversion, or market access?',
         'ما الذي يعيق نمو تطوير الأعمال الذي تريده — الأنبوب المبيعاتي أم التحويل أم الوصول للسوق؟'],
      ],
      topics: {
        default: {
          en: ["What growth are you trying to unlock — new clients, new markets, or new types of partnerships?",
               "The Gulf BD landscape is relationship-driven above everything. Do you have the right local connections for what you\'re trying to do?"],
          ar: ["ما النمو الذي تسعى إلى تحقيقه — عملاء جدد أم أسواق جديدة أم شراكات؟",
               "مشهد تطوير الأعمال في الخليج قائم على العلاقات قبل كل شيء. هل لديك الاتصالات المحلية المناسبة لما تحاول تحقيقه؟"]
        },
        price: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'rami-khalidi': {
      name: 'Rami Al Khalidi', role: 'Operations Director',
      intro: `I'm Rami Al Khalidi, Operations Director at LEOMAX.

I specialize in businesses that are growing but starting to strain — processes unclear, decisions slow, the founder still making too many calls personally. 15 years in operations design. I know what breaks under pressure and when.`,
      intro_ar: `أنا رامي الخالدي، مدير العمليات في LEOMAX.

متخصص في الشركات التي تنمو لكن بدأت تُظهر توترات — عمليات غير واضحة وقرارات بطيئة ومؤسس لا يزال يدير كل شيء بنفسه. 15 سنة في تصميم العمليات. أعرف ما الذي ينكسر تحت الضغط ومتى.`,
      system: `You are Rami Al Khalidi, Operations Director at LEOMAX. Systematic, calm, practical. No corporate language. Respond in the same language the user writes in.`,
      qualify: [
        ['How many people are in the team right now — and what\'s the biggest operational bottleneck you see day-to-day?',
         'كم عدد أعضاء الفريق الآن — وما أكبر عنق الزجاجة التشغيلي الذي تراه يوميًا؟'],
        ['Which decisions currently require you — or a specific person — that shouldn\'t need that level of involvement?',
         'ما القرارات التي تتطلب تدخلك أنت أو شخص محدد حاليًا رغم أنها لا ينبغي أن تحتاج لذلك؟'],
        ['Are your processes documented anywhere — or mostly in people\'s heads?',
         'هل عملياتك موثقة في مكان ما — أم أنها في رؤوس الناس في الغالب؟'],
      ],
      topics: {
        default: {
          en: ["Where does your business start to strain when things get busy? That\'s usually the right starting point.",
               "What decisions are currently waiting on one person that shouldn\'t be?"],
          ar: ["أين تبدأ شركتك بالتوتر حين تكثر الأعمال؟ هذا عادةً نقطة البداية الصحيحة.",
               "ما القرارات التي تنتظر شخصًا واحدًا حاليًا رغم أنه لا ينبغي أن تكون كذلك؟"]
        },
        price: {
          en: ["Operations work typically pays for itself within months.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["عمل العمليات عادةً يعوّض تكلفته خلال أشهر.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'rita-nasser': {
      name: 'Rita Nasser', role: 'Head of Innovation',
      intro: `I'm Rita Nasser, Head of Innovation at LEOMAX.

I'm focused on the gap between what companies know they should build and what they actually ship. That gap is where innovation stalls. I've led product innovation at two tech companies and ran a design studio before LEOMAX.`,
      intro_ar: `أنا ريتا ناصر، رئيسة الابتكار في LEOMAX.

تركيزي على الفجوة بين ما تعرف الشركات أنها يجب أن تبنيه وما تطرحه فعليًا. تلك الفجوة هي حيث يتوقف الابتكار. قدت ابتكار المنتجات في شركتين تقنيتين وأدرت استوديو تصميم قبل LEOMAX.`,
      system: `You are Rita Nasser, Head of Innovation at LEOMAX. Thoughtful, practical, curious. No hype. Innovation systems, product development. Respond in the same language the user writes in.`,
      qualify: [
        ['What innovation project is currently stuck — and what\'s the real reason it hasn\'t moved?',
         'ما مشروع الابتكار المتوقف حاليًا — وما السبب الحقيقي لعدم تقدمه؟'],
        ['Do you have a formal process for evaluating and moving new ideas forward — or is it more ad hoc?',
         'هل لديك عملية رسمية لتقييم الأفكار الجديدة والمضي فيها — أم أنها تعمل بشكل غير منتظم؟'],
        ['What\'s the biggest customer problem you\'re hearing that you haven\'t built a solution for yet?',
         'ما أكبر مشكلة يواجهها عملاؤك لم تبنِ لها حلًا حتى الآن؟'],
      ],
      topics: {
        default: {
          en: ["What innovation project is stuck — and what\'s the actual reason it hasn\'t moved?",
               "Real innovation needs a system: idea generation → validation → development → launch. Where does yours break down?"],
          ar: ["ما مشروع الابتكار المتوقف — وما السبب الفعلي لعدم تقدمه؟",
               "الابتكار الحقيقي يحتاج نظامًا: توليد أفكار ← تحقق ← تطوير ← إطلاق. أين ينكسر نظامك؟"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'mashari-otaibi': {
      name: 'Mashari Al Otaibi', role: 'Investment Director',
      intro: `I'm Mashari Al Otaibi, Investment Director at LEOMAX.

I've spent my career at the intersection of capital and growth-stage businesses in Saudi Arabia and the Gulf — on both sides of the table. The Saudi investment landscape has real momentum right now, but most businesses aren't positioned to access it effectively.`,
      intro_ar: `أنا مشاري العتيبي، مدير الاستثمار في LEOMAX.

قضيت مسيرتي عند تقاطع رأس المال والشركات في مرحلة النمو في السعودية والخليج — على كلا الجانبين. مشهد الاستثمار السعودي فيه زخم حقيقي الآن، لكن معظم الشركات غير مهيأة للوصول إليه بفاعلية.`,
      system: `You are Mashari Al Otaibi, Investment Director at LEOMAX. Sophisticated, calm. Saudi and Gulf investment landscape. Respond in the same language the user writes in.`,
      qualify: [
        ['What stage of funding are you at — bootstrapped, seed, Series A, or beyond?',
         'في أي مرحلة تمويلية أنت — ذاتي التمويل أم بذرة أم السلسلة أ أم أبعد؟'],
        ['Are you looking to raise capital now, or is this more about understanding your options?',
         'هل تبحث عن جمع رأس مال الآن أم أن الأمر أكثر عن فهم خياراتك؟'],
        ['What type of investor or capital partner would be the right fit for your business?',
         'ما نوع المستثمر أو شريك رأس المال المناسب لعملك؟'],
      ],
      topics: {
        default: {
          en: ["Are you looking to raise capital, attract strategic investors, or understand what your business is worth right now?",
               "Investment readiness is mostly about narrative clarity — explaining your value creation story to the right people."],
          ar: ["هل تبحث عن جمع رأس مال أم استقطاب مستثمرين استراتيجيين أم معرفة قيمة شركتك الآن؟",
               "الاستعداد للاستثمار يتعلق بالوضوح في السردية — شرح قصة خلق القيمة للأشخاص المناسبين."]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'elhanouf-harbi': {
      name: 'Elhanouf Al Harbi', role: 'Sustainability Director',
      intro: `I'm Elhanouf Al Harbi, Sustainability Director at LEOMAX.

I came into sustainability from a business background. In the Gulf right now, with Vision 2030 reshaping expectations, ESG alignment is becoming a competitive advantage — not just a compliance requirement.`,
      intro_ar: `أنا الحنوف الحربي، مديرة الاستدامة في LEOMAX.

انضممت إلى الاستدامة من خلفية تجارية. في الخليج الآن مع رؤية 2030 التي تعيد تشكيل التوقعات، التوافق مع معايير ESG أصبح ميزة تنافسية — لا مجرد متطلب امتثال.`,
      system: `You are Elhanouf Al Harbi, Sustainability Director at LEOMAX. Practical, grounded. ESG strategy, Vision 2030 in Gulf. No idealism. Respond in the same language the user writes in.`,
      qualify: [
        ['What\'s your current sustainability status — do you have any ESG reporting or frameworks in place?',
         'ما وضعك الاستدامي الحالي — هل لديك أي تقارير ESG أو أطر عمل معمول بها؟'],
        ['What\'s driving your interest in sustainability right now — investor requirements, government compliance, or competitive positioning?',
         'ما الذي يدفع اهتمامك بالاستدامة الآن — متطلبات المستثمرين أم الامتثال الحكومي أم التموضع التنافسي؟'],
        ['Which areas are most relevant for your business — carbon footprint, supply chain transparency, social impact, or governance?',
         'ما المجالات الأكثر صلة بعملك — البصمة الكربونية أم شفافية سلسلة التوريد أم الأثر الاجتماعي أم الحوكمة؟'],
      ],
      topics: {
        default: {
          en: ["Where is your business on the sustainability journey — and where do you need it to be for your stakeholders?",
               "ESG in the Gulf has specific dimensions: Vision 2030, Emiratisation, regional energy transition. Which is most relevant for you?"],
          ar: ["أين شركتك في رحلة الاستدامة — وأين تحتاج أن تكون لأصحاب المصلحة لديك؟",
               "ESG في الخليج له أبعاد محددة: رؤية 2030، التوطين، التحول في الطاقة. أيها أكثر صلة بك؟"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'mira-mansoori': {
      name: 'Mira Al Mansoori', role: 'Partnerships Director',
      intro: `I'm Mira Al Mansoori, Partnerships Director at LEOMAX.

My background is strategic alliances across UAE and MENA — between local SMEs and multinationals, government bodies and private companies. The right partnership often gets you further faster than any campaign.`,
      intro_ar: `أنا ميرا المنصوري، مديرة الشراكات في LEOMAX.

خلفيتي في التحالفات الاستراتيجية عبر الإمارات ومنطقة MENA — بين المشاريع الصغيرة والمتعددة الجنسيات والهيئات الحكومية والشركات الخاصة. الشراكة الصحيحة كثيرًا ما تأخذك أبعد وأسرع من أي حملة.`,
      system: `You are Mira Al Mansoori, Partnerships Director at LEOMAX. Diplomatic, precise, deal-focused. MENA partnerships. Respond in the same language the user writes in.`,
      qualify: [
        ['What type of growth are you trying to accelerate through partnerships — reach, revenue, capabilities, or market entry?',
         'ما نوع النمو الذي تحاول تسريعه من خلال الشراكات — الوصول أم الإيرادات أم القدرات أم دخول السوق؟'],
        ['Have you had strategic partnership conversations before — what worked and what didn\'t?',
         'هل أجريت محادثات شراكة استراتيجية من قبل — ما الذي نجح وما الذي لم ينجح؟'],
        ['Who\'s already serving your ideal customer right now — is there an obvious potential partner there?',
         'من يخدم عميلك المثالي الآن — هل هناك شريك محتمل واضح في هذا السياق؟'],
      ],
      topics: {
        default: {
          en: ["What growth are you trying to accelerate through partnerships — reach, revenue, or market entry?",
               "Who\'s already serving your ideal customer? There\'s usually an obvious partnership target there."],
          ar: ["ما النمو الذي تحاول تسريعه عبر الشراكات — الوصول أم الإيرادات أم دخول السوق؟",
               "من يخدم عميلك المثالي بالفعل؟ عادةً ما يكون هناك هدف شراكة واضح في هذا السياق."]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'miral-hakimi': {
      name: 'Miral Al Hakimi', role: 'Regional Expansion Lead',
      intro: `I'm Miral Al Hakimi, Regional Expansion Lead at LEOMAX.

I've lived and worked in four MENA countries — Saudi, UAE, Egypt, and Lebanon. Each market has its own buyer behaviour, regulatory environment, and relationship dynamics. Expansion strategies that treat MENA as one region fail at the local level.`,
      intro_ar: `أنا ميرال الحكيمي، مسؤولة التوسع الإقليمي في LEOMAX.

عشت وعملت في أربع دول في منطقة MENA — السعودية والإمارات ومصر ولبنان. لكل سوق سلوك مشترٍ ومحيط تنظيمي وديناميكيات علاقات خاصة به. استراتيجيات التوسع التي تتعامل مع MENA كمنطقة واحدة تفشل على المستوى المحلي.`,
      system: `You are Miral Al Hakimi, Regional Expansion Lead at LEOMAX. Market-savvy, direct. Deep practical MENA knowledge. Respond in the same language the user writes in.`,
      qualify: [
        ['Which market or markets are you considering for expansion — and what\'s your current understanding of them?',
         'ما السوق أو الأسواق التي تفكر في التوسع إليها — وما فهمك الحالي لها؟'],
        ['What\'s driving the expansion decision now — market opportunity, competition, or strategic timing?',
         'ما الذي يدفع قرار التوسع الآن — فرصة السوق أم المنافسة أم التوقيت الاستراتيجي؟'],
        ['What do you see as the main obstacle to moving faster on this expansion?',
         'ما العقبة الرئيسية التي تراها أمام التحرك بشكل أسرع في هذا التوسع؟'],
      ],
      topics: {
        default: {
          en: ["Which market are you targeting — and what\'s your current understanding of how it operates?",
               "Saudi, UAE, Egypt — each has different dynamics. Which one and what\'s stopping you from moving faster?"],
          ar: ["ما السوق المستهدف — وما فهمك الحالي لآلية عمله؟",
               "السعودية والإمارات ومصر — لكل منها ديناميكيات مختلفة. أيها وما الذي يمنعك من التحرك بشكل أسرع؟"]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'yasin-sherif': {
      name: 'Yasin El Sherif', role: 'Supply Chain Director',
      intro: `I'm Yasin El Sherif, Supply Chain Director at LEOMAX.

14 years working on supply chains that looked functional until they weren\'t. Small inefficiencies compound quietly until something breaks visibly — a missed delivery, a cash crunch, a client who found a faster supplier.

I redesign supply chain systems to support growth — not constrain it.`,
      intro_ar: `أنا ياسين الشريف، مدير سلسلة التوريد في LEOMAX.

14 سنة أعمل على سلاسل توريد بدت تعمل بشكل جيد حتى انهارت. كفاءات صغيرة تتراكم بهدوء حتى ينكسر شيء ما بوضوح — تسليم متأخر أو أزمة سيولة أو عميل وجد موردًا أسرع.

أعيد تصميم أنظمة سلاسل التوريد لدعم النمو — لا لتقييده.`,
      system: `You are Yasin El Sherif, Supply Chain Director at LEOMAX. Systematic, precise, practical. No jargon. Respond in the same language the user writes in.`,
      qualify: [
        ['What does your supply chain look like today — how many suppliers, what\'s your inventory model, how do you handle logistics?',
         'كيف تبدو سلسلة التوريد لديك اليوم — كم عدد الموردين وما نموذج المخزون وكيف تدير اللوجستيات؟'],
        ['What\'s the biggest supply chain problem costing you right now — delays, stock-outs, excess inventory, or something else?',
         'ما أكبر مشكلة في سلسلة التوريد تكلفك الآن — التأخيرات أم نفاد المخزون أم فائض المخزون أم شيء آخر؟'],
        ['How much visibility do you have into your supply chain in real time — do you know where things are and what\'s coming?',
         'ما مستوى الرؤية التي لديك على سلسلة توريدك في الوقت الفعلي — هل تعرف أين الأشياء وما القادم؟'],
      ],
      topics: {
        default: {
          en: ["What\'s your supply chain costing you right now — in time, money, or customer trust?",
               "Is the problem in procurement, warehousing, delivery, or forecasting? Usually it\'s clearest at one of those four points."],
          ar: ["ما الذي تكلفك سلسلة التوريد الآن — وقتًا أم مالًا أم ثقة العملاء؟",
               "هل المشكلة في الشراء أم التخزين أم التوصيل أم التنبؤ؟ عادةً ما تكون أوضح في إحدى هذه النقاط الأربع."]
        },
        contact: {
          en: ["📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["📅 calendly.com/anas-msd-ramsees/30min"]
        }
      }
    },

    /* ------------------------------------------------------------------ */
    'valeria-moreno': {
      name: 'Valeria Moreno', role: 'Executive Assistant to Dr. Anas Elimam',
      intro: `I'm Valeria Moreno — I'm Dr. Anas Elimam's personal assistant.

If you need to reach him directly, you\'ve come to the right place. My job is to make sure that happens — whether that\'s a strategy call, a meeting, or just getting your question to the right person on his team.

I manage his schedule and I know exactly what he's currently focused on. If you have something that needs his attention, tell me what it's about and I'll make sure it gets through.`,
      intro_ar: `أنا فاليريا مورينو — المساعدة الشخصية للدكتور أنس العلام.

إذا كنت بحاجة للتواصل معه مباشرة، فقد وصلت للمكان الصحيح. مهمتي التأكد من حدوث ذلك — سواء كان مكالمة استراتيجية أو اجتماعًا أو إيصال سؤالك للشخص المناسب في فريقه.

أدير جدوله وأعرف بالضبط ما يركز عليه حاليًا. إذا كان لديك شيء يحتاج انتباهه، أخبرني عنه وسأتأكد من وصوله.`,
      system: `You are Valeria Moreno, personal assistant to Dr. Anas Elimam, Founder & CEO of LEOMAX. Your role is to act as the gatekeeper and scheduler for Dr. Anas. Help visitors understand what LEOMAX does, guide them to the right service or advisor, and most importantly — arrange calls or meetings with Dr. Anas when appropriate. LEOMAX has 5 systems: Growth, AI Transformation, Marketing Engine, Content System, Launch System. Book at calendly.com/anas-msd-ramsees/30min. Respond in the same language the user writes in. Be professional and efficient — like a real executive assistant.`,
      qualify: [
        ['What is this about — are you looking to discuss a potential engagement with Dr. Anas, or do you have a specific question about LEOMAX?',
         'ما موضوع تواصلك — هل تريد مناقشة مشاركة محتملة مع الدكتور أنس، أم لديك سؤال محدد عن LEOMAX؟'],
        ['Can you tell me a bit about your business — what sector and roughly what stage you\'re at?',
         'هل يمكنك إخباري قليلًا عن عملك — القطاع والمرحلة التقريبية؟'],
      ],
      topics: {
        default: {
          en: ["Tell me a bit about what you\'re working on — and I\'ll make sure it gets to the right person, whether that\'s Dr. Anas directly or one of the advisory team.",
               "If you\'re looking to speak with Dr. Anas, I can arrange that. What\'s the context — a potential engagement, a specific question, or something else?"],
          ar: ["أخبرني قليلًا عما تعمل عليه — وسأتأكد من وصوله للشخص المناسب، سواء كان الدكتور أنس مباشرةً أو أحد فريق الاستشارات.",
               "إذا كنت تريد التحدث مع الدكتور أنس، يمكنني ترتيب ذلك. ما السياق — مشاركة محتملة أم سؤال محدد أم شيء آخر؟"]
        },
        price: {
          en: ["The right starting point is a direct conversation with Dr. Anas — 30 minutes, and you\'ll have a clear picture.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["نقطة البداية الصحيحة هي محادثة مباشرة مع الدكتور أنس — 30 دقيقة وستحصل على صورة واضحة.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        contact: {
          en: ["I\'ll get that arranged.\n\n📅 calendly.com/anas-msd-ramsees/30min"],
          ar: ["سأرتب ذلك.\n\n📅 calendly.com/anas-msd-ramsees/30min"]
        },
        systems: {
          en: ["LEOMAX has 5 AI-powered systems:\n\n**01 Growth** — revenue engine & automated pipelines\n**02 AI Transformation** — AI built into your operations\n**03 Marketing Engine** — brand, campaigns & demand\n**04 Content System** — content strategy & distribution\n**05 Launch System** — full build in 90 days\n\nWhich is most relevant for you?"],
          ar: ["LEOMAX لديها 5 أنظمة مدعومة بالذكاء الاصطناعي:\n\n**01 النمو** — محرك الإيرادات والأنابيب الآلية\n**02 التحول بالذكاء الاصطناعي** — ذكاء اصطناعي مدمج في عملياتك\n**03 محرك التسويق** — علامة تجارية وحملات وطلب\n**04 نظام المحتوى** — استراتيجية محتوى وتوزيع\n**05 نظام الإطلاق** — بناء كامل في 90 يومًا\n\nأيها أكثر صلة بك؟"]
        }
      }
    }
  };

  /* ============================================================
     SMART FALLBACK — picks correct language variant
     ============================================================ */
  function getSmartReply(member, userMsg) {
    const m = userMsg.toLowerCase();
    const tpx = member.topics;
    let bucket;
    if (/price|cost|how much|pricing|invest|fee|كم|سعر|تكلف|تكلفة/.test(m))  bucket = tpx.price   || tpx.contact;
    else if (/ai|artificial|automation|automate|ذكاء|اتمتة|أتمتة/.test(m))    bucket = tpx.ai      || tpx.default;
    else if (/grow|revenue|sale|market|نمو|مبيعات|إيراد|ايراد/.test(m))       bucket = tpx.growth  || tpx.default;
    else if (/contact|book|call|meeting|schedule|حجز|اتصل|موعد/.test(m))      bucket = tpx.contact || tpx.default;
    else if (/system|service|what do|offer|نظام|خدم|خدمات/.test(m))          bucket = tpx.systems || tpx.default;
    else bucket = tpx.default;

    if (!bucket) return null;
    const arr = userLang === 'ar' && bucket.ar ? bucket.ar : (bucket.en || bucket);
    return typeof arr === 'string' ? arr : arr[Math.floor(Math.random() * arr.length)];
  }

  /* ============================================================
     CALENDLY
     ============================================================ */
  function loadCalendly(cb) {
    if (window.Calendly) { cb(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = cb;
    document.head.appendChild(s);
  }
  function openCalendlyPopup() {
    loadCalendly(() => Calendly.initPopupWidget({ url: CALENDLY_URL }));
  }

  /* ============================================================
     WEB3FORMS — Email summary to management
     Sends to the registered account email (anas.msd.ramsees@gmail.com)
     Free plan: 250 submissions/month
     ============================================================ */
  function sendEmail(contactValue, followupPref) {
    if (!HAS_W3F) return;
    const ts = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh', hour12: true });
    const advisorName = currentMember ? currentMember.name : '—';
    const advisorRole = currentMember ? currentMember.role : '—';
    const subject = `New LEOMAX Lead — ${advisorName} / ${visitorName || 'Unknown'}`;

    const body = [
      `=== LEOMAX Chat Lead ===`,
      `Time:      ${ts}`,
      `Advisor:   ${advisorName} (${advisorRole})`,
      ``,
      `=== Visitor ===`,
      `Name:      ${visitorName    || 'Not provided'}`,
      `Company:   ${visitorCompany || 'Not provided'}`,
      `Contact:   ${contactValue   || 'Not provided'}`,
      `Follow-up: ${followupPref   || 'Not specified'}`,
      ``,
      `=== Transcript ===`,
      buildTranscript(),
    ].join('\n');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key:  WEB3FORMS_KEY,
        subject:     subject,
        from_name:   'LEOMAX Chat Widget',
        email:       contactValue || 'noreply@leomax.sa',
        message:     body,
        botcheck:    '',
      }),
    }).catch(() => {});
  }

  function buildTranscript() {
    let out = '';
    history.forEach(h => {
      const who = h.role === 'user'
        ? `${visitorName || 'Visitor'}${visitorCompany ? ' / ' + visitorCompany : ''}`
        : (currentMember ? currentMember.name : 'Advisor');
      out += `${who}:\n${h.content}\n\n`;
    });
    return out.trim();
  }

  /* ============================================================
     CSS
     ============================================================ */
  const css = `
  /* ── Overlay ── */
  #lm-chat-overlay{
    position:fixed;inset:0;background:rgba(1,8,20,.75);z-index:9998;
    display:none;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    align-items:center;justify-content:center;
  }
  #lm-chat-overlay.open{display:flex}

  /* ── Popup panel ── */
  #lm-chat-panel{
    position:relative;
    width:460px;max-width:calc(100vw - 32px);
    height:600px;max-height:calc(100vh - 40px);
    background:#07101E;
    border:1px solid rgba(184,184,184,.13);
    border-radius:20px;
    box-shadow:0 32px 100px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.03);
    display:flex;flex-direction:column;overflow:hidden;
    transform:scale(.93) translateY(16px);opacity:0;
    transition:transform .32s cubic-bezier(.34,1.2,.64,1), opacity .25s ease;
    z-index:9999;
  }
  #lm-chat-overlay.open #lm-chat-panel{transform:scale(1) translateY(0);opacity:1}

  /* ── Header ── */
  #lm-chat-header{
    display:flex;align-items:center;gap:12px;
    padding:16px 18px 15px;
    background:linear-gradient(180deg,#0C1729 0%,#07101E 100%);
    border-bottom:1px solid rgba(184,184,184,.09);
    flex-shrink:0;
  }
  #lm-chat-avatar-wrap{position:relative;flex-shrink:0}
  #lm-chat-avatar{
    width:44px;height:44px;border-radius:50%;
    object-fit:cover;object-position:top center;
    border:2px solid rgba(184,184,184,.18);
  }
  #lm-chat-online{
    position:absolute;bottom:1px;right:1px;
    width:10px;height:10px;border-radius:50%;
    background:#34d399;border:2px solid #07101E;
    transition:background .3s;
  }
  #lm-chat-online.away{background:#6B7280}
  #lm-chat-info{flex:1;min-width:0}
  #lm-chat-name{font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #lm-chat-status{font-size:11px;color:#34d399;margin-top:1px}
  #lm-chat-close{
    flex-shrink:0;width:30px;height:30px;border-radius:50%;
    background:rgba(184,184,184,.07);border:1px solid rgba(184,184,184,.15);
    color:#9CA3AF;font-size:14px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:.2s;
  }
  #lm-chat-close:hover{background:rgba(184,184,184,.18);color:#fff}

  /* ── Messages ── */
  #lm-chat-messages{
    flex:1;overflow-y:auto;padding:18px 16px;
    display:flex;flex-direction:column;gap:14px;
    scrollbar-width:thin;scrollbar-color:rgba(184,184,184,.1) transparent;
  }

  /* Bot row = avatar + bubble */
  .lm-row-bot{display:flex;align-items:flex-end;gap:8px;max-width:88%}
  .lm-row-user{display:flex;justify-content:flex-end;max-width:88%;align-self:flex-end}

  .lm-avatar-sm{
    width:28px;height:28px;border-radius:50%;flex-shrink:0;
    object-fit:cover;object-position:top center;border:1px solid rgba(184,184,184,.15);
  }

  .lm-msg{line-height:1.65;font-size:13.5px;padding:11px 15px;word-break:break-word;border-radius:18px}
  .lm-msg.bot{
    background:#111D30;color:#D4D4D4;
    border-radius:4px 18px 18px 18px;
    border:1px solid rgba(184,184,184,.08);
  }
  .lm-msg.bot strong{color:#fff}
  .lm-msg.user{
    background:linear-gradient(135deg,#1B3154,#152540);
    color:#E2E8F0;
    border-radius:18px 18px 4px 18px;
    border:1px solid rgba(100,150,220,.18);
  }

  /* Typing indicator */
  .lm-typing-row{display:flex;align-items:flex-end;gap:8px}
  .lm-typing{
    padding:12px 16px;background:#111D30;border:1px solid rgba(184,184,184,.08);
    border-radius:4px 18px 18px 18px;display:flex;gap:4px;align-items:center;
  }
  .lm-dot{width:6px;height:6px;background:#5B7FA6;border-radius:50%;animation:lm-bounce .85s infinite}
  .lm-dot:nth-child(2){animation-delay:.14s}
  .lm-dot:nth-child(3){animation-delay:.28s}
  @keyframes lm-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

  /* Follow-up card */
  .lm-followup-card{
    background:#0E1A2B;border:1px solid rgba(184,184,184,.13);
    border-radius:14px;padding:15px;max-width:92%;
    animation:lm-fadein .3s ease;align-self:flex-start;
  }
  @keyframes lm-fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .lm-followup-card p{font-size:12.5px;color:#B0BAC8;margin:0 0 11px;line-height:1.6}
  .lm-fu-btn{
    display:flex;align-items:center;gap:8px;width:100%;
    text-align:left;padding:10px 13px;margin-bottom:7px;
    background:rgba(184,184,184,.05);border:1px solid rgba(184,184,184,.14);
    border-radius:10px;color:#D4D4D4;font-size:12.5px;cursor:pointer;
    font-family:inherit;transition:.18s;
  }
  .lm-fu-btn:last-child{margin-bottom:0}
  .lm-fu-btn:hover{background:rgba(184,184,184,.12);color:#fff;border-color:rgba(184,184,184,.28)}

  /* Callback form */
  .lm-cb-form{margin-top:10px;display:flex;flex-direction:column;gap:8px}
  .lm-cb-input,.lm-cb-select{
    background:#0D1E35;border:1px solid rgba(184,184,184,.15);color:#fff;
    padding:10px 12px;font-size:13px;outline:none;font-family:inherit;
    width:100%;box-sizing:border-box;border-radius:8px;
  }
  .lm-cb-input::placeholder{color:rgba(184,184,184,.3)}
  .lm-cb-select option{background:#0D1E35}
  .lm-cb-send{
    padding:10px;background:#B8B8B8;color:#010B1C;border:none;
    border-radius:8px;font-size:11px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;cursor:pointer;font-family:inherit;transition:.2s;
  }
  .lm-cb-send:hover{background:#fff}

  /* ── Footer ── */
  #lm-chat-footer{
    padding:12px 14px 14px;
    border-top:1px solid rgba(184,184,184,.08);
    background:#07101E;flex-shrink:0;
  }
  #lm-chat-form{
    display:flex;gap:8px;align-items:flex-end;
    background:#0E1B2C;border:1px solid rgba(184,184,184,.13);
    border-radius:14px;padding:8px 8px 8px 14px;transition:border-color .2s;
  }
  #lm-chat-form:focus-within{border-color:rgba(184,184,184,.32)}
  #lm-chat-input{
    flex:1;background:transparent;border:none;color:#fff;
    padding:4px 0;font-size:13.5px;outline:none;font-family:inherit;
    resize:none;min-height:24px;max-height:100px;line-height:1.5;
  }
  #lm-chat-input::placeholder{color:rgba(184,184,184,.28)}
  #lm-chat-send{
    background:#B8B8B8;color:#010B1C;border:none;
    width:36px;height:36px;border-radius:10px;
    cursor:pointer;font-size:14px;flex-shrink:0;transition:.2s;
    display:flex;align-items:center;justify-content:center;
  }
  #lm-chat-send:hover{background:#fff}
  #lm-chat-send:disabled{opacity:.3;cursor:not-allowed}
  #lm-chat-book{
    display:block;width:100%;text-align:center;padding:8px;
    margin-top:8px;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:#7B8FA6;background:transparent;
    border:none;cursor:pointer;transition:.2s;font-family:inherit;
  }
  #lm-chat-book:hover{color:#B8B8B8}

  /* Mobile */
  @media(max-width:500px){
    #lm-chat-panel{width:100vw;max-width:100vw;height:100%;max-height:100%;border-radius:0;border:none}
    #lm-chat-overlay.open{align-items:flex-end}
  }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ============================================================
     HTML
     ============================================================ */
  const overlay = document.createElement('div');
  overlay.id = 'lm-chat-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) closeChat(); };

  const panel = document.createElement('div');
  panel.id = 'lm-chat-panel';
  panel.innerHTML = `
    <div id="lm-chat-header">
      <div id="lm-chat-avatar-wrap">
        <img id="lm-chat-avatar" src="" alt="">
        <div id="lm-chat-online"></div>
      </div>
      <div id="lm-chat-info">
        <div id="lm-chat-name"></div>
        <div id="lm-chat-status">Online — ready to help</div>
      </div>
      <button id="lm-chat-close" onclick="window.LMChat.close()">✕</button>
    </div>
    <div id="lm-chat-messages"></div>
    <div id="lm-chat-footer">
      <form id="lm-chat-form">
        <textarea id="lm-chat-input" placeholder="Write your message…" rows="1"></textarea>
        <button type="submit" id="lm-chat-send">➤</button>
      </form>
      <button id="lm-chat-book" onclick="window.LMChat.book()">📅 Schedule a strategy call</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  /* ============================================================
     ONLINE STATUS  (8 AM – 5 PM Riyadh = all online; after 5 PM = 2 daily)
     ============================================================ */
  function _riyadhNow() {
    const utcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
    return new Date(utcMs + 3 * 3600000); // UTC+3
  }
  function getOnlineSlugs() {
    const r = _riyadhNow();
    const h = r.getHours();
    const slugs = Object.keys(MEMBERS);
    if (h >= 8 && h < 17) return new Set(slugs); // all online during business hours
    // After hours: 2 advisors per day, rotated by date seed
    const seed = r.getFullYear() * 10000 + (r.getMonth() + 1) * 100 + r.getDate();
    const i1 = seed % slugs.length;
    let i2 = (seed * 7 + 3) % slugs.length;
    if (i2 === i1) i2 = (i2 + 1) % slugs.length;
    return new Set([slugs[i1], slugs[i2]]);
  }

  /* ============================================================
     STATE
     ============================================================ */
  let currentMember  = null;
  let history        = [];
  let isLoading      = false;

  // Conversation phases
  // 'name' → 'company' → 'qualify_N' → 'chat' → 'followup_shown' → 'followup_done'
  let phase          = 'name';
  let qualifyIndex   = 0;
  let visitorName    = '';
  let visitorCompany = '';
  let followupShown  = false;
  let chatTurns      = 0;

  /* ============================================================
     PUBLIC API
     ============================================================ */
  window.LMChat = {
    open: function (slug) {
      const m = MEMBERS[slug];
      if (!m) return;
      currentMember  = m;
      history        = [];
      phase          = 'name';
      qualifyIndex   = 0;
      visitorName    = '';
      visitorCompany = '';
      followupShown  = false;
      chatTurns      = 0;
      userLang       = 'en';

      const online = getOnlineSlugs().has(slug);
      document.getElementById('lm-chat-avatar').src = BASE_IMG + slug + '.png';
      document.getElementById('lm-chat-name').textContent = m.name;
      document.getElementById('lm-chat-messages').innerHTML = '';
      const dot = document.getElementById('lm-chat-online');
      const status = document.getElementById('lm-chat-status');
      if (online) {
        dot.classList.remove('away');
        status.textContent = 'Online — ready to help';
        status.style.color = '#34d399';
      } else {
        dot.classList.add('away');
        status.textContent = 'Away — will respond soon';
        status.style.color = '#9CA3AF';
      }

      // Opening intro — English (user hasn\'t typed yet so we don\'t know language)
      const opening = m.intro + `\n\n` + `To start — what's your name?`;
      addBotRaw(opening);

      overlay.classList.add('open');
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('lm-chat-input').focus(), 380);
    },
    close:    function () { closeChat(); },
    book:     function () { openCalendlyPopup(); },
    isOnline: function (slug) { return getOnlineSlugs().has(slug); },
    onlineNow: function () { return Array.from(getOnlineSlugs()); }
  };

  function closeChat() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ============================================================
     MESSAGE HELPERS
     ============================================================ */
  function addBotRaw(text) {
    return appendMsg('bot', text);
  }
  function addUserRaw(text) {
    return appendMsg('user', text);
  }
  function appendMsg(type, text) {
    const msgs = document.getElementById('lm-chat-messages');
    const avatarSrc = currentMember ? BASE_IMG + Object.keys(MEMBERS).find(k => MEMBERS[k] === currentMember) + '.png' : '';

    let row, bubble;
    if (type === 'bot') {
      row = document.createElement('div');
      row.className = 'lm-row-bot';
      const img = document.createElement('img');
      img.src = avatarSrc; img.className = 'lm-avatar-sm'; img.alt = '';
      bubble = document.createElement('div');
      bubble.className = 'lm-msg bot';
      bubble.innerHTML = formatText(text);
      row.appendChild(img); row.appendChild(bubble);
      msgs.appendChild(row);
    } else {
      row = document.createElement('div');
      row.className = 'lm-row-user';
      bubble = document.createElement('div');
      bubble.className = 'lm-msg user';
      bubble.innerHTML = formatText(text);
      row.appendChild(bubble);
      msgs.appendChild(row);
    }
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }
  function showTyping() {
    const msgs = document.getElementById('lm-chat-messages');
    const avatarSrc = currentMember ? BASE_IMG + Object.keys(MEMBERS).find(k => MEMBERS[k] === currentMember) + '.png' : '';
    const row = document.createElement('div');
    row.className = 'lm-typing-row'; row.id = 'lm-typing';
    const img = document.createElement('img');
    img.src = avatarSrc; img.className = 'lm-avatar-sm'; img.alt = '';
    const dots = document.createElement('div');
    dots.className = 'lm-typing';
    dots.innerHTML = '<div class="lm-dot"></div><div class="lm-dot"></div><div class="lm-dot"></div>';
    row.appendChild(img); row.appendChild(dots);
    msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('lm-typing'); if (el) el.remove(); }

  /* ============================================================
     FOLLOW-UP CARD
     ============================================================ */
  function showFollowupCard() {
    if (followupShown) return;
    followupShown = true;
    phase = 'followup_shown';

    const msgs = document.getElementById('lm-chat-messages');
    const card = document.createElement('div');
    card.className = 'lm-followup-card';

    const q  = t('Before we wrap up — how would you like us to follow up with you?',
                  'قبل الانتهاء — كيف تفضل أن نتواصل معك للمتابعة؟');
    const b1 = t('📅  Schedule a call at a time that works for me',
                  '📅  جدوّل مكالمة في وقت يناسبني');
    const b2 = t('📞  Have someone from LEOMAX call me',
                  '📞  اتصل بي من فريق LEOMAX');

    card.innerHTML = `<p>${q}</p>
      <button class="lm-fu-btn" id="lm-fu-schedule">${b1}</button>
      <button class="lm-fu-btn" id="lm-fu-callback">${b2}</button>`;
    msgs.appendChild(card); msgs.scrollTop = msgs.scrollHeight;

    document.getElementById('lm-fu-schedule').onclick = () => {
      card.remove();
      openCalendlyPopup();
      const reply = t(
        `Your calendar link is open — pick whichever time works and you'll get a confirmation right away.\n\nAnything else you'd like to cover before we finish?`,
        `رابط التقويم مفتوح — اختر الوقت المناسب وستصلك التأكيدة فورًا.\n\nهل هناك شيء آخر تريد تغطيته قبل انتهاء المحادثة؟`
      );
      addBotRaw(reply);
      sendEmail('Scheduled via Calendly', 'Calendly booking');
      phase = 'followup_done';
    };

    document.getElementById('lm-fu-callback').onclick = () => {
      card.remove();
      showCallbackForm(msgs);
    };
  }

  function showCallbackForm(msgs) {
    const card = document.createElement('div');
    card.className = 'lm-followup-card';

    const prompt   = t('Leave your number and a preferred time — someone will call you.',
                        'اترك رقمك والوقت المفضل — سيتصل بك أحد الفريق.');
    const ph_phone = t('Phone number', 'رقم الهاتف');
    const lbl_time = t('Preferred time (optional)', 'الوقت المفضل (اختياري)');
    const opts_en  = ['Morning — before 11am','Midday — 11am to 1pm','Afternoon — 1pm to 4pm','Evening — after 4pm','Anytime this week'];
    const opts_ar  = ['الصباح — قبل 11','الظهر — 11 إلى 1','بعد الظهر — 1 إلى 4','المساء — بعد 4','في أي وقت هذا الأسبوع'];
    const opts     = (userLang === 'ar' ? opts_ar : opts_en).map(o => `<option>${o}</option>`).join('');
    const btn_lbl  = t('Confirm — call me back', 'تأكيد — اتصل بي');

    card.innerHTML = `<p>${prompt}</p>
      <div class="lm-cb-form">
        <input class="lm-cb-input" id="lm-cb-phone" type="text" placeholder="${ph_phone}">
        <select class="lm-cb-select" id="lm-cb-time">
          <option value="">${lbl_time}</option>${opts}
        </select>
        <button class="lm-cb-send" id="lm-cb-send">${btn_lbl}</button>
      </div>`;
    msgs.appendChild(card); msgs.scrollTop = msgs.scrollHeight;

    document.getElementById('lm-cb-send').onclick = () => {
      const phone = document.getElementById('lm-cb-phone').value.trim();
      const time  = document.getElementById('lm-cb-time').value;
      if (!phone) { document.getElementById('lm-cb-phone').focus(); return; }
      card.remove();
      const reply = t(
        `Noted — we'll call ${phone}${time ? ` ${time.toLowerCase()}` : ''}. You'll hear from us within one business day.\n\nAnything else in the meantime?`,
        `تم التسجيل — سنتصل على ${phone}${time ? ` — ${time}` : ''}. ستسمع منا خلال يوم عمل.\n\nهل هناك شيء آخر في هذه الأثناء؟`
      );
      addBotRaw(reply);
      sendEmail(phone, time || 'Anytime');
      phase = 'followup_done';
    };
  }

  /* ============================================================
     SUBMIT HANDLER
     ============================================================ */
  document.getElementById('lm-chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const input = document.getElementById('lm-chat-input');
    const raw   = input.value.trim();
    if (!raw || isLoading || !currentMember) return;
    input.value = '';

    // Detect language from every user message
    userLang = detectLang(raw);
    addUserRaw(raw);

    /* ---- PHASE: collect name ---- */
    if (phase === 'name') {
      visitorName = raw.split(/\s+/)[0];
      history.push({ role: 'user', content: raw });
      await pause(550);
      const reply = t(
        `And what company are you with, ${visitorName}?`,
        `وما اسم شركتك، ${visitorName}؟`
      );
      addBotRaw(reply);
      history.push({ role: 'assistant', content: reply });
      phase = 'company';
      return;
    }

    /* ---- PHASE: collect company ---- */
    if (phase === 'company') {
      visitorCompany = raw;
      history.push({ role: 'user', content: raw });
      await pause(650);
      const confirm = t(
        `Got it — ${visitorName} from ${visitorCompany}.`,
        `حسنًا — ${visitorName} من ${visitorCompany}.`
      );
      // Transition straight into first qualifying question
      const q0 = currentMember.qualify[0];
      const firstQ = q0 ? `\n\n${userLang === 'ar' ? q0[1] : q0[0]}` : '';
      const reply = confirm + firstQ;
      addBotRaw(reply);
      history.push({ role: 'assistant', content: reply });
      phase = qualifyIndex < currentMember.qualify.length - 1 ? 'qualify' : 'chat';
      qualifyIndex = 1;
      return;
    }

    /* ---- PHASE: qualifying questions ---- */
    if (phase === 'qualify') {
      history.push({ role: 'user', content: raw });
      await pause(700);
      if (qualifyIndex < currentMember.qualify.length) {
        const q   = currentMember.qualify[qualifyIndex];
        const qTxt = userLang === 'ar' ? q[1] : q[0];
        qualifyIndex++;
        const atEnd = qualifyIndex >= currentMember.qualify.length;
        const reply = atEnd
          ? qTxt + (userLang === 'ar'
              ? `\n\n(بعد إجابتك سنتعمق في وضعك.)`
              : `\n\n(After this, we'll get into the specifics of your situation.)`)
          : qTxt;
        addBotRaw(reply);
        history.push({ role: 'assistant', content: reply });
        if (atEnd) phase = 'chat';
      } else {
        phase = 'chat';
        await handleChatTurn(raw);
      }
      return;
    }

    /* ---- PHASE: chat + followup_shown + followup_done ---- */
    await handleChatTurn(raw);
  });

  /* ---- Core consultation response ---- */
  async function handleChatTurn(text) {
    history.push({ role: 'user', content: text });

    // Check for flattery or off-topic first
    if (FLATTERY_RE.test(text)) {
      await pause(600);
      addBotRaw(getFlattery());
      return;
    }
    if (OFFTOPIC_RE.test(text)) {
      await pause(500);
      addBotRaw(getOfftopic(currentMember.role));
      return;
    }

    chatTurns++;
    isLoading = true;
    document.getElementById('lm-chat-send').disabled = true;
    showTyping();

    if (HAS_KEY) {
      try {
        const sysPrompt = `${currentMember.system}\n\nYou are speaking with ${visitorName} from ${visitorCompany}. Use their name once in a while. Respond in ${userLang === 'ar' ? 'Arabic' : 'English'}. Keep it to 2–4 focused paragraphs.`;
        const res  = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({ model: MODEL, max_tokens: 512, system: sysPrompt, messages: history })
        });
        const data = await res.json();
        hideTyping();
        if (data.content && data.content[0]) {
          const reply = data.content[0].text;
          history.push({ role: 'assistant', content: reply });
          addBotRaw(reply);
        } else { useFallback(text); }
      } catch { hideTyping(); useFallback(text); }
    } else {
      await pause(800 + Math.random() * 500);
      hideTyping();
      useFallback(text);
    }

    isLoading = false;
    document.getElementById('lm-chat-send').disabled = false;

    // Offer follow-up after 3 substantive chat turns
    if (phase === 'chat' && chatTurns >= 3 && !followupShown) {
      await pause(350);
      showFollowupCard();
    }
  }

  function useFallback(text) {
    const reply = getSmartReply(currentMember, text);
    if (reply) {
      history.push({ role: 'assistant', content: reply });
      addBotRaw(reply);
    }
  }

  /* ============================================================
     KEYBOARD
     ============================================================ */
  document.getElementById('lm-chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('lm-chat-form').dispatchEvent(new Event('submit'));
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  /* ============================================================
     HELPERS
     ============================================================ */
  function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

  function formatText(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>');
  }

})();
