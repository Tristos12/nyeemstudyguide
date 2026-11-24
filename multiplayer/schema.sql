-- Use a dedicated database for the Learning Hub, not the Sigma platform database.
CREATE TABLE IF NOT EXISTS gk_rooms (
 code VARCHAR(8) PRIMARY KEY,
 invite_hash CHAR(64) NOT NULL,
 seed BIGINT NOT NULL CHECK(seed BETWEEN 1 AND 4294967295),
 mode VARCHAR(20) NOT NULL CHECK (mode IN ('all','school','saintlucia','companion')),
 seconds_per_question SMALLINT NOT NULL CHECK (seconds_per_question IN (0,30,60)),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 started_at TIMESTAMPTZ,
 expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);
CREATE TABLE IF NOT EXISTS gk_players (
 room_code VARCHAR(8) NOT NULL REFERENCES gk_rooms(code) ON DELETE CASCADE,
 seat SMALLINT NOT NULL CHECK(seat IN (1,2)),
 nickname VARCHAR(24) NOT NULL,
 token_hash CHAR(64) NOT NULL,
 next_index SMALLINT NOT NULL DEFAULT 0 CHECK(next_index BETWEEN 0 AND 60),
 score SMALLINT NOT NULL DEFAULT 0 CHECK(score BETWEEN 0 AND 600),
 question_started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ,
 PRIMARY KEY (room_code,seat),
 UNIQUE (room_code,token_hash)
);
CREATE INDEX IF NOT EXISTS gk_room_expiry ON gk_rooms(expires_at);
-- Schedule server-side expiry cleanup using a service maintenance job.
-- Example: DELETE FROM gk_rooms WHERE expires_at < now();
