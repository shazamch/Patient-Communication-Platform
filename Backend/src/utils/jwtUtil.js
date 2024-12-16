const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (user) => {
  const role = user.role; 
  return jwt.sign(
    { id: user._id, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h' }
  );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.error("Refresh token verification failed:", err.message);
    throw new Error('Invalid refresh token');
  }
};

// Generate refresh token
const generateRefreshToken = (user) => {
  if (!user._id) {
    console.error("User ID is missing for generating refresh token.");
    throw new Error("User ID is required to generate refresh token.");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '30d' }
  );
};

module.exports = { generateAccessToken, verifyRefreshToken, generateRefreshToken };
