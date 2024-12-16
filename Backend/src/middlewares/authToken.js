const jwt = require('jsonwebtoken');
const { generateAccessToken, verifyRefreshToken } = require('../utils/jwtUtil');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const refreshHeader = req.headers['refresh-token'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  const refreshToken = refreshHeader && refreshHeader.split(' ')[1];

  if (!accessToken) {
    return res.sendResponse(401, false, "Access token missing");
  }

  if (!refreshToken) {
    return res.sendResponse(401, false, "Refresh token missing");
  }

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    return res.sendResponse(500, false, "Server configuration error");
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        try {
          const decodedRefresh = verifyRefreshToken(refreshToken);

          const existingUser = await User.findById(decodedRefresh.id);
          if (!existingUser) {
            return res.sendResponse(401, false, "User not found");
          }

          const newAccessToken = generateAccessToken({ _id: decodedRefresh.id, role: decodedRefresh.role });

          req.user = {
            id: decodedRefresh.id,
            role: decodedRefresh.role,
            accessToken: newAccessToken,
            refreshToken,
          };

          res.setHeader('authorization', `Bearer ${newAccessToken}`);

          return next();
        } catch (refreshErr) {
          return res.sendResponse(403, false, "Invalid refresh token");
        }
      }

      return res.sendResponse(403, false, "Access token verification failed");
    }

    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return res.sendResponse(401, false, "User not found");
    }

    req.user = {
      id: user.id,
      role: user.role,
      accessToken,
      refreshToken,
    };

    next();
  });
};

module.exports = authenticateToken;
