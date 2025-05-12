const express = require("express");
const router = express.Router();
const weightController = require("../controllers/weightController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// POST /api/weights
router.post("/", weightController.addWeightEntry);

// GET /api/weights
router.get("/", weightController.getWeightEntries);

// GET /api/weights/:id
router.get("/:id", weightController.getWeightEntry);

// PUT /api/weights/:id
router.put("/:id", weightController.updateWeightEntry);

// DELETE /api/weights/:id
router.delete("/:id", weightController.deleteWeightEntry);

module.exports = router;
