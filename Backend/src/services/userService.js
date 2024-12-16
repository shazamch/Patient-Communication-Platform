// services/userService.js
const User = require('../models/userModel');

// Create User
const createUser = async (userData) => {
  const user = new User(userData);
  const savedUser = await user.save();
  if (!savedUser) {
    throw new Error('User creation failed');
  }
  return savedUser;
};

// Get All Users
const getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    throw new Error('No users found');
  }
  return users;
};

// Get User by ID
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  return user;
};

// Update User
const updateUser = async (id, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedUser) {
    throw new Error(`User with ID ${id} not found for update`);
  }
  return updatedUser;
};

// Delete User
const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error(`User with ID ${id} not found for deletion`);
  }
  return deletedUser;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
