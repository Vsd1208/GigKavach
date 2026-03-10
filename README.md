# 🛡️ GigShield
### AI-Powered Parametric Income Protection for Zepto/Blinkit Delivery Partners

> *"If your zone goes down, your income doesn't."*

## 1. Problem Statement

India's Q-Commerce delivery partners — working for platforms like **Zepto, Blinkit, and Swiggy Instamart** — operate in hyper-local micro-zones, completing 10-minute deliveries within a 2–3 km radius of dark stores. This tight operational model makes them uniquely vulnerable:

- A **single rainfall event** can shut down an entire zone for hours
- **Extreme heat or AQI spikes** trigger platform-level worker safety suspensions
- **Local curfews or dark store closures** instantly cut off their pickup points
- Workers lose **20–30% of monthly income** during such disruptions with zero safety net

Unlike food delivery workers who can operate across a wider area, Q-Commerce partners are **zone-locked** — if their micro-zone is disrupted, they cannot simply shift elsewhere. They bear the full financial loss alone.

**Currently, no insurance product addresses this gap.**

---

## 2. Our Solution

**GigShield** is an AI-enabled parametric income protection platform built exclusively for Q-Commerce delivery partners.

### How It's Different from Traditional Insurance

| Traditional Insurance | GigShield |
|---|---|
| Worker files a claim manually | Claims triggered automatically |
| Payout takes days or weeks | Payout processed in under 60 seconds |
| City-level weather assessment | **Micro-zone** (dark store radius) assessment |
| Fixed premiums | **AI-adjusted weekly premiums** per zone risk |
| No engagement between claims | **GigPoints** loyalty system keeps workers engaged daily |
| Worker never knows their savings | **Savings Dashboard** shows lifetime ROI |
| Opaque pricing with no forecast | **Premium Price Forecast** shows next 7 days pricing |

### Core Principle — Parametric Insurance

GigShield does **not** insure health, life, accidents, or vehicle damage. It insures **lost income** caused by external, objectively measurable disruptions. When a trigger threshold is breached and sustained, payouts happen automatically — no claim form, no adjuster, no waiting.

---

## 3. Persona & Scenarios

### Target Persona

**Q-Commerce Delivery Partner** — A gig worker employed by Zepto, Blinkit, or Swiggy Instamart, operating within a fixed micro-zone (2–3 km radius around a dark store), completing 15–25 deliveries per day, earning approximately ₹600–₹1,200/day.

```
Typical Profile:
  Device:      Budget Android (Redmi, Realme, Samsung M-series)
  Income:      ₹600–₹1,200/day | ₹15,000–₹25,000/month
  Work style:  Zone-locked, 6–14 hrs/day, week-to-week earnings
  Pain point:  Zero income protection against external disruptions
```

---

### Real-World Scenarios

---

**Scenario 1 — Heavy Monsoon Rain**

> Ravi is a Zepto partner in HSR Layout, Bangalore. At 2 PM, rainfall hits 20mm/hr. GigShield detects the breach and waits 10 minutes — sustained. Ravi's GPS confirms he is inside the zone, and his app shows 2 deliveries in the last 30 minutes. Claim auto-approved. ₹600 credited before he gets home. His Protection Timeline updates: *"2:10 PM — Rainfall Trigger — +₹600"*. He earns +200 GigPoints.

---

**Scenario 2 — Hazardous AQI (Delhi Winter)**

> Priya works for Blinkit in Dwarka, Delhi. November AQI spikes to 340. Blinkit suspends outdoor operations. GigShield detects the breach via WAQI API. Priya was active that morning — claim validated automatically. ₹600 credited. Her Savings Dashboard now shows: *"Lifetime Net Savings: ₹1,800 — 420% return on protection."*

---

**Scenario 3 — Dark Store Closure**

> Arjun's Zepto dark store in Koramangala closes for 4 hours due to a local strike. GigShield receives the platform closure signal for Zone KOR-02. All 31 active, validated workers receive ₹600 each — ₹18,600 paid out in under 60 seconds. Zero manual intervention.

---

**Scenario 4 — Pre-Disruption Alert (Parametric Transparency)**

> Meera opens GigShield at noon. Her zone status card shows 🟡 **ZONE WATCH** — *"Rainfall at 12mm/hr, approaching threshold of 15mm/hr. Your policy is active ✅"*. She continues working, knowing she's covered. 20 minutes later it tips — her claim auto-fires. She knew it was coming before it happened.

---

**Scenario 5 — Fraud Attempt (Blocked)**

> Vikram tries to claim during a rainfall event. His GPS shows him 8 km outside the zone with zero deliveries in the last 30 minutes. Fraud score: 0.25 (below 0.75 threshold). Admin console shows: ❌ GPS outside zone ·  Not active ·  No duplicate ·  App logged in. Payout blocked.

---

**Scenario 6 — Coverage Gap Detector**

> Suresh forgot to renew on Sunday. Monday morning a trigger fires. He opens GigShield and sees: *"34 active Pro Shield workers each received ₹600 today. You would have received ₹600. Policy lapsed Sunday midnight. Renew now → ₹108/week."* He renews immediately and enables auto-renew.

---

**Scenario 7 — Premium Price Forecast Drives Early Purchase**

> Deepak checks the policy screen on Thursday. The forecast shows: *"This week ₹108 → Next week ₹127 (+18%) — Monsoon approaching your zone."* He buys today's policy immediately, saving ₹19 and securing lower coverage before the price rises.

---

**Scenario 8 — GigBot Handles a Claim Question (Hindi)**

> After a claim rejection, Santosh opens GigBot and types: *"mera claim kyun reject hua?"* GigBot responds in Hindi, shows his specific validation checklist, explains the GPS check failed because he was outside the zone at trigger time, and guides him to check his location settings for next time.

---

**Scenario 9 — Collective Pool Fills a Coverage Gap**

> Neha's zone trigger doesn't formally fire — rainfall was 13mm/hr, just below the 15mm/hr threshold — but she still lost 2 hours of income. Her zone's Collective Pool votes to reimburse her ₹200 from the pool balance. 34 members contributed ₹10 each this week — the pool has ₹340 available. Motion passes.

---

## 4. Application Workflow

### Worker-Facing Flow

```
1. ONBOARDING
   ├── Register with mobile number (OTP verification)
   ├── Select platform: Zepto / Blinkit / Swiggy Instamart
   ├── Zone auto-detected based on nearest dark store coordinates
   ├── Profile: avg daily hours, shift pattern (improves risk scoring)
   └── Complete profile → earn +100 GigPoints (one-time)

        ↓

2. POLICY PURCHASE
   ├── AI calculates zone risk score (0.0 → 1.0) — shown transparently
   ├── Premium Price Forecast shown: next 7 days pricing trend
   ├── Three weekly plans with AI-adjusted premiums:
   │     Basic Shield  — ₹49/week base  → ₹300/disruption day
   │     Pro Shield    — ₹99/week base  → ₹600/disruption day
   │     Elite Shield  — ₹149/week base → ₹1,000/disruption day
   ├── Worker sees: "Zone risk: 0.74 — Premium adjusted to ₹108/week"
   ├── GigPoints tier discount applied automatically at checkout
   ├── Worker pays via UPI / Razorpay
   ├── Policy Certificate PDF generated and downloadable
   └── Policy active Sunday midnight → next Sunday midnight

        ↓

3. ACTIVE COVERAGE
   ├── Zone Status Widget: 🟢 SAFE / 🟡 WATCH / 🔴 DISRUPTED
   ├── Pre-disruption alerts pushed to lock screen when approaching threshold
   ├── GigShield monitors zone every 5 minutes (background polling)
   ├── GigBot available 24/7 for Hindi + English help
   └── Dashboard shows: active plan, GigPoints balance, weekly earnings protected

        ↓

4. DISRUPTION DETECTED
   ├── Trigger monitor detects threshold breach in worker's zone
   ├── Waits 10 minutes of sustained breach (false positive protection)
   ├── Fraud validation runs automatically:
   │      GPS inside zone radius (Haversine distance check)
   │      Activity score ≥ 1 delivery in last 30 min
   │      App logged in within 10 min of trigger event
   │      No duplicate claim for this event ID
   └── Score ≥ 0.75 (3 of 4 checks) → AUTO APPROVED

        ↓

5. PAYOUT + REWARDS
   ├── UPI transfer initiated via Razorpay (mock in demo)
   ├── Push notification + SMS: "₹600 credited — Rainfall, HSR Zone"
   ├── Claim Statement (EOB) generated and downloadable
   ├── Protection Timeline updated on dashboard
   ├── Lifetime Protection Graph updates (monthly bar chart)
   ├── GigPoints credited: +200 pts (payout) + +100 pts (active during disruption)
   └── Savings Dashboard updates lifetime net savings and ROI

        ↓

6. RENEWAL
   ├── Friday 6 PM push: "Policy expires in 2 days — renew now"
   ├── Saturday 10 AM SMS: "Policy expires tomorrow — gigshield.app/renew"
   ├── Sunday 6 PM final push: "6 hours left on your policy"
   ├── Sunday 11:30 PM final SMS: "30 mins to expiry"
   ├── Auto-renew toggle available (UPI mandate simulation)
   ├── Streak maintained → +75 GigPoints streak bonus
   └── If lapsed → Coverage Gap Detector shown on next open
```

### Admin / Insurer Flow

```
Risk Map         → Leaflet + OSM map, zones colored Red/Orange/Green
                   by live risk level. Click zone → workers, payouts, status

Live Feed        → Real-time stream of disruption events and claims
                   "Zone HSR-01 | Rainfall 19mm/hr | 34 claims | ₹20,400"

Analytics        → Loss ratios, weekly payout trends, zone-wise breakdown,
                   premium pool vs payouts chart

7-Day Forecast   → Predicted disruption risk per zone for next 7 days
                   "HSR Layout — Thursday: HIGH (0.74) — Monsoon pattern"

Risk Simulator   → Sliders: Rainfall / AQI / Active workers
                   Live output: Affected Workers | Estimated Payout | Loss Ratio

Fraud Console    → Flagged claims with per-check explainability
                    GPS outside zone ·  Not active → BLOCKED

Loyalty Monitor  → GigPoints distribution, tier breakdown,
                   redemption activity, churn risk by tier

Pool Monitor     → Collective pool balances per zone, contribution rates,
                   disbursement history
```

---

## 5. Weekly Premium Model

### Why Weekly?

Zepto/Blinkit partners operate week-to-week — platform payouts are weekly, active zones can change weekly, and their financial planning horizon is a single week. A weekly premium model aligns directly with how they earn and spend.

### Pricing Structure

| Plan | Base Weekly Premium | Max Payout/Day | Coverage Hours |
|---|---|---|---|
| Basic Shield | ₹49/week | ₹300 | 6 hrs/day |
| Pro Shield | ₹99/week | ₹600 | 10 hrs/day |
| Elite Shield | ₹149/week | ₹1,000 | 14 hrs/day |

### AI-Adjusted Dynamic Pricing

```
Final Premium = Base Premium × (1 + 0.3 × (risk_score − 0.5))

Examples:
  HSR Layout, Bangalore (flood-prone, high AQI history)
  risk_score = 0.8 → +9% → Pro Shield = ₹108/week

  Whitefield, Bangalore (historically dry zone)
  risk_score = 0.2 → −9% → Pro Shield = ₹90/week
```

**Risk Score Inputs** (XGBoost model):
- Zone rainfall frequency over last 90 days
- Zone average AQI history
- Historical flood / waterlogging incidents
- Worker's average daily shift hours
- Current month (monsoon season weighting)

Worker sees on policy screen: *"Zone risk score: 0.74 — Premium adjusted to ₹108/week"*

### GigPoints Tier Discount Applied at Checkout

| Tier | Discount |
|---|---|
| 🥈 Reliable (1,000+ pts) | 5% off weekly premium |
| 🥇 Veteran (2,500+ pts) | 10% off weekly premium |
| 💎 Champion (5,000+ pts) | 15% off + 1 free week per quarter |

---

## 6. Parametric Triggers

> These are Q-Commerce specific triggers. Zepto/Blinkit workers are zone-locked — even one trigger halts ALL deliveries in the affected micro-zone.

### Trigger Table

| Trigger | Parameter | Data Source | Threshold | Sustained |
|---|---|---|---|---|
| Heavy Rain | Rainfall mm/hr | OpenWeatherMap API | > 15 mm/hr | 10 min |
| Extreme Heat | Temperature °C | OpenWeatherMap API | > 43°C | 10 min |
| Severe AQI | Air Quality Index | WAQI API (free) | > 300 | 10 min |
| Flash Flood Alert | IMD-style alert | Mocked JSON feed | Alert issued | Instant |
| Dark Store Closure | Platform signal | Simulated API | Closure flag | Instant |
| Local Curfew | Govt alert | Mocked event trigger | Curfew issued | Instant |

### False Positive Protection Logic

```
Poll every 5 minutes
  │
  ├── Threshold breached?
  │     YES → Start 10-minute sustained timer
  │     NO  → Reset timer (no claim)
  │
  └── Still breached after 10 minutes?
        YES → TRIGGER CLAIMS
        NO  → RESET (false positive avoided)
```

*A 10-minute delivery window means a 2-minute rain spike should not wipe out a worker's income. We require 10 minutes of sustained breach — standard parametric false-positive protection.*

---

## 7. AI/ML Integration Plan

### Model 1 — Zone Risk Scorer (XGBoost)
- **Input:** Rainfall history, AQI averages, flood incidents, seasonal patterns, shift hours
- **Output:** Risk score 0.0–1.0 per zone
- **Visible to user:** Risk score shown transparently at policy purchase
- **Impact:** Drives premium adjustment ±30%

### Model 2 — Dynamic Premium Calculator
- **Logic:** `final = base × (1 + 0.3 × (risk − 0.5))`
- **Full transparency:** Score + adjustment % shown to worker before purchase

### Model 3 — Fraud Checker (Explainable Scoring)
- **GPS Check:** Haversine distance formula validates worker is inside zone radius
- **Activity Score:** `deliveries_last_30min` — ≥ 1 = active, 0 = suspicious
- **Session Check:** `last_seen_at` within 10 minutes of trigger timestamp
- **Duplicate Check:** No existing claim for this worker + event ID combination
- **Score:** Pass ≥ 3 of 4 checks (score ≥ 0.75) for auto-approval
- **Admin UI shows:** Per-check checklist — fully explainable, not a black box

### Model 4 — 7-Day Zone Risk Predictor
- **Method:** 90-day rolling average of disruption events per day-of-week per zone
- **Output:** Risk label (High / Medium / Low) + probability score per day
- **Admin display:** *"HSR Layout — Thursday: High Risk (0.74) — Monsoon pattern"*

### Model 5 — Predictive Premium Price Forecast
- **Method:** Multi-signal weighted fusion — weather forecast + AQI trend + seasonal history + ground signals
- **Output:** 7-day forward premium price per plan per zone
- **Visible to user:** Shown on policy purchase screen before checkout
- **Impact:** Creates urgency to buy at lower price, mirrors airline dynamic pricing UX

### Model 6 — GigBot (Claude API)
- **Model:** `claude-sonnet-4-6` via Anthropic SDK
- **Context injected:** Worker's active policy, GigPoints, claim history, zone info, trigger thresholds
- **Languages:** Hindi + English (auto-detected from worker's message)
- **Handles:** Claim rejections with specific checklist, coverage questions, GigPoints queries, renewal help

### GPS Validation — Haversine Formula

```javascript
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R  = 6371000
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180
  const a  = Math.sin(Δφ/2) ** 2
           + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Returns true if worker is physically inside the zone delivery radius
function isWorkerInZone(worker, zone) {
  return haversineDistance(
    worker.current_lat, worker.current_lng,
    zone.center_lat,    zone.center_lng
  ) <= zone.radius_meters
}
```

---

## 8. GigPoints Loyalty & Savings System

This transforms insurance from a passive *"I hope I never need it"* product into an active *"I'm earning rewards every week"* experience — the key to long-term retention.

---

### 8.1 Savings Dashboard

```
 Your GigShield Savings

  Total Premiums Paid:      ₹432  (lifetime)
  Total Payouts Received:   ₹2,400 (lifetime)
                            ──────────────────
  Net Savings:              ₹1,968 

  Return on Protection:     556% 
  "For every ₹1 you paid, you got ₹5.56 back"
```

The **Return on Protection** metric reframes insurance as an investment. Workers become evangelists when they can show zone-mates their ROI.

---

### 8.2 GigPoints — How to Earn

| Action | Points | Notes |
|---|---|---|
| Buy a weekly policy | +50 pts | Every week |
| Policy active during a disruption | +100 pts | Stayed covered when it mattered |
| Payout received | +200 pts | System worked for you |
| Renew without lapsing | +75 pts | Per streak week |
| 4-week no-lapse streak | +300 pts | Milestone bonus |
| 12-week streak | +1,000 pts | Champion milestone |
| Refer a zone partner | +500 pts | Per confirmed referral (verified by platform zone ID — fake accounts blocked) |
| Complete profile | +100 pts | One-time only |

**Points are NOT earned for:** lapsed weeks, pending fraud review periods.

---

### 8.3 Tier Structure & Benefits

| Tier | Points | Premium Discount | Extra Benefit |
|---|---|---|---|
| 🥉 Starter | 0–999 | None | Standard coverage |
| 🥈 Reliable | 1,000–2,499 | 5% off weekly premium | — |
| 🥇 Veteran | 2,500–4,999 | 10% off weekly premium | Priority payout < 30 sec |
| 💎 Champion | 5,000+ | 15% off weekly premium | 1 free week every quarter |

### Redemption Milestones

| Points | Reward |
|---|---|
| 1,000 pts | 5% premium waiver on next renewal |
| 2,500 pts | 10% waiver + priority payout queue |
| 5,000 pts | 1 free week every 13 weeks |
| 7,500 pts | ₹500 bonus coverage top-up for 1 month |
| 10,000 pts | Lifetime Veteran badge + 15% permanent discount |

---

### 8.4 Worker Protection Timeline

```
Today
  12:10 PM    Rainfall Trigger — HSR Layout    +₹600  +200 pts
  11:45 AM    Policy Active (Pro Shield)

Yesterday
  03:20 PM  🌫️  AQI Trigger — HSR Layout          +₹600  +200 pts

This Week
  Protected Income:   ₹1,200
  GigPoints Earned:   +725 pts
  Active Since:       Week 7 — 🥈 Reliable Tier
```

---

### 8.5 Policy Certificate (Downloadable PDF)

```
┌─────────────────────────────────────┐
│  🛡️  GIGSHIELD POLICY CERTIFICATE   │
│       Certificate of Coverage        │
│                                      │
│  Policy ID:    GS-2026-HSR-00342    │
│  Holder:       Ravi Kumar            │
│  Zone:         HSR Layout, Bangalore │
│  Plan:         Pro Shield            │
│  Coverage:     ₹600/disruption day   │
│  Valid:        10 Mar – 16 Mar 2026  │
│  Premium Paid: ₹108                  │
│  Tier:         🥈 Reliable           │
│                                      │
│  Covered Triggers:                   │
│  • Rainfall > 15mm/hr (10 min)       │
│  • AQI > 300 (10 min)                │
│  • Temperature > 43°C (10 min)       │
│  • Dark Store Closure (instant)      │
│  • Local Curfew (instant)            │
└─────────────────────────────────────┘
```

---

### 8.6 Claim Statement / EOB (Explanation of Benefits)

```
CLAIM STATEMENT — GS-CLM-0892

  Event:       Heavy Rainfall
  Zone:        HSR Layout
  Triggered:   12:10 PM, March 10, 2026
  Validated:   12:11 PM (automated)
  Payout:      ₹600

  Validation Summary:
     GPS in zone (0.8 km from center)
     Active (3 deliveries in last 30 min)
     App logged in at time of trigger
     No duplicate claim

  Payment:      UPI — ravi@okicici
  GigPoints:    +300 pts credited
  Status:        SETTLED
```

---

### 8.7 Coverage Gap Detector

```
  You Were Not Covered Today

A rainfall trigger fired in HSR Layout at 12:10 PM.
34 active Pro Shield workers each received ₹600.

You would have received:  ₹600
You would have earned:    +300 GigPoints
Policy lapsed:            Sunday midnight

→  Renew now — ₹108/week
→  Enable auto-renew so this never happens again
```

---

### 8.8 Zone Disruption History

```
Zone: HSR Layout — Last 30 Days

Mar 10   Heavy Rain (19mm/hr)  — 4 hrs — 34 workers paid — ₹20,400
Mar 08   AQI 320               — 2 hrs — 31 workers paid — ₹18,600
Mar 03   Dark Store Closure    — 3 hrs — 28 workers paid — ₹16,800
Feb 28   Extreme Heat (44°C)   — 6 hrs — 40 workers paid — ₹24,000
```

Shows workers the system reliably pays out — builds trust before they personally experience a claim.

---

### 8.9 Referral + Group Enrollment

```
Refer a zone partner → Both get ₹50 off next week's premium
                        Referrer earns +500 GigPoints

Zone Milestone:  If 20+ workers in your zone enroll
                 → Everyone in the zone gets ₹20 cashback that week
```

Solves adverse selection — entire zones enroll together, not just the highest-risk workers.

---

## 9. Advanced Features

These five features push GigShield beyond a standard hackathon submission and into a product that feels real, intelligent, and deeply worker-centric.

---

### 9.1 Worker Lifetime Protection Graph

Most workers don't understand the long-term value of insurance. This feature makes it viscerally obvious with a visual yearly breakdown of what they paid vs what they received.

**What the worker sees:**

```
📊 Your Lifetime Protection

         Yearly Breakdown — 2026
         ─────────────────────────────────────

  Premium Paid:    ₹3,200   [████████░░░░]  indigo bar
  Payout Received: ₹4,800   [████████████]  green bar
  Net Benefit:    +₹1,600 

  Month-by-month breakdown:
  Jan ██░░  ₹400 paid / ₹0 received
  Feb ██░░  ₹400 paid / ₹0 received
  Mar ████  ₹400 paid / ₹600 received   ← Rain event
  Apr ██░░  ₹400 paid / ₹0 received
  May ████  ₹400 paid / ₹600 received   ← Heat event
  Jun ████████ ₹400 paid / ₹1,800 received ← 3 Rain events

  All-time ROI: 150% 
  "Your insurance has made you ₹1,600 richer this year"

  [Toggle: Monthly / Yearly]
```

**Why this matters:** Workers in India are highly skeptical of insurance because they feel they "never get anything back." Showing a yearly graph where payouts exceed premiums turns skeptics into advocates — this single screen drives referrals better than any marketing.

**Technical implementation:**
- PostgreSQL: aggregate `premiums_paid` and `payouts_received` grouped by month per worker
- Recharts `BarChart` — two bars per month, indigo for premium, green for payout
- Yearly total card above chart with net benefit highlighted in green
- Monthly / Yearly toggle

---

### 9.2 Worker Collective Protection Pool

A community-driven micro-insurance layer where workers in the same zone voluntarily contribute small top-up amounts together to create a shared emergency pool — separate from and in addition to their standard GigShield policy.

**How it works:**

```
Zone Pool — HSR Layout
──────────────────────────────────────────
  Pool Members:        34 workers
  Weekly Contribution: ₹10/worker (opt-in)
  Pool Balance:        ₹1,240 this week

  Pool Rules (voted by members):
  • Worker loses income due to disruption below trigger threshold → eligible
  • Max draw: ₹500/worker/month from pool
  • Unused balance rolls over to next week

  Your contribution this week:  ₹10
  Your draws from pool (lifetime): ₹0
  Pool health: 🟢 Strong (covers ~2 events)
```

**Why this is powerful:** Parametric insurance has a natural floor — a trigger either fires or it doesn't. The collective pool fills the gap for borderline situations where a worker was disrupted but the zone-level trigger didn't formally fire (e.g., rainfall at 13mm/hr just below the 15mm/hr threshold). It also builds **zone-level social trust** — workers who contribute together actively discourage fraud by their peers.

**Technical implementation:**
- New `zone_pool` table: `zone_id`, `balance`, `week_start`, `contributors`
- Workers opt in on dashboard — ₹10 deducted from weekly premium payment
- Disbursement: shift gap detection + peer vote threshold (>50% of pool members)
- Pool health indicator: balance vs expected weekly payout ratio
- Admin panel: pool balances per zone, contribution rates, disbursement history

---

### 9.3 GigBot — AI Chatbot for Help & FAQs

A lightweight AI chatbot embedded in the worker app that answers insurance questions in plain language — in **Hindi and English** — without the worker needing to call anyone or read a document.

**Sample conversation:**

```
Worker: mere paise kab aayenge?
        (When will my money arrive?)

GigBot: Agar aapke zone mein trigger hua hai aur
        aapki policy active hai, toh payout
        automatically 60 seconds mein aa jaata hai
        UPI pe. Aapka claim status check karein →
        [View Claim Status]

────────────────────────────────────────────

Worker: my claim was rejected, why?

GigBot: Here's what happened with your last claim:

         GPS in zone:     FAILED
           (You were 4.2 km from HSR Layout center)
         Was active:      PASSED (2 deliveries)
         App logged in:   PASSED
         No duplicate:    PASSED

        Your score was 0.75 — just at the threshold.
        The GPS check failed because your location
        didn't match your registered zone at trigger time.

        Need help? [Talk to Support]

────────────────────────────────────────────

Worker: What events are covered?

GigBot: GigShield covers income lost due to:
         Heavy Rain (>15mm/hr, 10 min sustained)
         Severe AQI (>300)
         Extreme Heat (>43°C)
         Dark Store Closure
         Local Curfew

        NOT covered: vehicle repairs, health,
        accidents, or personal emergencies.

        [View My Policy]  [Buy Coverage]
```

**FAQ topics handled automatically:**
- How triggers work and current zone thresholds
- Why a specific claim was rejected (with the exact validation checklist)
- How to upgrade, downgrade, or cancel a plan
- GigPoints balance, tier progress, and redemption
- Policy renewal and auto-renew setup
- How the Collective Pool works and how to join
- Payout timing and UPI troubleshooting

**Technical implementation:**
- `claude-sonnet-4-6` via Anthropic SDK
- System prompt contains GigShield policy rules, trigger thresholds, and the worker's personal policy + claim data injected per session
- Hindi / English auto-detection — responds in the worker's language
- Floating chat button (bottom right corner) on all worker screens
- Fallback: "Talk to Support" CTA for edge cases the bot can't resolve

---

### 9.4 Smart Policy Expiry Reminder System

A multi-channel, context-aware reminder system that ensures workers never accidentally lapse their coverage.

**Reminder Schedule:**

```
Friday 6:00 PM  →  Push Notification:
  " Your policy expires in 2 days.
   Renew now to stay protected this weekend.
   Next week forecast: ₹127 (+18%) — buy today "

Saturday 10:00 AM  →  SMS (Twilio):
  "GigShield: Policy expires TOMORROW (Sunday midnight).
   Renew: gigshield.app/renew | Reply STOP to opt out."

Sunday 6:00 PM  →  Push Notification:
  " 6 hours left on your policy.
   Auto-renew is OFF — tap to enable before midnight."

Sunday 11:30 PM  →  Final SMS:
  "GigShield: 30 mins to expiry.
   Renew now: gigshield.app/renew"

Monday 12:00 AM  →  If not renewed:
   Coverage Gap Detector activates on next app open
```

**Smart context layered into reminders:**
- **Zone risk surge:** If next week forecast is HIGH → *"⚠️ High disruption risk forecast for your zone — don't miss this renewal"*
- **Streak awareness:** *"Renew now to keep your 8-week streak — you're 200 pts from Veteran Tier 🥇"*
- **Lapse history:** If worker lapsed before → *"You missed a ₹600 payout last week. Don't let it happen again."*
- **Price forecast hook:** Current premium vs next week price shown in Friday reminder

**Technical implementation:**
- `node-cron` jobs: Friday 6 PM, Saturday 10 AM, Sunday 6 PM, Sunday 11:30 PM
- Twilio SMS API (trial/mock) for SMS channel
- Web Push API via PWA service worker for push channel
- UPI mandate simulation via Razorpay recurring payments (test mode) for auto-renew
- Worker preference: push-only, SMS-only, or both

---

### 9.5 Predictive Premium Price Forecast

The most innovative feature in GigShield. Similar to how flight price trackers show *"prices expected to rise — book now"*, GigShield shows workers a **7-day forward premium forecast** so they know if buying today is cheaper than waiting.

**What the worker sees on the Policy screen:**

```
📈 Premium Forecast — HSR Layout (Pro Shield)

  This Week:    ₹108/week  ◀ BUY NOW (lowest in 3 weeks)
  Next Week:    ₹127/week  ▲ +18%  (monsoon approaching)
  Week +2:      ₹134/week  ▲ +24%
  Week +3:      ₹141/week  ▲ +31%

    Prices rising — IMD forecasts heavy rain Thu–Sat in your zone

  [Buy This Week's Policy — ₹108]
  "Lock in today's price before it rises"

  ─────────────────────────────────────────
  What's driving your premium?

  Rainfall forecast:   High    ▲ (+++)
  AQI trend:           Worsening ▲ (++)
  Historical June:     High risk ▲ (++)
  Traffic index:       Normal   → (+)

  Outlook: Prices expected to RISE next 3 weeks
```

**Data Inputs — Multi-Signal Fusion:**

| Signal | Source | Weight |
|---|---|---|
| 7-day rainfall forecast | OpenWeatherMap forecast API | 35% |
| AQI trend (3-day moving avg) | WAQI API | 30% |
| Historical disruption rate for month | Internal DB | 25% |
| Traffic disruption index | Mock / TomTom API | 5% |
| Ground situation signals | News API keywords (mock) | 5% |

**Technical implementation:**

```python
# ai/premium_forecaster.py

def forecast_premium_next_7_days(zone_id: str, base_plan: str) -> list:
    forecasts = []
    for day_offset in range(7):
        target_date = today() + timedelta(days=day_offset)

        weather_risk  = get_weather_forecast_risk(zone_id, target_date)
        aqi_risk      = get_aqi_trend_risk(zone_id, target_date)
        seasonal_risk = get_historical_seasonal_risk(zone_id, target_date)
        ground_risk   = get_ground_situation_risk(zone_id, target_date)

        composite_risk = (
            0.35 * weather_risk  +
            0.30 * aqi_risk      +
            0.25 * seasonal_risk +
            0.10 * ground_risk
        )

        adjustment       = 1 + (0.4 * (composite_risk - 0.5))
        forecast_premium = round(BASE_PREMIUMS[base_plan] * adjustment)

        forecasts.append({
            "date":             target_date.strftime("%a %d %b"),
            "risk_score":       round(composite_risk, 2),
            "forecast_premium": forecast_premium,
            "trend":            "rising"  if composite_risk > 0.6 else
                                "stable"  if composite_risk > 0.4 else "falling",
            "primary_driver":   get_primary_driver(weather_risk, aqi_risk,
                                                   seasonal_risk, ground_risk)
        })
    return forecasts
```

**Why this is a 5-star feature:** No insurance product in India shows a forward price forecast. It creates urgency (conversion), builds trust through transparency (retention), and demonstrates AI sophistication judges will not have seen from any other team. The airline pricing analogy is immediately intuitive.

---

## 10. Platform Justification

**Platform: Progressive Web App (PWA) — Mobile-First**

### Why Not Native Android?

| Problem | Impact on GigShield |
|---|---|
| Play Store review: 3–7 days | Cannot demo a live app by Phase 2 deadline |
| Workers already have 3–4 delivery apps | Storage-sensitive — another APK won't be downloaded |
| Version updates require user action | Trigger logic must update instantly across all workers |
| Judges won't install unknown APK | Friction kills the demo evaluation |

### Why Not Pure Desktop Web?

| Problem | Impact |
|---|---|
| Workers are on the road on phones | They will never open a laptop between deliveries |
| Lock-screen alerts need mobile | Pre-disruption and payout notifications must be instant |
| GPS zone detection needs mobile | Browser GPS works on mobile, not desktop |

### Why PWA Wins

**1. Zero Friction Onboarding**
A Zepto partner gets a WhatsApp link → opens in Chrome → *"Add to Home Screen"* → icon on phone. No Play Store, no download. Onboarding in under 60 seconds.

**2. Instant Updates — Critical for Insurance**
When trigger thresholds change or new zones are added, the update deploys server-side. Every worker gets it instantly — no version mismatch in live insurance contracts.

**3. Push Notifications on Android Chrome**
Pre-disruption alerts and payout confirmations hit the lock screen without a native app. These are the two most critical UX moments in parametric insurance.

**4. Offline Support**
Service workers cache the active policy details, zone info, GigPoints balance, and claim history. Workers check their coverage mid-delivery with no signal.

**5. One Codebase — Two Experiences**
The same React codebase serves the mobile worker (card UI, large touch targets) and the desktop admin (Leaflet map, Risk Simulator, analytics). No duplication, full speed.

---

*"Our workers live on their phones between deliveries. A PWA gives them a native app experience via a WhatsApp link — no Play Store, no storage concerns, no version lag. The same codebase gives our insurers a full desktop analytics dashboard. It's the only architecture that serves both users perfectly."*

---

## 11. Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js + Tailwind CSS | Worker app + Admin dashboard |
| Leaflet + OpenStreetMap | Zone risk heatmap — free, no API key required |
| Recharts | Analytics, savings charts, GigPoints progress bars, Lifetime Protection Graph |
| PWA (manifest + service worker) | Installable, offline support, push notifications |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | REST APIs for all core operations |
| PostgreSQL | Workers, policies, claims, zones, payouts, GigPoints, collective pools |
| node-cron | 5-minute trigger poller + multi-touchpoint reminder scheduler |

### AI / ML
| Tech | Purpose |
|---|---|
| Python + scikit-learn | Risk scoring, fraud validation logic |
| XGBoost | Dynamic weekly premium calculation |
| pandas + numpy | Historical data processing, 7-day zone forecasting |
| Multi-signal fusion model | Predictive premium price forecast (7-day forward) |
| Claude API (claude-sonnet-4-6) | GigBot — policy-aware chatbot, Hindi + English |

### External APIs
| API | Purpose | Cost |
|---|---|---|
| OpenWeatherMap | Live weather + rainfall per zone lat/lng | Free tier |
| WAQI API | Live AQI per zone coordinates | Free tier |
| Razorpay Test Mode | Simulated UPI payouts + recurring mandate (auto-renew) | Free sandbox |
| Twilio (trial) / Mock | Multi-touchpoint SMS reminder system | Free trial |
| Anthropic Claude API | GigBot chatbot | Free trial credits |
| News API / Mock | Ground situation signals for premium forecast | Free tier |

### Infrastructure
| Tech | Purpose |
|---|---|
| Render / Railway | Backend + frontend hosting | Free tier |
| GitHub | Version control + submission repository | Free |

---

## 12. Feature List

### Worker App

| Feature | Phase |
|---|---|
| OTP registration + zone auto-detection | 2 |
| AI-adjusted weekly premium (shown transparently) | 2 |
| Premium Price Forecast — 7-day forward pricing | 2 |
| Policy purchase with UPI / Razorpay mock | 2 |
| Policy Certificate PDF (downloadable) | 2 |
| Zone Status Widget (🟢🟡🔴) | 2 |
| Pre-disruption weather push alert | 2 |
| Auto claim creation + fraud validation | 2 |
| Claim Statement / EOB PDF | 2 |
| GigBot chatbot (Hindi + English, policy-aware) | 2 |
| Protection Timeline feed | 3 |
| Savings Dashboard (net savings + ROI %) | 3 |
| Lifetime Protection Graph (monthly bar chart + ROI) | 3 |
| GigPoints balance + tier progress bar | 3 |
| Points activity history | 3 |
| Zone Disruption History (30 days) | 3 |
| Coverage Gap Detector | 3 |
| Smart policy expiry reminders (4-touchpoint schedule) | 3 |
| Auto-renew toggle + UPI mandate simulation | 3 |
| Referral system + zone group enrollment | 3 |
| Collective Protection Pool (opt-in, zone community fund) | 3 |

### Admin Dashboard

| Feature | Phase |
|---|---|
| Leaflet + OSM zone risk heatmap | 2 |
| Real-time disruption + claims live feed | 2 |
| Fraud console with per-check explainability | 2 |
| Loss ratio analytics + payout trends | 3 |
| 7-Day Zone Risk Predictor | 3 |
| Risk Simulator with live sliders | 3 |
| GigPoints / loyalty tier monitor | 3 |
| Zone-wise payout breakdown | 3 |

---

## 13. Business Viability

### Unit Economics — 1,000 Workers, Bangalore

```
Weekly Premium Pool:
  1,000 workers × ₹99 avg = ₹99,000/week

Monsoon Season (Jun–Sep):
  ~3 events/week × 150 workers affected × ₹500 avg payout
  = ₹2,25,000/week gross claims
  Loss Ratio = 2.27  →  Reinsurer absorbs 70% above 1.5× threshold
  GigShield net payout:  ₹44,550/week  →  Net Loss Ratio: 0.45

Off-Season (Oct–May):
  ~0.8 events/week × 40 workers affected × ₹500 avg payout
  = ₹16,000/week in payouts
  Loss Ratio = 0.16  →  Highly profitable

Annual Per-Worker Economics:
  Premium collected:  ₹99 × 52 weeks = ₹5,148
  Average claims:     ~₹1,800/year
  Gross margin:       ~65% off-season / reinsured in-season
```

### Sustainability Strategy

- **Dynamic surge pricing** during monsoon season (+40% premium uplift)
- **Reinsurance layer** covers loss ratios above 1.5x
- **Zone-level risk differentiation** prevents adverse selection — risky zones priced higher
- **GigPoints loyalty** reduces churn — Champion-tier workers target 85%+ renewal rate
- **Referral + group enrollment** grows the risk pool organically within zones
- **Collective Pool** improves retention by covering below-threshold events
- **Fraud detection** targets < 5% fraudulent claim rate

---

## 14. Team

| Name | Role |
|---|---|
| Rian K Sinu | Full Stack Development |
| Romit Deokar | AI/ML Engineering |
| Vandanapu Saidhiraj | Frontend + UX |
| Pragalbh Rai | Backend + DevOps |
| Manmohan Singh | Backend + DevOps |

**University:** SRM University
**Persona Track:** Q-Commerce / Instant Delivery (Zepto / Blinkit)

---

## 📎 Submission Links

- **GitHub Repository:** *(this repo)*
- **Demo Video (2 min):** [Link to be added — Phase 1]
- **Figma Wireframes:** [Link to be added]

---
> *Built for Guidewire DEVTrails 2026 — Unicorn Chase*
>
> *"Build fast. Spend smart. Don't go broke. Happy Hacking."*
