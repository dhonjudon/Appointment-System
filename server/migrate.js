const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER || "sasika",
  password: process.env.PGPASSWORD || "1903sasika400",
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "doctor_appointment_system",
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting database migration...");

    // Check and add schedule_type column
    try {
      console.log("Adding schedule_type column...");
      await client.query(`
        ALTER TABLE doctor_schedules
        ADD COLUMN schedule_type VARCHAR(10) DEFAULT 'day' 
        CHECK (schedule_type IN ('day', 'date'));
      `);
      console.log("✓ schedule_type column added");
    } catch (e) {
      if (e.code === "42701") {
        // column already exists
        console.log("✓ schedule_type column already exists");
      } else {
        throw e;
      }
    }

    // Check and add specific_date column
    try {
      console.log("Adding specific_date column...");
      await client.query(`
        ALTER TABLE doctor_schedules
        ADD COLUMN specific_date DATE;
      `);
      console.log("✓ specific_date column added");
    } catch (e) {
      if (e.code === "42701") {
        // column already exists
        console.log("✓ specific_date column already exists");
      } else {
        throw e;
      }
    }

    // Drop old unique constraint
    try {
      console.log("Removing old unique constraint...");
      await client.query(`
        ALTER TABLE doctor_schedules
        DROP CONSTRAINT doctor_schedules_doctor_id_hospital_id_day_of_week_start_time_end_time_key;
      `);
      console.log("✓ Old constraint removed");
    } catch (e) {
      if (e.code === "42704") {
        // constraint does not exist
        console.log("✓ Old constraint doesn't exist (already updated)");
      } else {
        throw e;
      }
    }

    // Add new unique constraint
    try {
      console.log("Adding new unique constraint...");
      await client.query(`
        ALTER TABLE doctor_schedules
        ADD CONSTRAINT doctor_schedules_unique_schedule 
        UNIQUE (doctor_id, hospital_id, schedule_type, day_of_week, specific_date, start_time, end_time);
      `);
      console.log("✓ New constraint added");
    } catch (e) {
      if (e.code === "42710") {
        // constraint already exists
        console.log("✓ New constraint already exists");
      } else {
        throw e;
      }
    }

    // Update day_of_week to be nullable
    try {
      console.log("Making day_of_week nullable...");
      await client.query(`
        ALTER TABLE doctor_schedules
        ALTER COLUMN day_of_week DROP NOT NULL;
      `);
      console.log("✓ day_of_week is now nullable");
    } catch (e) {
      if (e.code === "42601") {
        // column doesn't have a not-null constraint
        console.log("✓ day_of_week is already nullable");
      } else {
        throw e;
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log(
      "Database schema updated to support date-specific and day-of-week schedules.",
    );
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    console.error("Error code:", err.code);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
