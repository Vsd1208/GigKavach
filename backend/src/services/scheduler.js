import { store } from "../store.js";
import { getCoverageGap, getWorkerPolicy, runZoneMonitor } from "./domain.js";
import { sendPush, sendSms } from "./integrations.js";

let intervals = [];

function dispatchDueReminders() {
  const now = Date.now();
  for (const reminder of store.reminders) {
    if (reminder.dispatchedAt) continue;
    if (Date.parse(reminder.scheduledAt) > now) continue;
    const workerPolicy = getWorkerPolicy(reminder.workerId);
    const coverageGap = getCoverageGap(reminder.workerId);
    const enrichedMessage = [
      reminder.message,
      workerPolicy ? `Plan: ${workerPolicy.planId.toUpperCase()}` : "Policy inactive",
      coverageGap ? `Coverage gap risk: Rs ${coverageGap.wouldHaveReceived}` : null
    ].filter(Boolean).join(" | ");

    if (reminder.channel === "sms") sendSms({ workerId: reminder.workerId, message: enrichedMessage });
    else sendPush({ workerId: reminder.workerId, message: enrichedMessage });

    reminder.dispatchedAt = new Date().toISOString();
  }
}

export function startSchedulers() {
  if (intervals.length) return;
  intervals.push(setInterval(() => runZoneMonitor(), 5 * 60 * 1000));
  intervals.push(setInterval(() => dispatchDueReminders(), 60 * 1000));
}

export function stopSchedulers() {
  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];
}
