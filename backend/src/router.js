import {
  buildAdminAnalytics,
  buildAdminOverview,
  buildForecastDashboard,
  buildGigBotReply,
  buildLoyaltyMonitor,
  buildWorkerDashboard,
  buyPolicy,
  calculatePremium,
  captureRazorpayPayment,
  confirmReferral,
  createOrUpdatePaymentMandate,
  createRazorpayOrder,
  createOrUpdateWorkerProfile,
  createPoolMotion,
  createReferral,
  evaluateFraud,
  getNotifications,
  getPaymentState,
  generateCertificate,
  generateCertificatePdf,
  generateClaimStatement,
  getCoverageGap,
  getTier,
  getWorker,
  getWorkerPolicy,
  getZonePool,
  getZoneSignals,
  getZone,
  issueOtp,
  listPlans,
  listReferrals,
  processClaimPayout,
  reviewFraudCase,
  runSimulator,
  runZoneMonitor,
  sendManualNotification,
  toggleAutoRenew,
  verifyOtp,
  votePoolMotion,
  workerClaims,
  workerHistorySummary
} from "./services/domain.js";
import { getDatabaseState, persistStore } from "./db.js";
import { store } from "./store.js";
import { createError, readJson, sendBuffer, sendJson, sendText } from "./utils/http.js";

function routeMatch(pathname, pattern) {
  const pathParts = pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index];
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(pathParts[index]);
      continue;
    }
    if (part !== pathParts[index]) return null;
  }
  return params;
}

function renderHomePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GigShield Backend</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Arial, sans-serif;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #f4f7fb 0%, #dfe9f3 100%);
        color: #123;
      }

      main {
        width: min(680px, calc(100vw - 32px));
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 20px 60px rgba(18, 35, 51, 0.12);
      }

      h1 {
        margin: 0 0 12px;
        font-size: 2rem;
      }

      p {
        margin: 0 0 20px;
        line-height: 1.6;
      }

      .links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      a {
        text-decoration: none;
        color: white;
        background: #1f6feb;
        padding: 10px 14px;
        border-radius: 10px;
        font-weight: 600;
      }

      code {
        background: #eef3f8;
        padding: 2px 6px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>GigShield Backend Is Running</h1>
      <p>The API server is up. Use <code>/health</code> for a health check and <code>/api</code> endpoints for backend data.</p>
      <div class="links">
        <a href="/health">Open Health Check</a>
        <a href="/api/plans">Open Sample API</a>
      </div>
    </main>
  </body>
</html>`;
}

export async function handleRequest(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const routes = [
    ["GET", "/", async () => {
      sendText(res, 200, renderHomePage(), "text/html; charset=utf-8");
      return null;
    }],
    ["GET", "/health", async () => ({ ok: true, service: "gigshield-backend", now: new Date().toISOString(), database: getDatabaseState() })],
    ["GET", "/api/plans", async () => ({ plans: listPlans() })],
    ["POST", "/api/auth/request-otp", async () => issueOtp((await readJson(req)).mobile)],
    ["POST", "/api/auth/verify-otp", async () => {
      const body = await readJson(req);
      return verifyOtp(body.mobile, body.otp);
    }],
    ["POST", "/api/workers/onboarding", async () => createOrUpdateWorkerProfile(await readJson(req))],
    ["GET", "/api/workers/:workerId/dashboard", async ({ workerId }) => buildWorkerDashboard(workerId)],
    ["GET", "/api/workers/:workerId/policy", async ({ workerId }) => {
      const worker = getWorker(workerId);
      const zone = getZone(worker.zoneId);
      const policy = getWorkerPolicy(workerId);
      return {
        policy,
        pricingPreview: ["basic", "pro", "elite"].map((planId) => calculatePremium(planId, zone.riskScore, worker.points)),
        forecast: buildWorkerDashboard(workerId).forecast,
        payment: getPaymentState(workerId)
      };
    }],
    ["POST", "/api/workers/:workerId/policies/purchase", async ({ workerId }) => buyPolicy(workerId, await readJson(req))],
    ["GET", "/api/workers/:workerId/payments", async ({ workerId }) => getPaymentState(workerId)],
    ["POST", "/api/workers/:workerId/payments/checkout", async ({ workerId }) => createRazorpayOrder(workerId, await readJson(req))],
    ["POST", "/api/workers/:workerId/payments/verify", async ({ workerId }) => captureRazorpayPayment(workerId, await readJson(req))],
    ["POST", "/api/workers/:workerId/payments/mandate", async ({ workerId }) => createOrUpdatePaymentMandate(workerId, await readJson(req))],
    ["PATCH", "/api/workers/:workerId/policy/auto-renew", async ({ workerId }) => toggleAutoRenew(workerId, (await readJson(req)).autoRenew)],
    ["GET", "/api/workers/:workerId/history", async ({ workerId }) => ({
      summary: workerHistorySummary(workerId),
      claims: workerClaims(workerId),
      zoneHistory: store.disruptionEvents.filter((item) => item.zoneId === getWorker(workerId).zoneId).slice(0, 10),
      lifetimeProtection: store.lifetimeProtection[workerId] ?? []
    })],
    ["GET", "/api/workers/:workerId/points", async ({ workerId }) => {
      const worker = getWorker(workerId);
      return {
        balance: worker.points,
        tier: getTier(worker.points),
        ledger: store.pointsLedger.filter((item) => item.workerId === workerId),
        milestones: [
          { points: 2500, reward: "10% waiver + priority payout" },
          { points: 5000, reward: "1 free week every 13 weeks" },
          { points: 7500, reward: "Rs 500 top-up" }
        ]
      };
    }],
    ["GET", "/api/workers/:workerId/profile", async ({ workerId }) => ({ worker: getWorker(workerId), zone: getZone(getWorker(workerId).zoneId) })],
    ["GET", "/api/workers/:workerId/coverage-gap", async ({ workerId }) => ({ coverageGap: getCoverageGap(workerId) })],
    ["GET", "/api/workers/:workerId/notifications", async ({ workerId }) => ({ notifications: getNotifications(workerId) })],
    ["POST", "/api/workers/:workerId/notifications/send", async ({ workerId }) => {
      const body = await readJson(req);
      return sendManualNotification(workerId, body.channel ?? "push", body.message ?? "GigShield alert");
    }],
    ["GET", "/api/workers/:workerId/referrals", async ({ workerId }) => ({ referrals: listReferrals(workerId) })],
    ["POST", "/api/workers/:workerId/referrals", async ({ workerId }) => createReferral(workerId, await readJson(req))],
    ["GET", "/api/workers/:workerId/pool", async ({ workerId }) => ({ pool: getZonePool(getWorker(workerId).zoneId) })],
    ["POST", "/api/workers/:workerId/pool/motions", async ({ workerId }) => createPoolMotion(workerId, await readJson(req))],
    ["POST", "/api/workers/:workerId/gigbot", async ({ workerId }) => buildGigBotReply(workerId, (await readJson(req)).message ?? "")],
    ["POST", "/api/workers/:workerId/payouts/process", async ({ workerId }) => processClaimPayout(workerId, (await readJson(req)).eventId)],
    ["GET", "/api/workers/:workerId/certificate", async ({ workerId }) => {
      if (url.searchParams.get("format") === "text") {
        sendText(res, 200, generateCertificate(workerId));
        return null;
      }
      const pdf = await generateCertificatePdf(workerId);
      sendBuffer(res, 200, pdf, "application/pdf", `gigshield-certificate-${workerId}.pdf`);
      return null;
    }],
    ["GET", "/api/workers/:workerId/claims/:claimId/statement", async ({ workerId, claimId }) => {
      sendText(res, 200, generateClaimStatement(workerId, claimId));
      return null;
    }],
    ["GET", "/api/admin/overview", async () => buildAdminOverview()],
    ["GET", "/api/admin/zones", async () => ({ zones: store.zones })],
    ["GET", "/api/admin/zones/:zoneId/signals", async ({ zoneId }) => getZoneSignals(zoneId)],
    ["GET", "/api/admin/live-feed", async () => ({ liveFeed: store.liveFeed })],
    ["GET", "/api/admin/analytics", async () => buildAdminAnalytics()],
    ["GET", "/api/admin/fraud-cases", async () => ({ fraudCases: store.fraudCases.map((item) => ({ ...item, worker: getWorker(item.workerId).name })) })],
    ["POST", "/api/admin/fraud-cases/:caseId/decision", async ({ caseId }) => reviewFraudCase(caseId, (await readJson(req)).decision)],
    ["POST", "/api/admin/simulator", async () => runSimulator(await readJson(req))],
    ["GET", "/api/admin/forecast", async () => ({ zones: buildForecastDashboard() })],
    ["GET", "/api/admin/loyalty", async () => buildLoyaltyMonitor()],
    ["GET", "/api/admin/pools", async () => ({ pools: store.zonePools })],
    ["GET", "/api/admin/pools/:zoneId", async ({ zoneId }) => getZonePool(zoneId)],
    ["POST", "/api/admin/pools/motions/:motionId/vote", async ({ motionId }) => votePoolMotion(motionId, (await readJson(req)).vote ?? "for")],
    ["POST", "/api/admin/referrals/:referralId/confirm", async ({ referralId }) => confirmReferral(referralId)],
    ["POST", "/api/system/monitor/run", async () => ({ events: runZoneMonitor() })],
    ["POST", "/api/system/fraud/evaluate", async () => {
      const body = await readJson(req);
      return evaluateFraud(body.workerId, body.eventId);
    }]
  ];

  for (const [method, pattern, handler] of routes) {
    if (method !== req.method) continue;
    const params = routeMatch(url.pathname, pattern);
    if (!params) continue;
    const result = await handler(params);
    if (!["GET", "OPTIONS"].includes(req.method)) {
      await persistStore();
    }
    if (result !== null) sendJson(res, 200, result);
    return;
  }

  throw createError(404, `Route not found: ${req.method} ${url.pathname}`);
}
