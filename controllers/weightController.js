const WeightEntry = require("../models/WeightEntry");
const asyncHandler = require("express-async-handler");

exports.addWeightEntry = asyncHandler(async (req, res) => {
  const { weight, notes, date } = req.body;

  const entry = await WeightEntry.create({
    userId: req.user.id,
    weight,
    notes,
    date, // ✅ Save the actual date sent from frontend
  });

  res.status(201).json(entry);
});

exports.getWeightEntries = asyncHandler(async (req, res) => {
  const entries = await WeightEntry.find({ userId: req.user.id }).sort("date");
  res.json(entries);
});

exports.getWeightEntry = asyncHandler(async (req, res) => {
  const entry = await WeightEntry.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  res.json(entry);
});

exports.updateWeightEntry = asyncHandler(async (req, res) => {
  const entry = await WeightEntry.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  res.json(entry);
});

exports.deleteWeightEntry = asyncHandler(async (req, res) => {
  const entry = await WeightEntry.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  res.json({ message: "Entry removed" });
});
