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

## Run

```powershell
node src/server.js
```

The server starts on `http://localhost:4000` by default.

## Config

Copy `.env.example` if you want to override the port.
