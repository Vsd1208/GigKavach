# GigShield Backend

Backend scaffold for the GigShield demo described in the root README.

## What it includes

- Worker auth flow with OTP simulation
- Onboarding with nearest-zone detection
- Dynamic weekly pricing and 7-day premium forecast
- Policy purchase and auto-renew toggle
- Worker dashboard, history, points, coverage-gap, certificate, and claim statement endpoints
- Admin overview, zones, live feed, analytics, fraud console, loyalty, pool monitor, and simulator endpoints
- Zone monitor and fraud evaluation utilities
- Mocked integrations for weather, AQI, payouts, SMS, push, and GigBot model calls
- Background schedulers for trigger polling and reminder dispatch
- Optional Postgres persistence for runtime policies, payments, claims, workers, fraud cases, pool votes, referrals, notifications, and seed/demo data

## Run

```powershell
node src/server.js
```

The server starts on `http://localhost:4000` by default.

## Config

Copy `.env.example` if you want to override the port or enable Postgres.

```powershell
PORT=4000
DATABASE_URL=postgres://user:password@host:5432/gigshield
PGSSLMODE=require
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

If `DATABASE_URL` is omitted, the backend uses the in-memory seed store. If `DATABASE_URL` is set, startup creates the table in `db/schema.sql`, seeds it on first run, hydrates the app store on later runs, and persists changes after mutating API requests and scheduled jobs.

Hosted Postgres providers such as Neon, Supabase, Render, and Railway usually require SSL. Set `PGSSLMODE=require` or `DATABASE_SSL=true` for those environments.

## Static Demo Data

The static demo dataset lives in `src/data/seed.js`. It includes:

- Plan catalog: Basic, Pro, and Elite Shield
- Five Bangalore zones with weather, AQI, flood, curfew, and dark-store signals
- Demo workers, active/lapsed policies, Razorpay test payment records, and UPI mandates
- Claims, disruption events, fraud-review cases, live feed entries, points ledger, referrals, reminders, notifications, and collective pool motions

When `DATABASE_URL` is set, the backend copies that static data into Postgres on the first startup. You can also seed manually:

```powershell
npm run db:seed
```

To replace existing persisted demo data with the static seed data:

```powershell
npm run db:reset
```
