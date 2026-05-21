const doctorId = 1;

const testData = {
  type: "day",
  day_of_week: 1,
  start_time: "09:00:00",
  end_time: "17:00:00",
  max_patients: 5,
  slot_duration_minutes: 30,
};

fetch(`http://localhost:3000/api/doctors/${doctorId}/availability`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testData),
})
  .then((res) => {
    console.log("Response status:", res.status);
    console.log("Response status text:", res.statusText);
    return res.json();
  })
  .then((data) => {
    console.log("Response data:", JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
