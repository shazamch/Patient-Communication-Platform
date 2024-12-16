const conversationServices = require('../services/conversationServices');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user; // Get tokens from req.user
    const response = await conversationServices.getAllUsers(req.userid); // Call service to get users
    if (!response.success) {
      return res.sendResponse(400, false, 'No users found'); // Return 400 if no users found
    }
    res.sendResponse(200, true, 'Users fetched successfully', response.users, { accessToken, refreshToken });
  } catch (error) {
    res.sendResponse(500, false, error.message); // Handle errors
  }
};

// Get chat stack (conversations where user is a participant)
const chatstack = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;
    const response = await conversationServices.chatstack(req.params.userId);
    if (!response.success) {
      return res.sendResponse(400, false, 'No conversations found');
    }
    res.sendResponse(200, true, 'Chat stack fetched successfully', response.currentChatStack, { accessToken, refreshToken });
  } catch (error) {
    res.sendResponse(500, false, error.message); // Handle errors
  }
};

// Find a conversation between two users
const findConversation = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;
    const userId1 = req.body.userId1
    const userId2 = req.body.userId2

    const response = await conversationServices.findConversation(userId1, userId2);
    if (!response.success) {
      return res.sendResponse(404, false, 'Conversation not found');
    }

    res.sendResponse(200, true, 'Conversation fetched successfully', response.conversation, { accessToken, refreshToken });
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};

module.exports = {
  getAllUsers,
  chatstack,
  findConversation,
};
