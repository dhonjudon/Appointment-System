// Main Express server entry point
// Sets up middleware, routes, and error handling for the appointment system API
const express = require("express");
const app = express();
const cors = require("cors");
const { router: apiRouter } = require("./db");

// Enable cross-origin requests for the React frontend
app.use(cors());
// Parse incoming request bodies as JSON
app.use(express.json()); // to get json data from the request body

// Health check route for basic API availability
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount all API routes (/api/auth, /api/doctors, /api/appointments, etc.)
app.use("/api", apiRouter);

// Global error handler: catches any errors thrown by route handlers
// Returns structured error response with appropriate status code
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = Number(err?.statusCode) || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    // Only show detailed errors in development
    error:
      process.env.NODE_ENV !== "production" && statusCode === 500
        ? err.message
        : undefined,
  });
});

// Start server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
  