const { Pool } = require("pg");

const pool = new Pool({
  user: "sasika",
  password: "1903sasika400",
  host: "localhost",
  database: "doctor_appointment_system",
});

async function checkConstraints() {
  try {
    const result = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = 'doctor_schedules'::regclass
      AND contype = 'c'
    `);

    console.log("Check constraints on doctor_schedules:");
    result.rows.forEach((row) => {
      console.log(`  ${row.conname}: ${row.pg_get_constraintdef}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkConstraints();
