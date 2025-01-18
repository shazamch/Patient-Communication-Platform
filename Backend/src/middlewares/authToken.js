const jwt = require('jsonwebtoken');
const { generateAccessToken, verifyRefreshToken } = require('../utils/jwtUtil');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  
  if (!accessToken) {
    return res.sendResponse(401, false, "Access token missing");
  }

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    return res.sendResponse(500, false, "Server configuration error");
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      // Handle access token expiration
      if (err.name === "TokenExpiredError") {
        console.log("Access Token Expired.")
        console.log("Fetching Refresh Token to Generate new Access Token")
        try {
          // Decode the expired access token to extract the user ID
          const decodedAccess = jwt.decode(accessToken);
          if (!decodedAccess || !decodedAccess.id) {
            return res.sendResponse(401, false, "Invalid access token payload");
          }

          // Fetch the user's refresh token from the database
          const existingUser = await User.findById(decodedAccess.id);
          if (!existingUser) {
            return res.sendResponse(401, false, "User not found");
          }

          const storedRefreshToken = existingUser.refreshToken;
          if (!storedRefreshToken) {
            return res.sendResponse(401, false, "Refresh token not found");
          }

          // Verify the refresh token
          try {
            const decodedRefresh = verifyRefreshToken(storedRefreshToken);

            // Generate a new access token
            const newAccessToken = generateAccessToken({
              _id: decodedRefresh.id,
              role: decodedRefresh.role,
            });

            req.user = {
              id: decodedRefresh.id,
              role: decodedRefresh.role,
              accessToken: newAccessToken
            };

            res.setHeader('authorization', `Bearer ${newAccessToken}`);
            return next();
          } catch (refreshErr) {
            return res.sendResponse(403, false, "Refresh token expired or invalid");
          }
        } catch (err) {
          return res.sendResponse(403, false, "Failed to verify refresh token");
        }
      }

      // If the error is not due to expiration, handle it as a generic verification failure
      return res.sendResponse(403, false, "Access token verification failed");
    }

    // Check if the user exists in the database
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return res.sendResponse(401, false, "User not found");
    }

    req.user = {
      id: user.id,
      role: user.role,
      accessToken,
    };

    next();
  });
};

module.exports = authenticateToken;
