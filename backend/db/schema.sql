CREATE TABLE IF NOT EXISTS gigshield_records (
  collection TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection, record_id)
);

CREATE INDEX IF NOT EXISTS idx_gigshield_records_collection
  ON gigshield_records (collection);
