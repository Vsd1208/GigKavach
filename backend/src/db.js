import { Pool } from "pg";
import { store } from "./store.js";

const COLLECTIONS = [
  { name: "planCatalog", kind: "array", key: (item) => item.id },
  { name: "zones", kind: "array", key: (item) => item.id },
  { name: "workers", kind: "array", key: (item) => item.id },
  { name: "policies", kind: "array", key: (item) => item.id },
  { name: "claims", kind: "array", key: (item) => item.id },
  { name: "disruptionEvents", kind: "array", key: (item) => item.id },
  { name: "fraudCases", kind: "array", key: (item) => item.id },
  { name: "liveFeed", kind: "array", key: (item) => item.id },
  { name: "weeklyPayouts", kind: "array", key: (item, index) => item.week ?? String(index) },
  { name: "paymentOrders", kind: "array", key: (item) => item.id },
  { name: "paymentTransactions", kind: "array", key: (item) => item.id },
  { name: "paymentMandates", kind: "array", key: (item) => item.id },
  { name: "pointsLedger", kind: "array", key: (item) => item.id },
  { name: "zonePools", kind: "array", key: (item) => item.zoneId },
  { name: "reminders", kind: "array", key: (item, index) => item.id ?? `${item.workerId}-${item.scheduledAt}-${index}` },
  { name: "notifications", kind: "array", key: (item) => item.id },
  { name: "referrals", kind: "array", key: (item) => item.id },
  { name: "poolMotions", kind: "array", key: (item) => item.id },
  { name: "lifetimeProtection", kind: "object", key: () => "singleton" },
  { name: "otps", kind: "map", key: () => "singleton" }
];

let pool = null;
let enabled = false;
let lastPersistAt = null;

function createPool() {
  if (!process.env.DATABASE_URL) return null;
  const sslRequired = process.env.PGSSLMODE === "require" || process.env.DATABASE_SSL === "true";
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslRequired ? { rejectUnauthorized: false } : undefined
  });
}

function serializeCollection(config) {
  const value = store[config.name];
  if (config.kind === "map") {
    return Object.fromEntries(value.entries());
  }
  return value;
}

function hydrateCollection(config, data) {
  const current = store[config.name];
  if (config.kind === "array") {
    current.splice(0, current.length, ...(Array.isArray(data) ? data : []));
    return;
  }
  if (config.kind === "map") {
    current.clear();
    for (const [key, value] of Object.entries(data ?? {})) {
      current.set(key, value);
    }
    return;
  }
  store[config.name] = data ?? {};
}

async function ensureSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS gigshield_records (
      collection TEXT NOT NULL,
      record_id TEXT NOT NULL,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (collection, record_id)
    );
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_gigshield_records_collection
      ON gigshield_records (collection);
  `);
}

async function hasPersistedRecords(client) {
  const result = await client.query("SELECT 1 FROM gigshield_records LIMIT 1");
  return Boolean(result.rowCount);
}

async function loadCollection(client, config) {
  if (config.kind === "array") {
    const result = await client.query(
      "SELECT data FROM gigshield_records WHERE collection = $1 ORDER BY updated_at ASC",
      [config.name]
    );
    hydrateCollection(config, result.rows.map((row) => row.data));
    return;
  }

  const result = await client.query(
    "SELECT data FROM gigshield_records WHERE collection = $1 AND record_id = $2",
    [config.name, "singleton"]
  );
  if (result.rows[0]) hydrateCollection(config, result.rows[0].data);
}

async function saveCollection(client, config) {
  const serialized = serializeCollection(config);
  await client.query("DELETE FROM gigshield_records WHERE collection = $1", [config.name]);

  if (config.kind === "array") {
    for (let index = 0; index < serialized.length; index += 1) {
      const item = serialized[index];
      await client.query(
        `INSERT INTO gigshield_records (collection, record_id, data, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (collection, record_id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [config.name, String(config.key(item, index)), item]
      );
    }
    return;
  }

  await client.query(
    `INSERT INTO gigshield_records (collection, record_id, data, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (collection, record_id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [config.name, "singleton", serialized]
  );
}

export function isDatabaseEnabled() {
  return enabled;
}

export function getDatabaseState() {
  return {
    enabled,
    lastPersistAt
  };
}

export async function initializeDatabaseBackedStore() {
  pool = createPool();
  if (!pool) {
    enabled = false;
    return getDatabaseState();
  }

  const client = await pool.connect();
  try {
    await ensureSchema(client);
    if (await hasPersistedRecords(client)) {
      for (const config of COLLECTIONS) {
        await loadCollection(client, config);
      }
    } else {
      for (const config of COLLECTIONS) {
        await saveCollection(client, config);
      }
      lastPersistAt = new Date().toISOString();
    }
    enabled = true;
    return getDatabaseState();
  } finally {
    client.release();
  }
}

export async function persistStore() {
  if (!enabled || !pool) return getDatabaseState();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const config of COLLECTIONS) {
      await saveCollection(client, config);
    }
    await client.query("COMMIT");
    lastPersistAt = new Date().toISOString();
    return getDatabaseState();
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function seedDatabaseFromStaticData({ reset = false } = {}) {
  pool = createPool();
  if (!pool) {
    throw new Error("DATABASE_URL is required to seed Postgres");
  }

  const client = await pool.connect();
  try {
    await ensureSchema(client);
    await client.query("BEGIN");
    if (reset) {
      await client.query("DELETE FROM gigshield_records");
    }
    for (const config of COLLECTIONS) {
      await saveCollection(client, config);
    }
    await client.query("COMMIT");
    enabled = true;
    lastPersistAt = new Date().toISOString();
    return {
      ...getDatabaseState(),
      collections: COLLECTIONS.map((config) => ({
        name: config.name,
        records: config.kind === "array" ? store[config.name].length : 1
      }))
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase() {
  if (pool) await pool.end();
  pool = null;
  enabled = false;
}
