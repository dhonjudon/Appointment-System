-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: Fix doctor_schedules constraints so date-type schedules work
-- Run: psql -U postgres -d doctor_appointment_system -f fix_schedule_constraints.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Show current state
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'doctor_schedules'
ORDER BY ordinal_position;

-- ── Step 1: Drop the NOT NULL constraint on day_of_week ──────────────────────
-- day_of_week must be nullable because 'date'-type schedules don't use it
ALTER TABLE doctor_schedules
    ALTER COLUMN day_of_week DROP NOT NULL;

-- ── Step 2: Drop and recreate the CHECK on day_of_week ───────────────────────
-- Old check: day_of_week BETWEEN 0 AND 6  (fails when NULL for date-type rows)
-- New check: only enforce range when the value is not NULL
DO $$
DECLARE
    cname TEXT;
BEGIN
    FOR cname IN
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        WHERE t.relname = 'doctor_schedules'
          AND c.contype = 'c'
          AND c.conname ILIKE '%day_of_week%'
    LOOP
        EXECUTE format('ALTER TABLE doctor_schedules DROP CONSTRAINT IF EXISTS %I', cname);
        RAISE NOTICE 'Dropped constraint: %', cname;
    END LOOP;
END
$$;

ALTER TABLE doctor_schedules
    ADD CONSTRAINT doctor_schedules_day_of_week_check
    CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6);

-- ── Step 3: Add a cross-column constraint ────────────────────────────────────
-- Ensures: day-type rows have day_of_week set; date-type rows have specific_date set
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'doctor_schedules_type_fields_check'
          AND conrelid = 'doctor_schedules'::regclass
    ) THEN
        ALTER TABLE doctor_schedules
            ADD CONSTRAINT doctor_schedules_type_fields_check
            CHECK (
                (schedule_type = 'day'  AND day_of_week   IS NOT NULL AND specific_date IS NULL) OR
                (schedule_type = 'date' AND specific_date IS NOT NULL AND day_of_week   IS NULL)
            );
        RAISE NOTICE 'Added cross-column constraint doctor_schedules_type_fields_check';
    ELSE
        RAISE NOTICE 'Cross-column constraint already exists';
    END IF;
END
$$;

-- ── Step 4: Fix any existing bad rows (day-type rows missing day_of_week) ────
-- If any rows have schedule_type='day' but NULL day_of_week, we can't auto-fix them
-- so just report them
SELECT id, schedule_type, day_of_week, specific_date, start_time, end_time
FROM doctor_schedules
WHERE (schedule_type = 'day'  AND day_of_week   IS NULL)
   OR (schedule_type = 'date' AND specific_date IS NULL);

-- ── Step 5: Drop the old UNIQUE index and recreate correctly ─────────────────
DROP INDEX IF EXISTS uq_doctor_schedules_full;

-- Use COALESCE to handle NULLs in the unique index
CREATE UNIQUE INDEX uq_doctor_schedules_full
    ON doctor_schedules (
        doctor_id,
        COALESCE(hospital_id::text, 'NULL'),
        schedule_type,
        COALESCE(day_of_week::text, 'NULL'),
        COALESCE(specific_date::text, 'NULL'),
        start_time,
        end_time
    );

-- ── Final: verify the table structure ────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'doctor_schedules'
ORDER BY ordinal_position;

-- Show all constraints on the table
SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'doctor_schedules'::regclass
ORDER BY contype, conname;