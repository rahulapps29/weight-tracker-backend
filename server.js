require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const weightRoutes = require("./routes/weightRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/weights", weightRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Start server
const PORT = process.env.PORT || 3996;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
