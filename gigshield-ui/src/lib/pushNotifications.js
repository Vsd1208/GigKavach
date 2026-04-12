import { apiFetch } from "./api";

function urlBase64ToUint8Array(base64String) {
  if (!base64String) return new Uint8Array();
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/**
 * Registers the GigShield service worker, requests notification permission,
 * subscribes to Web Push, and sends the subscription to the backend.
 * Requires WEB_PUSH_PUBLIC_KEY / WEB_PUSH_PRIVATE_KEY on the server.
 */
export async function registerGigShieldPush(workerId) {
  if (typeof window === "undefined" || !workerId) return { skipped: true, reason: "no_window" };
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { skipped: true, reason: "unsupported" };
  }

  let publicKey;
  try {
    const cfg = await apiFetch("/api/push/vapid-public-key");
    publicKey = cfg.publicKey;
  } catch {
    return { skipped: true, reason: "api_error" };
  }

  if (!publicKey) {
    return { skipped: true, reason: "vapid_not_configured" };
  }

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") {
    return { skipped: true, reason: "permission_denied" };
  }

  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await registration.update();

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    try {
      await apiFetch(`/api/workers/${workerId}/push/subscribe`, {
        method: "POST",
        body: JSON.stringify(existing.toJSON())
      });
      return { ok: true, renewed: true };
    } catch {
      await existing.unsubscribe().catch(() => {});
    }
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await apiFetch(`/api/workers/${workerId}/push/subscribe`, {
    method: "POST",
    body: JSON.stringify(subscription.toJSON())
  });

  return { ok: true };
}
