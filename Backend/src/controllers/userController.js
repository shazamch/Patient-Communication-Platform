// controllers/userController.js
const userService = require('../services/userService');

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      return res.sendResponse(404, false, 'No users found');
    }
    res.sendResponse(200, true, 'Users fetched successfully', users, accessToken);
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const { accessToken } = req.user; // Get tokens from req.user
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.sendResponse(404, false, `User with ID ${req.params.id} not found`);
    }
    res.sendResponse(200, true, 'User fetched successfully', user, accessToken);
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { accessToken } = req.user; // Get tokens from req.user
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.sendResponse(404, false, `User with ID ${req.params.id} not found for update`);
    }
    res.sendResponse(200, true, 'User updated successfully', updatedUser, accessToken);
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { accessToken } = req.user; // Get tokens from req.user
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.sendResponse(404, false, `User with ID ${req.params.id} not found for deletion`);
    }
    res.sendResponse(200, true, 'User deleted successfully', deletedUser, accessToken);
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
