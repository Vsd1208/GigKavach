export const PLAN_CATALOG = [
  { id: "basic", name: "Basic Shield", basePremium: 49, payoutPerDay: 300, coverageHours: 6 },
  { id: "pro", name: "Pro Shield", basePremium: 99, payoutPerDay: 600, coverageHours: 10 },
  { id: "elite", name: "Elite Shield", basePremium: 149, payoutPerDay: 1000, coverageHours: 14 }
];

export const zones = [
  {
    id: "HSR-01",
    name: "HSR Layout",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.9116, lng: 77.6389 },
    radiusMeters: 2500,
    riskScore: 0.74,
    metrics: { rainfall: 7, aqi: 158, temperature: 31, trafficIndex: 0.44 },
    status: "watch",
    activeWorkers: 34,
    darkStore: "Zepto HSR #14",
    rainfallHistory: [0.62, 0.66, 0.71, 0.74, 0.72, 0.68, 0.7]
  },
  {
    id: "KOR-02",
    name: "Koramangala",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: true, curfew: false, floodAlert: false },
    center: { lat: 12.9352, lng: 77.6245 },
    radiusMeters: 2400,
    riskScore: 0.68,
    metrics: { rainfall: 5, aqi: 168, temperature: 32, trafficIndex: 0.49 },
    status: "disrupted",
    activeWorkers: 28,
    darkStore: "Blinkit Koramangala #07",
    rainfallHistory: [0.55, 0.58, 0.64, 0.68, 0.63, 0.56, 0.54]
  },
  {
    id: "IND-03",
    name: "Indiranagar",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.9784, lng: 77.6408 },
    radiusMeters: 2200,
    riskScore: 0.45,
    metrics: { rainfall: 1, aqi: 118, temperature: 30, trafficIndex: 0.38 },
    status: "safe",
    activeWorkers: 22,
    darkStore: "Swiggy Instamart Indiranagar #03",
    rainfallHistory: [0.36, 0.39, 0.42, 0.45, 0.43, 0.41, 0.37]
  },
  {
    id: "WF-04",
    name: "Whitefield",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.9698, lng: 77.75 },
    radiusMeters: 2800,
    riskScore: 0.22,
    metrics: { rainfall: 0, aqi: 92, temperature: 29, trafficIndex: 0.33 },
    status: "safe",
    activeWorkers: 18,
    darkStore: "Zepto Whitefield #04",
    rainfallHistory: [0.17, 0.19, 0.21, 0.22, 0.23, 0.2, 0.18]
  },
  {
    id: "BTM-05",
    name: "BTM Layout",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: true },
    center: { lat: 12.9166, lng: 77.6101 },
    radiusMeters: 2600,
    riskScore: 0.81,
    metrics: { rainfall: 18, aqi: 198, temperature: 28, trafficIndex: 0.56 },
    status: "disrupted",
    activeWorkers: 40,
    darkStore: "Zepto BTM #19",
    rainfallHistory: [0.76, 0.8, 0.85, 0.81, 0.79, 0.77, 0.75]
  },
  {
    id: "JP-06",
    name: "JP Nagar",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.9063, lng: 77.5857 },
    radiusMeters: 2300,
    riskScore: 0.36,
    metrics: { rainfall: 2, aqi: 105, temperature: 30, trafficIndex: 0.35 },
    status: "safe",
    activeWorkers: 26,
    darkStore: "Blinkit JP Nagar #12",
    rainfallHistory: [0.28, 0.3, 0.33, 0.36, 0.34, 0.32, 0.29]
  },
  {
    id: "MTH-07",
    name: "Marathahalli",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.9591, lng: 77.6974 },
    radiusMeters: 2700,
    riskScore: 0.58,
    metrics: { rainfall: 4, aqi: 196, temperature: 32, trafficIndex: 0.51 },
    status: "watch",
    activeWorkers: 31,
    darkStore: "Zepto Marathahalli #08",
    rainfallHistory: [0.48, 0.52, 0.55, 0.58, 0.56, 0.53, 0.5]
  },
  {
    id: "EC-08",
    name: "Electronic City",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.8456, lng: 77.6603 },
    radiusMeters: 3200,
    riskScore: 0.29,
    metrics: { rainfall: 0, aqi: 88, temperature: 31, trafficIndex: 0.41 },
    status: "safe",
    activeWorkers: 45,
    darkStore: "Swiggy Instamart Electronic City #21",
    rainfallHistory: [0.22, 0.24, 0.26, 0.29, 0.28, 0.25, 0.23]
  },
  {
    id: "YLK-09",
    name: "Yelahanka",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 13.1007, lng: 77.5963 },
    radiusMeters: 2900,
    riskScore: 0.52,
    metrics: { rainfall: 0, aqi: 132, temperature: 44.2, trafficIndex: 0.37 },
    status: "disrupted",
    activeWorkers: 19,
    darkStore: "Blinkit Yelahanka #05",
    rainfallHistory: [0.44, 0.47, 0.5, 0.52, 0.51, 0.48, 0.46]
  },
  {
    id: "JYN-10",
    name: "Jayanagar",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.925, lng: 77.5938 },
    radiusMeters: 2100,
    riskScore: 0.41,
    metrics: { rainfall: 3, aqi: 112, temperature: 30, trafficIndex: 0.34 },
    status: "safe",
    activeWorkers: 24,
    darkStore: "Zepto Jayanagar 4th Block #11",
    rainfallHistory: [0.34, 0.37, 0.39, 0.41, 0.4, 0.38, 0.35]
  },
  {
    id: "CVR-11",
    name: "CV Raman Nagar",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 12.985, lng: 77.654 },
    radiusMeters: 2200,
    riskScore: 0.47,
    metrics: { rainfall: 13, aqi: 128, temperature: 29, trafficIndex: 0.4 },
    status: "watch",
    activeWorkers: 16,
    darkStore: "Blinkit DRDO/CV Raman #02",
    rainfallHistory: [0.38, 0.42, 0.45, 0.47, 0.46, 0.44, 0.41]
  },
  {
    id: "RAJ-12",
    name: "Rajajinagar",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: true, floodAlert: false },
    center: { lat: 12.9915, lng: 77.5544 },
    radiusMeters: 2400,
    riskScore: 0.55,
    metrics: { rainfall: 1, aqi: 142, temperature: 31, trafficIndex: 0.39 },
    status: "disrupted",
    activeWorkers: 21,
    darkStore: "Swiggy Instamart Rajajinagar #09",
    rainfallHistory: [0.46, 0.49, 0.52, 0.55, 0.53, 0.5, 0.48]
  },
  {
    id: "BAN-13",
    name: "Banaswadi",
    city: "Bangalore",
    platformSignals: { darkStoreClosed: false, curfew: false, floodAlert: false },
    center: { lat: 13.0358, lng: 77.5975 },
    radiusMeters: 2300,
    riskScore: 0.48,
    metrics: { rainfall: 2, aqi: 318, temperature: 30, trafficIndex: 0.43 },
    status: "disrupted",
    activeWorkers: 27,
    darkStore: "Zepto Banaswadi Ring Rd #16",
    rainfallHistory: [0.4, 0.43, 0.46, 0.48, 0.47, 0.44, 0.42]
  }
];

export const workers = [
  {
    id: "WRK-001",
    name: "Ravi Kumar",
    mobile: "+919876543210",
    platform: "Zepto",
    zoneId: "HSR-01",
    avgDailyHours: 10,
    shiftPattern: "Full Day",
    currentLocation: { lat: 12.919, lng: 77.641 },
    deliveriesLast30Min: 3,
    lastSeenAt: "2026-03-30T11:39:00.000Z",
    points: 2450,
    streakWeeks: 7,
    referralCount: 3,
    memberSince: "2026-01-06",
    upiId: "ravi@okicici",
    notifications: { push: true, sms: true },
    profileCompleted: true
  },
  {
    id: "WRK-002",
    name: "Priya M.",
    mobile: "+919900001111",
    platform: "Blinkit",
    zoneId: "BTM-05",
    avgDailyHours: 9,
    shiftPattern: "Afternoon",
    currentLocation: { lat: 12.9172, lng: 77.6085 },
    deliveriesLast30Min: 2,
    lastSeenAt: "2026-03-30T11:37:00.000Z",
    points: 5400,
    streakWeeks: 10,
    referralCount: 1,
    memberSince: "2026-01-03",
    upiId: "priya@oksbi",
    notifications: { push: true, sms: false },
    profileCompleted: true
  },
  {
    id: "WRK-003",
    name: "Arjun D.",
    mobile: "+919800007777",
    platform: "Zepto",
    zoneId: "KOR-02",
    avgDailyHours: 8,
    shiftPattern: "Morning",
    currentLocation: { lat: 12.9351, lng: 77.6244 },
    deliveriesLast30Min: 0,
    lastSeenAt: "2026-03-30T09:55:00.000Z",
    points: 1800,
    streakWeeks: 5,
    referralCount: 0,
    memberSince: "2026-02-02",
    upiId: "arjun@okhdfc",
    notifications: { push: true, sms: true },
    profileCompleted: true
  },
  {
    id: "WRK-004",
    name: "Vikram S.",
    mobile: "+919700004444",
    platform: "Zepto",
    zoneId: "HSR-01",
    avgDailyHours: 6,
    shiftPattern: "Morning",
    currentLocation: { lat: 12.98, lng: 77.71 },
    deliveriesLast30Min: 0,
    lastSeenAt: "2026-03-30T10:40:00.000Z",
    points: 400,
    streakWeeks: 0,
    referralCount: 0,
    memberSince: "2026-03-01",
    upiId: "vikram@paytm",
    notifications: { push: true, sms: true },
    profileCompleted: true
  }
];

export const policies = [
  {
    id: "POL-2026-0001",
    workerId: "WRK-001",
    planId: "pro",
    status: "active",
    autoRenew: true,
    startsAt: "2026-03-24T00:00:00.000Z",
    endsAt: "2026-03-31T00:00:00.000Z",
    premiumBase: 99,
    premiumAdjusted: 106,
    loyaltyDiscount: 5,
    finalPremium: 101,
    certificateId: "GS-2026-HSR-00342"
  },
  {
    id: "POL-2026-0002",
    workerId: "WRK-002",
    planId: "elite",
    status: "active",
    autoRenew: true,
    startsAt: "2026-03-24T00:00:00.000Z",
    endsAt: "2026-03-31T00:00:00.000Z",
    premiumBase: 149,
    premiumAdjusted: 163,
    loyaltyDiscount: 15,
    finalPremium: 139,
    certificateId: "GS-2026-BTM-00101"
  },
  {
    id: "POL-2026-0003",
    workerId: "WRK-003",
    planId: "pro",
    status: "lapsed",
    autoRenew: false,
    startsAt: "2026-03-17T00:00:00.000Z",
    endsAt: "2026-03-24T00:00:00.000Z",
    premiumBase: 99,
    premiumAdjusted: 104,
    loyaltyDiscount: 5,
    finalPremium: 99,
    certificateId: "GS-2026-KOR-00118"
  }
];

export const paymentOrders = [
  {
    id: "order_demo_0001",
    workerId: "WRK-001",
    planId: "pro",
    amount: 10100,
    currency: "INR",
    status: "paid",
    upiId: "ravi@okicici",
    autoRenewRequested: true,
    provider: "razorpay-test-mode",
    createdAt: "2026-03-24T00:00:00.000Z",
    paidAt: "2026-03-24T00:00:08.000Z"
  }
];

export const paymentTransactions = [
  {
    id: "pay_demo_0001",
    orderId: "order_demo_0001",
    workerId: "WRK-001",
    amount: 10100,
    currency: "INR",
    method: "upi",
    upiId: "ravi@okicici",
    status: "captured",
    referenceId: "RZP-PAY-DEMO-0001",
    provider: "razorpay-test-mode",
    createdAt: "2026-03-24T00:00:08.000Z"
  }
];

export const paymentMandates = [
  {
    id: "mandate_demo_0001",
    workerId: "WRK-001",
    upiId: "ravi@okicici",
    status: "active",
    maxAmount: 15000,
    frequency: "weekly",
    provider: "razorpay-test-mode",
    createdAt: "2026-03-24T00:00:09.000Z",
    approvedAt: "2026-03-24T00:00:09.000Z"
  }
];

export const claims = [
  {
    id: "CLM-0892",
    eventId: "EVT-HSR-RAIN-20260330",
    workerId: "WRK-001",
    zoneId: "HSR-01",
    type: "rainfall",
    triggeredAt: "2026-03-30T11:40:00.000Z",
    validatedAt: "2026-03-30T11:41:00.000Z",
    payoutAmount: 600,
    pointsAwarded: 300,
    status: "settled",
    validation: {
      gps: true,
      activity: true,
      session: true,
      duplicate: true,
      score: 1,
      distanceMeters: 842
    }
  },
  {
    id: "CLM-0891",
    eventId: "EVT-HSR-AQI-20260329",
    workerId: "WRK-001",
    zoneId: "HSR-01",
    type: "aqi",
    triggeredAt: "2026-03-29T09:50:00.000Z",
    validatedAt: "2026-03-29T09:51:00.000Z",
    payoutAmount: 600,
    pointsAwarded: 300,
    status: "settled",
    validation: {
      gps: true,
      activity: true,
      session: true,
      duplicate: true,
      score: 1,
      distanceMeters: 801
    }
  }
];

export const disruptionEvents = [
  {
    id: "EVT-HSR-RAIN-20260330",
    zoneId: "HSR-01",
    type: "rainfall",
    parameter: "Rainfall mm/hr",
    measuredValue: 19,
    threshold: ">15 mm/hr",
    sustainedMinutes: 10,
    triggeredAt: "2026-03-30T11:40:00.000Z",
    durationHours: 4,
    affectedWorkers: 34,
    totalPayout: 20400
  },
  {
    id: "EVT-HSR-AQI-20260329",
    zoneId: "HSR-01",
    type: "aqi",
    parameter: "Air Quality Index",
    measuredValue: 320,
    threshold: ">300",
    sustainedMinutes: 10,
    triggeredAt: "2026-03-29T09:50:00.000Z",
    durationHours: 2,
    affectedWorkers: 31,
    totalPayout: 18600
  },
  {
    id: "EVT-KOR-CLOSURE-20260328",
    zoneId: "KOR-02",
    type: "dark_store_closure",
    parameter: "Platform closure flag",
    measuredValue: 1,
    threshold: "closure flag",
    sustainedMinutes: 0,
    triggeredAt: "2026-03-28T08:45:00.000Z",
    durationHours: 3,
    affectedWorkers: 28,
    totalPayout: 16800
  },
  {
    id: "EVT-BTM-FLOOD-20260327",
    zoneId: "BTM-05",
    type: "flash_flood",
    parameter: "IMD-style alert",
    measuredValue: 1,
    threshold: "alert issued",
    sustainedMinutes: 0,
    triggeredAt: "2026-03-27T14:05:00.000Z",
    durationHours: 6,
    affectedWorkers: 40,
    totalPayout: 24000
  },
  {
    id: "EVT-YLK-HEAT-20260326",
    zoneId: "YLK-09",
    type: "temperature",
    parameter: "Temperature °C",
    measuredValue: 44,
    threshold: ">43 C",
    sustainedMinutes: 10,
    triggeredAt: "2026-03-26T15:20:00.000Z",
    durationHours: 5,
    affectedWorkers: 19,
    totalPayout: 11400
  },
  {
    id: "EVT-RAJ-CURFEW-20260325",
    zoneId: "RAJ-12",
    type: "curfew",
    parameter: "District order",
    measuredValue: 1,
    threshold: "curfew issued",
    sustainedMinutes: 0,
    triggeredAt: "2026-03-25T19:00:00.000Z",
    durationHours: 8,
    affectedWorkers: 21,
    totalPayout: 12600
  },
  {
    id: "EVT-BAN-AQI-20260324",
    zoneId: "BAN-13",
    type: "aqi",
    parameter: "Air Quality Index",
    measuredValue: 322,
    threshold: ">300",
    sustainedMinutes: 10,
    triggeredAt: "2026-03-24T07:30:00.000Z",
    durationHours: 3,
    affectedWorkers: 27,
    totalPayout: 16200
  },
  {
    id: "EVT-MTH-RAIN-20260323",
    zoneId: "MTH-07",
    type: "rainfall",
    parameter: "Rainfall mm/hr",
    measuredValue: 17,
    threshold: ">15 mm/hr",
    sustainedMinutes: 10,
    triggeredAt: "2026-03-23T18:45:00.000Z",
    durationHours: 2,
    affectedWorkers: 31,
    totalPayout: 18600
  },
  {
    id: "EVT-EC-CLOSURE-20260322",
    zoneId: "EC-08",
    type: "dark_store_closure",
    parameter: "Platform closure flag",
    measuredValue: 1,
    threshold: "closure flag",
    sustainedMinutes: 0,
    triggeredAt: "2026-03-22T06:15:00.000Z",
    durationHours: 2,
    affectedWorkers: 45,
    totalPayout: 27000
  }
];

export const fraudCases = [
  {
    id: "FRD-001",
    workerId: "WRK-004",
    eventId: "EVT-HSR-RAIN-20260330",
    zoneId: "HSR-01",
    status: "blocked",
    reviewNotes: "GPS outside zone and no recent deliveries.",
    validation: { gps: false, activity: false, session: true, duplicate: true, score: 0.5, distanceMeters: 8241 }
  },
  {
    id: "FRD-002",
    workerId: "WRK-003",
    eventId: "EVT-KOR-CLOSURE-20260328",
    zoneId: "KOR-02",
    status: "review",
    reviewNotes: "Worker inactive at event time, no duplicate claim yet.",
    validation: { gps: true, activity: false, session: false, duplicate: true, score: 0.5, distanceMeters: 18 }
  },
  {
    id: "FRD-003",
    workerId: "WRK-002",
    eventId: "EVT-BTM-FLOOD-20260327",
    zoneId: "BTM-05",
    status: "review",
    reviewNotes: "GPS mismatch reported by last location snapshot.",
    validation: { gps: false, activity: true, session: true, duplicate: true, score: 0.75, distanceMeters: 2910 }
  }
];

export const liveFeed = [
  { id: "LIVE-001", time: "2026-03-30T11:41:00.000Z", zoneId: "HSR-01", event: "Rainfall 19 mm/hr (sustained)", claims: 34, payout: 20400, status: "auto-approved", type: "rainfall" },
  { id: "LIVE-002", time: "2026-03-30T11:40:00.000Z", zoneId: "HSR-01", event: "Sustained breach timer — 10 min window", claims: 0, payout: 0, status: "monitoring", type: "alert" },
  { id: "LIVE-003", time: "2026-03-30T10:50:00.000Z", zoneId: "BAN-13", event: "Severe AQI 318 — outdoor advisory", claims: 27, payout: 16200, status: "auto-approved", type: "aqi" },
  { id: "LIVE-004", time: "2026-03-30T10:15:00.000Z", zoneId: "KOR-02", event: "Dark store closure — inventory sync", claims: 28, payout: 16800, status: "auto-approved", type: "dark_store_closure" },
  { id: "LIVE-005", time: "2026-03-30T09:55:00.000Z", zoneId: "YLK-09", event: "Heat stress index high (44°C)", claims: 19, payout: 11400, status: "auto-approved", type: "temperature" },
  { id: "LIVE-006", time: "2026-03-30T09:30:00.000Z", zoneId: "RAJ-12", event: "Local curfew — district order", claims: 21, payout: 12600, status: "auto-approved", type: "curfew" },
  { id: "LIVE-007", time: "2026-03-30T09:00:00.000Z", zoneId: "BTM-05", event: "IMD flash flood corridor alert", claims: 40, payout: 24000, status: "auto-approved", type: "flash_flood" },
  { id: "LIVE-008", time: "2026-03-30T08:40:00.000Z", zoneId: "MTH-07", event: "AQI 196 — watch band", claims: 0, payout: 0, status: "monitoring", type: "aqi" },
  { id: "LIVE-009", time: "2026-03-30T08:15:00.000Z", zoneId: "CVR-11", event: "Steady rain 13 mm/hr — tracking", claims: 0, payout: 0, status: "monitoring", type: "rainfall" },
  { id: "LIVE-010", time: "2026-03-30T07:50:00.000Z", zoneId: "IND-03", event: "Telemetry heartbeat OK", claims: 0, payout: 0, status: "ok", type: "system" }
];

export const weeklyPayouts = [
  { week: "W1", premiums: 48000, payouts: 12000 },
  { week: "W2", premiums: 50000, payouts: 8000 },
  { week: "W3", premiums: 52000, payouts: 35000 },
  { week: "W4", premiums: 55000, payouts: 22000 },
  { week: "W5", premiums: 58000, payouts: 45000 },
  { week: "W6", premiums: 60000, payouts: 18000 },
  { week: "W7", premiums: 62000, payouts: 28000 },
  { week: "W8", premiums: 65000, payouts: 42000 }
];

export const lifetimeProtection = {
  "WRK-001": [
    { month: "Jan", premiums: 108, payouts: 0 },
    { month: "Feb", premiums: 108, payouts: 0 },
    { month: "Mar", premiums: 108, payouts: 1200 },
    { month: "Apr", premiums: 0, payouts: 0 },
    { month: "May", premiums: 108, payouts: 600 },
    { month: "Jun", premiums: 0, payouts: 0 }
  ]
};

export const pointsLedger = [
  { id: "PTS-001", workerId: "WRK-001", action: "Payout received", points: 200, at: "2026-03-30T11:41:00.000Z" },
  { id: "PTS-002", workerId: "WRK-001", action: "Active during disruption", points: 100, at: "2026-03-30T11:40:00.000Z" },
  { id: "PTS-003", workerId: "WRK-001", action: "Streak bonus (Week 7)", points: 75, at: "2026-03-29T18:00:00.000Z" },
  { id: "PTS-004", workerId: "WRK-001", action: "Policy renewal", points: 50, at: "2026-03-24T00:00:00.000Z" },
  { id: "PTS-005", workerId: "WRK-001", action: "Referral: Suresh M.", points: 500, at: "2026-03-21T14:00:00.000Z" }
];

export const zonePools = [
  { zoneId: "HSR-01", members: 34, weeklyContribution: 10, balance: 1240, contributionRate: 0.88, health: "strong", lifetimeDisbursed: 200 },
  { zoneId: "KOR-02", members: 24, weeklyContribution: 10, balance: 580, contributionRate: 0.76, health: "stable", lifetimeDisbursed: 120 },
  { zoneId: "IND-03", members: 20, weeklyContribution: 10, balance: 720, contributionRate: 0.91, health: "strong", lifetimeDisbursed: 0 },
  { zoneId: "WF-04", members: 16, weeklyContribution: 10, balance: 510, contributionRate: 0.84, health: "stable", lifetimeDisbursed: 80 },
  { zoneId: "BTM-05", members: 36, weeklyContribution: 12, balance: 890, contributionRate: 0.64, health: "watch", lifetimeDisbursed: 1240 },
  { zoneId: "JP-06", members: 25, weeklyContribution: 10, balance: 680, contributionRate: 0.87, health: "strong", lifetimeDisbursed: 40 },
  { zoneId: "MTH-07", members: 29, weeklyContribution: 10, balance: 540, contributionRate: 0.72, health: "stable", lifetimeDisbursed: 360 },
  { zoneId: "EC-08", members: 41, weeklyContribution: 10, balance: 1120, contributionRate: 0.82, health: "strong", lifetimeDisbursed: 600 },
  { zoneId: "YLK-09", members: 17, weeklyContribution: 10, balance: 420, contributionRate: 0.71, health: "watch", lifetimeDisbursed: 280 },
  { zoneId: "JYN-10", members: 23, weeklyContribution: 10, balance: 590, contributionRate: 0.85, health: "stable", lifetimeDisbursed: 0 },
  { zoneId: "CVR-11", members: 15, weeklyContribution: 10, balance: 380, contributionRate: 0.68, health: "watch", lifetimeDisbursed: 150 },
  { zoneId: "RAJ-12", members: 19, weeklyContribution: 10, balance: 455, contributionRate: 0.74, health: "stable", lifetimeDisbursed: 210 },
  { zoneId: "BAN-13", members: 26, weeklyContribution: 10, balance: 610, contributionRate: 0.69, health: "watch", lifetimeDisbursed: 420 }
];

export const reminders = [
  { workerId: "WRK-001", channel: "push", scheduledAt: "2026-04-03T12:30:00.000Z", label: "Friday reminder", message: "Your policy expires in 2 days. Renew now before HSR risk rises next week." },
  { workerId: "WRK-001", channel: "sms", scheduledAt: "2026-04-04T04:30:00.000Z", label: "Saturday reminder", message: "GigShield: Policy expires tomorrow. Renew now to keep your 7-week streak." },
  { workerId: "WRK-001", channel: "push", scheduledAt: "2026-04-05T12:30:00.000Z", label: "Sunday reminder", message: "6 hours left on your policy. Auto-renew is ON." }
];

export const notifications = [
  { id: "NTF-001", workerId: "WRK-001", channel: "push", type: "pre_disruption", sentAt: "2026-03-30T11:20:00.000Z", status: "sent", message: "Zone watch: rainfall approaching threshold in HSR Layout." },
  { id: "NTF-002", workerId: "WRK-001", channel: "sms", type: "payout", sentAt: "2026-03-30T11:41:00.000Z", status: "sent", message: "Rs 600 credited - Rainfall trigger, HSR Zone." }
];

export const referrals = [
  { id: "REF-001", referrerWorkerId: "WRK-001", referredName: "Suresh M.", referredMobile: "+919911110000", status: "confirmed", rewardPoints: 500, discountAmount: 50, createdAt: "2026-03-21T14:00:00.000Z" },
  { id: "REF-002", referrerWorkerId: "WRK-002", referredName: "Kiran P.", referredMobile: "+919822220000", status: "pending", rewardPoints: 0, discountAmount: 0, createdAt: "2026-03-29T08:30:00.000Z" }
];

export const poolMotions = [
  { id: "PLM-001", zoneId: "HSR-01", workerId: "WRK-001", reason: "Below-threshold rain income loss", requestedAmount: 200, votesFor: 19, votesAgainst: 6, status: "approved", createdAt: "2026-03-26T10:00:00.000Z" },
  { id: "PLM-002", zoneId: "KOR-02", workerId: "WRK-003", reason: "Borderline AQI disruption", requestedAmount: 150, votesFor: 7, votesAgainst: 8, status: "rejected", createdAt: "2026-03-24T09:00:00.000Z" }
];

export const pushSubscriptions = [];

export const otps = new Map();
