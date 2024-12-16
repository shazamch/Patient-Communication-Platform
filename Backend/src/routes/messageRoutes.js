const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Set the Socket.IO instance
router.use((req, res, next) => {
    messageController.setSocketIO(req.app.get('io')); 
    next();
});

// Route to send a message, requiring authorization
router.post('/send', messageController.sendMessage);

// Route to receive a message, requiring authorization
router.get('/:id', messageController.receiveMessage);

module.exports = router;
