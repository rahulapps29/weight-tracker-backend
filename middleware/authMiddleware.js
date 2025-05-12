const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User not found with this token");
      }

      return next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      res.status(401);
      throw new Error("Not authorized, token invalid");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }
});

module.exports = { protect };
