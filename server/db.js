const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const router = express.Router();
router.use(cors());
router.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || "sasika",
  password: process.env.PGPASSWORD || "1903sasika400",
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

    // 1. Create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'doctor')
       RETURNING id`,
      [email, hashedPassword],
    );

    const userId = userResult.rows[0].id;

    // 2. Create profile
    await client.query(
      `INSERT INTO user_profiles (user_id, first_name, last_name)
       VALUES ($1, $2, $3)`,
      [userId, first_name, last_name],
    );

    // 3. Create doctor
    const doctorResult = await client.query(
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
					VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8)
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
    amount,
    currency,
    provider,
    provider_payment_id,
  }) => {
    const result = await pool.query(
      `
				INSERT INTO payments (
					appointment_id,
					user_id,
					amount,
					currency,
					provider,
					provider_payment_id,
					status
				)
				VALUES ($1, $2, $3, COALESCE($4, 'USD'), $5, $6, 'pending')
				RETURNING *
			`,
      [
        appointment_id,
        user_id,
        amount,
        currency || "USD",
        provider,
        provider_payment_id || null,
      ],
    );

    return result.rows[0];
  },

  verifyPayment: async ({ paymentId, status }) => {
    const allowed = ["paid", "failed", "refunded"];
    if (!allowed.includes(status)) {
      throw new Error("Invalid payment verification status");
    }

    const result = await pool.query(
      `
				UPDATE payments
				SET status = $2,
						paid_at = CASE WHEN $2 = 'paid' THEN NOW() ELSE paid_at END
				WHERE id = $1
				RETURNING *
			`,
      [paymentId, status],
    );

    return result.rows[0] || null;
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
      amount: Number(req.body.amount),
      currency: req.body.currency,
      provider: req.body.provider,
      provider_payment_id: req.body.provider_payment_id,
    };

    if (
      !payload.appointment_id ||
      !payload.user_id ||
      !payload.provider ||
      !Number.isFinite(payload.amount) ||
      payload.amount <= 0
    ) {
      return sendError(
        res,
        400,
        "appointment_id, user_id, provider and valid amount are required",
      );
    }

    const payment = await paymentService.createPayment(payload);
    sendSuccess(res, 201, "Payment created successfully", payment);
  }),

  verifyPayment: asyncHandler(async (req, res) => {
    const paymentId = normalizeNumericId(req.params.paymentId);
    const { status } = req.body;

    if (!paymentId || !status) {
      return sendError(res, 400, "Valid paymentId and status are required");
    }

    const payment = await paymentService.verifyPayment({ paymentId, status });
    if (!payment) {
      return sendError(res, 404, "Payment not found");
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
  },
};
