const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const router = express.Router();
router.use(cors());
router.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || "dijankarki",
  password: process.env.PGPASSWORD || "",
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "doctor_appointment_system",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const APPOINTMENT_ACTIVE_STATUSES = ["pending", "confirmed", "rescheduled"];

const sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, error = null) => {
  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production" && error) {
    payload.error = error.message || String(error);
  }

  res.status(statusCode).json(payload);
};

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const createNotification = async (
  userId,
  title,
  message,
  type = "general",
  metadata = {},
) => {
  await pool.query(
    `
			INSERT INTO notifications (user_id, title, message, type, metadata)
			VALUES ($1, $2, $3, $4, $5::jsonb)
		`,
    [userId, title, message, type, JSON.stringify(metadata)],
  );
};

const normalizeNumericId = (value) => {
  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
};

const roundCurrency = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const getPaymentQuote = (baseAmount, paymentMethod = "card") => {
  const normalizedMethod = ["card", "upi", "cash"].includes(paymentMethod)
    ? paymentMethod
    : "card";

  const base = roundCurrency(baseAmount);
  const platformFeeRate = normalizedMethod === "card" ? 0.025 : normalizedMethod === "upi" ? 0.01 : 0;
  const platformFee = roundCurrency(base * platformFeeRate);
  const tax = roundCurrency((base + platformFee) * 0.05);
  const total = roundCurrency(base + platformFee + tax);

  return {
    payment_method: normalizedMethod,
    base_amount: base,
    platform_fee: platformFee,
    tax,
    total_amount: total,
  };
};

const authService = {
  registerUser: async ({ email, password, role = "user" }) => {
    const allowedRoles = ["user", "doctor", "admin"];
    if (!allowedRoles.includes(role)) {
      throw new Error("Invalid user role");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
				INSERT INTO users (email, password_hash, role)
				VALUES ($1, $2, $3)
				RETURNING id, email, role, created_at
			`,
      [email, hashedPassword, role],
    );

    return result.rows[0];
  },

  loginUser: async ({ email, password }) => {
    const result = await pool.query(
      `
				SELECT id, email, password_hash, role, is_active
				FROM users
				WHERE email = $1
			`,
      [email],
    );

    if (!result.rowCount) {
      return null;
    }

    const user = result.rows[0];
    if (!user.is_active) {
      throw new Error("User account is deactivated");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },
};

const profileService = {
  createProfile: async (payload) => {
    const {
      user_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
    } = payload;

    const result = await pool.query(
      `
				INSERT INTO user_profiles (
					user_id,
					first_name,
					last_name,
					date_of_birth,
					gender,
					phone,
					address_line1,
					address_line2,
					city,
					state,
					country,
					postal_code,
					blood_group,
					emergency_contact_name,
					emergency_contact_phone
				)
				VALUES (
					$1, $2, $3, $4, $5,
					$6, $7, $8, $9, $10,
					$11, $12, $13, $14, $15
				)
				RETURNING *
			`,
      [
        user_id,
        first_name,
        last_name,
        date_of_birth || null,
        gender || null,
        phone || null,
        address_line1 || null,
        address_line2 || null,
        city || null,
        state || null,
        country || null,
        postal_code || null,
        blood_group || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
      ],
    );

    return result.rows[0];
  },

  updateProfile: async (userId, payload) => {
    const updatableFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "phone",
      "address_line1",
      "address_line2",
      "city",
      "state",
      "country",
      "postal_code",
      "blood_group",
      "emergency_contact_name",
      "emergency_contact_phone",
    ];

    const entries = Object.entries(payload).filter(([key]) =>
      updatableFields.includes(key),
    );
    if (!entries.length) {
      throw new Error("No updatable profile fields provided");
    }

    const setClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = entries.map(([, value]) => value);
    values.push(userId);

    const result = await pool.query(
      `
				UPDATE user_profiles
				SET ${setClause}
				WHERE user_id = $${values.length}
				RETURNING *
			`,
      values,
    );

    return result.rows[0] || null;
  },

  getProfile: async (userId) => {
    const result = await pool.query(
      `
				SELECT up.*, u.email, u.role
				FROM user_profiles up
				JOIN users u ON u.id = up.user_id
				WHERE up.user_id = $1
			`,
      [userId],
    );

    return result.rows[0] || null;
  },
};

const doctorService = {
  getAllDoctors: async ({
    specializationId,
    minRating,
    page,
    limit,
    offset,
  }) => {
    const filters = [];
    const values = [];

    if (specializationId) {
      values.push(specializationId);
      filters.push(`d.specialization_id = $${values.length}`);
    }

    if (minRating !== undefined && minRating !== null) {
      values.push(minRating);
      filters.push(`d.average_rating >= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    values.push(limit);
    values.push(offset);

    const listQuery = `
			SELECT
				d.id,
				d.user_id,
				d.specialization_id,
				s.name AS specialization_name,
				d.license_number,
				d.years_of_experience,
				d.consultation_fee,
				d.bio,
				d.average_rating,
				d.total_reviews,
				u.email,
				up.first_name,
				up.last_name
			FROM doctors d
			JOIN users u ON u.id = d.user_id
			LEFT JOIN specializations s ON s.id = d.specialization_id
			LEFT JOIN user_profiles up ON up.user_id = d.user_id
			${whereClause}
			ORDER BY d.average_rating DESC, d.id ASC
			LIMIT $${values.length - 1}
			OFFSET $${values.length}
		`;

    const countValues = values.slice(0, values.length - 2);
    const countQuery = `
			SELECT COUNT(*)::int AS total
			FROM doctors d
			${whereClause}
		`;

    const [listResult, countResult] = await Promise.all([
      pool.query(listQuery, values),
      pool.query(countQuery, countValues),
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  getDoctorDetails: async (doctorId) => {
    const doctorResult = await pool.query(
      `
				SELECT
					d.*,
					u.email,
					up.first_name,
					up.last_name,
					s.name AS specialization_name
				FROM doctors d
				JOIN users u ON u.id = d.user_id
				LEFT JOIN user_profiles up ON up.user_id = d.user_id
				LEFT JOIN specializations s ON s.id = d.specialization_id
				WHERE d.id = $1
			`,
      [doctorId],
    );

    if (!doctorResult.rowCount) {
      return null;
    }

    const hospitalsResult = await pool.query(
      `
				SELECT h.*, dh.is_primary
				FROM doctor_hospitals dh
				JOIN hospitals h ON h.id = dh.hospital_id
				WHERE dh.doctor_id = $1
				ORDER BY dh.is_primary DESC, h.name ASC
			`,
      [doctorId],
    );

    return {
      ...doctorResult.rows[0],
      hospitals: hospitalsResult.rows,
    };
  },

  getAvailableSchedules: async (doctorId, date) => {
    const schedulesResult = await pool.query(
      `
				SELECT id, doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients_per_slot
				FROM doctor_schedules
				WHERE doctor_id = $1
					AND is_active = TRUE
          AND ($2::date IS NULL OR day_of_week::int = EXTRACT(DOW FROM $2::date)::int)
				ORDER BY day_of_week, start_time
			`,
      [doctorId, date || null],
    );

    if (!date) {
      return {
        date: null,
        schedules: schedulesResult.rows,
        booked_slots: [],
      };
    }

    const bookedResult = await pool.query(
      `
				SELECT id, start_time, end_time, status
				FROM appointments
				WHERE doctor_id = $1
					AND appointment_date = $2
					AND status = ANY($3::appointment_status[])
				ORDER BY start_time ASC
			`,
      [doctorId, date, APPOINTMENT_ACTIVE_STATUSES],
    );

    return {
      date,
      schedules: schedulesResult.rows,
      booked_slots: bookedResult.rows,
    };
  },

  // ── DOCTOR SITE: Get appointments for a specific doctor ──
  getDoctorAppointments: async ({
    doctorId,
    date,
    month,
    year,
    page,
    limit,
    offset,
  }) => {
    const values = [doctorId];
    const filters = ["a.doctor_id = $1"];

    // Filter by exact date
    if (date) {
      values.push(date);
      filters.push(`a.appointment_date = $${values.length}`);
    }
    // Filter by month + year
    if (month && year) {
      values.push(year);
      values.push(month);
      filters.push(
        `EXTRACT(YEAR FROM a.appointment_date) = $${values.length - 1}`,
      );
      filters.push(
        `EXTRACT(MONTH FROM a.appointment_date) = $${values.length}`,
      );
    } else if (year) {
      values.push(year);
      filters.push(`EXTRACT(YEAR FROM a.appointment_date) = $${values.length}`);
    }

    const whereClause = `WHERE ${filters.join(" AND ")}`;
    values.push(limit);
    values.push(offset);

    const query = `
      SELECT
        a.*,
        up.first_name AS patient_first_name,
        up.last_name  AS patient_last_name,
        up.phone      AS patient_phone,
        up.blood_group,
        u.email       AS patient_email,
        h.name        AS hospital_name
      FROM appointments a
      JOIN users u         ON u.id = a.user_id
      LEFT JOIN user_profiles up ON up.user_id = a.user_id
      LEFT JOIN hospitals h ON h.id = a.hospital_id
      ${whereClause}
      ORDER BY a.appointment_date ASC, a.start_time ASC
      LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const countValues = values.slice(0, values.length - 2);
    const countQuery = `SELECT COUNT(*)::int AS total FROM appointments a ${whereClause}`;

    const [listResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, countValues),
    ]);
    const total = countResult.rows[0]?.total || 0;
    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  // ── DOCTOR SITE: Get all patients (users who have/had appointments with this doctor) ──
  getDoctorPatients: async ({ doctorId, page, limit, offset }) => {
    const query = `
      SELECT DISTINCT ON (u.id)
        u.id AS user_id,
        u.email,
        up.first_name,
        up.last_name,
        up.phone,
        up.date_of_birth,
        up.gender,
        up.blood_group,
        up.address_line1,
        up.city,
        up.country,
        up.emergency_contact_name,
        up.emergency_contact_phone,
        (SELECT COUNT(*)::int FROM appointments WHERE user_id = u.id AND doctor_id = $1) AS total_visits,
        (SELECT MAX(appointment_date) FROM appointments WHERE user_id = u.id AND doctor_id = $1) AS last_visit_date
      FROM appointments a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE a.doctor_id = $1
      ORDER BY u.id ASC
      LIMIT $2 OFFSET $3`;

    const countQuery = `
      SELECT COUNT(DISTINCT user_id)::int AS total FROM appointments WHERE doctor_id = $1`;

    const [listResult, countResult] = await Promise.all([
      pool.query(query, [doctorId, limit, offset]),
      pool.query(countQuery, [doctorId]),
    ]);
    const total = countResult.rows[0]?.total || 0;
    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  // ── DOCTOR SITE: Set availability (by day-of-week OR by specific date) ──
  setAvailability: async ({
    doctorId,
    hospitalId,
    type,
    day_of_week,
    specific_date,
    start_time,
    end_time,
    max_patients,
    slot_duration_minutes,
  }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      if (type === "date") {
        // Deactivate any existing date-specific schedule for this date
        await client.query(
          `UPDATE doctor_schedules
           SET is_active = FALSE
           WHERE doctor_id = $1 AND specific_date = $2 AND schedule_type = 'date'`,
          [doctorId, specific_date],
        );
        // Insert new date override
        const result = await client.query(
          `INSERT INTO doctor_schedules
             (doctor_id, hospital_id, schedule_type, specific_date, start_time, end_time, slot_duration_minutes, max_patients_per_slot, is_active)
           VALUES ($1,$2,'date',$3,$4,$5,$6,$7,TRUE) RETURNING *`,
          [
            doctorId,
            hospitalId || null,
            specific_date,
            start_time,
            end_time,
            slot_duration_minutes || 30,
            max_patients || 1,
          ],
        );
        await client.query("COMMIT");
        return result.rows[0];
      } else {
        // type === "day" — only update if no active date-specific schedule exists for today's weekday slots
        await client.query(
          `UPDATE doctor_schedules
           SET is_active = FALSE
           WHERE doctor_id = $1 AND day_of_week = $2 AND schedule_type = 'day'`,
          [doctorId, day_of_week],
        );
        const result = await client.query(
          `INSERT INTO doctor_schedules
             (doctor_id, hospital_id, schedule_type, day_of_week, start_time, end_time, slot_duration_minutes, max_patients_per_slot, is_active)
           VALUES ($1,$2,'day',$3,$4,$5,$6,$7,TRUE) RETURNING *`,
          [
            doctorId,
            hospitalId || null,
            day_of_week,
            start_time,
            end_time,
            slot_duration_minutes || 30,
            max_patients || 1,
          ],
        );
        await client.query("COMMIT");
        return result.rows[0];
      }
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  // ── DOCTOR SITE: Panel/dashboard summary ──
  getDoctorPanel: async (doctorId) => {
    const today = new Date().toISOString().split("T")[0];

    const [
      totalPatientsResult,
      todayAppointmentsResult,
      upcomingResult,
      doctorResult,
    ] = await Promise.all([
      // Total unique patients
      pool.query(
        `SELECT COUNT(DISTINCT user_id)::int AS total_patients FROM appointments WHERE doctor_id = $1`,
        [doctorId],
      ),
      // Today's appointments with patient info
      pool.query(
        `SELECT a.*, up.first_name, up.last_name, up.phone, u.email
         FROM appointments a
         JOIN users u ON u.id = a.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE a.doctor_id = $1 AND a.appointment_date = $2
         ORDER BY a.start_time ASC`,
        [doctorId, today],
      ),
      // Upcoming appointments (next 7 days excluding today)
      pool.query(
        `SELECT COUNT(*)::int AS upcoming_count
         FROM appointments
         WHERE doctor_id = $1 AND appointment_date > $2 AND appointment_date <= ($2::date + INTERVAL '7 days')
           AND status = ANY($3::appointment_status[])`,
        [doctorId, today, APPOINTMENT_ACTIVE_STATUSES],
      ),
      // Doctor basic info
      pool.query(
        `SELECT d.*, up.first_name, up.last_name, s.name AS specialization_name
         FROM doctors d
         LEFT JOIN user_profiles up ON up.user_id = d.user_id
         LEFT JOIN specializations s ON s.id = d.specialization_id
         WHERE d.id = $1`,
        [doctorId],
      ),
    ]);

    return {
      doctor: doctorResult.rows[0] || null,
      total_patients: totalPatientsResult.rows[0]?.total_patients || 0,
      today_date: today,
      today_appointments: todayAppointmentsResult.rows,
      today_appointment_count: todayAppointmentsResult.rowCount,
      upcoming_7days_count: upcomingResult.rows[0]?.upcoming_count || 0,
    };
  },
};

doctorService.addDoctor = async (payload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      email,
      password,
      first_name,
      last_name,
      specialization_id,
      license_number,
      years_of_experience,
      consultation_fee,
      bio,
    } = payload;

    // 1. Check if user already exists (from register call)
    const userCheck = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    let userId;
    if (userCheck.rowCount > 0) {
      // User already exists from register call
      userId = userCheck.rows[0].id;

      // Update user profile if it exists
      const profileCheck = await client.query(
        `SELECT id FROM user_profiles WHERE user_id = $1`,
        [userId],
      );

      if (profileCheck.rowCount > 0) {
        await client.query(
          `UPDATE user_profiles SET first_name = $1, last_name = $2 WHERE user_id = $3`,
          [first_name, last_name, userId],
        );
      } else {
        await client.query(
          `INSERT INTO user_profiles (user_id, first_name, last_name)
           VALUES ($1, $2, $3)`,
          [userId, first_name, last_name],
        );
      }
    } else {
      // Create new user (for backwards compatibility)
      const hashedPassword = await bcrypt.hash(password, 12);

      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, 'doctor')
         RETURNING id`,
        [email, hashedPassword],
      );

      userId = userResult.rows[0].id;

      // Create profile
      await client.query(
        `INSERT INTO user_profiles (user_id, first_name, last_name)
         VALUES ($1, $2, $3)`,
        [userId, first_name, last_name],
      );
    }

    // 2. Check if doctor record already exists for this user
    const doctorCheck = await client.query(
      `SELECT id FROM doctors WHERE user_id = $1`,
      [userId],
    );

    let doctorResult;
    if (doctorCheck.rowCount > 0) {
      // Update existing doctor record
      doctorResult = await client.query(
        `UPDATE doctors SET 
          specialization_id = $1,
          license_number = $2,
          years_of_experience = $3,
          consultation_fee = $4,
          bio = $5
        WHERE user_id = $6
        RETURNING *`,
        [
          specialization_id,
          license_number,
          years_of_experience || 0,
          consultation_fee || 0,
          bio || null,
          userId,
        ],
      );
    } else {
      // Create new doctor record
      doctorResult = await client.query(
        `INSERT INTO doctors (
          user_id,
          specialization_id,
          license_number,
          years_of_experience,
          consultation_fee,
          bio
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          userId,
          specialization_id,
          license_number,
          years_of_experience || 0,
          consultation_fee || 0,
          bio || null,
        ],
      );
    }

    await client.query("COMMIT");
    return doctorResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const appointmentService = {
  bookAppointment: async ({
    user_id,
    doctor_id,
    hospital_id,
    schedule_id,
    appointment_date,
    start_time,
    end_time,
    reason,
  }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const doctorLock = await client.query(
        "SELECT id FROM doctors WHERE id = $1 FOR UPDATE",
        [doctor_id],
      );
      if (!doctorLock.rowCount) {
        throw new Error("Doctor not found");
      }

      const scheduleResult = await client.query(
        `
					SELECT id
					FROM doctor_schedules
					WHERE id = $1
						AND doctor_id = $2
						AND is_active = TRUE
            AND day_of_week::int = EXTRACT(DOW FROM $3::date)::int
						AND start_time <= $4::time
						AND end_time >= $5::time
				`,
        [schedule_id, doctor_id, appointment_date, start_time, end_time],
      );

      if (!scheduleResult.rowCount) {
        throw new Error(
          "Selected schedule is not available for the requested slot",
        );
      }

      const overlapResult = await client.query(
        `
					SELECT id
					FROM appointments
					WHERE doctor_id = $1
						AND appointment_date = $2
						AND status = ANY($3::appointment_status[])
						AND NOT (end_time <= $4::time OR start_time >= $5::time)
					FOR UPDATE
				`,
        [
          doctor_id,
          appointment_date,
          APPOINTMENT_ACTIVE_STATUSES,
          start_time,
          end_time,
        ],
      );

      if (overlapResult.rowCount) {
        throw new Error("Time slot is already booked");
      }

      const insertResult = await client.query(
        `
					INSERT INTO appointments (
						user_id,
						doctor_id,
						hospital_id,
						schedule_id,
						appointment_date,
						start_time,
						end_time,
						status,
						reason
					)
					VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
					RETURNING *
				`,
        [
          user_id,
          doctor_id,
          hospital_id || null,
          schedule_id,
          appointment_date,
          start_time,
          end_time,
          reason || null,
        ],
      );

      await client.query("COMMIT");

      await createNotification(
        user_id,
        "Appointment Confirmed",
        "Your appointment has been booked successfully.",
        "appointment",
        { appointment_id: insertResult.rows[0].id },
      );

      return insertResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  cancelAppointment: async ({ appointmentId, userId }) => {
    const result = await pool.query(
      `
				UPDATE appointments
				SET status = 'cancelled',
						cancelled_by = $2,
						cancelled_at = NOW()
				WHERE id = $1
					AND user_id = $2
					AND status = ANY($3::appointment_status[])
				RETURNING *
			`,
      [appointmentId, userId, APPOINTMENT_ACTIVE_STATUSES],
    );

    return result.rows[0] || null;
  },

  rescheduleAppointment: async ({
    appointmentId,
    userId,
    new_appointment_date,
    new_start_time,
    new_end_time,
    reason,
  }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const appointmentResult = await client.query(
        `
					SELECT *
					FROM appointments
					WHERE id = $1
						AND user_id = $2
					FOR UPDATE
				`,
        [appointmentId, userId],
      );

      if (!appointmentResult.rowCount) {
        throw new Error("Appointment not found");
      }

      const appointment = appointmentResult.rows[0];
      if (
        !["pending", "confirmed", "rescheduled"].includes(appointment.status)
      ) {
        throw new Error("Only active appointments can be rescheduled");
      }

      const overlapResult = await client.query(
        `
					SELECT id
					FROM appointments
					WHERE doctor_id = $1
						AND id <> $2
						AND appointment_date = $3
						AND status = ANY($4::appointment_status[])
						AND NOT (end_time <= $5::time OR start_time >= $6::time)
					FOR UPDATE
				`,
        [
          appointment.doctor_id,
          appointmentId,
          new_appointment_date,
          APPOINTMENT_ACTIVE_STATUSES,
          new_start_time,
          new_end_time,
        ],
      );

      if (overlapResult.rowCount) {
        throw new Error("Requested reschedule slot is unavailable");
      }

      await client.query(
        `
					INSERT INTO appointment_reschedules (
						appointment_id,
						old_appointment_date,
						old_start_time,
						old_end_time,
						new_appointment_date,
						new_start_time,
						new_end_time,
						rescheduled_by,
						reason
					)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				`,
        [
          appointmentId,
          appointment.appointment_date,
          appointment.start_time,
          appointment.end_time,
          new_appointment_date,
          new_start_time,
          new_end_time,
          userId,
          reason || null,
        ],
      );

      const updateResult = await client.query(
        `
					UPDATE appointments
					SET appointment_date = $2,
							start_time = $3,
							end_time = $4,
							status = 'rescheduled'
					WHERE id = $1
					RETURNING *
				`,
        [appointmentId, new_appointment_date, new_start_time, new_end_time],
      );

      await client.query("COMMIT");

      await createNotification(
        userId,
        "Appointment Rescheduled",
        "Your appointment has been rescheduled.",
        "appointment",
        { appointment_id: appointmentId },
      );

      return updateResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getUserAppointments: async ({ userId, status, page, limit, offset }) => {
    const values = [userId];
    let statusClause = "";

    if (status) {
      values.push(status);
      statusClause = `AND a.status = $${values.length}`;
    }

    values.push(limit);
    values.push(offset);

    const query = `
			SELECT
				a.*,
				d.specialization_id,
				s.name AS specialization_name,
				up.first_name AS doctor_first_name,
				up.last_name AS doctor_last_name,
				h.name AS hospital_name
			FROM appointments a
			JOIN doctors d ON d.id = a.doctor_id
			LEFT JOIN specializations s ON s.id = d.specialization_id
			LEFT JOIN user_profiles up ON up.user_id = d.user_id
			LEFT JOIN hospitals h ON h.id = a.hospital_id
			WHERE a.user_id = $1
			${statusClause}
			ORDER BY a.appointment_date DESC, a.start_time DESC
			LIMIT $${values.length - 1}
			OFFSET $${values.length}
		`;

    const countValues = values.slice(0, values.length - 2);
    const countQuery = `
			SELECT COUNT(*)::int AS total
			FROM appointments a
			WHERE a.user_id = $1
			${statusClause}
		`;

    const [listResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, countValues),
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },
};

const medicalService = {
  addMedicalHistory: async (payload) => {
    const {
      user_id,
      allergies,
      chronic_conditions,
      current_medications,
      surgeries,
      family_history,
      notes,
      is_visible_to_doctors,
    } = payload;

    const result = await pool.query(
      `
				INSERT INTO medical_history (
					user_id,
					allergies,
					chronic_conditions,
					current_medications,
					surgeries,
					family_history,
					notes,
					is_visible_to_doctors
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, FALSE))
				RETURNING *
			`,
      [
        user_id,
        allergies || null,
        chronic_conditions || null,
        current_medications || null,
        surgeries || null,
        family_history || null,
        notes || null,
        is_visible_to_doctors,
      ],
    );

    return result.rows[0];
  },

  updateMedicalHistory: async (userId, payload) => {
    const updatableFields = [
      "allergies",
      "chronic_conditions",
      "current_medications",
      "surgeries",
      "family_history",
      "notes",
    ];

    const entries = Object.entries(payload).filter(([key]) =>
      updatableFields.includes(key),
    );
    if (!entries.length) {
      throw new Error("No updatable medical history fields provided");
    }

    const setClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = entries.map(([, value]) => value);
    values.push(userId);

    const result = await pool.query(
      `
				UPDATE medical_history
				SET ${setClause}
				WHERE user_id = $${values.length}
				RETURNING *
			`,
      values,
    );

    return result.rows[0] || null;
  },

  toggleMedicalVisibility: async (userId, isVisible) => {
    const result = await pool.query(
      `
				UPDATE medical_history
				SET is_visible_to_doctors = $2
				WHERE user_id = $1
				RETURNING *
			`,
      [userId, isVisible],
    );

    return result.rows[0] || null;
  },
};

const paymentService = {
  createPayment: async ({
    appointment_id,
    user_id,
    currency,
    provider,
    payment_method,
    provider_payment_id,
    metadata,
  }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const appointmentResult = await client.query(
        `
          SELECT a.*, d.consultation_fee
          FROM appointments a
          JOIN doctors d ON d.id = a.doctor_id
          WHERE a.id = $1 AND a.user_id = $2
          FOR UPDATE
        `,
        [appointment_id, user_id],
      );

      if (!appointmentResult.rowCount) {
        throw new Error("Appointment not found for this user");
      }

      const appointment = appointmentResult.rows[0];
      if (!["pending", "rescheduled", "confirmed"].includes(appointment.status)) {
        throw new Error("Payment is allowed only for active appointments");
      }

      const quote = getPaymentQuote(
        Number(appointment.consultation_fee),
        payment_method || provider,
      );

      const paymentResult = await client.query(
        `
          INSERT INTO payments (
            appointment_id,
            user_id,
            amount,
            currency,
            provider,
            payment_method,
            provider_payment_id,
            amount_breakdown,
            metadata,
            status
          )
          VALUES (
            $1, $2, $3, COALESCE($4, 'USD'), $5, $6, $7, $8::jsonb, $9::jsonb, 'pending'
          )
          ON CONFLICT (appointment_id)
          DO UPDATE SET
            amount = EXCLUDED.amount,
            currency = EXCLUDED.currency,
            provider = EXCLUDED.provider,
            payment_method = EXCLUDED.payment_method,
            provider_payment_id = EXCLUDED.provider_payment_id,
            amount_breakdown = EXCLUDED.amount_breakdown,
            metadata = EXCLUDED.metadata,
            status = 'pending',
            paid_at = NULL
          RETURNING *
        `,
        [
          appointment_id,
          user_id,
          quote.total_amount,
          currency || "USD",
          provider,
          quote.payment_method,
          provider_payment_id || null,
          JSON.stringify(quote),
          JSON.stringify(metadata || {}),
        ],
      );

      await client.query("COMMIT");
      return {
        ...paymentResult.rows[0],
        quote,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  verifyPayment: async ({ paymentId, user_id, status, provider_payment_id }) => {
    const allowed = ["paid", "failed", "refunded"];
    if (!allowed.includes(status)) {
      throw new Error("Invalid payment verification status");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const paymentResult = await client.query(
        `
          UPDATE payments
          SET
            status = $2,
            provider_payment_id = COALESCE($3, provider_payment_id),
            paid_at = CASE WHEN $2 = 'paid' THEN NOW() ELSE paid_at END
          WHERE id = $1
            AND user_id = $4
          RETURNING *
        `,
        [paymentId, status, provider_payment_id || null, user_id],
      );

      if (!paymentResult.rowCount) {
        await client.query("ROLLBACK");
        return null;
      }

      const payment = paymentResult.rows[0];
      if (status === "paid") {
        await client.query(
          `
            UPDATE appointments
            SET status = 'confirmed'
            WHERE id = $1 AND user_id = $2
          `,
          [payment.appointment_id, user_id],
        );
      } else if (status === "failed") {
        await client.query(
          `
            UPDATE appointments
            SET status = 'cancelled', cancelled_by = $2, cancelled_at = NOW()
            WHERE id = $1 AND user_id = $2 AND status = 'pending'
          `,
          [payment.appointment_id, user_id],
        );
      }

      await client.query("COMMIT");
      return payment;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

const notificationService = {
  getUserNotifications: async ({ userId, page, limit, offset }) => {
    const [listResult, countResult] = await Promise.all([
      pool.query(
        `
					SELECT *
					FROM notifications
					WHERE user_id = $1
					ORDER BY created_at DESC
					LIMIT $2
					OFFSET $3
				`,
        [userId, limit, offset],
      ),
      pool.query(
        `
					SELECT COUNT(*)::int AS total
					FROM notifications
					WHERE user_id = $1
				`,
        [userId],
      ),
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  markNotificationAsRead: async ({ notificationId, userId }) => {
    const result = await pool.query(
      `
				UPDATE notifications
				SET is_read = TRUE,
						read_at = NOW()
				WHERE id = $1
					AND user_id = $2
				RETURNING *
			`,
      [notificationId, userId],
    );

    return result.rows[0] || null;
  },
};

const reviewService = {
  addDoctorReview: async ({
    doctor_id,
    user_id,
    appointment_id,
    rating,
    review_text,
  }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const reviewResult = await client.query(
        `
					INSERT INTO doctor_reviews (doctor_id, user_id, appointment_id, rating, review_text)
					VALUES ($1, $2, $3, $4, $5)
					RETURNING *
				`,
        [
          doctor_id,
          user_id,
          appointment_id || null,
          rating,
          review_text || null,
        ],
      );

      await client.query(
        `
					UPDATE doctors
					SET average_rating = rating_data.avg_rating,
							total_reviews = rating_data.total_reviews
					FROM (
						SELECT doctor_id, AVG(rating)::numeric(3,2) AS avg_rating, COUNT(*)::int AS total_reviews
						FROM doctor_reviews
						WHERE doctor_id = $1
						GROUP BY doctor_id
					) AS rating_data
					WHERE doctors.id = rating_data.doctor_id
				`,
        [doctor_id],
      );

      await client.query("COMMIT");
      return reviewResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

const authController = {
  registerUser: asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return sendError(res, 400, "email and password are required");
    }

    const user = await authService.registerUser({
      email,
      password,
      role: role || "user",
    });
    sendSuccess(res, 201, "User registered successfully", user);
  }),

  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, "email and password are required");
    }

    const user = await authService.loginUser({ email, password });
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    sendSuccess(res, 200, "Login successful", user);
  }),
};

const profileController = {
  createProfile: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.body.user_id);
    if (!userId || !req.body.first_name || !req.body.last_name) {
      return sendError(
        res,
        400,
        "user_id, first_name and last_name are required",
      );
    }

    const profile = await profileService.createProfile({
      ...req.body,
      user_id: userId,
    });
    sendSuccess(res, 201, "Profile created successfully", profile);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const profile = await profileService.updateProfile(userId, req.body);
    if (!profile) {
      return sendError(res, 404, "Profile not found");
    }

    sendSuccess(res, 200, "Profile updated successfully", profile);
  }),

  getProfile: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return sendError(res, 404, "Profile not found");
    }

    sendSuccess(res, 200, "Profile fetched successfully", profile);
  }),
};

const doctorController = {
  getAllDoctors: asyncHandler(async (req, res) => {
    const specializationId = req.query.specialization_id
      ? normalizeNumericId(req.query.specialization_id)
      : null;
    const minRating =
      req.query.min_rating !== undefined ? Number(req.query.min_rating) : null;
    const { page, limit, offset } = parsePagination(req.query);

    const data = await doctorService.getAllDoctors({
      specializationId,
      minRating,
      page,
      limit,
      offset,
    });

    sendSuccess(res, 200, "Doctors fetched successfully", data);
  }),

  getDoctorDetails: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) {
      return sendError(res, 400, "Valid doctorId is required");
    }

    const doctor = await doctorService.getDoctorDetails(doctorId);
    if (!doctor) {
      return sendError(res, 404, "Doctor not found");
    }

    sendSuccess(res, 200, "Doctor details fetched successfully", doctor);
  }),

  getAvailableSchedules: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) {
      return sendError(res, 400, "Valid doctorId is required");
    }

    const availability = await doctorService.getAvailableSchedules(
      doctorId,
      req.query.date || null,
    );
    sendSuccess(res, 200, "Schedules fetched successfully", availability);
  }),

  // ── DOCTOR SITE CONTROLLERS ──
  getDoctorAppointments: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) return sendError(res, 400, "Valid doctorId is required");
    const { page, limit, offset } = parsePagination(req.query);
    const data = await doctorService.getDoctorAppointments({
      doctorId,
      date: req.query.date || null,
      month: req.query.month ? Number(req.query.month) : null,
      year: req.query.year ? Number(req.query.year) : null,
      page,
      limit,
      offset,
    });
    sendSuccess(res, 200, "Doctor appointments fetched successfully", data);
  }),

  getDoctorPatients: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) return sendError(res, 400, "Valid doctorId is required");
    const { page, limit, offset } = parsePagination(req.query);
    const data = await doctorService.getDoctorPatients({
      doctorId,
      page,
      limit,
      offset,
    });
    sendSuccess(res, 200, "Doctor patients fetched successfully", data);
  }),

  setAvailability: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) return sendError(res, 400, "Valid doctorId is required");

    const {
      type,
      day_of_week,
      specific_date,
      start_time,
      end_time,
      max_patients,
      hospital_id,
      slot_duration_minutes,
    } = req.body;
    if (!type || !["day", "date"].includes(type))
      return sendError(res, 400, "type must be 'day' or 'date'");
    if (type === "day" && (day_of_week === undefined || day_of_week === null))
      return sendError(res, 400, "day_of_week (0-6) required for type 'day'");
    if (type === "date" && !specific_date)
      return sendError(res, 400, "specific_date required for type 'date'");
    if (!start_time || !end_time)
      return sendError(res, 400, "start_time and end_time are required");

    const schedule = await doctorService.setAvailability({
      doctorId,
      hospitalId: hospital_id ? normalizeNumericId(hospital_id) : null,
      type,
      day_of_week,
      specific_date,
      start_time,
      end_time,
      max_patients: max_patients || 1,
      slot_duration_minutes: slot_duration_minutes || 30,
    });
    sendSuccess(res, 201, "Availability set successfully", schedule);
  }),

  getDoctorPanel: asyncHandler(async (req, res) => {
    const doctorId = normalizeNumericId(req.params.doctorId);
    if (!doctorId) return sendError(res, 400, "Valid doctorId is required");
    const panel = await doctorService.getDoctorPanel(doctorId);
    sendSuccess(res, 200, "Doctor panel fetched successfully", panel);
  }),
};

doctorController.addDoctor = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    specialization_id,
    license_number,
  } = req.body;

  if (
    !email ||
    !password ||
    !first_name ||
    !last_name ||
    !specialization_id ||
    !license_number
  ) {
    return sendError(res, 400, "Missing required fields");
  }

  const doctor = await doctorService.addDoctor(req.body);

  sendSuccess(res, 201, "Doctor created successfully", doctor);
});

const appointmentController = {
  bookAppointment: asyncHandler(async (req, res) => {
    const payload = {
      user_id: normalizeNumericId(req.body.user_id),
      doctor_id: normalizeNumericId(req.body.doctor_id),
      hospital_id: req.body.hospital_id
        ? normalizeNumericId(req.body.hospital_id)
        : null,
      schedule_id: normalizeNumericId(req.body.schedule_id),
      appointment_date: req.body.appointment_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      reason: req.body.reason,
    };

    if (
      !payload.user_id ||
      !payload.doctor_id ||
      !payload.schedule_id ||
      !payload.appointment_date ||
      !payload.start_time ||
      !payload.end_time
    ) {
      return sendError(
        res,
        400,
        "user_id, doctor_id, schedule_id, appointment_date, start_time and end_time are required",
      );
    }

    const appointment = await appointmentService.bookAppointment(payload);
    sendSuccess(res, 201, "Appointment booked successfully", appointment);
  }),

  cancelAppointment: asyncHandler(async (req, res) => {
    const appointmentId = normalizeNumericId(req.params.appointmentId);
    const userId = normalizeNumericId(req.body.user_id);

    if (!appointmentId || !userId) {
      return sendError(
        res,
        400,
        "Valid appointmentId and user_id are required",
      );
    }

    const appointment = await appointmentService.cancelAppointment({
      appointmentId,
      userId,
    });
    if (!appointment) {
      return sendError(res, 404, "Active appointment not found for this user");
    }

    await createNotification(
      userId,
      "Appointment Cancelled",
      "Your appointment has been cancelled.",
      "appointment",
      { appointment_id: appointmentId },
    );

    sendSuccess(res, 200, "Appointment cancelled successfully", appointment);
  }),

  rescheduleAppointment: asyncHandler(async (req, res) => {
    const appointmentId = normalizeNumericId(req.params.appointmentId);
    const userId = normalizeNumericId(req.body.user_id);

    if (
      !appointmentId ||
      !userId ||
      !req.body.new_appointment_date ||
      !req.body.new_start_time ||
      !req.body.new_end_time
    ) {
      return sendError(
        res,
        400,
        "appointmentId, user_id, new_appointment_date, new_start_time and new_end_time are required",
      );
    }

    const appointment = await appointmentService.rescheduleAppointment({
      appointmentId,
      userId,
      new_appointment_date: req.body.new_appointment_date,
      new_start_time: req.body.new_start_time,
      new_end_time: req.body.new_end_time,
      reason: req.body.reason,
    });

    sendSuccess(res, 200, "Appointment rescheduled successfully", appointment);
  }),

  getUserAppointments: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const { page, limit, offset } = parsePagination(req.query);
    const data = await appointmentService.getUserAppointments({
      userId,
      status: req.query.status || null,
      page,
      limit,
      offset,
    });

    sendSuccess(res, 200, "Appointments fetched successfully", data);
  }),

  getCompletedAppointments: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const { page, limit, offset } = parsePagination(req.query);
    const data = await appointmentService.getUserAppointments({
      userId,
      status: "completed",
      page,
      limit,
      offset,
    });

    sendSuccess(res, 200, "Completed appointments fetched successfully", data);
  }),
};

const medicalController = {
  addMedicalHistory: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.body.user_id);
    if (!userId) {
      return sendError(res, 400, "Valid user_id is required");
    }

    const medicalHistory = await medicalService.addMedicalHistory({
      ...req.body,
      user_id: userId,
    });
    sendSuccess(
      res,
      201,
      "Medical history created successfully",
      medicalHistory,
    );
  }),

  updateMedicalHistory: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const medicalHistory = await medicalService.updateMedicalHistory(
      userId,
      req.body,
    );
    if (!medicalHistory) {
      return sendError(res, 404, "Medical history not found");
    }

    sendSuccess(
      res,
      200,
      "Medical history updated successfully",
      medicalHistory,
    );
  }),

  toggleMedicalVisibility: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId || typeof req.body.is_visible_to_doctors !== "boolean") {
      return sendError(
        res,
        400,
        "Valid userId and is_visible_to_doctors boolean are required",
      );
    }

    const medicalHistory = await medicalService.toggleMedicalVisibility(
      userId,
      req.body.is_visible_to_doctors,
    );
    if (!medicalHistory) {
      return sendError(res, 404, "Medical history not found");
    }

    sendSuccess(
      res,
      200,
      "Medical visibility updated successfully",
      medicalHistory,
    );
  }),
};

const paymentController = {
  createPayment: asyncHandler(async (req, res) => {
    const payload = {
      appointment_id: normalizeNumericId(req.body.appointment_id),
      user_id: normalizeNumericId(req.body.user_id),
      currency: req.body.currency,
      provider: req.body.provider,
      payment_method: req.body.payment_method,
      provider_payment_id: req.body.provider_payment_id,
      metadata: req.body.metadata,
    };

    if (
      !payload.appointment_id ||
      !payload.user_id ||
      !payload.provider
    ) {
      return sendError(
        res,
        400,
        "appointment_id, user_id and provider are required",
      );
    }

    const payment = await paymentService.createPayment(payload);
    sendSuccess(res, 201, "Payment created successfully", payment);
  }),

  verifyPayment: asyncHandler(async (req, res) => {
    const paymentId = normalizeNumericId(req.params.paymentId);
    const userId = normalizeNumericId(req.body.user_id);
    const { status, provider_payment_id } = req.body;

    if (!paymentId || !userId || !status) {
      return sendError(
        res,
        400,
        "Valid paymentId, user_id and status are required",
      );
    }

    const payment = await paymentService.verifyPayment({
      paymentId,
      user_id: userId,
      status,
      provider_payment_id,
    });
    if (!payment) {
      return sendError(res, 404, "Payment not found");
    }

    if (status === "paid") {
      await createNotification(
        userId,
        "Payment Successful",
        "Payment received and your appointment is confirmed.",
        "payment",
        { payment_id: payment.id, appointment_id: payment.appointment_id },
      );
    }

    if (status === "failed") {
      await createNotification(
        userId,
        "Payment Failed",
        "Payment failed and the pending appointment was cancelled.",
        "payment",
        { payment_id: payment.id, appointment_id: payment.appointment_id },
      );
    }

    sendSuccess(res, 200, "Payment verified successfully", payment);
  }),
};

const notificationController = {
  getUserNotifications: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) {
      return sendError(res, 400, "Valid userId is required");
    }

    const { page, limit, offset } = parsePagination(req.query);
    const data = await notificationService.getUserNotifications({
      userId,
      page,
      limit,
      offset,
    });
    sendSuccess(res, 200, "Notifications fetched successfully", data);
  }),

  markNotificationAsRead: asyncHandler(async (req, res) => {
    const notificationId = normalizeNumericId(req.params.notificationId);
    const userId = normalizeNumericId(req.body.user_id);

    if (!notificationId || !userId) {
      return sendError(
        res,
        400,
        "Valid notificationId and user_id are required",
      );
    }

    const notification = await notificationService.markNotificationAsRead({
      notificationId,
      userId,
    });
    if (!notification) {
      return sendError(res, 404, "Notification not found");
    }

    sendSuccess(res, 200, "Notification marked as read", notification);
  }),
};

const reviewController = {
  addDoctorReview: asyncHandler(async (req, res) => {
    const payload = {
      doctor_id: normalizeNumericId(req.body.doctor_id),
      user_id: normalizeNumericId(req.body.user_id),
      appointment_id: req.body.appointment_id
        ? normalizeNumericId(req.body.appointment_id)
        : null,
      rating: Number(req.body.rating),
      review_text: req.body.review_text,
    };

    if (
      !payload.doctor_id ||
      !payload.user_id ||
      !Number.isInteger(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      return sendError(
        res,
        400,
        "doctor_id, user_id and rating (1-5) are required",
      );
    }

    const review = await reviewService.addDoctorReview(payload);
    sendSuccess(res, 201, "Doctor review added successfully", review);
  }),
};

// ── ADMIN SERVICE ──
const adminService = {
  // Dashboard analytics
  getDashboardStats: async () => {
    const today = new Date().toISOString().split("T")[0];

    const [
      totalUsersResult,
      totalDoctorsResult,
      totalAppointmentsResult,
      todayAppointmentsResult,
      appointmentsByStatusResult,
      newUsersThisMonthResult,
      topDoctorsResult,
      revenueResult,
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::int AS total FROM users WHERE role = 'user'`,
      ),
      pool.query(
        `SELECT COUNT(*)::int AS total FROM users WHERE role = 'doctor'`,
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM appointments`),
      pool.query(
        `SELECT COUNT(*)::int AS total FROM appointments WHERE appointment_date = $1`,
        [today],
      ),
      pool.query(
        `SELECT status, COUNT(*)::int AS count FROM appointments GROUP BY status ORDER BY count DESC`,
      ),
      pool.query(
        `SELECT COUNT(*)::int AS total FROM users
         WHERE role='user' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`,
      ),
      pool.query(
        `SELECT d.id, up.first_name, up.last_name, s.name AS specialization,
           d.average_rating, d.total_reviews,
           COUNT(a.id)::int AS total_appointments
         FROM doctors d
         LEFT JOIN user_profiles up ON up.user_id = d.user_id
         LEFT JOIN specializations s ON s.id = d.specialization_id
         LEFT JOIN appointments a ON a.doctor_id = d.id
         GROUP BY d.id, up.first_name, up.last_name, s.name, d.average_rating, d.total_reviews
         ORDER BY total_appointments DESC LIMIT 5`,
      ),
      pool.query(
        `SELECT COALESCE(SUM(amount), 0)::numeric AS total_revenue,
           COALESCE(SUM(CASE WHEN DATE_TRUNC('month',created_at)=DATE_TRUNC('month',NOW()) THEN amount END),0)::numeric AS revenue_this_month
         FROM payments WHERE status='paid'`,
      ),
    ]);

    // Appointments per month (last 6 months)
    const monthlyResult = await pool.query(
      `SELECT TO_CHAR(appointment_date,'YYYY-MM') AS month, COUNT(*)::int AS count
       FROM appointments
       WHERE appointment_date >= NOW() - INTERVAL '6 months'
       GROUP BY month ORDER BY month ASC`,
    );

    return {
      totals: {
        patients: totalUsersResult.rows[0]?.total || 0,
        doctors: totalDoctorsResult.rows[0]?.total || 0,
        appointments: totalAppointmentsResult.rows[0]?.total || 0,
        today_appointments: todayAppointmentsResult.rows[0]?.total || 0,
        new_patients_this_month: newUsersThisMonthResult.rows[0]?.total || 0,
      },
      revenue: revenueResult.rows[0] || {
        total_revenue: 0,
        revenue_this_month: 0,
      },
      appointments_by_status: appointmentsByStatusResult.rows,
      monthly_appointments: monthlyResult.rows,
      top_doctors: topDoctorsResult.rows,
    };
  },

  // Get all patients (users with role='user')
  getAllPatients: async ({ search, page, limit, offset }) => {
    const values = [];
    let searchClause = "";
    if (search) {
      values.push(`%${search}%`);
      searchClause = `AND (u.email ILIKE $${values.length} OR up.first_name ILIKE $${values.length} OR up.last_name ILIKE $${values.length})`;
    }
    values.push(limit);
    values.push(offset);

    const query = `
      SELECT u.id, u.email, u.is_active, u.created_at,
        up.first_name, up.last_name, up.phone, up.date_of_birth, up.gender, up.blood_group,
        up.city, up.country,
        (SELECT COUNT(*)::int FROM appointments WHERE user_id = u.id) AS total_appointments
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.role = 'user' ${searchClause}
      ORDER BY u.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const countValues = values.slice(0, values.length - 2);
    const countQuery = `SELECT COUNT(*)::int AS total FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.role='user' ${searchClause}`;

    const [listResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, countValues),
    ]);
    const total = countResult.rows[0]?.total || 0;
    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  // Get all doctors with stats
  getAllDoctorsAdmin: async ({
    search,
    specializationId,
    page,
    limit,
    offset,
  }) => {
    const filters = ["u.role = 'doctor'"];
    const values = [];
    if (search) {
      values.push(`%${search}%`);
      filters.push(
        `(u.email ILIKE $${values.length} OR up.first_name ILIKE $${values.length} OR up.last_name ILIKE $${values.length})`,
      );
    }
    if (specializationId) {
      values.push(specializationId);
      filters.push(`d.specialization_id = $${values.length}`);
    }
    const whereClause = `WHERE ${filters.join(" AND ")}`;
    values.push(limit);
    values.push(offset);

    const query = `
      SELECT u.id AS user_id, u.email, u.is_active, u.created_at,
        d.id AS doctor_id, d.license_number, d.years_of_experience, d.consultation_fee,
        d.average_rating, d.total_reviews, d.bio,
        s.name AS specialization_name,
        up.first_name, up.last_name, up.phone,
        (SELECT COUNT(*)::int FROM appointments WHERE doctor_id = d.id) AS total_appointments,
        (SELECT COUNT(DISTINCT user_id)::int FROM appointments WHERE doctor_id = d.id) AS total_patients
      FROM users u
      JOIN doctors d ON d.user_id = u.id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      LEFT JOIN specializations s ON s.id = d.specialization_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const countValues = values.slice(0, values.length - 2);
    const countQuery = `
      SELECT COUNT(*)::int AS total FROM users u
      JOIN doctors d ON d.user_id = u.id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      ${whereClause}`;

    const [listResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, countValues),
    ]);
    const total = countResult.rows[0]?.total || 0;
    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit) || 1,
      items: listResult.rows,
    };
  },

  // Toggle user active/inactive status (soft delete)
  setUserActiveStatus: async (userId, isActive) => {
    const result = await pool.query(
      `UPDATE users SET is_active=$2 WHERE id=$1 RETURNING id, email, role, is_active`,
      [userId, isActive],
    );
    return result.rows[0] || null;
  },

  // Hard delete a user (cascades based on DB FK constraints)
  deleteUser: async (userId) => {
    const result = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING id, email, role`,
      [userId],
    );
    return result.rows[0] || null;
  },

  // Per-doctor analytics: how many patients each doctor sees
  getDoctorPatientAnalytics: async () => {
    const result = await pool.query(
      `SELECT d.id AS doctor_id,
         up.first_name, up.last_name,
         s.name AS specialization,
         d.average_rating,
         COUNT(DISTINCT a.user_id)::int AS unique_patients,
         COUNT(a.id)::int AS total_appointments,
         COUNT(CASE WHEN a.status='completed' THEN 1 END)::int AS completed_appointments,
         COUNT(CASE WHEN a.status='cancelled' THEN 1 END)::int AS cancelled_appointments,
         COUNT(CASE WHEN a.appointment_date = CURRENT_DATE THEN 1 END)::int AS today_appointments
       FROM doctors d
       LEFT JOIN user_profiles up ON up.user_id = d.user_id
       LEFT JOIN specializations s ON s.id = d.specialization_id
       LEFT JOIN appointments a ON a.doctor_id = d.id
       GROUP BY d.id, up.first_name, up.last_name, s.name, d.average_rating
       ORDER BY unique_patients DESC`,
    );
    return result.rows;
  },
};

// ── ADMIN CONTROLLER ──
const adminController = {
  getDashboardStats: asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, 200, "Dashboard stats fetched successfully", stats);
  }),

  getAllPatients: asyncHandler(async (req, res) => {
    const { page, limit, offset } = parsePagination(req.query);
    const data = await adminService.getAllPatients({
      search: req.query.search || null,
      page,
      limit,
      offset,
    });
    sendSuccess(res, 200, "Patients fetched successfully", data);
  }),

  getAllDoctorsAdmin: asyncHandler(async (req, res) => {
    const { page, limit, offset } = parsePagination(req.query);
    const specializationId = req.query.specialization_id
      ? normalizeNumericId(req.query.specialization_id)
      : null;
    const data = await adminService.getAllDoctorsAdmin({
      search: req.query.search || null,
      specializationId,
      page,
      limit,
      offset,
    });
    sendSuccess(res, 200, "Doctors fetched successfully", data);
  }),

  setUserActiveStatus: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId || typeof req.body.is_active !== "boolean")
      return sendError(
        res,
        400,
        "Valid userId and is_active boolean are required",
      );
    const user = await adminService.setUserActiveStatus(
      userId,
      req.body.is_active,
    );
    if (!user) return sendError(res, 404, "User not found");
    sendSuccess(
      res,
      200,
      `User ${req.body.is_active ? "activated" : "deactivated"} successfully`,
      user,
    );
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const userId = normalizeNumericId(req.params.userId);
    if (!userId) return sendError(res, 400, "Valid userId is required");
    const user = await adminService.deleteUser(userId);
    if (!user) return sendError(res, 404, "User not found");
    sendSuccess(res, 200, "User deleted successfully", user);
  }),

  getDoctorPatientAnalytics: asyncHandler(async (req, res) => {
    const data = await adminService.getDoctorPatientAnalytics();
    sendSuccess(res, 200, "Doctor analytics fetched successfully", data);
  }),
};

router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);

router.post("/profile", profileController.createProfile);
router.put("/profile/:userId", profileController.updateProfile);
router.get("/profile/:userId", profileController.getProfile);

router.get("/doctors", doctorController.getAllDoctors);
router.get("/doctors/:doctorId", doctorController.getDoctorDetails);
router.get(
  "/doctors/:doctorId/schedules",
  doctorController.getAvailableSchedules,
);

// ── Specializations ──
router.get(
  "/specializations",
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      `SELECT id, name FROM specializations ORDER BY name ASC`,
    );
    sendSuccess(res, 200, "Specializations fetched successfully", result.rows);
  }),
);

router.post(
  "/specializations",
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return sendError(res, 400, "Specialization name is required");
    }

    try {
      const result = await pool.query(
        `INSERT INTO specializations (name, description) 
         VALUES ($1, $2) 
         RETURNING id, name, description`,
        [name.trim(), description || null],
      );
      sendSuccess(
        res,
        201,
        "Specialization created successfully",
        result.rows[0],
      );
    } catch (err) {
      if (err.code === "23505") {
        return sendError(res, 409, "Specialization already exists");
      }
      throw err;
    }
  }),
);

// ── Doctor Site Routes ──
router.get(
  "/doctors/:doctorId/appointments",
  doctorController.getDoctorAppointments,
);
router.get("/doctors/:doctorId/patients", doctorController.getDoctorPatients);
router.post(
  "/doctors/:doctorId/availability",
  doctorController.setAvailability,
);
router.get("/doctors/:doctorId/panel", doctorController.getDoctorPanel);

router.post("/appointments", appointmentController.bookAppointment);
router.patch(
  "/appointments/:appointmentId/cancel",
  appointmentController.cancelAppointment,
);
router.patch(
  "/appointments/:appointmentId/reschedule",
  appointmentController.rescheduleAppointment,
);
router.get(
  "/users/:userId/appointments",
  appointmentController.getUserAppointments,
);
router.get(
  "/users/:userId/appointments/completed",
  appointmentController.getCompletedAppointments,
);

router.post("/medical-history", medicalController.addMedicalHistory);
router.put("/medical-history/:userId", medicalController.updateMedicalHistory);
router.patch(
  "/medical-history/:userId/visibility",
  medicalController.toggleMedicalVisibility,
);

router.post("/payments", paymentController.createPayment);
router.patch("/payments/:paymentId/verify", paymentController.verifyPayment);

router.get(
  "/users/:userId/notifications",
  notificationController.getUserNotifications,
);
router.patch(
  "/notifications/:notificationId/read",
  notificationController.markNotificationAsRead,
);

router.post("/reviews", reviewController.addDoctorReview);
router.post("/doctors", doctorController.addDoctor);

// ── Admin Routes ──
router.get("/admin/dashboard", adminController.getDashboardStats);
router.get("/admin/patients", adminController.getAllPatients);
router.get("/admin/doctors", adminController.getAllDoctorsAdmin);
router.patch(
  "/admin/users/:userId/status",
  adminController.setUserActiveStatus,
);
router.delete("/admin/users/:userId", adminController.deleteUser);
router.get(
  "/admin/analytics/doctors",
  adminController.getDoctorPatientAnalytics,
);
module.exports = {
  pool,
  router,
  controllers: {
    ...authController,
    ...profileController,
    ...doctorController,
    ...appointmentController,
    ...medicalController,
    ...paymentController,
    ...notificationController,
    ...reviewController,
    ...adminController,
  },
};
