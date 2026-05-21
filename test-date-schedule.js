// Get available doctors first
console.log("=== Fetching available doctors ===");

fetch(`http://localhost:3000/api/doctors`)
  .then((res) => res.json())
  .then((data) => {
    console.log("Found doctors response");

    if (data.data && data.data.doctors && data.data.doctors.length > 0) {
      const doctorId = data.data.doctors[0].id;
      console.log(`Doctor ID to use: ${doctorId}\n`);

      // Now test with this doctor ID
      testDateSchedule(doctorId);
    } else {
      console.log("No doctors found in database");
    }
  })
  .catch((err) => {
    console.error("Error fetching doctors:", err.message);
  });

function testDateSchedule(doctorId) {
  console.log(`=== Creating date-specific schedule for 2025-05-27 ===\n`);

  const dateTestData = {
    type: "date",
    specific_date: "2025-05-27",
    start_time: "09:00:00",
    end_time: "17:00:00",
    max_patients: 5,
    slot_duration_minutes: 30,
  };

  fetch(`http://localhost:3000/api/doctors/${doctorId}/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dateTestData),
  })
    .then((res) => {
      console.log("Create schedule status:", res.status);
      return res.json();
    })
    .then((data) => {
      if (!data.success) {
        console.log("Error creating schedule:", data.message);
        return;
      }
      console.log("Schedule created successfully");

      // Fetch all schedules
      console.log("\n=== Fetching all schedules ===\n");
      return fetch(
        `http://localhost:3000/api/doctors/${doctorId}/all-schedules`,
      );
    })
    .then((res) => {
      if (!res) return;
      console.log("Fetch schedules status:", res.status);
      return res.json();
    })
    .then((data) => {
      if (!data) return;

      // Check the specific_date format
      const schedules = data.data?.items || [];
      const dateSchedules = schedules.filter((s) => s.schedule_type === "date");

      console.log(`Found ${dateSchedules.length} date-specific schedule(s):\n`);
      dateSchedules.forEach((s) => {
        console.log(`  specific_date: "${s.specific_date}"`);
        // Verify it's in YYYY-MM-DD format (no timezone)
        if (/^\d{4}-\d{2}-\d{2}$/.test(s.specific_date)) {
          console.log("  ✓ FORMAT IS CORRECT (YYYY-MM-DD, no timezone)\n");
        } else if (/^\d{4}-\d{2}-\d{2}T/.test(s.specific_date)) {
          console.log("  ✗ ERROR: Still has timestamp with timezone\n");
        } else {
          console.log(`  ? Unknown format\n`);
        }
      });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}
