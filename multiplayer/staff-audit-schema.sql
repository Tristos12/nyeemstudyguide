-- School staff audit log. Run ONLY on the dedicated development database.
-- This migration intentionally does not alter existing learner tables.
CREATE TABLE IF NOT EXISTS gk_staff_audit (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 school_id VARCHAR(100) NOT NULL,
 staff_subject VARCHAR(255) NOT NULL,
 staff_role VARCHAR(20) NOT NULL CHECK(staff_role IN ('teacher','safeguarding','administrator')),
 action VARCHAR(40) NOT NULL CHECK(action IN (
  'staff.session_verified','staff.session_revoked',
  'room.pause','room.close','chat.disable',
  'incident.list','incident.read','incident.resolve',
  'staff.activate','staff.deactivate','staff.change_role'
 )),
 object_type VARCHAR(20) NOT NULL CHECK(object_type IN ('session','room','incident','staff')),
 object_ref VARCHAR(128),
 outcome VARCHAR(12) NOT NULL CHECK(outcome IN ('success','denied','error')),
 request_id VARCHAR(100),
 CHECK(object_ref IS NULL OR length(object_ref)>0)
);
CREATE INDEX IF NOT EXISTS gk_staff_audit_school_time ON gk_staff_audit(school_id,created_at DESC);
-- Audit logs must never contain message bodies, student PII, auth tokens, secrets or IP addresses.
-- The application database role should have INSERT only on this table, not UPDATE or DELETE.
-- A separate restricted maintenance role controls retention and deletion.
-- Retention is subject to the school's approved policy.
