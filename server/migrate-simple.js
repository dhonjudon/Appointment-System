const { Pool } = require("pg");
require("dotenv").config();

// Try to connect as sasika first
const pool = new Pool({
  user: process.env.PGUSER || "sasika",
  password: process.env.PGPASSWORD || "1903sasika400",
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "doctor_appointment_system",
});

async function migrateWithGrants() {
  const client = await pool.connect();
  try {
    console.log("Attempting schema migration...\n");

    // List current columns
    const columnsResult = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'doctor_schedules'
      ORDER BY ordinal_position
    `);

    const currentColumns = columnsResult.rows.map((r) => r.column_name);
    console.log("Current columns:", currentColumns.join(", "));

    const hasScheduleType = currentColumns.includes("schedule_type");
    const hasSpecificDate = currentColumns.includes("specific_date");

    if (!hasScheduleType) {
      console.log("\n schedule_type column missing. Attempting to add...");
      try {
        await client.query(`
          ALTER TABLE doctor_schedules
          ADD COLUMN schedule_type VARCHAR(10) DEFAULT 'day'
          CHECK (schedule_type IN ('day', 'date'));
        `);
        console.log("✓ schedule_type added");
      } catch (e) {
        if (e.code === "42701") {
          console.log("✓ schedule_type already exists");
        } else if (e.code === "42501") {
          console.log(
            " Permission denied. Need to run as table owner (postgres user).",
          );
          console.log(
            "\nTo fix this, run as postgres user or with admin privileges:",
          );
          console.log(
            "  psql -U postgres -d doctor_appointment_system -f migrations.sql",
          );
          console.log(
            "\nOr grant ALTER TABLE permissions to sasika user first.",
          );
        } else {
          throw e;
        }
      }
    } else {
      console.log("✓ schedule_type already exists");
    }

    if (!hasSpecificDate) {
      console.log("\n  specific_date column missing. Attempting to add...");
      try {
        await client.query(`
          ALTER TABLE doctor_schedules
          ADD COLUMN specific_date DATE;
        `);
        console.log("✓ specific_date added");
      } catch (e) {
        if (e.code === "42701") {
          console.log("✓ specific_date already exists");
        } else if (e.code === "42501") {
          console.log(" Permission denied");
        } else {
          throw e;
        }
      }
    } else {
      console.log("✓ specific_date already exists");
    }

    // Check if columns are now present
    const updatedResult = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'doctor_schedules'
      ORDER BY ordinal_position
    `);

    const updatedColumns = updatedResult.rows.map((r) => r.column_name);
    console.log("\n Updated columns:", updatedColumns.join(", "));
  } catch (err) {
    console.error(" Unexpected error:", err.message);
    console.error("Error code:", err.code);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateWithGrants();
