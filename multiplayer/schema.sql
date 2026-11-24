-- Use a dedicated database for the Learning Hub, not the Sigma platform database.
CREATE TABLE IF NOT EXISTS gk_rooms (
 code VARCHAR(8) PRIMARY KEY,
 invite_hash CHAR(64) NOT NULL,
 rate_key CHAR(64) NOT NULL,
 seed BIGINT NOT NULL CHECK(seed BETWEEN 1 AND 4294967295),
 mode VARCHAR(20) NOT NULL CHECK (mode IN ('all','school','saintlucia','companion')),
 seconds_per_question SMALLINT NOT NULL CHECK (seconds_per_question IN (0,30,60)),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 started_at TIMESTAMPTZ,
 round_no INTEGER NOT NULL DEFAULT 1 CHECK (round_no >= 1),
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
 quick_message SMALLINT CHECK (quick_message BETWEEN 0 AND 5),
 quick_message_at TIMESTAMPTZ,
 typed_message_at TIMESTAMPTZ,
 rematch_ready BOOLEAN NOT NULL DEFAULT FALSE,
 PRIMARY KEY (room_code,seat),
 UNIQUE (room_code,token_hash)
);
CREATE TABLE IF NOT EXISTS gk_typed_messages (
 id BIGSERIAL PRIMARY KEY,
 room_code VARCHAR(8) NOT NULL REFERENCES gk_rooms(code) ON DELETE CASCADE,
 sender_seat SMALLINT NOT NULL CHECK(sender_seat IN (1,2)),
 message_text VARCHAR(150) NOT NULL CHECK (char_length(message_text) BETWEEN 1 AND 150),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 reported_at TIMESTAMPTZ,
 reported_by_seat SMALLINT CHECK(reported_by_seat IN (1,2))
);
CREATE INDEX IF NOT EXISTS gk_message_room_idx ON gk_typed_messages(room_code,id DESC);
CREATE INDEX IF NOT EXISTS gk_room_expiry ON gk_rooms(expires_at);
-- Schedule server-side expiry cleanup using a service maintenance job.
-- Example: DELETE FROM gk_rooms WHERE expires_at < now();

-- Atomic, consent-based rematch procedure. It locks the room before checking
-- both players' completion and agreement, and resets both in one transaction.
CREATE OR REPLACE FUNCTION gk_request_rematch(p_code varchar,p_seat smallint,p_round integer,p_seed bigint)
RETURNS TABLE(result_status text,result_round integer) LANGUAGE plpgsql AS $$
DECLARE v_round integer; v_finished integer; v_ready integer;
BEGIN
 SELECT r.round_no INTO v_round FROM gk_rooms r
 WHERE r.code=p_code AND r.expires_at>now() FOR UPDATE;
 IF NOT FOUND THEN RETURN QUERY SELECT 'expired'::text,0; RETURN; END IF;
 IF v_round<>p_round THEN RETURN QUERY SELECT 'stale'::text,v_round; RETURN; END IF;
 SELECT count(*)::integer INTO v_finished FROM gk_players p
 WHERE p.room_code=p_code AND p.next_index=60;
 IF v_finished<>2 THEN RETURN QUERY SELECT 'not_finished'::text,v_round; RETURN; END IF;
 UPDATE gk_players p SET rematch_ready=TRUE
 WHERE p.room_code=p_code AND p.seat=p_seat AND p.next_index=60;
 IF NOT FOUND THEN RETURN QUERY SELECT 'unauthorized'::text,v_round; RETURN; END IF;
 SELECT count(*)::integer INTO v_ready FROM gk_players p
 WHERE p.room_code=p_code AND p.rematch_ready=TRUE;
 IF v_ready<>2 THEN RETURN QUERY SELECT 'waiting'::text,v_round; RETURN; END IF;
 UPDATE gk_rooms r SET round_no=r.round_no+1,seed=p_seed,started_at=now() WHERE r.code=p_code;
 UPDATE gk_players p SET next_index=0,score=0,question_started_at=now(),finished_at=NULL,
 rematch_ready=FALSE,quick_message=NULL,quick_message_at=NULL,typed_message_at=NULL
 WHERE p.room_code=p_code;
 RETURN QUERY SELECT 'started'::text,v_round+1;
END; $$;
