import { useState, useEffect } from 'react'
import { Shield, Zap, ChevronRight, ArrowRight, CloudRain, Wind, Thermometer, AlertTriangle, Star, Users, Clock, IndianRupee, TrendingUp, CheckCircle2, BarChart3, Lock, Wifi, ChevronDown, Smartphone, Globe, Activity, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const stats = [
  { label: 'Avg Payout Time', value: '<60s', icon: Clock },
  { label: 'Workers Protected', value: '10,000+', icon: Users },
  { label: 'Claims Auto-Processed', value: '98%', icon: Zap },
  { label: 'Avg ROI for Workers', value: '556%', icon: TrendingUp },
]

const triggers = [
  { icon: CloudRain, label: 'Heavy Rain', threshold: '>15 mm/hr', desc: 'Automatic detection when rainfall exceeds safe delivery limits' },
  { icon: Thermometer, label: 'Extreme Heat', threshold: '>43°C', desc: 'Heat wave protection for outdoor delivery workers' },
  { icon: Wind, label: 'Severe AQI', threshold: '>300 AQI', desc: 'Air quality monitoring for health-risk conditions' },
  { icon: AlertTriangle, label: 'Flash Flood', threshold: 'IMD Alert', desc: 'Government alert integration for flood warnings' },
]

const howItWorks = [
  { step: '01', title: 'Register & Get Zoned', desc: 'Sign up with your mobile, pick your platform. We auto-detect your dark store zone using GPS.', time: '2 min' },
  { step: '02', title: 'Choose Your Shield', desc: 'Pick Basic, Pro, or Elite plan. See your AI-adjusted premium transparently before paying.', time: '1 min' },
  { step: '03', title: 'Stay Protected 24/7', desc: 'We monitor your zone with real-time weather, AQI, and traffic data. Get alerts when conditions approach triggers.', time: 'Always on' },
  { step: '04', title: 'Instant Auto Payout', desc: 'Trigger breached? 4 fraud checks pass automatically. Money in your UPI in under 60 seconds. Zero paperwork.', time: '<60 sec' },
]

export default function LandingPage({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % howItWorks.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-dark min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-xl border-b border-dark-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">GigShield</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-text-muted hover:text-text-primary transition-colors">How It Works</a>
            <a href="#triggers" className="text-sm text-text-muted hover:text-text-primary transition-colors">Triggers</a>
            <a href="#plans" className="text-sm text-text-muted hover:text-text-primary transition-colors">Plans</a>
            <button onClick={() => onNavigate('admin')} className="text-sm text-text-muted hover:text-text-primary transition-colors">Admin Portal</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary/30 transition-all" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-text-secondary" />}
            </button>
            <button onClick={() => onNavigate('admin')} className="hidden md:block px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Insurer Login
            </button>
            <button onClick={() => onNavigate('worker')} className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg hover:opacity-90 transition-all shadow-sm shadow-primary/20">
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-20 right-[20%] w-[500px] h-[500px] bg-primary/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-accent/[0.05] rounded-full blur-[100px]" />
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Zap size={14} />
                Parametric Insurance for India's Gig Economy
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-text-primary">
                Your Income.{' '}
                <span className="text-gradient">Auto-Protected.</span>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
                Rain shuts down your zone? AQI spikes? Dark store closes? GigShield detects it in real-time and pays you in under 60 seconds. No claims. No paperwork. No waiting.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-6 py-3 gradient-primary rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                  Get Protected Now
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-6 py-3 bg-dark-card border border-dark-border rounded-xl text-text-primary font-semibold text-sm hover:border-primary/30 transition-all">
                  <BarChart3 size={16} />
                  Insurer Dashboard
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['R', 'P', 'A', 'M', 'S'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-dark">
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" className="text-warning" />)}
                  </div>
                  <p className="text-xs text-text-muted">Trusted by 10,000+ delivery partners</p>
                </div>
              </div>
            </div>

            {/* Right - Compact Phone mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/[0.08] rounded-[60px] blur-[80px] scale-110" />
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-dark-border/60 bg-dark-card/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="text-3xl font-bold text-text-primary">Protected in 4 simple steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i}
                   onClick={() => setActiveStep(i)}
                   className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                     activeStep === i 
                       ? 'border-primary/30 bg-primary/[0.05] shadow-lg shadow-primary/5' 
                       : 'border-dark-border bg-dark-card hover:border-dark-border/80'
                   }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-4 transition-colors ${
                  activeStep === i ? 'gradient-primary text-white' : 'bg-dark-surface text-text-muted'
                }`}>
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
                  activeStep === i ? 'text-primary' : 'text-text-muted'
                }`}>
                  <Clock size={12} />
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triggers */}
      <section id="triggers" className="py-20 bg-dark-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">What We Cover</p>
            <h2 className="text-3xl font-bold text-text-primary">6 parametric triggers, zero manual claims</h2>
            <p className="text-text-muted mt-3 max-w-lg mx-auto">When conditions breach thresholds, payouts happen automatically. No forms, no waiting, no ambiguity.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {triggers.map((trigger, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-dark-card rounded-2xl border border-dark-border/60 hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <trigger.icon size={18} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">{trigger.label}</h3>
                    <span className="px-2 py-0.5 bg-dark-surface rounded-full text-xs text-text-muted font-medium">{trigger.threshold}</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{trigger.desc}</p>
                </div>
              </div>
            ))}
            {/* Additional triggers */}
            <div className="flex items-start gap-4 p-5 bg-dark-card rounded-2xl border border-dark-border/60 hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">Dark Store Closure</h3>
                  <span className="px-2 py-0.5 bg-dark-surface rounded-full text-xs text-text-muted font-medium">Platform Signal</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">When your assigned store shuts down due to any disruption</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-dark-card rounded-2xl border border-dark-border/60 hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Wifi size={18} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">Local Curfew</h3>
                  <span className="px-2 py-0.5 bg-dark-surface rounded-full text-xs text-text-muted font-medium">Govt Alert</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">Government-imposed movement restrictions in your zone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Pricing</p>
            <h2 className="text-3xl font-bold text-text-primary">Weekly plans that fit gig budgets</h2>
            <p className="text-text-muted mt-3">No long-term lock-ins. Pay weekly, stay flexible.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Basic Shield', price: 49, payout: 300, hours: 6, features: ['All 6 triggers', 'UPI payout <60s', 'GigPoints rewards'] },
              { name: 'Pro Shield', price: 99, payout: 600, hours: 10, popular: true, features: ['All 6 triggers', 'UPI payout <60s', 'GigPoints rewards', 'Premium forecast alerts', 'Smart reminders'] },
              { name: 'Elite Shield', price: 149, payout: 1000, hours: 14, features: ['All 6 triggers', 'Priority UPI payout', 'GigPoints 2x multiplier', 'Premium forecast alerts', 'Dedicated support'] },
            ].map((plan, i) => (
              <div key={i} className={`relative p-6 rounded-2xl border transition-all ${
                plan.popular 
                  ? 'border-primary/30 bg-primary/[0.04] shadow-lg shadow-primary/10' 
                  : 'border-dark-border bg-dark-card'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 gradient-primary rounded-full text-xs font-semibold text-white shadow-sm shadow-primary/20">Most Popular</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                <p className="text-sm text-text-muted mt-1">Up to {plan.hours} hrs/day coverage</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-text-primary">₹{plan.price}</span>
                  <span className="text-sm text-text-muted">/week</span>
                  <p className="text-sm text-success font-medium mt-1">₹{plan.payout}/disruption payout</p>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 size={14} className="text-success shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate('worker')}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          plan.popular 
                            ? 'gradient-primary text-white shadow-sm shadow-primary/20 hover:opacity-90' 
                            : 'bg-dark-surface text-text-primary border border-dark-border hover:border-primary/30'
                        }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-dark-card/30">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary">Common questions</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: 'What is parametric insurance?', a: 'Unlike traditional insurance where you file a claim and wait, parametric insurance pays you automatically when a pre-defined trigger condition is met (e.g., rainfall >15mm/hr). No paperwork, no adjuster, no delays.' },
              { q: 'How fast are payouts?', a: 'Under 60 seconds. When a trigger is detected, our system runs 4 automated fraud checks (GPS, activity, session, duplicate) and sends money directly to your UPI if all pass.' },
              { q: 'What if I\'m not working when a trigger happens?', a: 'Our 4-layer fraud detection verifies you were actively working in the zone during the disruption. GPS location, delivery activity, app session, and duplicate claim checks all must pass.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Weekly plans with no lock-in. Simply don\'t renew the next week. Your GigPoints and tier status are preserved for 30 days.' },
              { q: 'How is this different from regular health/accident insurance?', a: 'GigShield strictly covers income loss from external disruptions (weather, AQI, store closures). We do NOT cover health, accidents, or vehicle damage. This is complementary coverage for the earnings you lose when you can\'t work.' },
            ].map((faq, i) => (
              <div key={i} className="border border-dark-border/60 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-surface/30 transition-colors"
                >
                  <span className="text-sm font-medium text-text-primary">{faq.q}</span>
                  <ChevronDown size={16} className={`text-text-muted transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Stop losing income to bad weather</h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">Join 10,000+ delivery partners who never worry about rain days again. Start protection in under 3 minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => onNavigate('worker')} className="group flex items-center gap-2 px-6 py-3 gradient-primary rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25">
              Open Worker App
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-6 py-3 border border-dark-border rounded-xl text-text-secondary font-semibold text-sm hover:border-primary/30 transition-all">
              Insurer Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-dark-border/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">GigShield</span>
            <span className="text-xs text-text-muted">| Guidewire DEVTrails 2026</span>
          </div>
          <p className="text-xs text-text-muted">Built by Team SRM — Rian, Romit, Saidhiraj, Pragalbh, Manmohan</p>
        </div>
      </footer>
    </div>
  )
}


// ─── PHONE MOCKUP COMPONENT (Compact) ───────────────
function PhoneMockup() {
  return (
    <div className="w-[320px] rounded-[36px] border-2 border-[#1a1333] dark:border-dark-border/80 bg-dark overflow-hidden shadow-2xl shadow-black/40 relative landing-phone-frame">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-2xl z-10" />
      
      {/* Screen content */}
      <div className="p-5 pt-10 pb-6 space-y-3.5">
        {/* Header */}
        <div>
          <p className="text-text-muted text-[11px]">Good afternoon,</p>
          <h2 className="text-[20px] font-bold text-text-primary tracking-tight">Ravi Kumar</h2>
        </div>

        {/* Zone Status */}
        <div className="bg-success/[0.08] border border-success/20 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-40" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-success tracking-wide">ZONE SAFE</p>
                <p className="text-[9px] text-text-muted">HSR Layout, Bangalore</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-text-muted">Rainfall</p>
              <p className="text-[12px] font-bold text-text-primary">3mm/hr</p>
            </div>
          </div>
        </div>

        {/* Active Policy */}
        <div className="card-insurance rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/[0.04] rounded-bl-[40px]" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Active Policy</p>
            <span className="px-2 py-0.5 bg-primary/15 text-primary border border-primary/20 rounded-full text-[8px] font-semibold">Pro Shield</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-[22px] font-bold text-text-primary tracking-tight">₹600</span>
            <span className="text-[10px] text-text-muted">/disruption day</span>
          </div>
          <div className="h-[4px] rounded-full bg-dark-border/60 overflow-hidden mb-1">
            <div className="h-full w-[71%] gradient-primary rounded-full" />
          </div>
          <p className="text-[9px] text-text-muted">5 days remaining</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card-insurance rounded-xl p-3">
            <p className="text-[9px] text-text-muted mb-1">GigPoints</p>
            <p className="text-[18px] font-bold text-gradient tracking-tight">2,450</p>
            <p className="text-[9px] text-text-muted mt-0.5">🥈 Reliable Tier</p>
          </div>
          <div className="gradient-emerald rounded-xl p-3">
            <p className="text-[9px] text-white/60 mb-1">Lifetime Net Savings</p>
            <p className="text-[18px] font-bold text-white tracking-tight">₹1,968</p>
            <p className="text-[9px] text-white/70 mt-0.5">556% Return on Protection</p>
          </div>
        </div>

        {/* Protection Timeline */}
        <div className="card-insurance rounded-xl p-3">
          <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider mb-2">Protection Timeline</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <CloudRain size={13} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-text-primary">Rainfall Trigger</p>
                <p className="text-[9px] text-text-muted">12:10 PM — HSR Layout</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-success">+₹600</p>
                <p className="text-[8px] text-primary">+200 pts</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
                <Wind size={13} className="text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-text-primary">AQI Trigger</p>
                <p className="text-[9px] text-text-muted">Yesterday — 3:20 PM</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-success">+₹600</p>
                <p className="text-[8px] text-primary">+200 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
