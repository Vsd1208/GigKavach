import twilio from "twilio";
import webpush from "web-push";
import { store } from "../store.js";

let vapidConfigured = false;

export function getWebPushPublicKey() {
  return process.env.WEB_PUSH_PUBLIC_KEY?.trim() || null;
}

function ensureWebPushVapid() {
  if (vapidConfigured) return true;
  const pub = getWebPushPublicKey();
  const priv = process.env.WEB_PUSH_PRIVATE_KEY?.trim();
  if (!pub || !priv) return false;
  webpush.setVapidDetails(
    process.env.WEB_PUSH_SUBJECT?.trim() || "mailto:gigshield@example.com",
    pub,
    priv
  );
  vapidConfigured = true;
  return true;
}

function nextNotificationId() {
  return `NTF-${String(store.notifications.length + 1).padStart(3, "0")}`;
}

function pushSubsForWorker(workerId) {
  return store.pushSubscriptions.filter((s) => s.workerId === workerId);
}

async function deliverWebPushToDevices(worker, title, body, data = {}) {
  if (!ensureWebPushVapid()) {
    return { attempted: false, reason: "vapid_not_configured" };
  }
  if (worker?.notifications?.push === false) {
    return { attempted: false, reason: "worker_opted_out" };
  }
  const subs = pushSubsForWorker(worker.id);
  if (!subs.length) {
    return { attempted: false, reason: "no_device_subscriptions" };
  }
  const payload = JSON.stringify({
    title: title || "GigShield",
    body,
    tag: "gigshield",
    renotify: true,
    data: { url: "/", ...data }
  });
  const results = [];
  for (const sub of subs) {
    const pushSub = { endpoint: sub.endpoint, keys: sub.keys };
    try {
      await webpush.sendNotification(pushSub, payload, { TTL: 86_400 });
      results.push({ ok: true });
    } catch (err) {
      console.warn("[web-push]", err?.message || err);
      const code = err?.statusCode;
      if (code === 404 || code === 410) {
        store.pushSubscriptions = store.pushSubscriptions.filter((s) => s.endpoint !== sub.endpoint);
      }
      results.push({ ok: false });
    }
  }
  return { attempted: true, results };
}

export async function sendSms({ workerId, message }) {
  const worker = store.workers.find((item) => item.id === workerId);
  const notification = {
    id: nextNotificationId(),
    workerId,
    channel: "sms",
    type: "alert",
    sentAt: new Date().toISOString(),
    status: "sent",
    message
  };
  store.notifications.unshift(notification);

  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();

  let twilioSid = null;
  if (sid && token && from && worker?.mobile && worker?.notifications?.sms !== false) {
    try {
      const client = twilio(sid, token);
      const msg = await client.messages.create({
        body: String(message).slice(0, 1600),
        from,
        to: worker.mobile
      });
      twilioSid = msg.sid;
    } catch (err) {
      console.warn("[twilio] SMS failed:", err?.message || err);
    }
  }

  return {
    provider: twilioSid ? "twilio" : "twilio-mock",
    to: worker?.mobile ?? "unknown",
    status: twilioSid ? "delivered" : "queued",
    sid: twilioSid ?? `SMS-${Date.now()}`,
    notification
  };
}

export async function sendPush({ workerId, message, title, type = "alert" }) {
  const worker = store.workers.find((item) => item.id === workerId);
  const displayTitle = title || "GigShield";
  const notification = {
    id: nextNotificationId(),
    workerId,
    channel: "push",
    type,
    title: displayTitle,
    sentAt: new Date().toISOString(),
    status: "sent",
    message
  };
  store.notifications.unshift(notification);

  let pushDelivery = { attempted: false };
  try {
    pushDelivery = await deliverWebPushToDevices(worker, displayTitle, message, { workerId, type });
  } catch (err) {
    console.warn("[sendPush] delivery error:", err?.message || err);
  }

  return {
    provider: pushDelivery.attempted ? "web-push" : "in-app-only",
    workerId,
    notification,
    devicePush: pushDelivery
  };
}

export function getWeatherSnapshot(zone) {
  return {
    provider: "openweathermap-mock",
    rainfallMmPerHr: zone.metrics.rainfall,
    temperatureC: zone.metrics.temperature,
    fetchedAt: new Date().toISOString()
  };
}

export function getAqiSnapshot(zone) {
  return {
    provider: "waqi-mock",
    aqi: zone.metrics.aqi,
    fetchedAt: new Date().toISOString()
  };
}

export function getGroundSignal(zone) {
  return {
    provider: "news-ground-mock",
    trafficIndex: zone.metrics.trafficIndex,
    darkStoreClosed: zone.platformSignals.darkStoreClosed,
    floodAlert: zone.platformSignals.floodAlert,
    curfew: zone.platformSignals.curfew
  };
}

export function simulatePayout({ workerId, amount, reason }) {
  const worker = store.workers.find((item) => item.id === workerId);
  return {
    provider: "razorpay-sandbox-mock",
    workerId,
    upiId: worker?.upiId ?? "unknown@upi",
    amount,
    reason,
    status: "processed",
    referenceId: `RZP-${Date.now()}`
  };
}

export function askGigBotModel({ worker, message, contextSummary }) {
  return {
    provider: "claude-sonnet-4-6-mock",
    workerId: worker.id,
    message,
    contextSummary,
    generatedAt: new Date().toISOString()
  };
}
