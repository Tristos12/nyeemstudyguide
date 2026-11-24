-- Staff-only records for Babonneau Secondary School Learning Hub.
-- Run in the dedicated multiplayer Neon database, not in Sigma.
-- Do NOT provision accounts automatically or through a public API.
-- A school administrator must verify each identity-provider subject and role.
CREATE TABLE IF NOT EXISTS gk_staff_accounts (
 subject VARCHAR(255) PRIMARY KEY,
 school_id VARCHAR(100) NOT NULL,
 role VARCHAR(20) NOT NULL CHECK (role IN ('teacher','safeguarding','administrator')),
 active BOOLEAN NOT NULL DEFAULT FALSE,
 class_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 provisioned_by VARCHAR(255) NOT NULL
);
CREATE INDEX IF NOT EXISTS gk_staff_school_active ON gk_staff_accounts(school_id,active);
-- No student identifiers, chat content or incident records in this table.
-- Privileged database credentials must never be made available in the browser.
