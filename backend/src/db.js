import { MongoClient } from "mongodb";
import { store } from "./store.js";

const DATABASE_NAME = process.env.MONGODB_DB || process.env.DATABASE_NAME || "gigshield";

const COLLECTIONS = [
  { name: "planCatalog", kind: "array", key: (item) => item.id },
  { name: "zones", kind: "array", key: (item) => item.id },
  { name: "workers", kind: "array", key: (item) => item.id },
  { name: "policies", kind: "array", key: (item) => item.id },
  { name: "pushSubscriptions", kind: "array", key: (item) => item.id },
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

let client = null;
let database = null;
let enabled = false;
let lastPersistAt = null;

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.DATABASE_URL || "";
}

function createClient() {
  const uri = getMongoUri();
  if (!uri) return null;
  return new MongoClient(uri);
}

function collectionName(name) {
  return `gigshield_${name}`;
}

function getCollection(config) {
  return database.collection(collectionName(config.name));
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

function withoutMongoId(document) {
  if (!document) return document;
  const { _id, ...rest } = document;
  return rest;
}

async function ensureIndexes() {
  for (const config of COLLECTIONS) {
    await getCollection(config).createIndex({ recordId: 1 }, { unique: true });
  }
}

async function hasPersistedRecords() {
  for (const config of COLLECTIONS) {
    if (await getCollection(config).estimatedDocumentCount()) return true;
  }
  return false;
}

async function loadCollection(config) {
  const collection = getCollection(config);
  if (config.kind === "array") {
    const documents = await collection.find({}).sort({ order: 1, updatedAt: 1 }).toArray();
    hydrateCollection(config, documents.map((document) => withoutMongoId(document.data)));
    return;
  }

  const document = await collection.findOne({ recordId: "singleton" });
  if (document) hydrateCollection(config, withoutMongoId(document.data));
}

async function saveCollection(config) {
  const collection = getCollection(config);
  const serialized = serializeCollection(config);
  await collection.deleteMany({});

  if (config.kind === "array") {
    if (!serialized.length) return;
    await collection.insertMany(serialized.map((item, index) => ({
      recordId: String(config.key(item, index)),
      order: index,
      data: item,
      updatedAt: new Date()
    })));
    return;
  }

  await collection.insertOne({
    recordId: "singleton",
    data: serialized,
    updatedAt: new Date()
  });
}

async function connectDatabase() {
  client = createClient();
  if (!client) return false;
  await client.connect();
  database = client.db(DATABASE_NAME);
  await ensureIndexes();
  return true;
}

export function isDatabaseEnabled() {
  return enabled;
}

export function getDatabaseState() {
  return {
    enabled,
    provider: enabled ? "mongodb" : "memory",
    database: enabled ? DATABASE_NAME : null,
    lastPersistAt
  };
}

export async function initializeDatabaseBackedStore() {
  if (!(await connectDatabase())) {
    enabled = false;
    return getDatabaseState();
  }

  if (await hasPersistedRecords()) {
    for (const config of COLLECTIONS) {
      await loadCollection(config);
    }
  } else {
    for (const config of COLLECTIONS) {
      await saveCollection(config);
    }
    lastPersistAt = new Date().toISOString();
  }

  enabled = true;
  return getDatabaseState();
}

export async function persistStore() {
  if (!enabled || !database) return getDatabaseState();
  for (const config of COLLECTIONS) {
    await saveCollection(config);
  }
  lastPersistAt = new Date().toISOString();
  return getDatabaseState();
}

export async function seedDatabaseFromStaticData({ reset = false } = {}) {
  if (!database && !(await connectDatabase())) {
    throw new Error("MONGODB_URI or DATABASE_URL is required to seed MongoDB");
  }

  if (reset) {
    for (const config of COLLECTIONS) {
      await getCollection(config).deleteMany({});
    }
  }

  for (const config of COLLECTIONS) {
    await saveCollection(config);
  }

  enabled = true;
  lastPersistAt = new Date().toISOString();
  return {
    ...getDatabaseState(),
    collections: COLLECTIONS.map((config) => ({
      name: collectionName(config.name),
      records: config.kind === "array" ? store[config.name].length : 1
    }))
  };
}

export async function closeDatabase() {
  if (client) await client.close();
  client = null;
  database = null;
  enabled = false;
}
