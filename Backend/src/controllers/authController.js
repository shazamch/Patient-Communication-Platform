const authService = require('../services/authService');

// Sign Up
const signUp = async (req, res) => {
    try {
      const user = await authService.createUser(req.body);
      if (!user) {
        return res.sendResponse(500, false, 'User creation failed');
      }
      const { tokens, ...userData } = user;

        res.sendResponse(201, true, 'User created successfully', userData, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, });
  } catch (error) {
    res.sendResponse(500, false, error.message || 'User creation failed');
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, userData } = await authService.loginUser(email, password);
    res.sendResponse(200, true, 'Login successful', userData, { accessToken, refreshToken });
  } catch (error) {
    res.sendResponse(400, false, error.message || 'Login failed');
  }
};

module.exports = {
  signUp,
  login,
};
