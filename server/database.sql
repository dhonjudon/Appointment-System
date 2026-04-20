-- Database schema for doctor appointment booking system
-- Run these 2 lines in psql to create and switch to the target database.
CREATE DATABASE doctor_appointment_system;
\c doctor_appointment_system

-- Enable case-insensitive text comparisons for emails and other fields
CREATE EXTENSION IF NOT EXISTS citext;
-- Generate secure random UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create custom enum types for role-based access control and appointment state management
DO $$
BEGIN
    -- User roles: patients, healthcare providers, and system admins
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'doctor', 'admin');
    END IF;

    -- Appointment lifecycle: from booking through completion or cancellation
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM (
            'pending',      -- Initial state, awaiting confirmation
            'confirmed',    -- Approved by doctor or system
            'cancelled',    -- User or doctor cancelled
            'completed',    -- Appointment occurred
            'rescheduled',  -- Moved to different time
            'no_show'       -- Patient didn't arrive
        );  
    END IF;
-- Payment states for consultation fees
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
    END IF;

    -- Doctor credentialing: verify licenses and credentials before allowing appointments    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'doctor_verification_status') THEN
        CREATE TYPE doctor_verification_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END
-- Auto-update timestamp whenever a record is modified
$$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
-- Medical specializations (Cardiology, ENT, etc.)
CREATE TABLE IF NOT EXISTS specializations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Core user accounts — doctors, patients, and admins
-- Uses case-insensitive email field for convenient lookups    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
-- User demographic and contact info — separate from authentication
-- One-to-one with users table for easy profile lookup
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(30),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    blood_group VARCHAR(5),
-- Healthcare facilities where doctors practice
-- Unique constraint prevents duplicate hospital entries
    emergency_contact_name VARCHAR(120),
    emergency_contact_phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospitals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
-- Doctor-specific data: credentials, fees, ratings
-- License number uniquely identifies medical professionals
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name, city, country)
);

CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization_id BIGINT REFERENCES specializations(id) ON DELETE SET NULL,
-- Doctor-hospital affiliations: many doctors work across multiple facilities
-- Primary flag indicates the doctor's main practice location
    license_number VARCHAR(100) NOT NULL UNIQUE,
    years_of_experience SMALLINT NOT NULL DEFAULT 0 CHECK (years_of_experience >= 0),
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (consultation_fee >= 0),
    bio TEXT,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_reviews INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
-- Patient medical background: conditions, meds, allergies
-- Patient can control doctor visibility for privacy
-- One-to-one with users table
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_hospitals (
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id BIGINT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (doctor_id, hospital_id)
);
-- Doctor availability templates: repeating weekly schedules
-- day_of_week: 0=Sunday through 6=Saturday
-- Defines time range and slot duration for appointment booking

CREATE TABLE IF NOT EXISTS medical_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    allergies TEXT,
    chronic_conditions TEXT,
    current_medications TEXT,
    surgeries TEXT,
    family_history TEXT,
    notes TEXT,
    is_visible_to_doctors BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Booked appointments: actual consultation reservations
-- UUID code for sharing appointments outside the system (emails, SMS)
-- Tracks cancellation info: who cancelled and when
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id BIGINT REFERENCES hospitals(id) ON DELETE SET NULL,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (slot_duration_minutes > 0),
    max_patients_per_slot SMALLINT NOT NULL DEFAULT 1 CHECK (max_patients_per_slot > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time),
    UNIQUE (doctor_id, hospital_id, day_of_week, start_time, end_time)
);
-- Audit trail: tracks every appointment reschedule event
-- Preserves old and new times for conflict detection and reporting

CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    appointment_code UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id BIGINT REFERENCES hospitals(id) ON DELETE SET NULL,
    schedule_id BIGINT REFERENCES doctor_schedules(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status NOT NULL DEFAULT 'pending',
    reason TEXT,
-- Payment records: one-to-one with appointments
-- Provider fields link to external payment gateways (Stripe, PayPal, etc.)
    notes TEXT,
    cancelled_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS appointment_reschedules (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    old_appointment_date DATE NOT NULL,
-- Doctor reviews and ratings: collected after appointments
-- Public feedback to build doctor credibility and patient trust
    old_start_time TIME NOT NULL,
    old_end_time TIME NOT NULL,
    new_appointment_date DATE NOT NULL,
    new_start_time TIME NOT NULL,
    new_end_time TIME NOT NULL,
    rescheduled_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (new_end_time > new_start_time)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    provider VARCHAR(60) NOT NULL,
    provider_payment_id VARCHAR(120) UNIQUE,
    status payment_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_feedback (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id BIGINT REFERENCES appointments(id) ON DELETE SET NULL,
    feedback_text TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_reviews (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id BIGINT REFERENCES appointments(id) ON DELETE SET NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, user_id, appointment_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(40) NOT NULL DEFAULT 'general',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_verifications (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
    status doctor_verification_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_doctor_time_slot
    ON appointments (doctor_id, appointment_date, start_time, end_time)
    WHERE status IN ('pending', 'confirmed', 'rescheduled');

CREATE INDEX IF NOT EXISTS idx_doctors_specialization_id ON doctors(specialization_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_user_id ON medical_history(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_reschedules_appointment_id ON appointment_reschedules(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reschedules_user_id ON appointment_reschedules(rescheduled_by);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_doctor_id ON doctor_feedback(doctor_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON doctor_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON doctor_reviews(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON doctor_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON doctor_verifications(status);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_hospitals_updated_at ON hospitals;
CREATE TRIGGER trg_hospitals_updated_at
BEFORE UPDATE ON hospitals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_doctors_updated_at ON doctors;
CREATE TRIGGER trg_doctors_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_medical_history_updated_at ON medical_history;
CREATE TRIGGER trg_medical_history_updated_at
BEFORE UPDATE ON medical_history
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_doctor_schedules_updated_at ON doctor_schedules;
CREATE TRIGGER trg_doctor_schedules_updated_at
BEFORE UPDATE ON doctor_schedules
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON appointments;
CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_doctor_reviews_updated_at ON doctor_reviews;
CREATE TRIGGER trg_doctor_reviews_updated_at
BEFORE UPDATE ON doctor_reviews
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_doctor_verifications_updated_at ON doctor_verifications;
CREATE TRIGGER trg_doctor_verifications_updated_at
BEFORE UPDATE ON doctor_verifications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();