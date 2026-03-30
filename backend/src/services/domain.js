import { store } from "../store.js";
import { createError } from "../utils/http.js";
import { clamp, haversineDistanceMeters, roundCurrency } from "../utils/math.js";
import { askGigBotModel, getAqiSnapshot, getGroundSignal, getWeatherSnapshot, sendPush, sendSms, simulatePayout } from "./integrations.js";

const triggerDefinitions = [
  { key: "rainfall", label: "Heavy Rain", threshold: ">15 mm/hr", check: (zone) => zone.metrics.rainfall > 15, sustainedMinutes: 10 },
  { key: "temperature", label: "Extreme Heat", threshold: ">43 C", check: (zone) => zone.metrics.temperature > 43, sustainedMinutes: 10 },
  { key: "aqi", label: "Severe AQI", threshold: ">300", check: (zone) => zone.metrics.aqi > 300, sustainedMinutes: 10 },
  { key: "flash_flood", label: "Flash Flood Alert", threshold: "alert issued", check: (zone) => zone.platformSignals.floodAlert, sustainedMinutes: 0 },
  { key: "dark_store_closure", label: "Dark Store Closure", threshold: "closure flag", check: (zone) => zone.platformSignals.darkStoreClosed, sustainedMinutes: 0 },
  { key: "curfew", label: "Local Curfew", threshold: "curfew issued", check: (zone) => zone.platformSignals.curfew, sustainedMinutes: 0 }
];

export function listPlans() {
  return store.planCatalog;
}

export function getWorker(workerId) {
  const worker = store.workers.find((item) => item.id === workerId);
  if (!worker) throw createError(404, `Worker ${workerId} not found`);
  return worker;
}

export function getZone(zoneId) {
  const zone = store.zones.find((item) => item.id === zoneId);
  if (!zone) throw createError(404, `Zone ${zoneId} not found`);
  return zone;
}

export function getPlan(planId) {
  const plan = store.planCatalog.find((item) => item.id === planId);
  if (!plan) throw createError(404, `Plan ${planId} not found`);
  return plan;
}

export function getWorkerPolicy(workerId) {
  return store.policies.find((item) => item.workerId === workerId && item.status === "active")
    ?? store.policies.find((item) => item.workerId === workerId)
    ?? null;
}

export function getTier(points) {
  if (points >= 5000) return { name: "Champion", discountPercent: 15 };
  if (points >= 2500) return { name: "Veteran", discountPercent: 10 };
  if (points >= 1000) return { name: "Reliable", discountPercent: 5 };
  return { name: "Starter", discountPercent: 0 };
}

export function calculatePremium(planId, riskScore, points) {
  const plan = getPlan(planId);
  const adjusted = roundCurrency(plan.basePremium * (1 + 0.3 * (riskScore - 0.5)));
  const tier = getTier(points);
  const loyaltyDiscountAmount = roundCurrency(adjusted * (tier.discountPercent / 100));
  return {
    plan,
    riskScore: Number(riskScore.toFixed(2)),
    premiumBase: plan.basePremium,
    premiumAdjusted: adjusted,
    loyaltyDiscountPercent: tier.discountPercent,
    loyaltyDiscountAmount,
    finalPremium: adjusted - loyaltyDiscountAmount,
    tier
  };
}

export function getZoneStatus(zone) {
  if (zone.platformSignals.darkStoreClosed || zone.platformSignals.curfew || zone.platformSignals.floodAlert || zone.metrics.rainfall > 15 || zone.metrics.aqi > 300 || zone.metrics.temperature > 43) {
    return "disrupted";
  }
  if (zone.metrics.rainfall >= 12 || zone.metrics.aqi >= 180 || zone.riskScore >= 0.65) return "watch";
  return "safe";
}

export function findNearestZone(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return store.zones[0];
  return [...store.zones]
    .map((zone) => ({ zone, distance: haversineDistanceMeters(lat, lng, zone.center.lat, zone.center.lng) }))
    .sort((a, b) => a.distance - b.distance)[0].zone;
}

export function buildPremiumForecast(zoneId, planId) {
  const zone = getZone(zoneId);
  const plan = getPlan(planId);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const seasonalSignals = [0.08, 0.09, 0.14, 0.11, 0.06, 0.02, 0.03];

  return dayLabels.map((day, index) => {
    const weatherRisk = zone.rainfallHistory[index] ?? zone.riskScore;
    const aqiRisk = clamp(zone.metrics.aqi / 400, 0, 1);
    const historicalRisk = clamp(zone.riskScore + seasonalSignals[index] - 0.04, 0, 1);
    const groundRisk = clamp(zone.metrics.trafficIndex + seasonalSignals[index], 0, 1);
    const composite = clamp(0.35 * weatherRisk + 0.3 * aqiRisk + 0.25 * historicalRisk + 0.1 * groundRisk, 0, 1);
    return {
      day,
      riskScore: Number(composite.toFixed(2)),
      premium: roundCurrency(plan.basePremium * (1 + 0.4 * (composite - 0.5))),
      trend: composite > 0.6 ? "rising" : composite > 0.4 ? "stable" : "falling",
      label: composite >= 0.75 ? "Critical" : composite >= 0.6 ? "High" : composite >= 0.4 ? "Med" : "Low",
      primaryDriver: weatherRisk >= aqiRisk ? "Rainfall forecast" : "AQI trend"
    };
  });
}

export function evaluateFraud(workerId, eventId) {
  const worker = getWorker(workerId);
  const event = store.disruptionEvents.find((item) => item.id === eventId);
  if (!event) throw createError(404, `Event ${eventId} not found`);
  const zone = getZone(worker.zoneId);
  const distanceMeters = haversineDistanceMeters(worker.currentLocation.lat, worker.currentLocation.lng, zone.center.lat, zone.center.lng);
  const gps = distanceMeters <= zone.radiusMeters;
  const activity = worker.deliveriesLast30Min >= 1;
  const session = Math.abs(Date.parse(worker.lastSeenAt) - Date.parse(event.triggeredAt)) <= 10 * 60 * 1000;
  const duplicate = !store.claims.some((claim) => claim.workerId === workerId && claim.eventId === eventId);
  const score = Number(([gps, activity, session, duplicate].filter(Boolean).length / 4).toFixed(2));
  return { gps, activity, session, duplicate, score, distanceMeters: Math.round(distanceMeters), autoApproved: score >= 0.75 };
}

export function workerClaims(workerId) {
  return store.claims.filter((item) => item.workerId === workerId).sort((a, b) => Date.parse(b.triggeredAt) - Date.parse(a.triggeredAt));
}

export function workerHistorySummary(workerId) {
  const policyRecords = store.policies.filter((policy) => policy.workerId === workerId);
  const claimRecords = workerClaims(workerId);
  const premiumsPaid = policyRecords.reduce((sum, item) => sum + item.finalPremium, 0);
  const payoutsReceived = claimRecords.reduce((sum, item) => sum + item.payoutAmount, 0);
  return {
    premiumsPaid,
    payoutsReceived,
    netSavings: payoutsReceived - premiumsPaid,
    roiPercent: premiumsPaid ? Math.round((payoutsReceived / premiumsPaid) * 100) : 0,
    weeklyProtectedIncome: claimRecords.slice(0, 2).reduce((sum, item) => sum + item.payoutAmount, 0),
    weeklyPointsEarned: store.pointsLedger.filter((item) => item.workerId === workerId).reduce((sum, item) => sum + item.points, 0),
    weeklyTriggerCount: claimRecords.slice(0, 2).length
  };
}

export function workerTimeline(workerId) {
  const policy = getWorkerPolicy(workerId);
  const claimItems = workerClaims(workerId).map((claim) => ({
    type: "claim",
    title: `${claim.type.toUpperCase()} Trigger`,
    at: claim.triggeredAt,
    amount: claim.payoutAmount,
    points: claim.pointsAwarded,
    zoneId: claim.zoneId,
    claimId: claim.id
  }));
  const policyItems = policy ? [{ type: "policy", title: "Policy Active", at: policy.startsAt, amount: 0, points: 0, policyId: policy.id }] : [];
  return [...claimItems, ...policyItems].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

export function getCoverageGap(workerId) {
  const worker = getWorker(workerId);
  const latestZoneEvent = store.disruptionEvents
    .filter((event) => event.zoneId === worker.zoneId)
    .sort((a, b) => Date.parse(b.triggeredAt) - Date.parse(a.triggeredAt))[0];
  const policy = getWorkerPolicy(workerId);
  if (!latestZoneEvent || (policy && policy.status === "active")) return null;
  return {
    zoneEventId: latestZoneEvent.id,
    wouldHaveReceived: getPlan("pro").payoutPerDay,
    wouldHaveEarnedPoints: 300,
    policyLapsedAt: policy?.endsAt ?? null,
    renewNowPrice: calculatePremium("pro", getZone(worker.zoneId).riskScore, worker.points).finalPremium
  };
}

export function buildWorkerDashboard(workerId) {
  const worker = getWorker(workerId);
  const zone = getZone(worker.zoneId);
  const policy = getWorkerPolicy(workerId);
  const plan = policy ? getPlan(policy.planId) : null;
  return {
    worker: {
      id: worker.id,
      name: worker.name,
      mobile: worker.mobile,
      platform: worker.platform,
      memberSince: worker.memberSince,
      avgDailyHours: worker.avgDailyHours,
      shiftPattern: worker.shiftPattern,
      upiId: worker.upiId
    },
    zone: {
      id: zone.id,
      name: zone.name,
      city: zone.city,
      darkStore: zone.darkStore,
      radiusMeters: zone.radiusMeters,
      riskScore: zone.riskScore,
      status: getZoneStatus(zone),
      metrics: zone.metrics,
      activeWorkers: zone.activeWorkers
    },
    policy: policy && plan ? {
      ...policy,
      planName: plan.name,
      payoutPerDay: plan.payoutPerDay,
      coverageHours: plan.coverageHours,
      daysRemaining: Math.max(0, Math.ceil((Date.parse(policy.endsAt) - Date.now()) / (24 * 60 * 60 * 1000)))
    } : null,
    loyalty: {
      points: worker.points,
      streakWeeks: worker.streakWeeks,
      referralCount: worker.referralCount,
      tier: getTier(worker.points)
    },
    savings: workerHistorySummary(workerId),
    forecast: buildPremiumForecast(worker.zoneId, policy?.planId ?? "pro"),
    timeline: workerTimeline(workerId).slice(0, 8),
    upcomingReminders: store.reminders.filter((item) => item.workerId === workerId),
    coverageGap: getCoverageGap(workerId)
  };
}

export function buyPolicy(workerId, payload) {
  const worker = getWorker(workerId);
  const zone = getZone(worker.zoneId);
  const { planId = "pro", autoRenew = true, upiId } = payload;
  const pricing = calculatePremium(planId, zone.riskScore, worker.points);
  const now = new Date();
  const policy = {
    id: `POL-${new Date().getFullYear()}-${String(store.policies.length + 1).padStart(4, "0")}`,
    workerId,
    planId,
    status: "active",
    autoRenew: Boolean(autoRenew),
    startsAt: now.toISOString(),
    endsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    premiumBase: pricing.premiumBase,
    premiumAdjusted: pricing.premiumAdjusted,
    loyaltyDiscount: pricing.loyaltyDiscountPercent,
    finalPremium: pricing.finalPremium,
    certificateId: `GS-${new Date().getFullYear()}-${worker.zoneId}-${String(store.policies.length + 300).padStart(5, "0")}`
  };

  store.policies.forEach((item) => {
    if (item.workerId === workerId && item.status === "active") item.status = "replaced";
  });
  if (upiId) worker.upiId = upiId;
  worker.points += 50;
  store.pointsLedger.unshift({
    id: `PTS-${String(store.pointsLedger.length + 1).padStart(3, "0")}`,
    workerId,
    action: "Policy purchase",
    points: 50,
    at: now.toISOString()
  });
  store.policies.unshift(policy);
  return { policy, pricing };
}

export function toggleAutoRenew(workerId, autoRenew) {
  const policy = getWorkerPolicy(workerId);
  if (!policy) throw createError(404, "No policy found for worker");
  policy.autoRenew = Boolean(autoRenew);
  return policy;
}

export function issueOtp(mobile) {
  const code = "1234";
  store.otps.set(mobile, { code, issuedAt: Date.now() });
  return { mobile, otp: code, expiresInSeconds: 300 };
}

export function verifyOtp(mobile, otp) {
  const record = store.otps.get(mobile);
  if (!record || record.code !== otp) throw createError(401, "Invalid OTP");
  const worker = store.workers.find((item) => item.mobile === mobile) ?? null;
  return { verified: true, workerId: worker?.id ?? null, isNewUser: !worker };
}

export function createOrUpdateWorkerProfile({ mobile, name, platform, lat, lng, avgDailyHours, shiftPattern, upiId }) {
  let worker = store.workers.find((item) => item.mobile === mobile);
  const nearestZone = findNearestZone(Number(lat), Number(lng));
  if (!worker) {
    worker = {
      id: `WRK-${String(store.workers.length + 1).padStart(3, "0")}`,
      name: name ?? "New Partner",
      mobile,
      platform: platform ?? "Zepto",
      zoneId: nearestZone.id,
      avgDailyHours: Number(avgDailyHours) || 8,
      shiftPattern: shiftPattern ?? "Full Day",
      currentLocation: { lat: Number(lat) || nearestZone.center.lat, lng: Number(lng) || nearestZone.center.lng },
      deliveriesLast30Min: 1,
      lastSeenAt: new Date().toISOString(),
      points: 100,
      streakWeeks: 0,
      referralCount: 0,
      memberSince: new Date().toISOString().slice(0, 10),
      upiId: upiId ?? "partner@upi",
      notifications: { push: true, sms: true },
      profileCompleted: true
    };
    store.workers.push(worker);
  } else {
    worker.name = name ?? worker.name;
    worker.platform = platform ?? worker.platform;
    worker.zoneId = nearestZone.id;
    worker.avgDailyHours = Number(avgDailyHours) || worker.avgDailyHours;
    worker.shiftPattern = shiftPattern ?? worker.shiftPattern;
    worker.currentLocation = { lat: Number(lat) || worker.currentLocation.lat, lng: Number(lng) || worker.currentLocation.lng };
    worker.upiId = upiId ?? worker.upiId;
    worker.profileCompleted = true;
  }
  return { worker, zone: nearestZone, pricing: calculatePremium("pro", nearestZone.riskScore, worker.points) };
}

export function buildGigBotReply(workerId, message) {
  const worker = getWorker(workerId);
  const lower = message.toLowerCase();
  const latestClaim = workerClaims(workerId)[0];
  const latestPolicy = getWorkerPolicy(workerId);
  const latestZone = getZone(worker.zoneId);
  const isHindi = /kyu|kyun|mera|mere|paise|kab|claim|renew|policy|payout/.test(lower) && /[a-z]/.test(lower);
  const modelTrace = askGigBotModel({
    worker,
    message,
    contextSummary: {
      zoneId: latestZone.id,
      activePolicyId: latestPolicy?.id ?? null,
      latestClaimId: latestClaim?.id ?? null,
      points: worker.points
    }
  });

  let reply;
  if (lower.includes("reject")) {
    const fraudCase = store.fraudCases.find((item) => item.workerId === workerId) ?? store.fraudCases[0];
    reply = isHindi
      ? `Aapke claim rejection ka reason validation mismatch tha. GPS ${fraudCase.validation.gps ? "pass" : "fail"} hua, activity ${fraudCase.validation.activity ? "pass" : "fail"} hui, aur score ${fraudCase.validation.score} raha.`
      : `Your claim was rejected because the validation score was ${fraudCase.validation.score}. GPS ${fraudCase.validation.gps ? "passed" : "failed"} and activity ${fraudCase.validation.activity ? "passed" : "failed"}.`;
  } else if (lower.includes("claim") || lower.includes("payout") || lower.includes("paise")) {
    reply = isHindi
      ? `Agar trigger sustain hota hai aur policy active hai, payout 60 seconds ke andar ${worker.upiId} par jata hai. Aapka latest payout Rs ${latestClaim?.payoutAmount ?? 0} tha.`
      : `If a trigger is sustained and your policy is active, the payout goes to ${worker.upiId} in under 60 seconds. Your latest payout was Rs ${latestClaim?.payoutAmount ?? 0}.`;
  } else if (lower.includes("renew") || lower.includes("policy")) {
    reply = isHindi
      ? `Aapki current policy ${latestPolicy?.endsAt ?? "inactive"} tak valid hai. Auto-renew ${latestPolicy?.autoRenew ? "ON" : "OFF"} hai. Next estimate Rs ${calculatePremium(latestPolicy?.planId ?? "pro", latestZone.riskScore, worker.points).finalPremium} hai.`
      : `Your current policy is valid until ${latestPolicy?.endsAt ?? "inactive"}. Auto-renew is ${latestPolicy?.autoRenew ? "ON" : "OFF"}, and the next weekly estimate is Rs ${calculatePremium(latestPolicy?.planId ?? "pro", latestZone.riskScore, worker.points).finalPremium}.`;
  } else if (lower.includes("point")) {
    reply = isHindi
      ? `Aapke paas ${worker.points} GigPoints hain aur aap ${getTier(worker.points).name} tier mein hain.`
      : `You have ${worker.points} GigPoints and are currently in the ${getTier(worker.points).name} tier.`;
  } else {
    reply = isHindi
      ? "GigShield heavy rain, AQI, extreme heat, flash flood, dark store closure aur curfew cover karta hai. Main claim status, renewals, payouts aur points mein help kar sakta hoon."
      : "GigShield covers heavy rain, severe AQI, extreme heat, flash flood alerts, dark store closure, and curfew disruptions. I can help with claims, renewals, payouts, and points.";
  }

  return { reply, suggestedActions: ["View Policy", "Check Claim Status", "Open Points Wallet"], modelTrace };
}

export function summariseZoneDistribution() {
  return store.zones.reduce((acc, zone) => {
    acc[getZoneStatus(zone)] = (acc[getZoneStatus(zone)] ?? 0) + 1;
    return acc;
  }, { safe: 0, watch: 0, disrupted: 0 });
}

export function buildAdminOverview() {
  const activePolicies = store.policies.filter((item) => item.status === "active");
  const todayClaims = store.claims.filter((item) => item.triggeredAt.startsWith("2026-03-30"));
  const totalPremiums = activePolicies.reduce((sum, item) => sum + item.finalPremium, 0);
  const totalPayouts = todayClaims.reduce((sum, item) => sum + item.payoutAmount, 0);
  return {
    stats: {
      activeWorkers: new Set(activePolicies.map((item) => item.workerId)).size,
      weeklyPremiums: totalPremiums,
      claimsToday: todayClaims.length,
      totalPayouts,
      lossRatio: totalPremiums ? Number((totalPayouts / totalPremiums).toFixed(2)) : 0,
      fraudRate: Number((store.fraudCases.length / Math.max(store.claims.length + store.fraudCases.length, 1)).toFixed(2))
    },
    weeklyPayouts: store.weeklyPayouts,
    zoneDistribution: summariseZoneDistribution(),
    activeZones: store.zones.map((zone) => ({
      id: zone.id,
      name: zone.name,
      status: getZoneStatus(zone),
      risk: zone.riskScore,
      workers: zone.activeWorkers,
      rainfall: zone.metrics.rainfall,
      aqi: zone.metrics.aqi,
      temp: zone.metrics.temperature
    }))
  };
}

export function buildAdminAnalytics() {
  return {
    weeklyPayouts: store.weeklyPayouts,
    eventBreakdown: triggerDefinitions.map((trigger) => ({
      type: trigger.key,
      count: store.disruptionEvents.filter((event) => event.type === trigger.key).length
    })),
    zoneLossRatios: store.zones.map((zone) => {
      const premiums = store.policies.filter((policy) => getWorker(policy.workerId).zoneId === zone.id).reduce((sum, item) => sum + item.finalPremium, 0);
      const payouts = store.claims.filter((claim) => claim.zoneId === zone.id).reduce((sum, item) => sum + item.payoutAmount, 0);
      return { zoneId: zone.id, zoneName: zone.name, premiums, payouts, lossRatio: premiums ? Number((payouts / premiums).toFixed(2)) : 0 };
    })
  };
}

export function buildLoyaltyMonitor() {
  const tierCounts = store.workers.reduce((acc, worker) => {
    const tier = getTier(worker.points).name;
    acc[tier] = (acc[tier] ?? 0) + 1;
    return acc;
  }, {});
  return {
    totals: {
      totalPointsIssued: store.pointsLedger.reduce((sum, item) => sum + item.points, 0),
      activeEarners: new Set(store.pointsLedger.map((item) => item.workerId)).size,
      avgPointsPerWorker: Math.round(store.workers.reduce((sum, item) => sum + item.points, 0) / store.workers.length)
    },
    tierCounts,
    leaders: [...store.workers].sort((a, b) => b.points - a.points).slice(0, 5).map((worker) => ({
      workerId: worker.id,
      name: worker.name,
      zoneId: worker.zoneId,
      points: worker.points,
      streakWeeks: worker.streakWeeks,
      tier: getTier(worker.points).name
    })),
    recentRedemptions: [
      { worker: "Suresh K.", reward: "1 free week", cost: "5,000 pts", time: "Today" },
      { worker: "Priya M.", reward: "Rs 500 coverage top-up", cost: "7,500 pts", time: "Yesterday" },
      { worker: "Group: HSR-01", reward: "Zone milestone cashback", cost: "20+ enrolled", time: "This week" }
    ]
  };
}

export function buildForecastDashboard() {
  return store.zones.map((zone) => ({ zoneId: zone.id, zoneName: zone.name, forecast: buildPremiumForecast(zone.id, "pro") }));
}

export function runSimulator({ rainfall = 15, aqi = 200, activeWorkers = 100 }) {
  const affectedWorkers = Math.round(activeWorkers * ((rainfall > 15 ? 0.4 : rainfall > 10 ? 0.15 : 0) + (aqi > 300 ? 0.3 : aqi > 200 ? 0.1 : 0)));
  const estimatedPayout = affectedWorkers * 600;
  const premiumPool = activeWorkers * 99;
  return {
    rainfall,
    aqi,
    activeWorkers,
    affectedWorkers,
    estimatedPayout,
    premiumPool,
    lossRatio: premiumPool ? Number((estimatedPayout / premiumPool).toFixed(2)) : 0,
    reinsurerTriggered: premiumPool ? estimatedPayout / premiumPool > 1.5 : false
  };
}

export function reviewFraudCase(caseId, decision) {
  const fraudCase = store.fraudCases.find((item) => item.id === caseId);
  if (!fraudCase) throw createError(404, `Fraud case ${caseId} not found`);
  fraudCase.status = decision;
  fraudCase.reviewedAt = new Date().toISOString();
  return fraudCase;
}

export function runZoneMonitor() {
  const newEvents = [];
  for (const zone of store.zones) {
    const matchingTriggers = triggerDefinitions.filter((trigger) => trigger.check(zone));
    zone.status = matchingTriggers.length ? "disrupted" : "safe";
    for (const trigger of matchingTriggers) {
      const duplicate = store.disruptionEvents.some((event) => event.zoneId === zone.id && event.type === trigger.key && Date.now() - Date.parse(event.triggeredAt) < 30 * 60 * 1000);
      if (duplicate) continue;
      const event = {
        id: `EVT-${zone.id}-${trigger.key.toUpperCase()}-${Date.now()}`,
        zoneId: zone.id,
        type: trigger.key,
        parameter: trigger.label,
        measuredValue: trigger.key === "rainfall" ? zone.metrics.rainfall : trigger.key === "aqi" ? zone.metrics.aqi : trigger.key === "temperature" ? zone.metrics.temperature : 1,
        threshold: trigger.threshold,
        sustainedMinutes: trigger.sustainedMinutes,
        triggeredAt: new Date().toISOString(),
        durationHours: 2,
        affectedWorkers: zone.activeWorkers,
        totalPayout: 0
      };
      store.disruptionEvents.unshift(event);
      store.liveFeed.unshift({
        id: `LIVE-${store.liveFeed.length + 1}`,
        time: event.triggeredAt,
        zoneId: zone.id,
        event: `${trigger.label} detected`,
        claims: 0,
        payout: 0,
        status: trigger.sustainedMinutes ? "monitoring" : "auto-approved",
        type: trigger.key
      });
      if (!trigger.sustainedMinutes) {
        const workersInZone = store.workers.filter((worker) => worker.zoneId === zone.id);
        for (const worker of workersInZone) {
          sendPush({ workerId: worker.id, message: `${trigger.label} active in ${zone.name}. Policy status is being checked.` });
        }
      }
      newEvents.push(event);
    }
  }
  return newEvents;
}

export function generateCertificate(workerId) {
  const worker = getWorker(workerId);
  const policy = getWorkerPolicy(workerId);
  if (!policy) throw createError(404, "No policy found for certificate");
  const zone = getZone(worker.zoneId);
  const plan = getPlan(policy.planId);
  return [
    "GIGSHIELD POLICY CERTIFICATE",
    "",
    `Certificate ID: ${policy.certificateId}`,
    `Policy ID: ${policy.id}`,
    `Holder: ${worker.name}`,
    `Zone: ${zone.name}, ${zone.city}`,
    `Plan: ${plan.name}`,
    `Coverage: Rs ${plan.payoutPerDay}/disruption day`,
    `Valid: ${policy.startsAt} -> ${policy.endsAt}`,
    `Premium Paid: Rs ${policy.finalPremium}`,
    `Tier: ${getTier(worker.points).name}`,
    "",
    "Covered Triggers:",
    "- Rainfall > 15 mm/hr (10 min)",
    "- AQI > 300 (10 min)",
    "- Temperature > 43 C (10 min)",
    "- Dark Store Closure",
    "- Flash Flood Alert",
    "- Local Curfew"
  ].join("\n");
}

export function generateClaimStatement(workerId, claimId) {
  const worker = getWorker(workerId);
  const claim = store.claims.find((item) => item.id === claimId && item.workerId === workerId);
  if (!claim) throw createError(404, `Claim ${claimId} not found for worker ${workerId}`);
  const zone = getZone(claim.zoneId);
  return [
    `CLAIM STATEMENT - ${claim.id}`,
    "",
    `Event: ${claim.type}`,
    `Zone: ${zone.name}`,
    `Triggered: ${claim.triggeredAt}`,
    `Validated: ${claim.validatedAt}`,
    `Payout: Rs ${claim.payoutAmount}`,
    "",
    "Validation Summary:",
    `- GPS in zone: ${claim.validation.gps ? "PASS" : "FAIL"} (${claim.validation.distanceMeters}m from center)`,
    `- Active recently: ${claim.validation.activity ? "PASS" : "FAIL"}`,
    `- App logged in: ${claim.validation.session ? "PASS" : "FAIL"}`,
    `- No duplicate: ${claim.validation.duplicate ? "PASS" : "FAIL"}`,
    "",
    `Payment: UPI - ${worker.upiId}`,
    `GigPoints: +${claim.pointsAwarded}`,
    `Status: ${claim.status.toUpperCase()}`
  ].join("\n");
}

export function getZoneSignals(zoneId) {
  const zone = getZone(zoneId);
  return {
    zoneId,
    weather: getWeatherSnapshot(zone),
    aqi: getAqiSnapshot(zone),
    ground: getGroundSignal(zone),
    evaluatedStatus: getZoneStatus(zone)
  };
}

export function getNotifications(workerId) {
  return store.notifications.filter((item) => item.workerId === workerId);
}

export function sendManualNotification(workerId, channel, message) {
  if (channel === "sms") return sendSms({ workerId, message });
  return sendPush({ workerId, message });
}

export function createReferral(referrerWorkerId, payload) {
  getWorker(referrerWorkerId);
  const referral = {
    id: `REF-${String(store.referrals.length + 1).padStart(3, "0")}`,
    referrerWorkerId,
    referredName: payload.referredName,
    referredMobile: payload.referredMobile,
    status: "pending",
    rewardPoints: 0,
    discountAmount: 0,
    createdAt: new Date().toISOString()
  };
  store.referrals.unshift(referral);
  return referral;
}

export function listReferrals(workerId) {
  return store.referrals.filter((item) => item.referrerWorkerId === workerId);
}

export function confirmReferral(referralId) {
  const referral = store.referrals.find((item) => item.id === referralId);
  if (!referral) throw createError(404, `Referral ${referralId} not found`);
  if (referral.status === "confirmed") return referral;
  referral.status = "confirmed";
  referral.rewardPoints = 500;
  referral.discountAmount = 50;
  const worker = getWorker(referral.referrerWorkerId);
  worker.points += 500;
  store.pointsLedger.unshift({
    id: `PTS-${String(store.pointsLedger.length + 1).padStart(3, "0")}`,
    workerId: worker.id,
    action: `Referral: ${referral.referredName}`,
    points: 500,
    at: new Date().toISOString()
  });
  return referral;
}

export function getZonePool(zoneId) {
  const pool = store.zonePools.find((item) => item.zoneId === zoneId);
  if (!pool) throw createError(404, `Pool for zone ${zoneId} not found`);
  return {
    ...pool,
    motions: store.poolMotions.filter((motion) => motion.zoneId === zoneId)
  };
}

export function createPoolMotion(workerId, payload) {
  const worker = getWorker(workerId);
  const motion = {
    id: `PLM-${String(store.poolMotions.length + 1).padStart(3, "0")}`,
    zoneId: worker.zoneId,
    workerId,
    reason: payload.reason,
    requestedAmount: Number(payload.requestedAmount),
    votesFor: 1,
    votesAgainst: 0,
    status: "review",
    createdAt: new Date().toISOString()
  };
  store.poolMotions.unshift(motion);
  return motion;
}

export function votePoolMotion(motionId, vote) {
  const motion = store.poolMotions.find((item) => item.id === motionId);
  if (!motion) throw createError(404, `Pool motion ${motionId} not found`);
  if (vote === "for") motion.votesFor += 1;
  else motion.votesAgainst += 1;
  const pool = store.zonePools.find((item) => item.zoneId === motion.zoneId);
  if (pool && motion.votesFor > pool.members / 2 && motion.status !== "approved") {
    motion.status = "approved";
    pool.balance = Math.max(0, pool.balance - motion.requestedAmount);
    pool.lifetimeDisbursed += motion.requestedAmount;
  } else if (pool && motion.votesAgainst >= pool.members / 2) {
    motion.status = "rejected";
  }
  return motion;
}

export function processClaimPayout(workerId, eventId) {
  const worker = getWorker(workerId);
  const event = store.disruptionEvents.find((item) => item.id === eventId);
  if (!event) throw createError(404, `Event ${eventId} not found`);
  const policy = getWorkerPolicy(workerId);
  if (!policy || policy.status !== "active") throw createError(409, "Worker does not have an active policy");
  const validation = evaluateFraud(workerId, eventId);
  if (!validation.autoApproved) throw createError(409, "Fraud checks failed", validation);
  const plan = getPlan(policy.planId);
  const payment = simulatePayout({ workerId, amount: plan.payoutPerDay, reason: event.type });
  const claim = {
    id: `CLM-${String(store.claims.length + 1).padStart(4, "0")}`,
    eventId,
    workerId,
    zoneId: worker.zoneId,
    type: event.type,
    triggeredAt: event.triggeredAt,
    validatedAt: new Date().toISOString(),
    payoutAmount: plan.payoutPerDay,
    pointsAwarded: 300,
    status: "settled",
    validation
  };
  store.claims.unshift(claim);
  worker.points += 300;
  event.totalPayout += plan.payoutPerDay;
  sendSms({ workerId, message: `Rs ${plan.payoutPerDay} credited - ${event.type} trigger, ${worker.zoneId}.` });
  return { claim, payment };
}
