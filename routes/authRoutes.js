const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin); // ✅ Google login route
router.get("/me", protect, authController.getCurrentUser);

module.exports = router;
