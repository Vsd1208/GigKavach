import { store } from "../store.js";

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

export function sendSms({ workerId, message }) {
  const worker = store.workers.find((item) => item.id === workerId);
  const notification = {
    id: `NTF-${String(store.notifications.length + 1).padStart(3, "0")}`,
    workerId,
    channel: "sms",
    type: "reminder",
    sentAt: new Date().toISOString(),
    status: "sent",
    message
  };
  store.notifications.unshift(notification);
  return {
    provider: "twilio-mock",
    to: worker?.mobile ?? "unknown",
    status: "queued",
    sid: `SMS-${Date.now()}`,
    notification
  };
}

export function sendPush({ workerId, message }) {
  const notification = {
    id: `NTF-${String(store.notifications.length + 1).padStart(3, "0")}`,
    workerId,
    channel: "push",
    type: "reminder",
    sentAt: new Date().toISOString(),
    status: "sent",
    message
  };
  store.notifications.unshift(notification);
  return {
    provider: "web-push-mock",
    workerId,
    status: "queued",
    notification
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
