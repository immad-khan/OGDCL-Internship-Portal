-- =============================================================
-- OGDCL Intern Portal — Initial Schema Migration
-- Target: Supabase PostgreSQL
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================

-- ── 1. ENUMS ─────────────────────────────────────────────────

CREATE TYPE intern_status AS ENUM ('active', 'on_hold', 'completed', 'pending');
CREATE TYPE task_status   AS ENUM ('todo', 'in_progress', 'review', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE user_role     AS ENUM ('supervisor', 'intern');

-- ── 2. SUPERVISORS ───────────────────────────────────────────

CREATE TABLE supervisors (
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    email         TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,               -- BCrypt hash
    designation   TEXT        NOT NULL DEFAULT 'Internship Supervisor',
    department    TEXT        NOT NULL DEFAULT 'HR & Administration',
    phone         TEXT,
    region        TEXT                 DEFAULT 'Islamabad HQ',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. INTERNS ───────────────────────────────────────────────

CREATE TABLE interns (
    id            SERIAL PRIMARY KEY,
    name          TEXT          NOT NULL,
    email         TEXT          NOT NULL UNIQUE,
    password_hash TEXT          NOT NULL,             -- BCrypt hash; set by supervisor on creation
    phone         TEXT,
    department    TEXT          NOT NULL,
    university    TEXT,
    degree        TEXT,
    cgpa          TEXT,
    start_date    DATE,
    end_date      DATE,
    status        intern_status NOT NULL DEFAULT 'active',
    supervisor_id INTEGER       REFERENCES supervisors(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 4. TASKS ─────────────────────────────────────────────────

CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    intern_id   INTEGER        NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
    title       TEXT           NOT NULL,
    description TEXT,
    category    TEXT           NOT NULL DEFAULT 'General',
    priority    task_priority  NOT NULL DEFAULT 'medium',
    status      task_status    NOT NULL DEFAULT 'todo',
    due_date    DATE,
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── 5. MESSAGES ──────────────────────────────────────────────

CREATE TABLE messages (
    id           SERIAL PRIMARY KEY,
    intern_id    INTEGER     NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
    sender_name  TEXT        NOT NULL,
    role         user_role   NOT NULL,                -- 'supervisor' | 'intern'
    content      TEXT        NOT NULL,
    is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. REPORTS ───────────────────────────────────────────────

CREATE TABLE reports (
    id          SERIAL PRIMARY KEY,
    intern_id   INTEGER       NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
    title       TEXT          NOT NULL,
    content     TEXT,
    status      report_status NOT NULL DEFAULT 'draft',
    rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback    TEXT,                                 -- supervisor feedback on report
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 7. INDEXES ───────────────────────────────────────────────

CREATE INDEX idx_tasks_intern_id    ON tasks(intern_id);
CREATE INDEX idx_messages_intern_id ON messages(intern_id);
CREATE INDEX idx_reports_intern_id  ON reports(intern_id);
CREATE INDEX idx_messages_role      ON messages(role);
CREATE INDEX idx_messages_is_read   ON messages(is_read);

-- ── 8. SEED: Default Supervisor Account ──────────────────────
-- Password: Admin@OGDCL2024  (BCrypt hash generated at runtime;
--   replace the hash below with actual BCrypt output before running)
-- To generate hash: https://bcrypt-generator.com/ with rounds=12
-- OR run the .NET app once with a /api/auth/seed endpoint.

INSERT INTO supervisors (name, email, password_hash, designation, department, region)
VALUES (
    'Ishtiaque Butt',
    'immadonline702@gmail.com',
    '$2a$12$placeholder_replace_with_real_bcrypt_hash_here_xxxxx',
    'Senior Manager HR & Training',
    'HR & Administration',
    'Islamabad HQ'
);

-- ── 9. ROW LEVEL SECURITY (optional — Supabase RLS) ─────────
-- Disabled for now; the .NET backend handles authorization via JWT.
-- Enable these if you ever access Supabase directly from the frontend.

ALTER TABLE supervisors DISABLE ROW LEVEL SECURITY;
ALTER TABLE interns     DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks       DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages    DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports     DISABLE ROW LEVEL SECURITY;
