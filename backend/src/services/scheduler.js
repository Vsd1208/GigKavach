import { store } from "../store.js";
import { persistStore } from "../db.js";
import { getCoverageGap, getWorkerPolicy, runZoneMonitor } from "./domain.js";
import { sendPush, sendSms } from "./integrations.js";

let intervals = [];

function dispatchDueReminders() {
  let changed = false;
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
    changed = true;
  }
  return changed;
}

async function persistSchedulerChanges(task) {
  try {
    const changed = await task();
    if (changed) await persistStore();
  } catch (error) {
    console.error("Scheduled GigShield task failed:", error);
  }
}

export function startSchedulers() {
  if (intervals.length) return;
  intervals.push(setInterval(() => persistSchedulerChanges(() => runZoneMonitor().length > 0), 5 * 60 * 1000));
  intervals.push(setInterval(() => persistSchedulerChanges(() => dispatchDueReminders()), 60 * 1000));
}

export function stopSchedulers() {
  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];
}
