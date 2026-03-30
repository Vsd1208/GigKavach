import {
  PLAN_CATALOG,
  claims,
  disruptionEvents,
  fraudCases,
  lifetimeProtection,
  liveFeed,
  notifications,
  otps,
  pointsLedger,
  policies,
  poolMotions,
  reminders,
  referrals,
  weeklyPayouts,
  workers,
  zonePools,
  zones
} from "./data/seed.js";

export const store = {
  planCatalog: PLAN_CATALOG,
  zones,
  workers,
  policies,
  claims,
  disruptionEvents,
  fraudCases,
  liveFeed,
  weeklyPayouts,
  lifetimeProtection,
  pointsLedger,
  zonePools,
  reminders,
  notifications,
  referrals,
  poolMotions,
  otps
};
