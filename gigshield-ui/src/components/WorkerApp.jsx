import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Shield, ArrowLeft, Home, FileText, Award, Clock, Settings, Bell, ChevronRight, CloudRain, Wind, Thermometer, AlertTriangle, MapPin, Zap, TrendingUp, IndianRupee, Gift, Users, Star, CheckCircle2, XCircle, Phone, Eye, EyeOff, ChevronDown, Download, RefreshCw, Info, Flame, Target, Trophy, History, UserPlus, ToggleLeft, ToggleRight, MessageCircle, Send, Bot, Wallet, Calendar, ArrowUpRight, ArrowDownRight, ChevronUp, Droplets, Sun, Gauge, Lock, Vote, PiggyBank, BellRing, Sparkles, TrendingDown, LineChart as LineChartIcon, BarChart3, Heart, Umbrella, ShieldCheck, Timer, Globe, Activity, Fingerprint, BadgeCheck, CircleDollarSign, Siren, HeartPulse, Navigation, ArrowRight, LayoutGrid, FileCheck, Percent, ShieldAlert, Landmark, CreditCard, Headphones, LogOut, Languages } from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────
const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'policy', label: 'Policy', icon: FileText },
  { id: 'points', label: 'Points', icon: Award },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: Settings },
]

const lifetimeData = [
  { month: 'Oct', premiums: 49, payouts: 0, net: -49 },
  { month: 'Nov', premiums: 52, payouts: 600, net: 548 },
  { month: 'Dec', premiums: 55, payouts: 0, net: -55 },
  { month: 'Jan', premiums: 99, payouts: 600, net: 501 },
  { month: 'Feb', premiums: 103, payouts: 1200, net: 1097 },
  { month: 'Mar', premiums: 108, payouts: 600, net: 492 },
]

const forecastData = [
  { day: 'Thu', premium: 108, risk: 0.74, driver: 'Rain' },
  { day: 'Fri', premium: 115, risk: 0.78, driver: 'AQI' },
  { day: 'Sat', premium: 121, risk: 0.82, driver: 'Rain+AQI' },
  { day: 'Sun', premium: 128, risk: 0.85, driver: 'Flood' },
  { day: 'Mon', premium: 141, risk: 0.91, driver: 'Monsoon' },
  { day: 'Tue', premium: 132, risk: 0.87, driver: 'Rain' },
  { day: 'Wed', premium: 118, risk: 0.79, driver: 'AQI' },
]

const chatResponses = {
  'claim status': { en: 'Your latest claim GS-CLM-0892 was auto-approved on Mar 10 at 12:11 PM. Payout: Rs.600 sent to your UPI (ravi@okicici). All 4 fraud checks passed.', hi: 'Aapka latest claim GS-CLM-0892 Mar 10 ko 12:11 PM par auto-approve hua. Rs.600 aapke UPI (ravi@okicici) mein bheja gaya. Sabhi 4 fraud checks pass.' },
  'premium': { en: 'Your current Pro Shield premium is Rs.108/week (base Rs.99 + 9% zone risk adjustment). You get 5% Reliable tier discount, so you pay Rs.103/week.', hi: 'Aapka Pro Shield premium Rs.108/week hai (base Rs.99 + 9% zone risk). Reliable tier discount 5% ke baad aap Rs.103/week pay karte ho.' },
  'triggers': { en: 'GigShield covers 6 triggers: Heavy Rain (>15mm/hr), Extreme Heat (>43C), Severe AQI (>300), Flash Flood (IMD Alert), Dark Store Closure, and Local Curfew. Each must sustain for 10 minutes.', hi: 'GigShield 6 triggers cover karta hai: Heavy Rain (>15mm/hr), Extreme Heat (>43C), AQI (>300), Flash Flood, Dark Store Closure, aur Curfew. Har trigger 10 min sustain hona chahiye.' },
  'points': { en: 'You have 2,450 GigPoints (Reliable tier). Earn: +200 per payout, +100 for active coverage, +75 streak bonus, +500 referral. You are 50 points away from Veteran tier (10% discount)!', hi: 'Aapke paas 2,450 GigPoints hain (Reliable tier). Veteran tier (10% discount) ke liye sirf 50 points aur chahiye!' },
  'pool': { en: 'Your zone HSR-01 has a Collective Protection Pool with 34 members. Pool balance: Rs.1,240. Max draw: Rs.500/month. You can opt-in from the Pool tab on your History page.', hi: 'Aapke zone HSR-01 ka Collective Pool mein 34 members hain. Balance: Rs.1,240. Max draw: Rs.500/month. History page se Pool tab mein opt-in karein.' },
  'default': { en: "I can help you with: claim status, premium info, trigger details, GigPoints, or pool info. Just type your question! For complex issues, I'll connect you with our support team.", hi: "Main aapki madad kar sakta hoon: claim status, premium info, trigger details, GigPoints, ya pool info. Koi bhi sawal puchiye! Complex issues ke liye support team se connect karunga." },
}

const reminderSchedule = [
  { day: 'Fri', time: '6:00 PM', type: 'push', status: 'sent', message: 'Your Pro Shield expires Sunday! Renew to keep your 7-week streak.' },
  { day: 'Sat', time: '10:00 AM', type: 'sms', status: 'sent', message: 'Rain expected Monday! Renew now to stay protected. Risk score rising to 0.82.' },
  { day: 'Sun', time: '6:00 PM', type: 'push', status: 'scheduled', message: 'Last chance! 6 hrs left on your Pro Shield. Your zone paid Rs.20,400 this week.' },
  { day: 'Sun', time: '11:30 PM', type: 'push', status: 'scheduled', message: 'URGENT: Policy expires in 30 min. Tap to auto-renew and save your streak!' },
  { day: 'Mon', time: '12:00 AM', type: 'auto', status: 'pending', message: 'Auto-renew activated. Rs.103 debited via UPI.' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-dark-card/95 backdrop-blur-md rounded-xl p-3 text-xs border border-dark-border/60 shadow-2xl shadow-black/30">
      <p className="text-text-primary font-semibold mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium leading-relaxed">
          {p.name}: {typeof p.value === 'number' && p.name !== 'Risk Score' ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

// Reusable section header
const SectionLabel = ({ children, action, actionLabel }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-[0.08em]">{children}</p>
    {action && <button onClick={action} className="text-[11px] text-primary font-medium hover:text-primary-light transition-colors">{actionLabel || 'View All'}</button>}
  </div>
)

// Status pill
const StatusPill = ({ status, children }) => {
  const colors = {
    success: 'bg-success/15 text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    danger: 'bg-danger/15 text-danger border-danger/20',
    info: 'bg-primary/15 text-primary border-primary/20',
    neutral: 'bg-dark-surface text-text-secondary border-dark-border',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[status] || colors.neutral}`}>
      {children}
    </span>
  )
}


// ─── MAIN COMPONENT ───────────────────────────────────
export default function WorkerApp({ onBack }) {
  const [screen, setScreen] = useState('splash')
  const [activeTab, setActiveTab] = useState('home')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)
  const [showChat, setShowChat] = useState(false)

  // Splash screen
  if (screen === 'splash') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-[50px] blur-[100px]" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 pattern-dots opacity-40" />
              <div className="absolute top-[15%] left-[-5%] w-[180px] h-[180px] rounded-full bg-primary/6 blur-[80px]" />
              <div className="absolute bottom-[15%] right-[-5%] w-[160px] h-[160px] rounded-full bg-accent/5 blur-[80px]" />
              
              <div className="relative z-10 text-center">
                {/* Logo */}
                <div className="w-[88px] h-[88px] rounded-[22px] gradient-primary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/25 float">
                  <Shield size={44} className="text-white drop-shadow-lg" />
                </div>
                
                <h1 className="text-[28px] font-extrabold text-text-primary mb-1.5 tracking-[-0.02em]">GigShield</h1>
                <p className="text-text-secondary text-[13px] mb-0.5 font-medium">Parametric Income Protection</p>
                <p className="text-text-muted text-[11px] mb-14 tracking-wide">for Q-Commerce Delivery Partners</p>
                
                <button onClick={() => { setScreen('app'); setShowOnboarding(true); setOnboardStep(0); }}
                        className="w-full py-[14px] gradient-primary rounded-2xl text-white font-bold text-[15px] shadow-lg shadow-primary/25 active:scale-[0.98] transition-all mb-3">
                  Get Started
                </button>
                <button onClick={() => setScreen('app')}
                        className="w-full py-[14px] bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-[15px] active:scale-[0.98] transition-all mb-10">
                  I Have an Account
                </button>
                
                <button onClick={onBack} className="text-[13px] text-text-muted hover:text-text-secondary transition-colors">
                  ← Back to Landing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Onboarding overlay
  if (showOnboarding) {
    const steps = [
      {
        title: 'Select Your Platform',
        subtitle: 'We support all major Q-commerce platforms',
        content: (
          <div className="space-y-3">
            {[
              { name: 'Zepto', desc: '10-min delivery', selected: true },
              { name: 'Blinkit', desc: 'Instant grocery', selected: false },
              { name: 'Swiggy Instamart', desc: 'Quick commerce', selected: false },
            ].map((p, i) => (
              <button key={i} className={`w-full p-4 rounded-2xl border text-left transition-all ${p.selected ? 'border-primary/40 bg-primary/8 shadow-sm shadow-primary/10' : 'border-dark-border bg-dark-card hover:border-dark-border/80'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${p.selected ? 'gradient-primary text-white' : 'bg-dark-surface text-text-muted'}`}>
                      {p.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary text-[15px]">{p.name}</span>
                      <p className="text-[11px] text-text-muted mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                  {p.selected && <CheckCircle2 size={22} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )
      },
      {
        title: 'Zone Detected',
        subtitle: 'We found your delivery zone automatically',
        content: (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/25 flex items-center justify-center mx-auto mb-5">
              <MapPin size={34} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">HSR Layout</h3>
            <p className="text-text-secondary text-sm mb-5">Zone HSR-01 · Bangalore</p>
            <div className="card-insurance rounded-2xl p-4 text-left space-y-3">
              {[
                ['Dark Store', 'Zepto HSR #14', null],
                ['Zone Radius', '2.5 km', null],
                ['Active Workers', '34 in zone', null],
                ['Risk Score', '0.74', 'warning'],
              ].map(([l, v, color], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[12px] text-text-muted">{l}</span>
                  <span className={`text-[12px] font-semibold ${color === 'warning' ? 'text-warning' : 'text-text-primary'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: 'Complete Your Profile',
        subtitle: 'Help us personalize your coverage',
        content: (
          <div className="space-y-5">
            <div>
              <label className="text-[11px] text-text-muted font-medium mb-2 block uppercase tracking-wider">Daily Working Hours</label>
              <div className="flex gap-2">
                {['4-6 hrs', '6-10 hrs', '10-14 hrs'].map((h, i) => (
                  <button key={i} className={`flex-1 py-3.5 rounded-xl text-[13px] font-medium transition-all ${i === 1 ? 'gradient-primary text-white shadow-sm shadow-primary/20' : 'bg-dark-card border border-dark-border text-text-secondary hover:border-primary/20'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-text-muted font-medium mb-2 block uppercase tracking-wider">Shift Pattern</label>
              <div className="flex gap-2">
                {['Morning', 'Afternoon', 'Full Day'].map((s, i) => (
                  <button key={i} className={`flex-1 py-3.5 rounded-xl text-[13px] font-medium transition-all ${i === 2 ? 'gradient-primary text-white shadow-sm shadow-primary/20' : 'bg-dark-card border border-dark-border text-text-secondary hover:border-primary/20'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-insurance rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Award size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">+100 GigPoints Earned!</p>
                <p className="text-xs text-text-secondary">Profile completion reward</p>
              </div>
            </div>
          </div>
        )
      },
    ]

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-[50px] blur-[100px]" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5">
              {/* Progress bar */}
              <div className="flex gap-2 mb-8 mt-2">
                {steps.map((_, i) => (
                  <div key={i} className={`flex-1 h-[3px] rounded-full transition-all duration-500 ${i <= onboardStep ? 'gradient-primary' : 'bg-dark-border'}`} />
                ))}
              </div>
              <p className="text-[11px] text-primary font-semibold uppercase tracking-wider mb-1">Step {onboardStep + 1} of {steps.length}</p>
              <h2 className="text-[22px] font-bold text-text-primary mb-1 tracking-[-0.01em]">{steps[onboardStep].title}</h2>
              <p className="text-[13px] text-text-secondary mb-6">{steps[onboardStep].subtitle}</p>
              <div className="flex-1 overflow-y-auto">{steps[onboardStep].content}</div>
              <button onClick={() => {
                if (onboardStep < steps.length - 1) setOnboardStep(onboardStep + 1)
                else { setShowOnboarding(false); setShowPurchase(true) }
              }} className="mt-4 w-full py-[14px] gradient-primary rounded-2xl text-white font-bold text-[15px] shadow-lg shadow-primary/25 active:scale-[0.98] transition-all">
                {onboardStep < steps.length - 1 ? 'Continue' : 'Choose Your Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Policy Purchase
  if (showPurchase) {
    const plans = [
      { name: 'Basic Shield', price: 49, adjusted: 53, payout: 300, hours: 6, tier: 'Starter' },
      { name: 'Pro Shield', price: 99, adjusted: 108, payout: 600, hours: 10, tier: 'Popular', popular: true },
      { name: 'Elite Shield', price: 149, adjusted: 162, payout: 1000, hours: 14, tier: 'Premium' },
    ]

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-[50px] blur-[100px]" />
          <div className="phone-frame bg-dark relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5 overflow-y-auto">
              <button onClick={() => setShowPurchase(false)} className="flex items-center gap-1.5 text-text-secondary text-[13px] mb-4 mt-2 hover:text-text-primary transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-[22px] font-bold text-text-primary mb-1 tracking-[-0.01em]">Choose Your Shield</h2>
              <p className="text-[13px] text-text-secondary mb-5">AI-adjusted premiums for Zone HSR-01</p>

              {/* Zone risk banner */}
              <div className="card-insurance rounded-2xl p-3.5 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/15 flex items-center justify-center">
                  <Target size={18} className="text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-text-primary">Zone Risk: 0.74</p>
                  <p className="text-[11px] text-text-muted">Premium adjusted +9% for HSR Layout</p>
                </div>
              </div>

              {/* Feature 9.5 — Predictive Premium Forecast Mini */}
              <div className="bg-primary/[0.04] border border-primary/15 rounded-2xl p-3.5 mb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <TrendingUp size={13} className="text-primary" />
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">7-Day Forecast</p>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {forecastData.map((d, i) => (
                    <div key={i} className={`flex-shrink-0 w-[42px] text-center py-1.5 px-1 rounded-lg transition-all ${i === 4 ? 'bg-danger/10 border border-danger/25' : 'bg-dark-surface/40'}`}>
                      <p className="text-[9px] text-text-muted font-medium">{d.day}</p>
                      <p className={`text-[11px] font-bold mt-0.5 ${d.premium > 130 ? 'text-danger' : d.premium > 115 ? 'text-warning' : 'text-text-primary'}`}>₹{d.premium}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-text-muted mt-2">Buy today at ₹108 before prices rise to ₹141</p>
              </div>

              {/* Plans */}
              <div className="space-y-3 mb-4">
                {plans.map((plan, i) => (
                  <button key={i} onClick={() => setSelectedPlan(i)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all relative ${selectedPlan === i ? 'border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/10' : 'border-dark-border bg-dark-card hover:border-dark-border/80'}`}>
                    {plan.popular && (
                      <div className="absolute -top-2.5 right-4">
                        <span className="px-2.5 py-0.5 gradient-primary rounded-full text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">Most Popular</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-text-primary text-[15px]">{plan.name}</p>
                        <p className="text-[11px] text-text-secondary mt-1">₹{plan.payout}/disruption · {plan.hours}hrs/day</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-text-muted line-through">₹{plan.price}/wk</p>
                        <p className="text-lg font-bold text-text-primary">₹{plan.adjusted}<span className="text-[11px] text-text-secondary font-normal">/wk</span></p>
                      </div>
                    </div>
                    {selectedPlan === i && (
                      <div className="mt-3 pt-3 border-t border-dark-border/50 space-y-1.5">
                        {['All 6 trigger types covered', 'Instant UPI payout <60 seconds', 'GigPoints rewards on every event'].map((txt, j) => (
                          <div key={j} className="flex items-center gap-2 text-[11px] text-success">
                            <CheckCircle2 size={12} /><span>{txt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="card-insurance rounded-2xl p-4 mb-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">Weekly Premium</span>
                    <span className="text-text-primary">₹{plans[selectedPlan].adjusted}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <Award size={13} className="text-primary" />
                      <span className="text-text-secondary">Reliable Tier (5%)</span>
                    </div>
                    <span className="text-success font-medium">-₹{Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                  </div>
                  <div className="border-t border-dark-border/50 pt-2.5 flex items-center justify-between">
                    <span className="font-bold text-text-primary text-[14px]">You Pay</span>
                    <span className="text-xl font-bold text-text-primary">₹{plans[selectedPlan].adjusted - Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowPurchase(false)}
                      className="w-full py-[14px] gradient-primary rounded-2xl text-white font-bold text-[15px] shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <IndianRupee size={18} /> Pay with UPI
              </button>
              <p className="text-center text-[11px] text-text-muted mt-3">Razorpay Sandbox · Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main App with Chatbot FAB
  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab setShowNotif={setShowNotif} showNotif={showNotif} setShowPurchase={setShowPurchase} />
      case 'policy': return <PolicyTab autoRenew={autoRenew} setAutoRenew={setAutoRenew} />
      case 'points': return <PointsTab />
      case 'history': return <HistoryTab />
      case 'profile': return <ProfileTab onBack={onBack} />
      default: return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-[50px] blur-[100px]" />
        <div className="phone-frame bg-dark relative z-10">
          <div className="phone-notch" />
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pt-10 pb-20 px-5">
              {renderTab()}
            </div>

            {/* GigBot FAB — Feature 9.3 */}
            {!showChat && (
              <button onClick={() => setShowChat(true)}
                      className="absolute bottom-[72px] right-4 w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-30 active:scale-90 transition-transform">
                <MessageCircle size={21} className="text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] rounded-full bg-success flex items-center justify-center border border-dark">
                  <span className="text-[6px] text-white font-bold">AI</span>
                </div>
              </button>
            )}

            {/* GigBot Chat — Feature 9.3 */}
            {showChat && <GigBotChat onClose={() => setShowChat(false)} />}

            {/* Bottom Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-xl border-t border-dark-border/60 z-20">
              <div className="flex items-center justify-around py-2 pb-4">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${activeTab === tab.id ? 'text-primary' : 'text-text-muted hover:text-text-secondary'}`}>
                    <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.2 : 1.8} />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                    {activeTab === tab.id && <div className="w-4 h-[2px] rounded-full bg-primary mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── GIGBOT CHATBOT — Feature 9.3 ────────────────────
function GigBotChat({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi Ravi! I\'m GigBot, your insurance assistant. Ask me about claims, premiums, triggers, or GigPoints!', lang: 'en' },
    { from: 'bot', text: 'Namaste! Main GigBot hoon. Hindi ya English mein puchiye!', lang: 'hi' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lang, setLang] = useState('en')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const lower = userMsg.toLowerCase()
      let response = chatResponses.default[lang]
      if (lower.includes('claim') || lower.includes('payout') || lower.includes('status')) response = chatResponses['claim status'][lang]
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('premium') || lower.includes('kitna')) response = chatResponses['premium'][lang]
      else if (lower.includes('trigger') || lower.includes('rain') || lower.includes('weather') || lower.includes('barish')) response = chatResponses['triggers'][lang]
      else if (lower.includes('point') || lower.includes('tier') || lower.includes('reward')) response = chatResponses['points'][lang]
      else if (lower.includes('pool') || lower.includes('collective') || lower.includes('community')) response = chatResponses['pool'][lang]

      setMessages(prev => [...prev, { from: 'bot', text: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 400)
  }

  return (
    <div className="absolute inset-x-0 bottom-[56px] top-[40px] z-40 bg-dark/97 backdrop-blur-2xl flex flex-col rounded-t-3xl border-t border-primary/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20">
            <Bot size={17} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-text-primary">GigBot</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <p className="text-[10px] text-text-muted">Gemini AI-powered</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-dark-surface border border-dark-border text-text-secondary hover:border-primary/30 transition-colors">
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} slide-up`}>
            <div className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
              msg.from === 'user'
                ? 'gradient-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/15'
                : 'bg-dark-card border border-dark-border/60 text-text-secondary rounded-2xl rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-text-muted/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-text-muted/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-text-muted/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
        {['Claim Status', 'My Premium', 'Triggers', 'GigPoints', 'Pool Info'].map((q, i) => (
          <button key={i} onClick={() => { setInput(q); }} 
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-semibold bg-dark-surface border border-dark-border text-text-secondary hover:border-primary/30 hover:text-primary transition-all">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-3 pt-1.5">
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border/60 rounded-2xl px-4 py-2.5 focus-within:border-primary/30 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask GigBot anything..."
            className="flex-1 bg-transparent text-[13px] text-text-primary placeholder-text-muted/60 outline-none"
          />
          <button onClick={handleSend} disabled={!input.trim()} className={`w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all ${input.trim() ? 'gradient-primary shadow-sm shadow-primary/20' : 'bg-dark-surface'}`}>
            <Send size={14} className={input.trim() ? 'text-white' : 'text-text-muted'} />
          </button>
        </div>
      </div>
    </div>
  )
}


// ─── HOME TAB ─────────────────────────────────────────
function HomeTab({ setShowNotif, showNotif, setShowPurchase }) {
  return (
    <div className="space-y-4 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-[12px] font-medium">Good afternoon,</p>
          <h2 className="text-[22px] font-bold text-text-primary tracking-[-0.01em]">Ravi Kumar</h2>
        </div>
        <button onClick={() => setShowNotif(!showNotif)} className="relative w-10 h-10 rounded-xl bg-dark-card border border-dark-border/60 flex items-center justify-center hover:border-primary/20 transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <div className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full bg-danger flex items-center justify-center shadow-sm shadow-danger/30">
            <span className="text-[8px] text-white font-bold">3</span>
          </div>
        </button>
      </div>

      {/* Notifications dropdown */}
      {showNotif && (
        <div className="card-insurance rounded-2xl p-4 space-y-2.5 slide-up">
          <SectionLabel>Notifications</SectionLabel>
          {[
            { title: '₹600 Credited', desc: 'Rainfall trigger — HSR Layout', time: '12:11 PM', icon: CheckCircle2, iconBg: 'bg-success/15', iconColor: 'text-success' },
            { title: 'Zone Watch Active', desc: 'AQI rising — 280, nearing 300 threshold', time: '11:30 AM', icon: AlertTriangle, iconBg: 'bg-warning/15', iconColor: 'text-warning' },
            { title: 'Policy Renewed', desc: 'Pro Shield — Week 8 active', time: 'Yesterday', icon: ShieldCheck, iconBg: 'bg-primary/15', iconColor: 'text-primary' },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.iconBg}`}>
                <n.icon size={14} className={n.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-text-primary">{n.title}</p>
                <p className="text-[11px] text-text-muted">{n.desc}</p>
              </div>
              <span className="text-[10px] text-text-muted shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone Status — clean, confident indicator */}
      <div className="bg-success/[0.06] border border-success/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success pulse-ring" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-success tracking-wide">ZONE SAFE</p>
              <p className="text-[11px] text-text-muted">HSR Layout · HSR-01</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-text-muted" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3.5 pt-3 border-t border-success/15">
          {[
            { icon: CloudRain, label: 'Rain', value: '3 mm', safe: true },
            { icon: Thermometer, label: 'Temp', value: '32°C', safe: true },
            { icon: Wind, label: 'AQI', value: '142', safe: true },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <m.icon size={14} className="text-text-muted mx-auto mb-1" />
              <p className="text-[10px] text-text-muted">{m.label}</p>
              <p className="text-[13px] font-bold text-text-primary">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Policy Card — professional insurance document feel */}
      <div className="card-insurance rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.04] rounded-bl-[60px]" />
        <div className="flex items-center justify-between mb-3 relative">
          <SectionLabel>Active Policy</SectionLabel>
          <StatusPill status="info">Pro Shield</StatusPill>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[28px] font-bold text-text-primary tracking-tight">₹600</span>
          <span className="text-[12px] text-text-muted">/disruption day</span>
        </div>
        <p className="text-[11px] text-text-muted mb-3">Valid Mar 10 – Mar 16, 2026</p>
        <div className="h-[5px] rounded-full bg-dark-border/60 overflow-hidden mb-1.5">
          <div className="h-full w-[71%] gradient-primary rounded-full transition-all duration-1000" />
        </div>
        <div className="flex justify-between">
          <p className="text-[10px] text-text-muted">5 of 7 days remaining</p>
          <p className="text-[10px] text-primary font-semibold">₹103/wk</p>
        </div>
      </div>

      {/* Feature 9.5 — Premium Forecast Alert */}
      <div className="bg-primary/[0.04] border border-primary/15 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" />
            <p className="text-[13px] font-bold text-text-primary">Premium Forecast</p>
          </div>
          <StatusPill status="warning">+31% by Mon</StatusPill>
        </div>
        <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
          Monsoon approaching zone. Renew early at ₹108/wk before it rises to ₹141/wk.
        </p>
        <div className="h-14">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="premGradHome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="premium" stroke="#6C5CE7" fill="url(#premGradHome)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats — 2 column */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-insurance rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={15} className="text-primary" />
            <p className="text-[11px] text-text-muted font-medium">GigPoints</p>
          </div>
          <p className="text-[22px] font-bold text-gradient tracking-tight">2,450</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[12px]">🥈</span>
            <p className="text-[11px] text-text-muted">Reliable Tier</p>
          </div>
        </div>
        <div className="gradient-emerald rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={15} className="text-white/80" />
            <p className="text-[11px] text-white/60 font-medium">Net Savings</p>
          </div>
          <p className="text-[22px] font-bold text-white tracking-tight">₹1,968</p>
          <p className="text-[11px] text-white/70 mt-1 font-medium">556% ROI</p>
        </div>
      </div>

      {/* Streak — visual week tracker */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={15} className="text-warning" />
            <p className="text-[13px] font-semibold text-text-primary">7-Week Streak</p>
          </div>
          <span className="text-[10px] text-primary font-semibold">+75 pts/week</span>
        </div>
        <div className="flex gap-1.5">
          {['W1','W2','W3','W4','W5','W6','W7','W8'].map((w, i) => (
            <div key={i} className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-bold transition-all ${i < 7 ? 'gradient-primary text-white shadow-sm shadow-primary/15' : 'bg-dark-surface text-text-muted border border-dashed border-dark-border'}`}>
              {i < 7 ? '✓' : w}
            </div>
          ))}
        </div>
      </div>

      {/* Feature 9.4 — Smart Reminder Preview */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing size={15} className="text-accent" />
            <p className="text-[13px] font-semibold text-text-primary">Smart Reminders</p>
          </div>
          <StatusPill status="info">AI-Powered</StatusPill>
        </div>
        <div className="space-y-2">
          {reminderSchedule.slice(0, 2).map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface/50">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.status === 'sent' ? 'bg-success/15' : 'bg-warning/15'}`}>
                {r.type === 'push' ? <Bell size={12} className={r.status === 'sent' ? 'text-success' : 'text-warning'} /> : <Phone size={12} className="text-success" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-secondary truncate leading-relaxed">{r.message}</p>
                <p className="text-[9px] text-text-muted mt-0.5">{r.day} {r.time} · {r.type.toUpperCase()}</p>
              </div>
              <span className={`text-[9px] font-bold shrink-0 ${r.status === 'sent' ? 'text-success' : 'text-warning'}`}>{r.status === 'sent' ? '✓' : '⏱'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions — new ideation feature */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: FileCheck, label: 'Claims', color: 'text-success', bg: 'bg-success/10' },
            { icon: CreditCard, label: 'Pay', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: Users, label: 'Refer', color: 'text-accent', bg: 'bg-accent/10' },
            { icon: Headphones, label: 'Help', color: 'text-warning', bg: 'bg-warning/10' },
          ].map((a, i) => (
            <button key={i} className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                <a.icon size={18} className={a.color} />
              </div>
              <span className="text-[10px] text-text-muted font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel action={() => {}} actionLabel="See All">Today's Activity</SectionLabel>
        <div className="space-y-3">
          {[
            { icon: CloudRain, bg: 'bg-primary/15', iconColor: 'text-primary', title: 'Rainfall Trigger', time: '12:10 PM', zone: 'HSR Layout', payout: 600, pts: 200 },
            { icon: Shield, bg: 'bg-accent/15', iconColor: 'text-accent', title: 'Policy Active', time: '11:45 AM', zone: 'Pro Shield', payout: null, pts: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon size={16} className={item.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                <p className="text-[11px] text-text-muted">{item.time} · {item.zone}</p>
              </div>
              {item.payout && (
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-success">+₹{item.payout}</p>
                  <p className="text-[10px] text-primary font-medium">+{item.pts} pts</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Gap Detector */}
      <div className="bg-danger/[0.04] border border-danger/15 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-danger" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-danger">Coverage Gap Alert</p>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              34 active workers received ₹600 each today. Stay protected for next events.
            </p>
            <button className="mt-2.5 px-4 py-2 text-[11px] font-semibold gradient-primary text-white rounded-xl shadow-sm shadow-primary/15">
              Enable Auto-Renew
            </button>
          </div>
        </div>
      </div>

      {/* Emergency SOS — new ideation feature */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center">
            <HeartPulse size={22} className="text-danger" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-text-primary">Emergency SOS</p>
            <p className="text-[11px] text-text-muted">Accident, health emergency, or safety issue</p>
          </div>
          <button className="px-3 py-2 bg-danger/10 border border-danger/25 rounded-xl text-danger text-[11px] font-bold">
            SOS
          </button>
        </div>
      </div>
    </div>
  )
}


// ─── POLICY TAB ───────────────────────────────────────
function PolicyTab({ autoRenew, setAutoRenew }) {
  return (
    <div className="space-y-4 mt-2">
      <h2 className="text-[20px] font-bold text-text-primary tracking-[-0.01em]">My Policy</h2>

      {/* Policy Certificate — official document style */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="relative p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Shield size={18} className="text-primary" />
              <span className="text-[12px] font-bold text-primary tracking-wider uppercase">GigShield Policy</span>
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/15 transition-colors">
              <Download size={11} /> PDF
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              ['Policy ID', 'GS-2026-HSR-00342', true],
              ['Holder', 'Ravi Kumar'],
              ['Zone', 'HSR Layout, Bangalore'],
              ['Plan', 'Pro Shield'],
              ['Coverage', '₹600/disruption day'],
              ['Valid', '10 Mar – 16 Mar 2026'],
              ['Premium', '₹103 (5% tier discount)'],
              ['Tier', 'Reliable'],
            ].map(([l, v, mono], i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[11px] text-text-muted">{l}</span>
                <span className={`text-[12px] text-text-primary font-medium ${mono ? 'font-mono text-[11px]' : ''}`}>{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3.5 border-t border-dark-border/40">
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2.5">Covered Triggers</p>
            <div className="flex flex-wrap gap-1.5">
              {['Rain >15mm', 'AQI >300', 'Temp >43°C', 'Flood Alert', 'Store Closure', 'Curfew'].map((t, i) => (
                <span key={i} className="px-2 py-[3px] bg-dark-surface/80 rounded-lg text-[10px] text-text-secondary font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 9.5 — Full Premium Forecast */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>7-Day Premium Forecast</SectionLabel>
          <StatusPill status="warning">Rising</StatusPill>
        </div>
        <div className="h-32 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGradPolicy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.2)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} domain={[100, 150]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="premium" stroke="#FF6B6B" fill="url(#forecastGradPolicy)" strokeWidth={2} dot={{ r: 3, fill: '#FF6B6B', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#FF6B6B', strokeWidth: 2, stroke: '#1A1333' }} name="Premium" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          {[
            { label: 'Current', value: '₹108', color: 'text-success' },
            { label: 'Peak (Mon)', value: '₹141', color: 'text-danger' },
            { label: 'Change', value: '+31%', color: 'text-warning' },
          ].map((item, i) => (
            <div key={i} className="py-2 rounded-xl bg-dark-surface/50">
              <p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p>
              <p className={`text-[14px] font-bold ${item.color} mt-0.5`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Risk Drivers</p>
          {[
            { label: 'Rainfall forecast', pct: 40, color: '#6C5CE7' },
            { label: 'AQI trend', pct: 25, color: '#FDCB6E' },
            { label: 'Historical risk', pct: 20, color: '#00D2D3' },
            { label: 'Traffic + news', pct: 15, color: '#FF6B6B' },
          ].map((d, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-text-secondary">{d.label}</span>
                <span className="text-[10px] text-text-muted font-medium">{d.pct}%</span>
              </div>
              <div className="h-[3px] rounded-full bg-dark-border/60 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct * 2.5}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Score — clean gauge */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Zone Risk Assessment</SectionLabel>
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(45,37,80,0.5)" strokeWidth="2.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="url(#riskGradPolicy)" strokeWidth="2.5" strokeDasharray="74, 100" strokeLinecap="round" />
              <defs>
                <linearGradient id="riskGradPolicy">
                  <stop offset="0%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#FDCB6E" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[17px] font-bold text-text-primary">0.74</span>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-bold text-warning">Moderate-High</p>
            <p className="text-[11px] text-text-muted">Based on 90-day zone history</p>
            <p className="text-[10px] text-text-muted mt-0.5">Premium adjustment: +9%</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Rainfall Frequency', value: 72, color: '#6C5CE7' },
            { label: 'AQI History', value: 58, color: '#FDCB6E' },
            { label: 'Flood Risk', value: 45, color: '#FF6B6B' },
            { label: 'Seasonal Weight', value: 85, color: '#00D2D3' },
          ].map((r, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-text-muted">{r.label}</span>
                <span className="text-[10px] text-text-secondary font-medium">{r.value}%</span>
              </div>
              <div className="h-[3px] rounded-full bg-dark-border/60 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.value}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 9.4 — Smart Expiry Reminders */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing size={15} className="text-accent" />
            <SectionLabel>Smart Expiry Reminders</SectionLabel>
          </div>
          <StatusPill status="success">Active</StatusPill>
        </div>
        <div className="space-y-2">
          {reminderSchedule.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
              r.status === 'sent' ? 'bg-success/[0.04] border border-success/10' : 
              r.status === 'scheduled' ? 'bg-dark-surface/40' : 
              'bg-primary/[0.04] border border-primary/10'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 shrink-0 ${
                r.type === 'push' ? 'bg-primary/15' : r.type === 'sms' ? 'bg-accent/15' : 'bg-success/15'
              }`}>
                {r.type === 'push' ? <Bell size={12} className="text-primary" /> : 
                 r.type === 'sms' ? <Phone size={12} className="text-accent" /> : 
                 <RefreshCw size={12} className="text-success" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-secondary leading-relaxed">{r.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-text-muted">{r.day} {r.time}</span>
                  <span className="text-[9px] text-text-muted">·</span>
                  <span className="text-[9px] text-text-muted uppercase font-medium">{r.type}</span>
                  <span className={`text-[9px] font-bold ml-auto ${r.status === 'sent' ? 'text-success' : r.status === 'scheduled' ? 'text-warning' : 'text-primary'}`}>
                    {r.status === 'sent' ? '✓ Delivered' : r.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-text-muted mt-2.5 italic leading-relaxed">Context-aware: Adjusts messages based on risk surge, streak, and lapse history</p>
      </div>

      {/* Auto-Renew */}
      <div className="card-insurance rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw size={17} className="text-primary" />
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Auto-Renew</p>
            <p className="text-[11px] text-text-muted">UPI mandate active</p>
          </div>
        </div>
        <button onClick={() => setAutoRenew(!autoRenew)}
                className={`w-[44px] h-[26px] rounded-full transition-all relative ${autoRenew ? 'bg-primary' : 'bg-dark-border'}`}>
          <div className={`w-[20px] h-[20px] rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${autoRenew ? 'right-[3px]' : 'left-[3px]'}`} />
        </button>
      </div>

      {/* Claim Statement */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Latest Claim</SectionLabel>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/15 transition-colors">
            <Download size={11} /> EOB
          </button>
        </div>
        <div className="space-y-2.5">
          {[
            ['Claim ID', 'GS-CLM-0892', 'mono'],
            ['Event', 'Heavy Rainfall'],
            ['Triggered', '12:10 PM, Mar 10'],
            ['Payout', '₹600', 'success'],
            ['Status', 'SETTLED', 'badge'],
          ].map(([l, v, style], i) => (
            <div key={i} className="flex justify-between items-center text-[12px]">
              <span className="text-text-muted">{l}</span>
              {style === 'badge' ? (
                <StatusPill status="success">{v}</StatusPill>
              ) : style === 'success' ? (
                <span className="text-success font-bold">{v}</span>
              ) : (
                <span className={`text-text-primary ${style === 'mono' ? 'font-mono text-[11px]' : 'font-medium'}`}>{v}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-dark-border/40 space-y-1.5">
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2">Validation Checks</p>
          {[
            'GPS verified in zone (0.8 km)',
            'Active (3 deliveries in 30 min)',
            'App logged in at trigger time',
            'No duplicate claim detected',
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-success shrink-0" />
              <span className="text-[10px] text-text-secondary">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Tracker — new ideation feature */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Claim Processing Pipeline</SectionLabel>
        <div className="flex items-center gap-1 mb-3">
          {['Trigger Detected', 'Fraud Check', 'Approval', 'UPI Payout'].map((step, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className={`w-full text-center py-1.5 rounded-lg text-[8px] font-bold ${i < 4 ? 'bg-success/15 text-success' : 'bg-dark-surface text-text-muted'}`}>
                {step}
              </div>
              {i < 3 && <ArrowRight size={10} className="text-success shrink-0 mx-0.5" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <Timer size={11} />
          <span>Average processing: 47 seconds</span>
        </div>
      </div>
    </div>
  )
}


// ─── POINTS TAB ───────────────────────────────────────
function PointsTab() {
  const tiers = [
    { name: 'Starter', emoji: '🥉', min: 0, max: 999, color: '#7C72A0', discount: '0%' },
    { name: 'Reliable', emoji: '🥈', min: 1000, max: 2499, color: '#6C5CE7', current: true, discount: '5%' },
    { name: 'Veteran', emoji: '🥇', min: 2500, max: 4999, color: '#FDCB6E', discount: '10%' },
    { name: 'Champion', emoji: '💎', min: 5000, max: 10000, color: '#00D2D3', discount: '15%' },
  ]

  return (
    <div className="space-y-4 mt-2">
      <h2 className="text-[20px] font-bold text-text-primary tracking-[-0.01em]">GigPoints</h2>

      {/* Points Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-5">
        <div className="absolute top-[-30px] right-[-20px] w-36 h-36 rounded-full bg-white/[0.08] blur-[40px]" />
        <div className="absolute bottom-[-20px] left-[-10px] w-24 h-24 rounded-full bg-white/[0.05] blur-[30px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">Total Balance</p>
            <p className="text-[36px] font-black text-white mt-0.5 tracking-tight">2,450</p>
            <p className="text-[12px] text-white/70 mt-0.5">🥈 Reliable · 5% discount</p>
          </div>
          <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/20 flex items-center justify-center bg-white/[0.08] backdrop-blur-sm">
            <span className="text-[32px]">🥈</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-white/60 mb-1.5">
            <span>2,450 / 2,500 to Veteran 🥇</span>
            <span className="font-semibold text-white/80">98%</span>
          </div>
          <div className="h-[6px] rounded-full bg-white/15 overflow-hidden">
            <div className="h-full w-[98%] bg-white rounded-full" />
          </div>
          <p className="text-[10px] text-white/50 mt-1.5">Just 50 points away from 10% premium discount!</p>
        </div>
      </div>

      {/* Tier Roadmap */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Tier Roadmap</SectionLabel>
        <div className="space-y-2.5">
          {tiers.map((tier, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${tier.current ? 'bg-primary/[0.06] border border-primary/20' : 'hover:bg-dark-surface/30'}`}>
              <span className="text-lg">{tier.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-[13px] font-semibold ${tier.current ? 'text-primary' : 'text-text-primary'}`}>{tier.name}</p>
                  <span className="text-[10px] text-text-muted">{tier.min.toLocaleString()}+ pts</span>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {tier.name === 'Starter' && 'Standard coverage, no discount'}
                  {tier.name === 'Reliable' && '5% premium discount'}
                  {tier.name === 'Veteran' && '10% off + priority payout'}
                  {tier.name === 'Champion' && '15% off + free week/quarter'}
                </p>
              </div>
              {tier.current && <StatusPill status="info">You</StatusPill>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Points */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Recent Points</SectionLabel>
        <div className="space-y-2">
          {[
            { action: 'Payout received', pts: 200, time: 'Today, 12:11 PM' },
            { action: 'Active during disruption', pts: 100, time: 'Today, 12:10 PM' },
            { action: 'Streak bonus (Week 7)', pts: 75, time: 'Sunday' },
            { action: 'Policy renewal', pts: 50, time: 'Sunday' },
            { action: 'Referral: Suresh M.', pts: 500, time: 'Last week' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-[12px] text-text-primary font-medium">{item.action}</p>
                <p className="text-[10px] text-text-muted">{item.time}</p>
              </div>
              <span className="text-[13px] font-bold text-primary">+{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redemption Milestones */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Reward Milestones</SectionLabel>
        <div className="space-y-2.5">
          {[
            { pts: 2500, reward: '10% waiver + priority payout', progress: 98 },
            { pts: 5000, reward: '1 free week every 13 weeks', progress: 49 },
            { pts: 7500, reward: '₹500 bonus coverage top-up', progress: 33 },
          ].map((m, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-dark-surface/40">
              <div className="flex justify-between mb-1.5">
                <p className="text-[11px] text-text-primary font-medium">{m.reward}</p>
                <span className="text-[10px] text-primary font-semibold">{m.pts.toLocaleString()} pts</span>
              </div>
              <div className="h-[3px] rounded-full bg-dark-border/60 overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-700" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="card-insurance rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <UserPlus size={17} className="text-accent" />
          <p className="text-[13px] font-bold text-text-primary">Refer Zone Partners</p>
        </div>
        <p className="text-[11px] text-text-muted mb-3 leading-relaxed">Both get ₹50 off next week + you earn 500 pts</p>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-dark-surface/50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-text-muted">Your Referrals</p>
            <p className="text-lg font-bold text-text-primary">3</p>
          </div>
          <div className="flex-1 bg-dark-surface/50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-text-muted">Zone Milestone</p>
            <p className="text-lg font-bold text-accent">20/34</p>
          </div>
        </div>
        <button className="w-full py-2.5 bg-accent/10 border border-accent/25 rounded-xl text-accent text-[12px] font-semibold hover:bg-accent/15 transition-colors">
          Share Referral Link
        </button>
      </div>
    </div>
  )
}


// ─── HISTORY TAB (with Features 9.1 & 9.2) ───────────
function HistoryTab() {
  const [subTab, setSubTab] = useState('savings')

  return (
    <div className="space-y-4 mt-2">
      <h2 className="text-[20px] font-bold text-text-primary tracking-[-0.01em]">Protection History</h2>

      {/* Sub-tabs — cleaner segmented control */}
      <div className="flex gap-1 bg-dark-card/80 rounded-xl p-[3px] border border-dark-border/40">
        {[
          { id: 'savings', label: 'Savings' },
          { id: 'graph', label: 'Graph' },
          { id: 'pool', label: 'Pool' },
          { id: 'timeline', label: 'Timeline' },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
                  className={`flex-1 py-2 rounded-[9px] text-[11px] font-semibold transition-all ${subTab === t.id ? 'gradient-primary text-white shadow-sm shadow-primary/15' : 'text-text-muted hover:text-text-secondary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'savings' && <SavingsSubTab />}
      {subTab === 'graph' && <ProtectionGraphSubTab />}
      {subTab === 'pool' && <CollectivePoolSubTab />}
      {subTab === 'timeline' && <TimelineSubTab />}
    </div>
  )
}


// ─── Feature 9.1 — Lifetime Protection Graph ──────────
function ProtectionGraphSubTab() {
  const [view, setView] = useState('monthly')
  
  const yearlyData = [
    { year: '2025 Q4', premiums: 156, payouts: 600, net: 444 },
    { year: '2026 Q1', premiums: 310, payouts: 2400, net: 2090 },
  ]

  const totalPremiums = lifetimeData.reduce((s, d) => s + d.premiums, 0)
  const totalPayouts = lifetimeData.reduce((s, d) => s + d.payouts, 0)
  const netSavings = totalPayouts - totalPremiums
  const roi = totalPremiums > 0 ? ((totalPayouts / totalPremiums) * 100).toFixed(0) : 0

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Paid', value: `₹${totalPremiums}`, color: 'text-danger' },
          { label: 'Received', value: `₹${totalPayouts.toLocaleString()}`, color: 'text-success' },
          { label: 'ROI', value: `${roi}%`, color: 'text-gradient' },
        ].map((item, i) => (
          <div key={i} className="card-insurance rounded-xl p-3 text-center">
            <p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p>
            <p className={`text-[14px] font-bold ${item.color} mt-0.5`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        {['monthly', 'yearly'].map(v => (
          <button key={v} onClick={() => setView(v)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${view === v ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-dark-surface/50 text-text-muted border border-transparent hover:border-dark-border/50'}`}>
            {v === 'monthly' ? 'Monthly' : 'Quarterly'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>{view === 'monthly' ? 'Monthly Premiums vs Payouts' : 'Quarterly Overview'}</SectionLabel>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view === 'monthly' ? lifetimeData : yearlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.2)" vertical={false} />
              <XAxis dataKey={view === 'monthly' ? 'month' : 'year'} tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premiums" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Premiums Paid" maxBarSize={24} />
              <Bar dataKey="payouts" fill="#00B894" radius={[4, 4, 0, 0]} name="Payouts Received" maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net Savings Trend */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Net Savings Trend</SectionLabel>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lifetimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="netGradGraph" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B894" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00B894" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="net" stroke="#00B894" fill="url(#netGradGraph)" strokeWidth={2} dot={{ r: 3, fill: '#00B894', strokeWidth: 0 }} name="Net Savings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month-by-month breakdown */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Month-by-Month</SectionLabel>
        <div className="space-y-2">
          {lifetimeData.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface/40">
              <div className="w-8 text-center">
                <p className="text-[11px] font-bold text-text-primary">{d.month}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-[3px] rounded-full bg-danger/30 flex-1 overflow-hidden">
                    <div className="h-full bg-danger rounded-full" style={{ width: `${(d.premiums / 200) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-danger w-8 text-right font-medium">-₹{d.premiums}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[3px] rounded-full bg-success/30 flex-1 overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${(d.payouts / 1200) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-success w-8 text-right font-medium">+₹{d.payouts}</span>
                </div>
              </div>
              <div className={`text-right min-w-[42px] ${d.net >= 0 ? 'text-success' : 'text-danger'}`}>
                <p className="text-[12px] font-bold">{d.net >= 0 ? '+' : ''}₹{d.net}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Markers */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Event Markers</SectionLabel>
        <div className="space-y-2">
          {[
            { month: 'Nov', event: 'AQI Trigger (320)', icon: Wind, color: 'warning' },
            { month: 'Jan', event: 'Heavy Rain (19mm)', icon: CloudRain, color: 'primary' },
            { month: 'Feb', event: 'Heat Wave (44°C)', icon: Thermometer, color: 'danger' },
            { month: 'Feb', event: 'Dark Store Closure', icon: AlertTriangle, color: 'danger' },
            { month: 'Mar', event: 'Rainfall Trigger', icon: CloudRain, color: 'primary' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <span className="text-[10px] text-text-muted w-6 font-medium">{e.month}</span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                e.color === 'warning' ? 'bg-warning/15' : e.color === 'danger' ? 'bg-danger/15' : 'bg-primary/15'
              }`}>
                <e.icon size={12} className={
                  e.color === 'warning' ? 'text-warning' : e.color === 'danger' ? 'text-danger' : 'text-primary'
                } />
              </div>
              <p className="text-[11px] text-text-secondary flex-1">{e.event}</p>
              <span className="text-[11px] font-bold text-success">+₹600</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ─── Feature 9.2 — Collective Protection Pool ─────────
function CollectivePoolSubTab() {
  const [optedIn, setOptedIn] = useState(true)
  const [showVote, setShowVote] = useState(false)

  return (
    <div className="space-y-4">
      {/* Pool Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-accent/[0.06] border border-accent/20 p-5">
        <div className="absolute top-[-30px] right-[-20px] w-36 h-36 rounded-full bg-accent/[0.06] blur-[40px]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center">
              <Users size={22} className="text-accent" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-text-primary">HSR Layout Pool</p>
              <p className="text-[11px] text-text-muted">Zone HSR-01 · Community Fund</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Members', value: '34', color: 'text-text-primary' },
              { label: 'Weekly', value: '₹10', color: 'text-accent' },
              { label: 'Balance', value: '₹1,240', color: 'text-success' },
            ].map((item, i) => (
              <div key={i} className="text-center p-2.5 rounded-xl bg-dark/30 backdrop-blur-sm">
                <p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p>
                <p className={`text-[17px] font-bold ${item.color} mt-0.5`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opt-in Toggle */}
      <div className="card-insurance rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PiggyBank size={17} className="text-accent" />
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Pool Membership</p>
            <p className="text-[11px] text-text-muted">₹10/week auto-deducted</p>
          </div>
        </div>
        <button onClick={() => setOptedIn(!optedIn)}
                className={`w-[44px] h-[26px] rounded-full transition-all relative ${optedIn ? 'bg-accent' : 'bg-dark-border'}`}>
          <div className={`w-[20px] h-[20px] rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${optedIn ? 'right-[3px]' : 'left-[3px]'}`} />
        </button>
      </div>

      {/* Pool Rules */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Pool Rules</SectionLabel>
        <div className="space-y-3">
          {[
            { icon: IndianRupee, text: 'Max draw: ₹500 per month per member' },
            { icon: Timer, text: 'Must be member for 4+ weeks to draw' },
            { icon: Vote, text: 'Draw requests need 60% peer approval' },
            { icon: RefreshCw, text: 'Unused balance rolls over each week' },
            { icon: ShieldCheck, text: 'Only for coverage gaps (policy lapse/exhaustion)' },
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 shrink-0">
                <rule.icon size={12} className="text-accent" />
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{rule.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Vote */}
      <div className="bg-warning/[0.04] border border-warning/15 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Vote size={15} className="text-warning" />
            <p className="text-[13px] font-bold text-text-primary">Active Vote</p>
          </div>
          <StatusPill status="warning">18h left</StatusPill>
        </div>
        <div className="bg-dark/30 rounded-xl p-3 mb-3">
          <p className="text-[12px] text-text-primary font-medium">Deepak R. requests ₹300</p>
          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">Reason: Policy lapsed during fever, missed renewal. 2 disruption days uncovered.</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-text-muted">Member since: Week 3</span>
            <span className="text-[10px] text-text-muted">·</span>
            <span className="text-[10px] text-success font-semibold">12/20 votes (60%)</span>
          </div>
        </div>
        {!showVote ? (
          <button onClick={() => setShowVote(true)} className="w-full py-2.5 bg-warning/10 border border-warning/25 rounded-xl text-warning text-[12px] font-semibold hover:bg-warning/15 transition-colors">
            Cast Your Vote
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setShowVote(false)} className="flex-1 py-2.5 bg-success/10 border border-success/25 rounded-xl text-success text-[12px] font-semibold hover:bg-success/15 transition-colors">
              ✓ Approve
            </button>
            <button onClick={() => setShowVote(false)} className="flex-1 py-2.5 bg-danger/10 border border-danger/25 rounded-xl text-danger text-[12px] font-semibold hover:bg-danger/15 transition-colors">
              ✗ Deny
            </button>
          </div>
        )}
      </div>

      {/* Pool Transactions */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Pool Activity</SectionLabel>
        <div className="space-y-2">
          {[
            { action: 'Weekly contribution (x34)', amount: '+₹340', time: 'This week', type: 'in' },
            { action: 'Priya M. draw (approved)', amount: '-₹400', time: 'Mar 8', type: 'out' },
            { action: 'Weekly contribution (x34)', amount: '+₹340', time: 'Last week', type: 'in' },
            { action: 'Rollover from Feb', amount: '+₹960', time: 'Mar 1', type: 'in' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-dark-border/20 last:border-0">
              <div>
                <p className="text-[11px] text-text-primary font-medium">{tx.action}</p>
                <p className="text-[10px] text-text-muted">{tx.time}</p>
              </div>
              <span className={`text-[12px] font-bold ${tx.type === 'in' ? 'text-success' : 'text-danger'}`}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ─── Savings Sub-Tab ──────────────────────────────────
function SavingsSubTab() {
  return (
    <div className="space-y-4">
      {/* Lifetime Savings — clean financial summary */}
      <div className="card-elevated rounded-2xl p-5">
        <SectionLabel>Lifetime Savings</SectionLabel>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Premiums Paid</p>
            <p className="text-[18px] font-bold text-text-primary mt-0.5">₹432</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Payouts Received</p>
            <p className="text-[18px] font-bold text-success mt-0.5">₹2,400</p>
          </div>
        </div>
        <div className="border-t border-dark-border/40 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-text-secondary">Net Savings</p>
            <p className="text-[24px] font-black text-gradient tracking-tight">₹1,968</p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-text-muted">Return on Protection</p>
            <p className="text-[14px] font-bold text-success">556%</p>
          </div>
          <p className="text-[10px] text-text-muted mt-2 italic">For every ₹1 paid, you received ₹5.56 back</p>
        </div>
      </div>

      {/* This Week */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>This Week</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '₹1,200', label: 'Protected', color: 'text-text-primary' },
            { value: '725', label: 'Points Earned', color: 'text-primary' },
            { value: '2', label: 'Triggers', color: 'text-accent' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className={`text-[17px] font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zone History */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Zone HSR Layout — Last 30 Days</SectionLabel>
        <div className="space-y-2">
          {[
            { date: 'Mar 10', event: 'Heavy Rain (19mm/hr)', hours: 4, workers: 34, total: '₹20,400' },
            { date: 'Mar 08', event: 'AQI 320', hours: 2, workers: 31, total: '₹18,600' },
            { date: 'Mar 03', event: 'Dark Store Closure', hours: 3, workers: 28, total: '₹16,800' },
            { date: 'Feb 28', event: 'Extreme Heat (44°C)', hours: 6, workers: 40, total: '₹24,000' },
          ].map((z, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-dark-surface/40">
              <p className="text-[11px] font-semibold text-text-primary mb-1">{z.date} — {z.event}</p>
              <div className="flex gap-3 text-[10px] text-text-muted">
                <span>{z.hours} hrs</span>
                <span>·</span>
                <span>{z.workers} workers paid</span>
                <span>·</span>
                <span className="text-success font-medium">{z.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protection Score — new ideation feature */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Your Protection Score</SectionLabel>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(45,37,80,0.4)" strokeWidth="2.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="url(#protScore)" strokeWidth="2.5" strokeDasharray="92, 100" strokeLinecap="round" />
              <defs>
                <linearGradient id="protScore">
                  <stop offset="0%" stopColor="#00B894" />
                  <stop offset="100%" stopColor="#00D2D3" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[15px] font-bold text-success">92</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-success">Excellent</p>
            <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
              Consistent coverage, timely renewals, zero gaps in 7 weeks. Top 12% in your zone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── Timeline Sub-Tab ─────────────────────────────────
function TimelineSubTab() {
  const timelineGroups = [
    {
      label: 'Today',
      events: [
        { icon: CloudRain, bg: 'bg-primary/15', iconColor: 'text-primary', title: 'Rainfall Trigger', sub: 'HSR Layout — 19mm/hr', time: '12:10 PM', payout: '+₹600', pts: '+200' },
        { icon: Shield, bg: 'bg-accent/15', iconColor: 'text-accent', title: 'Policy Active', sub: 'Pro Shield — Week 8', time: '11:45 AM' },
      ]
    },
    {
      label: 'Yesterday',
      events: [
        { icon: Wind, bg: 'bg-warning/15', iconColor: 'text-warning', title: 'AQI Trigger', sub: 'HSR Layout — AQI 320', time: '3:20 PM', payout: '+₹600', pts: '+200' },
      ]
    },
    {
      label: 'This Week',
      events: [
        { icon: AlertTriangle, bg: 'bg-danger/15', iconColor: 'text-danger', title: 'Dark Store Closure', sub: 'Koramangala — Local strike', time: 'Mar 8, 2:15 PM', payout: '+₹600', pts: '+200' },
      ]
    }
  ]

  return (
    <div className="space-y-4">
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Protection Timeline</SectionLabel>
        <div className="space-y-4">
          {timelineGroups.map((group, gi) => (
            <div key={gi}>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2.5">{group.label}</p>
              <div className="space-y-3">
                {group.events.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${e.bg} flex items-center justify-center shrink-0`}>
                      <e.icon size={16} className={e.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary">{e.title}</p>
                      <p className="text-[11px] text-text-muted">{e.sub}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{e.time}</p>
                    </div>
                    {e.payout && (
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-bold text-success">{e.payout}</p>
                        <p className="text-[10px] text-primary font-medium">{e.pts} pts</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ─── PROFILE TAB ──────────────────────────────────────
function ProfileTab({ onBack }) {
  return (
    <div className="space-y-4 mt-2">
      <h2 className="text-[20px] font-bold text-text-primary tracking-[-0.01em]">Profile</h2>

      {/* User Card */}
      <div className="card-elevated rounded-2xl p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-full gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
            <span className="text-[28px] font-bold text-white">R</span>
          </div>
          <h3 className="text-[17px] font-bold text-text-primary">Ravi Kumar</h3>
          <p className="text-[12px] text-text-muted mt-0.5">Zepto Partner · HSR Layout</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[12px]">🥈</span>
            <span className="text-[11px] text-primary font-semibold">Reliable · 2,450 pts</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Policies', value: '8', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Claims', value: '5', bg: 'bg-success/10', color: 'text-success' },
          { label: 'Streak', value: '7w', bg: 'bg-warning/10', color: 'text-warning' },
        ].map((s, i) => (
          <div key={i} className="card-insurance rounded-xl p-3 text-center">
            <p className={`text-[17px] font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="card-insurance rounded-2xl p-4 space-y-3">
        {[
          ['Mobile', '+91 98765 43210'],
          ['Platform', 'Zepto'],
          ['Zone', 'HSR-01, Bangalore'],
          ['Shift', 'Full Day (10 hrs)'],
          ['Member Since', 'Jan 2026 (Week 1)'],
          ['UPI', 'ravi@okicici'],
        ].map(([l, v], i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-[11px] text-text-muted">{l}</span>
            <span className="text-[12px] text-text-primary font-medium">{v}</span>
          </div>
        ))}
      </div>

      {/* Achievements — new ideation feature */}
      <div className="card-insurance rounded-2xl p-4">
        <SectionLabel>Achievements</SectionLabel>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { emoji: '🛡️', label: '8 Policies', bg: 'bg-primary/10' },
            { emoji: '🔥', label: '7w Streak', bg: 'bg-warning/10' },
            { emoji: '💰', label: '5 Claims', bg: 'bg-success/10' },
            { emoji: '👥', label: '3 Referrals', bg: 'bg-accent/10' },
            { emoji: '⚡', label: '556% ROI', bg: 'bg-danger/10' },
          ].map((a, i) => (
            <div key={i} className={`flex-shrink-0 w-[68px] ${a.bg} rounded-xl p-2.5 text-center`}>
              <span className="text-lg">{a.emoji}</span>
              <p className="text-[9px] text-text-muted mt-1 font-medium">{a.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="card-insurance rounded-2xl p-4 space-y-1">
        {[
          { label: 'Notification Settings', icon: Bell },
          { label: 'Payment Methods', icon: CreditCard },
          { label: 'Language / भाषा', icon: Languages },
          { label: 'Help & Support', icon: Headphones },
          { label: 'Emergency Contact', icon: Phone },
          { label: 'Download My Data', icon: Download },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between py-2.5 hover:bg-dark-surface/30 rounded-lg px-1 transition-colors">
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-text-muted" />
              <span className="text-[13px] text-text-primary">{item.label}</span>
            </div>
            <ChevronRight size={14} className="text-text-muted" />
          </button>
        ))}
      </div>

      <button onClick={onBack} className="w-full py-3 bg-dark-card border border-dark-border/60 rounded-2xl text-text-secondary font-medium text-[13px] hover:border-primary/20 transition-colors">
        ← Back to Landing Page
      </button>
    </div>
  )
}
