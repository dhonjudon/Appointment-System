const express = require("express");
const app = express();
const cors = require("cors");
const { router: apiRouter } = require("./db");
// middleware
app.use(cors());
app.use(express.json()); //to get json data from the request body

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
