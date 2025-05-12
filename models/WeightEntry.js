const mongoose = require("mongoose");

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("WeightEntry", weightEntrySchema);
