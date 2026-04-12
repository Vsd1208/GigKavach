import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  Clock3,
  Lock,
  Shield,
  SunMedium,
  Thermometer,
  Users,
  Wallet,
  Wind,
} from 'lucide-react'
import { useTheme } from '../Context/ThemeContext'

const fieldNotes = [
  {
    title: 'Rain stopped the shift, not the payout',
    note: 'If a zone crosses the trigger threshold, the worker should not spend the next two days chasing paperwork.',
  },
  {
    title: 'Built around weekly cash flow',
    note: 'The product is framed like how gig workers actually budget: small weekly amounts, clear cover, no hidden waiting.',
  },
  {
    title: 'Designed for ordinary bad days',
    note: 'A closed dark store or dangerous AQI spike is enough to break a week. The interface should respect that reality.',
  },
]

const coverageRows = [
  {
    icon: CloudRain,
    label: 'Heavy rainfall',
    threshold: '15 mm/hr and above',
    detail: 'For zones where weather makes delivery unsafe or impossible.',
  },
  {
    icon: Thermometer,
    label: 'Extreme heat',
    threshold: '43 C and above',
    detail: 'Coverage for days when outdoor work becomes a health risk.',
  },
  {
    icon: Wind,
    label: 'Severe air quality',
    threshold: 'AQI 300 and above',
    detail: 'Useful in cities where air quality can abruptly halt work.',
  },
  {
    icon: Lock,
    label: 'Platform or civic shutdowns',
    threshold: 'Store closure, flood alert, or curfew',
    detail: 'Not just weather. Operational stoppages count too.',
  },
]

const plans = [
  {
    name: 'Basic',
    price: 'Rs 49',
    cover: 'Rs 300 per disruption day',
    note: 'For workers who want a low weekly entry point.',
  },
  {
    name: 'Pro',
    price: 'Rs 99',
    cover: 'Rs 600 per disruption day',
    note: 'Best for regular full-shift partners who need steadier cover.',
    featured: true,
  },
  {
    name: 'Elite',
    price: 'Rs 149',
    cover: 'Rs 1000 per disruption day',
    note: 'For riders and partners with longer daily working hours.',
  },
]

const faqs = [
  {
    q: 'Is this normal insurance?',
    a: 'Not quite. GigShield is parametric cover. If the agreed trigger is hit in your zone, the payout logic starts automatically.',
  },
  {
    q: 'Do I have to file a claim?',
    a: 'No manual claim form is needed for the covered triggers shown here. The system checks the event, validates eligibility, and proceeds.',
  },
  {
    q: 'Who is this meant for?',
    a: 'Delivery partners, gig workers, and platform-linked workers whose income depends on being able to work on a given day.',
  },
  {
    q: 'Can I just try it for a week?',
    a: 'Yes. The plans are weekly, so the commitment feels closer to the way workers actually manage cash flow.',
  },
]

export default function LandingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0)
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-dark text-text-primary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(181,108,58,0.14),transparent_38%),radial-gradient(circle_at_top_right,rgba(143,109,79,0.14),transparent_34%)]" />

      <nav className="sticky top-0 z-40 border-b border-dark-border/60 bg-dark/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#a45b33,#d49a59)] text-white shadow-[0_12px_24px_rgba(164,91,51,0.22)]">
              <Shield size={18} />
            </div>
            <div className="text-left">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-text-muted">GigShield</p>
              <p className="text-sm text-text-secondary">Income cover for disrupted shifts</p>
            </div>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#coverage" className="text-sm text-text-secondary transition-colors hover:text-text-primary">Coverage</a>
            <a href="#plans" className="text-sm text-text-secondary transition-colors hover:text-text-primary">Plans</a>
            <a href="#faq" className="text-sm text-text-secondary transition-colors hover:text-text-primary">Questions</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-dark-card transition-colors hover:border-primary/30"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <SunMedium size={16} className={isDark ? 'text-warning' : 'text-text-secondary'} />
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hidden rounded-full border border-dark-border px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary md:block"
            >
              Admin view
            </button>
            <button
              onClick={() => onNavigate('worker')}
              className="rounded-full bg-[linear-gradient(145deg,#a45b33,#d49a59)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(164,91,51,0.24)] transition-transform hover:-translate-y-0.5"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dark-border bg-dark-card/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-text-muted">
              <span className="h-2 w-2 rounded-full bg-[#a45b33]" />
              Grounded protection, not generic insurance copy
            </div>

            <h1 className="max-w-3xl font-['Iowan_Old_Style','Palatino_Linotype','Book_Antiqua',Georgia,serif] text-5xl leading-[1.02] tracking-[-0.03em] text-text-primary sm:text-6xl lg:text-[4.8rem]">
              Cover the days when work stops before income does.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary sm:text-[1.15rem]">
              GigShield is a weekly safety layer for delivery partners and platform workers. It watches local disruption signals,
              understands when a zone becomes unworkable, and helps turn that interruption into a cleaner payout experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('worker')}
                className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(145deg,#a45b33,#d49a59)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(164,91,51,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Sign in or create account
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-2 rounded-full border border-dark-border bg-dark-card px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary/30"
              >
                <BarChart3 size={16} />
                View insurer dashboard
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard value="Under 60 sec" label="Typical payout handoff" />
              <StatCard value="Weekly plans" label="No annual lock-in" />
              <StatCard value="Zone-based" label="Built around real working areas" />
            </div>
          </div>

          <HeroPanel />
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-10 lg:grid-cols-3">
          {fieldNotes.map((item) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-dark-border/70 bg-dark-card/80 p-7 shadow-[0_18px_40px_rgba(26,19,51,0.06)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Field note</p>
              <h2 className="mt-3 text-xl font-semibold leading-7 text-text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{item.note}</p>
            </article>
          ))}
        </section>

        <section id="coverage" className="mx-auto max-w-6xl px-6 py-18">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#a45b33]">Coverage</p>
              <h2 className="mt-3 font-['Iowan_Old_Style','Palatino_Linotype','Book_Antiqua',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-text-primary">
                A calmer, clearer way to explain what the product actually covers.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-text-secondary">
                Instead of overloaded dashboards and loud trust badges, the page now uses simple language and visible thresholds.
                That makes the product feel more credible and less synthetic.
              </p>
            </div>

            <div className="space-y-4">
              {coverageRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-4 rounded-[28px] border border-dark-border/70 bg-dark-card/70 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(164,91,51,0.12)] text-[#a45b33]">
                    <row.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{row.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{row.detail}</p>
                  </div>
                  <div className="rounded-full bg-dark-surface px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-text-muted">
                    {row.threshold}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plans" className="border-y border-dark-border/60 bg-dark-card/35 py-18">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8f6d4f]">Plans</p>
                <h2 className="mt-3 font-['Iowan_Old_Style','Palatino_Linotype','Book_Antiqua',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-text-primary">
                  Weekly pricing that feels close to how workers actually decide.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-text-secondary">
                The cards are quieter now, with fewer badges and less marketing noise. They read more like product information than ad copy.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`rounded-[30px] border p-7 ${
                    plan.featured
                      ? 'border-[rgba(164,91,51,0.35)] bg-[linear-gradient(180deg,rgba(164,91,51,0.1),rgba(255,255,255,0.02))] shadow-[0_22px_48px_rgba(164,91,51,0.12)]'
                      : 'border-dark-border/70 bg-dark-card/75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
                    {plan.featured && (
                      <span className="rounded-full bg-[rgba(164,91,51,0.14)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#a45b33]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-text-primary">{plan.price}</p>
                  <p className="mt-2 text-sm text-text-secondary">{plan.cover}</p>
                  <p className="mt-6 text-sm leading-7 text-text-secondary">{plan.note}</p>

                  <div className="mt-7 space-y-3 text-sm text-text-secondary">
                    <FeatureRow text="Automatic trigger-based flow" />
                    <FeatureRow text="Weekly premium visibility" />
                    <FeatureRow text="Straightforward coverage language" />
                  </div>

                  <button
                    onClick={() => onNavigate('worker')}
                    className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      plan.featured
                        ? 'bg-[linear-gradient(145deg,#a45b33,#d49a59)] text-white'
                        : 'border border-dark-border bg-dark-surface text-text-primary'
                    }`}
                  >
                    Sign in to choose this plan
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-18 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[32px] border border-dark-border/70 bg-dark-card/75 p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f6d4f]">What the worker sees</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-text-primary">A dashboard that reads like a working tool, not a concept mockup.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MiniMetric icon={Clock3} label="Payout rhythm" value="Fast handoff after trigger validation" />
              <MiniMetric icon={Wallet} label="Weekly cover" value="Visible pricing before payment" />
              <MiniMetric icon={Users} label="Zone context" value="Local alerts tied to real work areas" />
              <MiniMetric icon={Shield} label="Policy clarity" value="Coverage explained in plain terms" />
            </div>
          </article>

          <article id="faq" className="rounded-[32px] border border-dark-border/70 bg-dark-card/80 p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#a45b33]">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-text-primary">The interface feels more believable when the language does too.</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={faq.q} className="overflow-hidden rounded-[22px] border border-dark-border/70 bg-dark-surface/50">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-text-primary">{faq.q}</span>
                      <ChevronDown size={18} className={`shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="px-5 pb-5 text-sm leading-7 text-text-secondary">{faq.a}</p>}
                  </div>
                )
              })}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-[24px] border border-dark-border/70 bg-dark-card/75 px-5 py-4">
      <p className="text-lg font-semibold tracking-[-0.03em] text-text-primary">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  )
}

function FeatureRow({ text }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 size={16} className="shrink-0 text-[#8f6d4f]" />
      <span>{text}</span>
    </div>
  )
}

function MiniMetric({ icon, label, value }) {
  const MetricIcon = icon
  return (
    <div className="rounded-[24px] border border-dark-border/70 bg-dark-surface/50 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(143,109,79,0.14)] text-[#8f6d4f]">
        <MetricIcon size={18} />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-text-muted">{label}</p>
      <p className="mt-2 text-sm leading-6 text-text-primary">{value}</p>
    </div>
  )
}

function HeroPanel() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-dark-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_50px_rgba(16,24,40,0.08)]">
      <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-[rgba(164,91,51,0.12)] blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-[rgba(143,109,79,0.12)] blur-3xl" />

      <div className="relative rounded-[30px] border border-dark-border/70 bg-dark/90 p-5">
        <div className="flex items-center justify-between border-b border-dark-border/60 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Worker snapshot</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary">Ravi Kumar</h3>
          </div>
          <div className="rounded-full bg-[rgba(143,109,79,0.16)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#8f6d4f]">
            Zone stable
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-dark-border/70 bg-dark-card/90 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Current cover</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text-primary">Rs 600</p>
            <p className="mt-1 text-sm text-text-secondary">per disruption day on Pro plan</p>
          </div>

          <div className="rounded-[24px] border border-dark-border/70 bg-dark-card/90 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Weekly outlook</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text-primary">5 days</p>
            <p className="mt-1 text-sm text-text-secondary">remaining before renewal</p>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-dark-border/70 bg-dark-card/90 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Recent payout</p>
              <p className="mt-2 text-xl font-semibold text-text-primary">Rain disruption in HSR Layout</p>
            </div>
            <p className="text-lg font-semibold text-[#8f6d4f]">Rs 600</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            A more natural interface does not need loud animations to prove it works. Clear status, clear numbers, clear context are enough.
          </p>
        </div>
      </div>
    </section>
  )
}
