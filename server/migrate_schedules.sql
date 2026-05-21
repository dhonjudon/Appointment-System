-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: Add schedule_type, specific_date to doctor_schedules
--            and fix day_of_week type if it's VARCHAR
-- Run: psql -U postgres -d doctor_appointment_system -f migrate_schedules.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Check what we're working with
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'doctor_schedules'
ORDER BY ordinal_position;

-- Step 2: Add schedule_type if missing
ALTER TABLE doctor_schedules
    ADD COLUMN IF NOT EXISTS schedule_type VARCHAR(10) NOT NULL DEFAULT 'day';

-- Step 3: Add specific_date if missing
ALTER TABLE doctor_schedules
    ADD COLUMN IF NOT EXISTS specific_date DATE;

-- Step 4: Back-fill schedule_type for all existing rows (safe even if already set)
UPDATE doctor_schedules
SET schedule_type = 'day'
WHERE schedule_type IS NULL OR schedule_type = '';

-- Step 5: Fix day_of_week — if it's stored as VARCHAR, cast it to SMALLINT
-- First check current type:
DO $$
DECLARE
    col_type TEXT;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns
    WHERE table_name = 'doctor_schedules' AND column_name = 'day_of_week';

    RAISE NOTICE 'day_of_week current type: %', col_type;

    IF col_type IN ('character varying', 'text', 'character') THEN
        -- Rename old column
        ALTER TABLE doctor_schedules RENAME COLUMN day_of_week TO day_of_week_old;
        -- Add new SMALLINT column
        ALTER TABLE doctor_schedules ADD COLUMN day_of_week SMALLINT;
        -- Copy data with cast
        UPDATE doctor_schedules
        SET day_of_week = day_of_week_old::smallint
        WHERE day_of_week_old IS NOT NULL;
        -- Drop old column
        ALTER TABLE doctor_schedules DROP COLUMN day_of_week_old;
        RAISE NOTICE 'Migrated day_of_week from VARCHAR to SMALLINT';
    ELSE
        RAISE NOTICE 'day_of_week is already %, no migration needed', col_type;
    END IF;
END
$$;

-- Step 6: Add CHECK constraint on schedule_type if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'doctor_schedules_schedule_type_check'
          AND conrelid = 'doctor_schedules'::regclass
    ) THEN
        ALTER TABLE doctor_schedules
            ADD CONSTRAINT doctor_schedules_schedule_type_check
            CHECK (schedule_type IN ('day', 'date'));
        RAISE NOTICE 'Added CHECK constraint on schedule_type';
    ELSE
        RAISE NOTICE 'CHECK constraint on schedule_type already exists';
    END IF;
END
$$;

-- Step 7: Add CHECK constraint on day_of_week if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'doctor_schedules_day_of_week_check'
          AND conrelid = 'doctor_schedules'::regclass
    ) THEN
        ALTER TABLE doctor_schedules
            ADD CONSTRAINT doctor_schedules_day_of_week_check
            CHECK (day_of_week BETWEEN 0 AND 6);
        RAISE NOTICE 'Added CHECK constraint on day_of_week';
    ELSE
        RAISE NOTICE 'CHECK constraint on day_of_week already exists';
    END IF;
END
$$;

-- Step 8: Drop old unique constraint (may fail silently if not found — that's fine)
DO $$
DECLARE
    cname TEXT;
BEGIN
    -- Find any unique constraint on doctor_schedules that doesn't include schedule_type
    FOR cname IN
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        WHERE t.relname = 'doctor_schedules'
          AND c.contype = 'u'
          AND c.conname NOT LIKE '%schedule_type%'
          AND c.conname NOT LIKE '%full%'
    LOOP
        EXECUTE format('ALTER TABLE doctor_schedules DROP CONSTRAINT IF EXISTS %I', cname);
        RAISE NOTICE 'Dropped old unique constraint: %', cname;
    END LOOP;
END
$$;

-- Step 9: Add new unique index covering all columns
DROP INDEX IF EXISTS uq_doctor_schedules_full;
CREATE UNIQUE INDEX uq_doctor_schedules_full
    ON doctor_schedules (
        doctor_id,
        COALESCE(hospital_id, -1),
        schedule_type,
        COALESCE(day_of_week, -1),
        COALESCE(specific_date, '1970-01-01'::date),
        start_time,
        end_time
    );

-- Step 10: Add new indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_schedules_type
    ON doctor_schedules (schedule_type);

CREATE INDEX IF NOT EXISTS idx_schedules_specific_date
    ON doctor_schedules (specific_date)
    WHERE specific_date IS NOT NULL;

-- Step 11: Final verification — show the updated table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'doctor_schedules'
ORDER BY ordinal_position;

-- Step 12: Show current data to confirm back-fill worked
SELECT
    id,
    doctor_id,
    schedule_type,
    day_of_week,
    specific_date,
    start_time,
    end_time,
    is_active
FROM doctor_schedules
ORDER BY id;