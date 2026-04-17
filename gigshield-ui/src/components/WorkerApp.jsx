import { useState, useRef, useEffect } from 'react'
import { Shield, ArrowLeft, Home, FileText, Award, Clock, Settings, Bell, ChevronRight, CloudRain, Wind, Thermometer, AlertTriangle, MapPin, Zap, TrendingUp, IndianRupee, Gift, Users, Star, CheckCircle2, XCircle, ChevronDown, Download, RefreshCw, Info, Flame, Target, Trophy, History, UserPlus, MessageCircle, Send, X, TrendingDown, BarChart3, Moon, Sun, HeartPulse, ArrowRight, FileCheck, CreditCard, Headphones, Timer, Vote, PiggyBank, ShieldCheck, BellRing, Phone, Languages, Fingerprint, BadgeCheck, Siren, Navigation, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../Context/ThemeContext'
import { apiFetch, getApiBaseUrl } from '../lib/api'
import { registerGigShieldPush } from '../lib/pushNotifications'
import { getWorkerInsights } from '../api/mlApi'

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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

const reminderSchedule = [
  { day: 'Fri', time: '6:00 PM', type: 'push', status: 'sent', message: 'Your Pro Shield expires Sunday! Renew to keep your 7-week streak.' },
  { day: 'Sat', time: '10:00 AM', type: 'sms', status: 'sent', message: 'Rain expected Monday! Renew now to stay protected. Risk score rising to 0.82.' },
  { day: 'Sun', time: '6:00 PM', type: 'push', status: 'scheduled', message: 'Last chance! 6 hrs left on your Pro Shield. Your zone paid ₹20,400 this week.' },
  { day: 'Sun', time: '11:30 PM', type: 'push', status: 'scheduled', message: 'URGENT: Policy expires in 30 min. Tap to auto-renew and save your streak!' },
  { day: 'Mon', time: '12:00 AM', type: 'auto', status: 'pending', message: 'Auto-renew activated. ₹103 debited via UPI.' },
]

const chatResponses = {
  'claim status': { en: 'Your latest claim GS-CLM-0892 was auto-approved on Mar 10 at 12:11 PM. Payout: ₹600 sent to your UPI (ravi@okicici). All 4 fraud checks passed.', hi: 'Aapka latest claim GS-CLM-0892 Mar 10 ko 12:11 PM par auto-approve hua. ₹600 aapke UPI (ravi@okicici) mein bheja gaya.' },
  'premium': { en: 'Your current Pro Shield premium is ₹108/week (base ₹99 + 9% zone risk adjustment). You get 5% Reliable tier discount, so you pay ₹103/week.', hi: 'Aapka Pro Shield premium ₹108/week hai (base ₹99 + 9% zone risk). Reliable tier discount 5% ke baad aap ₹103/week pay karte ho.' },
  'triggers': { en: 'GigShield covers 6 triggers: Heavy Rain (>15mm/hr), Extreme Heat (>43°C), Severe AQI (>300), Flash Flood (IMD Alert), Dark Store Closure, and Local Curfew.', hi: 'GigShield 6 triggers cover karta hai: Heavy Rain (>15mm/hr), Extreme Heat (>43°C), AQI (>300), Flash Flood, Dark Store Closure, aur Curfew.' },
  'points': { en: 'You have 2,450 GigPoints (Reliable tier). You\'re only 50 pts away from Veteran tier (10% discount)!', hi: 'Aapke paas 2,450 GigPoints hain (Reliable tier). Veteran tier (10% discount) ke liye sirf 50 points aur chahiye!' },
  'pool': { en: 'Your zone HSR-01 has a Collective Protection Pool with 34 members. Pool balance: ₹1,240. Max draw: ₹500/month.', hi: 'Aapke zone HSR-01 ka Collective Pool mein 34 members hain. Balance: ₹1,240. Max draw: ₹500/month.' },
  'default': { en: "I can help you with: claim status, premium info, trigger details, GigPoints, or pool info. Just type your question!", hi: "Main aapki madad kar sakta hoon: claim status, premium info, trigger details, GigPoints, ya pool info." },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-strong rounded-xl p-3 text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

// Reusable section header
const SectionLabel = ({ children, action, actionLabel }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-[0.08em]">{children}</p>
    {action && <button onClick={action} className="text-[11px] text-primary font-medium">{actionLabel || 'View All'}</button>}
  </div>
)

async function downloadBackendFile(path, filename) {
  const response = await fetch(`${getApiBaseUrl()}${path}`)
  if (!response.ok) {
    let message = 'Download failed'
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const payload = await response.json()
      message = payload.error ?? message
    } else {
      message = await response.text() || message
    }
    throw new Error(message)
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function downloadCertificatePdf(workerId) {
  try {
    await downloadBackendFile(`/api/workers/${workerId}/certificate`, `gigshield-certificate-${workerId}.pdf`)
  } catch (error) {
    if (workerId !== 'WRK-001' && /worker|policy|certificate/i.test(error.message)) {
      await downloadBackendFile('/api/workers/WRK-001/certificate', 'gigshield-demo-certificate-WRK-001.pdf')
      return
    }
    throw error
  }
}

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
function readStoredSession() {
  if (typeof localStorage === 'undefined') {
    return { registered: false, workerId: 'WRK-001', screen: 'login' }
  }
  const registered = localStorage.getItem('gigshield_registered') === 'true'
  const storedId = localStorage.getItem('gigshield_worker_id')
  return {
    registered,
    workerId: storedId || 'WRK-001',
    screen: registered ? 'app' : 'login'
  }
}

export default function WorkerApp({ onBack }) {
  const [screen, setScreen] = useState(() => readStoredSession().screen)
  const [activeTab, setActiveTab] = useState('home')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)
  const [showGigBot, setShowGigBot] = useState(false)

  // Registration state
  const [isRegistered, setIsRegistered] = useState(() => readStoredSession().registered)
  /** 'login' = existing user sign-in, 'signup' = first-time account */
  const [authMode, setAuthMode] = useState('login')
  const [registrationStep, setRegistrationStep] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    platform: 'Zepto',
    avgDailyHours: 8,
    shiftPattern: 'Full Day',
    upiId: ''
  })
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workerId, setWorkerId] = useState(() => readStoredSession().workerId)
  const [profileSnapshot, setProfileSnapshot] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(null)
  const [paymentMandate, setPaymentMandate] = useState(null)
  const [paymentStage, setPaymentStage] = useState('plans')
  const [paymentSession, setPaymentSession] = useState(null)
  const [paymentUpiId, setPaymentUpiId] = useState('')
  const [mandateConsent, setMandateConsent] = useState(true)

  useEffect(() => {
    if (!isRegistered || !workerId) return

    let cancelled = false

    const loadPaymentState = async () => {
      try {
        const policyData = await apiFetch(`/api/workers/${workerId}/policy`)
        if (!cancelled) {
          setAutoRenew(Boolean(policyData.policy?.autoRenew))
          setPaymentMandate(policyData.payment?.activeMandate ?? null)
          setPaymentUpiId(policyData.payment?.activeMandate?.upiId ?? '')
        }
      } catch {
        if (!cancelled) {
          setPaymentMandate(null)
        }
      }
    }

    loadPaymentState()

    return () => {
      cancelled = true
    }
  }, [isRegistered, workerId])

  useEffect(() => {
    if (!paymentUpiId && profile.upiId) {
      setPaymentUpiId(profile.upiId)
    }
  }, [paymentUpiId, profile.upiId])

  useEffect(() => {
    if (!isRegistered || !workerId) return
    let cancelled = false
    registerGigShieldPush(workerId)
      .then((result) => {
        if (!cancelled && result.ok) {
          console.info('[GigShield] Device push registered for zone and policy alerts')
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isRegistered, workerId])

  useEffect(() => {
    if (!isRegistered || !workerId) return

    let cancelled = false

    const loadProfileSnapshot = async () => {
      setProfileLoading(true)
      try {
        const [profileData, historyData, pointsData, insightData] = await Promise.all([
          apiFetch(`/api/workers/${workerId}/profile`),
          apiFetch(`/api/workers/${workerId}/history`),
          apiFetch(`/api/workers/${workerId}/points`),
          getWorkerInsights(workerId).catch(() => null)
        ])

        if (!cancelled) {
          setProfileSnapshot({
            profile: profileData,
            history: historyData,
            points: pointsData,
            ml: insightData
          })
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load worker snapshot', err)
          setProfileSnapshot(null)
        }
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }

    loadProfileSnapshot()
    return () => {
      cancelled = true
    }
  }, [isRegistered, workerId])

  const resetAuthSession = () => {
    localStorage.removeItem('gigshield_registered')
    localStorage.removeItem('gigshield_worker_id')
    setIsRegistered(false)
    setWorkerId('WRK-001')
    setScreen('login')
    setAuthMode('login')
    setRegistrationStep('mobile')
    setMobile('')
    setOtp('')
    setError('')
    setShowOnboarding(false)
    setActiveTab('home')
  }

  // Get user location for zone detection
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Location error:', error)
          // Use default Bangalore location for demo
          setLocation({ lat: 12.9716, lng: 77.5946 })
        }
      )
    }
  }

  // API calls
  const sendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile })
      })
      setRegistrationStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send OTP. Try again.')
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp })
      })
      if (data.isNewUser) {
        if (authMode === 'login') {
          setError('No account found for this number. Tap "Create an account" or check the number.')
          setLoading(false)
          return
        }
        setRegistrationStep('profile')
        getLocation()
      } else {
        const resolvedWorkerId = data.workerId || 'WRK-001'
        localStorage.setItem('gigshield_registered', 'true')
        localStorage.setItem('gigshield_worker_id', resolvedWorkerId)
        setWorkerId(resolvedWorkerId)
        setIsRegistered(true)
        setScreen('app')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Try again.')
    }
    setLoading(false)
  }

  const completeRegistration = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/workers/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          mobile,
          ...profile,
          lat: location?.lat,
          lng: location?.lng
        })
      })
      localStorage.setItem('gigshield_registered', 'true')
      localStorage.setItem('gigshield_worker_id', data.worker.id)
      setWorkerId(data.worker.id)
      setIsRegistered(true)
      setScreen('app')
      setShowOnboarding(true)
      setOnboardStep(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Try again.')
    }
    setLoading(false)
  }

  const purchasePlan = async () => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    setPaymentLoading(true)
    setPaymentError('')
    setPaymentSuccess(null)

    const planIds = ['basic', 'pro', 'elite'];
    const selectedPlanId = planIds[selectedPlan] || 'pro';
    const isDemoCheckout = paymentSession?.checkout?.demoMode || paymentSession?.checkout?.key === "rzp_test_gigshield_demo";

    const options = {
      key: paymentSession?.checkout?.key || "rzp_test_1234567890abcd",
      amount: paymentSession?.order?.amount || 0,
      currency: paymentSession?.order?.currency || "INR",
      name: paymentSession?.checkout?.name || "GigShield",
      description: paymentSession?.checkout?.description || "Premium",
      order_id: paymentSession?.order?.id,
      prefill: {
        name: profile?.name || "Partner",
        contact: profile?.mobile || mobile || "9999999999",
        method: "upi",
        vpa: paymentUpiId || profile?.upiId || "success@razorpay"
      },
      handler: async function (response) {
        try {
          const paymentResult = await apiFetch(`/api/workers/${workerId}/payments/verify`, {
            method: 'POST',
            body: JSON.stringify({
              orderId: paymentSession?.order?.id,
              planId: selectedPlanId,
              autoRenew: mandateConsent,
              upiId: paymentUpiId || profile?.upiId || paymentSession?.order?.upiId,
              razorpay_order_id: response.razorpay_order_id || paymentSession?.order?.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })

          setPaymentMandate(paymentResult.mandate ?? null)
          setAutoRenew(Boolean(paymentResult.policy.autoRenew))
          setPaymentSuccess({
            amount: paymentResult.pricing.finalPremium,
            referenceId: paymentResult.payment.referenceId,
            upiId: paymentResult.payment.upiId,
            policyId: paymentResult.policy.id
          })
          setPaymentStage('plans')
          setPaymentSession(null)
          setShowPurchase(false)
          setActiveTab('policy')
        } catch (err) {
          setPaymentError(err.message || 'Payment verification failed.')
        } finally {
          setPaymentLoading(false)
        }
      },
      modal: {
        ondismiss: function () {
          setPaymentLoading(false)
        }
      },
      theme: { color: "#A45B33" }
    };

    if (isDemoCheckout) {
      setTimeout(() => {
        options.handler({
          razorpay_payment_id: "pay_mock_" + Date.now(),
          razorpay_order_id: paymentSession?.order?.id,
          razorpay_signature: "mock_signature_no_key"
        });
      }, 1500);
      return;
    }

    const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isLoaded) {
      setPaymentError("Could not load Razorpay. Check your connection.");
      setPaymentLoading(false);
      return;
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setPaymentError(`Payment failed: ${response.error?.description || 'Unknown error'}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
        setPaymentError(err.message || 'Failed to open Checkout.');
        setPaymentLoading(false);
    }
  }

  const startPaymentSandbox = async () => {
    const planIds = ['basic', 'pro', 'elite']
    const selectedPlanId = planIds[selectedPlan] || 'pro'

    setPaymentLoading(true)
    setPaymentError('')

    try {
      const checkout = await apiFetch(`/api/workers/${workerId}/payments/checkout`, {
        method: 'POST',
        body: JSON.stringify({
          planId: selectedPlanId,
          autoRenew: mandateConsent,
          upiId: paymentUpiId || profile.upiId || undefined
        })
      })

      setPaymentSession(checkout)
      setPaymentUpiId(checkout.order.upiId || paymentUpiId || profile.upiId || '')
      setPaymentStage('sandbox')
    } catch (err) {
      setPaymentError(err.message || 'Unable to open Razorpay sandbox.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const resetPaymentSandbox = () => {
    setPaymentStage('plans')
    setPaymentSession(null)
    setPaymentError('')
  }

  const handleAutoRenewToggle = async () => {
    const nextValue = !autoRenew
    setPaymentError('')

    try {
      if (nextValue) {
        const response = await apiFetch(`/api/workers/${workerId}/payments/mandate`, {
          method: 'POST',
          body: JSON.stringify({
            upiId: profile.upiId || undefined
          })
        })
        setPaymentMandate(response.mandate)
        setAutoRenew(true)
        return
      }

      const response = await apiFetch(`/api/workers/${workerId}/policy/auto-renew`, {
        method: 'PATCH',
        body: JSON.stringify({ autoRenew: false })
      })
      setPaymentMandate(response.mandate ?? null)
      setAutoRenew(false)
    } catch (err) {
      setPaymentError(err.message || 'Unable to update auto-renew right now.')
    }
  }

  const handleRegisterBack = () => {
    setError('')
    if (registrationStep === 'mobile') {
      setScreen('login')
      return
    }
    if (registrationStep === 'otp') {
      setRegistrationStep('mobile')
      setOtp('')
      return
    }
    if (registrationStep === 'profile') {
      setRegistrationStep('otp')
    }
  }

  // Registration / sign-in (mobile → OTP → profile for new users)
  if (!isRegistered && screen === 'register') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-40" />
              <div className="relative z-10 w-full">

                {/* Mobile Number Step */}
                {registrationStep === 'mobile' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                      <Phone size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      {authMode === 'signup' ? 'Create your account' : 'Sign in'}
                    </h2>
                    <p className="text-text-secondary text-sm mb-8">
                      {authMode === 'signup'
                        ? 'We will send a code to verify your number, then set up your profile.'
                        : 'Use the mobile number already registered on GigShield.'}
                    </p>

                    <div className="space-y-4">
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="tel"
                          placeholder="Enter mobile number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                        />
                      </div>

                      {error && (
                        <p className="text-danger text-sm">{error}</p>
                      )}

                      <button
                        onClick={sendOtp}
                        disabled={mobile.length !== 10 || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Verification Step */}
                {registrationStep === 'otp' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                      <Shield size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Verify your number</h2>
                    <p className="text-text-secondary text-sm mb-2">We sent a code to +91 {mobile}</p>
                    <p className="text-text-muted text-xs mb-2">Enter the 4-digit OTP</p>
                    <p className="text-[11px] text-primary/90 mb-6 font-medium">Demo: use OTP 1234</p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="0000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                      />

                      {error && (
                        <p className="text-danger text-sm">{error}</p>
                      )}

                      <button
                        onClick={verifyOtp}
                        disabled={otp.length !== 4 || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>

                      <button
                        onClick={() => setRegistrationStep('mobile')}
                        className="text-primary text-sm hover:underline"
                      >
                        Change number
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Setup Step */}
                {registrationStep === 'profile' && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                      <UserPlus size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Complete Your Profile</h2>
                    <p className="text-text-secondary text-sm mb-8">Help us personalize your coverage</p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                      />

                      <select
                        value={profile.platform}
                        onChange={(e) => setProfile({...profile, platform: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary focus:border-primary focus:outline-none"
                      >
                        <option value="Zepto">Zepto</option>
                        <option value="Blinkit">Blinkit</option>
                        <option value="Swiggy Instamart">Swiggy Instamart</option>
                      </select>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Daily Hours"
                          value={profile.avgDailyHours}
                          onChange={(e) => setProfile({...profile, avgDailyHours: parseInt(e.target.value) || 8})}
                          className="px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                        />
                        <select
                          value={profile.shiftPattern}
                          onChange={(e) => setProfile({...profile, shiftPattern: e.target.value})}
                          className="px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary focus:border-primary focus:outline-none"
                        >
                          <option value="Full Day">Full Day</option>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="UPI ID (optional)"
                        value={profile.upiId}
                        onChange={(e) => setProfile({...profile, upiId: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-2xl text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                      />

                      {location && (
                        <div className="glass rounded-2xl p-4 text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-success" />
                            <span className="text-sm font-semibold text-text-primary">Zone Detected</span>
                          </div>
                          <p className="text-xs text-text-muted">Your location has been detected for zone assignment</p>
                        </div>
                      )}

                      {error && (
                        <p className="text-danger text-sm">{error}</p>
                      )}

                      <button
                        onClick={completeRegistration}
                        disabled={!profile.name || loading}
                        className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                      </button>
                    </div>
                  </div>
                )}

                <button type="button" onClick={handleRegisterBack} className="absolute top-4 left-4 text-text-muted hover:text-text-secondary">
                  <ArrowLeft size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isRegistered && screen === 'login') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame relative z-10">
            <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-40" />
              <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-[60px]" />
              <div className="absolute bottom-[20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-accent/10 blur-[60px]" />
              <div className="relative z-10 text-center w-full">
                <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40 float">
                  <Shield size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-text-primary mb-1">GigShield</h1>
                <p className="text-text-secondary text-sm mb-1">Sign in to open your cover</p>
                <p className="text-text-muted text-[11px] mb-8 tracking-wide">OTP verification · same flow for new and returning partners</p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login')
                    setScreen('register')
                    setRegistrationStep('mobile')
                    setError('')
                    setMobile('')
                    setOtp('')
                  }}
                  className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold text-base shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform mb-3"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup')
                    setScreen('register')
                    setRegistrationStep('mobile')
                    setError('')
                    setMobile('')
                    setOtp('')
                  }}
                  className="w-full py-3.5 bg-dark-card border border-dark-border rounded-2xl text-text-primary font-semibold text-base active:scale-[0.98] transition-transform mb-6"
                >
                  New user? Create an account
                </button>
                <p className="text-[10px] text-text-muted mb-4 leading-relaxed px-1">
                  Demo accounts: try <span className="text-text-secondary font-medium">9876543210</span> (Ravi) or{' '}
                  <span className="text-text-secondary font-medium">9900001111</span> (Priya). OTP is always{' '}
                  <span className="text-primary font-semibold">1234</span>.
                </p>
                <button type="button" onClick={onBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  ← Back to landing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              <button key={i} className={`w-full p-4 rounded-2xl border text-left transition-all ${p.selected ? 'border-primary/50 bg-primary/10' : 'border-dark-border bg-dark-card'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.selected ? 'gradient-primary' : 'bg-dark-surface'}`}>
                      <span className="text-white font-bold">{p.name[0]}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary">{p.name}</span>
                      <p className="text-[11px] text-text-muted mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                  {p.selected && <CheckCircle2 size={20} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )
      },
      {
        title: 'Your Zone Detected',
        subtitle: 'We found your delivery zone automatically',
        content: (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-4">
              <MapPin size={36} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">HSR Layout</h3>
            <p className="text-text-secondary text-sm mb-4">Zone HSR-01 · Bangalore</p>
            <div className="glass rounded-2xl p-4 text-left space-y-2">
              {[
                ['Dark Store', 'Zepto HSR #14'],
                ['Zone Radius', '2.5 km'],
                ['Active Workers', '34 in zone'],
                ['Risk Score', '0.74'],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-muted">{k}</span>
                  <span className={`text-text-primary ${k === 'Risk Score' ? 'font-bold text-warning' : ''}`}>{v}</span>
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
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Daily Working Hours</label>
              <div className="flex gap-2">
                {['4-6 hrs', '6-10 hrs', '10-14 hrs'].map((h, i) => (
                  <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${i === 1 ? 'gradient-primary text-white' : 'bg-dark-card border border-dark-border text-text-secondary'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Shift Pattern</label>
              <div className="flex gap-2">
                {['Morning', 'Afternoon', 'Full Day'].map((s, i) => (
                  <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${i === 2 ? 'gradient-primary text-white' : 'bg-dark-card border border-dark-border text-text-secondary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <Award size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-text-primary">+100 GigPoints</p>
                <p className="text-xs text-text-secondary">For completing your profile</p>
              </div>
            </div>
          </div>
        )
      },
    ]

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5">
              <div className="flex gap-2 mb-6 mt-2">
                {steps.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i <= onboardStep ? 'gradient-primary' : 'bg-dark-border'}`} />
                ))}
              </div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Step {onboardStep + 1} of {steps.length}</p>
              <h2 className="text-xl font-bold text-text-primary mb-1">{steps[onboardStep].title}</h2>
              <p className="text-[13px] text-text-secondary mb-5">{steps[onboardStep].subtitle}</p>
              <div className="flex-1 overflow-y-auto">{steps[onboardStep].content}</div>
              <button onClick={() => {
                if (onboardStep < steps.length - 1) setOnboardStep(onboardStep + 1)
                else { setShowOnboarding(false); setShowPurchase(true) }
              }} className="mt-4 w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform">
                {onboardStep < steps.length - 1 ? 'Continue' : 'Choose Your Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPurchase) {
    const plans = [
      { name: 'Basic Shield', price: 49, adjusted: 53, payout: 300, hours: 6, icon: 'B', popular: false },
      { name: 'Pro Shield', price: 99, adjusted: 108, payout: 600, hours: 10, icon: 'P', popular: true },
      { name: 'Elite Shield', price: 149, adjusted: 162, payout: 1000, hours: 14, icon: 'E', popular: false },
    ]
    const activePlan = plans[selectedPlan]
    const finalAmount = activePlan.adjusted - Math.round(activePlan.adjusted * 0.05)

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[375px]">
          <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
          <div className="phone-frame relative z-10">
            <div className="phone-notch" />
            <div className="h-full flex flex-col pt-12 pb-6 px-5 overflow-y-auto">
              <button
                onClick={() => {
                  if (paymentStage === 'sandbox') {
                    resetPaymentSandbox()
                    return
                  }
                  setShowPurchase(false)
                }}
                className="flex items-center gap-2 text-text-secondary text-sm mb-3 mt-2"
              >
                <ArrowLeft size={16} /> {paymentStage === 'sandbox' ? 'Back to plans' : 'Back'}
              </button>
              <h2 className="text-xl font-bold text-text-primary mb-1">{paymentStage === 'sandbox' ? 'Razorpay Sandbox' : 'Choose Your Shield'}</h2>
              <p className="text-sm text-text-secondary mb-4">
                {paymentStage === 'sandbox' ? 'Review the order and simulate a secure UPI payment' : 'AI-adjusted premiums for Zone HSR-01'}
              </p>

              {paymentStage === 'plans' && (
                <>

              <div className="glass rounded-2xl p-3 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Target size={18} className="text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">Zone Risk: 0.74</p>
                  <p className="text-xs text-text-secondary">Premium adjusted +9%</p>
                </div>
              </div>

              {/* 7-Day Premium Forecast Mini */}
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

              <div className="space-y-2.5 mb-4">
                {plans.map((plan, i) => (
                  <button key={i} onClick={() => setSelectedPlan(i)}
                          className={`w-full p-3.5 rounded-2xl border text-left transition-all relative ${selectedPlan === i ? 'border-primary/50 bg-primary/5' : 'border-dark-border bg-dark-card'}`}>
                    {plan.popular && (
                      <div className="absolute -top-2.5 right-4">
                        <span className="px-2.5 py-0.5 gradient-primary rounded-full text-[9px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${selectedPlan === i ? 'gradient-primary' : 'bg-dark-surface'}`}>
                          {plan.icon}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{plan.name}</p>
                          <p className="text-xs text-text-secondary mt-0.5">₹{plan.payout}/disruption | {plan.hours}hrs/day</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted line-through">₹{plan.price}/wk</p>
                        <p className="text-base font-bold text-text-primary">₹{plan.adjusted}<span className="text-xs text-text-secondary">/wk</span></p>
                      </div>
                    </div>
                    {selectedPlan === i && (
                      <div className="mt-2.5 pt-2.5 border-t border-dark-border space-y-1">
                        {['All 6 trigger types', 'Instant UPI payout <60s', 'GigPoints on every event'].map((t, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-success">
                            <CheckCircle2 size={11} /><span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="glass rounded-2xl p-3 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Weekly Premium</span>
                    <span className="text-text-primary">₹{plans[selectedPlan].adjusted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Award size={13} className="text-primary" />
                      <span className="text-text-secondary">Reliable Tier (5%)</span>
                    </div>
                    <span className="font-bold text-success">-₹{Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                  </div>
                  <div className="border-t border-dark-border pt-2 flex justify-between">
                    <span className="font-bold text-text-primary">You Pay</span>
                    <span className="text-lg font-bold text-text-primary">₹{plans[selectedPlan].adjusted - Math.round(plans[selectedPlan].adjusted * 0.05)}</span>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="mb-3 rounded-2xl border border-danger/20 bg-danger/10 px-3 py-2">
                  <p className="text-xs font-medium text-danger">{paymentError}</p>
                </div>
              )}

              <button onClick={startPaymentSandbox}
                      disabled={paymentLoading}
                      className="w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70">
                <CreditCard size={18} /> {paymentLoading ? 'Opening checkout...' : 'Continue to Razorpay'}
              </button>
                </>
              )}

              {paymentStage === 'sandbox' && (
                <>
                  <div className="relative overflow-hidden rounded-[28px] border border-dark-border/80 bg-dark-card/90 p-4 shadow-[0_18px_36px_rgba(83,59,34,0.08)]">
                    <div className="absolute inset-x-0 top-0 h-1 gradient-primary" />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Order Summary</p>
                        <h3 className="mt-1 text-lg font-semibold text-text-primary">{activePlan.name}</h3>
                        <p className="text-xs text-text-secondary">Weekly cover for Zone HSR-01</p>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-3 py-2 text-right">
                        <p className="text-[10px] text-text-muted">Pay now</p>
                        <p className="text-lg font-bold text-text-primary">₹{paymentSession?.pricing?.finalPremium ?? finalAmount}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-dark-surface/70 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Order ID</p>
                        <p className="mt-1 text-xs font-semibold text-text-primary break-all">{paymentSession?.order?.id ?? 'Preparing...'}</p>
                      </div>
                      <div className="rounded-2xl bg-dark-surface/70 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Method</p>
                        <p className="mt-1 text-xs font-semibold text-text-primary">UPI collect</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-dark-border bg-[linear-gradient(145deg,rgba(164,91,51,0.08),rgba(239,230,218,0.7))] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-white shadow-[0_12px_24px_rgba(164,91,51,0.22)]">
                          <Shield size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">Razorpay Test Mode</p>
                          <p className="text-[11px] text-text-secondary">Simulated checkout for the demo flow</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-text-muted">UPI ID</label>
                          <input
                            type="text"
                            value={paymentUpiId}
                            onChange={(e) => setPaymentUpiId(e.target.value)}
                            placeholder="partner@upi"
                            className="w-full rounded-2xl border border-dark-border bg-dark-card px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary/50"
                          />
                        </div>

                        <div className="rounded-2xl bg-dark-card/80 p-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setMandateConsent(!mandateConsent)
                                setAutoRenew(!mandateConsent)
                              }}
                              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${mandateConsent ? 'border-primary bg-primary text-white' : 'border-dark-border bg-dark-card text-transparent'}`}
                            >
                              <CheckCircle2 size={12} />
                            </button>
                            <div>
                              <p className="text-xs font-semibold text-text-primary">Enable weekly auto-renew mandate</p>
                              <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                                Matches the README flow: simulate a Razorpay recurring UPI mandate after checkout.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-dark-card/70 p-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-text-secondary">Premium after tier discount</span>
                            <span className="font-semibold text-text-primary">₹{paymentSession?.pricing?.finalPremium ?? finalAmount}</span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span className="text-text-secondary">Payout cover</span>
                            <span className="font-semibold text-text-primary">₹{activePlan.payout}/day</span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span className="text-text-secondary">Mandate status</span>
                            <span className={`font-semibold ${mandateConsent ? 'text-success' : 'text-text-primary'}`}>
                              {mandateConsent ? 'Will activate after payment' : 'One-time payment only'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/10 px-3 py-2">
                      <p className="text-xs font-medium text-danger">{paymentError}</p>
                    </div>
                  )}

                  <button onClick={purchasePlan}
                          disabled={paymentLoading || !paymentSession?.order?.id}
                          className="mt-4 w-full py-3.5 gradient-primary rounded-2xl text-white font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70">
                    <IndianRupee size={18} /> {paymentLoading ? 'Opening Razorpay...' : 'Pay with Razorpay (Sandbox)'}
                  </button>
                  <p className="text-center text-[10px] text-text-muted mt-2">Uses Razorpay test mode. No real money will be charged.</p>
                </>
              )}
              <p className="text-center text-[10px] text-text-muted mt-2">Razorpay Sandbox · Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab setShowNotif={setShowNotif} showNotif={showNotif} setShowPurchase={setShowPurchase} setActiveTab={setActiveTab} onToggleAutoRenew={handleAutoRenewToggle} setShowGigBot={setShowGigBot} workerId={workerId} />
      case 'policy': return <PolicyTab autoRenew={autoRenew} onToggleAutoRenew={handleAutoRenewToggle} paymentMandate={paymentMandate} paymentSuccess={paymentSuccess} paymentError={paymentError} workerId={workerId} />
      case 'points': return <PointsTab workerId={workerId} />
      case 'history': return <HistoryTab />
      case 'profile': return <ProfileTab onBack={onBack} onLogout={resetAuthSession} setActiveTab={setActiveTab} workerId={workerId} onEnableDevicePush={() => registerGigShieldPush(workerId)} profileData={profileSnapshot} loading={profileLoading} />
      default: return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-[375px]">
        <div className="absolute inset-0 gradient-primary rounded-[50px] blur-[80px] opacity-20" />
        <div className="phone-frame relative z-10">
          <div className="phone-notch" />
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pt-10 pb-20 px-5">
              {renderTab()}
            </div>
            {/* GigBot FAB */}
            {!showGigBot && (
              <button onClick={() => setShowGigBot(true)}
                      className="absolute bottom-20 right-4 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/40 z-30 active:scale-95 transition-transform">
                <MessageCircle size={20} className="text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] rounded-full bg-success flex items-center justify-center border border-white">
                  <span className="text-[6px] text-white font-bold">AI</span>
                </div>
              </button>
            )}
            {/* GigBot Panel */}
            {showGigBot && <GigBotPanel onClose={() => setShowGigBot(false)} workerId={workerId} />}
            {/* Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-dark-border safe-area-bottom z-20">
              <div className="flex items-center justify-around py-2 pb-3">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`}>
                    <tab.icon size={18} />
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


// ─── GIGBOT PANEL ─────────────────────────────────────
function GigBotPanel({ onClose, workerId }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m GigBot, your insurance assistant. Ask me about claims, premiums, triggers, or GigPoints!', lang: 'en' },
    { from: 'bot', text: 'Namaste! Main GigBot hoon. Hindi ya English mein puchiye!', lang: 'hi' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lang, setLang] = useState('en')
  const { isDark } = useTheme()
  const messagesEnd = useRef(null)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg) return
    setMessages(prev => [...prev, { from: 'user', text: userMsg, time: 'now' }])
    setInput('')
    setIsTyping(true)
    try {
      const data = await apiFetch(`/api/workers/${workerId}/gigbot`, {
        method: 'POST',
        body: JSON.stringify({ message: userMsg })
      })
      setMessages(prev => [...prev, { from: 'bot', text: data.reply, time: 'now' }])
    } catch {
      // Fallback to static responses if backend unavailable
      const lower = userMsg.toLowerCase()
      let reply = chatResponses.default[lang]
      if (lower.includes('claim') || lower.includes('payout') || lower.includes('status')) reply = chatResponses['claim status'][lang]
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('premium')) reply = chatResponses['premium'][lang]
      else if (lower.includes('trigger') || lower.includes('rain') || lower.includes('weather')) reply = chatResponses['triggers'][lang]
      else if (lower.includes('point') || lower.includes('gigpoint') || lower.includes('tier')) reply = chatResponses['points'][lang]
      else if (lower.includes('pool') || lower.includes('collective') || lower.includes('community')) reply = chatResponses['pool'][lang]
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: 'now' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className={`absolute inset-x-0 bottom-[56px] z-40 backdrop-blur-2xl flex flex-col rounded-t-3xl shadow-2xl overflow-hidden ${
      isDark 
        ? 'bg-dark/97 border-t border-primary/20' 
        : 'bg-white/98 border-t border-gray-200'
    }`} style={{ height: '55%', maxHeight: '420px' }}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <MessageCircle size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">GigBot</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <p className="text-[10px] text-text-muted">Gemini AI-powered · {lang === 'en' ? 'English' : 'Hindi'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                    isDark ? 'bg-dark-surface border-dark-border text-text-secondary' : 'bg-gray-100 border-gray-200 text-gray-600'
                  }`}>
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          <button onClick={onClose} className="text-text-muted"><X size={16} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} slide-up`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
              m.from === 'user' 
                ? 'gradient-primary text-white rounded-br-md' 
                : isDark
                  ? 'bg-dark-surface text-text-primary rounded-bl-md'
                  : 'bg-gray-100 text-gray-700 rounded-bl-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 ${isDark ? 'bg-dark-surface' : 'bg-gray-100'}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-text-muted/60' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-text-muted/60' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-text-muted/60' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>
      {/* Quick Replies */}
      <div className="px-3 pb-1.5 flex gap-1.5 overflow-x-auto">
        {['Claim Status', 'My Premium', 'Triggers', 'GigPoints', 'Pool Info'].map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all hover:border-primary/30 hover:text-primary ${
                    isDark 
                      ? 'bg-dark-surface border-dark-border text-text-secondary' 
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary/5'
                  }`}>
            {q}
          </button>
        ))}
      </div>
      <div className={`p-2.5 border-t flex gap-2 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
        <input value={input} onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && sendMessage()}
               placeholder="Ask GigBot anything..."
               className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border focus:border-primary/30 ${
                 isDark 
                   ? 'bg-dark-surface text-text-primary placeholder-text-muted border-dark-border' 
                   : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
               }`} />
        <button onClick={() => sendMessage()} className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          input.trim() ? 'gradient-primary' : isDark ? 'bg-dark-surface' : 'bg-gray-200'
        }`}>
          <Send size={14} className={input.trim() ? 'text-white' : isDark ? 'text-text-muted' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  )
}


// ─── HOME TAB (Enhanced) ─────────────────────────────
function HomeTab({ setShowNotif, showNotif, setShowPurchase, setActiveTab, onToggleAutoRenew, setShowGigBot }) {
  const { isDark, toggleTheme } = useTheme()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [12.9116, 77.6389], zoom: 14, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
    L.circle([12.9116, 77.6389], { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, radius: 1200 }).addTo(map);
    const markerIcon = L.divIcon({ className: 'custom-zone-marker', html: `<div style="width: 14px; height: 14px; border-radius: 50%; background: #10b981; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
    L.marker([12.9116, 77.6389], { icon: markerIcon }).addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; }
  }, []);

  return (
    <div className="space-y-3.5 mt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">Good afternoon,</p>
          <h2 className="text-xl font-bold text-text-primary">Ravi Kumar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="relative w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-text-secondary" />}
          </button>
          <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <Bell size={16} className="text-text-secondary" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-danger flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">3</span>
            </div>
          </button>
        </div>
      </div>

      {showNotif && (
        <div className="glass rounded-2xl p-3 space-y-2 slide-up">
          <SectionLabel>Notifications</SectionLabel>
          {[
            { title: '₹600 Credited', desc: 'Rainfall trigger — HSR Layout', time: '12:11 PM', icon: CheckCircle2, color: 'success' },
            { title: 'Zone Watch Active', desc: 'AQI rising — 280, nearing 300', time: '11:30 AM', icon: AlertTriangle, color: 'warning' },
            { title: 'Policy Renewed', desc: 'Pro Shield — Week 8 active', time: 'Yesterday', icon: ShieldCheck, color: 'primary' },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-${n.color}/20`}>
                <n.icon size={12} className={`text-${n.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{n.title}</p>
                <p className="text-[10px] text-text-secondary">{n.desc}</p>
              </div>
              <span className="text-[9px] text-text-muted shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone Status */}
      <div className="bg-success/10 border border-success/30 rounded-2xl p-3.5 overflow-hidden">
        <div ref={mapRef} className="w-full h-32 rounded-xl mb-3 border border-success/20 relative" style={{ zIndex: 1 }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success pulse-ring" />
            </div>
            <div>
              <p className="text-sm font-bold text-success">ZONE SAFE</p>
              <p className="text-[10px] text-text-secondary">HSR Layout · HSR-01</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-text-muted" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-success/20">
          {[
            { icon: CloudRain, label: 'Rain', val: '3mm' },
            { icon: Thermometer, label: 'Temp', val: '32°C' },
            { icon: Wind, label: 'AQI', val: '142' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <m.icon size={12} className="text-text-muted mx-auto mb-0.5" />
              <p className="text-[10px] text-text-muted">{m.label}</p>
              <p className="text-sm font-bold text-text-primary">{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Policy */}
      <div className="glass rounded-2xl p-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.04] rounded-bl-[60px]" />
        <div className="flex items-center justify-between mb-2 relative">
          <SectionLabel>Active Policy</SectionLabel>
          <StatusPill status="info">Pro Shield</StatusPill>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-text-primary">₹600</span>
          <span className="text-xs text-text-secondary">/disruption day</span>
        </div>
        <p className="text-[10px] text-text-secondary mb-2">Valid Mar 10 – Mar 16, 2026</p>
        <div className="h-1.5 rounded-full bg-dark-border overflow-hidden mb-1">
          <div className="h-full w-[71%] gradient-primary rounded-full" />
        </div>
        <div className="flex justify-between">
          <p className="text-[9px] text-text-muted">5 of 7 days remaining</p>
          <p className="text-[9px] text-primary font-medium">₹103/wk</p>
        </div>
      </div>

      {/* Premium Forecast Alert */}
      <div className="bg-primary/[0.04] border border-primary/15 rounded-2xl p-3.5">
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Award size={14} className="text-primary" />
            <p className="text-[10px] text-text-muted">GigPoints</p>
          </div>
          <p className="text-xl font-bold text-gradient">2,450</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[12px]">🥈</span>
            <p className="text-[10px] text-text-secondary">Reliable Tier</p>
          </div>
        </div>
        <div className="gradient-success rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={14} className="text-white/80" />
            <p className="text-[10px] text-white/70">Net Savings</p>
          </div>
          <p className="text-xl font-bold text-white">₹1,968</p>
          <p className="text-[10px] text-white/80 mt-0.5">556% ROI</p>
        </div>
      </div>

      {/* Streak */}
      <div className="glass rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-warning" />
            <p className="text-sm font-semibold text-text-primary">7-Week Streak</p>
          </div>
          <p className="text-[10px] text-primary">+75 pts/week</p>
        </div>
        <div className="flex gap-1">
          {['W1','W2','W3','W4','W5','W6','W7','W8'].map((w, i) => (
            <div key={i} className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-bold ${i < 7 ? 'gradient-primary text-white' : 'bg-dark-surface text-text-muted border border-dashed border-dark-border'}`}>
              {i < 7 ? '✓' : w}
            </div>
          ))}
        </div>
      </div>

      {/* Smart Reminders */}
      <div className="glass rounded-2xl p-3.5">
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

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: FileCheck, label: 'Claims', color: 'text-success', bg: 'bg-success/10', action: () => setActiveTab('history') },
            { icon: CreditCard, label: 'Pay', color: 'text-primary', bg: 'bg-primary/10', action: () => setShowPurchase(true) },
            { icon: Users, label: 'Refer', color: 'text-accent', bg: 'bg-accent/10', action: () => setActiveTab('points') },
            { icon: Headphones, label: 'Help', color: 'text-warning', bg: 'bg-warning/10', action: () => setShowGigBot(true) },
          ].map((a, i) => (
            <button key={i} onClick={a.action} className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-dark-surface/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                <a.icon size={18} className={a.color} />
              </div>
              <span className="text-[10px] text-text-muted font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Collective Pool */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-accent" />
            <p className="text-sm font-semibold text-text-primary">Zone Pool</p>
          </div>
          <span className="text-[10px] text-accent font-medium">HSR-01</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-text-primary">34</p>
            <p className="text-[9px] text-text-muted">Members</p>
          </div>
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-accent">₹1,240</p>
            <p className="text-[9px] text-text-muted">Pool Balance</p>
          </div>
          <div className="bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-success">Strong</p>
            <p className="text-[9px] text-text-muted">Health</p>
          </div>
        </div>
        <p className="text-[10px] text-text-secondary mt-2">Your contribution: ₹10/week | Covers ~2 below-threshold events</p>
      </div>

      {/* Today's Activity */}
      <div className="glass rounded-2xl p-3">
        <SectionLabel action={() => {}} actionLabel="See All">Today's Activity</SectionLabel>
        <div className="space-y-2.5">
          {[
            { icon: CloudRain, color: 'primary', title: 'Rainfall Trigger', time: '12:10 PM', zone: 'HSR Layout', payout: 600, pts: 200 },
            { icon: Shield, color: 'accent', title: 'Policy Active', time: '11:45 AM', zone: 'Pro Shield', payout: null, pts: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-${item.color}/20 flex items-center justify-center shrink-0`}>
                <item.icon size={14} className={`text-${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">{item.title}</p>
                <p className="text-[10px] text-text-secondary">{item.time} · {item.zone}</p>
              </div>
              {item.payout && (
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-success">+₹{item.payout}</p>
                  <p className="text-[10px] text-primary">+{item.pts} pts</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Gap Alert */}
      <div className="bg-danger/[0.04] border border-danger/15 rounded-2xl p-3.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-danger" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-danger">Coverage Gap Alert</p>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              34 active workers received ₹600 each today. Stay protected for next events.
            </p>
            <button onClick={onToggleAutoRenew} className="mt-2.5 px-4 py-2 text-[11px] font-semibold gradient-primary text-white rounded-xl shadow-sm shadow-primary/15">
              Enable Auto-Renew
            </button>
          </div>
        </div>
      </div>

      {/* Emergency SOS */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center">
            <HeartPulse size={22} className="text-danger" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-text-primary">Emergency SOS</p>
            <p className="text-[11px] text-text-muted">Accident, health emergency, or safety issue</p>
          </div>
          <button onClick={() => { if (window.confirm('This will alert emergency services. Continue?')) { window.location.href = 'tel:112'; } }} className="px-3 py-2 bg-danger/10 border border-danger/25 rounded-xl text-danger text-[11px] font-bold active:scale-95 transition-transform">
            SOS
          </button>
        </div>
      </div>

      {/* Weather Radar Mini - NEW INNOVATIVE FEATURE */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Live Weather Radar</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {[
            { time: '1PM', rain: '3mm', icon: '☀️', risk: 'low' },
            { time: '2PM', rain: '8mm', icon: '🌤️', risk: 'low' },
            { time: '3PM', rain: '14mm', icon: '🌧️', risk: 'med' },
            { time: '4PM', rain: '19mm', icon: '⛈️', risk: 'high' },
          ].map((h, i) => (
            <div key={i} className={`text-center p-2 rounded-xl ${h.risk === 'high' ? 'bg-danger/10 border border-danger/20' : h.risk === 'med' ? 'bg-warning/10' : 'bg-dark-surface/50'}`}>
              <p className="text-[10px] text-text-muted">{h.time}</p>
              <p className="text-lg my-0.5">{h.icon}</p>
              <p className={`text-[10px] font-bold ${h.risk === 'high' ? 'text-danger' : h.risk === 'med' ? 'text-warning' : 'text-text-primary'}`}>{h.rain}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-warning mt-2 font-medium">⚠️ Trigger likely at 4PM — Stay protected!</p>
      </div>

      {/* Earnings Impact Calculator - NEW INNOVATIVE FEATURE */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Earnings Impact</SectionLabel>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-text-muted">Without GigShield</p>
            <p className="text-base font-bold text-danger">-₹4,800</p>
            <p className="text-[9px] text-text-muted">Lost to disruptions</p>
          </div>
          <div className="w-px h-10 bg-dark-border" />
          <div className="text-right">
            <p className="text-[10px] text-text-muted">With GigShield</p>
            <p className="text-base font-bold text-success">+₹1,968</p>
            <p className="text-[9px] text-text-muted">Net protected</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-dark-border overflow-hidden">
          <div className="h-full w-[85%] gradient-success rounded-full" />
        </div>
        <p className="text-[9px] text-success mt-1.5 font-medium text-center">You're in the top 15% of protected earners in your zone</p>
      </div>
    </div>
  )
}


// ─── POLICY TAB (Enhanced) ───────────────────────────
function PolicyTab({ autoRenew, onToggleAutoRenew, paymentMandate, paymentSuccess, paymentError, workerId }) {
  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">My Policy</h2>

      {paymentSuccess && (
        <div className="rounded-2xl border border-success/20 bg-success/10 p-3.5">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-success">Razorpay payment completed</p>
              <p className="text-[11px] text-text-secondary mt-1">
                Paid Rs {paymentSuccess.amount} from {paymentSuccess.upiId}. Ref: {paymentSuccess.referenceId}
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 p-3">
          <p className="text-xs font-medium text-danger">{paymentError}</p>
        </div>
      )}

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="text-xs font-bold text-primary">GIGSHIELD POLICY</span>
            </div>
            <button onClick={async () => { try { await downloadCertificatePdf(workerId) } catch (error) { alert(`Could not download certificate: ${error.message}`) } }} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
              <Download size={10} /> PDF
            </button>
          </div>
          <div className="space-y-2">
            {[
              ['Policy ID', 'GS-2026-HSR-00342'],
              ['Holder', 'Ravi Kumar'],
              ['Zone', 'HSR Layout, Bangalore'],
              ['Plan', 'Pro Shield'],
              ['Coverage', '₹600/disruption day'],
              ['Valid', '10 Mar – 16 Mar 2026'],
              ['Premium', '₹103 (5% tier discount)'],
              ['Tier', 'Reliable'],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-text-muted">{k}</span>
                <span className="text-text-primary">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2.5 border-t border-dark-border">
            <p className="text-[9px] text-text-muted mb-1.5">COVERED TRIGGERS</p>
            <div className="flex flex-wrap gap-1">
              {['Rain >15mm', 'AQI >300', 'Temp >43°C', 'Flood', 'Store Closure', 'Curfew'].map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-dark-surface rounded-full text-[9px] text-text-secondary">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Premium Forecast */}
      <div className="glass rounded-2xl p-3.5">
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
              <Area type="monotone" dataKey="premium" stroke="#FF6B6B" fill="url(#forecastGradPolicy)" strokeWidth={2} dot={{ r: 3, fill: '#FF6B6B', strokeWidth: 0 }} name="Premium" />
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
            { label: 'Historical risk', pct: 20, color: '#8a6a52' },
            { label: 'Traffic + news', pct: 15, color: '#FF6B6B' },
          ].map((d, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-text-secondary">{d.label}</span>
                <span className="text-[10px] text-text-muted font-medium">{d.pct}%</span>
              </div>
              <div className="h-[3px] rounded-full bg-dark-border overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${d.pct * 2.5}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Score */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Zone Risk Assessment</SectionLabel>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(45,37,80,1)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="url(#g1)" strokeWidth="3" strokeDasharray="74, 100" strokeLinecap="round" />
              <defs><linearGradient id="g1"><stop offset="0%" stopColor="#a45b33" /><stop offset="100%" stopColor="#8a6a52" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-text-primary">0.74</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-warning">Moderate-High Risk</p>
            <p className="text-[10px] text-text-secondary">90-day zone history</p>
            <p className="text-[10px] text-text-muted">Premium: +9%</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Rainfall', value: 72, color: '#6C5CE7' },
            { label: 'AQI', value: 58, color: '#FDCB6E' },
            { label: 'Flood Risk', value: 45, color: '#FF6B6B' },
            { label: 'Seasonal', value: 85, color: '#8a6a52' },
          ].map((r, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[9px] text-text-muted">{r.label}</span>
                <span className="text-[9px] text-text-secondary">{r.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-dark-border overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Expiry Reminders */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing size={15} className="text-accent" />
            <p className="text-sm font-semibold text-text-primary">Expiry Reminders</p>
          </div>
          <StatusPill status="success">Active</StatusPill>
        </div>
        <div className="space-y-2">
          {reminderSchedule.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${
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
                  <span className="text-[9px] text-text-muted">{r.day} {r.time} · {r.type.toUpperCase()}</span>
                  <span className={`text-[9px] font-bold ml-auto ${r.status === 'sent' ? 'text-success' : r.status === 'scheduled' ? 'text-warning' : 'text-primary'}`}>
                    {r.status === 'sent' ? '✓ Delivered' : r.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-text-muted mt-2 italic">Context-aware: Adjusts based on risk surge, streak, and lapse history</p>
      </div>

      {/* Auto-Renew */}
      <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RefreshCw size={16} className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Auto-Renew</p>
            <p className="text-[10px] text-text-secondary">
              {paymentMandate?.status === 'active' ? `UPI mandate active · ${paymentMandate.upiId}` : 'UPI mandate paused'}
            </p>
          </div>
        </div>
        <button onClick={onToggleAutoRenew}
                className={`w-11 h-6 rounded-full transition-all relative ${autoRenew ? 'bg-primary' : 'bg-dark-border'}`}>
          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-[3px] transition-all ${autoRenew ? 'right-[3px]' : 'left-[3px]'}`} style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Latest Claim */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <SectionLabel>Latest Claim</SectionLabel>
          <button onClick={async () => { try { const text = await apiFetch(`/api/workers/${workerId}/claims/CLM-0892/statement`); const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'claim-statement.txt'; a.click(); URL.revokeObjectURL(url); } catch { alert('Could not download statement. Make sure backend is running.') } }} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
            <Download size={10} /> EOB
          </button>
        </div>
        <div className="space-y-1.5">
          {[
            ['Claim ID', 'GS-CLM-0892'],
            ['Event', 'Heavy Rainfall'],
            ['Triggered', '12:10 PM, Mar 10'],
            ['Payout', '₹600'],
            ['Status', 'SETTLED'],
          ].map(([k, v], i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-text-muted">{k}</span>
              {k === 'Payout' ? <span className="text-success font-bold">{v}</span> :
               k === 'Status' ? <StatusPill status="success">{v}</StatusPill> :
               <span className="text-text-primary">{v}</span>}
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-dark-border space-y-1">
          <p className="text-[9px] text-text-muted mb-1">VALIDATION</p>
          {['GPS in zone (0.8 km)', 'Active (3 deliveries)', 'App logged in', 'No duplicate'].map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-success" />
              <span className="text-[10px] text-text-secondary">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Processing Pipeline */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Claim Processing Pipeline</SectionLabel>
        <div className="flex items-center gap-1 mb-3">
          {['Trigger Detected', 'Fraud Check', 'Approval', 'UPI Payout'].map((step, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="w-full text-center py-1.5 rounded-lg text-[8px] font-bold bg-success/15 text-success">
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


// ─── POINTS TAB (Enhanced) ───────────────────────────
function PointsTab({ workerId }) {
  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">GigPoints</h2>

      <div className="relative overflow-hidden rounded-2xl gradient-primary p-4">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-white/10 blur-[30px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Total Balance</p>
            <p className="text-3xl font-black text-white mt-0.5">2,450</p>
            <p className="text-xs text-white/80 mt-0.5">🥈 Reliable · 5% discount</p>
          </div>
          <div className="w-16 h-16 rounded-full border-3 border-white/30 flex items-center justify-center bg-white/10" style={{ borderWidth: 3 }}>
            <span className="text-2xl">🥈</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/70 mb-1">
            <span>2,450 / 2,500 to Veteran 🥇</span>
            <span>98%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-[98%] bg-white rounded-full" />
          </div>
          <p className="text-[10px] text-white/50 mt-1.5">Just 50 points away from 10% premium discount!</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Tier Roadmap</SectionLabel>
        <div className="space-y-2">
          {[
            { name: 'Starter', emoji: '🥉', min: 0, desc: 'Standard coverage', current: false },
            { name: 'Reliable', emoji: '🥈', min: 1000, desc: '5% premium discount', current: true },
            { name: 'Veteran', emoji: '🥇', min: 2500, desc: '10% off + priority payout', current: false },
            { name: 'Champion', emoji: '💎', min: 5000, desc: '15% off + free week/quarter', current: false },
          ].map((t, i) => (
            <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl ${t.current ? 'bg-primary/10 border border-primary/30' : ''}`}>
              <span className="text-base">{t.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className={`text-xs font-semibold ${t.current ? 'text-primary' : 'text-text-primary'}`}>{t.name}</p>
                  <span className="text-[9px] text-text-muted">{t.min.toLocaleString()}+ pts</span>
                </div>
                <p className="text-[9px] text-text-secondary">{t.desc}</p>
              </div>
              {t.current && <StatusPill status="info">You</StatusPill>}
            </div>
          ))}
        </div>
      </div>

      {/* Reward Milestones */}
      <div className="glass rounded-2xl p-3.5">
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
              <div className="h-[3px] rounded-full bg-dark-border overflow-hidden">
                <div className="h-full gradient-primary rounded-full" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Recent Points</SectionLabel>
        <div className="space-y-2">
          {[
            { action: 'Payout received', pts: 200, time: 'Today 12:11 PM' },
            { action: 'Active during disruption', pts: 100, time: 'Today 12:10 PM' },
            { action: 'Streak bonus (W7)', pts: 75, time: 'Sunday' },
            { action: 'Policy renewal', pts: 50, time: 'Sunday' },
            { action: 'Referral: Suresh M.', pts: 500, time: 'Last week' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <div>
                <p className="text-xs text-text-primary">{item.action}</p>
                <p className="text-[9px] text-text-muted">{item.time}</p>
              </div>
              <span className="text-xs font-bold text-primary">+{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="glass rounded-2xl p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus size={16} className="text-accent" />
          <p className="text-sm font-bold text-text-primary">Refer Partners</p>
        </div>
        <p className="text-[10px] text-text-secondary mb-2.5">Both get ₹50 off + you earn 500 pts</p>
        <div className="flex gap-2 mb-2.5">
          <div className="flex-1 bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-text-primary">3</p>
            <p className="text-[9px] text-text-muted">Referrals</p>
          </div>
          <div className="flex-1 bg-dark-surface rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-accent">20/34</p>
            <p className="text-[9px] text-text-muted">Zone Goal</p>
          </div>
        </div>
        <button onClick={async () => { try { await apiFetch(`/api/workers/${workerId}/referrals`, { method: 'POST', body: JSON.stringify({ referredName: 'New Partner', referredMobile: '0000000000' }) }); if (navigator.share) { await navigator.share({ title: 'GigShield Referral', text: 'Join GigShield! Use my referral to get ₹50 off your first week.', url: window.location.origin }); } else { await navigator.clipboard.writeText(`Join GigShield! ${window.location.origin}`); alert('Referral link copied to clipboard!'); } } catch { alert('Referral link copied!'); } }} className="w-full py-2 bg-accent/10 border border-accent/30 rounded-xl text-accent text-xs font-semibold">
          Share Referral Link
        </button>
      </div>
    </div>
  )
}


// ─── HISTORY TAB (Enhanced with sub-tabs) ────────────
function HistoryTab() {
  const [subTab, setSubTab] = useState('savings')

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Protection History</h2>

      {/* Sub-tabs */}
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
      {subTab === 'graph' && <GraphSubTab />}
      {subTab === 'pool' && <PoolSubTab />}
      {subTab === 'timeline' && <TimelineSubTab />}
    </div>
  )
}

function SavingsSubTab() {
  return (
    <div className="space-y-3.5">
      <div className="glass rounded-2xl p-4">
        <SectionLabel>Lifetime Savings</SectionLabel>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-text-muted">Premiums Paid</p>
            <p className="text-base font-bold text-text-primary">₹432</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted">Payouts Received</p>
            <p className="text-base font-bold text-success">₹2,400</p>
          </div>
        </div>
        <div className="border-t border-dark-border pt-2.5">
          <div className="flex justify-between">
            <p className="text-sm text-text-secondary">Net Savings</p>
            <p className="text-xl font-black text-gradient">₹1,968</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-text-muted">Return on Protection</p>
            <p className="text-sm font-bold text-success">556%</p>
          </div>
          <p className="text-[9px] text-text-muted mt-1.5 italic">Every ₹1 paid → ₹5.56 back</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>This Week</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-base font-bold text-text-primary">₹1,200</p>
            <p className="text-[9px] text-text-muted">Protected</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">725</p>
            <p className="text-[9px] text-text-muted">Points</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-accent">2</p>
            <p className="text-[9px] text-text-muted">Triggers</p>
          </div>
        </div>
      </div>

      {/* Protection Score */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Your Protection Score</SectionLabel>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(45,37,80,0.4)" strokeWidth="2.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#protScore)" strokeWidth="2.5" strokeDasharray="92, 100" strokeLinecap="round" />
              <defs><linearGradient id="protScore"><stop offset="0%" stopColor="#bc8750" /><stop offset="100%" stopColor="#8a6a52" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[15px] font-bold text-success">92</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-success">Excellent</p>
            <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">Consistent coverage, zero gaps in 7 weeks. Top 12% in your zone.</p>
          </div>
        </div>
      </div>

      {/* Zone History */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Zone HSR — 30 Days</SectionLabel>
        <div className="space-y-2">
          {[
            { date: 'Mar 10', event: 'Rain (19mm/hr)', hours: 4, workers: 34, total: '₹20,400' },
            { date: 'Mar 08', event: 'AQI 320', hours: 2, workers: 31, total: '₹18,600' },
            { date: 'Mar 03', event: 'Store Closure', hours: 3, workers: 28, total: '₹16,800' },
            { date: 'Feb 28', event: 'Heat (44°C)', hours: 6, workers: 40, total: '₹24,000' },
          ].map((z, i) => (
            <div key={i} className="p-2 rounded-xl bg-dark-surface">
              <p className="text-[10px] font-bold text-text-primary mb-0.5">{z.date} — {z.event}</p>
              <div className="flex gap-2 text-[9px] text-text-muted">
                <span>{z.hours}h</span><span>|</span>
                <span>{z.workers} workers</span><span>|</span>
                <span className="text-success">{z.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GraphSubTab() {
  const [view, setView] = useState('monthly')
  const yearlyData = [
    { year: '2025 Q4', premiums: 156, payouts: 600, net: 444 },
    { year: '2026 Q1', premiums: 310, payouts: 2400, net: 2090 },
  ]

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Paid', value: '₹466', color: 'text-danger' },
          { label: 'Received', value: '₹3,000', color: 'text-success' },
          { label: 'ROI', value: '544%', color: 'text-gradient' },
        ].map((item, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p>
            <p className={`text-[14px] font-bold ${item.color} mt-0.5`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {['monthly', 'yearly'].map(v => (
          <button key={v} onClick={() => setView(v)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-semibold ${view === v ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-dark-surface/50 text-text-muted'}`}>
            {v === 'monthly' ? 'Monthly' : 'Quarterly'}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>{view === 'monthly' ? 'Monthly Premiums vs Payouts' : 'Quarterly Overview'}</SectionLabel>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view === 'monthly' ? lifetimeData : yearlyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.2)" vertical={false} />
              <XAxis dataKey={view === 'monthly' ? 'month' : 'year'} tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7C72A0', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premiums" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Premiums" barSize={16} />
              <Bar dataKey="payouts" fill="#bc8750" radius={[4, 4, 0, 0]} name="Payouts" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net Savings Trend */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Net Savings Trend</SectionLabel>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lifetimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="netGradGraph" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bc8750" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#bc8750" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7C72A0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="net" stroke="#bc8750" fill="url(#netGradGraph)" strokeWidth={2} dot={{ r: 3, fill: '#bc8750', strokeWidth: 0 }} name="Net Savings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Markers */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Event Markers</SectionLabel>
        <div className="space-y-2">
          {[
            { month: 'Nov', event: 'AQI Trigger (320)', icon: Wind, color: 'warning' },
            { month: 'Jan', event: 'Heavy Rain (19mm)', icon: CloudRain, color: 'primary' },
            { month: 'Feb', event: 'Heat Wave (44°C)', icon: Thermometer, color: 'danger' },
            { month: 'Mar', event: 'Rainfall Trigger', icon: CloudRain, color: 'primary' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <span className="text-[10px] text-text-muted w-6 font-medium">{e.month}</span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-${e.color}/15`}>
                <e.icon size={12} className={`text-${e.color}`} />
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

function PoolSubTab() {
  const [optedIn, setOptedIn] = useState(true)
  const [showVote, setShowVote] = useState(false)
  const [voteResult, setVoteResult] = useState(null)

  return (
    <div className="space-y-3.5">
      {/* Pool Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-accent/[0.06] border border-accent/20 p-4">
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

      {/* Opt-in Toggle */}
      <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
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
      <div className="glass rounded-2xl p-3.5">
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
      <div className="bg-warning/[0.04] border border-warning/15 rounded-2xl p-3.5">
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
            <span className="text-[10px] text-success font-semibold">12/20 votes (60%)</span>
          </div>
        </div>
        {voteResult ? (
          <div className={`w-full py-2.5 rounded-xl text-center text-[12px] font-semibold ${voteResult === 'for' ? 'bg-success/10 border border-success/25 text-success' : 'bg-danger/10 border border-danger/25 text-danger'}`}>
            {voteResult === 'for' ? '✓ You voted to Approve' : '✗ You voted to Deny'}
          </div>
        ) : !showVote ? (
          <button onClick={() => setShowVote(true)} className="w-full py-2.5 bg-warning/10 border border-warning/25 rounded-xl text-warning text-[12px] font-semibold">
            Cast Your Vote
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={async () => { try { await apiFetch('/api/admin/pools/motions/PLM-001/vote', { method: 'POST', body: JSON.stringify({ vote: 'for' }) }); } catch (error) { console.warn('Pool vote saved locally:', error) } setVoteResult('for'); setShowVote(false); }} className="flex-1 py-2.5 bg-success/10 border border-success/25 rounded-xl text-success text-[12px] font-semibold">✓ Approve</button>
            <button onClick={async () => { try { await apiFetch('/api/admin/pools/motions/PLM-001/vote', { method: 'POST', body: JSON.stringify({ vote: 'against' }) }); } catch (error) { console.warn('Pool vote saved locally:', error) } setVoteResult('against'); setShowVote(false); }} className="flex-1 py-2.5 bg-danger/10 border border-danger/25 rounded-xl text-danger text-[12px] font-semibold">✗ Deny</button>
          </div>
        )}
      </div>

      {/* Pool Activity */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Pool Activity</SectionLabel>
        <div className="space-y-2">
          {[
            { action: 'Weekly contribution (x34)', amount: '+₹340', time: 'This week', type: 'in' },
            { action: 'Priya M. draw (approved)', amount: '-₹400', time: 'Mar 8', type: 'out' },
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

function TimelineSubTab() {
  return (
    <div className="space-y-3.5">
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Protection Timeline</SectionLabel>
        <div className="space-y-3">
          <p className="text-[9px] font-semibold text-text-muted">TODAY</p>
          {[
            { icon: CloudRain, bg: 'bg-primary/20', ic: 'text-primary', title: 'Rainfall Trigger', sub: 'HSR Layout — 19mm/hr', time: '12:10 PM', pay: '+₹600', pts: '+200' },
          ].map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${e.bg} flex items-center justify-center shrink-0`}>
                <e.icon size={14} className={e.ic} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">{e.title}</p>
                <p className="text-[10px] text-text-secondary">{e.sub}</p>
                <p className="text-[9px] text-text-muted">{e.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-success">{e.pay}</p>
                <p className="text-[10px] text-primary">{e.pts}</p>
              </div>
            </div>
          ))}
          <p className="text-[9px] font-semibold text-text-muted pt-1">YESTERDAY</p>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <Wind size={14} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-primary">AQI Trigger</p>
              <p className="text-[10px] text-text-secondary">HSR Layout — AQI 320</p>
              <p className="text-[9px] text-text-muted">3:20 PM</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-success">+₹600</p>
              <p className="text-[10px] text-primary">+200</p>
            </div>
          </div>
          <p className="text-[9px] font-semibold text-text-muted pt-1">THIS WEEK</p>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-danger/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={14} className="text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-primary">Dark Store Closure</p>
              <p className="text-[10px] text-text-secondary">Koramangala — Local strike</p>
              <p className="text-[9px] text-text-muted">Mar 8, 2:15 PM</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-success">+₹600</p>
              <p className="text-[10px] text-primary">+200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── PROFILE TAB (Enhanced) ──────────────────────────
function ProfileTab({ onBack, onLogout, setActiveTab, workerId, onEnableDevicePush, profileData, loading }) {
  const { isDark, toggleTheme } = useTheme()
  const handleLogout = () => {
    onLogout?.()
  }
  const worker = profileData?.profile?.worker
  const zone = profileData?.profile?.zone
  const history = profileData?.history
  const points = profileData?.points
  const ml = profileData?.ml
  const initials = (worker?.name || 'R').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  const memberSince = worker?.memberSince
    ? new Date(worker.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Jan 2026'
  const infoRows = [
    ['Mobile', worker?.mobile || '+91 98765 43210'],
    ['Platform', worker?.platform || 'Zepto'],
    ['Zone', zone ? `${zone.id}, ${zone.city}` : 'HSR-01, Bangalore'],
    ['Shift', worker?.shiftPattern ? `${worker.shiftPattern} (${worker.avgDailyHours || 8} hrs)` : 'Full Day (10 hrs)'],
    ['Member Since', memberSince],
    ['UPI', worker?.upiId || ml?.worker?.upi_id || 'ravi@okicici'],
  ]

  return (
    <div className="space-y-3.5 mt-2">
      <h2 className="text-lg font-bold text-text-primary">Profile</h2>

      <div className="glass rounded-2xl p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h3 className="text-base font-bold text-text-primary">{worker?.name || 'Ravi Kumar'}</h3>
          <p className="text-xs text-text-secondary">{worker?.platform || 'Zepto'} Partner · {zone?.name || 'HSR Layout'}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[12px]">🏆</span>
            <p className="text-[10px] text-primary font-semibold">{points?.tier?.name || 'Reliable'} · {points?.balance ?? worker?.points ?? 2450} pts</p>
          </div>
          {loading && <p className="text-[10px] text-text-muted mt-2">Refreshing live worker details...</p>}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Claims', value: String(history?.claims?.length ?? 0), bg: 'bg-success/10', color: 'text-success' },
          { label: 'Points', value: String(points?.balance ?? worker?.points ?? 0), bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Streak', value: `${worker?.streakWeeks ?? 0}w`, bg: 'bg-warning/10', color: 'text-warning' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <p className={`text-[17px] font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-3.5">
        <SectionLabel>Achievements</SectionLabel>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { emoji: '🛡️', label: `${points?.tier?.name || 'Starter'} Tier`, bg: 'bg-primary/10' },
            { emoji: '🔥', label: `${worker?.streakWeeks ?? 0}w Streak`, bg: 'bg-warning/10' },
            { emoji: '💰', label: `${history?.summary?.roiPercent ?? 0}% ROI`, bg: 'bg-success/10' },
            { emoji: '👥', label: `${worker?.referralCount ?? 0} Referrals`, bg: 'bg-accent/10' },
            { emoji: '⚡', label: ml?.insights?.predictedRisk !== null && ml?.insights?.predictedRisk !== undefined ? `${Math.round(ml.insights.predictedRisk * 100)}% Risk` : 'ML Ready', bg: 'bg-danger/10' },
          ].map((a, i) => (
            <div key={i} className={`flex-shrink-0 w-[68px] ${a.bg} rounded-xl p-2.5 text-center`}>
              <span className="text-lg">{a.emoji}</span>
              <p className="text-[9px] text-text-muted mt-1 font-medium">{a.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-3.5 space-y-2">
        {infoRows.map(([k, v], i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-primary">{v}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-3.5 space-y-2">
        <SectionLabel>ML Insights</SectionLabel>
        {[
          ['Predicted Risk', ml?.insights?.predictedRisk !== null && ml?.insights?.predictedRisk !== undefined ? `${(ml.insights.predictedRisk * 100).toFixed(1)}%` : 'Not available'],
          ['Estimated Weekly Price', ml?.insights?.estimatedWeeklyPrice !== null && ml?.insights?.estimatedWeeklyPrice !== undefined ? `Rs ${ml.insights.estimatedWeeklyPrice}` : 'Not available'],
          ['Protected Income', history?.summary?.weeklyProtectedIncome !== undefined ? `Rs ${history.summary.weeklyProtectedIncome}` : 'Rs 0'],
        ].map(([k, v], i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-primary">{v}</span>
          </div>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="glass rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isDark ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-warning" />}
          <div>
            <p className="text-sm font-semibold text-text-primary">Dark Mode</p>
            <p className="text-[10px] text-text-secondary">{isDark ? 'Dark bluish theme active' : 'Light theme active'}</p>
          </div>
        </div>
        <button onClick={toggleTheme}
                className={`w-11 h-6 rounded-full transition-all relative ${isDark ? 'bg-primary' : 'bg-dark-border'}`}>
          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-[3px] transition-all ${isDark ? 'right-[3px]' : 'left-[3px]'}`} style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div className="glass rounded-2xl p-3 space-y-2">
        {[
          { label: 'Phone / lock-screen alerts', icon: Bell, action: async () => {
            try {
              const r = await onEnableDevicePush?.()
              if (r?.ok) alert('Lock-screen alerts are on. You will get zone and cover updates here.')
              else if (r?.reason === 'permission_denied') alert('Enable notifications in your browser settings, then tap this again.')
              else if (r?.reason === 'vapid_not_configured') alert('Server push keys are not set (WEB_PUSH_* in backend .env). In-app history still works.')
              else alert(r?.reason ? `Could not enable: ${r.reason}` : 'Could not enable alerts right now.')
            } catch {
              alert('Could not enable alerts.')
            }
          } },
          { label: 'Notification Settings', icon: BellRing, action: () => setActiveTab('home') },
          { label: 'Payment Methods', icon: CreditCard, action: () => setActiveTab('policy') },
          { label: 'Language / भाषा', icon: Languages, action: () => {} },
          { label: 'Help & Support', icon: Headphones, action: () => {} },
          { label: 'Emergency Contact', icon: Phone, action: () => { window.location.href = 'tel:112' } },
          { label: 'Download My Data', icon: Download, action: async () => { try { const text = await apiFetch(`/api/workers/${workerId}/certificate`); const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'gigshield-data.txt'; a.click(); URL.revokeObjectURL(url); } catch { alert('Could not download data.') } } },
        ].map((item, i) => (
          <button key={i} onClick={item.action} className="w-full flex items-center justify-between py-1.5 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2.5">
              <item.icon size={14} className="text-text-muted" />
              <span className="text-xs text-text-primary">{item.label}</span>
            </div>
            <ChevronRight size={12} className="text-text-muted" />
          </button>
        ))}
      </div>

      <button onClick={onBack} className="w-full py-2.5 bg-dark-card border border-dark-border rounded-2xl text-text-secondary font-medium text-xs">
        ← Back to Landing Page
      </button>

      <button onClick={handleLogout} className="w-full py-2.5 bg-danger/10 border border-danger/25 rounded-2xl text-danger font-medium text-xs">
        Log Out
      </button>
    </div>
  )
}
