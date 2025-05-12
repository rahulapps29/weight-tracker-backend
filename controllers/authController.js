const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Continue in authController.js
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In handler
exports.googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  console.log("🪪 Token received:", token); // <- log token
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        firstName: given_name,
        lastName: family_name,
        picture,
      });
    }

    const jwtToken = generateToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google token error:", error.message);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
});

// Generate JWT token with user info
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// Register with email/password
exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ email, password, firstName, lastName });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token: generateToken(user),
  });
});

// Login with email/password
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token: generateToken(user),
  });
});

// Get current user (for protected routes)
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    },
  });
});
