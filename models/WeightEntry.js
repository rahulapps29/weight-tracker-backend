const mongoose = require("mongoose");

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ Faster querying for user history
    },
    weight: {
      type: Number,
      required: true,
      min: 0, // ✅ Prevents negative values
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("WeightEntry", weightEntrySchema);
