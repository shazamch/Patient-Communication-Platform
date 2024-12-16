const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Route to get all users
router.get('/getallusers', conversationController.getAllUsers);

// Route to get chat stack
router.get('/getchatstack/:userId', conversationController.chatstack);

// Route to find a conversation between two users
router.post('/getconversation', conversationController.findConversation);

module.exports = router;
