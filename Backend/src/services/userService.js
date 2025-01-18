// services/userService.js
const User = require('../models/userModel');

// Get All Users
const getAllUsers = async () => {
  const users = await User.find({}, '_id username name email address phone profilephoto role status createdAt updatedAt');
  if (!users || users.length === 0) {
    throw new Error('No users found');
  }
  return users;
};


// Get User by ID
const getUserById = async (id) => {
  const user = await User.findById(id, '_id username name email address phone profilephoto role status createdAt updatedAt');
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
