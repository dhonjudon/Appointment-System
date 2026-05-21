-- ===== Manual Database Migration for Doctor Schedules =====
-- Run this as admin (postgres user) to add schedule_type and specific_date columns
-- psql -U postgres -d doctor_appointment_system -f migrations.sql

-- Step 1: Add schedule_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctor_schedules' AND column_name = 'schedule_type'
  ) THEN
    ALTER TABLE doctor_schedules
    ADD COLUMN schedule_type VARCHAR(10) DEFAULT 'day'
    CHECK (schedule_type IN ('day', 'date'));
    RAISE NOTICE 'Added schedule_type column';
  ELSE
    RAISE NOTICE 'schedule_type column already exists';
  END IF;
END $$;

-- Step 2: Add specific_date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctor_schedules' AND column_name = 'specific_date'
  ) THEN
    ALTER TABLE doctor_schedules
    ADD COLUMN specific_date DATE;
    RAISE NOTICE 'Added specific_date column';
  ELSE
    RAISE NOTICE 'specific_date column already exists';
  END IF;
END $$;

-- Step 3: Make day_of_week nullable
DO $$
BEGIN
  ALTER TABLE doctor_schedules
  ALTER COLUMN day_of_week DROP NOT NULL;
  RAISE NOTICE 'Made day_of_week nullable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'day_of_week is already nullable or error: %', SQLERRM;
END $$;

-- Step 4: Drop old constraint if it exists
DO $$
BEGIN
  ALTER TABLE doctor_schedules
  DROP CONSTRAINT doctor_schedules_doctor_id_hospital_id_day_of_week_start_time_end_time_key;
  RAISE NOTICE 'Dropped old unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Old constraint doesn''t exist or error: %', SQLERRM;
END $$;

-- Step 5: Add new unique constraint
DO $$
BEGIN
  ALTER TABLE doctor_schedules
  ADD CONSTRAINT doctor_schedules_unique_schedule
  UNIQUE (doctor_id, hospital_id, schedule_type, day_of_week, specific_date, start_time, end_time);
  RAISE NOTICE 'Added new unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Constraint may already exist or error: %', SQLERRM;
END $$;

-- Verify schema
SELECT 'Doctor Schedules Schema:' as status;
\d doctor_schedules;

SELECT 'Migration complete!' as status;
