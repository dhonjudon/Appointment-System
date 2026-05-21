const { Pool } = require("pg");

const pool = new Pool({
  user: "sasika",
  password: "1903sasika400",
  host: "localhost",
  database: "doctor_appointment_system",
});

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'doctor_schedules'
      ORDER BY ordinal_position
    `);

    console.log("Current doctor_schedules columns:");
    result.rows.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`,
      );
    });

    // Check if new columns exist
    const hasScheduleType = result.rows.some(
      (c) => c.column_name === "schedule_type",
    );
    const hasSpecificDate = result.rows.some(
      (c) => c.column_name === "specific_date",
    );

    console.log("\nMissing columns:");
    if (!hasScheduleType) console.log("  - schedule_type (MISSING)");
    if (!hasSpecificDate) console.log("  - specific_date (MISSING)");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
