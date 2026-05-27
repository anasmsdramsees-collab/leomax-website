# LEOMAX CRM in Notion — Setup Guide
**Build time: 15 minutes · Zero Notion experience needed**

---

## WHY NOTION (not HubSpot, not Salesforce)

For Day 1 sales:
- ✅ Free forever (Personal plan)
- ✅ Works on phone + desktop
- ✅ Multiple views from same data (table, kanban, calendar)
- ✅ No setup fees, no contract
- ✅ Easy to grow / change as you learn what you need

Upgrade to HubSpot Free or Pipedrive when you hit 50+ active deals.

---

## SETUP IN 15 MINUTES

### Step 1 — Create the workspace (2 min)

1. Go to **notion.so** → Sign up (use Google account, fastest)
2. Pick **Personal** plan (free, all you need)
3. Skip the tutorials

### Step 2 — Create a new page (1 min)

1. Click **"+ New page"** in left sidebar
2. Name it: **LEOMAX CRM**
3. Choose icon: 🎯 (or whatever you like)

### Step 3 — Import the CRM (5 min)

1. Open `leomax-crm-import.csv` (in this folder)
2. In your new Notion page, type `/import` and pick **CSV**
3. Upload `leomax-crm-import.csv`
4. Notion auto-creates the database with all columns + 10 sample leads

### Step 4 — Adjust column types (5 min)

After import, all columns come in as "Text." Change them to proper types for filtering/sorting:

| Column | Change to | Why |
|---|---|---|
| **Stage** | Select | Lets you filter/group by stage |
| **Priority** | Select | Color-coded priorities |
| **ICP** | Select | Group by ideal customer type |
| **Sector** | Select | Group by industry |
| **Source** | Select | Track which channels work |
| **First Contact** | Date | Sort by recency |
| **Last Touch** | Date | Find stale leads |
| **Next Action Date** | Date | This week's follow-ups |
| **Deal Value (SAR)** | Number → Format as Number with commas | Sort by value |
| **WhatsApp** | Phone | Click-to-call on mobile |
| **LinkedIn** | URL | Click to open |
| **Email** | Email | Click to compose |

**How to change**: Click column header → Edit property → Change type.

### Step 5 — Create the 4 views (2 min)

Click **+ Add a view** at the top. Set up these 4:

#### View 1: 📋 **All Leads** (default table)
- Type: Table
- Sort: Last Touch (Descending) — most recent at top
- Filter: none

#### View 2: 🎯 **Pipeline** (kanban)
- Type: Board
- Group by: Stage
- Sort: Priority (P1 first)
- Card preview: Show Company + Deal Value + Next Action

#### View 3: 📅 **This Week's Follow-ups**
- Type: Table
- Filter: Next Action Date is "next week" (or this week)
- Sort: Next Action Date ascending

#### View 4: 🔥 **Hot Leads (P1 only)**
- Type: Table
- Filter: Priority is P1 AND Stage is not "Won" AND Stage is not "Lost"
- Sort: Last Touch descending

---

## DATABASE SCHEMA (reference)

| Column | Type | Purpose |
|---|---|---|
| **Name** | Title (text) | Person's name |
| **Company** | Text | Their company |
| **Role** | Text | Their job title |
| **Sector** | Select | Logistics, E-commerce, FinTech, VC, etc. |
| **ICP** | Select | KSA SME / Startup raising / Family Office / Sudan-Egypt→KSA |
| **Source** | Select | Network / LinkedIn warm / LinkedIn cold / WhatsApp / Referral / Inbound / KBC |
| **Stage** | Select | Cold · Contacted · Brief Delivered · Discovery booked · Discovery done · Proposal · Won · Lost · Nurture |
| **Priority** | Select | P1 · P2 · P3 (color-coded) |
| **Offer** | Text | Which LEOMAX offer pitched (Diagnostic, Sprint, Transformation, etc.) |
| **Deal Value (SAR)** | Number | Expected one-time or monthly value |
| **First Contact** | Date | When first reached out |
| **Last Touch** | Date | Last interaction date |
| **Next Action** | Text | What to do next (call, email, send proposal, etc.) |
| **Next Action Date** | Date | When to do it |
| **Notes** | Long text | Context, conversation notes, qualifying info |
| **WhatsApp** | Phone | Click-to-call on mobile |
| **LinkedIn** | URL | LinkedIn profile link |
| **Email** | Email | Email address |

---

## SELECT OPTIONS (recommended values)

### Stage (with suggested colors)
- 🔵 **Cold** (gray) — haven't reached out yet
- 🟡 **Contacted** (yellow) — initial DM sent, no response yet
- 🟠 **Brief Delivered** (orange) — sent them an Account Brief
- 🟣 **Discovery booked** (purple) — call scheduled
- 🟢 **Discovery done** (green) — call complete, evaluating fit
- 🔵 **Proposal** (blue) — proposal sent, awaiting decision
- ✅ **Won** (green dark) — closed and paid
- ❌ **Lost** (red) — said no
- 💤 **Nurture** (gray) — keep warm for future

### Priority
- 🔴 **P1** — high-fit ICP, real interest, timing is now
- 🟡 **P2** — good fit, slower timing
- ⚪ **P3** — possible fit, longer-term

### ICP
- **KSA SME** — Saudi small/mid revenue
- **Startup raising** — Pre-A / A / Seed founders
- **Family Office** — KSA wealth management
- **Sudan-Egypt → KSA** — entering the market

### Source
- **Network** — your existing relationship
- **Warm intro** — referred by mutual contact
- **LinkedIn warm** — 2nd-degree connection
- **LinkedIn cold** — never met before
- **WhatsApp** — direct WA message
- **KBC** — Khartoum Business Club network
- **LEAP** — met at LEAP event
- **Misk** — Misk Foundation network
- **Inbound** — found us via website
- **Referral** — existing client referred

---

## DAILY WORKFLOW (5 minutes/day)

### Morning (5 min)
1. Open **Pipeline view**
2. Check **This Week's Follow-ups**
3. Pick the 3 most-stale leads → schedule today's outreach
4. Move any closed deals to **Won/Lost**

### After each call / message
1. Update **Last Touch** to today
2. Update **Next Action** + **Next Action Date**
3. Add notes in **Notes** field
4. Move **Stage** forward if appropriate

### Weekly review (Friday 4 PM)
1. Filter by **Last Touch** = last 7 days → count interactions
2. Filter by **Stage** = Won (this week) → celebrate
3. Filter by **Stage** = Discovery booked → confirm next week's calls
4. Add new leads to the database from outreach

---

## SAMPLE DATA (already in the CSV)

You start with 10 sample leads spanning all 4 ICPs:
- 1 Won (MADAR — your existing case)
- 3 Discovery booked
- 2 Brief delivered
- 1 Discovery done (needs proposal)
- 1 Contacted (warm response pending)
- 2 Cold (planned outreach)

Use these as templates — replace with your real leads.

---

## MOBILE TIPS

Install **Notion mobile app**:
- iOS: App Store → "Notion"
- Android: Play Store → "Notion"

On mobile:
- Use **Pipeline (kanban)** view — easiest to swipe between stages
- Tap WhatsApp number → opens WhatsApp
- Tap LinkedIn URL → opens LinkedIn app

Add the database to your home screen:
- iOS: Share → Add to Home Screen
- Android: 3-dot menu → Add to Home Screen

---

## INTEGRATIONS (optional, later)

When you have 30+ active leads, consider:

### **Calendly → Notion** (auto-create lead when someone books)
- Use Zapier (free for 100 tasks/month) or Make.com
- Trigger: New Calendly booking
- Action: Create row in Notion CRM with Stage = "Discovery booked"

### **Gmail → Notion** (auto-log emails to leads)
- Notion + Gmail extension (Chrome)
- Click Notion icon in Gmail → save email to lead

### **WhatsApp → Notion** (manual but fast)
- Use Notion's web clipper: copy WhatsApp text → paste in lead notes

---

## UPGRADE PATH

| Current | Trigger | Upgrade To |
|---|---|---|
| Notion (free) | < 30 leads | Stay |
| Notion + Zapier | 30-50 leads, manual sync getting old | Stay |
| HubSpot CRM (free) | 50+ leads, need email tracking | Migrate |
| Pipedrive ($14/mo) | 100+ leads, need deal automation | Migrate |
| Salesforce | 500+ leads / hire sales rep | Don't even consider till here |

---

## CRITICAL DON'TS

❌ **Don't add every business card you've ever collected.** Only add people you've actually outreached or will outreach this month.

❌ **Don't add columns just because you can.** Every extra field = more friction to update = abandoned CRM.

❌ **Don't skip updating after a call.** A CRM you don't update is just a spreadsheet you don't open.

❌ **Don't keep "Won" deals forever in active view.** Archive them after 30 days (move to a separate "Won Archive" page).

---

## NEXT STEPS (TODAY)

1. [ ] Sign up at notion.so
2. [ ] Create new page: "LEOMAX CRM"
3. [ ] Import `leomax-crm-import.csv` (in this folder)
4. [ ] Change column types (5 min, follow the table above)
5. [ ] Create 4 views (table, kanban, this-week, hot-leads)
6. [ ] Install Notion on your phone
7. [ ] Tomorrow morning: open Pipeline view, pick 3 leads, take action

When you finish, send me a screenshot of your Notion CRM — I'll review and suggest tweaks.
