# LEOMAX — AI Integration Plan

**شركة Business Development في السعودية — مرحلة تشغيل بإيرادات**
**Service mix:** BD consulting · SaaS Strategy OS · Investor advisory
**القيد الأكبر:** الوصول للعملاء الكبار في السوق السعودي (مش الأفكار، مش الميزانية)
**التاريخ:** مايو 2026

---

## 1. القراءة الاستراتيجية — قبل أي خطة

ليوماكس مش في مرحلة "ابحث عن فكرة" ولا "أتمتة العمليات الداخلية". أنت في مرحلة **enterprise access**. يعني: العميل اللي يدفع ٢٠٠ ألف لاستشارة BD، والشركة الناشئة اللي تحتاج Strategy OS، والمستثمر اللي يبحث عن صفقات — هؤلاء موجودون في السعودية، لكن باب الوصول لهم ضيق.

**معنى ذلك لـ AI:**

- لا تستثمر شهور في أتمتة الفريق الداخلي قبل ما تبني محرّك مبيعات.
- AI لازم ينتج **إيرادات مباشرة** (proposals, intelligence, outreach) — مش بس يوفر وقت.
- المنتج (Strategy OS) لازم يخدم وظيفتين: إيراد مستقل **و** أداة بيع (proof of capability).
- بنية كل output: عربي + إنجليزي، Vision 2030 aware، وبتعكس ثقافة الأعمال السعودية (علاقة قبل عرض).

---

## 2. My AI Profile

أنت **مؤسس BD متعدد القطاعات (لوجستيات، SaaS، استثمار)** في سوق علاقاتي، وقوتك في القراءة الاستراتيجية وسيكولوجية العميل. AI يخدمك كـ **محرك ذكاء سوقي وإنتاج تجاري**، لا ككاتب. أكبر unlock عندك: تحويل كل عميل محتمل من "اسم في LinkedIn" إلى **account brief كامل + عرض مخصص + سيناريو دخول** في ساعات بدل أسابيع.

---

## 3. الطبقات الثلاث — معاد ترتيبها لليوماكس

### Layer 1 — Revenue Productivity AI (هذا الأسبوع)

**القاعدة:** كل أداة هنا لازم تخدم: عميل جديد، أو عرض، أو اجتماع، أو deal.

| الأداة | الاستخدام في ليوماكس | الإخراج اليومي |
|---|---|---|
| **Claude** | قراءة dataroom شركة، تفكيك تقرير سوق، مراجعة عقد BD | account memo + risk flags |
| **ChatGPT (GPT-5 / o3)** | كتابة proposals، تحليل unit economics، بناء سيناريوهات | draft proposal جاهز للتعديل |
| **Perplexity** | بحث سريع عن شركة سعودية، CEO، آخر round, آخر launches | dossier 1 صفحة |
| **Gamma** | تحويل memo لعرض احترافي بعربي/إنجليزي | deck جاهز للعميل |
| **Granola أو Otter** | تسجيل وتلخيص اجتماعات العملاء بالعربي | summary + action items |
| **Notion AI** | knowledge base لكل عميل، صناعة، deal | searchable memory |

**القرار: اختار Claude للقراءة العميقة (dataroom, contracts, long reports) + ChatGPT للإنتاج (proposals, decks, scenarios). Perplexity للسوق. ده الـ stack الأساسي.**

---

### Layer 2 — Workflow Automation (الأسابيع 3-6)

**القاعدة:** n8n هو الـ orchestrator. كل automation هنا تخدم محرك المبيعات.

#### Automation 1 — Enterprise Account Intelligence

- **Trigger:** اسم شركة سعودية يُضاف لـ Google Sheet ("Target Accounts")
- **Actions:**
  1. n8n يستدعي Perplexity API ويسحب: آخر أخبار، آخر round، C-level changes
  2. يستدعي LinkedIn (عبر Apify أو Phantombuster) ويجمع decision-makers
  3. يستدعي Claude لإنتاج **Account Brief**: مشاكل محتملة، sales angle، entry strategy
  4. يرسل PDF + رسالة WhatsApp/Telegram لك
- **Output:** Account Brief كامل خلال 8 دقايق بدل ٤ ساعات بحث.
- **Success metric:** ١٠ accounts/أسبوع جاهزين للتواصل.

#### Automation 2 — Proposal Generator (ثنائي اللغة)

- **Trigger:** نموذج Typeform يملأه فريقك بمعطيات العميل (قطاع، تحدي، نطاق، ميزانية مقترحة)
- **Actions:**
  1. n8n يستدعي قالب proposal مخزن
  2. يستدعي Claude مع context: industry + Vision 2030 alignment + Leomax case studies
  3. ينتج نسخة عربي + نسخة إنجليزي
  4. يضيف pricing tier (3 خيارات: Essential / Growth / Strategic)
  5. يحفظ في Google Drive + يرسل لك للمراجعة
- **Output:** proposal v0.9 في 12 دقيقة.
- **Success metric:** زمن من lead لـ proposal من ٣ أيام إلى نفس اليوم.

#### Automation 3 — Daily Market Brief (السعودية فقط)

- **Trigger:** كل يوم ٧:٣٠ صباحاً (قبل اجتماعاتك)
- **Actions:**
  1. يجمع من: Argaam, Saudi Gazette, MAGNiTT, Wamda, Tadawul announcements
  2. فلتر بقطاعات ليوماكس: لوجستيات، SaaS/tech، investment
  3. Claude يفلتر ويصنف: deals, expansions, layoffs, regulatory changes
  4. ينتج Brief صفحة واحدة بثلاث أقسام: **Opportunities · Threats · Conversations to start**
  5. يصل لك على WhatsApp ٨:٠٠ صباحاً
- **Output:** ميزة معرفية يومية على أي منافس BD في السوق.
- **Success metric:** ٣ محادثات/أسبوع تبدأ من إشارة في الـ brief.

---

### Layer 3 — Agentic AI (الأسابيع 7-12 وما بعدها)

#### Agent 1 — Enterprise BD Agent (الأهم لليوماكس)

**المهمة:** يدير قمع المبيعات للحسابات الكبيرة من البداية للنهاية، تحت إشرافك.

- **يقرأ من:**
  - CRM (HubSpot/Pipedrive/Airtable)
  - Account intelligence DB (مخرج Automation 1)
  - تاريخ التواصل (email, LinkedIn, WhatsApp logs)
  - دراسات حالة ليوماكس
- **يفعل:**
  - يرتب الـ pipeline حسب احتمال الإغلاق
  - يقترح next-best-action لكل حساب (إيميل، رسالة، مكالمة)
  - يكتب draft outreach بثلاث نبرات: official Arabic / business English / Saudi business casual
  - يحدد متى يتدخل علاقات (موضوعات بحاجة وَسطية، majlis، فعالية)
- **يكتب إلى:** CRM، Drive، مسودات إيميل في Gmail
- **Human checkpoint:** كل إيميل/رسالة لازم تعتمد قبل الإرسال. وكل صفقة فوق ٥٠ ألف ريال — moved manually.

#### Agent 2 — Investment Readiness Agent (تمييز ليوماكس)

**المهمة:** يجهز شركة ناشئة (عميل ليوماكس) للاستثمار في ٢-٣ أسابيع بدل ٢-٣ شهور.

- **يقرأ من:** Pitch deck، financials، CRM، market data، dataroom
- **يفعل:**
  - يحسب unit economics ويفحص الصحة (CAC, LTV, payback, burn)
  - يفحص الـ pitch ضد ٢٠ سؤال يكررها VCs في الخليج
  - يولّد investor memo + cap table + financial model v0
  - يقيّم founder readiness على ٧ محاور
- **Human checkpoint:** كل assumption مالي لازم founder يوقّع عليه. أي رقم يدخل deck — manual sign-off.
- **النموذج التجاري:** تقدر تبيعها كـ "Investment Readiness Sprint" مستقل بـ ٤٥-٧٠ ألف ريال لكل شركة.

#### Agent 3 — Strategy OS Layer (داخل منتج SaaS الخاص بليوماكس)

**المهمة:** هذا ليس agent لاستخدامك — هذا **المنتج اللي تبيعه**.

داخل dashboard العميل (شركة لوجستيات/تجارية/ناشئة)، الـ agent يجيب على:
- لماذا انخفض الأداء في منطقة كذا؟
- أي خط/منتج/مندوب الأكثر ربحاً؟
- ما القرار الموصى به هذا الأسبوع؟ ولماذا؟
- ما أكبر ٣ مخاطر تشغيلية الشهر الحالي؟

**Stack مقترح:**
- Data layer: Supabase أو PostgreSQL
- Vector DB: Pinecone أو Weaviate
- LLM: Claude للـ reasoning، GPT-4o-mini للـ classification
- Agent framework: OpenAI Agents SDK أو LangGraph
- Frontend: Next.js + Tailwind
- Audit log: كل قرار يقترحه الـ agent يُحفظ بالمصدر والأسباب

**Pricing tiers (مقترح):**
- Essential: SAR 4,500/شهر — dashboard فقط
- Growth: SAR 9,500/شهر — dashboard + AI insights
- Strategic: SAR 22,000/شهر — dashboard + agent + monthly Leomax review

---

## 4. الـ 90-Day Plan — لليوماكس تحديداً

### Weeks 1–2 — Quick Wins (الأساس)

**الـ deliverables:**
1. Stack شخصي مفعّل: Claude Pro + ChatGPT Plus + Perplexity Pro + Gamma + Granola
2. Knowledge Base في Notion: Industries (logistics/SaaS/investment) × Clients × Deals
3. Prompt library لليوماكس (٢٠ prompt أساسي للـ BD وproposal وaccount work)
4. ٣ قوالب: Account Brief, Proposal, Investor Memo

**Success metric:** زمن إعداد proposal أول من ٢-٣ أيام إلى ٤ ساعات.

### Weeks 3–6 — First Real Automation

**الـ deliverables:**
1. n8n مثبت (cloud أو self-hosted على Hetzner — التكلفة ≈ ٢٥ دولار/شهر)
2. Automation 1 (Account Intelligence) شغّال
3. Automation 3 (Daily Market Brief) شغّال
4. Integration مع WhatsApp Business API لاستلام البريفات

**Success metric:** ٢٠ account brief منتج تلقائياً، ٤ منهم بدأت محادثة فعلية.

### Weeks 7–12 — First Agentic System Live

**الـ deliverables:**
1. Enterprise BD Agent (Agent 1) في إصدار MVP
2. Investment Readiness Agent (Agent 2) — منتج قابل للبيع كخدمة منفصلة
3. أول عميل ليوماكس يدخل في مسار "BD with AI" مدفوع — pricing رفع ٢٠-٣٠٪ مقابل السرعة

**Success metric:**
- صفقة BD واحدة على الأقل تم إغلاقها بفضل الـ agent insights
- إيراد إضافي من ٢ Investment Readiness Sprints (≈ SAR 100K-140K)

---

## 5. Strategy OS — خارطة بناء المنتج (مسار مستقل ٦-٩ شهور)

هذا مسار متوازي مع الـ 90-day plan، لأن المنتج بيحتاج وقت بناء أطول.

**Phase 1 (شهر 1-2):** Discovery + Design
- ٥ مقابلات مع شركات لوجستيات/تجارية سعودية لتعريف pain points
- Wireframes + data model
- اختيار stack تقني

**Phase 2 (شهر 3-5):** MVP
- Dashboard + ٣ AI insights فقط (مش agent كامل)
- ٢-٣ عملاء pilot بسعر مخفض (SAR 2,500/شهر)

**Phase 3 (شهر 6-9):** Agent Layer + Scale
- AI agent يقترح قرارات
- Pricing tiers الكامل
- ١٠ عملاء مدفوع

**ميزانية تقديرية:** SAR 180K-280K للسنة الأولى (تطوير + AI APIs + sales).

---

## 6. Skill Gaps — أولوية صارمة

1. **Data structuring + prompt engineering**
   تعلم كيف تحوّل data CRM وأي ملفات عشوائية إلى structured input لنماذج AI.
   *Resource:* "Prompt Engineering for Developers" من DeepLearning.AI (مجاني، ٣ ساعات).

2. **n8n workflow design**
   workflows، triggers، AI nodes، error handling.
   *Resource:* قناة n8n الرسمية على YouTube + n8n AI tutorial.

3. **Agent tool design (الأهم على المدى الطويل)**
   كيف تصمم tools للـ agent، صلاحياته، حدوده.
   *Resource:* Anthropic Tool Use docs + OpenAI Agents SDK quickstart.

**ملاحظة:** لا تحاول تتعلم كود كامل. وظيفتك أن تفهم **architecture** و**design decisions**. التنفيذ — استأجر developer freelance من Toptal أو Upwork (SAR 150-300/ساعة) أو شريك تقني بحصة.

---

## 7. Risk & Guardrails

### أين AI سيفشل في سياق ليوماكس

- **القرارات الاستثمارية النهائية** — AI يحلل، لكن قرار "هل نمول هذه الشركة؟" يحتاج حدس بشري وعلاقات.
- **التسعير لعميل كبير** — لكل عميل سياق سياسي/علاقاتي لا يفهمه نموذج.
- **التواصل في حالات حساسة** (شكوى، خلاف عقد، خروج موظف) — أي رسالة يكتبها AI هنا = خطر سمعة.
- **التحليل الثقافي السعودي العميق** — AI يفتقد nuance الـ majlis والـ wasta المشروعة.
- **القرارات القانونية والامتثال** (ZATCA، SAGIA، عمالة، ضريبة).

### القاعدة الذهبية لـ Human-in-the-loop

```
AI proposes → Team reviews data → You decide → System logs everything
```

كل decision من agent لازم يكون فيه:
- Source data (من أين القرار)
- Confidence level
- Counter-evidence (ما الدليل المعاكس)
- Approver (من اعتمد)
- Timestamp

---

## 8. ثلاث أفكار غير مألوفة في السوق السعودي للـ BD

### 1. Vertical Strategy OS بدل Horizontal SaaS

أغلب SaaS منتجات في السوق "general dashboard". ميزتك: ابني Strategy OS مخصصة لقطاع واحد أولاً — **اللوجستيات** (لأنك تفهمها). يعطي قراءة قرار، مش بيانات. التسعير أعلى ٣x من dashboard عام، والاحتفاظ بالعملاء أعلى لأن البديل يحتاج إعادة بناء كامل.

### 2. "BD-as-a-Service" بـ AI Agent Layer

استبدل الـ retainer التقليدي (SAR 25-50K/شهر) بنموذج هجين:
- Base fee أقل (SAR 12K/شهر)
- + AI Agent يدير account intelligence و outreach
- + Commission على الصفقات المغلقة (5-8٪)

هذا النموذج يجذب الشركات الناشئة اللي ما تقدر تدفع retainer كامل، ويعطيك upside فوق سقف الـ retainer. لا أحد في السوق السعودي يقدمه بهذا الشكل.

### 3. Investor Memo Subscription لـ Family Offices

عوائل سعودية كثيرة تستثمر بشكل عشوائي لأنه ما عندها team تحليل. اعرض اشتراك شهري (SAR 18-30K/شهر) ينتج:
- ٤ investor memos شهرياً لشركات ناشئة في قطاعات محددة
- Quarterly thesis update
- On-demand deep dives (٢ في الشهر)

Backend = Investment Readiness Agent + فريق بشري للمراجعة. هذا يحوّل ليوماكس من "BD firm" لـ "Strategic Capital Partner" — رفع مكانة وسعر.

---

## 9. الخطوة الأولى — هذا الأسبوع

**قرار واحد:** فعّل Stack Layer 1 (Claude Pro + Perplexity Pro + Gamma) وابني **Account Brief Template** في Notion. ثم اختار **٥ شركات سعودية** كنت دائماً تريد الوصول لها — وأنشئ Brief كامل لكل واحدة في يومين.

النتيجة المتوقعة: محادثة واحدة على الأقل تبدأ خلال أسبوع، وأنت تحدد لو الـ workflow يستحق التوسعة لـ Automation 1.

**لو نجح:** ادخل في n8n.
**لو فشل:** المشكلة في الـ message، مش في الأداة.

---

## 10. ما لا يدخل هذه الخطة (متعمد)

- ❌ بناء فريق AI داخلي قبل ما تثبت ROI
- ❌ اختيار stack غير معروف (يقولون عنه "الأحدث") — Claude/OpenAI/n8n مجرّبين
- ❌ بناء Strategy OS قبل ما يكون عندك ٥ عملاء يدفعون لـ pilot
- ❌ توظيف developer full-time قبل ما تثبت المنتج عند ٣ عملاء
- ❌ التوسع لخارج السعودية قبل ما تثبت في الرياض/جدة

---

*هذه خطة قابلة للتعديل ربع سنوي. مراجعة Q2 2026: نهاية أغسطس.*
